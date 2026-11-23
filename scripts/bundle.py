"""Składa index.html i src/*.js w jeden samodzielny plik (np. do wgrania jako pojedynczy artefakt).
Użycie: python3 scripts/bundle.py [plik_wyjściowy]"""
import re, sys
from pathlib import Path
root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
def inline(m):
    return '<script>\n' + (root / m.group(1)).read_text(encoding='utf-8') + '\n</script>'
out = re.sub(r'<script src="(src/[a-z]+\.js)"></script>', inline, html)
dest = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'los-rocznika.html'
dest.write_text(out, encoding='utf-8')
print(f'{dest}: {len(out):,} znaków')
