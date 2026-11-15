#!/usr/bin/env python3
"""Guard grouped ingredient alternatives and their stable checklist keys."""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class Rows(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_table = self.in_row = False
        self.rows = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'table' and 'ing' in attrs.get('class', '').split():
            self.in_table = True
        if self.in_table and tag == 'tr':
            self.in_row = True
            self.rows.append({'class': attrs.get('class', '').split(), 'key': attrs.get('data-check-key'), 'text': ''})
    def handle_data(self, text):
        if self.in_row:
            self.rows[-1]['text'] += text
    def handle_endtag(self, tag):
        if tag == 'tr': self.in_row = False
        if tag == 'table': self.in_table = False

for name in ('homemade-mozzarella', 'neapolitan-pizza', 'poolish-pizza-dough',
             'herb-compound-butter', 'classic-caesar-salad', 'grand-unified-burger', 'detroit-style-pizza'):
    versions = []
    for folder in ('recipes', 'en/recipes'):
        parser = Rows()
        parser.feed((ROOT / folder / (name + '.html')).read_text(encoding='utf-8'))
        rows = [r for r in parser.rows if 'choice-heading' not in r['class']]
        keys = [r['key'] or str(i) for i, r in enumerate(rows)]
        assert len(keys) == len(set(keys)), (name, folder, keys)
        assert any('choice-heading' in r['class'] for r in parser.rows), (name, folder)
        versions.append(keys)
        if name == 'homemade-mozzarella':
            assert [r['key'] for r in rows[18:21]] == ['18', '23', '24']
            assert 'C201' in rows[18]['text'] and 'Thermo B' in rows[20]['text']
            assert all('milk-part' in rows[i]['class'] for i in (14, 15))
    assert versions[0] == versions[1], (name, 'language checklist keys differ')
print('Ingredient choice structure and checklist keys passed')
