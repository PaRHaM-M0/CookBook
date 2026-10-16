/* =====================================================================
   منطق سایت: تم تاریک/روشن، تشخیص موبایل، سرچ، فیلتر، ساخت کارت‌ها
   این فایل را معمولاً لازم نیست دست بزنی.
   ===================================================================== */

/* ---------- ابزار کوچک ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* نرمال‌سازی متن فارسی برای سرچ بهتر:
   ی/ك عربی → فارسی، حذف اعراب، یکدست‌کردن فاصله و حروف کوچک */
function norm(str){
  if(!str) return "";
  return str.toString().toLowerCase()
    .replace(/[\u064A\u0649]/g,"ی")   // ي ى → ی
    .replace(/\u0643/g,"ک")           // ك → ک
    .replace(/[\u064B-\u0652\u0670]/g,"") // اعراب
    .replace(/\u200c/g," ")           // نیم‌فاصله → فاصله
    .replace(/[ـ]/g,"")               // کشیده
    .replace(/\s+/g," ").trim();
}

/* ---------- تشخیص موبایل از روی user-agent ---------- */
(function detectMobile(){
  const ua = navigator.userAgent || navigator.vendor || "";
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
                   || (window.matchMedia && window.matchMedia("(max-width:760px)").matches);
  document.body.classList.toggle("is-mobile", !!isMobile);
})();

/* ---------- تم تاریک/روشن (مشترک کل سایت) ---------- */
(function theme(){
  const root=document.documentElement, key='kitchen-theme';
  const saved=localStorage.getItem(key);
  const prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved||(prefersDark?'dark':'light'));
  const btn=$('#themeToggle');
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 13.2A8.5 8.5 0 1 1 10.8 4a7 7 0 0 0 9.2 9.2Z"/></svg>';
  function icon(){
    if(!btn) return;
    const dark=root.getAttribute('data-theme')==='dark';
    btn.innerHTML=dark?sun:moon;
    btn.setAttribute('aria-label', dark?'تغییر به تم روشن':'تغییر به تم تاریک');
  }
  icon();
  if(btn) btn.addEventListener('click',()=>{
    const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);localStorage.setItem(key,next);icon();
  });
})();

/* ---------- سایه‌ی نوار هنگام اسکرول ---------- */
(function navShadow(){
  const nav=$('#nav'); if(!nav) return;
  const on=()=>nav.classList.toggle('scrolled', window.scrollY>20);
  on(); window.addEventListener('scroll',on,{passive:true});
})();

/* ---------- سال فوتر ---------- */
(function(){ const y=$('#year'); if(y) y.textContent=new Date().getFullYear(); })();

/* ---------- reveal روی اسکرول ---------- */
(function reveal(){
  const els=$$('.reveal'); if(!els.length) return;
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  els.forEach((el,i)=>{ el.style.transitionDelay=(Math.min(i,6)*0.05)+'s'; io.observe(el); });
})();

/* =====================================================================
   موتور صفحه‌ی اصلی: ساخت فیلترها + کارت‌ها + سرچ
   فقط اگر عناصر لازم در صفحه باشند اجرا می‌شود.
   ===================================================================== */
(function gallery(){
  const grid = $('#grid');
  if(!grid) return;
  const loadingEl=$('#loading');
  const errorEl=$('#loadError');
  if(typeof RECIPES==="undefined" || typeof FILTERS==="undefined"){
    if(loadingEl) loadingEl.style.display='none';
    if(errorEl) errorEl.classList.add('show');
    return;
  }
  const setStat=(name,value)=>{ const el=document.querySelector(`[data-stat="${name}"]`); if(el) el.textContent=value; };
  setStat('recipes', RECIPES.length);
  setStat('featured', RECIPES.filter(r=>r.featured).length);
  setStat('cuisines', new Set(RECIPES.map(r=>r.cuisine).filter(Boolean)).size);

  const searchInput = $('#search');
  const filterBar   = $('#filters');
  const countEl     = $('#count');
  const emptyEl     = $('#empty');
  const clearBtn    = $('#clearFilters');

  // وضعیت فعلی فیلترها: { meal:Set, cuisine:Set, ... }
  const state = {};
  Object.keys(FILTERS).forEach(k => state[k]=new Set());
  let query = "";

  /* ---- ساخت گروه‌های فیلتر ---- */
  function buildFilters(){
    filterBar.innerHTML = "";
    Object.entries(FILTERS).forEach(([groupKey, group])=>{
      // فقط مقادیری را نشان بده که واقعاً در غذاها استفاده شده‌اند
      const used = new Set(RECIPES.map(r=>r[groupKey]).filter(Boolean));
      const opts = Object.entries(group.options).filter(([k])=>used.has(k));
      if(!opts.length) return;

      const wrap=document.createElement('div');
      wrap.className='fgroup';
      wrap.innerHTML=`<div class="fgroup-title">${group.title}</div>`;
      const chips=document.createElement('div');
      chips.className='chips';
      opts.forEach(([key,opt])=>{
        const b=document.createElement('button');
        b.className='chip';
        b.dataset.group=groupKey; b.dataset.key=key;
        b.textContent=opt.label;
        b.addEventListener('click',()=>{
          b.classList.toggle('on');
          if(state[groupKey].has(key)) state[groupKey].delete(key);
          else state[groupKey].add(key);
          render();
        });
        chips.appendChild(b);
      });
      wrap.appendChild(chips);
      filterBar.appendChild(wrap);
    });
  }

  /* ---- placeholder عکس ---- */
  const phMark = `<div class="ph-mark">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="8.5" cy="8.5" r="1.8"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg><span>عکس بعداً</span></div>`;

  /* ---- ساخت یک کارت ---- */
  function card(r){
    const a=document.createElement('a');
    a.className='rcard reveal in';
    a.href=r.page||'#';
    const badge = r.featured ? `<span class="rbadge">منتخب</span>` : "";
    const img = r.image
      ? `<img src="${r.image}" alt="${r.name}" loading="lazy">`
      : phMark;
    // متادیتای ریز پایین کارت
    const meta=[];
    if(r.cuisine && FILTERS.cuisine.options[r.cuisine]) meta.push(FILTERS.cuisine.options[r.cuisine].label);
    if(r.time && FILTERS.time.options[r.time]) meta.push(FILTERS.time.options[r.time].label);
    if(r.level && FILTERS.level.options[r.level]) meta.push(FILTERS.level.options[r.level].label);

    const cuisineLabel=(r.cuisine && FILTERS.cuisine.options[r.cuisine]) ? FILTERS.cuisine.options[r.cuisine].label : 'دستور پخت';
    a.innerHTML=`
      <div class="ph">${img}${badge}</div>
      <div class="rcard-body">
        <div class="rcard-kicker">${cuisineLabel}</div>
        <h3 class="en">${r.name}</h3>
        <p class="rcard-desc">${r.desc||""}</p>
        <div class="rcard-meta">${meta.map(m=>`<span class="badge">${m}</span>`).join("")}</div>
        <div class="rcard-footer"><span class="rcard-go">مشاهده دستور</span><span class="rcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>
      </div>`;
    return a;
  }

  /* ---- متن قابل‌جستجوی هر غذا ---- */
  function haystack(r){
    return norm([r.name, r.fa, r.desc, (r.tags||[]).join(" "),
      FILTERS.meal.options[r.meal]?.label,
      FILTERS.cuisine.options[r.cuisine]?.label,
      FILTERS.main.options[r.main]?.label
    ].join(" "));
  }

  /* ---- اعمال فیلتر و سرچ ---- */
  function match(r){
    for(const g of Object.keys(state)){
      if(state[g].size && !state[g].has(r[g])) return false;
    }
    if(query && !haystack(r).includes(query)) return false;
    return true;
  }

  /* ---- رندر ---- */
  function render(){
    const list=RECIPES.filter(match);
    grid.innerHTML="";
    list.forEach(r=>grid.appendChild(card(r)));
    if(countEl) countEl.textContent = list.length
      ? `${toFa(list.length)} غذا` : "";
    if(emptyEl) emptyEl.style.display = list.length ? "none" : "block";
    const anyFilter = query || Object.values(state).some(s=>s.size);
    if(clearBtn) clearBtn.style.display = anyFilter ? "inline-flex" : "none";
  }

  function toFa(n){ return n.toString().replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]); }

  /* ---- اتصال سرچ ---- */
  if(searchInput){
    searchInput.addEventListener('input', e=>{ query=norm(e.target.value); render(); });
  }
  if(clearBtn){
    clearBtn.addEventListener('click',()=>{
      query=""; if(searchInput) searchInput.value="";
      Object.values(state).forEach(s=>s.clear());
      $$('.chip.on',filterBar).forEach(c=>c.classList.remove('on'));
      render();
    });
  }

  buildFilters();
  render();
  requestAnimationFrame(()=>{ if(loadingEl) loadingEl.style.display='none'; });
})();
