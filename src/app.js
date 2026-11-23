/* ===== Interfejs ===== */
const $ = s => document.querySelector(s);
const fmt = (x, d = 0) => Number(x).toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const PERIODS = [
  { a: 1900, b: 1913, n: 'Zabory', k: 'norm', t: 'Ziemie polskie podzielone między Rosję, Prusy i Austrię. Przemysł rośnie w Łodzi, Warszawie i na Śląsku, a z przeludnionej wsi wyjeżdża się masowo za ocean.' },
  { a: 1914, b: 1918, n: 'I wojna światowa', k: 'war', t: 'Fronty przetaczają się przez Królestwo Polskie i Galicję. Zniszczenia, rekwizycje i wywózka fabryk w głąb Rosji.' },
  { a: 1919, b: 1921, n: 'Wojny o granice', k: 'war', t: 'Odrodzone państwo, wojna polsko-bolszewicka i gwałtownie rosnąca inflacja.' },
  { a: 1922, b: 1929, n: 'Budowa II RP', k: 'norm', t: 'Po hiperinflacji reforma Grabskiego i złoty w 1924 r., budowa Gdyni, upowszechnienie 7-letniej szkoły. Szkoły średnie i studia są płatne i elitarne.' },
  { a: 1930, b: 1935, n: 'Wielki kryzys', k: 'crisis', t: 'PKB na osobę spada o ok. 24% między 1929 a 1933 r. W miastach bezrobocie, a wieś cierpi przez spadek cen płodów rolnych.' },
  { a: 1936, b: 1938, n: 'Ożywienie i COP', k: 'norm', t: 'Centralny Okręg Przemysłowy i inwestycje państwa ożywiają gospodarkę, ale wieś pozostaje przeludniona.' },
  { a: 1939, b: 1945, n: 'II wojna i okupacje', k: 'war', t: 'Ginie 5,6–5,8 mln obywateli (szacunek IPN), w tym ok. 3 mln polskich Żydów. Niemcy zamykają polskie szkoły średnie i wyższe; uczy się w tajnych kompletach.' },
  { a: 1946, b: 1949, n: 'Nowe granice', k: 'norm', t: 'Granice przesunięte na zachód, przesiedlenia milionów ludzi, reforma rolna i odbudowa zrujnowanych miast.' },
  { a: 1950, b: 1955, n: 'Stalinizm, plan 6-letni', k: 'norm', t: 'Forsowna industrializacja i wielkie budowy, jak Nowa Huta. Młodzi masowo przenoszą się ze wsi do miast i fabryk, a jednocześnie trwa terror polityczny.' },
  { a: 1956, b: 1970, n: 'Mała stabilizacja', k: 'norm', t: 'Po odwilży 1956 r. praca jest pewna, a szkolnictwo zawodowe powszechne. Płace są niskie, na mieszkanie czeka się latami, granice pozostają zamknięte.' },
  { a: 1971, b: 1979, n: 'Dekada Gierka', k: 'norm', t: 'Boom na kredytach z Zachodu: wielkie budowy, bloki, Fiat 126p. PKB na osobę rośnie najszybciej w historii PRL, ale zadłużenie prowadzi do krachu.' },
  { a: 1980, b: 1989, n: 'Kryzys lat 80.', k: 'crisis', t: 'Solidarność, stan wojenny, kartki i inflacja. PKB na osobę spada o ok. 13% między 1978 a 1982 r., wielu młodych emigruje.' },
  { a: 1990, b: 1993, n: 'Szok transformacji', k: 'crisis', t: 'Plan Balcerowicza, upadek PGR i wielu zakładów przemysłowych. PKB na osobę spada o ok. 16% między 1989 a 1991 r.' },
  { a: 1994, b: 2003, n: 'Doganianie Zachodu', k: 'norm', t: 'Szybki wzrost i boom edukacyjny: liczba studentów rośnie z ok. 0,4 mln w 1990 r. do 1,6 mln w 2000 r. Zarazem wysokie bezrobocie, zwłaszcza na terenach popegeerowskich.' },
  { a: 2004, b: 2019, n: 'W Unii Europejskiej', k: 'norm', t: 'Fundusze unijne i otwarte rynki pracy: w 2007 r. czasowo za granicą przebywało 2,27 mln Polaków (GUS). W 2009 r. Polska uniknęła recesji.' },
  { a: 2020, b: 2026, n: 'Pandemia i niepewność', k: 'norm', t: 'COVID-19, pełnoskalowa wojna w Ukrainie, uchodźcy i wysoka inflacja. W 2022 r. PKB na osobę to ok. 69% poziomu Niemiec (Maddison).' },
  { a: 2027, b: 2100, n: 'Przyszłość', k: 'future', t: 'Prognoza modelu: wzrost PKB na osobę o 2,5% rocznie do 2035 r., potem o 1,5%. To założenie, a nie dane.' }
];
const MOMENTS = [[1918, 'Niepodległość'], [1939, 'Wybuch II wojny'], [1945, 'Koniec wojny'], [1956, 'Odwilż'], [1970, 'Początek ery Gierka'], [1980, 'Sierpień ’80'], [1989, 'Upadek PRL'], [2004, 'Wejście do UE'], [2020, 'Pandemia']];
const STAGES = [[0, 14, 'Dzieciństwo'], [15, 24, 'Młodość i nauka'], [25, 34, 'Start w dorosłość'], [35, 54, 'Dojrzałość zawodowa'], [55, 79, 'Późne lata']];
const COMP_TEXT = {
  E: { hi: 'Studia były dla tego rocznika realną drogą w górę.', lo: 'Dyplom uczelni był dla tego rocznika rzadkością, zwłaszcza poza dużymi miastami.' },
  M: { hi: 'Masowo przybywało pracy poza rolnictwem i miejsc na uczelniach. To klasyczny rocznik awansu.', lo: 'Struktura zawodów zmieniała się powoli, więc mniej było awansu, który niosła sama zmiana.' },
  G: { hi: 'Lata kariery przypadły na szybki wzrost gospodarczy.', lo: 'Lata kariery przypadły na stagnację, kryzys lub wojnę.' },
  D: { hi: 'Dorosłe życie upłynęło w kraju zamożniejszym niż kiedykolwiek wcześniej.', lo: 'Dorosłe życie upłynęło w kraju biednym, także na tle Europy Zachodniej.' },
  B: { hi: 'Życie bez wojny na własnym terytorium.', lo: 'Wojna, okupacja lub terror przypadły na ważne lata życia.' },
  Z: { hi: 'Dobre warunki zdrowotne na starcie.', lo: 'Wysoka umieralność dzieci i krótkie przeciętne trwanie życia w roku urodzenia.' },
  W: { hi: 'Młodość i dorosłość w warunkach swobody wyjazdu i wyboru drogi.', lo: 'Młodość w systemie bez swobody wyjazdu, zrzeszania się i wyboru drogi.' }
};
const GROUPS = [
  ['Dawny zabór rosyjski', ['maz', 'lod', 'kie', 'lub', 'pdl']],
  ['Dawny zabór pruski', ['wlk', 'pom', 'sla']],
  ['Dawny zabór austriacki', ['mlp', 'pkr']],
  ['Kresy Wschodnie (urodzeni do 1944 r.)', ['kre']],
  ['Ziemie Zachodnie i Północne (od 1945 r.)', ['dls', 'zpm', 'wmz']]
];

const state = { by: 1950, reg: 'lub', set: 'wies', sex: 'm', preset: 'bal', bench: 'DE' };
const PUBLIC_URL = 'https://pokolenia.roszakrafal.pl/';
let saved = [];          // profile do porównania (gdy cmpAuto = false)
let cmpAuto = true;      // na start: rodzice i dziadkowie aktualnego profilu, aktualizowani przy każdej zmianie
let notice = '';

const g = (m, k, sex = state.sex) => sex === 'k' ? k : m;
const ageWord = n => { const l = n % 10, h = n % 100; if (n === 1) return 'rok'; if (l >= 2 && l <= 4 && !(h >= 12 && h <= 14)) return 'lata'; return 'lat'; };
const who = (p) => `${g('Mężczyzna urodzony', 'Kobieta urodzona', p.sex)} w ${p.by} r. ${SETTLE[p.set].loc}, ${REG[p.reg].name} (${REG[p.reg].city})`;
const shortWho = p => `${p.by}, ${SETTLE[p.set].name}, ${REG[p.reg].name}, ${p.sex === 'k' ? 'K' : 'M'}`;

/* ---------- Kontrolki ---------- */
function buildControls() {
  const sel = $('#reg');
  sel.innerHTML = GROUPS.map(([lab, ids]) => `<optgroup label="${esc(lab)}">${ids.map(id => `<option value="${id}">${esc(REG[id].name)} · ${esc(REG[id].city)}</option>`).join('')}</optgroup>`).join('');
  $('#preset').innerHTML = Object.entries(PRESETS).map(([k, v]) => `<option value="${k}">${esc(v.name)}${k === 'bal' ? ' (domyślne)' : ''}</option>`).join('');
  $('#cmpRegion').addEventListener('change', e => { if (e.target.value) { quickCompare('region', e.target.value); e.target.value = ''; } });
  $('#pbarMinus').addEventListener('click', () => setState({ by: Math.max(BY_MIN, state.by - 1) }));
  $('#pbarPlus').addEventListener('click', () => setState({ by: Math.min(BY_MAX, state.by + 1) }));
  $('#pbarEdit').addEventListener('click', () => {
    const c = $('#controls'); c.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 1200);
    setTimeout(() => $('#reg').focus({ preventScroll: true }), 450);
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      const on = !e.isIntersecting && e.boundingClientRect.top < 0;
      $('#pbar').classList.toggle('on', on); $('#pbar').setAttribute('aria-hidden', on ? 'false' : 'true');
    }).observe($('#controls'));
  }
  $('#by').addEventListener('input', e => setState({ by: +e.target.value }));
  $('#byNum').addEventListener('change', e => { let v = Math.round(+e.target.value); if (!isFinite(v)) v = state.by; setState({ by: Math.max(BY_MIN, Math.min(BY_MAX, v)) }); });
  $('#byMinus').addEventListener('click', () => setState({ by: Math.max(BY_MIN, state.by - 1) }));
  $('#byPlus').addEventListener('click', () => setState({ by: Math.min(BY_MAX, state.by + 1) }));
  sel.addEventListener('change', e => setState({ reg: e.target.value }));
  document.querySelectorAll('input[name=set]').forEach(r => r.addEventListener('change', e => setState({ set: e.target.value })));
  document.querySelectorAll('input[name=sex]').forEach(r => r.addEventListener('change', e => setState({ sex: e.target.value })));
  $('#preset').addEventListener('change', e => setState({ preset: e.target.value }));
  $('#addCmp').addEventListener('click', addToCompare);
  $('#bench').innerHTML = Object.entries(BENCH).map(([k, v]) => `<option value="${k}">${esc(v.name)}</option>`).join('');
  $('#bench').addEventListener('change', e => { state.bench = e.target.value; renderTiles(currentProfile); renderGDP(currentProfile); });
  document.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => quickCompare(b.dataset.quick)));
  $('#copyLink').addEventListener('click', copyLink);
  $('#makeCard').addEventListener('click', makeCard);
  $('#cardClose').addEventListener('click', closeCard);
  $('#cardDl').addEventListener('click', e => {
    if (!dlCap || !cardBlob) return; // zwykły link do pobrania
    e.preventDefault();
    dlCap.save({ filename: `los-rocznika-${profileHash()}.png`, data: cardBlob })
      .then(() => { $('#cardMsg').textContent = 'Zapisano kartę.'; })
      .catch(err => { if (!err || err.code !== 'declined') $('#cardMsg').textContent = 'Pobieranie nie działa w tym widoku. Przytrzymaj obraz albo kliknij go prawym przyciskiem i wybierz „Zapisz obraz”.'; });
  });
  $('#cardModal').addEventListener('click', e => { if (e.target.id === 'cardModal') closeCard(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#cardModal').hidden) closeCard(); });
  window.addEventListener('resize', debounce(() => { renderLife(currentProfile); renderGDP(currentProfile); renderCompare(); }, 150));
  window.addEventListener('hashchange', () => { if (readHash()) renderAll(); });
}
function debounce(f, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; }

function fixRegion() {
  const r = REG[state.reg];
  notice = '';
  if (r.from && state.by < r.from) {
    notice = `Przed 1945 r. ${r.name} (${r.city}) leżał w granicach Niemiec. Pokazuję Kresy Wschodnie, skąd pochodziła znaczna część powojennych mieszkańców Ziem Zachodnich.`;
    state.reg = 'kre';
  } else if (r.to && state.by > r.to) {
    notice = 'Po 1945 r. Kresy Wschodnie znalazły się w ZSRR. Pokazuję Dolny Śląsk, dokąd trafiła duża część przesiedleńców z Kresów.';
    state.reg = 'dls';
  }
}
function setState(patch) { Object.assign(state, patch); fixRegion(); renderAll(); }

function syncControls() {
  $('#by').value = state.by; $('#byNum').value = state.by;
  const sel = $('#reg');
  [...sel.options].forEach(o => { o.disabled = !regionValid(REG[o.value], state.by); });
  sel.value = state.reg;
  document.querySelectorAll('input[name=set]').forEach(r => r.checked = r.value === state.set);
  document.querySelectorAll('input[name=sex]').forEach(r => r.checked = r.value === state.sex);
  $('#preset').value = state.preset;
  $('#bench').value = state.bench;
  const n = $('#notice'); n.textContent = notice; n.hidden = !notice;
}

/* ---------- Adres (#p-1950-lub-wies-m) ---------- */
function writeHash() {
  const h = `p-${state.by}-${state.reg}-${state.set}-${state.sex}`;
  try { if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h); } catch (e) { /* ramka może blokować */ }
}
function readHash() {
  const m = /^#p-(\d{4})-([a-z]{3})-(wies|male|duze)-(k|m)$/.exec(location.hash || '');
  if (!m) return false;
  const by = +m[1];
  if (by < BY_MIN || by > BY_MAX || !REG[m[2]]) return false;
  Object.assign(state, { by, reg: m[2], set: m[3], sex: m[4] }); fixRegion();
  return true;
}

/* ---------- Tooltip ---------- */
const tip = () => $('#tip');
function showTip(html, x, y) {
  const t = tip(); t.innerHTML = html; t.hidden = false;
  const r = t.getBoundingClientRect(), vw = document.documentElement.clientWidth;
  let left = x + 14, top = y + 14;
  if (left + r.width > vw - 8) left = Math.max(8, x - r.width - 14);
  if (top + r.height > window.innerHeight - 8) top = Math.max(8, y - r.height - 14);
  t.style.left = left + 'px'; t.style.top = top + 'px';
}
function hideTip() { tip().hidden = true; }

/* ---------- Render ---------- */
let currentProfile;
function renderAll() {
  syncControls();
  const p = profile(state.by, state.reg, state.set, state.sex, state.preset);
  p.reg = state.reg;
  currentProfile = p;
  renderSummary(p); renderTiles(p); renderMoments(p); renderLife(p); renderGDP(p); renderHeat(); updateQuickButtons(); renderCompare(); renderMethodWeights(); renderBar(p);
  $('#shareStatus').textContent = '';
  writeHash();
}

let lastShown = null, lastKey = null, deltaTimer = null, animId = null;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateNumber(el, from, to) {
  cancelAnimationFrame(animId);
  if (reduceMotion() || from == null || from === to) { el.textContent = to; return; }
  const t0 = performance.now(), dur = 450;
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) animId = requestAnimationFrame(step); };
  animId = requestAnimationFrame(step);
}
function renderBar(p) {
  $('#pbarWho').textContent = `${p.by} · ${REG[p.reg].name} · ${SETTLE[p.set].name} · ${p.sex === 'k' ? 'K' : 'M'}`;
  $('#pbarScore').textContent = `Wynik: ${Math.round(p.index)}/100`;
  $('#pbarMinus').disabled = p.by <= BY_MIN; $('#pbarPlus').disabled = p.by >= BY_MAX;
}
function renderSummary(p) {
  const v = Math.round(p.index);
  const key = `${p.by}-${p.reg}-${p.set}-${p.sex}-${p.presetId}`;
  const el = $('#idx'), dEl = $('#idxDelta');
  if (lastShown != null && key !== lastKey) {
    const d = v - lastShown;
    dEl.textContent = d === 0 ? 'Bez zmian względem poprzedniego wyboru' : `${d > 0 ? '+' : '−'}${Math.abs(d)} pkt względem poprzedniego wyboru`;
    dEl.className = 'delta' + (d > 0 ? ' up' : d < 0 ? ' down' : ''); dEl.hidden = false;
    clearTimeout(deltaTimer); deltaTimer = setTimeout(() => { dEl.hidden = true; }, 6000);
    el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 700);
    animateNumber(el, lastShown, v);
  } else el.textContent = v;
  lastShown = v; lastKey = key;
  $('#presetNow').textContent = `(teraz: ${PRESETS[p.presetId].name.toLowerCase()})`;
  $('#idxVerdict').textContent = verdict(p.index);
  $('#who').textContent = who(p);
  const rk = rankAmongCohorts(p);
  const r = REG[p.reg];
  const range = r.to ? `1900–${r.to}` : r.from ? `${r.from}–${BY_MAX}` : `${BY_MIN}–${BY_MAX}`;
  $('#rank').textContent = `Lepiej niż ${rk.pct}% roczników ${range} z tego samego regionu i typu miejscowości.`;
  const entries = COMP.map(c => [c.k, p.comps[c.k]]);
  const top = entries.reduce((a, b) => b[1] > a[1] ? b : a), low = entries.reduce((a, b) => b[1] < a[1] ? b : a);
  const nm = k => COMP.find(c => c.k === k).name.toLowerCase();
  const topTxt = top[1] >= 50 ? `<strong>Najmocniejsza strona: ${esc(nm(top[0]))}.</strong> ${esc(COMP_TEXT[top[0]].hi)}` : `<strong>Względnie najlepiej: ${esc(nm(top[0]))}</strong>, choć i tu wynik jest niski (${fmt(top[1])}/100).`;
  const lowTxt = low[1] < 55 ? `<strong>Największa bariera: ${esc(nm(low[0]))}.</strong> ${esc(COMP_TEXT[low[0]].lo)}` : `<strong>Relatywnie najsłabiej: ${esc(nm(low[0]))}</strong>, ale i tu wynik jest przyzwoity (${fmt(low[1])}/100).`;
  $('#why').innerHTML = `<p>${topTxt}</p><p>${lowTxt}</p>`
    + (p.projected ? `<p class="muted">Część lat kariery tego rocznika to jeszcze przyszłość. Składowe gospodarcze opierają się tu na prognozie modelu.</p>` : '');
  const w = PRESETS[p.presetId].w;
  $('#bars').innerHTML = COMP.map(c => {
    const val = p.comps[c.k];
    return `<div class="bar" tabindex="0" data-k="${c.k}"><div class="bar-h"><span class="bar-n">${esc(c.name)}</span><span class="bar-v">${fmt(val)}</span></div>
      <div class="bar-t" aria-hidden="true"><div class="bar-f" style="width:${Math.max(1.5, val)}%"></div></div>
      <div class="bar-d">${esc(c.desc)} · waga ${fmt(w[c.k] * 100)}%</div></div>`;
  }).join('');
}

function renderTiles(p) {
  const nat = p.pNat * 100;
  const tiles = [
    ['Szansa na dyplom uczelni', `${fmt(p.p * 100, p.p < 0.1 ? 1 : 0)}%`, `średnia rocznika w kraju: ${fmt(nat, nat < 10 ? 1 : 0)}%`],
    ['Przeciętne trwanie życia noworodka', `${fmt(p.e0, 1)} lat`, `${g('chłopiec', 'dziewczynka', p.sex)} urodzon${g('y', 'a', p.sex)} w ${p.by} r.${p.by >= 1939 && p.by <= 1945 ? ' (bez umieralności wojennej)' : ''}`],
    ['Umieralność dzieci do 5 lat', p.u5 == null ? 'brak danych' : `${fmt(p.u5)} na 1000`, p.u5 == null ? 'szereg zaczyna się w 1915 r.' : p.by > 2016 ? 'ostatni dostępny rok: 2016' : `w roku urodzenia (${p.by})`],
    (() => { const y30 = p.by + 30, b = gdpBench(state.bench, y30), bn = BENCH[state.bench];
      return [`PKB na osobę, gdy miał${g('', 'a', p.sex)} 30 lat`, `${fmt(p.gdp30 / 1000, 1)} tys. $`,
        y30 > GDP_LAST ? `prognoza na ${y30} r.` : b ? `${fmt(p.gdp30 / b * 100)}% poziomu ${bn.gen} (${y30} r.)` : `średnia krajowa, ${y30} r.`]; })(),
    ['Wzrost PKB na osobę w wieku 18–45 lat', `${p.g >= 0 ? '' : '−'}${fmt(Math.abs(p.g), 1)}% rocznie`, `lata ${p.by + 18}–${p.by + 45}${p.by + 45 > GDP_LAST ? ', częściowo prognoza' : ''}`],
    p.warYears || p.uYoung == null
      ? ['Lata wojen przeżyte', `${p.warYears} ${ageWord(p.warYears)}`, p.warYears ? `w tym w wieku 15–35 lat: ${p.warYoung}` : 'lata 1914–1920 i 1939–1945']
      : ['Bezrobocie na starcie (18–26 lat)', `${fmt(p.uYoung, 1)}%`, `średnia stopa rejestrowana, ${Math.max(1990, p.by + 18)}–${Math.min(p.by + 26, NOW)}${p.by + 26 > NOW ? ', częściowo założenie' : ''}`]
  ];
  $('#tiles').innerHTML = tiles.map(([l, v, s]) => `<div class="tile"><div class="tile-l">${esc(l)}</div><div class="tile-v">${esc(v)}</div><div class="tile-s">${esc(s)}</div></div>`).join('');
}

function renderMoments(p) {
  const items = MOMENTS.filter(([y]) => y >= p.by && y - p.by <= 90 && y <= NOW).map(([y, l]) => {
    const a = y - p.by;
    const txt = a === 0 ? 'rok urodzenia' : `${a} ${ageWord(a)}`;
    return `<li><span class="m-y">${y}</span><span class="m-l">${esc(l)}</span><span class="m-a">${txt}</span></li>`;
  });
  $('#moments').innerHTML = items.length ? items.join('') : '<li class="muted">Wszystkie przełomy z listy wydarzyły się przed urodzeniem.</li>';
}

/* ---------- Oś życia ---------- */
function periodsIn(a, b) { return PERIODS.filter(q => q.b >= a && q.a <= b).map(q => ({ ...q, ov: Math.min(q.b, b) - Math.max(q.a, a) + 1 })); }
let selPeriod = null, selFor = null;
const canHover = () => matchMedia('(hover: hover)').matches;
function renderPeriodPanel(p) {
  const q = PERIODS[selPeriod]; if (!q) return;
  const a0 = Math.max(0, q.a - p.by), a1 = Math.min(80, q.b - p.by);
  $('#perPanel').innerHTML = `<div class="pp-h"><b>${esc(q.n)}</b><span>${q.a}–${q.b > 2050 ? '…' : q.b} · wiek ${a0}–${a1} lat</span></div><p>${esc(q.t)}</p>`;
  document.querySelectorAll('#lifeSvg .per').forEach(el => el.classList.toggle('on', +el.dataset.i === selPeriod));
}
function renderLife(p) {
  const box = $('#lifeSvg'); const W = Math.max(300, box.clientWidth); const H = 128;
  const y0 = p.by, y1 = p.by + 80;
  const x = y => (y - y0) / (y1 - y0) * (W - 2) + 1;
  // domyślnie rozwinięta epoka, w której osoba miała 20 lat
  if (selFor !== p.by || selPeriod == null) { selFor = p.by; selPeriod = PERIODS.findIndex(q => q.a <= p.by + 20 && q.b >= p.by + 20); }
  $('#lifeHint').textContent = `Poniżej opis epoki z 20. roku życia. ${canHover() ? 'Kliknij' : 'Dotknij'} inną epokę na osi, żeby przeczytać jej opis.`;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Oś życia od ${y0} do ${y1} z epokami historycznymi, etapami życia i przeciętnym trwaniem życia rocznika">
  <defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--war)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--card)" stroke-width="2" opacity=".35"/></pattern>
  <pattern id="fut" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(135)"><rect width="6" height="6" fill="var(--band1)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink3)" stroke-width="1" opacity=".35"/></pattern></defs>`;
  s += `<text x="1" y="11" class="ax-l">Epoki</text>`;
  periodsIn(y0, y1).forEach((q, i) => {
    const a = Math.max(q.a, y0), b = Math.min(q.b, y1) + 1;
    const xa = x(a), xb = Math.min(x(b), W - 1), w = Math.max(1, xb - xa - 2);
    const fill = q.k === 'war' ? 'url(#hatch)' : q.k === 'crisis' ? 'var(--crisis)' : q.k === 'future' ? 'url(#fut)' : (i % 2 ? 'var(--band2)' : 'var(--band1)');
    const idx = PERIODS.findIndex(z => z.a === q.a);
    s += `<rect class="per" data-i="${idx}" tabindex="0" role="button" aria-label="${esc(q.n)}, ${q.a}–${q.b > 2050 ? 'dalej' : q.b}" x="${xa + 1}" y="16" width="${w}" height="30" rx="4" fill="${fill}"/>`;
    const fits = q.n.length * 6.4 < w - 8;
    if (fits) s += `<text x="${xa + 5}" y="35" class="per-t${q.k === 'war' ? ' inv' : ''}" pointer-events="none">${esc(q.n)}</text>`;
  });
  s += `<text x="1" y="62" class="ax-l">Etapy życia</text>`;
  STAGES.forEach(([a, b], i) => {
    const xa = x(y0 + a), xb = x(y0 + b + 1), w = xb - xa - 2;
    s += `<rect x="${xa + 1}" y="66" width="${w}" height="20" rx="4" fill="var(--s1)" opacity="${0.18 + i * 0.12}"/>`;
    const short = ['Dziecko', 'Nauka', 'Start', 'Kariera', 'Późne lata'][i];
    if (short.length * 6.2 < w - 6) s += `<text x="${xa + 5}" y="80" class="st-t" pointer-events="none">${short}</text>`;
  });
  for (let a = 0; a <= 80; a += 10) {
    const xx = x(y0 + a);
    s += `<line x1="${xx}" y1="88" x2="${xx}" y2="92" stroke="var(--ink3)"/>`;
    if (W > 520 || a % 20 === 0) s += `<text x="${Math.min(W - 18, Math.max(12, xx))}" y="104" text-anchor="middle" class="ax-t">${y0 + a}</text>`;
  }
  // przeciętne trwanie życia rocznika i płci
  const le = p.e0, xl = x(y0 + le);
  const anchor = xl > W - 170 ? 'end' : 'start', dx = anchor === 'end' ? -4 : 4;
  s += `<line x1="${xl}" y1="14" x2="${xl}" y2="122" stroke="var(--accent)" stroke-width="2"/><circle cx="${xl}" cy="122" r="3" fill="var(--accent)"/>`;
  s += `<text x="${xl + dx}" y="122" text-anchor="${anchor}" class="le-t">przeciętne trwanie życia: ${fmt(le)} lat</text>`;
  if (y1 > NOW && y0 <= NOW) { const xn = x(NOW + 1); s += `<line x1="${xn}" y1="14" x2="${xn}" y2="90" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="3 2"/><text x="${xn + 3}" y="11" class="ax-l">dziś</text>`; }
  s += `</svg>`;
  box.innerHTML = s;
  box.querySelectorAll('.per').forEach(el => {
    const i = +el.dataset.i;
    const pick = () => { selPeriod = i; renderPeriodPanel(p); };
    el.addEventListener('click', pick);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  renderPeriodPanel(p);

  // karty etapów
  $('#stages').innerHTML = STAGES.map(([a, b, n]) => {
    const ya = y0 + a, yb = y0 + b;
    const ps = periodsIn(ya, yb).sort((u, v) => v.ov - u.ov);
    const dom = ps[0];
    const future = ya > NOW, partFuture = !future && yb > NOW;
    let extra = '';
    const kn = Math.min(yb, GDP_LAST);
    if (kn - ya >= 3 && ya >= 1900) { const gr = growth(ya, kn); extra = `PKB na osobę zmieniał się średnio o ${gr >= 0 ? '+' : '−'}${fmt(Math.abs(gr), 1)}% rocznie (${ya}–${kn}).`; }
    if (a === 0 && p.u5 != null) extra = `W roku urodzenia ok. ${fmt(p.u5)} na 1000 dzieci nie dożywało 5 lat. ` + extra;
    if (a === 15) extra = `Szansa na studia w tym roczniku i miejscu: ok. ${fmt(p.p * 100, p.p < .1 ? 1 : 0)}%.` + (p.lit < 0.9 ? ` Ryzyko, że ${g('nie nauczył', 'nie nauczyła', p.sex)} się czytać: ok. ${fmt((1 - p.lit) * 100)}%.` : '');
    if (a === 25) { const u = unempAvg(ya, Math.min(yb, NOW)); if (u && u.n >= 3) extra += ` Bezrobocie rejestrowane w tych latach: średnio ${fmt(u.avg, 1)}%.`; }
    return `<li class="stage${future ? ' fut' : ''}"><div class="stage-h"><b>${n}</b><span>${a}–${b} lat · ${ya}–${yb}${future ? ' · prognoza' : partFuture ? ' · częściowo prognoza' : ''}</span></div>
      <div class="chips">${ps.map(q => `<span class="chip k-${q.k}">${esc(q.n)}</span>`).join('')}</div>
      <p>${esc(dom.t)}</p>${extra ? `<p class="muted">${esc(extra.trim())}</p>` : ''}</li>`;
  }).join('');

  // uwagi
  const notes = [];
  const age = y => y - p.by;
  if (p.e0 < 60) notes.push(`Przeciętne trwanie życia noworodka z ${p.by} r. to ok. ${fmt(p.e0)} lat, ale w tej liczbie mieszczą się bardzo częste zgony dzieci. Kto przeżył dzieciństwo, zwykle żył wyraźnie dłużej.`);
  if (p.by <= 1939 && age(1939) <= 60) {
    const a = age(1939);
    notes.push(a >= 13 && a <= 25 ? `We wrześniu 1939 r. miał${g('', 'a')} ${a} ${ageWord(a)}. Wojna przerwała naukę: pod okupacją niemiecką polskie szkoły średnie i wyższe działały tylko w konspiracji.` : `We wrześniu 1939 r. miał${g('', 'a')} ${a} ${ageWord(a)}.`);
  }
  if (p.by <= 1935) notes.push('Model opisuje przeciętne warunki. Dla ok. 3 mln polskich Żydów II wojna oznaczała Zagładę; ich szanse były nieporównywalnie gorsze niż pokazuje wynik.');
  if (state.reg === 'kre') notes.push('Po 1945 r. rodzinne strony znalazły się w ZSRR. Wielu Polaków z Kresów przesiedlono, często na Ziemie Zachodnie. Od 1945 r. model liczy dalsze życie dla Dolnego Śląska.');
  if (['dls', 'zpm', 'wmz'].includes(state.reg) && p.by <= 1960) notes.push('Dzieciństwo na Ziemiach Zachodnich i Północnych, w społeczności przesiedleńców z różnych stron Polski i z Kresów.');
  if (age(1952) >= 14 && age(1952) <= 30 && state.set === 'wies') notes.push('Rocznik wielkiej wędrówki ze wsi do miast: fabryki i budowy planu sześcioletniego chłonęły młodych ze wsi.');
  if (age(1989) >= 40 && age(1989) <= 58) notes.push(`Transformacja zastała ${g('go', 'ją')} w wieku ${age(1989)} lat, a to trudny moment na zmianę zawodu. Upadek PGR i wielu zakładów szczególnie mocno dotknął ludzi w tym wieku.`);
  if (p.uYoung != null && p.uYoungN >= 5 && p.uYoung >= 10) notes.push(`Wejście na rynek pracy (18–26 lat, ${Math.max(1990, p.by + 18)}–${p.by + 26}) przy bezrobociu rejestrowanym średnio ${fmt(p.uYoung, 1)}%; szczyt to 20,0% w latach 2002–2003 (GUS). PKB rosło, ale pracy brakowało, więc model odejmuje ${fmt(p.uPen)} pkt w składowej „Gospodarka i praca”.`);
  if (p.by >= 1972 && p.by <= 1992) notes.push('Studia w czasie boomu edukacyjnego: w roku akademickim 2005/06 studiowało rekordowe 1,95 mln osób. Model liczy dostępność dyplomu, a nie jego wartość na rynku pracy, która zależała od kierunku i malała wraz z liczbą absolwentów.');
  if (age(2004) >= 18 && age(2004) <= 40) notes.push(`Wejście do UE w wieku ${age(2004)} lat. Rynki pracy otworzyły najpierw Wielka Brytania, Irlandia i Szwecja. Czasowo za granicą przebywało 1,0 mln Polaków w 2004 r., 2,27 mln w 2007 r. i 2,54 mln w 2017 r. (GUS). Dla wielu z tego pokolenia wyjazd był drogą awansu albo ucieczką przed bezrobociem.`);
  if (p.by + 45 > NOW) notes.push('Większa część kariery tego rocznika jeszcze się nie wydarzyła. Wynik zależy od założeń prognozy.');
  $('#notes').innerHTML = notes.map(n => `<li>${esc(n)}</li>`).join('');
  $('#notesWrap').hidden = !notes.length;
}

/* ---------- Wykres PKB ---------- */
function seriesSegments(obj, from, to) {
  // dzieli szereg na odcinki: ciągłe (dane co rok), przerywane (luka do 9 lat) i pomijane (dłuższa luka)
  const pts = []; for (let y = from; y <= to; y++) if (obj[y] !== undefined) pts.push([y, obj[y]]);
  const segs = []; if (!pts.length) return { segs, pts };
  let cur = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const gap = pts[i][0] - pts[i - 1][0];
    if (gap > 1) { segs.push({ pts: cur, solid: true }); if (gap <= 9) segs.push({ pts: [pts[i - 1], pts[i]], solid: false }); cur = [pts[i]]; } else cur.push(pts[i]);
  }
  segs.push({ pts: cur, solid: true });
  return { segs, pts };
}
function renderGDP(p) {
  const box = $('#gdpSvg'); const W = Math.max(300, box.clientWidth); const H = W < 520 ? 250 : 300;
  const m = { l: 44, r: W < 520 ? 70 : 96, t: 14, b: 30 };
  const xEnd = Math.max(2030, Math.min(p.by + 80, 2070));
  const x0 = 1900;
  const bc = state.bench, bn = BENCH[bc];
  const plObs = {}; for (let y = x0; y <= GDP_LAST; y++) if (gdpKnown(y)) plObs[y] = gdp(y);
  const PL = seriesSegments(plObs, x0, GDP_LAST), BB = seriesSegments(SERIES.bench[bc], x0, 2022);
  const proj = []; for (let y = GDP_LAST; y <= xEnd; y++) proj.push([y, gdp(y)]);
  const yMax = Math.ceil(Math.max(...BB.pts.map(d => d[1]), ...proj.map(d => d[1]), 1) / 10000) * 10000;
  const X = y => m.l + (y - x0) / (xEnd - x0) * (W - m.l - m.r);
  const Y = v => m.t + (1 - v / yMax) * (H - m.t - m.b);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="PKB na osobę: Polska i ${esc(bn.name)} od 1900 r., z prognozą dla Polski; zaznaczone lata życia wybranej osoby">`;
  s += `<defs><pattern id="hatchG" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink3)" stroke-width="1" opacity=".4"/></pattern></defs>`;
  const la = Math.max(x0, p.by), lb = Math.min(xEnd, p.by + 80);
  s += `<rect x="${X(la)}" y="${m.t}" width="${Math.max(0, X(lb) - X(la))}" height="${H - m.t - m.b}" fill="var(--s1)" opacity=".08"/>`;
  [20, 40, 60].forEach(a => { const yy = p.by + a; if (yy <= xEnd) s += `<line x1="${X(yy)}" x2="${X(yy)}" y1="${m.t}" y2="${H - m.b}" stroke="var(--s1)" stroke-opacity=".35" stroke-dasharray="2 3"/><text x="${X(yy) + 3}" y="${m.t + 10}" class="ax-t">${a} l.</text>`; });
  const step = yMax > 60000 ? 20000 : 10000;
  for (let v = 0; v <= yMax; v += step) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" class="ax-t">${v ? fmt(v / 1000) + ' tys.' : '0'}</text>`;
  for (let y = 1900; y <= xEnd; y += (W < 520 ? 40 : 20)) s += `<text x="${X(y)}" y="${H - 10}" text-anchor="middle" class="ax-t">${y}</text>`;
  s += `<rect x="${X(1939)}" y="${m.t}" width="${X(1948) - X(1939)}" height="${H - m.t - m.b}" fill="url(#hatchG)" opacity=".55"/>`;
  const path = pts => pts.map((d, i) => `${i ? 'L' : 'M'}${X(d[0]).toFixed(1)},${Y(d[1]).toFixed(1)}`).join('');
  BB.segs.forEach(sg => { s += `<path d="${path(sg.pts)}" fill="none" stroke="var(--s2)" stroke-width="2" ${sg.solid ? '' : 'stroke-dasharray="3 3"'}/>`; });
  PL.segs.forEach(sg => { s += `<path d="${path(sg.pts)}" fill="none" stroke="var(--s1)" stroke-width="2" ${sg.solid ? '' : 'stroke-dasharray="3 3"'}/>`; });
  s += `<path d="${path(proj)}" fill="none" stroke="var(--s1)" stroke-width="2" stroke-dasharray="5 4" opacity=".8"/>`;
  s += `<text x="${(X(1939) + X(1948)) / 2}" y="${Y(yMax * 0.55)}" text-anchor="middle" class="ax-t" transform="rotate(-90 ${(X(1939) + X(1948)) / 2} ${Y(yMax * 0.55)})">wojna: brak danych</text>`;
  const bEnd = BB.pts[BB.pts.length - 1], plEnd = proj[proj.length - 1];
  if (bEnd) s += `<circle cx="${X(bEnd[0])}" cy="${Y(bEnd[1])}" r="4" fill="var(--s2)" stroke="var(--card)" stroke-width="2"/><text x="${X(bEnd[0]) + 7}" y="${Y(bEnd[1]) + 4}" class="dl">${esc(bn.name)}</text>`;
  if (BB.pts.length && BB.pts[0][0] > 1910) s += `<text x="${X(BB.pts[0][0]) - 4}" y="${Y(BB.pts[0][1]) - 8}" text-anchor="end" class="ax-t">dane od ${BB.pts[0][0]}</text>`;
  s += `<circle cx="${X(GDP_LAST)}" cy="${Y(gdp(GDP_LAST))}" r="4" fill="var(--s1)" stroke="var(--card)" stroke-width="2"/>`;
  s += `<text x="${Math.min(X(plEnd[0]) + 6, W - m.r + 6)}" y="${Y(plEnd[1]) + 4}" class="dl">Polska</text>`;
  s += `<line id="gx" x1="0" x2="0" y1="${m.t}" y2="${H - m.b}" stroke="var(--ink3)" visibility="hidden"/><circle id="gp" r="4" fill="var(--s1)" stroke="var(--card)" stroke-width="2" visibility="hidden"/><circle id="gd" r="4" fill="var(--s2)" stroke="var(--card)" stroke-width="2" visibility="hidden"/>`;
  s += `<rect id="ghit" x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="transparent"/></svg>`;
  box.innerHTML = s;
  const hit = box.querySelector('#ghit'), gx = box.querySelector('#gx'), gp = box.querySelector('#gp'), gd = box.querySelector('#gd');
  const move = e => {
    const r = hit.getBoundingClientRect();
    const yr = Math.round(x0 + (e.clientX - r.left) / r.width * (xEnd - x0));
    if (yr < x0 || yr > xEnd) return;
    const war = yr >= 1939 && yr <= 1947;
    const v = war ? null : gdp(yr), d = gdpBench(bc, yr);
    gx.setAttribute('x1', X(yr)); gx.setAttribute('x2', X(yr)); gx.setAttribute('visibility', 'visible');
    if (v) { gp.setAttribute('cx', X(yr)); gp.setAttribute('cy', Y(v)); gp.setAttribute('visibility', 'visible'); } else gp.setAttribute('visibility', 'hidden');
    if (d) { gd.setAttribute('cx', X(yr)); gd.setAttribute('cy', Y(d)); gd.setAttribute('visibility', 'visible'); } else gd.setAttribute('visibility', 'hidden');
    const a = yr - p.by;
    const tag = yr > GDP_LAST ? ' (prognoza)' : yr > 2022 ? ' (dynamika GUS)' : SERIES.gdpPL[yr] !== undefined ? '' : ' (interpolacja)';
    const plTxt = war ? 'brak danych (wojna)' : `${fmt(v)} $${tag}`;
    showTip(`<b>${yr}</b>${a >= 0 && a <= 80 ? ` · wiek: ${a}` : ''}<br><span class="sw" style="background:var(--s1)"></span>Polska: ${plTxt}${d ? `<br><span class="sw" style="background:var(--s2)"></span>${esc(bn.name)}: ${fmt(d)} $` : ''}${v && d ? `<br><span class="muted">Polska = ${fmt(v / d * 100)}% poziomu ${esc(bn.gen)}</span>` : ''}`, e.clientX, e.clientY);
  };
  hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', () => { hideTip(); [gx, gp, gd].forEach(el => el.setAttribute('visibility', 'hidden')); });
  $('#benchLeg').textContent = bn.name;
  const rows = [1900, 1910, 1913, 1920, 1929, 1933, 1938, 1950, 1960, 1970, 1978, 1982, 1989, 1991, 2000, 2004, 2010, 2020, 2022];
  $('#gdpTable').innerHTML = `<thead><tr><th>Rok</th><th>Polska</th><th>${esc(bn.name)}</th><th>Polska / ${esc(bn.name)}</th></tr></thead><tbody>` + rows.map(y => { const a = SERIES.gdpPL[y], b = gdpBench(bc, y); return `<tr><td>${y}</td><td>${fmt(a)}</td><td>${b ? fmt(b) : '—'}</td><td>${b ? fmt(a / b * 100) + '%' : '—'}</td></tr>`; }).join('') + `<tr><td>2025</td><td>${fmt(gdp(2025))}</td><td>—</td><td>—</td></tr></tbody>`;
}

/* ---------- Mapa szans ---------- */
const RAMP_L = ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];
const RAMP_D = ['#1b2b40', '#184f95', '#1c5cab', '#256abf', '#2a78d6', '#3987e5', '#5598e7', '#6da7ec', '#86b6ef', '#9ec5f4', '#b7d3f6', '#cde2fb', '#e3effd'];
function isDark() { const t = document.documentElement.dataset.theme; if (t) return t === 'dark'; return matchMedia('(prefers-color-scheme: dark)').matches; }
function rampColor(v) { const R = isDark() ? RAMP_D : RAMP_L; const lo = 20, hi = 90; const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo))); return { c: R[Math.round(t * (R.length - 1))], dark: isDark() ? t > 0.55 : t > 0.5 }; }
function renderHeat() {
  const cols = []; for (let y = 1900; y <= 2010; y += 10) cols.push(y);
  const decade = Math.floor(state.by / 10) * 10;
  let h = `<div class="hm" style="--cols:${cols.length}" role="grid" aria-label="Indeks szans według regionu i rocznika"><div class="hm-c hm-h"></div>${cols.map(c => `<div class="hm-c hm-h" role="columnheader">${W_short(c)}</div>`).join('')}`;
  GROUPS.forEach(([lab, ids]) => ids.forEach(id => {
    const r = REG[id];
    h += `<div class="hm-c hm-r" role="rowheader" title="${esc(r.name)}">${esc(r.city.split(',')[0])}</div>`;
    cols.forEach(y => {
      const yy = (r.to && y > r.to) ? null : (r.from && y < r.from) ? (y + 9 >= r.from ? r.from : null) : y;
      if (yy === null) { h += `<div class="hm-c hm-x" aria-label="brak">·</div>`; return; }
      const v = profile(yy, id, state.set, state.sex, state.preset).index;
      const { c, dark } = rampColor(v);
      const sel = id === state.reg && decade === y;
      h += `<button class="hm-c hm-v${sel ? ' sel' : ''}${dark ? ' on-dark' : ''}" style="background:${c}" data-y="${yy}" data-r="${id}" aria-label="${esc(r.name)}, ${yy}: ${fmt(v)}">${fmt(v)}</button>`;
    });
  }));
  h += `</div>`;
  $('#heat').innerHTML = h;
  const selEl = $('#heat .sel'), hb = $('#heat');
  if (selEl && hb.scrollWidth > hb.clientWidth) hb.scrollLeft = Math.max(0, selEl.offsetLeft - hb.clientWidth / 2);
  $('#heat').querySelectorAll('.hm-v').forEach(b => {
    b.addEventListener('click', () => setState({ by: +b.dataset.y, reg: b.dataset.r }));
    b.addEventListener('pointermove', e => showTip(`<b>${esc(REG[b.dataset.r].name)}, rocznik ${b.dataset.y}</b><br>Indeks: ${b.textContent} · ${verdict(+b.textContent)}<br><span class="muted">${esc(SETTLE[state.set].name)}, ${state.sex === 'k' ? 'kobieta' : 'mężczyzna'}. Kliknij, aby wybrać.</span>`, e.clientX, e.clientY));
    b.addEventListener('pointerleave', hideTip);
  });
  $('#heatCap').textContent = `Profil: ${SETTLE[state.set].name}, ${state.sex === 'k' ? 'kobieta' : 'mężczyzna'}, wagi „${PRESETS[state.preset].name}”. Kolumna to rocznik na początku dekady (Ziemie Zachodnie: od 1945).`;
  const R = isDark() ? RAMP_D : RAMP_L;
  $('#heatLegend').innerHTML = `<span>≤20</span><span class="hm-grad" style="background:linear-gradient(90deg,${R.join(',')})"></span><span>≥90</span>`;
}
function W_short(y) { return `${y}`; }

/* ---------- Porównanie ---------- */
function validReg(reg, by) { const r = REG[reg]; if (r.from && by < r.from) return 'kre'; if (r.to && by > r.to) return 'dls'; return reg; }
const REL = { parents: { d: -25, tag: 'Rodzice' }, grand: { d: -50, tag: 'Dziadkowie' }, children: { d: 25, tag: 'Dzieci' }, grandch: { d: 50, tag: 'Wnuki' } };
function relative(kind) {
  const by = state.by + REL[kind].d;
  if (by < BY_MIN || by > BY_MAX) return null;
  return { by, reg: validReg(state.reg, by), set: state.set, sex: state.sex, tag: REL[kind].tag };
}
function autoRelatives() {
  // rodzice i dziadkowie; gdy nie mieszczą się w latach 1900–2010, dzieci i wnuki
  let list = ['parents', 'grand'].map(relative).filter(Boolean);
  if (!list.length) list = ['children', 'grandch'].map(relative).filter(Boolean);
  return list.slice(0, 2).map((pr, i) => ({ ...pr, slot: i + 2 }));
}
function addProfile(pr) {
  const wasAuto = cmpAuto;
  if (cmpAuto) { saved = autoRelatives(); cmpAuto = false; }
  const used = saved.map(s => s.slot);
  let slot = [2, 3].find(sl => !used.includes(sl));
  // po starcie zastępujemy dalszy z krewnych (dziadków), potem zawsze najstarszy dodany profil
  if (!slot) { const vi = wasAuto ? saved.length - 1 : 0; slot = saved[vi].slot; saved.splice(vi, 1); }
  saved.push({ ...pr, slot });
  updateQuickButtons(); renderCompare();
}
function addToCompare() { addProfile({ by: state.by, reg: state.reg, set: state.set, sex: state.sex, tag: 'Twój wybór z ' + state.by }); }
function quickCompare(kind, arg) {
  const b = { by: state.by, reg: state.reg, set: state.set, sex: state.sex };
  if (REL[kind]) { const r = relative(kind); if (!r) return; Object.assign(b, r); }
  if (kind === 'place') { b.set = state.set === 'duze' ? 'wies' : 'duze'; b.tag = state.set === 'duze' ? 'Wieś' : 'Duże miasto'; }
  if (kind === 'sex') { b.sex = state.sex === 'k' ? 'm' : 'k'; b.tag = state.sex === 'k' ? 'Mężczyzna' : 'Kobieta'; }
  if (kind === 'region') { b.reg = arg; b.tag = REG[arg].name; }
  addProfile(b);
}
function updateQuickButtons() {
  const set = (sel, kind, label) => { const el = $(sel), r = relative(kind); el.disabled = !r; el.textContent = r ? `${label} (${r.by})` : `${label} (przed 1900)`; };
  set('[data-quick=parents]', 'parents', 'Pokolenie rodziców');
  set('[data-quick=grand]', 'grand', 'Pokolenie dziadków');
  const ch = $('[data-quick=children]'), rc = relative('children'); ch.disabled = !rc; ch.textContent = rc ? `Pokolenie dzieci (${rc.by})` : 'Pokolenie dzieci (po 2010)';
  $('[data-quick=place]').textContent = state.set === 'duze' ? 'Ta sama osoba na wsi' : 'Ta sama osoba w dużym mieście';
  $('[data-quick=sex]').textContent = state.sex === 'k' ? 'Mężczyzna z tego rocznika' : 'Kobieta z tego rocznika';
  $('#cmpRegion').innerHTML = `<option value="">Ten sam rocznik w innym regionie…</option>` + REGIONS.filter(r => r.id !== state.reg && regionValid(r, state.by)).map(r => `<option value="${r.id}">${esc(r.name)} · ${esc(r.city)}</option>`).join('');
  $('#cmpLead').textContent = cmpAuto
    ? (relative('parents') ? 'Na start porównanie z pokoleniem rodziców i dziadków w tym samym miejscu. Zmienia się razem z twoim wyborem. Twój wybór jest zawsze na niebiesko.' : 'Twój rocznik jest zbyt wczesny na rodziców w danych, więc na start porównanie z pokoleniem dzieci i wnuków. Twój wybór jest zawsze na niebiesko.')
    : 'Twój wybór jest zawsze na niebiesko. Możesz porównać go z dwoma innymi profilami; kolejny zastąpi najstarszy.';
}

/* ---------- Udostępnianie: link i karta PNG ---------- */
/* W przeglądarce karta pobiera się zwykłym linkiem; w podglądzie artefaktu Claude przez jego mechanizm pobierania. */
let dlCap = null, cardBlob = null;
try { if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(d => { dlCap = d; }).catch(() => {}); } catch (e) { /* brak */ }
const profileHash = () => `p-${state.by}-${state.reg}-${state.set}-${state.sex}`;
const profileLink = () => PUBLIC_URL + '#' + profileHash();
async function copyLink() {
  const link = profileLink(), st = $('#shareStatus');
  try { await navigator.clipboard.writeText(link); st.innerHTML = 'Skopiowano link do tego profilu.'; }
  catch (e) { st.innerHTML = `Skopiuj link ręcznie: <input id="linkBox" readonly value="${esc(link)}" aria-label="Link do profilu">`; const i = $('#linkBox'); i.focus(); i.select(); }
}
function wrapText(ctx, text, maxW) {
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
async function makeCard() {
  const p = currentProfile; if (!p) return;
  try { await Promise.all(['800 160px Archivo', '700 40px Archivo', '600 26px "IBM Plex Sans"', '400 24px "IBM Plex Sans"'].map(f => document.fonts.load(f))); } catch (e) { /* czcionki zastępcze */ }
  const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const C = { bg: '#fbfbfa', ink: '#15181b', ink2: '#444a51', ink3: '#6a7077', rule: '#d6dad9', fill: '#e3e6e5', acc: '#a3132b', bar: '#2a78d6' };
  x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
  x.fillStyle = C.acc; x.fillRect(0, 0, 14, H);
  const cond = f => { x.font = f; if ('fontStretch' in x) x.fontStretch = 'condensed'; };
  const norm = f => { x.font = f; if ('fontStretch' in x) x.fontStretch = 'normal'; };
  norm('600 20px "IBM Plex Sans", sans-serif'); x.fillStyle = C.acc; x.fillText('LOS ROCZNIKA · SZANSE AWANSU W POLSCE 1900–2010', 60, 70);
  norm('600 30px "IBM Plex Sans", sans-serif'); x.fillStyle = C.ink;
  wrapText(x, who(p), 560).slice(0, 3).forEach((l, i) => x.fillText(l, 60, 122 + i * 40));
  cond('800 190px Archivo, "Arial Narrow", sans-serif'); x.fillStyle = C.ink; x.fillText(String(Math.round(p.index)), 54, 420);
  const nw = x.measureText(String(Math.round(p.index))).width;
  norm('600 24px "IBM Plex Sans", sans-serif'); x.fillStyle = C.ink3; x.fillText('/ 100 · indeks szans', 64 + nw, 412);
  const vt = verdict(p.index); norm('700 24px "IBM Plex Sans", sans-serif'); const vw = x.measureText(vt).width + 32;
  x.fillStyle = C.ink; x.beginPath(); x.roundRect ? x.roundRect(60, 448, vw, 46, 23) : x.rect(60, 448, vw, 46); x.fill();
  x.fillStyle = C.bg; x.fillText(vt, 76, 480);
  const bx = 680, bw = 460; let by = 96;
  COMP.forEach(cmp => {
    const v = p.comps[cmp.k];
    norm('600 22px "IBM Plex Sans", sans-serif'); x.fillStyle = C.ink; x.fillText(cmp.name, bx, by);
    x.textAlign = 'right'; x.fillText(String(Math.round(v)), bx + bw, by); x.textAlign = 'left';
    x.fillStyle = C.fill; x.beginPath(); x.roundRect ? x.roundRect(bx, by + 12, bw, 10, 5) : x.rect(bx, by + 12, bw, 10); x.fill();
    x.fillStyle = C.bar; x.beginPath(); x.roundRect ? x.roundRect(bx, by + 12, Math.max(6, bw * v / 100), 10, 5) : x.rect(bx, by + 12, Math.max(6, bw * v / 100), 10); x.fill();
    by += 64;
  });
  x.fillStyle = C.rule; x.fillRect(60, 548, W - 120, 1);
  norm('400 20px "IBM Plex Sans", sans-serif'); x.fillStyle = C.ink2;
  x.fillText('Model na danych GUS, Maddison Project i Gapminder. Opisuje przeciętne warunki rocznika, nie los konkretnej osoby.', 60, 584);
  norm('600 20px "IBM Plex Sans", sans-serif'); x.fillStyle = C.acc; x.fillText(profileLink().replace('https://', ''), 60, 612);
  const url = c.toDataURL('image/png');
  cardBlob = await new Promise(r => c.toBlob(r, 'image/png'));
  $('#cardImg').src = url;
  const a = $('#cardDl'); a.href = url; a.download = `los-rocznika-${profileHash()}.png`;
  $('#cardMsg').textContent = 'Jeśli pobieranie nie ruszy, przytrzymaj obraz albo kliknij go prawym przyciskiem i wybierz „Zapisz obraz”.';
  $('#cardModal').hidden = false; $('#cardClose').focus();
}
function closeCard() { $('#cardModal').hidden = true; $('#makeCard').focus(); }
function renderCompare() {
  if (cmpAuto) saved = autoRelatives();
  const items = [{ ...state, slot: 1, current: true }, ...saved];
  const profs = items.map(it => ({ it, p: profile(it.by, it.reg, it.set, it.sex, state.preset) }));
  $('#cmpLegend').innerHTML = profs.map(({ it, p }, i) => `<li><span class="sw" style="background:var(--s${it.slot})"></span><span>${it.current ? '<b>Twój wybór:</b> ' : it.tag ? `<b>${esc(it.tag)}:</b> ` : ''}${esc(shortWho(it))}</span>${it.current ? '' : `<button class="x" data-i="${i - 1}" aria-label="Usuń z porównania">×</button><button class="ld" data-i="${i - 1}">Pokaż</button>`}</li>`).join('');
  $('#cmpLegend').querySelectorAll('.x').forEach(b => b.addEventListener('click', () => { cmpAuto = false; saved.splice(+b.dataset.i, 1); updateQuickButtons(); renderCompare(); }));
  $('#cmpLegend').querySelectorAll('.ld').forEach(b => b.addEventListener('click', () => { const s = saved[+b.dataset.i]; cmpAuto = false; saved = saved.slice(); setState({ by: s.by, reg: s.reg, set: s.set, sex: s.sex }); }));
  const rows = [{ k: 'idx', name: 'Indeks szans' }, ...COMP];
  const box = $('#cmpSvg'); const W = Math.max(300, box.clientWidth);
  const narrow = W < 520;
  const labW = narrow ? 0 : 160, labH = narrow ? 17 : 0, bh = 8, gap = 2, rowPad = narrow ? 12 : 14;
  const n = profs.length, rowH = labH + n * bh + (n - 1) * gap + rowPad;
  const H = rows.length * rowH + 8;
  const X = v => labW + v / 100 * (W - labW - 34);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Porównanie składowych indeksu dla ${n} profili">`;
  [0, 50, 100].forEach(v => s += `<line x1="${X(v)}" x2="${X(v)}" y1="0" y2="${H - 4}" class="grid"/>`);
  rows.forEach((r, ri) => {
    const y = ri * rowH + 6 + labH;
    s += `<text x="0" y="${narrow ? y - 5 : y + (n * (bh + gap)) / 2 + 3}" class="${r.k === 'idx' ? 'cmp-l b' : 'cmp-l'}">${esc(r.name)}</text>`;
    profs.forEach(({ it, p }, i) => {
      const v = r.k === 'idx' ? p.index : p.comps[r.k];
      const yy = y + i * (bh + gap);
      s += `<rect x="${labW}" y="${yy}" width="${Math.max(3, X(v) - labW)}" height="${bh}" rx="3" fill="var(--s${it.slot})"><title>${esc(shortWho(it))}: ${fmt(v)}</title></rect>`;
      s += `<text x="${X(v) + 4}" y="${yy + bh - 0.5}" class="cmp-v">${fmt(v)}</text>`;
    });
  });
  s += `</svg>`;
  box.innerHTML = s;

  const tb = $('#cmpTable');
  tb.innerHTML = `<thead><tr><th>Składowa</th>${profs.map(({ it }) => `<th>${esc(shortWho(it))}</th>`).join('')}</tr></thead><tbody>` + rows.map(r => `<tr><td>${esc(r.name)}</td>${profs.map(({ p }) => `<td>${fmt(r.k === 'idx' ? p.index : p.comps[r.k])}</td>`).join('')}</tr>`).join('') + '</tbody>';
}

function renderMethodWeights() {
  $('#wTable').innerHTML = `<thead><tr><th>Składowa</th>${Object.values(PRESETS).map(p => `<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>` + COMP.map(c => `<tr><td>${esc(c.name)}</td>${Object.values(PRESETS).map(p => `<td>${fmt(p.w[c.k] * 100, p.w[c.k] * 100 % 1 ? 1 : 0)}%</td>`).join('')}</tr>`).join('') + '</tbody>';
}

/* ---------- Start ---------- */
buildControls();
readHash();
fixRegion();
renderAll();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => renderHeat());
new MutationObserver(() => renderHeat()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
