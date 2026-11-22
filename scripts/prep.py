"""Buduje src/series.json z danych Our World in Data.

Wymaga:
  data/owid-co2-data.csv  – https://github.com/owid/co2-data (kolumny gdp i population; PKB = Maddison Project Database 2023)
  data/owid-datasets/     – https://github.com/owid/owid-datasets (katalogi:
      "Life expectancy (Gapminder, UN, IHME)" oraz "Child Mortality Rates (Selected Gapminder, v10) (2017)")
Uruchom z katalogu repozytorium: python3 scripts/prep.py
"""
import csv, json, math
rows={}
with open('data/owid-co2-data.csv') as f:
    for d in csv.DictReader(f):
        if d['country'] in ('Poland','Germany') and d['gdp'] and d['population']:
            rows.setdefault(d['country'],{})[int(d['year'])]=float(d['gdp'])/float(d['population'])
pl,de=rows['Poland'],rows['Germany']
print('DE years', min(de),max(de), [y for y in range(1900,1951) if y not in de])
print('PL missing', [y for y in range(1900,2023) if y not in pl])
le={}
with open('data/owid-datasets/datasets/Life expectancy (Gapminder, UN, IHME)/Life expectancy (Gapminder, UN, IHME).csv') as f:
    for d in csv.DictReader(f):
        if d['Entity']=='Poland': le[int(d['Year'])]=float(d['Life expectancy - interpolated (Gapminder, UN, IHME)'])
u5={}
with open('data/owid-datasets/datasets/Child Mortality Rates (Selected Gapminder, v10) (2017)/Child Mortality Rates (Selected Gapminder, v10) (2017).csv') as f:
    for d in csv.DictReader(f):
        if d['Entity']=='Poland': u5[int(d['Year'])]=float(d['Child mortality (Select Gapminder, v10) (2017)'])
print('LE range',min(le),max(le), le[1900], le[1939],le[1944],le[1946], le[2015], max(le))
print('U5 range',min(u5),max(u5))
out={'gdpPL':{y:round(pl[y]) for y in sorted(pl) if 1870<=y<=2022},
     'gdpDE':{y:round(de[y]) for y in sorted(de) if 1870<=y<=2022},
     'e0':{y:round(le[y],1) for y in sorted(le) if 1895<=y<=2030},
     'u5':{y:round(u5[y],1) for y in sorted(u5) if y>=1915}}
open('src/series.js','w').write('const SERIES = '+json.dumps(out)+';\n')
for y in (1913,1929,1938,1950,1970,1978,1989,2004,2022):
    print(y, round(pl.get(y,0)), round(de.get(y,0)), round(pl.get(y,0)/de[y]*100,1) if y in de and y in pl else None)
