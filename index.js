import './statusbar.css';

let top = localStorage.getItem('_top');
if(!!top){
  let style = document.createElement('style');
  style.innerHTML = ':root{--safe-area-inset-top:'+top+'px;}';
  document.head.appendChild(style);
}

import statusbar from './statusbar.vue';
export default statusbar;