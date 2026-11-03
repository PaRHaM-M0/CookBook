/* ---------- CookBook PWA: browser-managed install, service worker ---------- */
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

})();
