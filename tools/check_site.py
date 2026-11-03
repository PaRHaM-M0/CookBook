#!/usr/bin/env python3
"""Check local HTML assets, offline precache entries and manifest icons."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import subprocess
import sys
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.ids = []
        self.html_attrs = None
        self.invalid_dirs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'html':
            self.html_attrs = values
        if 'id' in values:
            self.ids.append(values['id'])
        if 'dir' in values and values['dir'] not in ('ltr', 'rtl', 'auto'):
            self.invalid_dirs.append(values['dir'])
        for key, value in attrs:
            if value and key in ('href', 'src'):
                self.urls.append(value)
            elif value and key == 'srcset':
                self.urls.extend(item.strip().split()[0] for item in value.split(',') if item.strip())

errors = []
pages = [ROOT / 'index.html', ROOT / 'en/index.html']
pages += sorted((ROOT / 'recipes').glob('*.html'))
pages += sorted((ROOT / 'en/recipes').glob('*.html'))
for page in pages:
    parser = Links()
    text = page.read_text(encoding='utf-8')
    parser.feed(text)
    rel = page.relative_to(ROOT)
    lang = 'en' if rel.parts[0] == 'en' else 'fa'
    expected_dir = 'ltr' if lang == 'en' else 'rtl'
    if not parser.html_attrs or parser.html_attrs.get('lang') != lang or parser.html_attrs.get('dir') != expected_dir:
        errors.append(f'{rel}: expected lang={lang} dir={expected_dir}')
    for value in parser.invalid_dirs:
        errors.append(f'{rel}: invalid dir={value}')
    for ident, count in Counter(parser.ids).items():
        if count > 1:
            errors.append(f'{rel}: duplicate id {ident}')
    # Explicit embedding/override controls can reorder unrelated text. Isolate
    # elements with dir instead; this is a limited static bidi check, not a visual audit.
    if any(char in text for char in '\u202a\u202b\u202c\u202d\u202e'):
        errors.append(f'{rel}: contains bidi embedding/override controls')
    for url in parser.urls:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc or not parts.path or parts.path.startswith('/') or '{' in parts.path:
            continue
        target = (page.parent / unquote(parts.path)).resolve()
        if not target.exists():
            errors.append(f'{page.relative_to(ROOT)}: missing {url}')

fa_recipes = {p.name for p in (ROOT / 'recipes').glob('*.html')}
en_recipes = {p.name for p in (ROOT / 'en/recipes').glob('*.html')}
for name in sorted(fa_recipes ^ en_recipes):
    errors.append(f'missing FA/EN recipe counterpart: {name}')

result = subprocess.run([sys.executable, str(ROOT / 'tools/build-ingredient-index.py'), '--check'], capture_output=True, text=True)
if result.returncode:
    errors.append(result.stderr.strip() or result.stdout.strip())

for script in sorted((ROOT / 'assets').glob('*.js')) + [ROOT / 'sw.js']:
    result = subprocess.run(['node', '--check', str(script)], capture_output=True, text=True)
    if result.returncode:
        errors.append(f'{script.relative_to(ROOT)}: JavaScript syntax error\n{result.stderr}')

# Check metadata against the actual bilingual pages and generated index.
js = "const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('assets/recipes.js','utf8')+fs.readFileSync('assets/ingredients.js','utf8');console.log(vm.runInNewContext(s+'\\nJSON.stringify({recipes:RECIPES.map(r=>({page:r.page,image:r.image})), ingredients:Object.keys(INGREDIENT_SEARCH)})'));"
result = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True)
if result.returncode:
    errors.append('Could not inspect recipe metadata: ' + result.stderr)
else:
    data = json.loads(result.stdout)
    for recipe in data['recipes']:
        path = recipe.get('page', '')
        if not (ROOT / path).is_file() or not (ROOT / 'en' / path).is_file():
            errors.append(f'recipe metadata has missing bilingual page: {path}')
        if path not in data['ingredients']:
            errors.append(f'ingredient index missing: {path}')
        if recipe.get('image') and not (ROOT / recipe['image']).is_file():
            errors.append(f'recipe metadata has missing image: {recipe["image"]}')

sw = (ROOT / 'sw.js').read_text(encoding='utf-8')
cached = set(re.findall(r'"(\./[^"?#]+)"', sw))
for url in sorted(cached):
    if url != './' and not (ROOT / url).exists():
        errors.append(f'sw.js: missing {url}')
for page in pages:
    if page.name != '_template.html' and './' + page.relative_to(ROOT).as_posix() not in cached:
        errors.append(f'sw.js: page not cached: {page.relative_to(ROOT)}')
manifest = json.loads((ROOT / 'manifest.json').read_text(encoding='utf-8'))
for icon in manifest['icons']:
    if not (ROOT / icon['src']).is_file():
        errors.append(f'manifest.json: missing {icon["src"]}')
    if icon['src'] not in cached:
        errors.append(f'sw.js: icon not cached: {icon["src"]}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(pages)} pages, {len(cached)} cache URLs, {len(manifest["icons"])} manifest icons')
