# Los rocznika

**https://pokolenia.roszakrafal.pl**

Interaktywna aplikacja, która pokazuje, jakie szanse awansu społecznego i rozwoju osobistego miał ktoś urodzony w Polsce w latach 1900–2010, w zależności od roku, regionu, typu miejscowości i płci.

Wybierasz profil, a aplikacja pokazuje:

- **indeks szans (0–100)** i jego siedem składowych,
- **oś życia**: na jakie epoki przypadły dzieciństwo, nauka, start w dorosłość i kariera,
- **PKB na osobę** Polski na tle Niemiec od 1900 r., z zaznaczonymi latami życia,
- **mapę szans** dla wszystkich regionów i dekad urodzenia,
- **porównanie** do trzech profili.

Link z adresem w postaci `#p-1950-lub-wies-m` otwiera konkretny profil.

## Model

Indeks to średnia ważona siedmiu składowych (każda 0–100):

| Składowa | Co mierzy |
|---|---|
| Edukacja | szansa na dyplom uczelni (70%) i umiejętność czytania (30%) |
| Awans strukturalny | spadek udziału pracujących w rolnictwie w wieku 15–40 lat i wzrost odsetka dyplomów względem pokolenia rodziców |
| Dynamika gospodarki | średni wzrost PKB na osobę w wieku 18–45 lat |
| Dobrobyt | średni poziom PKB na osobę w wieku 20–60 lat (skala logarytmiczna) |
| Bezpieczeństwo | lata wojen, okupacji i terroru, ważone wiekiem i natężeniem w regionie |
| Zdrowie na starcie | przeciętne trwanie życia noworodka w roku urodzenia |
| Swoboda wyboru | uproszczona ocena okresów ustrojowych w wieku 15–45 lat |

Wagi zależą od wybranego zestawu („Zrównoważone”, „Edukacja i kariera”, „Dobrobyt i bezpieczeństwo”, „Wolność wyboru drogi”).

**To model, a nie pomiar losu konkretnej osoby.** Mnożniki dla typu miejscowości, płci i natężenia wojen oraz skala swobody wyboru są założeniami opartymi na historiografii. PKB po 2022 r. to prognoza (2,5% rocznie do 2035 r., potem 1,5%). Model nie uwzględnia pochodzenia rodziny, narodowości ani wyznania. Szczegóły są w sekcji „Jak to jest policzone” na stronie.

## Dane

- PKB na osobę: Maddison Project Database 2023, przez [Our World in Data](https://github.com/owid/co2-data)
- Trwanie życia i umieralność dzieci: Gapminder, przez [owid-datasets](https://github.com/owid/owid-datasets); GUS
- Wykształcenie: GUS, Narodowy Spis Powszechny 2021; Eurostat
- Analfabetyzm: spisy powszechne z 1921 i 1931 r.
- Struktura zatrudnienia: spisy 1921–1995 (oprac. A. Szuman, UAM), GUS
- Straty II wojny światowej: IPN

Pełna lista źródeł z linkami jest na stronie.

## Struktura repozytorium

```
index.html             strona: układ, style, opis metodologii i źródeł
src/series.js          szeregi PKB, trwania życia i umieralności dzieci
src/model.js           dane regionów i obliczenia indeksu (bez DOM)
src/app.js             interfejs, wykresy, narracja
scripts/prep.py        buduje src/series.js z danych OWID
scripts/test_model.js  szybki test modelu w Node
CNAME                  domena dla GitHub Pages
```

Strona nie wymaga budowania ani bibliotek: GitHub Pages serwuje pliki tak, jak są. Z zewnątrz ładują się tylko czcionki Google Fonts.

```bash
node scripts/test_model.js    # tabela wyników modelu dla przykładowych profili
python3 -m http.server        # podgląd lokalny: http://localhost:8000
```
