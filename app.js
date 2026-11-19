/* =========================================================
   Environpac Customer Portal: Crave demo (mock data only)
   ========================================================= */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('en-US');
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const TODAY = new Date();
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const fdate = (d, y) => d.toLocaleDateString('en-US', y ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- DATA ---------------- */
const SKUS = [
  { id: 'bowl',    name: '44 oz Kraft Salad Bowl', sub: 'with clear PET lid', code: 'CRV-BWL-44', img: 'assets/bowl-44oz.jpg',
    onHand: 6200, weekly: 650, price: 0.38, full: 15000, specs: ['44 oz / 1300 ml', 'Black kraft, PE lined', 'Clear PET dome lid', 'Logo + both locations + QR'] },
  { id: 'soup',    name: '16 oz Soup & Sauce Cup', sub: 'with vented paper lid', code: 'CRV-SCP-16', img: 'assets/soup-cup.jpg',
    onHand: 1850, weekly: 740, price: 0.21, full: 12000, specs: ['16 oz / 473 ml', 'Double-PE, leak resistant', 'Hot & cold safe', '2-side print · sauce menu'] },
  { id: 'napkins', name: 'Cocktail Napkins', sub: '2-ply black · gold foil logo', code: 'CRV-NAP-CK', img: 'assets/napkins.jpg',
    onHand: 18400, weekly: 1900, price: 0.045, full: 30000, specs: ['5 × 5 in folded', '2-ply premium tissue', 'Black with white + gold print', 'Packed 500 / sleeve'] },
  { id: 'pizza12', name: '12″ Kraft Pizza Box', sub: 'corrugated · 1-color print', code: 'CRV-PZB-12', img: 'assets/pizza-box.jpg', badge: '12″',
    onHand: 3100, weekly: 820, price: 0.62, full: 12000, specs: ['12 × 12 × 1.75 in', 'E-flute kraft corrugated', 'Grease resistant', 'Menu highlights + QR'] },
  { id: 'pizza16', name: '16″ Kraft Pizza Box', sub: 'corrugated · 1-color print', code: 'CRV-PZB-16', img: 'assets/pizza-box.jpg', badge: '16″',
    onHand: 4400, weekly: 560, price: 0.84, full: 12000, specs: ['16 × 16 × 2 in', 'E-flute kraft corrugated', 'Grease resistant', 'Menu highlights + QR'] },
  { id: 'bag',     name: 'Black Kraft Shopping Bag', sub: 'twisted white handle', code: 'CRV-BAG-BK', img: 'assets/bag.jpg',
    onHand: 7900, weekly: 600, price: 0.29, full: 12000, specs: ['10 × 5 × 13 in', '120 gsm black kraft', 'Twisted paper handles', '3-side print · socials + QR'] },
];
const SKU = Object.fromEntries(SKUS.map(s => [s.id, s]));
const SKU_COLORS = { bowl: '#1b1714', soup: '#b8873a', napkins: '#d9c39b', pizza12: '#8a5f22', pizza16: '#d4a95c', bag: '#5c5248' };
const STAGES = ['Artwork approved', 'In production', 'Quality check', 'At sea', 'In warehouse'];

const ORDERS = [
  { id: 'EP-2618', placed: 'Nov 3, 2026', eta: 'Jan 14, 2027', stage: 1, items: [{ sku: 'soup', qty: 10000 }] },
  { id: 'EP-2611', placed: 'Sep 29, 2026', eta: 'Dec 9, 2026', stage: 3, items: [{ sku: 'bowl', qty: 10000 }, { sku: 'pizza16', qty: 5000 }] },
  { id: 'EP-2594', placed: 'Aug 18, 2026', eta: 'Oct 21, 2026', stage: 4, items: [{ sku: 'bag', qty: 8000 }, { sku: 'napkins', qty: 20000 }] },
  { id: 'EP-2570', placed: 'Jul 14, 2026', eta: 'Sep 15, 2026', stage: 4, items: [{ sku: 'pizza12', qty: 10000 }] },
  { id: 'EP-2532', placed: 'Apr 20, 2026', eta: 'Jun 22, 2026', stage: 4, items: [{ sku: 'bowl', qty: 10000 }, { sku: 'soup', qty: 10000 }] },
  { id: 'EP-2488', placed: 'Jan 26, 2026', eta: 'Apr 2, 2026', stage: 4, items: [{ sku: 'napkins', qty: 40000 }, { sku: 'bag', qty: 10000 }, { sku: 'pizza16', qty: 8000 }] },
];
const orderValue = o => o.customPrice ?? o.items.reduce((a, i) => a + i.qty * SKU[i.sku].price, 0);
const plural = n => /s$/.test(n) ? n : /x$/.test(n) ? n + 'es' : n + 's';

const LEDGER = [
  { date: 'Jan 14, 2027', ref: 'EP-2618', desc: 'Balance (50%) on arrival', type: 'Balance', amount: 1050, status: 'Upcoming' },
  { date: 'Dec 9, 2026',  ref: 'EP-2611', desc: 'Balance (50%) on arrival', type: 'Balance', amount: 4000, status: 'Due' },
  { date: 'Nov 10, 2026', ref: 'EP-2618', desc: 'Deposit (50%) · ACH',      type: 'Deposit', amount: 1050, status: 'Paid' },
  { date: 'Oct 21, 2026', ref: 'EP-2594', desc: 'Balance (50%) · ACH',      type: 'Balance', amount: 1610, status: 'Paid' },
  { date: 'Oct 2, 2026',  ref: 'EP-2611', desc: 'Deposit (50%) · ACH',      type: 'Deposit', amount: 4000, status: 'Paid' },
  { date: 'Sep 15, 2026', ref: 'EP-2570', desc: 'Balance (50%) · ACH',      type: 'Balance', amount: 3100, status: 'Paid' },
  { date: 'Aug 20, 2026', ref: 'EP-2594', desc: 'Deposit (50%) · Card',     type: 'Deposit', amount: 1610, status: 'Paid' },
  { date: 'Jul 16, 2026', ref: 'EP-2570', desc: 'Deposit (50%) · ACH',      type: 'Deposit', amount: 3100, status: 'Paid' },
  { date: 'Jun 22, 2026', ref: 'EP-2532', desc: 'Balance (50%) · ACH',      type: 'Balance', amount: 2950, status: 'Paid' },
  { date: 'Apr 22, 2026', ref: 'EP-2532', desc: 'Deposit (50%) · ACH',      type: 'Deposit', amount: 2950, status: 'Paid' },
  { date: 'Apr 2, 2026',  ref: 'EP-2488', desc: 'Balance (50%) · Check',    type: 'Balance', amount: 5710, status: 'Paid' },
  { date: 'Jan 28, 2026', ref: 'EP-2488', desc: 'Deposit (50%) · ACH',      type: 'Deposit', amount: 5710, status: 'Paid' },
];

const USAGE = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  sets: [
    { label: 'Napkins', data: [9800, 11200, 10800, 8200, 7600, 7800], color: '#e2cfa8' },
    { label: 'Bowls & cups', data: [6200, 7400, 7100, 5600, 5300, 5400], color: '#1b1714' },
    { label: 'Pizza boxes', data: [5400, 6300, 6000, 4700, 4500, 4900], color: '#b8873a' },
    { label: 'Bags', data: [3100, 3600, 3400, 2600, 2400, 2500], color: '#8a7c6b' },
  ]
};

const CUSTOMERS = [
  { name: 'Crave Italian Oven & Bar', loc: 'Myrtle Beach, SC', skus: 6, crave: true, last: 'Online now' },
  { name: 'Harbor Bean Coffee Co.', loc: 'Charleston, SC', skus: 4, units: 52300, health: 'ok', bal: 6400, last: '2 hours ago', c: '#2f78a8' },
  { name: 'Saltmarsh Taqueria', loc: 'Mt Pleasant, SC', skus: 3, units: 18900, health: 'warn', bal: 2150, last: 'Yesterday', c: '#c2412d' },
  { name: 'Pluff Mud Smoothie Bar', loc: 'Folly Beach, SC', skus: 5, units: 33750, health: 'ok', bal: 0, last: '3 days ago', c: '#3e8e5a' },
  { name: 'Battery Street Bakehouse', loc: 'Charleston, SC', skus: 6, units: 27400, health: 'low', bal: 8920, last: 'Today', c: '#7a52b3' },
  { name: 'Palmetto Dunes Resort Café', loc: 'Hilton Head, SC', skus: 7, units: 88200, health: 'ok', bal: 21500, last: '5 days ago', c: '#d18a1c' },
];
const OTHER_UNITS = 470200, OTHER_BAL = 38970;

const alertLog = [
  { t: 'Low-stock alert sent to Crave: 16 oz Soup Cups', w: 'Today' },
  { t: 'Arrival reminder sent to Crave: EP-2611 lands Dec 9', w: 'Mon' },
  { t: 'Low-stock alert sent to Battery Street Bakehouse', w: 'Mon' },
];

/* ---------------- DERIVED ---------------- */
const vis = { payments: true, incoming: true, insights: true };
let syncAt = Date.now();

function incomingFor(id) {
  return ORDERS.filter(o => o.stage < 4).reduce((a, o) => a + o.items.filter(i => i.sku === id).reduce((b, i) => b + i.qty, 0), 0);
}
const weeksLeft = s => s.onHand / s.weekly;
function statusOf(s) {
  const w = weeksLeft(s);
  if (w < 3) return { k: 'low', t: 'Low stock' };
  if (w < 5) return { k: 'warn', t: 'Reorder soon' };
  return { k: 'ok', t: 'Healthy' };
}
const totals = () => {
  const units = SKUS.reduce((a, s) => a + s.onHand, 0);
  const incoming = SKUS.reduce((a, s) => a + incomingFor(s.id), 0);
  const invested = ORDERS.reduce((a, o) => a + orderValue(o), 0);
  const balance = LEDGER.filter(l => l.status !== 'Paid').reduce((a, l) => a + l.amount, 0);
  const paid = LEDGER.filter(l => l.status === 'Paid').reduce((a, l) => a + l.amount, 0);
  return { units, incoming, invested, balance, paid };
};

/* ---------------- COUNT UP ---------------- */
function countTo(el, to) {
  const isMoney = el.hasAttribute('data-money');
  const from = +el.dataset.val || 0;
  el.dataset.val = to;
  if (reduceMotion || from === to) { el.textContent = isMoney ? money(to) : fmt(to); return; }
  const dur = from === 0 ? 1600 : 900, t0 = performance.now();
  const step = t => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
    const v = from + (to - from) * e;
    el.textContent = isMoney ? money(v) : fmt(v);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function updateCounts() {
  const t = totals();
  $$('[data-count]').forEach(el => { if (t[el.dataset.count] !== undefined) countTo(el, t[el.dataset.count]); });
  $('#heroIncoming').textContent = fmt(t.incoming);
  const due = LEDGER.filter(l => l.status === 'Due');
  $('#nextDue').textContent = due.length ? `${money(due[0].amount)} due ${due[0].date.replace(/, \d{4}/, '')}` : 'Nothing due right now';
  $('#nextDue').className = 'delta ' + (due.length ? 'warn' : 'up');
}

/* ---------------- REVEAL ---------------- */
const io = new IntersectionObserver(entries => {
  let i = 0;
  entries.filter(e => e.isIntersecting).forEach(e => {
    const el = e.target;
    el.style.setProperty('--d', (i++ * 0.07) + 's');
    el.classList.add('in');
    io.unobserve(el);
    setTimeout(() => animateInside(el), 250 + i * 70);
  });
}, { threshold: 0.12 });
function observeReveals(root = document) {
  $$('.view.active .reveal:not(.in)', root).forEach(el => io.observe(el));
}
function animateInside(el) {
  $$('.bar i[data-w]', el).forEach(b => b.style.width = b.dataset.w);
  $$('.bar .incoming[data-w]', el).forEach(b => { b.style.left = b.dataset.l; b.style.width = b.dataset.w; });
  $$('.steps .fill[data-w]', el).forEach(b => b.style.width = b.dataset.w);
}

/* ---------------- RENDER: products ---------------- */
function productCard(s) {
  const st = statusOf(s), inc = incomingFor(s.id);
  const pct = Math.min(100, s.onHand / s.full * 100);
  const ipct = Math.min(100 - pct, inc / s.full * 100);
  const wl = weeksLeft(s);
  return `<article class="pcard reveal" data-sku="${s.id}">
    <div class="pimg"><img src="${s.img}" alt="${s.name}" loading="lazy">${s.badge ? `<span class="size-badge">${s.badge}</span>` : ''}<span class="status-pill ${st.k}">${st.t}</span></div>
    <div class="pbody">
      <div class="ptitle"><div><h4>${s.name}</h4><small>${s.sub}</small></div>
        <div class="pnum"><b data-sku-count="${s.id}">${fmt(s.onHand)}</b><small>on hand</small></div></div>
      <div class="bar"><i class="${st.k}" data-w="${pct}%"></i>${inc && vis.incoming ? `<span class="incoming" data-l="${pct}%" data-w="${ipct}%" style="left:${pct}%"></span>` : ''}</div>
      <div class="pmeta"><span>≈ <b>${wl < 1 ? '<1' : wl.toFixed(1)} weeks</b> left</span>${inc && vis.incoming ? `<span class="sea">+${fmt(inc)} incoming</span>` : `<span>${fmt(s.weekly)} / week</span>`}</div>
    </div></article>`;
}
function renderProducts() {
  const wrap = $('#products');
  wrap.innerHTML = SKUS.map(productCard).join('');
  $$('.pcard', wrap).forEach(c => c.addEventListener('click', () => openDrawer(c.dataset.sku)));
  observeReveals(wrap);
}

/* ---------------- RENDER: insights ---------------- */
const ICON = {
  alert: '<svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
  trend: '<svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8m0 0h-6m6 0v6"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  ship: '<svg viewBox="0 0 24 24"><path d="M3 17h18l-2 4H5l-2-4Zm3-1V9h12v7M9 9V5h6v4"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8"/></svg>',
};
function insightsData() {
  const out = [];
  SKUS.forEach(s => {
    const st = statusOf(s), wl = weeksLeft(s), runOut = fdate(addDays(TODAY, Math.round(wl * 7)));
    const nextOrd = ORDERS.find(o => o.stage < 4 && o.items.some(i => i.sku === s.id));
    if (st.k === 'low') out.push({ k: 'low', ico: 'alert', sku: s.id, html:
      `<b>${plural(s.name)}: ${fmt(s.onHand)} left.</b> That's about ${wl.toFixed(1)} weeks at your current pace (runs out ~${runOut}).${nextOrd ? ` Your next batch arrives ${nextOrd.eta.replace(/, \d{4}/, '')}, so you may want to bridge the gap.` : ''}`, btn: 'Reorder now' });
    else if (st.k === 'warn') out.push({ k: 'warn', ico: 'trend', sku: s.id, html:
      `<b>${plural(s.name)}: usage up 22%</b> over the last 4 weeks. At this pace, plan a reorder before ${runOut}.`, btn: 'Plan reorder' });
  });
  out.push({ k: 'ok', ico: 'save', html: `<b>Saving tip:</b> combine your next bowl + soup cup run into one container to save about <b>$310</b> in freight.`, btn: 'Tell me more', toast: 'Your Environpac rep will send a combined-shipment quote (demo)' });
  if (out.length < 3) out.unshift({ k: 'ok', ico: 'check', html: `<b>All stock healthy.</b> Every product has 3+ weeks of cover. Nice work, Crave!`, btn: 'View inventory', go: 'inventory' });
  return out.slice(0, 3);
}
function renderInsights() {
  const tint = { low: ['var(--low-soft)', 'var(--low)'], warn: ['var(--warn-soft)', 'var(--warn)'], ok: ['var(--gold-soft)', 'var(--gold)'] };
  $('#insList').innerHTML = insightsData().map((n, i) => `
    <div class="ins ${n.k === 'low' ? 'urgent' : ''}">
      <span class="ins-ico" style="background:${tint[n.k][0]};color:${tint[n.k][1]}">${ICON[n.ico]}</span>
      <div><p>${n.html}</p><button class="btn ${i === 0 && n.k !== 'ok' ? 'btn-primary' : 'btn-outline'}" ${n.sku ? `data-reorder="${n.sku}"` : n.go ? `data-goto="${n.go}"` : `data-toast="${n.toast}"`}>${n.btn}</button></div>
    </div>`).join('');
}

/* ---------------- RENDER: orders ---------------- */
function stagePill(o) {
  if (o.requested) return '<span class="status-pill warn">Requested</span>';
  const k = o.stage === 3 ? 'sea' : o.stage === 4 ? 'ok' : 'prod';
  return `<span class="status-pill ${k}">${STAGES[o.stage]}</span>`;
}
function steps(o) {
  const w = (Math.min(o.stage, 4) / 4) * 80;
  return `<div class="steps"><span class="fill" data-w="${w}%"></span>${STAGES.map((n, i) =>
    `<div class="step ${i < o.stage || o.stage === 4 ? 'done' : i === o.stage ? 'now' : ''}"><i></i>${n.replace('Artwork approved', 'Artwork').replace('Quality check', 'QC').replace('In production', 'Production').replace('In warehouse', 'Warehouse')}</div>`).join('')}</div>`;
}
const itemsLine = o => o.items.map(i => `${fmt(i.qty)} × ${SKU[i.sku].name}`).join(' · ');
function renderOrders() {
  const open = ORDERS.filter(o => o.stage < 4);
  const recent = ORDERS.find(o => o.stage === 4);
  const list = [...open, recent].filter(Boolean).filter(o => vis.incoming || o.stage < 3 || o.stage === 4).slice(0, 3);
  $('#orderTimelines').innerHTML = list.map(o => `
    <div class="otl">
      <div class="otl-head"><div><b>${o.id}</b><small>${itemsLine(o)}</small></div>${stagePill(o)}</div>
      ${steps(o)}
    </div>`).join('');
  $('#ordersFull').innerHTML = ORDERS.map(o => `
    <div class="ocard reveal ${o.isNew ? 'new' : ''}">
      <div class="otl"><div class="otl-head"><div><b style="font-size:17px">${o.id}</b><small>Placed ${o.placed}</small></div>${stagePill(o)}</div>${steps(o)}</div>
      <div class="oitems">${o.items.map(i => `<span class="oitem"><img src="${SKU[i.sku].img}" alt="">${fmt(i.qty)} × ${SKU[i.sku].name}</span>`).join('')}</div>
      <div class="ofoot"><span>${o.stage === 4 ? 'Delivered to warehouse' : 'Estimated arrival'} <b>${o.eta}</b></span>${vis.payments ? `<span>Order value <b>${money(orderValue(o))}</b></span>` : ''}</div>
    </div>`).join('');
  delete ORDERS.find(o => o.isNew)?.isNew;
  ['#orderTimelines', '#ordersFull'].forEach(s => { const r = $(s); if (r.closest('.reveal.in') || r.closest('.view.active')) setTimeout(() => animateInside(r), 300); });
  observeReveals();
}

/* ---------------- RENDER: payments ---------------- */
let donut, usage;
function spendBySku() {
  const m = Object.fromEntries(SKUS.map(s => [s.id, 0]));
  ORDERS.forEach(o => o.customPrice ? (m[o.items[0].sku] += o.customPrice) : o.items.forEach(i => m[i.sku] += i.qty * SKU[i.sku].price));
  return m;
}
function renderPayments() {
  const m = spendBySku(), t = totals();
  const sorted = SKUS.slice().sort((a, b) => m[b.id] - m[a.id]);
  $('#donutLegend').innerHTML = sorted.map(s => `<li><i style="background:${SKU_COLORS[s.id]}"></i><span>${s.name}</span><b>${money(m[s.id])}</b></li>`).join('');
  const data = sorted.map(s => m[s.id]);
  if (window.Chart) {
    if (!donut) {
      donut = new Chart($('#donut'), {
        type: 'doughnut',
        data: { labels: sorted.map(s => s.name), datasets: [{ data, backgroundColor: sorted.map(s => SKU_COLORS[s.id]), borderColor: '#fffdf9', borderWidth: 3, hoverOffset: 6 }] },
        options: { cutout: '74%', animation: { animateRotate: true, duration: 1600, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: tip(v => money(v.raw)) } }
      });
    } else { donut.data.datasets[0].data = data; donut.update(); }
  }
  const due = LEDGER.find(l => l.status === 'Due');
  $('#payMini').innerHTML = `
    <div class="pm"><small>Paid to date</small><b>${money(t.paid)}</b></div>
    <div class="pm ${due ? 'due' : ''}"><small>${due ? 'Due ' + due.date.replace(/, \d{4}/, '') : 'Balance'}</small><b>${due ? money(due.amount) : money(t.balance)}</b></div>`;
  $('#payKpis').innerHTML = [
    ['Invested in 2026', money(t.invested), 'up', `${ORDERS.length} orders`],
    ['Paid to date', money(t.paid), 'up', 'Thank you!'],
    ['Balance remaining', money(t.balance), t.balance ? 'warn' : 'up', t.balance ? 'Due on arrival' : 'All settled'],
    ['Avg. cost per unit', '$' + (t.invested / ORDERS.reduce((a, o) => a + o.items.reduce((b, i) => b + i.qty, 0), 0)).toFixed(3), '', 'Across all products'],
  ].map(k => `<div class="kpi reveal"><p>${k[0]}</p><h3>${k[1]}</h3><span class="delta ${k[2]}">${k[3]}</span></div>`).join('');
  const st = { Paid: 'ok', Due: 'warn', Upcoming: 'done' };
  $('#ledger').innerHTML = `<thead><tr><th>Date</th><th>Order</th><th>Description</th><th>Type</th><th class="num">Amount</th><th>Status</th></tr></thead><tbody>${
    LEDGER.map(l => `<tr><td>${l.date}</td><td><b>${l.ref}</b></td><td>${l.desc}</td><td>${l.type}</td><td class="num"><b>${money(l.amount)}</b></td><td><span class="status-pill ${st[l.status]}">${l.status}</span></td></tr>`).join('')}</tbody>`;
  observeReveals();
}
function tip(label) {
  return { backgroundColor: '#1b1714', titleColor: '#f4ead8', bodyColor: '#f4ead8', padding: 10, cornerRadius: 10, displayColors: true, boxPadding: 4,
    titleFont: { family: 'Outfit', weight: '600' }, bodyFont: { family: 'Outfit' }, callbacks: { label: c => ' ' + (c.dataset.label && c.chart.config.type !== 'doughnut' ? c.dataset.label + ': ' : c.label + ': ') + label(c) } };
}
function renderUsage() {
  if (!window.Chart || usage) return;
  usage = new Chart($('#usageChart'), {
    type: 'bar',
    data: { labels: USAGE.labels, datasets: USAGE.sets.map(s => ({ label: s.label, data: s.data, backgroundColor: s.color, borderRadius: 6, borderSkipped: false, barPercentage: .62 })) },
    options: {
      maintainAspectRatio: false, animation: { duration: 1400, easing: 'easeOutQuart', delay: c => c.dataIndex * 90 + c.datasetIndex * 60 },
      interaction: { mode: 'index', intersect: false },
      scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#857a6f', font: { family: 'Outfit' } } },
                y: { stacked: true, grid: { color: '#efe7da' }, border: { display: false }, ticks: { color: '#857a6f', font: { family: 'Outfit' }, callback: v => v / 1000 + 'k' } } },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'rectRounded', color: '#4a423b', font: { family: 'Outfit', size: 12 }, padding: 16 } }, tooltip: tip(c => fmt(c.raw) + ' units') }
    }
  });
}

/* ---------------- RENDER: inventory ---------------- */
function renderInventory() {
  $('#invTable').innerHTML = `<thead><tr><th>Product</th><th class="num">On hand</th>${vis.incoming ? '<th class="num">Incoming</th>' : ''}<th class="num">Avg / week</th><th>Weeks of cover</th><th>Runs out ~</th><th>Status</th><th></th></tr></thead><tbody>${
    SKUS.map(s => { const st = statusOf(s), wl = weeksLeft(s), inc = incomingFor(s.id);
      return `<tr class="row-click" data-sku="${s.id}"><td><div class="tprod"><img src="${s.img}" alt=""><div><b>${s.name}</b><small>${s.code}</small></div></div></td>
      <td class="num"><b>${fmt(s.onHand)}</b></td>${vis.incoming ? `<td class="num">${inc ? '<span style="color:var(--sea);font-weight:600">+' + fmt(inc) + '</span>' : '—'}</td>` : ''}<td class="num">${fmt(s.weekly)}</td>
      <td><div class="cover"><div class="bar"><i class="${st.k}" data-w="${Math.min(100, wl / 16 * 100)}%"></i></div><span>${wl.toFixed(1)}</span></div></td>
      <td>${fdate(addDays(TODAY, Math.round(wl * 7)))}</td><td><span class="status-pill ${st.k}">${st.t}</span></td>
      <td><button class="btn btn-outline btn-sm" data-reorder="${s.id}">Reorder</button></td></tr>`; }).join('')}</tbody>`;
  $$('#invTable tr.row-click').forEach(r => r.addEventListener('click', e => { if (!e.target.closest('button')) openDrawer(r.dataset.sku); }));
  const card = $('#invTable').closest('.reveal');
  if (card?.classList.contains('in')) setTimeout(() => animateInside(card), 100);
}

/* ---------------- SHIP SVG ---------------- */
function shipSVG(big) {
  const id = big ? 'rb' : 'rs';
  return `<svg viewBox="${big ? '0 0 600 300' : '30 40 545 150'}" preserveAspectRatio="xMidYMid meet">
    <defs>
      <pattern id="dots${id}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#2f78a8" opacity=".14"/></pattern>
      <linearGradient id="trail${id}" x1="0" x2="1"><stop offset="0" stop-color="#2f78a8" stop-opacity=".3"/><stop offset="1" stop-color="#2f78a8"/></linearGradient>
    </defs>
    <rect width="600" height="${big ? 300 : 220}" fill="url(#dots${id})"/>
    ${[0, 1, 2].map(i => `<path d="M${-40 + i * 30} ${big ? 250 + i * 14 : 190 + i * 10} q 25 -8 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke="#2f78a8" stroke-opacity=".12" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="50 0" dur="${4 + i}s" repeatCount="indefinite"/></path>`).join('')}
    <path id="route${id}" d="M60 ${big ? 190 : 150} C 170 ${big ? 60 : 50} 300 ${big ? 70 : 60} 400 ${big ? 190 : 160} C 450 ${big ? 240 : 200} 500 ${big ? 150 : 120} 545 ${big ? 90 : 70}" fill="none" stroke="#2f78a8" stroke-opacity=".3" stroke-width="2" stroke-dasharray="4 6"/>
    <path class="trail" d="M60 ${big ? 190 : 150} C 170 ${big ? 60 : 50} 300 ${big ? 70 : 60} 400 ${big ? 190 : 160} C 450 ${big ? 240 : 200} 500 ${big ? 150 : 120} 545 ${big ? 90 : 70}" fill="none" stroke="url(#trail${id})" stroke-width="3" stroke-linecap="round"/>
    ${pin(60, big ? 190 : 150, 'Ningbo, CN', 'start', '#1b1714')}
    ${pin(400, big ? 190 : 160, 'Panama Canal', 'middle', '#857a6f', true)}
    ${pin(545, big ? 90 : 70, 'Charleston, SC', 'end', '#b8873a')}
    <g class="ship"><g class="bob">
      <circle r="20" fill="#2f78a8" opacity=".12"><animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".25;0;.25" dur="2.4s" repeatCount="indefinite"/></circle>
      <path d="M-15 2 h30 l-5 8 h-20 z" fill="#1b1714"/>
      <rect x="-11" y="-6" width="7" height="7" rx="1" fill="#b8873a"/><rect x="-3" y="-6" width="7" height="7" rx="1" fill="#d4a95c"/><rect x="5" y="-12" width="5" height="13" rx="1" fill="#f4ead8" stroke="#1b1714" stroke-width="1"/>
    </g></g>
  </svg>`;
}
function pin(x, y, label, anchor, color, small) {
  const tx = anchor === 'start' ? x - 6 : anchor === 'end' ? x + 6 : x;
  return `<g><circle cx="${x}" cy="${y}" r="${small ? 4 : 6}" fill="#fff" stroke="${color}" stroke-width="2.5"/>
    <text x="${tx}" y="${y + (small ? 20 : 24)}" text-anchor="${anchor}" font-family="Outfit" font-size="${small ? 12 : 14}" font-weight="600" fill="${color}">${label}</text></g>`;
}
function animateShip(root, target = 0.68) {
  const route = $('path[id^=route]', root), trail = $('.trail', root), ship = $('.ship', root), bob = $('.bob', root);
  if (!route) return;
  const L = route.getTotalLength();
  trail.style.strokeDasharray = L; trail.style.strokeDashoffset = L;
  const t0 = performance.now(), dur = reduceMotion ? 1 : 3200;
  const tick = t => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3), len = L * target * e;
    const pt = route.getPointAtLength(len);
    ship.setAttribute('transform', `translate(${pt.x} ${pt.y - 10})`);
    trail.style.strokeDashoffset = L - len;
    if (p < 1) requestAnimationFrame(tick);
    else if (!reduceMotion) { let a = 0; const b = () => { if (!bob.isConnected) return; a += .05; bob.setAttribute('transform', `translate(0 ${Math.sin(a) * 2.2}) rotate(${Math.sin(a * .8) * 2.5})`); requestAnimationFrame(b); }; b(); }
  };
  requestAnimationFrame(tick);
}

/* ---------------- DRAWER ---------------- */
let drawerChart;
function stockHistory(s) {
  let seed = s.id.length * 97 + s.onHand;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pts = [s.onHand];
  for (let i = 1; i < 12; i++) {
    let v = pts[0] + s.weekly * (0.8 + rnd() * 0.4);
    if (v > s.full * 0.95) v -= s.full * 0.7;
    pts.unshift(Math.round(v));
  }
  return pts;
}
function openDrawer(id) {
  const s = SKU[id], st = statusOf(s), inc = incomingFor(id), wl = weeksLeft(s);
  const hist = ORDERS.filter(o => o.items.some(i => i.sku === id));
  $('#drawer').innerHTML = `
    <div class="dr-img"><img src="${s.img}" alt="${s.name}">${s.badge ? `<span class="size-badge">${s.badge}</span>` : ''}<button class="dr-close" aria-label="Close">×</button></div>
    <div class="dr-body">
      <span class="status-pill ${st.k}">${st.t}</span>
      <h2>${s.name}</h2><p class="muted" style="margin:0">${s.sub} · ${s.code}</p>
      <div class="specs">${s.specs.map(x => `<span>${x}</span>`).join('')}</div>
      <div class="dr-stats"><div><small>On hand</small><b>${fmt(s.onHand)}</b></div><div><small>Weeks left</small><b>${wl.toFixed(1)}</b></div><div><small>${vis.incoming ? 'Incoming' : 'Avg / week'}</small><b>${vis.incoming ? (inc ? fmt(inc) : '—') : fmt(s.weekly)}</b></div></div>
      <p class="eyebrow">Stock level · last 12 weeks</p>
      <div class="dr-chart"><canvas id="drChart"></canvas></div>
      <div class="dr-hist"><h4>Order history</h4>${hist.map(o => { const it = o.items.find(i => i.sku === id);
        return `<div><span>${o.id} · ${o.placed.replace(/, \d{4}/, '')}</span><b>${fmt(it.qty)} units${vis.payments ? ' · ' + money(it.qty * s.price) : ''}</b></div>`; }).join('')}</div>
      <div class="dr-actions"><button class="btn btn-outline" data-toast="Spec sheet for ${s.name} downloaded (demo)">Spec sheet</button><button class="btn btn-primary" data-reorder="${id}">Reorder</button></div>
    </div>`;
  $('#drawer').classList.add('on'); $('#scrim').classList.add('on');
  $('.dr-close').onclick = closeDrawer;
  if (window.Chart) {
    drawerChart?.destroy();
    const ctx = $('#drChart').getContext('2d'), g = ctx.createLinearGradient(0, 0, 0, 170);
    g.addColorStop(0, 'rgba(184,135,58,.35)'); g.addColorStop(1, 'rgba(184,135,58,0)');
    drawerChart = new Chart(ctx, {
      type: 'line',
      data: { labels: Array.from({ length: 12 }, (_, i) => i === 11 ? 'Now' : `W-${11 - i}`), datasets: [{ label: 'On hand', data: stockHistory(s), borderColor: '#b8873a', backgroundColor: g, fill: true, tension: .35, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 }] },
      options: { maintainAspectRatio: false, animation: { duration: 1200 }, interaction: { mode: 'index', intersect: false },
        scales: { x: { grid: { display: false }, ticks: { color: '#857a6f', font: { family: 'Outfit', size: 10 }, maxTicksLimit: 6 } }, y: { grid: { color: '#efe7da' }, border: { display: false }, ticks: { color: '#857a6f', font: { family: 'Outfit', size: 10 }, callback: v => v >= 1000 ? v / 1000 + 'k' : v } } },
        plugins: { legend: { display: false }, tooltip: tip(c => fmt(c.raw) + ' units') } }
    });
  }
}
function closeDrawer() { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); }

/* ---------------- REORDER MODAL ---------------- */
let nextId = 2625;
function openReorder(id) {
  const s = SKU[id];
  let qty = 10000, mode = 'ocean';
  const draw = () => {
    const sub = qty * s.price * (mode === 'air' ? 1.18 : 1), eta = addDays(TODAY, mode === 'air' ? 21 : 56);
    $('#modal').innerHTML = `
      <p class="eyebrow">Reorder request</p><h3>Restock with confidence</h3>
      <p class="muted" style="margin:0;font-size:13.5px">Your artwork is on file. No new proof needed.</p>
      <div class="m-prod"><img src="${s.img}" alt=""><div><b>${s.name}</b><br><small class="muted">${s.code} · ${fmt(s.onHand)} on hand</small></div></div>
      <label style="font-size:12.5px;font-weight:500">Quantity</label>
      <div class="qty-opts">${[5000, 10000, 20000].map(q => `<button type="button" data-q="${q}" class="${q === qty ? 'on' : ''}">${fmt(q)}<small>${(q / s.weekly).toFixed(0)} weeks</small></button>`).join('')}</div>
      <label style="font-size:12.5px;font-weight:500">Shipping<select id="mShip"><option value="ocean" ${mode === 'ocean' ? 'selected' : ''}>Ocean freight · ~8 weeks</option><option value="air" ${mode === 'air' ? 'selected' : ''}>Air express · ~3 weeks (+18%)</option></select></label>
      <div class="m-sum">
        ${vis.payments ? `<div><span>Unit price</span><b>$${(s.price * (mode === 'air' ? 1.18 : 1)).toFixed(3)}</b></div><div><span>Order total</span><b>${money(sub)}</b></div>` : ''}
        <div><span>Estimated arrival</span><b>${fdate(eta, true)}</b></div>
        ${vis.payments ? `<div class="tot"><span>Deposit to start (50%)</span><span>${money(sub / 2)}</span></div>` : ''}
      </div>
      <div class="m-actions"><button class="btn btn-outline" id="mCancel">Cancel</button><button class="btn btn-primary" id="mGo">Send request</button></div>`;
    $$('.qty-opts button').forEach(b => b.onclick = () => { qty = +b.dataset.q; draw(); });
    $('#mShip').onchange = e => { mode = e.target.value; draw(); };
    $('#mCancel').onclick = closeModal;
    $('#mGo').onclick = () => {
      const oid = 'EP-' + nextId++;
      $('#modal').innerHTML = `<div class="success">
        <svg class="check" viewBox="0 0 84 84"><circle class="c-circle" cx="42" cy="42" r="38"/><path class="c-tick" d="M26 43 l11 11 l21 -23"/></svg>
        <h3>Request sent!</h3><p>Order <b>${oid}</b> for ${fmt(qty)} × ${s.name} is with the Environpac team.<br>We'll confirm within one business day.</p>
        <button class="btn btn-primary" id="mDone" style="margin-top:8px">Back to my dashboard</button></div>`;
      const total = qty * s.price * (mode === 'air' ? 1.18 : 1);
      ORDERS.unshift({ id: oid, placed: fdate(TODAY, true), eta: fdate(addDays(TODAY, mode === 'air' ? 21 : 56), true), stage: 0, requested: true, isNew: true, items: [{ sku: id, qty }], customPrice: total });
      LEDGER.unshift({ date: fdate(TODAY, true), ref: oid, desc: 'Deposit (50%) · invoice to follow', type: 'Deposit', amount: Math.round(total / 2), status: 'Upcoming' },
                     { date: fdate(addDays(TODAY, mode === 'air' ? 21 : 56), true), ref: oid, desc: 'Balance (50%) on arrival', type: 'Balance', amount: Math.round(total / 2), status: 'Upcoming' });
      LEDGER.sort((a, b) => new Date(b.date) - new Date(a.date));
      alertLog.unshift({ t: `New reorder from Crave: ${oid} · ${fmt(qty)} × ${s.name}`, w: 'Now' });
      pushNote({ k: 'ok', ico: 'box', t: `Reorder ${oid} received. We'll confirm shortly.`, w: 'Just now' });
      $('#mDone').onclick = () => { closeModal(); closeDrawer(); refreshAll(); toast(`Reorder ${oid} added to your orders`); };
    };
  };
  draw();
  $('#modalWrap').classList.add('on');
}
function closeModal() { $('#modalWrap').classList.remove('on'); setTimeout(() => { if (!$('#modalWrap').classList.contains('on')) $('#modal').classList.remove('wide'); }, 350); }

/* ---------------- NOTIFICATIONS ---------------- */
const NOTES = [];
function baseNotes() {
  NOTES.length = 0;
  SKUS.filter(s => statusOf(s).k !== 'ok').forEach(s => NOTES.push({ k: statusOf(s).k, ico: statusOf(s).k === 'low' ? 'alert' : 'trend', sku: s.id,
    t: `You have <b>${fmt(s.onHand)}</b> ${plural(s.name)} left. You may want to reorder.`, w: statusOf(s).k === 'low' ? 'Today' : 'Yesterday' }));
  if (vis.incoming) NOTES.push({ k: 'sea', ico: 'ship', go: 'tracking', t: 'EP-2611 passed the Panama Canal. On schedule for Dec 9.', w: 'Nov 12' });
  if (vis.payments) NOTES.push({ k: 'ok', ico: 'check', go: 'payments', t: 'Deposit of $1,050 received for EP-2618. Thank you!', w: 'Nov 10' });
}
const extraNotes = [];
function pushNote(n) { extraNotes.unshift(n); renderBell(true); }
function renderBell(ring) {
  baseNotes();
  const all = [...extraNotes, ...NOTES];
  const tint = { low: ['var(--low-soft)', 'var(--low)'], warn: ['var(--warn-soft)', 'var(--warn)'], ok: ['var(--ok-soft)', 'var(--ok)'], sea: ['var(--sea-soft)', 'var(--sea)'] };
  $('#bellMenu').innerHTML = `<div class="dd-head">Notifications <small>${all.length} new</small></div>` + all.map((n, i) =>
    `<div class="dd-item" data-i="${i}"><span class="dd-dot" style="background:${tint[n.k][0]};color:${tint[n.k][1]}">${ICON[n.ico].replace('<svg', '<svg style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"')}</span><div><p>${n.t}</p><small>${n.w}</small></div></div>`).join('');
  $$('#bellMenu .dd-item').forEach(d => d.onclick = () => { const n = all[+d.dataset.i]; $('#bellMenu').classList.remove('on'); if (n.sku) openDrawer(n.sku); else if (n.go) go(n.go); });
  $('#bellCount').textContent = all.length;
  if (ring) { const b = $('#bellBtn'); b.classList.remove('ring'); void b.offsetWidth; b.classList.add('ring'); }
}

/* ---------------- ADMIN ---------------- */
function renderAdmin() {
  const t = totals();
  const craveHealth = SKUS.some(s => statusOf(s).k === 'low') ? 'low' : SKUS.some(s => statusOf(s).k === 'warn') ? 'warn' : 'ok';
  const hl = { ok: 'Healthy', warn: 'Reorder soon', low: 'Needs attention' };
  $('#adminKpis').innerHTML = [
    ['Active customers', '34', 'up', '+3 this quarter', '<path d="M16 11a4 4 0 1 0-8 0M3 21c0-3.3 4-6 9-6s9 2.7 9 6"/>'],
    ['Units stored', fmt(OTHER_UNITS + t.units), '', 'Across 4 warehouse bays', '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/>'],
    ['Receivables', money(OTHER_BAL + t.balance), 'warn', '6 invoices open', '<path d="M2 6h20v12H2zM2 10h20"/>'],
    ['Containers at sea', '3', '', 'Next lands Dec 9', '<path d="M3 17h18l-2 4H5l-2-4Zm3-1V9h12v7"/>'],
  ].map(k => `<div class="kpi reveal"><div class="kpi-ico"><svg viewBox="0 0 24 24">${k[4]}</svg></div><p>${k[0]}</p><h3>${k[1]}</h3><span class="delta ${k[2]}">${k[3]}</span></div>`).join('');
  $('#custTable').innerHTML = `<thead><tr><th>Customer</th><th class="num">SKUs</th><th class="num">Units stored</th><th>Stock health</th><th class="num">Balance</th><th>Last login</th><th></th></tr></thead><tbody>${
    CUSTOMERS.map(c => {
      const units = c.crave ? t.units : c.units, bal = c.crave ? t.balance : c.bal, h = c.crave ? craveHealth : c.health;
      return `<tr class="${c.crave ? 'row-click' : ''}" ${c.crave ? 'data-crave' : ''}><td><div class="cust">${c.crave ? '<span class="cust-logo" style="background:#141210"><img src="assets/crave-sun.png" alt=""></span>' : `<span class="cust-logo" style="background:${c.c}">${c.name.split(' ').slice(0, 2).map(w => w[0]).join('')}</span>`}<div><b>${c.name}</b><br><small class="muted">${c.loc}</small></div></div></td>
      <td class="num">${c.skus}</td><td class="num"><b>${fmt(units)}</b></td><td><span class="status-pill ${h}">${hl[h]}</span></td><td class="num">${money(bal)}</td>
      <td>${c.crave ? '<span style="color:var(--ok);font-weight:600">● Online now</span>' : c.last}</td>
      <td>${c.crave ? '<button class="btn btn-outline btn-sm">View as customer</button>' : `<button class="btn btn-outline btn-sm" data-toast="Opening ${c.name} (demo: only Crave is built out)">Open</button>`}</td></tr>`; }).join('')}</tbody>`;
  $('[data-crave]').onclick = e => { if (e.target.closest('[data-toast]')) return; setMode('customer'); toast('Previewing the portal exactly as Crave sees it'); };
  $('#fSku').innerHTML = SKUS.map(s => `<option value="${s.id}">${s.name} · ${fmt(s.onHand)} on hand</option>`).join('');
  const openO = ORDERS.filter(o => o.stage < 4);
  $('#fOrd').innerHTML = openO.map(o => `<option value="${o.id}">${o.id} · ${STAGES[o.stage]}</option>`).join('') || '<option>No open orders</option>';
  syncStageOpts();
  const dues = duesList();
  $('#fPayFor').innerHTML = dues.map((l, i) => `<option value="${i}">${l.ref} · ${l.type} · ${money(l.amount)}</option>`).join('') || '<option>Nothing outstanding</option>';
  if (dues[0]) $('#fAmt').value = dues[0].amount;
  $('#alertLog').innerHTML = alertLog.slice(0, 5).map(a => `<li><span style="color:var(--ok)">✓</span>${a.t}<small>${a.w}</small></li>`).join('');
  observeReveals();
}
function duesList() { return LEDGER.filter(l => l.status !== 'Paid').sort((a, b) => (a.status === 'Due' ? 0 : 1) - (b.status === 'Due' ? 0 : 1) || new Date(a.date) - new Date(b.date)); }
function syncStageOpts() {
  const o = ORDERS.find(x => x.id === $('#fOrd').value);
  $('#fStage').innerHTML = STAGES.map((n, i) => `<option value="${i}" ${o && i === Math.min(4, o.stage + 1) ? 'selected' : ''}>${n}${i === 4 ? ' (adds to stock)' : ''}</option>`).join('');
}
function bindAdmin() {
  $$('#actTabs button').forEach(b => b.onclick = () => {
    $$('#actTabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.act-form').forEach(f => f.classList.toggle('on', f.dataset.tab === b.dataset.tab));
  });
  $('#fOrd').onchange = syncStageOpts;
  $('#fPayFor').onchange = e => { const d = duesList()[+e.target.value]; if (d) $('#fAmt').value = d.amount; };
  $('#fStock').onsubmit = e => {
    e.preventDefault();
    const s = SKU[$('#fSku').value], q = Math.max(0, +$('#fQty').value || 0), inc = $('#fMove').value === 'in';
    s.onHand = Math.max(0, s.onHand + (inc ? q : -q));
    alertLog.unshift({ t: `Stock ${inc ? 'received' : 'delivered'}: ${fmt(q)} × ${s.name} (Crave notified)`, w: 'Now' });
    refreshAll(); toast(`${s.name}: now ${fmt(s.onHand)} on hand. Crave sees this instantly.`);
  };
  $('#fPay').onsubmit = e => {
    e.preventDefault();
    const d = duesList()[+$('#fPayFor').value];
    if (!d) return toast('Nothing outstanding for Crave');
    let amt = Math.max(0, +$('#fAmt').value || 0); const pay = Math.min(amt, d.amount);
    if (pay >= d.amount) { d.status = 'Paid'; d.date = fdate(TODAY, true); d.desc = d.desc.replace('on arrival', '· ACH'); }
    else { d.amount -= pay; LEDGER.unshift({ date: fdate(TODAY, true), ref: d.ref, desc: 'Partial payment · ACH', type: 'Payment', amount: pay, status: 'Paid' }); }
    LEDGER.sort((a, b) => new Date(b.date) - new Date(a.date));
    alertLog.unshift({ t: `Payment of ${money(pay)} recorded for ${d.ref} (receipt sent)`, w: 'Now' });
    pushNote({ k: 'ok', ico: 'check', go: 'payments', t: `Payment of ${money(pay)} received for ${d.ref}. Thank you!`, w: 'Just now' });
    refreshAll(); toast(`${money(pay)} recorded. Crave's balance is updated.`);
  };
  $('#fOrder').onsubmit = e => {
    e.preventDefault();
    const o = ORDERS.find(x => x.id === $('#fOrd').value); if (!o) return;
    const ns = +$('#fStage').value; o.stage = ns; o.requested = false;
    if (ns === 4) { o.items.forEach(i => SKU[i.sku].onHand += i.qty); o.eta = fdate(TODAY, true); }
    alertLog.unshift({ t: `${o.id} moved to "${STAGES[ns]}" (Crave notified)`, w: 'Now' });
    pushNote({ k: ns === 3 ? 'sea' : 'ok', ico: ns === 3 ? 'ship' : 'box', go: 'orders', t: `${o.id} is now <b>${STAGES[ns]}</b>.${ns === 4 ? ' Stock added to your inventory.' : ''}`, w: 'Just now' });
    refreshAll(); toast(`${o.id} → ${STAGES[ns]}${ns === 4 ? '. Units added to Crave\'s stock' : ''}`);
  };
  $$('[data-vis-toggle]').forEach(t => t.onchange = () => {
    vis[t.dataset.visToggle] = t.checked;
    $('#app').classList.toggle('hide-' + t.dataset.visToggle, !t.checked);
    $$(`.nav a[data-vis="${t.dataset.visToggle}"]`).forEach(a => a.classList.toggle('hidden-vis', !t.checked));
    refreshAll();
    toast(`${t.closest('.toggle').querySelector('b').textContent} ${t.checked ? 'visible to' : 'hidden from'} Crave`);
  });
}

/* ---------------- NAV / MODE ---------------- */
const TITLES = { overview: 'Overview', inventory: 'Inventory', orders: 'Orders', payments: 'Payments', tracking: 'Ocean Tracking', admin: 'Customer Accounts' };
let current = 'overview';
function go(view, scrollTo) {
  if (view === 'admin' && $('#app').dataset.mode !== 'admin') return setMode('admin');
  current = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.dataset.view === view));
  $$('.nav a').forEach(a => a.classList.toggle('active', a.dataset.view === view && !a.dataset.scroll));
  $('#topTitle').textContent = TITLES[view];
  $('#sidebar').classList.remove('open');
  if (scrollTo) { $('#' + scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (view === 'inventory') renderInventory();
  if (view === 'tracking') { $('#trackMap').innerHTML = shipSVG(true); animateShip($('#trackMap')); }
  $$(`.view[data-view="${view}"] .reveal.in`).forEach(el => { el.classList.remove('in'); void el.offsetWidth; });
  observeReveals();
}
function setMode(mode) {
  const app = $('#app');
  app.dataset.mode = mode;
  if (mode === 'admin') toggleChat(false);
  $$('#modeSwitch button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  placeGlider();
  $('#topEyebrow').textContent = mode === 'admin' ? 'Environpac · Internal' : 'Crave Italian Oven & Bar';
  if (mode === 'admin') { renderAdmin(); go('admin'); } else go('overview');
}
function placeGlider() {
  const on = $('#modeSwitch button.on'), g = $('.mode-glider');
  if (!on) return;
  g.style.width = on.offsetWidth + 'px';
  g.style.transform = `translateX(${on.offsetLeft - 3}px)`;
}

/* ---------------- TOAST ---------------- */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7L12 2Z"/></svg><span>${msg}</span>`;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3400);
}

/* ---------------- REFRESH ---------------- */
function refreshAll() {
  syncAt = Date.now(); updateSync();
  renderProducts(); renderInsights(); renderOrders(); renderPayments(); renderBell();
  if ($('#app').dataset.mode === 'admin') renderAdmin();
  if (current === 'inventory') renderInventory();
  updateCounts();
  setTimeout(() => animateInside(document), 350);
}
function updateSync() {
  const s = Math.round((Date.now() - syncAt) / 1000);
  $('#syncText').textContent = s < 20 ? 'Synced just now' : s < 60 ? `Synced ${s}s ago` : `Synced ${Math.round(s / 60)} min ago`;
}

/* ---------------- CHAT ---------------- */
const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const CHAT = [
  { day: 'Yesterday' },
  { who: 'them', t: 'Hi Crave team! Your 44 oz bowls and 16″ pizza boxes (EP-2611) cleared the Panama Canal this morning. Still on track for Dec 9. 🚢', at: '9:12 AM' },
  { who: 'me', t: 'Great news, thanks! Can you deliver half to North Myrtle Beach?', at: '9:40 AM' },
  { who: 'them', t: 'Absolutely. We\'ll split it 50/50 between MB and NMB on Dec 11. 👍', at: '9:44 AM' },
  { day: 'Today' },
  { who: 'them', t: 'Heads up: your 16 oz soup cups are down to about 2.5 weeks of stock. Want us to start a reorder?', at: '8:05 AM', action: { label: 'Start reorder', reorder: 'soup' } },
];
const CHIPS = ['Where is my order?', 'Reorder soup cups', 'Request a delivery', 'Book a call'];
function msgHTML(m) {
  if (m.day) return `<span class="day-sep">${m.day}</span>`;
  if (m.who === 'sys') return `<div class="msg sys">${m.t}</div>`;
  const act = m.action ? `<br><button class="btn ${m.who === 'me' ? 'btn-ghost-light' : 'btn-primary'}" ${m.action.reorder ? `data-reorder="${m.action.reorder}"` : m.action.book ? 'data-book' : `data-toast="${m.action.toast}"`}>${m.action.label}</button>` : '';
  return `<div class="msg ${m.who}">${m.t}${act}<small>${m.at}</small></div>`;
}
function renderChat() {
  $('#chatBody').innerHTML = CHAT.map(msgHTML).join('');
  $('#chatChips').innerHTML = CHIPS.map(c => `<button type="button">${c}</button>`).join('');
  $$('#chatChips button').forEach(b => b.onclick = () => sendChat(b.textContent));
  scrollChat();
}
const scrollChat = () => { const b = $('#chatBody'); b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); };
function addMsg(m) { CHAT.push(m); $('#chatBody').insertAdjacentHTML('beforeend', msgHTML(m)); scrollChat(); }
function botReply(text) {
  const t = text.toLowerCase();
  if (/call|meet|talk|schedule/.test(t)) return { t: 'Of course! Pick a time that works for you and we\'ll send a calendar invite.', action: { label: 'Book a call', book: true } };
  if (/where|order|ship|eta|arriv|track/.test(t)) return { t: 'EP-2611 is in the Caribbean Sea, on schedule to land in Charleston on <b>Dec 9</b>. EP-2618 (soup cups) is in production for Jan 14.', action: { label: 'View orders', toast: 'Tip: open Orders in the sidebar for the full timeline' } };
  if (/reorder|soup|cup|restock|more/.test(t)) return { t: 'Happy to! Your artwork is on file. 10,000 soup cups is about 14 weeks of stock. Want to send the request?', action: { label: 'Start reorder', reorder: 'soup' } };
  if (/deliver|drop|send|location|nmb|mb/.test(t)) return { t: 'We can deliver from your warehouse stock within <b>48 hours</b>. Just tell us the products, quantities and location (Crave MB or NMB).' };
  if (/invoice|pay|balance|bill/.test(t)) return { t: 'Your next payment is <b>$4,000</b> for EP-2611, due on arrival Dec 9. Want me to email the invoice?', action: { label: 'Email invoice', toast: 'Invoice EP-2611 emailed (demo)' } };
  if (/thank|great|perfect|awesome/.test(t)) return { t: 'Anytime! We\'re here whenever you need us. 🙌' };
  return { t: 'Thanks for the message! Your account manager will get back to you shortly. We usually reply within the hour.' };
}
function sendChat(text) {
  text = text.trim(); if (!text) return;
  if (/^book a call$/i.test(text)) { addMsg({ who: 'me', t: text, at: nowTime() }); return setTimeout(openBooking, 350); }
  addMsg({ who: 'me', t: text.replace(/</g, '&lt;'), at: nowTime() });
  const typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>';
  setTimeout(() => { $('#chatBody').appendChild(typing); scrollChat(); }, 400);
  setTimeout(() => { typing.remove(); addMsg({ who: 'them', ...botReply(text), at: nowTime() }); }, 1700);
}
function toggleChat(force) {
  const on = force ?? !$('#chat').classList.contains('on');
  $('#chat').classList.toggle('on', on); $('#chatFab').classList.toggle('open', on);
  $('#chat').setAttribute('aria-hidden', !on);
  if (on) { $('#chatBadge').classList.add('off'); setTimeout(() => $('#chatText').focus({ preventScroll: true }), 300); scrollChat(); }
}

/* ---------------- BOOK A CALL ---------------- */
let booked = null;
function nextWeekdays(n) {
  const out = []; let d = addDays(TODAY, 1);
  while (out.length < n) { if (d.getDay() % 6) out.push(new Date(d)); d = addDays(d, 1); }
  return out;
}
const SLOTS = ['9:00 AM', '10:30 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
function openBooking() {
  closeDrawer(); closeModal();
  const days = nextWeekdays(5);
  const st = { type: 'video', day: 0, slot: null, topic: 'Reorder planning', note: '' };
  const taken = (di, si) => (di * 7 + si * 3) % 5 === 0;
  const draw = () => {
    const d = days[st.day];
    $('#modal').classList.add('wide');
    $('#modal').innerHTML = `
      <p class="eyebrow">Book a call</p><h3>Talk to your Environpac team</h3>
      <p class="muted" style="margin:0 0 14px;font-size:13.5px">Pick a time. We'll send a calendar invite with the link.</p>
      <div class="fl">Call type</div>
      <div class="seg">
        <button type="button" data-type="video" class="${st.type === 'video' ? 'on' : ''}"><svg viewBox="0 0 24 24"><path d="M3 6h12v12H3zM15 10l6-3v10l-6-3"/></svg><span>Video call<small>Google Meet · 30 min</small></span></button>
        <button type="button" data-type="phone" class="${st.type === 'phone' ? 'on' : ''}"><svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg><span>Phone call<small>We'll call you · 15 min</small></span></button>
      </div>
      <div class="fl">Pick a day <small>${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</small></div>
      <div class="days">${days.map((x, i) => `<button type="button" data-day="${i}" class="${i === st.day ? 'on' : ''}"><small>${x.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${x.getDate()}</b></button>`).join('')}</div>
      <div class="fl">Available times <small>Eastern Time (EST)</small></div>
      <div class="slots">${SLOTS.map((s, i) => `<button type="button" data-slot="${i}" ${taken(st.day, i) ? 'disabled' : ''} class="${st.slot === i ? 'on' : ''}">${s}</button>`).join('')}</div>
      <label class="fl" style="display:block">What would you like to discuss?
        <select id="bTopic">${['Reorder planning', 'Order status / delivery', 'New packaging or artwork', 'Billing question', 'Something else'].map(t => `<option ${t === st.topic ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label class="fl" style="display:block;margin-top:12px">Notes <small>optional</small><textarea id="bNote" placeholder="e.g. Planning for the summer season, new menu launch…">${st.note}</textarea></label>
      ${st.slot !== null ? `<div class="book-sum"><svg viewBox="0 0 24 24"><path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4"/></svg><div><b>${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · ${SLOTS[st.slot]} EST</b><span>${st.type === 'video' ? 'Video call · 30 min' : 'Phone call · 15 min'} with the Environpac team</span></div></div>` : '<div style="height:14px"></div>'}
      <div class="m-actions"><button class="btn btn-outline" id="bCancel">Cancel</button><button class="btn btn-primary" id="bGo" ${st.slot === null ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>Confirm booking</button></div>`;
    $$('[data-type]', $('#modal')).forEach(b => b.onclick = () => { st.type = b.dataset.type; draw(); });
    $$('[data-day]', $('#modal')).forEach(b => b.onclick = () => { st.day = +b.dataset.day; if (st.slot !== null && taken(st.day, st.slot)) st.slot = null; draw(); });
    $$('[data-slot]', $('#modal')).forEach(b => b.onclick = () => { st.slot = +b.dataset.slot; draw(); });
    $('#bTopic').onchange = e => st.topic = e.target.value;
    $('#bNote').oninput = e => st.note = e.target.value;
    $('#bCancel').onclick = closeModal;
    $('#bGo').onclick = () => { if (st.slot !== null) confirmBooking(st, days[st.day]); };
  };
  draw();
  $('#modalWrap').classList.add('on');
}
function confirmBooking(st, day) {
  const [hm, ap] = SLOTS[st.slot].split(' '); let [h, m] = hm.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  const start = new Date(day); start.setHours(h, m, 0, 0);
  const dur = st.type === 'video' ? 30 : 15, end = new Date(start.getTime() + dur * 60000);
  const label = `${day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${SLOTS[st.slot]} EST`;
  booked = { label, type: st.type, topic: st.topic, start, end, note: st.note };
  $('#modal').innerHTML = `<div class="success">
    <svg class="check" viewBox="0 0 84 84"><circle class="c-circle" cx="42" cy="42" r="38"/><path class="c-tick" d="M26 43 l11 11 l21 -23"/></svg>
    <h3>You're booked!</h3><p>A calendar invite is on its way. Looking forward to speaking with you.</p>
    <div class="detail"><div><span>When</span><b>${label}</b></div><div><span>Type</span><b>${st.type === 'video' ? 'Video call · 30 min' : 'Phone call · 15 min'}</b></div><div><span>Topic</span><b>${st.topic}</b></div></div>
    <div class="m-actions"><button class="btn btn-outline" id="bIcs">Add to calendar</button><button class="btn btn-primary" id="bDone">Done</button></div></div>`;
  $('#bIcs').onclick = downloadICS;
  $('#bDone').onclick = () => { closeModal(); toast(`Call booked for ${label}`); };
  renderUpcoming();
  addMsg({ who: 'sys', t: `📅 Call booked: <b>${label}</b> · ${st.topic}` });
  setTimeout(() => addMsg({ who: 'them', t: `Perfect, see you ${day.toLocaleDateString('en-US', { weekday: 'long' })} at ${SLOTS[st.slot]}! I'll come prepared with your usage numbers. 📊`, at: nowTime() }), 1200);
  alertLog.unshift({ t: `Crave booked a ${st.type} call: ${label} (${st.topic})`, w: 'Now' });
  pushNote({ k: 'ok', ico: 'check', t: `Your call is confirmed for <b>${label}</b>.`, w: 'Just now' });
}
function renderUpcoming() {
  $('#upcoming').innerHTML = booked ? `<small>Upcoming call</small><b>${booked.label}</b><span>${booked.type === 'video' ? 'Video' : 'Phone'} · ${booked.topic}</span>
    <button class="btn btn-ghost-light btn-sm" data-toast="${booked.type === 'video' ? 'The meeting link opens 5 minutes before the call (demo)' : 'We will call your number on file (demo)'}">${booked.type === 'video' ? 'Join link' : 'Call details'}</button>` : '';
}
function downloadICS() {
  if (!booked) return;
  const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Environpac Portal Demo//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@portal-demo`, `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(booked.start)}`, `DTEND:${f(booked.end)}`, `SUMMARY:Environpac × Crave: ${booked.topic}`,
    `DESCRIPTION:${booked.type === 'video' ? 'Video call' : 'Phone call'} with your Environpac team.${booked.note ? ' Notes: ' + booked.note.replace(/\n/g, ' ') : ''}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'environpac-call.ics'; a.click();
  toast('Calendar invite downloaded');
}

/* ---------------- TOUR ---------------- */
const TOUR = [
  { sel: '#hero', t: 'A portal that feels like theirs', p: 'Each customer signs in with their own credentials and sees their own brand. Crave sees Crave: logo, colors and locations.' },
  { sel: '#kpis', t: 'Stock & spend at a glance', p: 'Units in the warehouse, units on the way, what they\'ve invested this year and what\'s due. Everything they asked to see, in one view.' },
  { sel: '#insights', t: 'Smart insights (the AI layer)', p: 'The portal watches usage and warns early: "You have 1,850 soup cups left, about 2.5 weeks. You may want to reorder." One click to act.' },
  { sel: '#products', t: 'Their actual branded packaging', p: 'Every product with its real mockup, live stock level, weeks of cover and incoming stock (striped blue).', block: 'start' },
  { sel: '#drawer', t: 'Tap any product for details', p: 'Specs, a 12-week stock trend, full order history, and a one-click reorder with artwork already on file.', before: () => openDrawer('soup'), after: closeDrawer, noScroll: true },
  { sel: '[data-tour="orders"]', t: 'From artwork to their door', p: 'Each order moves through production, QC, ocean freight and into the warehouse, so customers always know where things stand.' },
  { sel: '[data-tour="payments"]', t: 'Transparent spend & deposits', p: 'Deposits, balances and a breakdown of spend by product. It shows customers you\'re investing in their brand, not just delivering boxes.' },
  { sel: '[data-tour="ship"]', t: 'Phase 2: live ocean tracking', p: 'Next step: plug in carrier data so customers can watch their container cross the ocean, with automatic arrival alerts.' },
  { sel: '#chat', t: 'Chat or book a call, any time', p: 'Customers can message their account manager, get instant answers about orders, or book a video or phone call. The invite goes straight to their calendar.', before: () => toggleChat(true), after: () => toggleChat(false), noScroll: true },
  { sel: '#adminActions', t: 'Behind the scenes: Environpac admin', p: 'Your team updates stock, payments and order status in seconds, and every customer portal updates immediately.', before: () => setMode('admin') },
  { sel: '#adminVis', t: 'You control what each customer sees', p: 'Toggle pricing, shipments or insights per customer. Simple to run with 30–40 accounts, and ready to scale.' },
];
let ti = -1, tTimer, tAuto = true;
function startTour() {
  closeDrawer(); closeModal();
  if ($('#app').dataset.mode !== 'customer') setMode('customer'); else go('overview');
  tAuto = true; ti = -1;
  setTimeout(() => tourStep(1), 500);
}
function tourStep(dir) {
  clearTimeout(tTimer);
  TOUR[ti]?.after?.();
  ti += dir;
  if (ti < 0) ti = 0;
  if (ti >= TOUR.length) return endTour();
  const s = TOUR[ti];
  s.before?.();
  const tipEl = $('#tourTip'), spot = $('#tourSpot');
  tipEl.classList.remove('on');
  setTimeout(() => {
    const el = $(s.sel); if (!el) return tourStep(1);
    if (!s.noScroll) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: s.block || 'center' });
    setTimeout(() => {
      const r = el.getBoundingClientRect(), pad = 8, vh = innerHeight, vw = innerWidth;
      const top = Math.max(6, r.top - pad), h = Math.min(vh - 12, r.height + pad * 2);
      Object.assign(spot.style, { top: top + 'px', left: Math.max(6, r.left - pad) + 'px', width: Math.min(vw - 12, r.width + pad * 2) + 'px', height: h + 'px' });
      spot.classList.add('on');
      tipEl.innerHTML = `<p class="eyebrow">Step ${ti + 1} of ${TOUR.length}</p><h4>${s.t}</h4><p>${s.p}</p>
        <div class="tour-nav"><button class="close-t">End</button><div class="prog"><i style="width:${(ti + 1) / TOUR.length * 100}%"></i></div>
        <button class="auto-t">${tAuto ? '❚❚' : '▶'}</button>${ti ? '<button class="prev-t">Back</button>' : ''}<button class="next next-t">${ti === TOUR.length - 1 ? 'Finish' : 'Next'}</button></div>`;
      const tw = Math.min(330, vw - 32), th = 190;
      let tx = r.left + r.width / 2 - tw / 2, ty = top + h + 14;
      if (s.sel === '#drawer' || s.sel === '#chat') { tx = Math.max(16, r.left - tw - 20); ty = vh / 2 - th / 2; if (tx < 16 || vw < 900) { tx = 16; ty = vh - th - 16; } }
      else if (ty + th > vh) ty = top - th - 14;
      if (ty < 10) ty = Math.min(vh - th - 16, top + 20);
      tx = Math.max(16, Math.min(vw - tw - 16, tx));
      Object.assign(tipEl.style, { left: tx + 'px', top: ty + 'px' });
      tipEl.classList.add('on');
      $('.close-t', tipEl).onclick = endTour;
      $('.next-t', tipEl).onclick = () => { tAuto = false; tourStep(1); };
      $('.prev-t', tipEl)?.addEventListener('click', () => { tAuto = false; tourStep(-1); });
      $('.auto-t', tipEl).onclick = () => { tAuto = !tAuto; tourStep(0); };
      if (tAuto) tTimer = setTimeout(() => tourStep(1), 6500);
    }, s.noScroll ? 450 : 750);
  }, 120);
}
function endTour() {
  clearTimeout(tTimer); TOUR[ti]?.after?.(); ti = -1;
  $('#tourSpot').classList.remove('on'); $('#tourTip').classList.remove('on');
  if ($('#app').dataset.mode !== 'customer') setMode('customer');
  toast('Thanks for watching. This is your portal, built around your customers.');
}

/* ---------------- LOGIN ---------------- */
function initLogin() {
  const imgs = $$('#slides img'), caps = ['Black Kraft Shopping Bag', '12″ & 16″ Kraft Pizza Boxes', '16 oz Soup & Sauce Cups', '44 oz Kraft Salad Bowls', 'Cocktail Napkins'];
  const dots = $('#slideDots'); dots.innerHTML = imgs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  let k = 0;
  const timer = setInterval(() => {
    imgs[k].classList.remove('on'); dots.children[k].classList.remove('on');
    k = (k + 1) % imgs.length;
    imgs[k].classList.add('on'); dots.children[k].classList.add('on');
    const c = $('#slideCap'); c.style.opacity = 0; setTimeout(() => { c.textContent = caps[k]; c.style.opacity = 1; }, 400);
  }, 4500);
  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    const btn = $('#loginForm button'); btn.querySelector('span').textContent = 'Verifying…';
    setTimeout(() => {
      clearInterval(timer);
      $('#login').classList.add('out'); $('#loader').classList.add('on');
      const msgs = ['Syncing your warehouse…', 'Checking orders at sea…', 'Preparing your dashboard…'];
      msgs.forEach((m, i) => setTimeout(() => { const s = $('#loaderSub'); s.style.opacity = 0; setTimeout(() => { s.textContent = m; s.style.opacity = 1; }, 200); }, i * 800));
      setTimeout(enterApp, reduceMotion ? 300 : 2600);
    }, 500);
  };
}
function enterApp() {
  $('#login').style.display = 'none';
  $('#loader').classList.remove('on');
  $('#app').classList.add('ready');
  placeGlider();
  document.fonts?.ready.then(placeGlider);
  new ResizeObserver(placeGlider).observe($('#modeSwitch'));
  observeReveals();
  setTimeout(() => { updateCounts(); renderUsage(); renderPayments(); animateShip($('#shipMini')); }, 300);
  setTimeout(() => { renderBell(true); toast('Welcome back! 1 product needs your attention'); }, 2200);
}

/* ---------------- INIT ---------------- */
function init() {
  const h = new Date().getHours();
  $('#greetEyebrow').textContent = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'} · ${TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
  $('#shipMini').innerHTML = shipSVG(false);
  renderProducts(); renderInsights(); renderOrders(); renderBell(); bindAdmin();

  document.addEventListener('click', e => {
    const r = e.target.closest('[data-reorder]'); if (r) { e.stopPropagation(); return openReorder(r.dataset.reorder); }
    if (e.target.closest('[data-book]')) return openBooking();
    if (e.target.closest('[data-chat]')) return toggleChat(true);
    const t = e.target.closest('[data-toast]'); if (t) return toast(t.dataset.toast);
    const g = e.target.closest('[data-goto]'); if (g) return go(g.dataset.goto);
    const n = e.target.closest('.nav a'); if (n) return go(n.dataset.view, n.dataset.scroll);
    if (!e.target.closest('.bell-wrap')) $('#bellMenu').classList.remove('on');
  });
  $$('[data-toast-change]').forEach(i => i.onchange = () => toast(i.checked ? i.dataset.toastChange : 'Weekly email digest paused for Crave (demo)'));
  $('#bellBtn').onclick = () => $('#bellMenu').classList.toggle('on');
  $$('#modeSwitch button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  $('#scrim').onclick = closeDrawer;
  $('#modalWrap').onclick = e => { if (e.target.id === 'modalWrap') closeModal(); };
  $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
  $('#tourBtn').onclick = startTour;
  renderChat();
  $('#chatFab').onclick = () => toggleChat();
  $('#chatClose').onclick = () => toggleChat(false);
  $('#chatForm').onsubmit = e => { e.preventDefault(); sendChat($('#chatText').value); $('#chatText').value = ''; };
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (ti >= 0) endTour(); closeDrawer(); closeModal(); toggleChat(false); }
    if (ti >= 0 && e.key === 'ArrowRight') { tAuto = false; tourStep(1); }
    if (ti >= 0 && e.key === 'ArrowLeft') { tAuto = false; tourStep(-1); }
  });
  addEventListener('resize', () => { placeGlider(); if (ti >= 0) tourStep(0); });
  setInterval(updateSync, 5000);

  initLogin();
  if (location.hash === '#skip') { $('#login').style.display = 'none'; enterApp(); }
}
init();
})();
