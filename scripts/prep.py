"""Buduje src/series.js z danych Our World in Data.

Wymaga:
  data/owid-co2-data.csv  – https://github.com/owid/co2-data (kolumny gdp i population; PKB = Maddison Project Database 2023)
  data/owid-datasets/     – https://github.com/owid/owid-datasets (katalogi:
      "Life expectancy (Gapminder, UN, IHME)" oraz "Child Mortality Rates (Selected Gapminder, v10) (2017)")
Uruchom z katalogu repozytorium: python3 scripts/prep.py
"""
import csv, json, sys
co2 = sys.argv[1] if len(sys.argv) > 1 else 'data/owid-co2-data.csv'
owid = sys.argv[2] if len(sys.argv) > 2 else 'data/owid-datasets/datasets/'
BENCH = {'DE': 'Germany', 'CZ': 'Czechia', 'ES': 'Spain', 'UA': 'Ukraine', 'HU': 'Hungary', 'GB': 'United Kingdom'}
want = set(BENCH.values()) | {'Poland'}
rows = {}
with open(co2) as f:
    for d in csv.DictReader(f):
        if d['country'] in want and d['gdp'] and d['population']:
            rows.setdefault(d['country'], {})[int(d['year'])] = float(d['gdp']) / float(d['population'])
le, u5 = {}, {}
with open(owid + 'Life expectancy (Gapminder, UN, IHME)/Life expectancy (Gapminder, UN, IHME).csv') as f:
    for d in csv.DictReader(f):
        if d['Entity'] == 'Poland': le[int(d['Year'])] = float(d['Life expectancy - interpolated (Gapminder, UN, IHME)'])
with open(owid + 'Child Mortality Rates (Selected Gapminder, v10) (2017)/Child Mortality Rates (Selected Gapminder, v10) (2017).csv') as f:
    for d in csv.DictReader(f):
        if d['Entity'] == 'Poland': u5[int(d['Year'])] = float(d['Child mortality (Select Gapminder, v10) (2017)'])
pick = lambda s: {y: round(v) for y, v in sorted(s.items()) if 1870 <= y <= 2022}
out = {'gdpPL': pick(rows['Poland']),
       'bench': {k: pick(rows[c]) for k, c in BENCH.items()},
       'e0': {y: round(v, 1) for y, v in sorted(le.items()) if 1895 <= y <= 2030},
       'u5': {y: round(v, 1) for y, v in sorted(u5.items()) if y >= 1915}}
with open('src/series.js', 'w') as f:
    f.write('/* Szeregi: PKB na osobę (Maddison 2023, $ 2011; Polska i kraje odniesienia), trwanie życia i umieralność dzieci do 5 lat (Gapminder). Generowane przez scripts/prep.py */\n')
    f.write('const SERIES = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('ok', {k: len(v) for k, v in out['bench'].items()})
