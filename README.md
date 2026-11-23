# Los rocznika

**https://pokolenia.roszakrafal.pl**

Interaktywna aplikacja, która pokazuje, jakie szanse awansu społecznego i rozwoju osobistego miał ktoś urodzony w Polsce w latach 1900–2010, w zależności od roku, regionu, typu miejscowości i płci.

Formularz ma cztery pola: rok urodzenia, region, miejscowość i płeć. Wagi indeksu są schowane pod wynikiem („Zmień wagi, jeśli inaczej definiujesz awans”). Po przewinięciu u góry zostaje pasek z profilem, wynikiem i przyciskami ±1 rok.

Wybierasz profil, a aplikacja pokazuje:

- **indeks szans (0–100)** i jego siedem składowych,
- **oś życia**: na jakie epoki przypadły dzieciństwo, nauka, start w dorosłość i kariera,
- **PKB na osobę** Polski na tle Niemiec od 1900 r., z zaznaczonymi latami życia,
- **mapę szans** dla wszystkich regionów i dekad urodzenia,
- **porównanie**, które na start pokazuje pokolenie rodziców (−25 lat) i dziadków (−50 lat); jednym kliknięciem także duże miasto lub wieś, inny region, druga płeć, pokolenie dzieci,
- na końcu **kartę wyniku PNG** i link do konkretnego profilu.

Link z adresem w postaci `#p-1950-lub-wies-m` otwiera konkretny profil.

## Model

Indeks to średnia ważona siedmiu składowych (każda 0–100):

| Składowa | Co mierzy |
|---|---|
| Edukacja | szansa na dyplom uczelni (70%) i umiejętność czytania (30%) |
| Awans strukturalny | spadek udziału pracujących w rolnictwie w wieku 15–40 lat i wzrost odsetka dyplomów względem pokolenia rodziców |
| Gospodarka i praca | średni wzrost PKB na osobę w wieku 18–45 lat minus kara za bezrobocie rejestrowane powyżej 6% w wieku 18–26 lat (od 1990 r.) |
| Dobrobyt | średni poziom PKB na osobę w wieku 20–60 lat (skala logarytmiczna), od 1990 r. z mnożnikiem województwa |
| Bezpieczeństwo | lata wojen, okupacji i terroru, ważone wiekiem i natężeniem w regionie |
| Zdrowie na starcie | przeciętne trwanie życia noworodka w roku urodzenia |
| Swoboda wyboru | uproszczona ocena okresów ustrojowych w wieku 15–45 lat |

Wagi zależą od wybranego zestawu („Zrównoważone”, „Edukacja i kariera”, „Dobrobyt i bezpieczeństwo”, „Wolność wyboru drogi”).

**To model, a nie pomiar losu konkretnej osoby.** Mnożniki dla typu miejscowości, płci i natężenia wojen oraz skala swobody wyboru są założeniami opartymi na historiografii. Edukacja mierzy dostępność dyplomu, nie jego wartość na rynku pracy. PKB w latach 2023–2025 to dynamika GUS, a od 2026 r. prognoza (2,5% rocznie do 2035 r., potem 1,5%). Model nie uwzględnia pochodzenia rodziny, narodowości ani wyznania. Szczegóły są w sekcji „Jak to jest policzone” na stronie.

## Dane

- PKB na osobę (Polska, Niemcy, Czechy, Hiszpania, Ukraina, Węgry, Wielka Brytania): Maddison Project Database 2023, przez [Our World in Data](https://github.com/owid/co2-data); dynamika 2023–2025: GUS
- PKB na mieszkańca według województw (2022): GUS, rachunki regionalne
- Bezrobocie rejestrowane 1990–2026 i emigracja czasowa 2004–2017: GUS
- Trwanie życia i umieralność dzieci: Gapminder, przez [owid-datasets](https://github.com/owid/owid-datasets); GUS, Trwanie życia w 2024 r.
- Wykształcenie: GUS, Narodowy Spis Powszechny 2021; GUS, raport SDG (na podstawie Eurostatu, edat_lfse_03)
- Analfabetyzm 1921 i 1931: GUS, Mały Rocznik Statystyczny 1939, tabl. 23 i 24
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
scripts/bundle.py      składa stronę w jeden plik HTML
CNAME                  domena dla GitHub Pages
```

Strona nie wymaga budowania ani bibliotek: GitHub Pages serwuje pliki tak, jak są. Z zewnątrz ładują się tylko czcionki Google Fonts.

```bash
node scripts/test_model.js    # tabela wyników modelu dla przykładowych profili
python3 -m http.server        # podgląd lokalny: http://localhost:8000
```
