<template>
  <div class="statusbar" v-if="isInApp" :style="`background-color:${bgColor};color:${color};`"></div>
</template>
<script>
let addClass = (element,name)=>{
  if(!element)return;
  if(!name)return;
  let _classname  = element.className || '';
  if(_classname.toLowerCase().split(' ').includes(name.toLowerCase())){
    return;
  }
  element.className = [..._classname.split(' '),name].join(" ");
};
let removeClass = (element,name)=>{
  if(!element)return;
  if(!name)return;
  let _classname  = element.className || '';
  if(!_classname.toLowerCase().split(' ').includes(name.toLowerCase())){
    return;
  }
  element.className = _classname.split(' ').filter(m=>m!=name).join(" ");
};

let callApp = (method, args) =>{
  return new Promise((resolve, reject) => {
    try {
      let callback = `___${method}${(Math.random()+'').replace('.','').substring(0,6)}`;
      window[callback] = function (e) {
        delete window[callback];
        let json = e;
        let b = false;
        try {
          json = JSON.parse(e);
          b = true;
        } catch (error) {
          alert(`调用${method}.postMessage失败:返回数据不是标准的json。${e}`);
          reject();
        }
        if(b)resolve(json);
      }
      args = Object.assign(args || {}, {
        callback
      })
      window[method].postMessage(JSON.stringify(args));
    } catch (error) {
      alert(`调用${method}.postMessage失败`);
      reject();
    }
  });
};

export default {
  name: 'statusbar',
  props: {
    status: {
      type:Boolean,
      default: true,
    },
  },
  data(){
    return {
      isInApp:navigator.userAgent.toLowerCase().indexOf("itsmore")>=0,
      bgColor:'',
      color:'',
    };
  },
  watch:{
    status(newval,oldval){
      if(this.isInApp){
        if(newval){
          addClass(document.getElementsByTagName("html")[0],"with-statusbar");
        }else{
          removeClass(document.getElementsByTagName("html")[0],"with-statusbar");
        }
      }
    },
  },
  methods: {
    show(){
      this.status = true;
    },
    hide(){
      this.status = false;
    },
    isVisible(){
      return this.status;
    },
    overlaysWebView(){

    },
    setBackgroundColor(color){
      this.bgColor = color;
    },
    setTextColor(color){
      this.color = color;
    },
    init(){
      if(this.isInApp){
        callApp('requestDeviceTopPadding').then((res)=>{
          let top = res.data;
          localStorage.setItem('_top',top);
          let style = document.createElement('style');
          style.innerHTML = ':root{--safe-area-inset-top:'+top+'px;}';
          document.head.appendChild(style);
        })
      }
    },
  },
  mounted() {
    let ua = navigator.userAgent;
    let win = window;
    if(this.isInApp && this.status){
      setTimeout(()=>{
        addClass(document.getElementsByTagName("html")[0],"with-statusbar");
      })
    }
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    let ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    let iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    let iphoneX = iphone && ((win.screen.width === 375 && win.screen.height === 812)||(win.screen.width === 414 && win.screen.height === 896));
    if (iphone && !ipod && iphoneX) {
      setTimeout(()=>{
        addClass(document.getElementsByTagName("html")[0],"device-iphone-x");
      })
    }
    win.StatusBar = this;
  },
  beforeDestroy() {
  }
}
</script>
