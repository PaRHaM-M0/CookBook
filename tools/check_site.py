#!/usr/bin/env python3
"""Check local HTML assets, offline precache entries and manifest icons."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re

ROOT = Path(__file__).resolve().parent.parent

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
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
    parser.feed(page.read_text(encoding='utf-8'))
    for url in parser.urls:
        parts = urlsplit(url)
        if parts.scheme or parts.netloc or not parts.path or parts.path.startswith('/') or '{' in parts.path:
            continue
        target = (page.parent / unquote(parts.path)).resolve()
        if not target.exists():
            errors.append(f'{page.relative_to(ROOT)}: missing {url}')

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
