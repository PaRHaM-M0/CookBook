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

  const searchInput = $('#search');
  const filterBar   = $('#filters');
  const quickBar    = $('#quickCats');
  const countEl     = $('#count');
  const titleEl     = $('#resultsTitle');
  const activeEl    = $('#activeFilters');
  const emptyEl     = $('#empty');
  const clearBtn    = $('#clearFilters');
  const sortSelect  = $('#sortSelect');

  const categoryOrder = Object.keys(FILTERS.category?.options || {});
  const groupOrder = ['category','cuisine','main','meal','time','level'].filter(k=>FILTERS[k]);
  const timeRank = {quick:1, medium:2, long:3, project:4};
  const levelRank = {easy:1, medium:2, hard:3};
  const state = {};
  groupOrder.forEach(k => state[k]=new Set());
  let query = "";
  let sortMode = "default";
  let quickMode = "all"; // all | featured | category key (mirrors state.category)

  const setStat=(name,value)=>{ const el=document.querySelector(`[data-stat="${name}"]`); if(el) el.textContent=value; };
  setStat('recipes', RECIPES.length);
  setStat('featured', RECIPES.filter(r=>r.featured).length);
  setStat('categories', categoryOrder.length);

  function toFa(n){ return n.toString().replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]); }
  function label(group,key){ return FILTERS[group]?.options?.[key]?.label || key; }

  function haystack(r){
    return norm([r.name, r.fa, r.desc, (r.tags||[]).join(" "),
      label('category',r.category), label('meal',r.meal), label('cuisine',r.cuisine),
      label('main',r.main), label('time',r.time), label('level',r.level)
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
    const items=[{key:'all',text:'همه',count:RECIPES.length},{key:'featured',text:'منتخب‌ها',count:RECIPES.filter(r=>r.featured).length},
      ...categoryOrder.map(k=>({key:k,text:label('category',k),count:RECIPES.filter(r=>r.category===k).length}))];
    items.forEach(item=>{
      const b=document.createElement('button');
      b.type='button'; b.className='quick-btn'+(((quickMode===item.key)||(item.key!=='all'&&item.key!=='featured'&&quickMode==='all'&&state.category.size===1&&state.category.has(item.key)))?' on':'');
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
      wrap.innerHTML=`<div class="fgroup-title">${group.title}</div>`;
      const chips=document.createElement('div'); chips.className='chips';
      opts.forEach(([key,opt])=>{
        const n=countFor(groupKey,key);
        const b=document.createElement('button');
        b.type='button'; b.className='chip'+(state[groupKey].has(key)?' on':''); b.disabled=(n===0&&!state[groupKey].has(key));
        b.innerHTML=`<span>${opt.label}</span><span class="chip-count">${n}</span>`;
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
      </svg><span>عکس بعداً</span></div>`;

  function card(r){
    const a=document.createElement('a');
    a.className='rcard reveal in'; a.href=r.page||'#';
    const badge = r.featured ? `<span class="rbadge">منتخب</span>` : "";
    const img = r.image ? `<img src="${r.image}" alt="${r.name}" loading="lazy">` : phMark;
    const meta=[];
    if(r.category) meta.push(label('category',r.category));
    if(r.cuisine) meta.push(label('cuisine',r.cuisine));
    if(r.main) meta.push(label('main',r.main));
    if(r.time) meta.push(label('time',r.time));
    if(r.level) meta.push(label('level',r.level));
    const kicker=(r.category ? label('category',r.category) : 'دستور پخت') + (r.cuisine ? ` · ${label('cuisine',r.cuisine)}` : '');
    a.innerHTML=`
      <div class="ph">${img}${badge}</div>
      <div class="rcard-body">
        <div class="rcard-kicker">${kicker}</div>
        <h3 class="en">${r.name}</h3>
        <p class="rcard-desc">${r.desc||""}</p>
        <div class="rcard-meta">${meta.map(m=>`<span class="badge">${m}</span>`).join("")}</div>
        <div class="rcard-footer"><span class="rcard-go">مشاهده دستور</span><span class="rcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>
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
    if(query) makePill(`جست‌وجو: ${searchInput?.value || ''}`,()=>{query=''; if(searchInput)searchInput.value=''; render();});
    if(quickMode==='featured') makePill('فقط منتخب‌ها',()=>{quickMode='all';render();});
    groupOrder.forEach(g=>state[g].forEach(key=>makePill(`${FILTERS[g].title}: ${label(g,key)}`,()=>{state[g].delete(key); if(g==='category'&&!state.category.size)quickMode='all'; render();})));
    if(clearBtn) clearBtn.style.display=(query||quickMode!=='all'||Object.values(state).some(s=>s.size))?'inline-flex':'none';
    if(titleEl){
      if(state.category.size===1) titleEl.textContent=label('category',[...state.category][0]);
      else if(quickMode==='featured') titleEl.textContent='منتخب‌ها';
      else if(query||Object.values(state).some(s=>s.size)) titleEl.textContent='نتایج فیلترشده';
      else titleEl.textContent='همه‌ی دستورها';
    }
    if(countEl) countEl.textContent=listCount?`${toFa(listCount)} دستور`:'';
  }

  function render(){
    const list=sorted(RECIPES.filter(match));
    buildQuick(); buildFilters(); buildActive(list.length);
    grid.innerHTML='';
    if(!list.length){ if(emptyEl)emptyEl.style.display='block'; return; }
    if(emptyEl)emptyEl.style.display='none';

    if(sortMode==='default'){
      let shown=0;
      categoryOrder.forEach(cat=>{
        const items=list.filter(r=>r.category===cat);
        if(!items.length)return;
        shown+=items.length;
        const sec=document.createElement('section'); sec.className='result-group';
        sec.innerHTML=`<div class="result-group-head"><h3>${label('category',cat)}</h3><span>${toFa(items.length)} دستور</span></div>`;
        const wrap=document.createElement('div'); wrap.className='card-grid';
        items.forEach(r=>wrap.appendChild(card(r)));
        sec.appendChild(wrap); grid.appendChild(sec);
      });
      const uncategorized=list.filter(r=>!categoryOrder.includes(r.category));
      if(uncategorized.length){
        const sec=document.createElement('section'); sec.className='result-group';
        sec.innerHTML=`<div class="result-group-head"><h3>سایر</h3><span>${toFa(uncategorized.length)} دستور</span></div>`;
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

  render();
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
