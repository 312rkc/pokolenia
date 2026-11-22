/* ===== Model szans – dane i obliczenia (bez DOM) ===== */
/* SERIES wstrzykiwane przez build.py: gdpPL, gdpDE (Maddison 2023, $ 2011 PPP/os.), e0 (Gapminder), u5 (Gapminder) */

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
const GDP_LAST = 2022;
const plYears = Object.keys(SERIES.gdpPL).map(Number).sort((a, b) => a - b);
function gdpKnown(y) { return SERIES.gdpPL[y] !== undefined; }
function gdp(y) {
  if (y > GDP_LAST) {
    const base = SERIES.gdpPL[GDP_LAST];
    const a = Math.min(y, 2035) - GDP_LAST, b = Math.max(0, y - 2035);
    return base * Math.pow(1.025, a) * Math.pow(1.015, b);
  }
  if (gdpKnown(y)) return SERIES.gdpPL[y];
  let lo = plYears[0], hi = plYears[plYears.length - 1];
  for (const k of plYears) { if (k < y) lo = k; if (k > y) { hi = k; break; } }
  const t = (y - lo) / (hi - lo);
  return Math.exp(Math.log(SERIES.gdpPL[lo]) * (1 - t) + Math.log(SERIES.gdpPL[hi]) * t);
}
function gdpDE(y) { return SERIES.gdpDE[y]; }
function growth(y0, y1) { return (Math.log(gdp(y1)) - Math.log(gdp(y0))) / (y1 - y0) * 100; }

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
const FEM = [[1900, 0.30], [1910, 0.35], [1920, 0.5], [1930, 0.7], [1940, 0.85], [1950, 1.05], [1960, 1.25], [1970, 1.5], [1985, 1.6], [2010, 1.6]];
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
/* illit31: % analfabetów w wieku 10+ wg spisu 1931 (województwo odpowiadające regionowi; * = szacunek z 1921 i tempa spadku)
   tert21: % z wykształceniem wyższym wg NSP 2021 (województwo)
   ww1/ww2: mnożniki natężenia I i II wojny (założenie modelu na podstawie historiografii) */
const REGIONS = [
  { id: 'maz', name: 'Mazowsze', city: 'Warszawa', zabor: 'rosyjski', illit31: 20, est: true, tert21: 31.3, ww1: 1.15, ww2: 1.25 },
  { id: 'lod', name: 'Ziemia łódzka', city: 'Łódź', zabor: 'rosyjski', illit31: 21, est: true, tert21: 21.9, ww1: 1.1, ww2: 1.05 },
  { id: 'kie', name: 'Kielecczyzna', city: 'Kielce', zabor: 'rosyjski', illit31: 25, est: true, tert21: 21.8, ww1: 1.1, ww2: 1.0 },
  { id: 'lub', name: 'Lubelszczyzna', city: 'Lublin', zabor: 'rosyjski', illit31: 29, est: true, tert21: 22.3, ww1: 1.15, ww2: 1.15 },
  { id: 'pdl', name: 'Podlasie', city: 'Białystok', zabor: 'rosyjski', illit31: 28, est: true, tert21: 22.2, ww1: 1.15, ww2: 1.2 },
  { id: 'wlk', name: 'Wielkopolska', city: 'Poznań', zabor: 'pruski', illit31: 3.7, tert21: 22.0, ww1: 0.7, ww2: 0.95 },
  { id: 'pom', name: 'Pomorze i Kujawy', city: 'Gdańsk, Bydgoszcz', zabor: 'pruski', illit31: 5.9, tert21: 21.4, ww1: 0.7, ww2: 1.0 },
  { id: 'sla', name: 'Górny Śląsk', city: 'Katowice', zabor: 'pruski', illit31: 1.5, tert21: 21.4, ww1: 0.7, ww2: 0.8 },
  { id: 'mlp', name: 'Małopolska', city: 'Kraków', zabor: 'austriacki', illit31: 17.6, tert21: 24.4, ww1: 1.2, ww2: 0.9 },
  { id: 'pkr', name: 'Podkarpacie', city: 'Rzeszów', zabor: 'austriacki', illit31: 25.1, tert21: 21.0, ww1: 1.25, ww2: 1.05 },
  { id: 'kre', name: 'Kresy Wschodnie', city: 'Lwów, Wilno, Polesie', zabor: 'rosyjski i austriacki', illit31: 38, est: true, tert21: 23.6, ww1: 1.25, ww2: 1.4, to: 1944, after: 'dls' },
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
  const litR = 1 - (r.illit31 ?? 22) / 100, litN = 0.77;
  const mPre = Math.pow(litR / litN, 2);
  const postR = r.after ? REG[r.after] : r;
  const mPost = Math.pow(postR.tert21 / 23.1, 0.7);
  let mReg;
  if (r.illit31 === undefined) mReg = mPost;
  else mReg = by <= 1925 ? mPre : by >= 1950 ? mPost : mPre + (mPost - mPre) * (by - 1925) / 25;
  if (set === 'duze') mReg = Math.sqrt(mReg); // efekt metropolii jest już w mnożniku dużego miasta
  return Math.min(0.75, base * sexAdj * st * mReg);
}
const ILLIT_F = [[1895, 1.15], [1900, 1.0], [1905, 0.85], [1910, 0.65], [1915, 0.45], [1920, 0.3], [1925, 0.15], [1930, 0.07], [1935, 0.03], [1945, 0]];
function illiteracy(by, regId, set, sex) {
  const r = REG[regId];
  if (r.illit31 === undefined) return 0;
  const v = r.illit31 / 100 * interp(ILLIT_F, by) * SETTLE[set].illit * (sex === 'k' ? 1.2 : 0.8);
  return Math.min(0.95, v);
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
  { k: 'G', name: 'Dynamika gospodarki', desc: 'średni wzrost PKB na osobę w wieku 18–45 lat' },
  { k: 'D', name: 'Dobrobyt', desc: 'poziom PKB na osobę w wieku 20–60 lat' },
  { k: 'B', name: 'Bezpieczeństwo', desc: 'brak wojen, okupacji i terroru w ciągu życia, ważone wiekiem' },
  { k: 'Z', name: 'Zdrowie na starcie', desc: 'przeciętne trwanie życia noworodka w roku urodzenia' },
  { k: 'W', name: 'Swoboda wyboru', desc: 'swoboda wyjazdu, zrzeszania się i wyboru drogi w wieku 15–45 lat' }
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
  const G = clamp((g + 1) / 6 * 100);

  let s = 0, n = 0;
  for (let y = by + 20; y <= by + 60; y++) { s += Math.log(gdp(y)); n++; }
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
    gdp30: gdp(by + 30), gdp30known: by + 30 <= GDP_LAST, de30: gdpDE(by + 30),
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

if (typeof module !== 'undefined') module.exports = { profile, rankAmongCohorts, REGIONS, REG, regionValid, gdp, growth, e0, u5, tertNat, agri, tertiaryChance, illiteracy, verdict, PRESETS, COMP, SETTLE };
