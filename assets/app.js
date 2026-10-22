/* =====================================================================
   CookBook Bilingual Engine (FA RTL + EN LTR)
   Theme, user-agent mobile mode, language persistence, faceted library, PWA
   ===================================================================== */

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const IS_EN = document.documentElement.lang === "en";

/* Restore preferred language on fresh app launch at root entry */
(function syncPreferredLanguage(){
  try {
    const savedLang = localStorage.getItem("cookbook-lang");
    if (!IS_EN && savedLang === "en" && !sessionStorage.getItem("cookbook-lang-manual")) {
      const link = document.getElementById("langToggle");
      if (link && link.getAttribute("href")) {
        sessionStorage.setItem("cookbook-lang-manual", "1");
        location.replace(link.getAttribute("href"));
        return;
      }
    }
  } catch (_) {}
  const btn = document.getElementById("langToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      try {
        sessionStorage.setItem("cookbook-lang-manual", "1");
        localStorage.setItem("cookbook-lang", IS_EN ? "fa" : "en");
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

/* Dark / Light theme toggle */
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
    btn.setAttribute('aria-label', IS_EN
      ? (dark?'Switch to light theme':'Switch to dark theme')
      : (dark?'تغییر به تم روشن':'تغییر به تم تاریک'));
  }
  icon();
  if(btn) btn.addEventListener('click',()=>{
    const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);localStorage.setItem(key,next);icon();
  });
})();

/* Navbar scroll border */
(function navShadow(){
  const nav=$('#nav'); if(!nav) return;
  const on=()=>nav.classList.toggle('scrolled', window.scrollY>20);
  on(); window.addEventListener('scroll',on,{passive:true});
})();

/* Footer year */
(function(){ const y=$('#year'); if(y) y.textContent=new Date().getFullYear(); })();

/* Scroll reveal */
(function reveal(){
  const els=$$('.reveal'); if(!els.length) return;
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  els.forEach((el,i)=>{ el.style.transitionDelay=(Math.min(i,6)*0.05)+'s'; io.observe(el); });
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
    if(errorEl) errorEl.classList.add('show');
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
    count: (n) => `${n} ${n === 1 ? 'recipe' : 'recipes'}`
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
    count: (n) => `${n.toString().replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])} دستور`
  };

  const assetPrefix = IS_EN ? '../' : '';
  const searchInput = $('#search');
  const filterBar   = $('#filters');
  const quickBar    = $('#quickCats');
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

  function buildQuick(){
    if(!quickBar) return;
    quickBar.innerHTML='';
    const items=[
      {key:'all',text:STR.all,count:RECIPES.length},
      {key:'featured',text:STR.featured,count:RECIPES.filter(r=>r.featured).length},
      ...categoryOrder.map(k=>({key:k,text:label('category',k),count:RECIPES.filter(r=>r.category===k).length}))
    ];
    items.forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='quick-btn'+(((quickMode===item.key)||(item.key!=='all'&&item.key!=='featured'&&quickMode==='all'&&state.category.size===1&&state.category.has(item.key)))?' on':'');
      b.innerHTML=`<span>${item.text}</span><small>${item.count}</small>`;
      b.setAttribute('aria-pressed', b.classList.contains('on')?'true':'false');
      b.addEventListener('click',()=>{
        if(item.key==='all'){ quickMode='all'; state.category.clear(); }
        else if(item.key==='featured'){ quickMode='featured'; state.category.clear(); }
        else { quickMode='category'; state.category.clear(); state.category.add(item.key); }
        document.getElementById('gallery')?.scrollIntoView({behavior:'smooth',block:'start'});
        render();
      });
      quickBar.appendChild(b);
    });
  }

  function buildFilters(){
    if(!filterBar) return;
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
  }

  const phMark = `<div class="ph-mark">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="8.5" cy="8.5" r="1.8"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg><span>${STR.photoLater}</span></div>`;

  function card(r){
    const a=document.createElement('a');
    a.className='rcard reveal in'; a.href=r.page||'#';
    const badge = r.featured ? `<span class="rbadge">${STR.featured}</span>` : "";
    const img = r.image ? `<img src="${assetPrefix}${r.image}" alt="${r.name}" loading="lazy">` : phMark;
    const meta=[];
    if(r.category) meta.push(label('category',r.category));
    if(r.cuisine) meta.push(label('cuisine',r.cuisine));
    if(r.main) meta.push(label('main',r.main));
    if(r.time) meta.push(label('time',r.time));
    if(r.level) meta.push(label('level',r.level));
    const kicker=(r.category ? label('category',r.category) : STR.recipeFallback) + (r.cuisine ? ` · ${label('cuisine',r.cuisine)}` : '');
    const summaryText = IS_EN ? (r.desc_en || r.desc || "") : (r.desc || "");
    a.innerHTML=`
      <div class="ph">${img}${badge}</div>
      <div class="rcard-body">
        <div class="rcard-kicker">${kicker}</div>
        <h3 class="en">${r.name}</h3>
        <p class="rcard-desc">${summaryText}</p>
        <div class="rcard-meta">${meta.map(m=>`<span class="badge">${m}</span>`).join("")}</div>
        <div class="rcard-footer"><span class="rcard-go">${STR.viewRecipe}</span><span class="rcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>
      </div>`;
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
      b.innerHTML=`<b>${text}</b><span aria-hidden="true">×</span>`;
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
  }

  function render(){
    const list=sorted(RECIPES.filter(match));
    buildQuick(); buildFilters(); buildActive(list.length);
    grid.innerHTML='';
    if(!list.length){ if(emptyEl)emptyEl.style.display='block'; return; }
    if(emptyEl)emptyEl.style.display='none';

    if(sortMode==='default'){
      categoryOrder.forEach(cat=>{
        const items=list.filter(r=>r.category===cat);
        if(!items.length)return;
        const sec=document.createElement('section'); sec.className='result-group';
        sec.innerHTML=`<div class="result-group-head"><h3>${label('category',cat)}</h3><span>${STR.count(items.length)}</span></div>`;
        const wrap=document.createElement('div'); wrap.className='card-grid';
        items.forEach(r=>wrap.appendChild(card(r)));
        sec.appendChild(wrap); grid.appendChild(sec);
      });
      const uncategorized=list.filter(r=>!categoryOrder.includes(r.category));
      if(uncategorized.length){
        const sec=document.createElement('section'); sec.className='result-group';
        sec.innerHTML=`<div class="result-group-head"><h3>${STR.uncategorized}</h3><span>${STR.count(uncategorized.length)}</span></div>`;
        const wrap=document.createElement('div'); wrap.className='card-grid';
        uncategorized.forEach(r=>wrap.appendChild(card(r))); sec.appendChild(wrap); grid.appendChild(sec);
      }
    } else {
      const wrap=document.createElement('div'); wrap.className='card-grid';
      list.forEach(r=>wrap.appendChild(card(r))); grid.appendChild(wrap);
    }
    if(loadingEl) loadingEl.style.display='none';
  }

  if(searchInput) searchInput.addEventListener('input', e=>{ query=norm(e.target.value); render(); });
  if(sortSelect) sortSelect.addEventListener('change',e=>{sortMode=e.target.value;render();});
  if(clearBtn) clearBtn.addEventListener('click',()=>{
    query=''; if(searchInput)searchInput.value=''; quickMode='all'; sortMode='default'; if(sortSelect)sortSelect.value='default';
    Object.values(state).forEach(s=>s.clear()); render();
  });

  function syncFiltersToggle(){
    if(!filtersPanel || !filtersToggle) return;
    const mobile = window.matchMedia('(max-width: 950px)').matches;
    const open = !mobile || filtersPanel.classList.contains('open');
    filtersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(filtersToggleText) filtersToggleText.textContent = open ? STR.close : STR.open;
  }
  if(filtersToggle && filtersPanel){
    filtersToggle.addEventListener('click',()=>{
      filtersPanel.classList.toggle('open');
      syncFiltersToggle();
    });
    window.matchMedia('(max-width: 950px)').addEventListener?.('change', syncFiltersToggle);
  }

  render();
  syncFiltersToggle();
  requestAnimationFrame(()=>{ if(loadingEl && RECIPES.filter(match).length) loadingEl.style.display='none'; });
})();

/* ---------- CookBook PWA: service worker + install prompt ---------- */
(function pwa(){
  if(!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  const script=document.currentScript;
  const swUrl=script ? new URL('../sw.js', script.src).href : 'sw.js';

  let refreshing=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(refreshing) return;
    refreshing=true;
    location.reload();
  });

  window.addEventListener('load',()=>{
    navigator.serviceWorker.register(swUrl)
      .then((registration)=>registration.update())
      .catch(()=>{});
  }, { once:true });

  let deferredPrompt=null;
  const installBtn=document.getElementById('installApp');
  window.addEventListener('beforeinstallprompt',(event)=>{
    event.preventDefault();
    deferredPrompt=event;
    if(installBtn) installBtn.hidden=false;
  });
  if(installBtn){
    installBtn.addEventListener('click',async()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      installBtn.hidden=true;
    });
  }
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    if(installBtn) installBtn.hidden=true;
  });
})();
