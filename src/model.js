/* ===== Model szans – dane i obliczenia (bez DOM) ===== */
/* SERIES (src/series.js): gdpPL i bench (Maddison 2023, $ 2011 PPP/os.), e0 i u5 (Gapminder) */

const NOW = 2026;
const BY_MIN = 1900, BY_MAX = 2010;

const clamp = (x, a = 0, b = 100) => Math.max(a, Math.min(b, x));
function interp(anchors, x) {
  if (x <= anchors[0][0]) return anchors[0][1];
  for (let i = 1; i < anchors.length; i++) {
    if (x <= anchors[i][0]) {
      const [x0, y0] = anchors[i - 1], [x1, y1] = anchors[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
  }
  return anchors[anchors.length - 1][1];
}

/* ---------- PKB na osobę ---------- */
const MADDISON_LAST = 2022;
/* 2023–2025: realna dynamika PKB wg GUS (0,2%, 3,0%, 3,8% po korekcie), użyta jako przybliżenie dynamiki PKB na osobę */
const GUS_GROWTH = { 2023: 0.002, 2024: 0.030, 2025: 0.038 };
const GDP_LAST = 2025;          // ostatni rok z danymi; od 2026 prognoza
const PROJ_A = 0.025, PROJ_B = 0.015, PROJ_SWITCH = 2035;
const plYears = Object.keys(SERIES.gdpPL).map(Number).sort((a, b) => a - b);
function gdpKnown(y) { return SERIES.gdpPL[y] !== undefined || (y > MADDISON_LAST && y <= GDP_LAST); }
const GDP_OBS = (() => { const o = {}; let v = SERIES.gdpPL[MADDISON_LAST]; for (let y = MADDISON_LAST + 1; y <= GDP_LAST; y++) { v *= 1 + GUS_GROWTH[y]; o[y] = v; } return o; })();
function gdp(y) {
  if (y > GDP_LAST) {
    const a = Math.min(y, PROJ_SWITCH) - GDP_LAST, b = Math.max(0, y - PROJ_SWITCH);
    return GDP_OBS[GDP_LAST] * Math.pow(1 + PROJ_A, a) * Math.pow(1 + PROJ_B, b);
  }
  if (y > MADDISON_LAST) return GDP_OBS[y];
  if (SERIES.gdpPL[y] !== undefined) return SERIES.gdpPL[y];
  let lo = plYears[0], hi = plYears[plYears.length - 1];
  for (const k of plYears) { if (k < y) lo = k; if (k > y) { hi = k; break; } }
  const t = (y - lo) / (hi - lo);
  return Math.exp(Math.log(SERIES.gdpPL[lo]) * (1 - t) + Math.log(SERIES.gdpPL[hi]) * t);
}
const BENCH = {
  DE: { name: 'Niemcy', gen: 'Niemiec' }, CZ: { name: 'Czechy', gen: 'Czech' }, ES: { name: 'Hiszpania', gen: 'Hiszpanii' },
  UA: { name: 'Ukraina', gen: 'Ukrainy' }, HU: { name: 'Węgry', gen: 'Węgier' }, GB: { name: 'Wielka Brytania', gen: 'Wielkiej Brytanii' }
};
function gdpBench(code, y) { return SERIES.bench[code][y]; }
function growth(y0, y1) { return (Math.log(gdp(y1)) - Math.log(gdp(y0))) / (y1 - y0) * 100; }

/* ---------- PKB na osobę według województw (GUS, 2022, Polska=100) ---------- */
/* Mazowsze: duże miasto = region warszawski stołeczny, reszta = mazowiecki regionalny. Pomorze i Kujawy: średnia pomorskiego i kujawsko-pomorskiego. */
const REG_GDP22 = { maz: { duze: 204.8, other: 92.3 }, lod: 94.6, kie: 70.0, lub: 67.6, pdl: 73.4, wlk: 105.6, pom: 90.7, sla: 105.0, mlp: 88.4, pkr: 67.9, dls: 111.8, zpm: 81.8, wmz: 69.0 };
const REG_GDP_EXP = 0.6;  // dochody gospodarstw różnią się mniej niż PKB liczony w miejscu pracy
function regGdpIndex(regId, set) { const v = REG_GDP22[regId]; return typeof v === 'object' ? (set === 'duze' ? v.duze : v.other) : v; }
function regGdpMult(regId, set, y) {
  if (y < 1990) return 1;
  const r = regionAt(regId, y);
  const w = Math.min(1, (y - 1990) / 5);
  return Math.pow(regGdpIndex(r.id, set) / 100, REG_GDP_EXP * w);
}

/* ---------- Bezrobocie rejestrowane, grudzień (GUS) ---------- */
const UNEMP = { 1990: 6.5, 1991: 12.2, 1992: 14.3, 1993: 16.4, 1994: 16.0, 1995: 14.9, 1996: 13.2, 1997: 10.3, 1998: 10.4, 1999: 13.1, 2000: 15.1, 2001: 17.5, 2002: 20.0, 2003: 20.0, 2004: 19.0, 2005: 17.6, 2006: 14.8, 2007: 11.2, 2008: 9.5, 2009: 12.1, 2010: 12.4, 2011: 12.5, 2012: 13.4, 2013: 13.4, 2014: 11.4, 2015: 9.7, 2016: 8.2, 2017: 6.6, 2018: 5.8, 2019: 5.2, 2020: 6.8, 2021: 5.8, 2022: 5.2, 2023: 5.1, 2024: 5.1, 2025: 5.7, 2026: 5.8 };
function unemp(y) { if (y < 1990) return null; return UNEMP[y] ?? 5.5; }
function unempAvg(y0, y1) { const v = []; for (let y = y0; y <= y1; y++) { const u = unemp(y); if (u != null) v.push(u); } return v.length ? { avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length } : null; }

/* ---------- Zdrowie ---------- */
function e0Raw(y) { return SERIES.e0[Math.min(y, 2016)]; }
function e0Both(y) { // lata wojny wygładzone (śmiertelność wojenna liczona w składowej Bezpieczeństwo)
  if (y >= 1939 && y <= 1945) { const a = e0Raw(1938), b = e0Raw(1946); return a + (b - a) * (y - 1938) / 8; }
  return e0Raw(y);
}
const GAP = [[1900, 3.0], [1931, 3.2], [1950, 5.6], [1960, 5.7], [1970, 6.7], [1980, 8.4], [1990, 9.0], [2010, 8.5], [2024, 7.3]];
function e0(y, sex) { const g = interp(GAP, y); return e0Both(y) + (sex === 'k' ? g / 2 : -g / 2); }
function u5(y) { if (y < 1915) return null; return SERIES.u5[Math.min(y, 2016)]; }

/* ---------- Struktura zatrudnienia: % pracujących w rolnictwie ---------- */
const AGRI = [[1900, 80], [1921, 77.1], [1931, 70.3], [1950, 57.2], [1960, 48.0], [1970, 38.6], [1978, 30.2], [1988, 27.8], [1995, 27.7], [2000, 18.8], [2006, 15.0], [2019, 8.7], [2023, 7.6], [2035, 5.5], [2050, 4.0], [2100, 3.0]];
const agri = y => interp(AGRI, y);

/* ---------- Wykształcenie wyższe: odsetek rocznika (kalibracja do NSP 2021, Eurostat, GUS) ---------- */
const TERT = [[1880, 1.0], [1900, 1.5], [1910, 2.5], [1920, 4], [1930, 6], [1940, 8.5], [1950, 11], [1955, 12], [1960, 14], [1965, 18], [1970, 25], [1975, 32], [1980, 38], [1985, 42], [1990, 45], [1995, 46], [2000, 47], [2010, 47]];
const tertNat = by => interp(TERT, by) / 100;
/* stosunek szans kobiet do mężczyzn; dla roczników 1990–1999: 55% vs 37% (GUS, raport SDG, 25–34 lata w 2024 r.) */
const FEM = [[1900, 0.30], [1910, 0.35], [1920, 0.5], [1930, 0.7], [1940, 0.85], [1950, 1.05], [1960, 1.25], [1970, 1.45], [1985, 1.5], [2010, 1.49]];
const SETTLE_T = {
  wies: [[1900, 0.40], [1950, 0.55], [1990, 0.75], [2010, 0.80]],
  male: [[1900, 1.30], [1950, 1.15], [1990, 0.95], [2010, 0.95]],
  duze: [[1900, 3.70], [1950, 2.20], [1990, 1.35], [2010, 1.30]]
};
const SETTLE = {
  wies: { name: 'wieś', loc: 'na wsi', illit: 1.25, agriW: 1.15, ww2: 0.95 },
  male: { name: 'małe miasto', loc: 'w małym mieście', illit: 0.7, agriW: 1.0, ww2: 1.0 },
  duze: { name: 'duże miasto', loc: 'w dużym mieście', illit: 0.4, agriW: 0.75, ww2: 1.15 }
};

/* ---------- Regiony ---------- */
/* illit31: analfabeci w wieku 10+ w 1931 r., % (Mały Rocznik Statystyczny 1939, tabl. 24):
   all = ogółem, town/rural = [mężczyźni, kobiety] w miastach i na wsi; big = [M, K] dla dużego miasta (Warszawa; gdzie indziej miasta × 0,8).
   Kresy: średnia województw wileńskiego, nowogródzkiego, poleskiego, wołyńskiego, stanisławowskiego i tarnopolskiego.
   tert21: % z wykształceniem wyższym wg NSP 2021 (województwo).
   ww1/ww2: mnożniki natężenia I i II wojny (założenie modelu na podstawie historiografii) */
const REGIONS = [
  { id: 'maz', name: 'Mazowsze', city: 'Warszawa', zabor: 'rosyjski', illit31: { all: 18.0, town: [15.1, 22.3], rural: [19.1, 25.8], big: [6.9, 12.6] }, tert21: 31.3, ww1: 1.15, ww2: 1.25 },
  { id: 'lod', name: 'Ziemia łódzka', city: 'Łódź', zabor: 'rosyjski', illit31: { all: 22.7, town: [13.3, 21.3], rural: [22.3, 31.1] }, tert21: 21.9, ww1: 1.1, ww2: 1.05 },
  { id: 'kie', name: 'Kielecczyzna', city: 'Kielce', zabor: 'rosyjski', illit31: { all: 25.7, town: [13.7, 21.5], rural: [23.7, 33.6] }, tert21: 21.8, ww1: 1.1, ww2: 1.0 },
  { id: 'lub', name: 'Lubelszczyzna', city: 'Lublin', zabor: 'rosyjski', illit31: { all: 24.6, town: [14.4, 22.3], rural: [20.4, 31.5] }, tert21: 22.3, ww1: 1.15, ww2: 1.15 },
  { id: 'pdl', name: 'Podlasie', city: 'Białystok', zabor: 'rosyjski', illit31: { all: 23.1, town: [9.7, 18.7], rural: [17.6, 34.2] }, tert21: 22.2, ww1: 1.15, ww2: 1.2 },
  { id: 'wlk', name: 'Wielkopolska', city: 'Poznań', zabor: 'pruski', illit31: { all: 7.6, town: [3.7, 5.3], rural: [8.5, 9.7] }, tert21: 22.0, ww1: 0.7, ww2: 0.95 },
  { id: 'pom', name: 'Pomorze i Kujawy', city: 'Gdańsk, Bydgoszcz', zabor: 'pruski', illit31: { all: 8.3, town: [4.2, 6.4], rural: [9.2, 10.7] }, tert21: 21.4, ww1: 0.7, ww2: 1.0 },
  { id: 'sla', name: 'Górny Śląsk', city: 'Katowice', zabor: 'pruski', illit31: { all: 1.5, town: [1.1, 1.6], rural: [1.3, 1.6] }, tert21: 21.4, ww1: 0.7, ww2: 0.8 },
  { id: 'mlp', name: 'Małopolska', city: 'Kraków', zabor: 'austriacki', illit31: { all: 13.7, town: [5.8, 8.7], rural: [15.6, 16.6] }, tert21: 24.4, ww1: 1.2, ww2: 0.9 },
  { id: 'pkr', name: 'Podkarpacie', city: 'Rzeszów', zabor: 'austriacki', illit31: { all: 23.1, town: [7.2, 12.8], rural: [24.1, 31.3] }, tert21: 21.0, ww1: 1.25, ww2: 1.05 },
  { id: 'kre', name: 'Kresy Wschodnie', city: 'Lwów, Wilno, Polesie', zabor: 'rosyjski i austriacki', illit31: { all: 37.8, town: [10.6, 21.3], rural: [29.1, 53.5] }, tert21: 23.6, ww1: 1.25, ww2: 1.4, to: 1944, after: 'dls' },
  { id: 'dls', name: 'Dolny Śląsk', city: 'Wrocław', zabor: 'Niemcy do 1945', tert21: 23.6, ww1: 1, ww2: 1, from: 1945 },
  { id: 'zpm', name: 'Pomorze Zachodnie', city: 'Szczecin', zabor: 'Niemcy do 1945', tert21: 20.8, ww1: 1, ww2: 1, from: 1945 },
  { id: 'wmz', name: 'Warmia i Mazury', city: 'Olsztyn', zabor: 'Niemcy do 1945', tert21: 18.6, ww1: 1, ww2: 1, from: 1945 }
];
const REG = Object.fromEntries(REGIONS.map(r => [r.id, r]));
const regionValid = (r, by) => !((r.from && by < r.from) || (r.to && by > r.to));
const PART_W = { rosyjski: 0.25, pruski: 0.35, austriacki: 0.45, 'rosyjski i austriacki': 0.3 };

/* ---------- Szansa na studia i umiejętność czytania ---------- */
function tertiaryChance(by, regId, set, sex) {
  const r = REG[regId];
  const base = tertNat(by);
  const fr = interp(FEM, by);
  const sexAdj = sex === 'k' ? 2 * fr / (1 + fr) : 2 / (1 + fr);
  const st = interp(SETTLE_T[set], by);
  const litR = 1 - (r.illit31 ? r.illit31.all : 23.1) / 100, litN = 1 - 0.231;
  const mPre = Math.pow(litR / litN, 2);
  const postR = r.after ? REG[r.after] : r;
  const mPost = Math.pow(postR.tert21 / 23.1, 0.7);
  let mReg;
  if (r.illit31 === undefined) mReg = mPost;
  else mReg = by <= 1925 ? mPre : by >= 1950 ? mPost : mPre + (mPost - mPre) * (by - 1925) / 25;
  if (set === 'duze') mReg = Math.sqrt(mReg); // efekt metropolii jest już w mnożniku dużego miasta
  return Math.min(0.75, base * sexAdj * st * mReg);
}
/* analfabetyzm rocznika względem ogółu ludności 10+ w 1931 r. (MRS 1939, tabl. 23: wiek 10–14 → 6,6%, 15–19 → 12,4%, 20–24 → 16,9%, 25–29 → 17,1%, 30–39 → 21,4%, 40–49 → 30,3% przy 23,1% ogółem) */
const ILLIT_F = [[1885, 1.31], [1896, 0.93], [1904, 0.74], [1909, 0.73], [1914, 0.54], [1919, 0.29], [1925, 0.15], [1930, 0.08], [1935, 0.04], [1945, 0]];
function illiteracy(by, regId, set, sex) {
  const r = REG[regId];
  if (!r.illit31) return 0;
  const t = r.illit31, i = sex === 'k' ? 1 : 0;
  const base = set === 'wies' ? t.rural[i] : set === 'male' ? t.town[i] : (t.big ? t.big[i] : t.town[i] * 0.8);
  return Math.min(0.95, base / 100 * interp(ILLIT_F, by));
}

/* ---------- Wojny i przemoc: roczne natężenie ---------- */
const HAZ = { 1914: .12, 1915: .12, 1916: .08, 1917: .08, 1918: .08, 1919: .06, 1920: .08, 1939: .25, 1940: .18, 1941: .20, 1942: .22, 1943: .22, 1944: .25, 1945: .15, 1946: .05, 1947: .04, 1948: .02, 1949: .02, 1950: .02, 1951: .02, 1952: .02, 1953: .02, 1954: .01, 1955: .01, 1956: .01, 1970: .01, 1981: .01, 1982: .01 };
const isWarYear = y => (y >= 1914 && y <= 1920) || (y >= 1939 && y <= 1945);
function ageW(a) { return a <= 5 ? 0.8 : a <= 14 ? 0.7 : a <= 35 ? 1.0 : a <= 60 ? 0.8 : 0.6; }
function regionAt(regId, y) { const r = REG[regId]; return (r.after && y >= 1945) ? REG[r.after] : r; }
function warBurden(by, regId, set, sex) {
  let b = 0;
  for (let y = by; y <= Math.min(by + 80, 2100); y++) {
    const h = HAZ[y]; if (!h) continue;
    const r = regionAt(regId, y);
    let m = 1;
    if (y <= 1920) m = r.ww1;
    else if (y >= 1939 && y <= 1945) m = r.ww2 * SETTLE[set].ww2;
    else if ((y === 1946 || y === 1947) && (regId === 'pkr' || regId === 'kre')) m = 1.4;
    else if (y === 1970 && regId === 'pom') m = 2;
    b += h * ageW(y - by) * m * (sex === 'm' ? 1.1 : 0.95);
  }
  return b;
}

/* ---------- Swoboda wyboru drogi ---------- */
function openness(y, regId) {
  if (y < 1918) return PART_W[REG[regId].zabor] ?? 0.3;
  if (y < 1926) return 0.65;
  if (y < 1939) return 0.5;
  if (y < 1945) return 0.0;
  if (y < 1956) return 0.1;
  if (y < 1970) return 0.25;
  if (y < 1980) return 0.3;
  if (y < 1982) return 0.4;
  if (y < 1989) return 0.25;
  if (y < 2004) return 0.8;
  return 0.95;
}

/* ---------- Składowe i indeks ---------- */
const COMP = [
  { k: 'E', name: 'Edukacja', desc: 'szansa na dyplom uczelni (70%) i umiejętność czytania (30%)' },
  { k: 'M', name: 'Awans strukturalny', desc: 'ile przybyło pracy poza rolnictwem i dyplomów w wieku 15–40 lat' },
  { k: 'G', name: 'Gospodarka i praca', desc: 'średni wzrost PKB na osobę w wieku 18–45 lat, pomniejszony o wysokie bezrobocie w wieku 18–26 lat' },
  { k: 'D', name: 'Dobrobyt', desc: 'poziom PKB na osobę w wieku 20–60 lat, od lat 90. z uwzględnieniem zamożności województwa' },
  { k: 'B', name: 'Bezpieczeństwo', desc: 'brak wojen, okupacji i terroru w ciągu życia, ważone wiekiem' },
  { k: 'Z', name: 'Zdrowie na starcie', desc: 'przeciętne trwanie życia noworodka w roku urodzenia' },
  { k: 'W', name: 'Swoboda wyboru', desc: 'swoboda wyjazdu (od 2004 r. także do pracy w UE), zrzeszania się i wyboru drogi w wieku 15–45 lat' }
];
const PRESETS = {
  bal: { name: 'Zrównoważone', w: { E: .25, M: .15, G: .15, D: .10, B: .15, Z: .10, W: .10 } },
  kar: { name: 'Edukacja i kariera', w: { E: .35, M: .25, G: .20, D: .10, B: .05, Z: .025, W: .025 } },
  dob: { name: 'Dobrobyt i bezpieczeństwo', w: { E: .10, M: .05, G: .10, D: .30, B: .25, Z: .15, W: .05 } },
  wol: { name: 'Wolność wyboru drogi', w: { E: .15, M: .10, G: .10, D: .10, B: .15, Z: .10, W: .30 } }
};

function profile(by, regId, set, sex, presetId = 'bal') {
  const p = tertiaryChance(by, regId, set, sex);
  const lit = 1 - illiteracy(by, regId, set, sex);
  const E = clamp(100 * (0.7 * Math.min(1, p / 0.55) + 0.3 * lit));

  const dA = Math.max(0, agri(by + 15) - agri(by + 40)) * SETTLE[set].agriW;
  const dE = Math.max(0, (tertNat(by) - tertNat(by - 28)) * 100);
  const M = clamp(100 * (0.7 * Math.min(1, dA / 22) + 0.3 * Math.min(1, dE / 25)));

  const g = growth(by + 18, by + 45);
  const uy = unempAvg(by + 18, by + 26);
  const uPen = uy ? 2 * Math.max(0, uy.avg - 6) * (uy.n / 9) : 0;
  const G = clamp((g + 1) / 6 * 100 - uPen);

  let s = 0, n = 0;
  for (let y = by + 20; y <= by + 60; y++) { s += Math.log(gdp(y) * regGdpMult(regId, set, y)); n++; }
  const D = clamp((s / n - Math.log(2500)) / (Math.log(40000) - Math.log(2500)) * 100);

  const burden = warBurden(by, regId, set, sex);
  const B = clamp(100 * Math.exp(-1.3 * burden));

  const le = e0(by, sex);
  const Z = clamp((le - 35) / (83 - 35) * 100);

  let w = 0, wn = 0;
  for (let y = by + 15; y <= by + 45; y++) { w += openness(y, regId); wn++; }
  const W = clamp(100 * w / wn);

  const comps = { E, M, G, D, B, Z, W };
  const wt = PRESETS[presetId].w;
  let idx = 0; for (const k in wt) idx += wt[k] * comps[k];

  let warYears = 0, warYoung = 0;
  for (let y = by; y <= Math.min(by + 80, NOW); y++) if (isWarYear(y)) { warYears++; if (y - by >= 15 && y - by <= 35) warYoung++; }

  return {
    by, regId, set, sex, presetId, comps, index: idx,
    p, pNat: tertNat(by), lit, g, burden, e0: le, u5: u5(by),
    gdp30: gdp(by + 30), gdp30known: by + 30 <= GDP_LAST,
    uYoung: uy ? uy.avg : null, uYoungN: uy ? uy.n : 0, uPen,
    regGdp: regGdpIndex(regionAt(regId, Math.max(by + 30, 1990)).id, set),
    dA, dE, warYears, warYoung,
    projected: by + 45 > GDP_LAST
  };
}

function rankAmongCohorts(prof) {
  const vals = [];
  for (let y = BY_MIN; y <= BY_MAX; y++) {
    if (!regionValid(REG[prof.regId], y)) continue;
    vals.push(profile(y, prof.regId, prof.set, prof.sex, prof.presetId).index);
  }
  const below = vals.filter(v => v < prof.index - 1e-9).length;
  return { pct: Math.round(below / vals.length * 100), n: vals.length };
}

function verdict(v) {
  if (v < 30) return 'bardzo trudny start';
  if (v < 45) return 'pod wiatr';
  if (v < 60) return 'umiarkowane szanse';
  if (v < 75) return 'dobre szanse';
  return 'bardzo dobre szanse';
}

if (typeof module !== 'undefined') module.exports = { profile, rankAmongCohorts, REGIONS, REG, regionValid, gdp, gdpBench, growth, e0, u5, tertNat, agri, tertiaryChance, illiteracy, unemp, verdict, PRESETS, COMP, SETTLE, BENCH };
