/* ==========================================================
   What are we cooking? — tournament logic
   ========================================================== */

(() => {
  'use strict';

  /* ---------- The contenders ----------
     image: drop a photo at that path (assets/dishes/<id>.jpg) and it
     replaces the illustrated tile automatically. Missing files are fine. */
  const DISHES = [
    { id: 'paccheri',         emoji: '🫑', tint: ['#FCE3D3', '#F3A47F'],
      name: 'Paccheri con crema di peperoni',
      desc: 'Tubi giganti, crema rossa, zero rimpianti.',
      verdict: "Apparently, we're making paccheri." },
    { id: 'pesto',            emoji: '🍝', tint: ['#E8F0D8', '#B9CF8E'],
      name: 'Spaghetti pesto, patate e fagiolini',
      desc: 'Alla ligure: carboidrati sopra carboidrati, come da tradizione.',
      verdict: "Apparently, we're making pesto, patate e fagiolini." },
    { id: 'spatzle',          emoji: '🥬', tint: ['#E3EFDB', '#9DC08B'],
      name: 'Spätzle di spinaci',
      desc: 'Gnocchetti verdi dal nord. Vagamente alpini.',
      verdict: "Apparently, we're making spätzle." },
    { id: 'risotto-zucchine', emoji: '🥒', tint: ['#EEF3DC', '#C6D89A'],
      name: 'Risotto alle zucchine',
      desc: 'Cremoso, verde, rassicurante. Mantecatura obbligatoria.',
      verdict: "Apparently, we're making risotto alle zucchine." },
    { id: 'pasta-ceci',       emoji: '🫘', tint: ['#F6EBD3', '#DCC08A'],
      name: 'Pasta zucchine + crema di ceci',
      desc: 'La pasta che si crede un piatto sano. E ha ragione.',
      verdict: "Apparently, we're making pasta, zucchine e ceci." },
    { id: 'risotto-zucca',    emoji: '🎃', tint: ['#FDE6C8', '#F4AF5E'],
      name: 'Risotto alla zucca',
      desc: 'Arancione, autunnale: un abbraccio in forma di piatto.',
      verdict: "Apparently, we're making risotto alla zucca." },
    { id: 'pizza',            emoji: '🍕', tint: ['#FBDCD3', '#E9806A'],
      name: 'Pizza rossa',
      desc: 'Pomodoro, origano, impasto. Minimalismo che funziona.',
      verdict: "Apparently, we're making pizza." },
    { id: 'focaccia',         emoji: '🫓', tint: ['#F8ECD2', '#E3BF77'],
      name: 'Focaccia schiacciata',
      desc: 'Croccante fuori, unta il giusto. Va bene a qualsiasi ora.',
      verdict: "Apparently, we're making focaccia." },
    { id: 'gyoza',            emoji: '🥟', tint: ['#F5EADF', '#D9B99B'],
      name: 'Gyoza',
      desc: 'Ravioli da chiudere uno a uno. Terapeutico. Forse.',
      verdict: "Apparently, we're making gyoza." },
    { id: 'basmati',          emoji: '🍚', tint: ['#F1EEE4', '#CFC4A6'],
      name: 'Riso basmati + tofu + lenticchie + verdure saltate',
      desc: 'Il piatto più equilibrato del torneo. E lo sa.',
      verdict: "Apparently, we're making a very balanced bowl." },
    { id: 'noodles',          emoji: '🍜', tint: ['#FBEBCB', '#EFC56A'],
      name: 'Noodles alle verdure',
      desc: 'Wok, fuoco alto, verdure che saltano. Spettacolo incluso.',
      verdict: "Apparently, we're making noodles." },
    { id: 'thai-curry',       emoji: '🍛', tint: ['#FCE8C9', '#E9A64B'],
      name: 'Thai curry + riso',
      desc: 'Latte di cocco, spezie, un filo di piccante. Un filo, giuro.',
      verdict: "Apparently, we're making thai curry." },
    { id: 'piadina',          emoji: '🌯', tint: ['#F6E7D6', '#D7AD84'],
      name: 'Piadina ripiena',
      desc: 'Piegata, farcita, impossibile da mangiare con eleganza.',
      verdict: "Apparently, we're making piadine." },
    { id: 'hummus',           emoji: '🧆', tint: ['#F4EAD8', '#D2B98D'],
      name: 'Hummus + verdure saltate',
      desc: 'Ceci frullati con autostima, più verdure in padella.',
      verdict: "Apparently, we're making hummus." },
    { id: 'vellutata',        emoji: '🥣', tint: ['#FDEBD5', '#F0B47A'],
      name: 'Vellutata + crostini',
      desc: 'Morbida e calda, con i crostini per il dramma croccante.',
      verdict: "Apparently, we're making vellutata." },
    { id: 'patate',           emoji: '🥔', tint: ['#FFF1C7', '#F2C94C'],
      name: 'Funny-shaped potatoes al forno',
      desc: 'Patate al forno, ma con forme discutibili. Nessuno le ha invitate.',
      verdict: "Apparently, we're making funny-shaped potatoes. No further questions." },
  ].map(d => ({ ...d, image: `assets/dishes/${d.id}.jpg` }));

  const BY_ID = Object.fromEntries(DISHES.map(d => [d.id, d]));
  const WILDCARD = 'patate';
  const TOTAL_MATCHES = DISHES.length - 1;
  const STORAGE_KEY = 'what-are-we-cooking:v1';

  const ROUND_NAMES = { 16: 'Round of 16', 8: 'Quarti di finale', 4: 'Semifinali', 2: 'Finale' };
  const ROUND_SUBS = {
    8: 'Ne restano otto. Si fa sul serio.',
    4: 'Quattro piatti, due posti in finale.',
    2: "Tutto si decide qui. Nessuna pressione.",
  };
  const OUT_LABELS = { 16: 'Out al primo turno', 8: 'Out ai quarti', 4: 'Out in semifinale', 2: '🥈 Finalista' };

  /* ---------- Microcopy ---------- */
  const QUIPS = [
    'Segui lo stomaco, non la ragione.',
    'Nessuna risposta sbagliata. Quasi.',
    'Prenditi il tempo che serve. Ma non troppo, ho fame.',
    'Prima impressione. Vai.',
    'Il tuo stomaco sa già la risposta.',
    'Scelta difficile. Respira.',
    'Chi esita, cucina dopo.',
    'Una scelta che verrà ricordata.',
    'Immagina di averlo già nel piatto.',
  ];
  const WILDCARD_QUIPS = [
    '⚠️ Wildcard in campo. Procedere con cautela.',
    'Le patate buffe sono qui. Non chiedere perché.',
    'Avvistata una forma sospetta.',
  ];
  const WILDCARD_WIN = [
    'Le patate avanzano. Nessuno sa come.',
    'Upset! Le patate non si fermano.',
    'Le patate sono ancora in gara. Rispetto.',
  ];
  const WILDCARD_LOSE = [
    'Le patate tornano a casa. A testa alta.',
    'Addio, patate buffe. Ci avete fatto sorridere.',
  ];
  const WINNER_LINES = [
    'Decisione presa. Non si torna indietro.',
    'Il destino ha parlato.',
    'La scienza non sbaglia.',
    'Il popolo ha scelto. (Il popolo sei tu.)',
  ];
  const WILDCARD_WINNER_LINE = 'Contro ogni pronostico. Le patate buffe sono campionesse.';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- DOM ---------- */
  const $ = sel => document.querySelector(sel);
  const els = {
    screens: { intro: $('#screen-intro'), game: $('#screen-game'), winner: $('#screen-winner') },
    start: $('#start-btn'),
    peek: $('#peek-btn'),
    marquee: $('#marquee'),
    roundLabel: $('#round-label'),
    roundCount: $('#round-count'),
    progress: $('#progress'),
    progressFill: $('#progress-fill'),
    quip: $('#quip'),
    arena: $('#arena'),
    restart: $('#restart-btn'),
    winnerEyebrow: $('#winner-eyebrow'),
    winnerMedia: $('#winner-media'),
    winnerName: $('#winner-name'),
    winnerVerdict: $('#winner-verdict'),
    winnerLine: $('#winner-line'),
    winnerPath: $('#winner-path'),
    share: $('#share-btn'),
    again: $('#again-btn'),
    all: $('#all-btn'),
    interstitial: $('#interstitial'),
    interKicker: $('#inter-kicker'),
    interTitle: $('#inter-title'),
    interSub: $('#inter-sub'),
    dialog: $('#dishes-dialog'),
    dishList: $('#dish-list'),
    dialogClose: $('#dialog-close'),
    toast: $('#toast'),
    confetti: $('#confetti'),
  };

  /* ---------- Helpers ---------- */
  const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function joinNames(names) {
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
  }

  /* ---------- State ---------- */
  function newTournament() {
    return {
      screen: 'game',
      round: shuffle(DISHES.map(d => d.id)), // dishes in the current round, paired in order
      next: [],                              // winners advancing to the next round
      match: 0,                              // index of the current pair
      beaten: {},                            // id -> [ids it eliminated]
      out: {},                               // id -> size of the round it lost in
      winner: null,
      line: 0,
    };
  }

  function save() {
    if (state.received) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!s || typeof s !== 'object') return null;
      if (s.screen === 'winner' && BY_ID[s.winner]) return s;
      if (s.screen === 'game'
          && Array.isArray(s.round) && ROUND_NAMES[s.round.length]
          && s.round.every(id => BY_ID[id])
          && Array.isArray(s.next)
          && Number.isInteger(s.match) && s.match * 2 < s.round.length) {
        s.beaten = s.beaten || {};
        s.out = s.out || {};
        return s;
      }
    } catch (e) { /* corrupted or unavailable */ }
    return null;
  }

  function readVerdictFromUrl() {
    const m = location.hash.match(/verdict=([\w-]+)/);
    return m && BY_ID[m[1]] ? m[1] : null;
  }

  function clearHash() {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  let state = { screen: 'intro' };
  let busy = false;

  const currentPair = () => [state.round[state.match * 2], state.round[state.match * 2 + 1]];

  /** Records a result. Returns 'match' | 'round' | 'winner'. */
  function advance(winnerId, loserId) {
    state.next.push(winnerId);
    (state.beaten[winnerId] = state.beaten[winnerId] || []).push(loserId);
    state.out[loserId] = state.round.length;
    state.match++;

    let result = 'match';
    if (state.match * 2 >= state.round.length) {
      if (state.next.length === 1) {
        state.winner = winnerId;
        state.screen = 'winner';
        state.line = Math.floor(Math.random() * WINNER_LINES.length);
        result = 'winner';
      } else {
        state.round = state.next;
        state.next = [];
        state.match = 0;
        result = 'round';
      }
    }
    save();
    return result;
  }

  /* ---------- Media tiles (illustration + optional photo) ---------- */
  const missingImages = new Set();

  function createMedia(dish) {
    const media = document.createElement('div');
    media.className = 'media';
    media.style.setProperty('--t1', dish.tint[0]);
    media.style.setProperty('--t2', dish.tint[1]);

    const emoji = document.createElement('span');
    emoji.className = 'media-emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = dish.emoji;
    media.appendChild(emoji);

    if (dish.image && !missingImages.has(dish.image)) {
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.addEventListener('load', () => {
        media.appendChild(img);
        requestAnimationFrame(() => img.classList.add('is-loaded'));
      });
      img.addEventListener('error', () => missingImages.add(dish.image));
      img.src = dish.image;
    }
    return media;
  }

  /* ---------- Screens ---------- */
  function showScreen(name) {
    Object.entries(els.screens).forEach(([key, el]) => {
      const active = key === name;
      el.hidden = !active;
      if (active) {
        el.classList.remove('is-entering');
        void el.offsetWidth; // restart animation
        el.classList.add('is-entering');
      }
    });
    window.scrollTo(0, 0);
  }

  /* ---------- Game ---------- */
  function buildCard(dish, side) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card is-entering' + (dish.id === WILDCARD ? ' is-wildcard' : '');
    card.dataset.side = side;
    card.setAttribute('aria-label', `Scegli: ${dish.name}`);

    if (dish.id === WILDCARD) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'WILDCARD 🃏';
      card.appendChild(badge);
    }

    card.appendChild(createMedia(dish));

    const body = document.createElement('span');
    body.className = 'card-body';
    body.innerHTML = `
      <span class="card-text">
        <span class="card-name"></span>
        <span class="card-desc"></span>
      </span>
      <span class="card-pick" aria-hidden="true"></span>`;
    body.querySelector('.card-name').textContent = dish.name;
    body.querySelector('.card-desc').textContent = dish.desc;
    card.appendChild(body);
    return card;
  }

  function renderGame() {
    const size = state.round.length;
    const remaining = size / 2 - state.match;
    const done = (DISHES.length - size) + state.match;
    const pair = currentPair();

    els.roundLabel.textContent = ROUND_NAMES[size];
    els.roundCount.textContent = size === 2
      ? "L'ultima sfida"
      : `${remaining} ${remaining === 1 ? 'sfida rimanente' : 'sfide rimanenti'}`;
    els.progressFill.style.width = `${(done / TOTAL_MATCHES) * 100}%`;
    els.progress.setAttribute('aria-valuenow', String(done));

    let quip;
    if (pair.includes(WILDCARD) && size === 2) quip = 'Le patate sono in finale. Sta succedendo davvero.';
    else if (pair.includes(WILDCARD)) quip = randomItem(WILDCARD_QUIPS);
    else if (done === 0) quip = 'Tocca il piatto che preferisci.';
    else if (size === 2) quip = 'Tutto si decide qui.';
    else quip = randomItem(QUIPS);
    els.quip.textContent = quip;

    const vs = document.createElement('span');
    vs.className = 'vs is-entering';
    vs.setAttribute('aria-hidden', 'true');
    vs.textContent = 'vs';

    els.arena.classList.remove('is-deciding');
    els.arena.replaceChildren(buildCard(BY_ID[pair[0]], 0), vs, buildCard(BY_ID[pair[1]], 1));

    preloadNextPair();
  }

  function preloadNextPair() {
    const ids = [state.round[state.match * 2 + 2], state.round[state.match * 2 + 3]];
    ids.forEach(id => {
      const d = BY_ID[id];
      if (d && !missingImages.has(d.image)) {
        const img = new Image();
        img.onerror = () => missingImages.add(d.image);
        img.src = d.image;
      }
    });
  }

  function choose(side) {
    if (busy || state.screen !== 'game') return;
    busy = true;

    const pair = currentPair();
    const winnerId = pair[side];
    const loserId = pair[1 - side];

    const cards = els.arena.querySelectorAll('.card');
    els.arena.classList.add('is-deciding');
    cards[side].classList.add('is-chosen');
    cards[1 - side].classList.add('is-dropped');
    if (navigator.vibrate) navigator.vibrate(12);

    const result = advance(winnerId, loserId);

    setTimeout(() => {
      if (result !== 'winner') {
        if (winnerId === WILDCARD) toast(randomItem(WILDCARD_WIN));
        else if (loserId === WILDCARD) toast(randomItem(WILDCARD_LOSE));
      }

      if (result === 'winner') {
        busy = false;
        goWinner();
      } else if (result === 'round') {
        showInterstitial(() => { renderGame(); busy = false; });
      } else {
        renderGame();
        busy = false;
      }
    }, reduceMotion ? 200 : 680);
  }

  function showInterstitial(onDone) {
    const size = state.round.length;
    els.interKicker.textContent = size === 2 ? 'Ci siamo' : 'Prossimo round';
    els.interTitle.textContent = ROUND_NAMES[size];
    els.interSub.textContent = ROUND_SUBS[size] || '';
    els.interstitial.classList.remove('is-out');
    els.interstitial.hidden = false;

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      onDone();
      els.interstitial.classList.add('is-out');
      setTimeout(() => {
        els.interstitial.hidden = true;
        els.interstitial.classList.remove('is-out');
      }, 300);
    };
    const timer = setTimeout(close, reduceMotion ? 1000 : 1600);
    els.interstitial.onclick = close;
  }

  function startNew() {
    clearHash();
    state = newTournament();
    save();
    showScreen('game');
    renderGame();
  }

  /* Two-tap restart instead of a native confirm() */
  let armTimer = null;
  function disarmRestart() {
    clearTimeout(armTimer);
    els.restart.classList.remove('is-armed');
    els.restart.textContent = '↺ Ricomincia';
  }

  function onRestart() {
    if (els.restart.classList.contains('is-armed')) {
      disarmRestart();
      startNew();
      toast('Nuovo sorteggio. Tutto da rifare.');
      return;
    }
    els.restart.classList.add('is-armed');
    els.restart.textContent = 'Sicuro? Tocca ancora';
    armTimer = setTimeout(disarmRestart, 3000);
  }

  /* ---------- Winner ---------- */
  function goWinner() {
    showScreen('winner');
    renderWinner();
    confetti();
  }

  function renderWinner() {
    const d = BY_ID[state.winner];

    els.winnerEyebrow.textContent = state.received ? 'The verdict is in' : 'We have a winner';
    els.winnerMedia.replaceChildren(createMedia(d));
    els.winnerName.textContent = `${d.name} ${d.emoji}`;
    els.winnerVerdict.textContent = `“${d.verdict}”`;
    els.winnerLine.textContent = d.id === WILDCARD
      ? WILDCARD_WINNER_LINE
      : WINNER_LINES[state.line] || WINNER_LINES[0];

    const beaten = (state.beaten[d.id] || []).map(id => BY_ID[id].name);
    els.winnerPath.textContent = beaten.length ? `Lungo la strada ha battuto ${joinNames(beaten)}.` : '';

    els.share.hidden = !!state.received;
  }

  async function shareVerdict() {
    const d = BY_ID[state.winner];
    const url = `${location.origin}${location.pathname}#verdict=${d.id}`;
    const text = `🏆 Abbiamo un vincitore: ${d.name} ${d.emoji}\n“${d.verdict}”`;

    if (navigator.share) {
      try { await navigator.share({ title: 'What are we cooking?', text, url }); } catch (e) { /* dismissed */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast('Copiato. Ora incollalo in chat 📋');
    } catch (e) {
      toast('Non riesco a copiare. Uno screenshot va benissimo.');
    }
  }

  /* ---------- All dishes ---------- */
  function statusFor(id) {
    if (state.winner === id) return { label: '🏆 Vincitore', cls: 'is-winner' };
    const outIn = state.out && state.out[id];
    if (outIn) {
      const label = id === WILDCARD && outIn !== 2 ? 'Out, ma con stile' : OUT_LABELS[outIn];
      return { label, cls: outIn === 2 ? '' : 'is-out' };
    }
    if (state.screen === 'game') return { label: 'In gara', cls: '' };
    return { label: id === WILDCARD ? 'Wildcard 🃏' : '', cls: '' };
  }

  function openDishes() {
    const items = DISHES.map(d => {
      const li = document.createElement('li');
      const status = statusFor(d.id);
      li.className = `dish-item ${status.cls}`.trim();
      li.appendChild(createMedia(d));

      const text = document.createElement('div');
      text.className = 'dish-text';
      text.innerHTML = '<p class="dish-name"></p><p class="dish-desc"></p>';
      text.querySelector('.dish-name').textContent = d.name;
      text.querySelector('.dish-desc').textContent = d.desc;
      if (status.label) {
        const s = document.createElement('span');
        s.className = 'dish-status';
        s.textContent = status.label;
        text.appendChild(s);
      }
      li.appendChild(text);
      return li;
    });
    els.dishList.replaceChildren(...items);

    if (typeof els.dialog.showModal === 'function') els.dialog.showModal();
    else els.dialog.setAttribute('open', '');
  }

  function closeDishes() {
    if (typeof els.dialog.close === 'function') els.dialog.close();
    else els.dialog.removeAttribute('open');
  }

  /* ---------- Toast & confetti ---------- */
  let toastTimer = null;
  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('is-visible'), 2600);
  }

  function confetti() {
    if (reduceMotion) return;
    const colors = ['#D9573A', '#F2B544', '#9DC08B', '#F3A47F', '#2A221D'];
    const pieces = [];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('span');
      p.className = 'confetti-piece' + (Math.random() < 0.3 ? ' is-round' : '');
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = randomItem(colors);
      p.style.setProperty('--x', `${(Math.random() - 0.5) * 160}px`);
      p.style.setProperty('--r', `${(Math.random() - 0.5) * 1080}deg`);
      p.style.setProperty('--d', `${2.2 + Math.random() * 1.8}s`);
      p.style.setProperty('--delay', `${Math.random() * 0.6}s`);
      pieces.push(p);
    }
    els.confetti.replaceChildren(...pieces);
    setTimeout(() => els.confetti.replaceChildren(), 5000);
  }

  /* ---------- Intro ---------- */
  function buildMarquee() {
    const spans = [...DISHES, ...DISHES].map(d => {
      const s = document.createElement('span');
      s.textContent = d.emoji;
      return s;
    });
    els.marquee.replaceChildren(...spans);
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    els.start.addEventListener('click', startNew);
    els.peek.addEventListener('click', openDishes);
    els.restart.addEventListener('click', onRestart);
    els.again.addEventListener('click', startNew);
    els.all.addEventListener('click', openDishes);
    els.share.addEventListener('click', shareVerdict);
    els.dialogClose.addEventListener('click', closeDishes);
    els.dialog.addEventListener('click', e => { if (e.target === els.dialog) closeDishes(); });

    els.arena.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (card) choose(Number(card.dataset.side));
    });

    document.addEventListener('keydown', e => {
      if (state.screen !== 'game' || els.dialog.open || !els.interstitial.hidden) return;
      if (['ArrowLeft', 'ArrowUp', '1'].includes(e.key)) { e.preventDefault(); choose(0); }
      if (['ArrowRight', 'ArrowDown', '2'].includes(e.key)) { e.preventDefault(); choose(1); }
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    buildMarquee();
    bindEvents();

    const verdict = readVerdictFromUrl();
    if (verdict) {
      // Someone sent back their result: show it without touching the local game.
      state = { screen: 'winner', winner: verdict, beaten: {}, out: {}, line: 0, received: true };
      goWinner();
      return;
    }

    state = load() || { screen: 'intro' };
    if (state.screen === 'game') {
      showScreen('game');
      renderGame();
      if (state.match > 0 || state.round.length < DISHES.length) {
        toast('Partita ripresa. Nessuna scelta è andata persa.');
      }
    } else if (state.screen === 'winner') {
      showScreen('winner');
      renderWinner();
    } else {
      showScreen('intro');
    }
  }

  init();
})();
