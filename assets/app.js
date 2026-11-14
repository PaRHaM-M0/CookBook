/* =====================================================================
   PaRHaM's CookBook! — Bilingual Engine (FA RTL + EN LTR)
   Theme, mobile mode, language sync, Wake Lock, checklists, live portion
   scaler (0.5x | 1x | 2x), URL query state sync, faceted library, PWA
   ===================================================================== */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const IS_EN = document.documentElement.lang === "en";

/* Subtle status toast helper */
let toastTimer = null;
function showToast(msg){
  let el = document.getElementById("cbToast");
  if(!el){
    el = document.createElement("div");
    el.id = "cbToast";
    el.className = "cb-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2100);
}

/* Query-string state helper (shared by tabs, modes, gears, moods & scaler) */
window.CookBookURL = {
  get(key){
    try { return new URLSearchParams(location.search).get(key); } catch(_) { return null; }
  },
  set(updates){
    try {
      const p = new URLSearchParams(location.search);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "" || v === "default") p.delete(k);
        else p.set(k, String(v));
      });
      const qs = p.toString();
      const next = location.pathname + (qs ? `?${qs}` : "") + location.hash;
      history.replaceState(null, "", next);
    } catch(_) {}
  }
};

/* Restore preferred language on fresh app launch + preserve query/hash on toggle */
(function syncPreferredLanguage(){
  const btn = document.getElementById("langToggle");
  try {
    const savedLang = localStorage.getItem("cookbook-lang");
    if (!IS_EN && savedLang === "en" && !sessionStorage.getItem("cookbook-lang-manual")) {
      if (btn && btn.getAttribute("href")) {
        sessionStorage.setItem("cookbook-lang-manual", "1");
        location.replace(btn.getAttribute("href") + location.search + location.hash);
        return;
      }
    }
  } catch (_) {}
  if (btn) {
    btn.addEventListener("click", (e) => {
      try {
        sessionStorage.setItem("cookbook-lang-manual", "1");
        localStorage.setItem("cookbook-lang", IS_EN ? "fa" : "en");
        const base = btn.getAttribute("href");
        if (base && (location.search || location.hash)) {
          e.preventDefault();
          location.href = base.split("?")[0].split("#")[0] + location.search + location.hash;
        }
      } catch (_) {}
    });
  }
})();

/* Normalize Persian & Latin search strings */
function norm(str){
  if(!str) return "";
  return str.toString().toLowerCase()
    .replace(/[\u064A\u0649]/g,"ی")
    .replace(/\u0643/g,"ک")
    .replace(/[\u064B-\u0652\u0670]/g,"")
    .replace(/\u200c/g," ")
    .replace(/[ـ]/g,"")
    .replace(/\s+/g," ").trim();
}

/* Mobile detection via user-agent + viewport */
(function detectMobile(){
  const ua = navigator.userAgent || navigator.vendor || "";
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
                   || (window.matchMedia && window.matchMedia("(max-width:760px)").matches);
  document.body.classList.toggle("is-mobile", !!isMobile);
})();

/* Day/night switch and globe from the supplied header design. */
(function theme(){
  const root=document.documentElement, key='kitchen-theme';
  let saved=null;
  try { saved=localStorage.getItem(key); } catch (_) {}
  const prefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial=saved==='dark'||saved==='light' ? saved : (prefersDark?'dark':'light');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const btn=$('#themeToggle');
  const lang=$('#langToggle');
  if(lang) lang.innerHTML="<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18\"/></svg>";
  if(btn){
    btn.innerHTML="<span class=\"dn-pill\"><span class=\"dn-layer dn-sky-night\"></span><svg class=\"dn-layer dn-stars\" viewBox=\"0 0 530 243\" aria-hidden=\"true\"><g transform=\"translate(70 70) scale(7)\"><g class=\"dn-star\" style=\"--i:0;--t:3.2s\"><path d=\"M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z\"/></g></g><g transform=\"translate(160 92) scale(5)\"><g class=\"dn-star\" style=\"--i:1;--t:2.6s\"><path d=\"M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z\"/></g></g><g transform=\"translate(232 72) scale(6)\"><g class=\"dn-star\" style=\"--i:2;--t:3.8s\"><path d=\"M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z\"/></g></g><g transform=\"translate(250 160) scale(8)\"><g class=\"dn-star\" style=\"--i:3;--t:3.1s\"><path d=\"M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z\"/></g></g><g transform=\"translate(120 175) scale(5)\"><g class=\"dn-star\" style=\"--i:4;--t:2.9s\"><path d=\"M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z\"/></g></g><g transform=\"translate(48 130)\"><g class=\"dn-star\" style=\"--i:5;--t:2.2s\"><circle r=\"2.4\"/></g></g><g transform=\"translate(110 40)\"><g class=\"dn-star\" style=\"--i:6;--t:2.7s\"><circle r=\"1.8\"/></g></g><g transform=\"translate(200 130)\"><g class=\"dn-star\" style=\"--i:7;--t:3.4s\"><circle r=\"2.2\"/></g></g><g transform=\"translate(296 108)\"><g class=\"dn-star\" style=\"--i:8;--t:2.4s\"><circle r=\"1.6\"/></g></g><g transform=\"translate(180 205)\"><g class=\"dn-star\" style=\"--i:9;--t:3s\"><circle r=\"1.8\"/></g></g><g transform=\"translate(82 205)\"><g class=\"dn-star\" style=\"--i:10;--t:2.5s\"><circle r=\"1.6\"/></g></g><g transform=\"translate(288 45)\"><g class=\"dn-star\" style=\"--i:11;--t:3.6s\"><circle r=\"1.4\"/></g></g></svg><span class=\"dn-shooting\"></span><span class=\"dn-knob-track\"><span class=\"dn-halo\"></span><span class=\"dn-knob\"><span class=\"dn-sun\"></span><span class=\"dn-moon\"><span class=\"dn-crater dn-c1\"></span><span class=\"dn-crater dn-c2\"></span><span class=\"dn-crater dn-c3\"></span></span></span></span><svg class=\"dn-cloud dn-cloud-1\" viewBox=\"0 0 530 243\" aria-hidden=\"true\"><g fill=\"var(--cloud-1)\"><circle cx=\"230\" cy=\"232\" r=\"42\"/><circle cx=\"310\" cy=\"205\" r=\"48\"/><circle cx=\"388\" cy=\"172\" r=\"54\"/><circle cx=\"462\" cy=\"110\" r=\"70\"/><circle cx=\"528\" cy=\"48\" r=\"72\"/><circle cx=\"480\" cy=\"262\" r=\"100\"/><circle cx=\"540\" cy=\"150\" r=\"60\"/></g></svg><svg class=\"dn-cloud dn-cloud-2\" viewBox=\"0 0 530 243\" aria-hidden=\"true\"><g fill=\"var(--cloud-2)\"><circle cx=\"180\" cy=\"248\" r=\"40\"/><circle cx=\"262\" cy=\"228\" r=\"44\"/><circle cx=\"345\" cy=\"212\" r=\"46\"/><circle cx=\"428\" cy=\"180\" r=\"54\"/><circle cx=\"505\" cy=\"118\" r=\"66\"/><circle cx=\"548\" cy=\"62\" r=\"58\"/><circle cx=\"500\" cy=\"252\" r=\"90\"/></g></svg><svg class=\"dn-cloud dn-cloud-3\" viewBox=\"0 0 530 243\" aria-hidden=\"true\"><g fill=\"var(--cloud-3)\"><circle cx=\"118\" cy=\"268\" r=\"42\"/><circle cx=\"200\" cy=\"254\" r=\"42\"/><circle cx=\"285\" cy=\"246\" r=\"44\"/><circle cx=\"370\" cy=\"238\" r=\"46\"/><circle cx=\"452\" cy=\"208\" r=\"52\"/><circle cx=\"530\" cy=\"150\" r=\"66\"/><circle cx=\"510\" cy=\"262\" r=\"85\"/></g></svg></span>";
    btn.setAttribute('type','button');
    btn.setAttribute('role','switch');
    btn.setAttribute('aria-label',IS_EN?'Dark theme':'تم تاریک');
  }
  function applyTheme(value){
    root.setAttribute('data-theme',value);
    if(themeMeta) themeMeta.content=value==='dark'?'#293432':'#E5EDE1';
    if(btn){
      btn.setAttribute('aria-checked',String(value==='dark'));
      btn.title=IS_EN?(value==='dark'?'Switch to light theme':'Switch to dark theme'):(value==='dark'?'تغییر به تم روشن':'تغییر به تم تاریک');
    }
  }
  applyTheme(initial);
  if(btn) btn.addEventListener('click',()=>{
    const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(next);
    try { localStorage.setItem(key,next); } catch (_) {}
    const knob=btn.querySelector('.dn-knob');
    if(knob && knob.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      knob.animate([{transform:'scale(1,1)'},{transform:'scale(1.14,.88)',offset:.25},{transform:'scale(.94,1.06)',offset:.55},{transform:'scale(1.02,.98)',offset:.75},{transform:'scale(1,1)'}],{duration:800,easing:'ease-out'});
    }
  });
})();

/* =====================================================================
   Kitchen Pro Tools on Recipe Pages:
     1) Screen Wake Lock button (#wakeToggle)
     2) Tap-to-Check Ingredients & Steps (persisted per slug)
     3) Live Portion Scaler (0.5x | 1x | 2x) with unit-aware formatting
   ===================================================================== */
(function kitchenRecipeTools(){
  const ingCard = document.querySelector(".ing-card");
  if (!ingCard) return;

  const slug = (location.pathname.split("/").pop() || "recipe").replace(/\.html$/i, "");
  if (slug === "_template") return;

  /* --- 1. Screen Wake Lock Toggle in Header --- */
  const navLinks = document.querySelector(".nav-links");
  const langBtn = document.getElementById("langToggle");
  if (navLinks && "wakeLock" in navigator) {
    const wakeBtn = document.createElement("button");
    wakeBtn.type = "button";
    wakeBtn.id = "wakeToggle";
    wakeBtn.className = "toggle";
    const lblOff = IS_EN ? "Keep screen awake while cooking" : "روشن ماندن صفحه هنگام آشپزی";
    wakeBtn.setAttribute("aria-label", lblOff);
    wakeBtn.setAttribute("aria-pressed", "false");
    wakeBtn.title = lblOff;
    wakeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M12 18h.01"/><circle cx="12" cy="10" r="2.6"/><path d="M12 5.2v.8M12 14v.8M7.2 10H8M16 10h.8"/></svg>';
    navLinks.insertBefore(wakeBtn, langBtn || navLinks.firstChild);

    let sentinel = null;
    let wantAwake = false;

    async function acquireWake(silent){
      try {
        sentinel = await navigator.wakeLock.request("screen");
        wakeBtn.classList.add("on");
        wakeBtn.setAttribute("aria-pressed", "true");
        sentinel.addEventListener("release", () => {
          if (!wantAwake) {
            wakeBtn.classList.remove("on");
            wakeBtn.setAttribute("aria-pressed", "false");
          }
        });
        if (!silent) showToast(IS_EN ? "Cooking Mode ON — screen stays awake" : "حالت آشپزی فعال شد — صفحه خاموش نمی‌شود");
      } catch (_) {
        wantAwake = false;
        wakeBtn.classList.remove("on");
        wakeBtn.setAttribute("aria-pressed", "false");
        if (!silent) showToast(IS_EN ? "Wake Lock unavailable in this browser mode" : "قفل بیداری در این حالت مرورگر در دسترس نیست");
      }
    }

    wakeBtn.addEventListener("click", async () => {
      if (wantAwake) {
        wantAwake = false;
        if (sentinel) { try { await sentinel.release(); } catch(_) {} sentinel = null; }
        wakeBtn.classList.remove("on");
        wakeBtn.setAttribute("aria-pressed", "false");
        showToast(IS_EN ? "Screen lock restored to normal" : "خاموشی خودکار صفحه به حالت عادی برگشت");
      } else {
        wantAwake = true;
        await acquireWake(false);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (wantAwake && document.visibilityState === "visible") acquireWake(true);
    });
  }

  /* --- 2 & 3. Portion Scaler (0.5x | 1x | 2x) + Tap-to-Check State --- */
  const fixedBatch = ingCard.hasAttribute("data-no-scale");
  const specificScale = ingCard.hasAttribute("data-specific-scale");
  const amtCells = $$("table.ing td.amt", ingCard);
  const ingRows = $$("table.ing tbody tr", ingCard);
  const stepItems = $$(".r-main ol.steps > li");

  const toolsBar = document.createElement("div");
  toolsBar.className = "ing-tools";
  toolsBar.innerHTML = `
    <div class="scale-wrap">
      <span class="scale-lbl">${IS_EN ? "Scale" : "مقیاس"}</span>
      <div class="scale-group" role="group" aria-label="${IS_EN ? "Recipe scale" : "مقیاس مواد اولیه"}">
        <button type="button" class="scale-btn" data-scale="0.5">0.5×</button>
        <button type="button" class="scale-btn active" data-scale="1">1×</button>
        <button type="button" class="scale-btn" data-scale="2">2×</button>
      </div>
    </div>
    <button type="button" class="reset-checks" hidden>${IS_EN ? "Clear checks" : "پاک‌کردن تیک‌ها"}</button>
  `;

  if (fixedBatch) toolsBar.querySelector(".scale-wrap")?.remove();

  const hintEl = document.createElement("p");
  hintEl.className = "check-hint";
  hintEl.textContent = IS_EN
    ? "Tap any ingredient or step to check it off while shopping or cooking."
    : "برای خط زدن هر ماده یا مرحله هنگام خرید و آشپزی، رویش بزن.";

  const firstTable = ingCard.querySelector("table.ing");
  if (firstTable) {
    ingCard.insertBefore(toolsBar, firstTable);
    ingCard.insertBefore(hintEl, firstTable);
  }

  /* Checklist persistence across FA <-> EN via shared recipe slug */
  const storeKey = `cookbook-checks:${slug}`;
  let savedState = { r: [], s: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(storeKey) || "null");
    if (parsed && Array.isArray(parsed.r) && Array.isArray(parsed.s)) savedState = parsed;
  } catch (_) {}

  const resetBtn = toolsBar.querySelector(".reset-checks");
  function syncResetVisibility(){
    const anyChecked = savedState.r.length > 0 || savedState.s.length > 0;
    if (resetBtn) resetBtn.hidden = !anyChecked;
  }
  function saveChecks(){
    try { localStorage.setItem(storeKey, JSON.stringify(savedState)); } catch (_) {}
    syncResetVisibility();
  }

  ingRows.forEach((tr, idx) => {
    if (savedState.r.includes(idx)) tr.classList.add("checked");
    tr.addEventListener("click", (e) => {
      if (e.target.closest("a, button, input, select")) return;
      const on = tr.classList.toggle("checked");
      savedState.r = on ? [...new Set([...savedState.r, idx])] : savedState.r.filter((x) => x !== idx);
      saveChecks();
    });
  });

  stepItems.forEach((li, idx) => {
    if (savedState.s.includes(idx)) li.classList.add("checked");
    li.addEventListener("click", (e) => {
      if (e.target.closest("a, button, input, select")) return;
      if (window.getSelection && String(window.getSelection()).length > 0) return;
      const on = li.classList.toggle("checked");
      savedState.s = on ? [...new Set([...savedState.s, idx])] : savedState.s.filter((x) => x !== idx);
      saveChecks();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      savedState = { r: [], s: [] };
      ingRows.forEach((tr) => tr.classList.remove("checked"));
      stepItems.forEach((li) => li.classList.remove("checked"));
      try { localStorage.removeItem(storeKey); } catch (_) {}
      syncResetVisibility();
    });
  }
  syncResetVisibility();

  /* Precision Culinary Quantity Scaler (handles FA digits, EN digits, vulgar fractions) */
  const FRAC_MAP = {
    "½": 0.5, "⅓": 1/3, "⅔": 2/3, "¼": 0.25, "¾": 0.75,
    "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875
  };
  const NICE_FRACS = [
    [0.125, "⅛"], [0.25, "¼"], [1/3, "⅓"], [0.375, "⅜"],
    [0.5, "½"], [0.625, "⅝"], [2/3, "⅔"], [0.75, "¾"], [0.875, "⅞"]
  ];
  const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  const toAsciiDigits = (s) => s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/٫/g, ".");
  const toFaDigits = (s) => s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]).replace(/\./g, "٫");

  function formatScaled(val, useFaDigits, preferFraction){
    if (!isFinite(val)) return "";
    const roundedInt = Math.round(val);
    if (Math.abs(val - roundedInt) < 0.015) {
      const out = String(roundedInt);
      return useFaDigits ? toFaDigits(out) : out;
    }
    if (preferFraction) {
      const whole = Math.floor(val + 0.01);
      const rem = val - whole;
      for (const [fv, sym] of NICE_FRACS) {
        if (Math.abs(rem - fv) < 0.03) {
          const wStr = whole > 0 ? (useFaDigits ? toFaDigits(String(whole)) + " " : String(whole)) : "";
          return wStr + sym;
        }
      }
    }
    const clean = Number(val.toFixed(val < 10 ? (specificScale ? 3 : 2) : 1)).toString();
    return useFaDigits ? toFaDigits(clean) : clean;
  }

  /* Match integers/decimals + optional attached/spaced vulgar fraction, or standalone vulgar fraction */
  const QTY_TOKEN_RE = /([0-9۰-۹]+(?:[.,٫][0-9۰-۹]+)?(?:\s*[½⅓⅔¼¾⅛⅜⅝⅞])?|[½⅓⅔¼¾⅛⅜⅝⅞])/g;

  function scaleTextNode(text, factor){
    return text.replace(QTY_TOKEN_RE, (match, _g1, offset, fullStr) => {
      const after = fullStr.slice(offset + match.length);
      /* Never scale temperatures (°C/°F), percentages (%/٪), or dimensional thicknesses (mm/cm/inch) */
      if (/^\s*(?:°|درجه|%|٪|(?:mm|cm|in|inch|اینچ|میلی‌متر|سانتی‌متر)\b)/i.test(after)) {
        return match;
      }
      const hadFa = /[۰-۹]/.test(match);
      const hadVulgar = /[½⅓⅔¼¾⅛⅜⅝⅞]/.test(match);
      const normStr = toAsciiDigits(match).trim();
      let numeric = 0;
      const fracChar = normStr.match(/[½⅓⅔¼¾⅛⅜⅝⅞]/);
      if (fracChar) {
        const lead = normStr.replace(/[½⅓⅔¼¾⅛⅜⅝⅞]/, "").trim();
        numeric = (lead ? parseFloat(lead) : 0) + FRAC_MAP[fracChar[0]];
      } else {
        numeric = parseFloat(normStr.replace(/,/g, ""));
      }
      if (!isFinite(numeric) || numeric === 0) return match;
      return formatScaled(numeric * factor, hadFa, hadVulgar);
    });
  }

  amtCells.forEach((td) => { td.dataset.rawHtml = td.innerHTML; });
  const recipeQuantities = specificScale ? $$('[data-scale-quantity]') : [];
  const recipeAlternates = specificScale ? $$('[data-scale-half][data-scale-double]') : [];
  const recipeUnits = specificScale ? $$('[data-scale-unit]') : [];
  recipeQuantities.forEach(el => { el.dataset.scaleOriginal = el.textContent; });
  recipeAlternates.forEach(el => { el.dataset.scaleOriginal = el.textContent; });

  function applyScale(factor, syncUrl){
    amtCells.forEach((td) => {
      td.innerHTML = td.dataset.rawHtml;
      if (factor === 1) return;
      const walker = document.createTreeWalker(td, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach((tn) => { tn.nodeValue = scaleTextNode(tn.nodeValue, factor); if (specificScale && IS_EN) tn.nodeValue = tn.nodeValue.replace(/\b2 cup\b/g, "2 cups"); });
    });
    recipeQuantities.forEach(el => { el.textContent = factor === 1 ? el.dataset.scaleOriginal : scaleTextNode(el.dataset.scaleOriginal, factor); });
    recipeAlternates.forEach(el => { el.textContent = factor === 0.5 ? el.dataset.scaleHalf : factor === 2 ? el.dataset.scaleDouble : el.dataset.scaleOriginal; });
    recipeUnits.forEach(el => { el.textContent = el.dataset.scaleUnit + (factor === 2 ? 's' : ''); });
    $$(".scale-btn", toolsBar).forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.scale) === factor);
    });
    if (syncUrl) {
      window.CookBookURL.set({ scale: factor === 1 ? null : factor });
    }
  }

  $$(".scale-btn", toolsBar).forEach((btn) => {
    btn.addEventListener("click", () => applyScale(Number(btn.dataset.scale), true));
  });

  const urlScale = parseFloat(window.CookBookURL.get("scale") || "1");
  if (!fixedBatch && (urlScale === 0.5 || urlScale === 2)) applyScale(urlScale, false);
})();

/* Navbar scroll border */
(function navShadow(){
  const nav=$('#nav'); if(!nav) return;
  const on=()=>nav.classList.toggle('scrolled', window.scrollY>20);
  on(); window.addEventListener('scroll',on,{passive:true});
})();

/* Quiet reading progress on every page, following the document scroll position. */
(function readingProgress(){
  const nav = document.getElementById('nav');
  if (!nav) return;
  const bar = document.createElement('span');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  nav.appendChild(bar);
  let queued = false;
  function update(){
    queued = false;
    const root = document.scrollingElement || document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }
  function requestUpdate(){
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  window.addEventListener('load', requestUpdate, {once:true});
  if ('ResizeObserver' in window) new ResizeObserver(requestUpdate).observe(document.body);
  update();
})();

/* Footer year */
(function(){ const y=$('#year'); if(y) y.textContent=new Date().getFullYear(); })();

/* Scroll reveal — stagger is scoped to the batch that actually enters the viewport,
   so an element far down the page never waits on a delay borrowed from document order. */
(function reveal(){
  const els=$$('.reveal'); if(!els.length) return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io=new IntersectionObserver(es=>{
    const entering=es.filter(e=>e.isIntersecting);
    entering.forEach((e,i)=>{
      e.target.style.transitionDelay = reduce ? '0s' : (Math.min(i,4)*0.04)+'s';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  },{threshold:.12, rootMargin:'0px 0px -6% 0px'});
  els.forEach(el=>{ el.style.transitionDelay='0s'; io.observe(el); });
})();

/* =====================================================================
   Homepage Library Engine (Bilingual FA + EN)
   ===================================================================== */
(function gallery(){
  const grid = $('#grid');
  if(!grid) return;
  const loadingEl=$('#loading');
  const errorEl=$('#loadError');
  if(typeof RECIPES==="undefined" || typeof FILTERS==="undefined"){
    if(loadingEl) loadingEl.style.display='none';
    if(errorEl) { errorEl.hidden = false; errorEl.classList.add('show'); }
    return;
  }

  const STR = IS_EN ? {
    all: 'All',
    featured: 'Featured',
    onlyFeatured: 'Featured only',
    searchPrefix: 'Search: ',
    filteredResults: 'Filtered Results',
    allRecipes: 'All Recipes',
    uncategorized: 'Other',
    recipeFallback: 'Recipe',
    viewRecipe: 'View Recipe',
    photoLater: 'Photo Soon',
    open: 'Open',
    close: 'Close',
    count: (n) => `${n} ${n === 1 ? 'recipe' : 'recipes'}`,
    apply: (n) => `Show ${n} ${n === 1 ? 'recipe' : 'recipes'}`
  } : {
    all: 'همه',
    featured: 'منتخب‌ها',
    onlyFeatured: 'فقط منتخب‌ها',
    searchPrefix: 'جست‌وجو: ',
    filteredResults: 'نتایج فیلترشده',
    allRecipes: 'همه‌ی دستورها',
    uncategorized: 'سایر',
    recipeFallback: 'دستور پخت',
    viewRecipe: 'مشاهده دستور',
    photoLater: 'عکس بعداً',
    open: 'باز کردن',
    close: 'بستن',
    count: (n) => `${n.toString().replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])} دستور`,
    apply: (n) => `نمایش ${n.toString().replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])} دستور`
  };

  const assetPrefix = IS_EN ? '../' : '';
  /* Responsive images: every photo ships a 480w and a 960w WebP next to the
     original. 64px thumbs take the 480, spreads take the 960, and the original
     backs up hi-dpi screens. */
  const sized = (name, w) => name.replace(/\.webp$/i, `-${w}.webp`);
  const searchInput = $('#search');
  const filterBar   = $('#filters');
  const quickBar    = $('#quickCats');
  const quickAll    = $('#quickAll');
  const quickFeatured = $('#quickFeatured');
  const countEl     = $('#count');
  const titleEl     = $('#resultsTitle');
  const activeEl    = $('#activeFilters');
  const emptyEl     = $('#empty');
  const clearBtn    = $('#clearFilters');
  const sortSelect  = $('#sortSelect');
  const filtersToggle = $('#filtersToggle');
  const filtersToggleText = $('#filtersToggleText');
  const filtersPanel = filterBar?.closest('.filters-panel');

  const categoryOrder = Object.keys(FILTERS.category?.options || {});
  const groupOrder = ['category','cuisine','main','meal','time','level'].filter(k=>FILTERS[k]);
  const timeRank = {quick:1, medium:2, long:3, project:4};
  const levelRank = {easy:1, medium:2, hard:3};
  const state = {};
  groupOrder.forEach(k => state[k]=new Set());
  let query = "";
  let sortMode = "default";
  let quickMode = "all";

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Jumping the page on every facet click disorients: only move when the
     gallery heading is not already comfortably in view. */
  function revealGallery(){
    const g = document.getElementById('gallery'); if(!g) return;
    const top = g.getBoundingClientRect().top;
    if(top > 72 && top < window.innerHeight * 0.5) return;
    g.scrollIntoView({behavior: reducedMotion() ? 'auto' : 'smooth', block:'start'});
  }

  const setStat=(name,value)=>{ const el=document.querySelector(`[data-stat="${name}"]`); if(el) el.textContent=value; };
  setStat('recipes', RECIPES.length);
  setStat('featured', RECIPES.filter(r=>r.featured).length);
  setStat('categories', categoryOrder.length);

  function gTitle(group){ return IS_EN ? (FILTERS[group]?.title_en || FILTERS[group]?.title) : FILTERS[group]?.title; }
  function label(group,key){
    const opt = FILTERS[group]?.options?.[key];
    return IS_EN ? (opt?.label_en || opt?.label || key) : (opt?.label || key);
  }

  function haystack(r){
    return norm([r.name, r.fa, r.desc, r.desc_en, (r.tags||[]).join(" "),
      typeof INGREDIENT_SEARCH !== "undefined" ? INGREDIENT_SEARCH[r.page] : "",
      FILTERS.category?.options?.[r.category]?.label, FILTERS.category?.options?.[r.category]?.label_en,
      FILTERS.meal?.options?.[r.meal]?.label, FILTERS.meal?.options?.[r.meal]?.label_en,
      FILTERS.cuisine?.options?.[r.cuisine]?.label, FILTERS.cuisine?.options?.[r.cuisine]?.label_en,
      FILTERS.main?.options?.[r.main]?.label, FILTERS.main?.options?.[r.main]?.label_en,
      FILTERS.time?.options?.[r.time]?.label, FILTERS.time?.options?.[r.time]?.label_en,
      FILTERS.level?.options?.[r.level]?.label, FILTERS.level?.options?.[r.level]?.label_en
    ].join(" "));
  }

  function matchesExcept(r, exceptGroup){
    if(quickMode==='featured' && exceptGroup!=='__quick' && !r.featured) return false;
    for(const g of groupOrder){
      if(g===exceptGroup) continue;
      if(state[g].size && !state[g].has(r[g])) return false;
    }
    if(query && !haystack(r).includes(query)) return false;
    return true;
  }
  function match(r){
    if(quickMode==='featured' && !r.featured) return false;
    return matchesExcept(r, '__none');
  }
  function countFor(group,key){
    return RECIPES.filter(r=>r[group]===key && matchesExcept(r,group)).length;
  }

  /* Recipe suggestions: shuffle once per visit, then cycle without repeats. */
  (function heroShowcase(){
    const root = document.getElementById('heroShowcase');
    const el = document.getElementById('heroFeatured');
    const media = document.getElementById('hfMedia');
    const title = document.getElementById('hfTitle');
    const meta = document.getElementById('hfMeta');
    const controls = document.getElementById('showcaseControls');
    const counter = document.getElementById('showcaseIndex');
    const status = document.getElementById('showcaseStatus');
    const pause = document.getElementById('showcasePause');
    if (!root || !el || !media || !title || !meta || !controls || !counter || !pause) return;
    const pool = RECIPES.filter(r => r.image && r.page);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    if (!pool.length) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, paused = motion.matches, timer = null, request = 0;
    const pauseLabel = () => {
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused
        ? (IS_EN ? 'Play autoplay' : 'شروع پخش خودکار')
        : (IS_EN ? 'Pause autoplay' : 'توقف پخش خودکار'));
      pause.querySelector('.showcase-pause-icon').toggleAttribute('hidden', paused);
      pause.querySelector('.showcase-play-icon').toggleAttribute('hidden', !paused);
    };
    function schedule(){
      clearTimeout(timer);
      if (!paused && !document.hidden && pool.length > 1)
        timer = setTimeout(() => show(index + 1, false), 6000);
    }
    function show(next, manual){
      const wanted = (next + pool.length) % pool.length;
      const r = pool[wanted];
      const id = ++request;
      const img = new Image();
      img.alt = r.name;
      img.decoding = 'async';
      img.onload = () => {
        if (id !== request) return;
        index = wanted;
        el.href = r.page;
        title.textContent = r.name;
        // Align the entire recipe caption by the title's own first strong script,
        // independently of the surrounding page language.
        const firstStrong = r.name.match(/[A-Za-z\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/);
        el.dataset.titleDir = firstStrong && /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/.test(firstStrong[0]) ? 'rtl' : 'ltr';
        meta.replaceChildren();
        [r.category && label('category', r.category), r.level && label('level', r.level),
          r.time && label('time', r.time)].filter(Boolean).forEach(text => {
          const span = document.createElement('span'); span.dir = 'auto'; span.textContent = text; meta.appendChild(span);
        });
        media.replaceChildren(img);
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(pool.length).padStart(2, '0')}`;
        if (status) status.textContent = manual ? r.name : '';
        schedule();
      };
      img.onerror = () => { if (id === request) schedule(); };
      img.src = assetPrefix + sized(r.image, 960);
    }
    controls.hidden = pool.length < 2;
    pauseLabel();
    show(0, false);
    document.getElementById('showcasePrev')?.addEventListener('click', () => show(index - 1, true));
    document.getElementById('showcaseNext')?.addEventListener('click', () => show(index + 1, true));
    pause.addEventListener('click', () => {
      paused = !paused;
      if (paused) request++; // Ignore an automatic image already loading.
      pauseLabel(); schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener?.('change', e => { if (e.matches) { paused = true; pauseLabel(); } schedule(); });
    let touchX = null;
    el.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
    el.addEventListener('touchend', e => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(delta) > 50) show(index + (delta < 0 ? 1 : -1) * (IS_EN ? 1 : -1), true);
    }, {passive:true});
  })();

  function quickImage(key){
    const hit = RECIPES.find(r => r.category===key && r.image);
    return hit?.image || '';
  }

  function buildQuick(){
    const countText=n=>Number(n).toLocaleString(IS_EN?'en-US':'fa-IR');
    if(quickAll){
      quickAll.innerHTML=`<span>${STR.all}</span><small>${countText(RECIPES.length)}</small>`;
      const active=quickMode==='all'&&!state.category.size;
      quickAll.classList.toggle('is-active',active);
      quickAll.setAttribute('aria-pressed',active?'true':'false');
    }
    if(quickFeatured){
      const n=RECIPES.filter(r=>r.featured).length;
      quickFeatured.innerHTML=`<span>${STR.featured}</span><small>${countText(n)}</small>`;
      quickFeatured.classList.toggle('is-active',quickMode==='featured');
      quickFeatured.setAttribute('aria-pressed',quickMode==='featured'?'true':'false');
    }
    if(!quickBar) return;
    quickBar.innerHTML='';
    categoryOrder.forEach(key=>{
      const text=label('category',key);
      const count=RECIPES.filter(r=>r.category===key).length;
      const rawImage=quickImage(key);
      const image=rawImage ? `<img src="${assetPrefix}${sized(rawImage,480)}" srcset="${assetPrefix}${sized(rawImage,480)} 480w, ${assetPrefix}${sized(rawImage,960)} 960w, ${assetPrefix}${rawImage} 1440w" sizes="(max-width:700px) 39vw, 148px" width="480" height="360" alt="" loading="lazy" decoding="async">` : '';
      const b=document.createElement('button');
      b.type='button';
      const active=quickMode==='category'&&state.category.size===1&&state.category.has(key);
      b.className='category-card'+(rawImage?'':' no-image');
      b.setAttribute('aria-label',`${text}, ${STR.count(count)}`);
      b.setAttribute('aria-pressed',active?'true':'false');
      b.innerHTML=`${image}<span class="cat-count" aria-hidden="true">${countText(count)}</span><span class="cat-title">${text}</span>`;
      b.addEventListener('click',()=>{
        quickMode='category';state.category.clear();state.category.add(key);
        revealGallery();render();
      });
      quickBar.appendChild(b);
    });
  }

  // Touch uses native horizontal scrolling; mouse drag should not activate a category.
  if (quickBar) {
    let startX = 0, startScroll = 0, pointerId = null, dragging = false, suppressClick = false;
    quickBar.addEventListener('dragstart', e => e.preventDefault());
    quickBar.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      startX = e.clientX; startScroll = quickBar.scrollLeft; pointerId = e.pointerId;
      dragging = false; suppressClick = false;
    });
    quickBar.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const delta = e.clientX - startX;
      if (!dragging && Math.abs(delta) > 6) {
        dragging = true; suppressClick = true;
        quickBar.classList.add('dragging');
        quickBar.setPointerCapture(e.pointerId);
      }
      if (dragging) { e.preventDefault(); quickBar.scrollLeft = startScroll - delta; }
    });
    function finishDrag(e) {
      if (pointerId !== e.pointerId) return;
      pointerId = null; dragging = false; quickBar.classList.remove('dragging');
      if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
    }
    quickBar.addEventListener('pointerup', finishDrag);
    quickBar.addEventListener('pointercancel', finishDrag);
    quickBar.addEventListener('lostpointercapture', finishDrag);
    quickBar.addEventListener('click', e => {
      if (suppressClick && e.detail !== 0) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  }

  function buildFilters(){
    if(!filterBar) return;
    const focused = document.activeElement;
    const focusedGroup = filterBar.contains(focused) ? focused.dataset.filterGroup : null;
    const focusedKey = focusedGroup ? focused.dataset.filterKey : null;
    filterBar.innerHTML='';
    groupOrder.forEach(groupKey=>{
      const group=FILTERS[groupKey];
      const used=new Set(RECIPES.map(r=>r[groupKey]).filter(Boolean));
      const opts=Object.entries(group.options).filter(([k])=>used.has(k));
      if(!opts.length) return;
      const wrap=document.createElement('div'); wrap.className='fgroup';
      wrap.innerHTML=`<div class="fgroup-title">${gTitle(groupKey)}</div>`;
      const chips=document.createElement('div'); chips.className='chips';
      opts.forEach(([key])=>{
        const n=countFor(groupKey,key);
        const b=document.createElement('button');
        b.dataset.filterGroup=groupKey; b.dataset.filterKey=key;
        b.type='button'; b.className='chip'+(state[groupKey].has(key)?' on':''); b.disabled=(n===0&&!state[groupKey].has(key));
        b.innerHTML=`<span>${label(groupKey,key)}</span><span class="chip-count">${n}</span>`;
        b.setAttribute('aria-pressed', state[groupKey].has(key)?'true':'false');
        b.addEventListener('click',()=>{
          if(state[groupKey].has(key)) state[groupKey].delete(key); else state[groupKey].add(key);
          if(groupKey==='category') quickMode=state.category.size?'category':'all';
          render();
        });
        chips.appendChild(b);
      });
      wrap.appendChild(chips); filterBar.appendChild(wrap);
    });
    if (focusedGroup) {
      const next = [...filterBar.querySelectorAll('.chip')].find(el => el.dataset.filterGroup === focusedGroup && el.dataset.filterKey === focusedKey && !el.disabled);
      (next || sheetClose)?.focus({preventScroll:true});
    }
  }

  const phMark = `<div class="ph-mark">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="8.5" cy="8.5" r="1.8"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg><span>${STR.photoLater}</span></div>`;

  /* Photo card. The image is the tile's face; the body carries the name and
     the two facts people actually compare (time, difficulty). */
  function card(r, wide){
    const a=document.createElement('a');
    a.className='rcard'+(wide?' wide':'');
    a.href=r.page||'#';
    const img = r.image
      ? `<img src="${assetPrefix}${sized(r.image,480)}" alt="" width="480" height="360" loading="lazy" decoding="async">`
      : '';
    /* 29 of 37 dishes are featured, so a text badge would be noise: a quiet
       saffron dot marks the state and the pill rail filters by it. */
    const badge = r.featured ? `<span class="rdot" title="${STR.featured}" aria-label="${STR.featured}"></span>` : '';
    const cat = r.category ? `<span class="rcard-cat">${label('category',r.category)}</span>` : '';
    const meta=[];
    if(r.time) meta.push(label('time',r.time));
    if(r.level) meta.push(label('level',r.level));
    const summaryText = IS_EN ? (r.desc_en || r.desc || "") : (r.desc || "");
    a.innerHTML=`
      <span class="ph">${img}${badge}${cat}</span>
      <span class="rcard-body">
        <span class="rcard-title">${r.name}</span>
        <span class="rcard-desc">${summaryText}</span>
        <span class="rcard-meta">${meta.map(m=>`<span>${m}</span>`).join("")}</span>
      </span>`;
    return a;
  }

  function sorted(list){
    const copy=[...list];
    if(sortMode==='featured') copy.sort((a,b)=>Number(b.featured||false)-Number(a.featured||false) || a.name.localeCompare(b.name,'en'));
    else if(sortMode==='name') copy.sort((a,b)=>a.name.localeCompare(b.name,'en'));
    else if(sortMode==='quickest') copy.sort((a,b)=>(timeRank[a.time]||99)-(timeRank[b.time]||99) || a.name.localeCompare(b.name,'en'));
    else if(sortMode==='easiest') copy.sort((a,b)=>(levelRank[a.level]||99)-(levelRank[b.level]||99) || a.name.localeCompare(b.name,'en'));
    return copy;
  }

  function buildActive(listCount){
    if(!activeEl) return;
    activeEl.innerHTML='';
    const makePill=(text,clear)=>{
      const b=document.createElement('button'); b.type='button'; b.className='active-filter';
      const label = document.createElement('b'); label.textContent = text;
      const close = document.createElement('span'); close.setAttribute('aria-hidden', 'true'); close.textContent = '×';
      b.append(label, close);
      b.addEventListener('click',clear); activeEl.appendChild(b);
    };
    if(query) makePill(`${STR.searchPrefix}${searchInput?.value || ''}`,()=>{query=''; if(searchInput)searchInput.value=''; render();});
    if(quickMode==='featured') makePill(STR.onlyFeatured,()=>{quickMode='all';render();});
    groupOrder.forEach(g=>state[g].forEach(key=>makePill(`${gTitle(g)}: ${label(g,key)}`,()=>{state[g].delete(key); if(g==='category'&&!state.category.size)quickMode='all'; render();})));
    if(clearBtn) clearBtn.style.display=(query||quickMode!=='all'||Object.values(state).some(s=>s.size))?'inline-flex':'none';
    if(titleEl){
      if(state.category.size===1) titleEl.textContent=label('category',[...state.category][0]);
      else if(quickMode==='featured') titleEl.textContent=STR.featured;
      else if(query||Object.values(state).some(s=>s.size)) titleEl.textContent=STR.filteredResults;
      else titleEl.textContent=STR.allRecipes;
    }
    if(countEl) countEl.textContent=listCount?STR.count(listCount):'';
    if(sheetApply) sheetApply.textContent = STR.apply(listCount);
  }

  function groupBlock(title, items){
    const sec=document.createElement('section'); sec.className='card-group';
    sec.innerHTML=`<div class="card-group-head"><h3>${title}</h3><span>${STR.count(items.length)}</span></div>`;
    const wrap=document.createElement('div'); wrap.className='card-grid';
    items.forEach(r=>wrap.appendChild(card(r)));
    sec.appendChild(wrap);
    return sec;
  }

  /* Three recipes tagged quick, alphabetically — the tile that answers
     "what can I cook tonight" without a scroll. */
  function buildFast(){
    const box=document.getElementById('quickFast');
    if(!box) return;
    const quick = [...RECIPES]
      .filter(r => r.time && (timeRank[r.time]||99) === 1)
      .sort((a,b)=>(timeRank[a.time]||99)-(timeRank[b.time]||99) || a.name.localeCompare(b.name,'en'))
      .slice(0,3);
    const pool = quick;
    box.innerHTML = pool.map(r=>`
      <li><a class="fast-item" href="${r.page||'#'}">
        <span class="fi-name">${r.name}</span>
        <span class="fi-time">${r.time ? label('time', r.time) : (IS_EN?'—':'—')}</span>
      </a></li>`).join('');
  }

  function render(){
    const list=sorted(RECIPES.filter(match));
    buildQuick(); buildFilters(); buildActive(list.length);
    grid.innerHTML='';
    if(!list.length){ if(emptyEl) emptyEl.hidden = false; if(loadingEl) loadingEl.style.display='none'; return; }
    if(emptyEl) emptyEl.hidden = true;

    if(sortMode==='default'){
      categoryOrder.forEach(cat=>{
        const items=list.filter(r=>r.category===cat);
        if(!items.length)return;
        grid.appendChild(groupBlock(label('category',cat), items));
      });
      const uncategorized=list.filter(r=>!categoryOrder.includes(r.category));
      if(uncategorized.length) grid.appendChild(groupBlock(STR.uncategorized, uncategorized));
    } else {
      const wrap=document.createElement('div'); wrap.className='card-grid';
      list.forEach(r=>wrap.appendChild(card(r)));
      grid.appendChild(wrap);
    }
    if(loadingEl) loadingEl.style.display='none';
  }

  if(searchInput) searchInput.addEventListener('input', e=>{ query=norm(e.target.value); render(); });

  /* "/" focuses search, Escape clears then blurs. Keyboard-driven actions get no
     animation — they are used many times per session. */
  document.addEventListener('keydown', e=>{
    const t=e.target;
    const typing = t && (t.tagName==='INPUT' || t.tagName==='TEXTAREA' || t.tagName==='SELECT' || t.isContentEditable);
    if(e.key==='/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey &&
       !(filtersPanel?.classList.contains('open') && window.matchMedia('(max-width: 1049px)').matches)){
      e.preventDefault(); searchInput?.focus(); searchInput?.select?.(); return;
    }
    if(e.key==='Escape' && searchInput && t===searchInput){
      if(searchInput.value){ searchInput.value=''; query=''; render(); } else { searchInput.blur(); }
    }
  });
  if(sortSelect) sortSelect.addEventListener('change',e=>{sortMode=e.target.value;render();});
  if(clearBtn) clearBtn.addEventListener('click',()=>{
    query=''; if(searchInput)searchInput.value=''; quickMode='all'; sortMode='default'; if(sortSelect)sortSelect.value='default';
    Object.values(state).forEach(s=>s.clear()); render();
    if (window.matchMedia('(max-width: 1049px)').matches && filtersPanel?.classList.contains('open')) sheetClose?.focus({preventScroll:true});
  });

  function syncFiltersToggle(){
    if(!filtersPanel || !filtersToggle) return;
    /* v7: the same control opens a drawer on desktop and a bottom sheet on mobile,
       so its state is simply "is the panel open", at every width. */
    const open = filtersPanel.classList.contains('open');
    filtersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(filtersToggleText) filtersToggleText.textContent = open ? STR.close : (IS_EN ? 'Filters' : 'فیلترها');
    document.getElementById('mbarFilters')?.setAttribute('aria-expanded', String(open));
  }
  /* ---- Mobile bottom sheet + bottom access bar ------------------------- */
  const backdrop = document.getElementById('filtersBackdrop');
  const sheetApply = document.getElementById('sheetApply');
  const sheetClose = document.getElementById('sheetClose');

  const mobileSheet = window.matchMedia('(max-width: 1049px)');
  let sheetOpener = null;
  let modalActive = false;
  function focusableSheetItems(){
    return [...filtersPanel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
  }
  function syncSheetMode(focusOnEnter = false){
    const isOpen = filtersPanel.classList.contains('open');
    const isModal = isOpen && mobileSheet.matches;
    const wasModal = modalActive;
    modalActive = isModal;
    if (isModal) {
      filtersPanel.setAttribute('role', 'dialog');
      filtersPanel.setAttribute('aria-modal', 'true');
      filtersPanel.setAttribute('aria-labelledby', 'filtersPanelTitle');
      if (focusOnEnter || !filtersPanel.contains(document.activeElement)) (sheetClose || filtersPanel).focus({preventScroll:true});
    } else {
      filtersPanel.removeAttribute('role');
      filtersPanel.removeAttribute('aria-modal');
      filtersPanel.removeAttribute('aria-labelledby');
      if (isOpen && wasModal && (!document.activeElement.getClientRects().length || !filtersPanel.contains(document.activeElement))) {
        (focusableSheetItems()[0] || filtersToggle)?.focus({preventScroll:true});
      }
    }
  }
  function setSheet(open, opener){
    if(!filtersPanel) return;
    const wasOpen = filtersPanel.classList.contains('open');
    const wasModal = modalActive;
    if (open && !wasOpen) sheetOpener = opener || document.activeElement;
    filtersPanel.classList.toggle('open', open);
    if (!open) filtersPanel.classList.remove('is-expanded');
    if(backdrop) backdrop.classList.toggle('show', open);
    document.body.classList.toggle('sheet-open', open);
    syncFiltersToggle();
    syncSheetMode(open && !wasOpen);
    if (!open && wasOpen && wasModal && sheetOpener?.isConnected && sheetOpener.getClientRects().length) {
      sheetOpener.focus({preventScroll:true});
    }
    if (!open) sheetOpener = null;
  }
  mobileSheet.addEventListener?.('change', () => syncSheetMode());
  document.addEventListener('focusin', e => {
    if (modalActive && !filtersPanel.contains(e.target)) (focusableSheetItems()[0] || filtersPanel).focus({preventScroll:true});
  });
  document.addEventListener('keydown', e => {
    if (!modalActive || e.key !== 'Tab') return;
    const items = focusableSheetItems();
    if (!items.length) { e.preventDefault(); filtersPanel.focus({preventScroll:true}); return; }
    const index = items.indexOf(document.activeElement);
    if (e.shiftKey && index <= 0) { e.preventDefault(); items[items.length-1].focus(); }
    else if (!e.shiftKey && (index < 0 || index === items.length-1)) { e.preventDefault(); items[0].focus(); }
  });

  // Only the grip and unused header area drag the sheet. The filter list keeps
  // native scrolling, so selecting chips and scrolling never competes with it.
  const sheetGrip = document.getElementById('sheetGrip');
  const sheetHead = filtersPanel?.querySelector('.filters-panel-head');
  let sheetDrag = null;
  function dragStart(e){
    if (!window.matchMedia('(max-width: 1049px)').matches || !filtersPanel.classList.contains('open') ||
        (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('button')) return;
    const offset = Math.min(window.innerHeight * .08, 120);
    const height = Math.min(window.innerHeight * .92, 900);
    const base = filtersPanel.classList.contains('is-expanded') ? 0 : offset;
    sheetDrag = {id:e.pointerId, startY:e.clientY, lastY:e.clientY, lastTime:performance.now(), velocity:0, base, offset, height};
    filtersPanel.classList.add('is-dragging');
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function dragMove(e){
    if (!sheetDrag || sheetDrag.id !== e.pointerId) return;
    e.preventDefault();
    const now = performance.now();
    if (now > sheetDrag.lastTime) sheetDrag.velocity = (e.clientY - sheetDrag.lastY) / (now - sheetDrag.lastTime);
    sheetDrag.lastY = e.clientY; sheetDrag.lastTime = now;
    const y = Math.max(0, Math.min(sheetDrag.height, sheetDrag.base + e.clientY - sheetDrag.startY));
    filtersPanel.style.height = `${sheetDrag.height - Math.min(y, sheetDrag.offset)}px`;
    filtersPanel.style.transform = `translateY(${Math.max(0, y - sheetDrag.offset)}px)`;
  }
  function dragEnd(e){
    if (!sheetDrag || sheetDrag.id !== e.pointerId) return;
    const drag = sheetDrag; sheetDrag = null;
    const y = Math.max(0, Math.min(drag.height, drag.base + e.clientY - drag.startY));
    const distance = e.clientY - drag.startY;
    const velocity = performance.now() - drag.lastTime < 100 ? drag.velocity : 0;
    filtersPanel.classList.remove('is-dragging');
    if (e.type !== 'pointercancel' && (y > drag.offset + drag.height * .25 || (distance > 30 && velocity > .65))) {
      setSheet(false);
    } else if (e.type !== 'pointercancel' && Math.abs(distance) > 12) {
      filtersPanel.classList.toggle('is-expanded', distance < 0 || y < drag.offset / 2);
    }
    filtersPanel.style.removeProperty('transform');
    filtersPanel.style.removeProperty('height');
  }
  [sheetGrip, sheetHead].filter(Boolean).forEach(handle => {
    handle.addEventListener('pointerdown', dragStart);
    handle.addEventListener('pointermove', dragMove);
    handle.addEventListener('pointerup', dragEnd);
    handle.addEventListener('pointercancel', dragEnd);
  });

  if(filtersToggle && filtersPanel){
    filtersToggle.addEventListener('click', () => setSheet(!filtersPanel.classList.contains('open'), filtersToggle));

  }
  backdrop?.addEventListener('click', () => setSheet(false));
  sheetClose?.addEventListener('click', () => setSheet(false));
  sheetApply?.addEventListener('click', () => setSheet(false));
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && filtersPanel?.classList.contains('open')) setSheet(false);
  });

  const mbarSearch = document.getElementById('mbarSearch');
  const mbarCats   = document.getElementById('mbarCats');
  const mbarFilters= document.getElementById('mbarFilters');

  mbarSearch?.addEventListener('click', () => {
    searchInput?.scrollIntoView({behavior: reducedMotion() ? 'auto' : 'smooth', block:'center'});
    searchInput?.focus({preventScroll:true});
  });
  mbarCats?.addEventListener('click', () => {
    document.querySelector('.category-browse')?.scrollIntoView({behavior: reducedMotion() ? 'auto' : 'smooth', block:'start'});
  });
  mbarFilters?.addEventListener('click', () => setSheet(true, mbarFilters));
  quickAll?.addEventListener('click',()=>{
    quickMode='all';state.category.clear();revealGallery();render();
  });
  quickFeatured?.addEventListener('click',()=>{
    quickMode='featured';state.category.clear();revealGallery();render();
  });


  /* Optional category URL sync on homepage (?cat=pizza, ?q=alfredo) */
  const initCat = window.CookBookURL.get('cat');
  if (initCat && FILTERS.category?.options?.[initCat]) {
    quickMode = 'category';
    state.category.add(initCat);
  }
  const initQ = window.CookBookURL.get('q');
  if (initQ && searchInput) {
    searchInput.value = initQ;
    query = norm(initQ);
  }

  render();
  syncFiltersToggle();
  buildFast();
  requestAnimationFrame(()=>{ if(loadingEl && RECIPES.filter(match).length) loadingEl.style.display='none'; });
})();

/* Ordered steps, part 2 — the HTML `start` attribute.
   CSS counters reset per <ol>, and `counter-reset` cannot read an attribute, so a
   phase that continues a previous list (<ol class="steps" start="9">) restarted at
   01. Seed the counter to start-1 for any list that declares one. */
(function stepStarts(){
  document.querySelectorAll('ol.steps[start]').forEach((ol) => {
    const n = parseInt(ol.getAttribute('start'), 10);
    if (Number.isInteger(n) && n > 1) ol.style.counterReset = 'step ' + (n - 1);
  });
})();

/* Sharing: local QR matrix generation, rendered as an image so long-press works. */
(function shareFeature(){
  const appUrl = document.currentScript && document.currentScript.src;
  const isRecipe = !!document.querySelector('.r-hero h1');
  const nav = document.querySelector('#nav .nav-links');
  const heading = document.querySelector('.r-hero h1');
  if (!nav || (isRecipe && !heading)) return;
  const shareIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V3m0 0L8 7m4-4 4 4"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>';
  const qrIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2h-2zM19 14h2v3M14 19h3M20 20h1"/></svg>';
  const trigger=document.createElement('button');
  trigger.type='button';trigger.setAttribute('aria-label',IS_EN?'Share this page':'اشتراک‌گذاری این صفحه');
  if(isRecipe){
    trigger.className='recipe-share';trigger.innerHTML=shareIcon+'<span>'+(IS_EN?'Share recipe':'اشتراک‌گذاری دستور')+'</span>';
    const row=document.createElement('div');row.className='recipe-share-row';row.appendChild(trigger);heading.insertAdjacentElement('afterend',row);
  }else{
    trigger.className='toggle header-share';trigger.innerHTML=shareIcon;trigger.title=IS_EN?'Share this page':'اشتراک‌گذاری این صفحه';
    nav.insertBefore(trigger,document.getElementById('langToggle'));
  }
  const dialog=document.createElement('dialog');dialog.className='share-dialog';dialog.setAttribute('aria-labelledby','shareTitle');
  dialog.innerHTML='<div class="share-dialog-head"><h2 id="shareTitle">'+(IS_EN?'Share this page':'اشتراک‌گذاری صفحه')+'</h2><button class="share-close" type="button" aria-label="'+(IS_EN?'Close':'بستن')+'">×</button></div>'+
    '<p>'+(IS_EN?'Tap the link to copy it, or create its QR code.':'برای کپی، روی لینک بزن؛ یا کد QR آن را بساز.')+'</p>'+
    '<div class="share-link-row"><button type="button" class="share-copy" dir="ltr"><span></span></button><button type="button" class="share-qr-button" aria-expanded="false" aria-controls="shareQrPanel" aria-label="'+(IS_EN?'Show QR code':'نمایش کد QR')+'">'+qrIcon+'</button></div>'+
    '<p class="share-message" role="status" aria-live="polite"></p><div class="share-qr-panel" id="shareQrPanel" hidden><img class="share-qr-image" alt="'+(IS_EN?'QR code for this page':'کد QR این صفحه')+'"/><a class="share-download" download="cookbook-qr.png">'+(IS_EN?'Download QR code':'دانلود کد QR')+'</a></div>';
  document.body.appendChild(dialog);
  const copy=dialog.querySelector('.share-copy'), text=copy.querySelector('span'), msg=dialog.querySelector('.share-message');
  const qrBtn=dialog.querySelector('.share-qr-button'), panel=dialog.querySelector('.share-qr-panel'), img=panel.querySelector('img'), download=panel.querySelector('a');
  let qrLoader;
  function loadQR(){
    if(window.qrcode) return Promise.resolve();
    if(!qrLoader){
      qrLoader=new Promise((resolve,reject)=>{
        if(!appUrl){reject(new Error('Missing app path'));return;}
        const script=document.createElement('script');script.src=new URL('vendor/qrcode-generator.js',appUrl).href;
        script.onload=()=>window.qrcode?resolve():reject(new Error('QR unavailable'));
        script.onerror=()=>reject(new Error('QR unavailable'));document.head.appendChild(script);
      }).catch(err=>{qrLoader=null;throw err;});
    }
    return qrLoader;
  }
  function rounded(ctx,x,y,w,h,r){
    r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();ctx.fill();
  }
  function renderQR(url){
    const code=window.qrcode(0,'M');code.addData(url);code.make();const n=code.getModuleCount();
    if(n>85)throw new Error('Link too long for this QR display');
    const unit=20, margin=4, size=(n+margin*2)*unit;
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);ctx.fillStyle='#000';
    const isFinder=(r,c)=>(r<7&&c<7)||(r<7&&c>=n-7)||(r>=n-7&&c<7);
    // Alignment markers retain their exact module geometry for reliable decoding.
    const positions=[
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ][(n-17)/4-1], centers=[];
    for(const row of positions)for(const col of positions){
      if(!isFinder(row,col))centers.push([row,col]);
    }
    const isAlignment=(r,c)=>centers.some(([y,x])=>Math.abs(r-y)<=2 && Math.abs(c-x)<=2);
    for(let r=0;r<n;r++){
      for(let c=0;c<n;){
        if(!code.isDark(r,c)||isFinder(r,c)){c++;continue;}
        if(isAlignment(r,c)){ctx.fillRect((c+margin)*unit,(r+margin)*unit,unit,unit);c++;continue;}
        const start=c;while(c<n&&code.isDark(r,c)&&!isFinder(r,c)&&!isAlignment(r,c))c++;
        rounded(ctx,(start+margin+.05)*unit,(r+margin+.05)*unit,(c-start-.1)*unit,.9*unit,.45*unit);
      }
    }
    function finder(col,row){
      const x=(col+margin)*unit,y=(row+margin)*unit;
      ctx.fillStyle='#000';rounded(ctx,x,y,7*unit,7*unit,2.2*unit);
      ctx.fillStyle='#fff';rounded(ctx,x+unit,y+unit,5*unit,5*unit,1.4*unit);
      ctx.fillStyle='#000';for(let i=0;i<3;i++)rounded(ctx,x+2*unit,y+(2+i+.01)*unit,3*unit,.98*unit,.46*unit);
    }
    finder(0,0);finder(n-7,0);finder(0,n-7);
    const output=document.createElement('canvas');output.width=512;output.height=512;
    const out=output.getContext('2d');out.imageSmoothingQuality='high';out.drawImage(canvas,0,0,512,512);
    return output.toDataURL('image/png');
  }
  trigger.addEventListener('click',()=>{
    const url=location.href;text.textContent=url;copy.title=url;copy.setAttribute('aria-label',IS_EN?'Copy page link':'کپی لینک صفحه');
    msg.textContent='';panel.hidden=true;qrBtn.setAttribute('aria-expanded','false');img.removeAttribute('src');download.removeAttribute('href');
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
    copy.focus();
  });
  dialog.querySelector('.share-close').addEventListener('click',()=>{if(dialog.close)dialog.close();else dialog.removeAttribute('open');});
  dialog.addEventListener('close',()=>trigger.focus());
  dialog.addEventListener('click',e=>{if(e.target===dialog && dialog.close)dialog.close();});
  copy.addEventListener('click',async()=>{
    const url=text.textContent;
    try{
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(url);
      else {
        const temp=document.createElement('textarea');temp.value=url;temp.style.position='fixed';temp.style.opacity='0';document.body.appendChild(temp);temp.select();
        const ok=document.execCommand('copy');temp.remove();if(!ok)throw new Error('copy failed');
      }
      msg.textContent=IS_EN?'Link copied.':'لینک کپی شد.';
    }catch(_){msg.textContent=IS_EN?'Copy failed. Select and copy the link below.':'کپی انجام نشد؛ لینک زیر را انتخاب و کپی کن.';const field=document.createElement('input');field.value=url;field.readOnly=true;field.className='share-manual-link';msg.replaceChildren(field);field.focus();field.select();}
  });
  qrBtn.addEventListener('click',async()=>{
    if(!panel.hidden){panel.hidden=true;qrBtn.setAttribute('aria-expanded','false');return;}
    msg.textContent=IS_EN?'Creating QR code…':'در حال ساخت کد QR…';qrBtn.disabled=true;
    try{await loadQR();const data=renderQR(text.textContent);img.src=data;download.href=data;panel.hidden=false;qrBtn.setAttribute('aria-expanded','true');msg.textContent=IS_EN?'Press and hold the image to save it, or use Download.':'برای ذخیره، تصویر را نگه دار یا دکمهٔ دانلود را بزن.';}
    catch(_){msg.textContent=IS_EN?'Could not create this QR code. Try a shorter link.':'ساخت کد ممکن نشد؛ لینک کوتاه‌تری را امتحان کن.';}
    finally{qrBtn.disabled=false;}
  });
})();
