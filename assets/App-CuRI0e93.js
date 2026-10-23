import{r as Z,j as v}from"./index-Dn7_uJZ-.js";var Xc="1.3.26";function Id(n,e,t){return Math.max(n,Math.min(e,t))}function Tm(n,e,t){return(1-t)*n+t*e}function Am(n,e,t,i){return Tm(n,e,1-Math.exp(-t*i))}function wm(n,e){return(n%e+e)%e}var Rm=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(n){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=n;const t=Id(0,this.currentTime/this.duration,1);e=t>=1;const i=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=Am(this.value,this.to,this.lerp*60,n),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(n,e,{lerp:t,duration:i,easing:s,onStart:r,onUpdate:a}){this.from=this.value=n,this.to=e,this.lerp=t,this.duration=i,this.easing=s,this.currentTime=0,this.isRunning=!0,r?.(),this.onUpdate=a}};function Cm(n,e){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>{t=void 0,n.apply(this,i)},e)}}var Pm=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(n,e,{autoResize:t=!0,debounce:i=250}={}){this.wrapper=n,this.content=e,t&&(this.debouncedResize=Cm(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},Ud=class{events={};emit(n,...e){const t=this.events[n]||[];for(let i=0,s=t.length;i<s;i++)t[i]?.(...e)}on(n,e){return this.events[n]?this.events[n].push(e):this.events[n]=[e],()=>{this.events[n]=this.events[n]?.filter(t=>e!==t)}}off(n,e){this.events[n]=this.events[n]?.filter(t=>e!==t)}destroy(){this.events={}}};const Lm=100/6,jn={passive:!1};function jc(n,e){return n===1?Lm:n===2?e:1}var Dm=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new Ud;constructor(n,e={wheelMultiplier:1,touchMultiplier:1}){this.element=n,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,jn),this.element.addEventListener("touchstart",this.onTouchStart,jn),this.element.addEventListener("touchmove",this.onTouchMove,jn),this.element.addEventListener("touchend",this.onTouchEnd,jn)}on(n,e){return this.emitter.on(n,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,jn),this.element.removeEventListener("touchstart",this.onTouchStart,jn),this.element.removeEventListener("touchmove",this.onTouchMove,jn),this.element.removeEventListener("touchend",this.onTouchEnd,jn)}onTouchStart=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:n})};onTouchMove=n=>{const{clientX:e,clientY:t}=n.targetTouches?n.targetTouches[0]:n,i=-(e-this.touchStart.x)*this.options.touchMultiplier,s=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:i,y:s},this.emitter.emit("scroll",{deltaX:i,deltaY:s,event:n})};onTouchEnd=n=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:n})};onWheel=n=>{let{deltaX:e,deltaY:t,deltaMode:i}=n;const s=jc(i,this.window.width),r=jc(i,this.window.height);e*=s,t*=r,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:n})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};const Yc=n=>Math.min(1,1.001-2**(-10*n));var Nm=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new Rm;emitter=new Ud;dimensions;virtualScroll;constructor({wrapper:n=window,content:e=document.documentElement,eventsTarget:t=n,smoothWheel:i=!0,syncTouch:s=!1,syncTouchLerp:r=.075,touchInertiaExponent:a=1.7,duration:o,easing:c,lerp:l=.1,infinite:u=!1,orientation:d="vertical",gestureOrientation:h=d==="horizontal"?"both":"vertical",touchMultiplier:p=1,wheelMultiplier:g=1,autoResize:y=!0,prevent:m,virtualScroll:f,overscroll:b=!0,autoRaf:A=!1,anchors:S=!1,autoToggle:T=!1,allowNestedScroll:M=!1,__experimental__naiveDimensions:P=!1,naiveDimensions:_=P,stopInertiaOnNavigate:w=!1,respectReducedMotion:L=!0}={}){window.lenisVersion=Xc,window.lenis||(window.lenis={}),window.lenis.version=Xc,d==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!n||n===document.documentElement)&&(n=window),typeof o=="number"&&typeof c!="function"?c=Yc:typeof c=="function"&&typeof o!="number"&&(o=1),this.options={wrapper:n,content:e,eventsTarget:t,smoothWheel:i,syncTouch:s,syncTouchLerp:r,touchInertiaExponent:a,duration:o,easing:c,lerp:l,infinite:u,gestureOrientation:h,orientation:d,touchMultiplier:p,wheelMultiplier:g,autoResize:y,prevent:m,virtualScroll:f,overscroll:b,autoRaf:A,anchors:S,autoToggle:T,allowNestedScroll:M,naiveDimensions:_,stopInertiaOnNavigate:w,respectReducedMotion:L},this.dimensions=new Pm(n,e,{autoResize:y}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new Dm(t,{touchMultiplier:p,wheelMultiplier:g}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(n,e){return this.emitter.on(n,e)}off(n,e){return this.emitter.off(n,e)}onScrollEnd=n=>{n instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&n.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const n=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[n]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=n=>{n.propertyName?.includes("overflow")&&n.target===this.rootElement&&this.checkOverflow()};setScroll(n){this.isHorizontal?this.options.wrapper.scrollTo({left:n,behavior:"instant"}):this.options.wrapper.scrollTo({top:n,behavior:"instant"})}onClick=n=>{const e=n.composedPath().filter(i=>i instanceof HTMLAnchorElement&&i.href).map(i=>new URL(i.href)),t=new URL(window.location.href);if(this.options.anchors){const i=e.find(s=>t.host===s.host&&t.pathname===s.pathname&&s.hash);if(i){const s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,r=decodeURIComponent(i.hash);this.scrollTo(r,s);return}}if(this.options.stopInertiaOnNavigate&&e.some(i=>t.host===i.host&&t.pathname!==i.pathname)){this.reset();return}};onPointerDown=n=>{n.button===1&&this.reset()};isTouchOnSelectionHandle(n){const e=window.getSelection();if(!e||e.isCollapsed||e.rangeCount===0)return!1;const t=n.targetTouches[0]??n.changedTouches[0];if(!t)return!1;const i=e.getRangeAt(0).getClientRects();if(i.length===0)return!1;const s=i[0],r=i[i.length-1],a=40,o=Math.hypot(t.clientX-s.left,t.clientY-s.top)<=a,c=Math.hypot(t.clientX-r.right,t.clientY-r.bottom)<=a;return o||c}onVirtualScroll=n=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(n)===!1)return;const{deltaX:e,deltaY:t,event:i}=n;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:i}),i.ctrlKey||i.lenisStopPropagation)return;const s=i.type.includes("touch"),r=i.type.includes("wheel");if(s&&this.isIos&&(i.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(i)),this._isDraggingSelection)){i.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=i.type==="touchstart"||i.type==="touchmove";const a=e===0&&t===0;if(this.options.syncTouch&&s&&i.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}const o=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(a||o)return;let c=i.composedPath();c=c.slice(0,c.indexOf(this.rootElement));const l=this.options.prevent,u=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";if(c.find(g=>g instanceof HTMLElement&&(typeof l=="function"&&l?.(g)||g.hasAttribute?.("data-lenis-prevent")||u==="vertical"&&g.hasAttribute?.("data-lenis-prevent-vertical")||u==="horizontal"&&g.hasAttribute?.("data-lenis-prevent-horizontal")||s&&g.hasAttribute?.("data-lenis-prevent-touch")||r&&g.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(g,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let d=t;this.options.gestureOrientation==="both"?d=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(d=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();const h=s&&this.options.syncTouch,p=s&&i.type==="touchend";p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...h?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const n=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-n,this.direction=Math.sign(this.animatedScroll-n),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=n=>{const e=n-(this.time||n);this.time=n,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(n,{offset:e=0,immediate:t=!1,lock:i=!1,programmatic:s=!0,lerp:r=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:o=s?this.options.easing:void 0,onStart:c,onComplete:l,force:u=!1,userData:d}={}){if(this.prefersReducedMotion&&(s?t=!0:(r=1,a=void 0,o=void 0)),(this.isStopped||this.isLocked)&&!u)return;let h=n,p=e;if(typeof h=="string"&&["top","left","start","#"].includes(h))h=0;else if(typeof h=="string"&&["bottom","right","end"].includes(h))h=this.limit;else{let g=null;if(typeof h=="string"?(g=h.startsWith("#")?document.getElementById(h.slice(1)):document.querySelector(h),g||(h==="#top"?h=0:console.warn("Lenis: Target not found",h))):h instanceof HTMLElement&&h?.nodeType&&(g=h),g){if(this.options.wrapper!==window){const S=this.rootElement.getBoundingClientRect();p-=this.isHorizontal?S.left:S.top}const y=g.getBoundingClientRect(),m=getComputedStyle(g),f=this.isHorizontal?Number.parseFloat(m.scrollMarginLeft):Number.parseFloat(m.scrollMarginTop),b=getComputedStyle(this.rootElement),A=this.isHorizontal?Number.parseFloat(b.scrollPaddingLeft):Number.parseFloat(b.scrollPaddingTop);h=(this.isHorizontal?y.left:y.top)+this.animatedScroll-(Number.isNaN(f)?0:f)-(Number.isNaN(A)?0:A)}}if(typeof h=="number"){if(h+=p,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;const g=h-this.animatedScroll;g>this.limit/2?h-=this.limit:g<-this.limit/2&&(h+=this.limit)}}else h=Id(0,h,this.limit);if(h===this.targetScroll){c?.(this),l?.(this);return}if(this.userData=d??{},t){this.animatedScroll=this.targetScroll=h,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=h),typeof a=="number"&&typeof o!="function"?o=Yc:typeof o=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,h,{duration:a,easing:o,lerp:r,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",c?.(this)},onUpdate:(g,y)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=g-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=g,this.setScroll(this.scroll),s&&(this.targetScroll=g),y||this.emit(),y&&(this.reset(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(n,{deltaX:e,deltaY:t}){const i=Date.now();n._lenis||(n._lenis={});const s=n._lenis;let r,a,o,c,l,u,d,h,p,g;if(i-(s.time??0)>2e3){s.time=Date.now();const M=window.getComputedStyle(n);if(s.computedStyle=M,r=["auto","overlay","scroll"].includes(M.overflowX),a=["auto","overlay","scroll"].includes(M.overflowY),l=["auto"].includes(M.overscrollBehaviorX),u=["auto"].includes(M.overscrollBehaviorY),s.hasOverflowX=r,s.hasOverflowY=a,!(r||a))return!1;d=n.scrollWidth,h=n.scrollHeight,p=n.clientWidth,g=n.clientHeight,o=d>p,c=h>g,s.isScrollableX=o,s.isScrollableY=c,s.scrollWidth=d,s.scrollHeight=h,s.clientWidth=p,s.clientHeight=g,s.hasOverscrollBehaviorX=l,s.hasOverscrollBehaviorY=u}else o=s.isScrollableX,c=s.isScrollableY,r=s.hasOverflowX,a=s.hasOverflowY,d=s.scrollWidth,h=s.scrollHeight,p=s.clientWidth,g=s.clientHeight,l=s.hasOverscrollBehaviorX,u=s.hasOverscrollBehaviorY;if(!(r&&o||a&&c))return!1;const y=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";let m,f,b,A,S,T;if(y==="horizontal")m=Math.round(n.scrollLeft),f=d-p,b=e,A=r,S=o,T=l;else if(y==="vertical")m=Math.round(n.scrollTop),f=h-g,b=t,A=a,S=c,T=u;else return!1;return!T&&(m>=f||m<=0)?!0:(b>0?m<f:m>0)&&A&&S}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const n=this.options.wrapper;return this.isHorizontal?n.scrollX??n.scrollLeft:n.scrollY??n.scrollTop}get scroll(){return this.options.infinite?wm(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(n){this._isScrolling!==n&&(this._isScrolling=n,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(n){this._isStopped!==n&&(this._isStopped=n,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(n){this._isLocked!==n&&(this._isLocked=n,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let n="lenis";return this.options.autoToggle&&(n+=" lenis-autoToggle"),this.isStopped&&(n+=" lenis-stopped"),this.isLocked&&(n+=" lenis-locked"),this.isScrolling&&(n+=" lenis-scrolling"),this.isScrolling==="smooth"&&(n+=" lenis-smooth"),n}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(n=>{this.rootElement.classList.add(n)})}cleanUpClassName(){for(const n of Array.from(this.rootElement.classList))(n==="lenis"||n.startsWith("lenis-"))&&this.rootElement.classList.remove(n)}};const zl=Z.createContext({});function ni(n){const e=Z.useRef(null);return e.current===null&&(e.current=n()),e.current}const Im=typeof window<"u",Ws=Im?Z.useLayoutEffect:Z.useEffect,fa=Z.createContext(null);function Hl(n,e){n.indexOf(e)===-1&&n.push(e)}function Yr(n,e){const t=n.indexOf(e);t>-1&&n.splice(t,1)}const mn=(n,e,t)=>t>e?e:t<n?n:t;let pa=()=>{};const ii={},Fd=n=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n),Od=n=>typeof n=="object"&&n!==null,Bd=n=>/^0[^.\s]+$/u.test(n);function Vd(n){let e;return()=>(e===void 0&&(e=n()),e)}const Ht=n=>n,Xs=(...n)=>n.reduce((e,t)=>i=>t(e(i))),ns=(n,e,t)=>{const i=e-n;return i?(t-n)/i:1};class Gl{constructor(){this.subscriptions=[]}add(e){return Hl(this.subscriptions,e),()=>Yr(this.subscriptions,e)}notify(e,t,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](e,t,i);else for(let r=0;r<s;r++){const a=this.subscriptions[r];a&&a(e,t,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const qt=n=>n*1e3,en=n=>n/1e3,Wl=(n,e)=>e?n*(1e3/e):0,kd=(n,e,t)=>(((1-3*t+3*e)*n+(3*t-6*e))*n+3*e)*n,Um=1e-7,Fm=12;function Om(n,e,t,i,s){let r,a,o=0;do a=e+(t-e)/2,r=kd(a,i,s)-n,r>0?t=a:e=a;while(Math.abs(r)>Um&&++o<Fm);return a}function js(n,e,t,i){if(n===e&&t===i)return Ht;const s=r=>Om(r,0,1,n,t);return r=>r===0||r===1?r:kd(s(r),e,i)}const zd=n=>e=>e<=.5?n(2*e)/2:(2-n(2*(1-e)))/2,Hd=n=>e=>1-n(1-e),Gd=js(.33,1.53,.69,.99),Xl=Hd(Gd),Wd=zd(Xl),Xd=n=>n>=1?1:(n*=2)<1?.5*Xl(n):.5*(2-Math.pow(2,-10*(n-1))),jl=n=>1-Math.sin(Math.acos(n)),jd=Hd(jl),Yd=zd(jl),Bm=js(.42,0,1,1),Vm=js(0,0,.58,1),qd=js(.42,0,.58,1),km=n=>Array.isArray(n)&&typeof n[0]!="number",$d=n=>Array.isArray(n)&&typeof n[0]=="number",zm={linear:Ht,easeIn:Bm,easeInOut:qd,easeOut:Vm,circIn:jl,circInOut:Yd,circOut:jd,backIn:Xl,backInOut:Wd,backOut:Gd,anticipate:Xd},Hm=n=>typeof n=="string",qc=n=>{if($d(n)){pa(n.length===4);const[e,t,i,s]=n;return js(e,t,i,s)}else if(Hm(n))return zm[n];return n},tr=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Gm(n){let e=new Set,t=new Set,i=!1,s=!1;const r=new WeakSet;let a={delta:0,timestamp:0,isProcessing:!1};function o(l){r.has(l)&&(c.schedule(l),n()),l(a)}const c={schedule:(l,u=!1,d=!1)=>{const p=d&&i?e:t;return u&&r.add(l),p.add(l),l},cancel:l=>{t.delete(l),r.delete(l)},process:l=>{if(a=l,i){s=!0;return}i=!0;const u=e;e=t,t=u,e.forEach(o),e.clear(),i=!1,s&&(s=!1,c.process(l))}};return c}const Wm=40;function Kd(n,e){let t=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>t=!0,a=tr.reduce((A,S)=>(A[S]=Gm(r),A),{}),{setup:o,read:c,resolveKeyframes:l,preUpdate:u,update:d,preRender:h,render:p,postRender:g}=a,y=()=>{const A=ii.useManualTiming,S=A?s.timestamp:performance.now();t=!1,A||(s.delta=i?1e3/60:Math.max(Math.min(S-s.timestamp,Wm),1)),s.timestamp=S,s.isProcessing=!0,o.process(s),c.process(s),l.process(s),u.process(s),d.process(s),h.process(s),p.process(s),g.process(s),s.isProcessing=!1,t&&e&&(i=!1,n(y))},m=()=>{t=!0,i=!0,s.isProcessing||n(y)};return{schedule:tr.reduce((A,S)=>{const T=a[S];return A[S]=(M,P=!1,_=!1)=>(t||m(),T.schedule(M,P,_)),A},{}),cancel:A=>{for(let S=0;S<tr.length;S++)a[tr[S]].cancel(A)},state:s,steps:a}}const{schedule:qe,cancel:tn,state:Rt,steps:Aa}=Kd(typeof requestAnimationFrame<"u"?requestAnimationFrame:Ht,!0);let Dr;function Xm(){Dr=void 0}const Bt={now:()=>(Dr===void 0&&Bt.set(Rt.isProcessing||ii.useManualTiming?Rt.timestamp:performance.now()),Dr),set:n=>{Dr=n,queueMicrotask(Xm)}},Zd=n=>e=>typeof e=="string"&&e.startsWith(n),Jd=Zd("--"),jm=Zd("var(--"),Yl=n=>jm(n)?Ym.test(n.split("/*")[0].trim()):!1,Ym=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function $c(n){return typeof n!="string"?!1:n.split("/*")[0].includes("var(--")}const os={test:n=>typeof n=="number",parse:parseFloat,transform:n=>n},Us={...os,transform:n=>mn(0,1,n)},nr={...os,default:1},As=n=>Math.round(n*1e5)/1e5,ql=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function qm(n){return n==null}const $m=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,$l=(n,e)=>t=>!!(typeof t=="string"&&$m.test(t)&&t.startsWith(n)||e&&!qm(t)&&Object.prototype.hasOwnProperty.call(t,e)),Qd=(n,e,t)=>i=>{if(typeof i!="string")return i;const[s,r,a,o]=i.match(ql);return{[n]:parseFloat(s),[e]:parseFloat(r),[t]:parseFloat(a),alpha:o!==void 0?parseFloat(o):1}},Km=n=>mn(0,255,n),wa={...os,transform:n=>Math.round(Km(n))},vi={test:$l("rgb","red"),parse:Qd("red","green","blue"),transform:({red:n,green:e,blue:t,alpha:i=1})=>"rgba("+wa.transform(n)+", "+wa.transform(e)+", "+wa.transform(t)+", "+As(Us.transform(i))+")"};function Zm(n){let e="",t="",i="",s="";return n.length>5?(e=n.substring(1,3),t=n.substring(3,5),i=n.substring(5,7),s=n.substring(7,9)):(e=n.substring(1,2),t=n.substring(2,3),i=n.substring(3,4),s=n.substring(4,5),e+=e,t+=t,i+=i,s+=s),{red:parseInt(e,16),green:parseInt(t,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const wo={test:$l("#"),parse:Zm,transform:vi.transform},Ys=n=>({test:e=>typeof e=="string"&&e.endsWith(n)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${n}`}),Un=Ys("deg"),Tn=Ys("%"),Me=Ys("px"),Jm=Ys("vh"),Qm=Ys("vw"),Kc={...Tn,parse:n=>Tn.parse(n)/100,transform:n=>Tn.transform(n*100)},qi={test:$l("hsl","hue"),parse:Qd("hue","saturation","lightness"),transform:({hue:n,saturation:e,lightness:t,alpha:i=1})=>"hsla("+Math.round(n)+", "+Tn.transform(As(e))+", "+Tn.transform(As(t))+", "+As(Us.transform(i))+")"},yt={test:n=>vi.test(n)||wo.test(n)||qi.test(n),parse:n=>vi.test(n)?vi.parse(n):qi.test(n)?qi.parse(n):wo.parse(n),transform:n=>typeof n=="string"?n:n.hasOwnProperty("red")?vi.transform(n):qi.transform(n),getAnimatableNone:n=>{const e=yt.parse(n);return e.alpha=0,yt.transform(e)}},eg=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function tg(n){return isNaN(n)&&typeof n=="string"&&(n.match(ql)?.length||0)+(n.match(eg)?.length||0)>0}const ef="number",tf="color",ng="var",ig="var(",Zc="${}",sg=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function is(n){const e=n.toString(),t=[],i={color:[],number:[],var:[]},s=[];let r=0;const o=e.replace(sg,c=>(yt.test(c)?(i.color.push(r),s.push(tf),t.push(yt.parse(c))):c.startsWith(ig)?(i.var.push(r),s.push(ng),t.push(c)):(i.number.push(r),s.push(ef),t.push(parseFloat(c))),++r,Zc)).split(Zc);return{values:t,split:o,indexes:i,types:s}}function rg(n){return is(n).values}function nf({split:n,types:e}){const t=n.length;return i=>{let s="";for(let r=0;r<t;r++)if(s+=n[r],i[r]!==void 0){const a=e[r];a===ef?s+=As(i[r]):a===tf?s+=yt.transform(i[r]):s+=i[r]}return s}}function ag(n){return nf(is(n))}const og=n=>typeof n=="number"?0:yt.test(n)?yt.getAnimatableNone(n):n,lg=(n,e)=>typeof n=="number"?e?.trim().endsWith("/")?n:0:og(n);function cg(n){const e=is(n);return nf(e)(e.values.map((i,s)=>lg(i,e.split[s])))}const fn={test:tg,parse:rg,createTransformer:ag,getAnimatableNone:cg};function Ra(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*(2/3-t)*6:n}function ug({hue:n,saturation:e,lightness:t,alpha:i}){n/=360,e/=100,t/=100;let s=0,r=0,a=0;if(!e)s=r=a=t;else{const o=t<.5?t*(1+e):t+e-t*e,c=2*t-o;s=Ra(c,o,n+1/3),r=Ra(c,o,n),a=Ra(c,o,n-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(a*255),alpha:i}}function qr(n,e){return t=>t>0?e:n}const at=(n,e,t)=>n+(e-n)*t,Ca=(n,e,t)=>{const i=n*n,s=t*(e*e-i)+i;return s<0?0:Math.sqrt(s)},hg=[wo,vi,qi],dg=n=>hg.find(e=>e.test(n));function Jc(n){const e=dg(n);if(!e)return!1;let t=e.parse(n);return e===qi&&(t=ug(t)),t}const Qc=(n,e)=>{const t=Jc(n),i=Jc(e);if(!t||!i)return qr(n,e);const s={...t};return r=>(s.red=Ca(t.red,i.red,r),s.green=Ca(t.green,i.green,r),s.blue=Ca(t.blue,i.blue,r),s.alpha=at(t.alpha,i.alpha,r),vi.transform(s))},Ro=new Set(["none","hidden"]);function fg(n,e){return Ro.has(n)?t=>t<=0?n:e:t=>t>=1?e:n}function pg(n,e){return t=>at(n,e,t)}function Kl(n){return typeof n=="number"?pg:typeof n=="string"?Yl(n)?qr:yt.test(n)?Qc:vg:Array.isArray(n)?sf:typeof n=="object"?yt.test(n)?Qc:mg:qr}function sf(n,e){const t=[...n],i=t.length,s=n.map((r,a)=>Kl(r)(r,e[a]));return r=>{for(let a=0;a<i;a++)t[a]=s[a](r);return t}}function mg(n,e){const t={...n,...e},i={};for(const s in t)n[s]!==void 0&&e[s]!==void 0&&(i[s]=Kl(n[s])(n[s],e[s]));return s=>{for(const r in i)t[r]=i[r](s);return t}}function gg(n,e){const t=[],i={color:0,var:0,number:0};for(let s=0;s<e.values.length;s++){const r=e.types[s],a=n.indexes[r][i[r]],o=n.values[a]??0;t[s]=o,i[r]++}return t}const vg=(n,e)=>{const t=fn.createTransformer(e),i=is(n),s=is(e);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Ro.has(n)&&!s.values.length||Ro.has(e)&&!i.values.length?fg(n,e):Xs(sf(gg(i,s),s.values),t):qr(n,e)};function rf(n,e,t){return typeof n=="number"&&typeof e=="number"&&typeof t=="number"?at(n,e,t):Kl(n)(n,e)}const xg=n=>{const e=({timestamp:t})=>n(t);return{start:(t=!0)=>qe.update(e,t),stop:()=>tn(e),now:()=>Rt.isProcessing?Rt.timestamp:Bt.now()}},af=(n,e,t=10)=>{let i="";const s=Math.max(Math.round(e/t),2);for(let r=0;r<s;r++)i+=Math.round(n(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},$r=2e4;function Zl(n){let e=0;const t=50;let i=n.next(e);for(;!i.done&&e<$r;)e+=t,i=n.next(e);return e>=$r?1/0:e}function _g(n,e=100,t){const i=t({...n,keyframes:[0,e]}),s=Math.min(Zl(i),$r);return{type:"keyframes",ease:r=>i.next(s*r).value/e,duration:en(s)}}const ft={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Co(n,e){return n*Math.sqrt(1-e*e)}const yg=12;function Sg(n,e,t){let i=t;for(let s=1;s<yg;s++)i=i-n(i)/e(i);return i}const Pa=.001;function Mg({duration:n=ft.duration,bounce:e=ft.bounce,velocity:t=ft.velocity,mass:i=ft.mass}){let s,r,a=1-e;a=mn(ft.minDamping,ft.maxDamping,a),n=mn(ft.minDuration,ft.maxDuration,en(n)),a<1?(s=l=>{const u=l*a,d=u*n,h=u-t,p=Co(l,a),g=Math.exp(-d);return Pa-h/p*g},r=l=>{const d=l*a*n,h=d*t+t,p=Math.pow(a,2)*Math.pow(l,2)*n,g=Math.exp(-d),y=Co(Math.pow(l,2),a);return(-s(l)+Pa>0?-1:1)*((h-p)*g)/y}):(s=l=>{const u=Math.exp(-l*n),d=(l-t)*n+1;return-Pa+u*d},r=l=>{const u=Math.exp(-l*n),d=(t-l)*(n*n);return u*d});const o=5/n,c=Sg(s,r,o);if(n=qt(n),isNaN(c))return{stiffness:ft.stiffness,damping:ft.damping,duration:n};{const l=Math.pow(c,2)*i;return{stiffness:l,damping:a*2*Math.sqrt(i*l),duration:n}}}const Eg=["duration","bounce"],bg=["stiffness","damping","mass"];function eu(n,e){return e.some(t=>n[t]!==void 0)}function Tg(n){let e={velocity:ft.velocity,stiffness:ft.stiffness,damping:ft.damping,mass:ft.mass,isResolvedFromDuration:!1,...n};if(!eu(n,bg)&&eu(n,Eg))if(e.velocity=0,n.visualDuration){const t=n.visualDuration,i=2*Math.PI/(t*1.2),s=i*i,r=2*mn(.05,1,1-(n.bounce||0))*Math.sqrt(s);e={...e,mass:ft.mass,stiffness:s,damping:r}}else{const t=Mg({...n,velocity:0});e={...e,...t,mass:ft.mass},e.isResolvedFromDuration=!0}return e}function Kr(n=ft.visualDuration,e=ft.bounce){const t=typeof n!="object"?{visualDuration:n,keyframes:[0,1],bounce:e}:n;let{restSpeed:i,restDelta:s}=t;const r=t.keyframes[0],a=t.keyframes[t.keyframes.length-1],o={done:!1,value:r},{stiffness:c,damping:l,mass:u,duration:d,velocity:h,isResolvedFromDuration:p}=Tg({...t,velocity:-en(t.velocity||0)}),g=h||0,y=l/(2*Math.sqrt(c*u)),m=a-r,f=en(Math.sqrt(c/u)),b=Math.abs(m)<5;i||(i=b?ft.restSpeed.granular:ft.restSpeed.default),s||(s=b?ft.restDelta.granular:ft.restDelta.default);let A,S,T,M,P,_;if(y<1)T=Co(f,y),M=(g+y*f*m)/T,A=L=>{const N=Math.exp(-y*f*L);return a-N*(M*Math.sin(T*L)+m*Math.cos(T*L))},P=y*f*M+m*T,_=y*f*m-M*T,S=L=>Math.exp(-y*f*L)*(P*Math.sin(T*L)+_*Math.cos(T*L));else if(y===1){A=N=>a-Math.exp(-f*N)*(m+(g+f*m)*N);const L=g+f*m;S=N=>Math.exp(-f*N)*(f*L*N-g)}else{const L=f*Math.sqrt(y*y-1);A=D=>{const k=Math.exp(-y*f*D),$=Math.min(L*D,300);return a-k*((g+y*f*m)*Math.sinh($)+L*m*Math.cosh($))/L};const N=(g+y*f*m)/L,F=y*f*N-m*L,V=y*f*m-N*L;S=D=>{const k=Math.exp(-y*f*D),$=Math.min(L*D,300);return k*(F*Math.sinh($)+V*Math.cosh($))}}const w={calculatedDuration:p&&d||null,velocity:L=>qt(S(L)),next:L=>{if(!p&&y<1){const F=Math.exp(-y*f*L),V=Math.sin(T*L),D=Math.cos(T*L),k=a-F*(M*V+m*D),$=qt(F*(P*V+_*D));return o.done=Math.abs($)<=i&&Math.abs(a-k)<=s,o.value=o.done?a:k,o}const N=A(L);if(p)o.done=L>=d;else{const F=qt(S(L));o.done=Math.abs(F)<=i&&Math.abs(a-N)<=s}return o.value=o.done?a:N,o},toString:()=>{const L=Math.min(Zl(w),$r),N=af(F=>w.next(L*F).value,L,30);return L+"ms "+N},toTransition:()=>{}};return w}Kr.applyToOptions=n=>{const e=_g(n,100,Kr);return n.ease=e.ease,n.duration=qt(e.duration),n.type="keyframes",n};const Ag=5;function of(n,e,t){const i=Math.max(e-Ag,0);return Wl(t-n(i),e-i)}function Po({keyframes:n,velocity:e=0,power:t=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:a,min:o,max:c,restDelta:l=.5,restSpeed:u}){const d=n[0],h={done:!1,value:d},p=_=>o!==void 0&&_<o||c!==void 0&&_>c,g=_=>o===void 0?c:c===void 0||Math.abs(o-_)<Math.abs(c-_)?o:c;let y=t*e;const m=d+y,f=a===void 0?m:a(m);f!==m&&(y=f-d);const b=_=>-y*Math.exp(-_/i),A=_=>f+b(_),S=_=>{const w=b(_),L=A(_);h.done=Math.abs(w)<=l,h.value=h.done?f:L};let T,M;const P=_=>{p(h.value)&&(T=_,M=Kr({keyframes:[h.value,g(h.value)],velocity:of(A,_,h.value),damping:s,stiffness:r,restDelta:l,restSpeed:u}))};return P(0),{calculatedDuration:null,next:_=>{let w=!1;return!M&&T===void 0&&(w=!0,S(_),P(_)),T!==void 0&&_>=T?M.next(_-T):(!w&&S(_),h)}}}function wg(n,e,t){const i=[],s=t||ii.mix||rf,r=n.length-1;for(let a=0;a<r;a++){let o=s(n[a],n[a+1]);if(e){const c=Array.isArray(e)?e[a]||Ht:e;o=Xs(c,o)}i.push(o)}return i}function Jl(n,e,{clamp:t=!0,ease:i,mixer:s}={}){const r=n.length;if(pa(r===e.length),r===1)return()=>e[0];if(r===2&&e[0]===e[1])return()=>e[1];const a=n[0]===n[1];n[0]>n[r-1]&&(n=[...n].reverse(),e=[...e].reverse());const o=wg(e,i,s),c=o.length,l=u=>{if(a&&u<n[0])return e[0];let d=0;if(c>1)for(;d<n.length-2&&!(u<n[d+1]);d++);const h=ns(n[d],n[d+1],u);return o[d](h)};return t?u=>l(mn(n[0],n[r-1],u)):l}function Rg(n,e){const t=n[n.length-1];for(let i=1;i<=e;i++){const s=ns(0,e,i);n.push(at(t,1,s))}}function lf(n){const e=[0];return Rg(e,n.length-1),e}function Cg(n,e){return n.map(t=>t*e)}function Pg(n,e){return n.map(()=>e||qd).splice(0,n.length-1)}function ws({duration:n=300,keyframes:e,times:t,ease:i="easeInOut"}){const s=km(i)?i.map(qc):qc(i),r={done:!1,value:e[0]},a=Cg(t&&t.length===e.length?t:lf(e),n),o=Jl(a,e,{ease:Array.isArray(s)?s:Pg(e,s)});return{calculatedDuration:n,next:c=>(r.value=o(c),r.done=c>=n,r)}}const Lg=n=>n!==null;function ma(n,{repeat:e,repeatType:t="loop"},i,s=1){const r=n.filter(Lg),o=s<0||e&&t!=="loop"&&e%2===1?0:r.length-1;return!o||i===void 0?r[o]:i}const Dg={decay:Po,inertia:Po,tween:ws,keyframes:ws,spring:Kr};function cf(n){typeof n.type=="string"&&(n.type=Dg[n.type])}class Ql{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,t){return this.finished.then(e,t)}}const Ng=n=>n/100;class Fs extends Ql{constructor(e){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{const{motionValue:t}=this.options;t&&t.updatedAt!==Bt.now()&&this.tick(Bt.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){const{options:e}=this;cf(e);const{type:t=ws,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:a=0}=e;let{keyframes:o}=e;const c=t||ws;c!==ws&&typeof o[0]!="number"&&(this.mixKeyframes=Xs(Ng,rf(o[0],o[1])),o=[0,100]);const l=c({...e,keyframes:o});r==="mirror"&&(this.mirroredGenerator=c({...e,keyframes:[...o].reverse(),velocity:-a})),l.calculatedDuration===null&&(l.calculatedDuration=Zl(l));const{calculatedDuration:u}=l;this.calculatedDuration=u,this.resolvedDuration=u+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=l}updateTime(e){const t=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=t}tick(e,t=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:a,resolvedDuration:o,calculatedDuration:c}=this;if(this.startTime===null)return i.next(0);const{delay:l=0,keyframes:u,repeat:d,repeatType:h,repeatDelay:p,type:g,onUpdate:y,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-s/this.speed,this.startTime)),t?this.currentTime=e:this.updateTime(e);const f=this.currentTime-l*(this.playbackSpeed>=0?1:-1),b=this.playbackSpeed>=0?f<0:f>s;this.currentTime=Math.max(f,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let A=this.currentTime,S=i;if(d){const _=Math.min(this.currentTime,s)/o;let w=Math.floor(_),L=_%1;!L&&_>=1&&(L=1),L===1&&w--,w=Math.min(w,d+1),w%2&&(h==="reverse"?(L=1-L,p&&(L-=p/o)):h==="mirror"&&(S=a)),A=mn(0,1,L)*o}let T;b?(this.delayState.value=u[0],T=this.delayState):T=S.next(A),r&&!b&&(T.value=r(T.value));let{done:M}=T;!b&&c!==null&&(M=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const P=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&M);return P&&g!==Po&&(T.value=ma(u,this.options,m,this.speed)),y&&y(T.value),P&&this.finish(),T}then(e,t){return this.finished.then(e,t)}get duration(){return en(this.calculatedDuration)}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+en(e)}get time(){return en(this.currentTime)}set time(e){e=qt(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=e,this.tick(e))}getGeneratorVelocity(){const e=this.currentTime;if(e<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(e);const t=this.generator.next(e).value;return of(i=>this.generator.next(i).value,e,t)}get speed(){return this.playbackSpeed}set speed(e){const t=this.playbackSpeed!==e;t&&this.driver&&this.updateTime(Bt.now()),this.playbackSpeed=e,t&&this.driver&&(this.time=en(this.currentTime))}play(){if(this.isStopped)return;const{driver:e=xg,startTime:t}=this.options;this.driver||(this.driver=e(s=>this.tick(s))),this.options.onPlay?.();const i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime:this.startTime||(this.startTime=t??i),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(Bt.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),e.observe(this)}}function Ig(n){for(let e=1;e<n.length;e++)n[e]??(n[e]=n[e-1])}const xi=n=>n*180/Math.PI,Lo=n=>{const e=xi(Math.atan2(n[1],n[0]));return Do(e)},Ug={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:n=>(Math.abs(n[0])+Math.abs(n[3]))/2,rotate:Lo,rotateZ:Lo,skewX:n=>xi(Math.atan(n[1])),skewY:n=>xi(Math.atan(n[2])),skew:n=>(Math.abs(n[1])+Math.abs(n[2]))/2},Do=n=>(n=n%360,n<0&&(n+=360),n),tu=Lo,nu=n=>Math.sqrt(n[0]*n[0]+n[1]*n[1]),iu=n=>Math.sqrt(n[4]*n[4]+n[5]*n[5]),Fg={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:nu,scaleY:iu,scale:n=>(nu(n)+iu(n))/2,rotateX:n=>Do(xi(Math.atan2(n[6],n[5]))),rotateY:n=>Do(xi(Math.atan2(-n[2],n[0]))),rotateZ:tu,rotate:tu,skewX:n=>xi(Math.atan(n[4])),skewY:n=>xi(Math.atan(n[1])),skew:n=>(Math.abs(n[1])+Math.abs(n[4]))/2};function No(n){return n.includes("scale")?1:0}function Io(n,e){if(!n||n==="none")return No(e);const t=n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(t)i=Fg,s=t;else{const o=n.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=Ug,s=o}if(!s)return No(e);const r=i[e],a=s[1].split(",").map(Bg);return typeof r=="function"?r(a):a[r]}const Og=(n,e)=>{const{transform:t="none"}=getComputedStyle(n);return Io(t,e)};function Bg(n){return parseFloat(n.trim())}const ls=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],cs=new Set([...ls,"pathRotation"]),su=n=>n===os||n===Me,Vg=new Set(["x","y","z"]),kg=ls.filter(n=>!Vg.has(n));function zg(n){const e=[];return kg.forEach(t=>{const i=n.getValue(t);i!==void 0&&(e.push([t,i.get()]),i.set(t.startsWith("scale")?1:0))}),e}const ti={width:({x:n},{paddingLeft:e="0",paddingRight:t="0",boxSizing:i})=>{const s=n.max-n.min;return i==="border-box"?s:s-parseFloat(e)-parseFloat(t)},height:({y:n},{paddingTop:e="0",paddingBottom:t="0",boxSizing:i})=>{const s=n.max-n.min;return i==="border-box"?s:s-parseFloat(e)-parseFloat(t)},top:(n,{top:e})=>parseFloat(e),left:(n,{left:e})=>parseFloat(e),bottom:({y:n},{top:e})=>parseFloat(e)+(n.max-n.min),right:({x:n},{left:e})=>parseFloat(e)+(n.max-n.min),x:(n,{transform:e})=>Io(e,"x"),y:(n,{transform:e})=>Io(e,"y")};ti.translateX=ti.x;ti.translateY=ti.y;const Si=new Set;let Uo=!1,Fo=!1,Oo=!1;function uf(){if(Fo){const n=Array.from(Si).filter(i=>i.needsMeasurement),e=new Set(n.map(i=>i.element)),t=new Map;e.forEach(i=>{const s=zg(i);s.length&&(t.set(i,s),i.render())}),n.forEach(i=>i.measureInitialState()),e.forEach(i=>{i.render();const s=t.get(i);s&&s.forEach(([r,a])=>{i.getValue(r)?.set(a)})}),n.forEach(i=>i.measureEndState()),n.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Fo=!1,Uo=!1,Si.forEach(n=>n.complete(Oo)),Si.clear()}function hf(){Si.forEach(n=>{n.readKeyframes(),n.needsMeasurement&&(Fo=!0)})}function Hg(){Oo=!0,hf(),uf(),Oo=!1}class ec{constructor(e,t,i,s,r,a=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=t,this.name=i,this.motionValue=s,this.element=r,this.isAsync=a}scheduleResolve(){this.state="scheduled",this.isAsync?(Si.add(this),Uo||(Uo=!0,qe.read(hf),qe.resolveKeyframes(uf))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:t,element:i,motionValue:s}=this;if(e[0]===null){const r=s?.get(),a=e[e.length-1];if(r!==void 0)e[0]=r;else if(i&&t){const o=i.readValue(t,a);o!=null&&(e[0]=o)}e[0]===void 0&&(e[0]=a),s&&r===void 0&&s.set(e[0])}Ig(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),Si.delete(this)}cancel(){this.state==="scheduled"&&(Si.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Gg=n=>n.startsWith("--");function df(n,e,t){Gg(e)?n.style.setProperty(e,t):n.style[e]=t}const Wg={};function tc(n,e){const t=Vd(n);return()=>Wg[e]??t()}const nc=tc(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ff=tc(()=>window.ViewTimeline!==void 0,"viewTimeline"),pf=tc(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Ms=([n,e,t,i])=>`cubic-bezier(${n}, ${e}, ${t}, ${i})`,ru={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Ms([0,.65,.55,1]),circOut:Ms([.55,0,1,.45]),backIn:Ms([.31,.01,.66,-.59]),backOut:Ms([.33,1.53,.69,.99])};function mf(n,e){if(n)return typeof n=="function"?pf()?af(n,e):"ease-out":$d(n)?Ms(n):Array.isArray(n)?n.map(t=>mf(t,e)||ru.easeOut):ru[n]}function Xg(n,e,t,{delay:i=0,duration:s=300,repeat:r=0,repeatType:a="loop",ease:o="easeOut",times:c}={},l=void 0){const u={[e]:t};c&&(u.offset=c);const d=mf(o,s);Array.isArray(d)&&(u.easing=d);const h={delay:i,duration:s,easing:Array.isArray(d)?"linear":d,fill:"both",iterations:r+1,direction:a==="reverse"?"alternate":"normal"};return l&&(h.pseudoElement=l),n.animate(u,h)}function gf(n){return typeof n=="function"&&"applyToOptions"in n}function jg({type:n,...e}){return gf(n)&&pf()?n.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}class vf extends Ql{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!e)return;const{element:t,name:i,keyframes:s,pseudoElement:r,allowFlatten:a=!1,finalKeyframe:o,onComplete:c}=e;this.isPseudoElement=!!r,this.allowFlatten=a,this.options=e,pa(typeof e.type!="string");const l=jg(e);this.animation=Xg(t,i,s,l,r),l.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=ma(s,this.options,o,this.speed);this.updateMotionValue&&this.updateMotionValue(u),df(t,i,u),this.animation.cancel()}c?.(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:e}=this;e==="idle"||e==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){const e=this.options?.element;!this.isPseudoElement&&e?.isConnected&&this.animation.commitStyles?.()}get duration(){const e=this.animation.effect?.getComputedTiming?.().duration||0;return en(Number(e))}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+en(e)}get time(){return en(Number(this.animation.currentTime)||0)}set time(e){const t=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=qt(e),t&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(e){this.manualStartTime=this.animation.startTime=e}attachTimeline({timeline:e,rangeStart:t,rangeEnd:i,observe:s}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,e&&nc()?(this.animation.timeline=e,t&&(this.animation.rangeStart=t),i&&(this.animation.rangeEnd=i),Ht):s(this)}}const xf={anticipate:Xd,backInOut:Wd,circInOut:Yd};function Yg(n){return n in xf}function qg(n){typeof n.ease=="string"&&Yg(n.ease)&&(n.ease=xf[n.ease])}const La=10;class $g extends vf{constructor(e){qg(e),cf(e),super(e),e.startTime!==void 0&&e.autoplay!==!1&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){const{motionValue:t,onUpdate:i,onComplete:s,element:r,...a}=this.options;if(!t)return;if(e!==void 0){t.set(e);return}const o=new Fs({...a,autoplay:!1}),c=Math.max(La,Bt.now()-this.startTime),l=mn(0,La,c-La),u=o.sample(c).value,{name:d}=this.options;r&&d&&df(r,d,u),t.setWithVelocity(o.sample(Math.max(0,c-l)).value,u,l),o.stop()}}const au=(n,e)=>e==="zIndex"?!1:!!(typeof n=="number"||Array.isArray(n)||typeof n=="string"&&(fn.test(n)||n==="0")&&!n.startsWith("url("));function Kg(n){const e=n[0];if(n.length===1)return!0;for(let t=0;t<n.length;t++)if(n[t]!==e)return!0}function Zg(n,e,t,i){const s=n[0];if(s===null)return!1;if(e==="display"||e==="visibility")return!0;const r=n[n.length-1],a=au(s,e),o=au(r,e);return!a||!o?!1:Kg(n)||(t==="spring"||gf(t))&&i}function Bo(n){n.duration=0,n.type="keyframes"}const _f=new Set(["opacity","clipPath","filter","transform","backgroundColor"]),Jg=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function Qg(n){for(let e=0;e<n.length;e++)if(typeof n[e]=="string"&&Jg.test(n[e]))return!0;return!1}const e0=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),t0=Vd(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function n0(n){const{motionValue:e,name:t,repeatDelay:i,repeatType:s,damping:r,type:a,keyframes:o}=n,c=e?.owner?.current;if(!(c instanceof HTMLElement)&&!(c instanceof SVGElement))return!1;const{onUpdate:l,transformTemplate:u}=e.owner.getProps();return t0()&&t&&(_f.has(t)||e0.has(t)&&Qg(o))&&(t!=="transform"||!u)&&!l&&!i&&s!=="mirror"&&r!==0&&a!=="inertia"}const i0=40;class s0 extends Ql{constructor({autoplay:e=!0,delay:t=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:a="loop",keyframes:o,name:c,motionValue:l,element:u,...d}){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=Bt.now();const h={autoplay:e,delay:t,type:i,repeat:s,repeatDelay:r,repeatType:a,name:c,motionValue:l,element:u,...d},p=u?.KeyframeResolver||ec;this.keyframeResolver=new p(o,(g,y,m)=>this.onKeyframesResolved(g,y,h,!m),c,l,u),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(e,t,i,s){this.keyframeResolver=void 0;const{name:r,type:a,velocity:o,delay:c,isHandoff:l,onUpdate:u}=i;this.resolvedAt=Bt.now();let d=!0;Zg(e,r,a,o)||(d=!1,(ii.instantAnimations||!c)&&u?.(ma(e,i,t)),e[0]=e[e.length-1],Bo(i),i.repeat=0);const p={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>i0?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:t,...i,keyframes:e},g=d&&!l&&n0(p),y=p.motionValue?.owner?.current;let m;if(g)try{m=new $g({...p,element:y})}catch{m=new Fs(p)}else m=new Fs(p);m.finished.then(()=>{this.notifyFinished()}).catch(Ht),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(e,t){return this.finished.finally(e).then(()=>{})}get animation(){return this._animation||(this.keyframeResolver?.resume(),Hg()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}}function yf(n,e,t,i=0,s=1){const r=Array.from(n).sort((l,u)=>l.sortNodePosition(u)).indexOf(e),a=n.size,o=(a-1)*i;return typeof t=="function"?t(r,a):s===1?r*i:o-r*i}const ou=30,r0=n=>!isNaN(parseFloat(n)),Rs={current:void 0};class a0{constructor(e,t={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{const s=Bt.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.events.change?.notify(this.current),this.dependents))for(const r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=t.owner}setCurrent(e){this.current=e,this.updatedAt=Bt.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=r0(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,t){this.events[e]||(this.events[e]=new Gl);const i=this.events[e].add(t);return e==="change"?()=>{i(),qe.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,t){this.passiveEffect=e,this.stopPassiveEffect=t}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,t,i){this.set(t),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-i}jump(e,t=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.events.change?.notify(this.current)}addDependent(e){this.dependents||(this.dependents=new Set),this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return Rs.current&&Rs.current.push(this),this.current}getPrevious(){return this.prev}getVelocity(){const e=Bt.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>ou)return 0;const t=Math.min(this.updatedAt-this.prevUpdatedAt,ou);return Wl(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(e){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=e(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function hn(n,e){return new a0(n,e)}function Sf(n,e){if(n?.inherit&&e){const{inherit:t,...i}=n;return{...e,...i}}return n}function ic(n,e){const t=n?.[e]??n?.default??n;return t!==n?Sf(t,n):t}const o0={type:"spring",stiffness:500,damping:25,restSpeed:10},l0=n=>({type:"spring",stiffness:550,damping:n===0?2*Math.sqrt(550):30,restSpeed:10}),c0={type:"keyframes",duration:.8},u0={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},h0=(n,{keyframes:e})=>e.length>2?c0:cs.has(n)?n.startsWith("scale")?l0(e[1]):o0:u0,d0=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function f0(n){for(const e in n)if(!d0.has(e))return!0;return!1}const sc=(n,e,t,i={},s,r)=>a=>{const o=ic(i,n)||{},c=o.delay||i.delay||0;let{elapsed:l=0}=i;l=l-qt(c);const u={keyframes:Array.isArray(t)?t:[null,t],ease:"easeOut",velocity:e.getVelocity(),...o,delay:-l,onUpdate:h=>{e.set(h),o.onUpdate&&o.onUpdate(h)},onComplete:()=>{a(),o.onComplete&&o.onComplete()},name:n,motionValue:e,element:r?void 0:s};f0(o)||Object.assign(u,h0(n,u)),u.duration&&(u.duration=qt(u.duration)),u.repeatDelay&&(u.repeatDelay=qt(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let d=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Bo(u),u.delay===0&&(d=!0)),(ii.instantAnimations||ii.skipAnimations||s?.shouldSkipAnimations||o.skipAnimations)&&(d=!0,Bo(u),u.delay=0),u.allowFlatten=!o.type&&!o.ease,d&&!r&&e.get()!==void 0){const h=ma(u.keyframes,o);if(h!==void 0){qe.update(()=>{u.onUpdate(h),u.onComplete()});return}}return o.isSync?new Fs(u):new s0(u)},p0=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function m0(n){const e=p0.exec(n);if(!e)return[,];const[,t,i,s]=e;return[`--${t??i}`,s]}function Mf(n,e,t=1){const[i,s]=m0(n);if(!i)return;const r=window.getComputedStyle(e).getPropertyValue(i);if(r){const a=r.trim();return Fd(a)?parseFloat(a):a}return Yl(s)?Mf(s,e,t+1):s}function lu(n){const e=[{},{}];return n?.values.forEach((t,i)=>{e[0][i]=t.get(),e[1][i]=t.getVelocity()}),e}function rc(n,e,t,i){if(typeof e=="function"){const[s,r]=lu(i);e=e(t!==void 0?t:n.custom,s,r)}if(typeof e=="string"&&(e=n.variants&&n.variants[e]),typeof e=="function"){const[s,r]=lu(i);e=e(t!==void 0?t:n.custom,s,r)}return e}function Mi(n,e,t){const i=n.getProps();return rc(i,e,t!==void 0?t:i.custom,n)}const Ef=new Set(["width","height","top","left","right","bottom",...ls]),Vo=n=>Array.isArray(n);function g0(n,e,t){n.hasValue(e)?n.getValue(e).set(t):n.addValue(e,hn(t))}function v0(n){return Vo(n)?n[n.length-1]||0:n}function x0(n,e){const t=Mi(n,e);let{transitionEnd:i={},transition:s={},...r}=t||{};r={...r,...i};for(const a in r){const o=v0(r[a]);g0(n,a,o)}}const Et=n=>!!(n&&n.getVelocity);function _0(n){return!!(Et(n)&&n.add)}function ko(n,e){const t=n.getValue("willChange");if(_0(t))return t.add(e);if(!t&&ii.WillChange){const i=new ii.WillChange("auto");n.addValue("willChange",i),i.add(e)}}function ac(n){return n.replace(/([A-Z])/g,e=>`-${e.toLowerCase()}`)}const y0="framerAppearId",bf="data-"+ac(y0);function Tf(n){return n.props[bf]}function S0({protectedKeys:n,needsAnimating:e},t){const i=n.hasOwnProperty(t)&&e[t]!==!0;return e[t]=!1,i}function Af(n,e,{delay:t=0,transitionOverride:i,type:s}={}){let{transition:r,transitionEnd:a,...o}=e;const c=n.getDefaultTransition();r=r?Sf(r,c):c;const l=r?.reduceMotion,u=r?.skipAnimations;i&&(r=i);const d=[],h=s&&n.animationState&&n.animationState.getState()[s],p=r?.path;p&&p.animateVisualElement(n,o,r,t,d);for(const g in o){const y=n.getValue(g,n.latestValues[g]??null),m=o[g];if(m===void 0||h&&S0(h,g))continue;const f={delay:t,...ic(r||{},g)};u&&(f.skipAnimations=!0);const b=y.get();if(b!==void 0&&!y.isAnimating()&&!Array.isArray(m)&&m===b&&!f.velocity){qe.update(()=>y.set(m));continue}let A=!1;if(window.MotionHandoffAnimation){const M=Tf(n);if(M){const P=window.MotionHandoffAnimation(M,g,qe);P!==null&&(f.startTime=P,A=!0)}}ko(n,g);const S=l??n.shouldReduceMotion;y.start(sc(g,y,m,S&&Ef.has(g)?{type:!1}:f,n,A));const T=y.animation;T&&d.push(T)}if(a){const g=()=>qe.update(()=>{a&&x0(n,a)});d.length?Promise.all(d).then(g):g()}return d}function zo(n,e,t={}){const i=Mi(n,e,t.type==="exit"?n.presenceContext?.custom:void 0);let{transition:s=n.getDefaultTransition()||{}}=i||{};t.transitionOverride&&(s=t.transitionOverride);const r=i?()=>Promise.all(Af(n,i,t)):()=>Promise.resolve(),a=n.variantChildren&&n.variantChildren.size?(c=0)=>{const{delayChildren:l=0,staggerChildren:u,staggerDirection:d}=s;return M0(n,e,c,l,u,d,t)}:()=>Promise.resolve(),{when:o}=s;if(o){const[c,l]=o==="beforeChildren"?[r,a]:[a,r];return c().then(()=>l())}else return Promise.all([r(),a(t.delay)])}function M0(n,e,t=0,i=0,s=0,r=1,a){const o=[];for(const c of n.variantChildren)c.notify("AnimationStart",e),o.push(zo(c,e,{...a,delay:t+(typeof i=="function"?0:i)+yf(n.variantChildren,c,i,s,r)}).then(()=>c.notify("AnimationComplete",e)));return Promise.all(o)}function E0(n,e,t={}){n.notify("AnimationStart",e);let i;if(Array.isArray(e)){const s=e.map(r=>zo(n,r,t));i=Promise.all(s)}else if(typeof e=="string")i=zo(n,e,t);else{const s=typeof e=="function"?Mi(n,e,t.custom):e;i=Promise.all(Af(n,s,t))}return i.then(()=>{n.notify("AnimationComplete",e)})}const b0={test:n=>n==="auto",parse:n=>n},wf=n=>e=>e.test(n),Rf=[os,Me,Tn,Un,Qm,Jm,b0],cu=n=>Rf.find(wf(n));function T0(n){return typeof n=="number"?n===0:n!==null?n==="none"||n==="0"||Bd(n):!0}const A0=new Set(["brightness","contrast","saturate","opacity"]);function w0(n){const[e,t]=n.slice(0,-1).split("(");if(e==="drop-shadow")return n;const[i]=t.match(ql)||[];if(!i)return n;const s=t.replace(i,"");let r=A0.has(e)?1:0;return i!==t&&(r*=100),e+"("+r+s+")"}const R0=/\b([a-z-]*)\(.*?\)/gu,Ho={...fn,getAnimatableNone:n=>{const e=n.match(R0);return e?e.map(w0).join(" "):n}},Go={...fn,getAnimatableNone:n=>{const e=fn.parse(n);return fn.createTransformer(n)(e.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}},uu={...os,transform:Math.round},C0={rotate:Un,pathRotation:Un,rotateX:Un,rotateY:Un,rotateZ:Un,scale:nr,scaleX:nr,scaleY:nr,scaleZ:nr,skew:Un,skewX:Un,skewY:Un,distance:Me,translateX:Me,translateY:Me,translateZ:Me,x:Me,y:Me,z:Me,perspective:Me,transformPerspective:Me,opacity:Us,originX:Kc,originY:Kc,originZ:Me},Zr={borderWidth:Me,borderTopWidth:Me,borderRightWidth:Me,borderBottomWidth:Me,borderLeftWidth:Me,borderRadius:Me,borderTopLeftRadius:Me,borderTopRightRadius:Me,borderBottomRightRadius:Me,borderBottomLeftRadius:Me,width:Me,maxWidth:Me,height:Me,maxHeight:Me,top:Me,right:Me,bottom:Me,left:Me,inset:Me,insetBlock:Me,insetBlockStart:Me,insetBlockEnd:Me,insetInline:Me,insetInlineStart:Me,insetInlineEnd:Me,padding:Me,paddingTop:Me,paddingRight:Me,paddingBottom:Me,paddingLeft:Me,paddingBlock:Me,paddingBlockStart:Me,paddingBlockEnd:Me,paddingInline:Me,paddingInlineStart:Me,paddingInlineEnd:Me,margin:Me,marginTop:Me,marginRight:Me,marginBottom:Me,marginLeft:Me,marginBlock:Me,marginBlockStart:Me,marginBlockEnd:Me,marginInline:Me,marginInlineStart:Me,marginInlineEnd:Me,fontSize:Me,backgroundPositionX:Me,backgroundPositionY:Me,...C0,zIndex:uu,fillOpacity:Us,strokeOpacity:Us,numOctaves:uu},P0={...Zr,color:yt,backgroundColor:yt,outlineColor:yt,fill:yt,stroke:yt,borderColor:yt,borderTopColor:yt,borderRightColor:yt,borderBottomColor:yt,borderLeftColor:yt,filter:Ho,WebkitFilter:Ho,mask:Go,WebkitMask:Go},Cf=n=>P0[n],L0=new Set([Ho,Go]);function Pf(n,e){let t=Cf(n);return L0.has(t)||(t=fn),t.getAnimatableNone?t.getAnimatableNone(e):void 0}const D0=new Set(["auto","none","0"]);function N0(n,e,t){let i=0,s;for(;i<n.length&&!s;){const r=n[i];typeof r=="string"&&!D0.has(r)&&is(r).values.length&&(s=n[i]),i++}if(s&&t)for(const r of e)n[r]=Pf(t,s)}class I0 extends ec{constructor(e,t,i,s,r){super(e,t,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:t,name:i}=this;if(!t||!t.current)return;super.readKeyframes();for(let u=0;u<e.length;u++){let d=e[u];if(typeof d=="string"&&(d=d.trim(),Yl(d))){const h=Mf(d,t.current);h!==void 0&&(e[u]=h),u===e.length-1&&(this.finalKeyframe=d)}}if(this.resolveNoneKeyframes(),!Ef.has(i)||e.length!==2)return;const[s,r]=e,a=cu(s),o=cu(r),c=$c(s),l=$c(r);if(c!==l&&ti[i]){this.needsMeasurement=!0;return}if(a!==o)if(su(a)&&su(o))for(let u=0;u<e.length;u++){const d=e[u];typeof d=="string"&&(e[u]=parseFloat(d))}else ti[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:t}=this,i=[];for(let s=0;s<e.length;s++)(e[s]===null||T0(e[s]))&&i.push(s);i.length&&N0(e,i,t)}measureInitialState(){const{element:e,unresolvedKeyframes:t,name:i}=this;if(!e||!e.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=ti[i](e.measureViewportBox(),window.getComputedStyle(e.current)),t[0]=this.measuredOrigin;const s=t[t.length-1];s!==void 0&&e.getValue(i,s).jump(s,!1)}measureEndState(){const{element:e,name:t,unresolvedKeyframes:i}=this;if(!e||!e.current)return;const s=e.getValue(t);s&&s.jump(this.measuredOrigin,!1);const r=i.length-1,a=i[r];i[r]=ti[t](e.measureViewportBox(),window.getComputedStyle(e.current)),a!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=a),this.removedTransforms?.length&&this.removedTransforms.forEach(([o,c])=>{e.getValue(o).set(c)}),this.resolveNoneKeyframes()}}const oc=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function Lf(n,e,t){if(n==null)return[];if(n instanceof EventTarget)return[n];if(typeof n=="string"){const s=document.querySelectorAll(n);return s?Array.from(s):[]}return Array.from(n).filter(i=>i!=null)}const Wo=(n,e)=>e&&typeof n=="number"?e.transform(n):n;function Cs(n){return Od(n)&&"offsetHeight"in n&&!("ownerSVGElement"in n)}const{schedule:ss,cancel:Df}=Kd(queueMicrotask,!1),cn={x:!1,y:!1};function Nf(){return cn.x||cn.y}function U0(n){return n==="x"||n==="y"?cn[n]?null:(cn[n]=!0,()=>{cn[n]=!1}):cn.x||cn.y?null:(cn.x=cn.y=!0,()=>{cn.x=cn.y=!1})}function If(n,e){const t=Lf(n),i=new AbortController,s={passive:!0,...e,signal:i.signal};return[t,s,()=>i.abort()]}function F0(n){return!(n.pointerType==="touch"||Nf())}function O0(n,e,t={}){const[i,s,r]=If(n,t);return i.forEach(a=>{let o=!1,c=!1,l;const u=()=>{a.removeEventListener("pointerleave",g)},d=m=>{l&&(l(m),l=void 0),u()},h=m=>{o=!1,window.removeEventListener("pointerup",h),window.removeEventListener("pointercancel",h),c&&(c=!1,d(m))},p=()=>{o=!0,window.addEventListener("pointerup",h,s),window.addEventListener("pointercancel",h,s)},g=m=>{if(m.pointerType!=="touch"){if(o){c=!0;return}d(m)}},y=m=>{if(!F0(m))return;c=!1;const f=e(a,m);typeof f=="function"&&(l=f,a.addEventListener("pointerleave",g,s))};a.addEventListener("pointerenter",y,s),a.addEventListener("pointerdown",p,s)}),r}const Uf=(n,e)=>e?n===e?!0:Uf(n,e.parentElement):!1,lc=n=>n.pointerType==="mouse"?typeof n.button!="number"||n.button<=0:n.isPrimary!==!1,B0=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function V0(n){return B0.has(n.tagName)||n.isContentEditable===!0}const k0=new Set(["INPUT","SELECT","TEXTAREA"]);function z0(n){return k0.has(n.tagName)||n.isContentEditable===!0}const Nr=new WeakSet;function hu(n){return e=>{e.key==="Enter"&&n(e)}}function Da(n,e){n.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const H0=(n,e)=>{const t=n.currentTarget;if(!t)return;const i=hu(()=>{if(Nr.has(t))return;Da(t,"down");const s=hu(()=>{Da(t,"up")}),r=()=>Da(t,"cancel");t.addEventListener("keyup",s,e),t.addEventListener("blur",r,e)});t.addEventListener("keydown",i,e),t.addEventListener("blur",()=>t.removeEventListener("keydown",i),e)};function du(n){return lc(n)&&!Nf()}const fu=new WeakSet;function G0(n,e,t={}){const[i,s,r]=If(n,t),a=o=>{const c=o.currentTarget;if(!du(o)||fu.has(o))return;Nr.add(c),t.stopPropagation&&fu.add(o);const l=e(c,o),u={...s,capture:!0},d=(g,y)=>{window.removeEventListener("pointerup",h,u),window.removeEventListener("pointercancel",p,u),Nr.has(c)&&Nr.delete(c),du(g)&&typeof l=="function"&&l(g,{success:y})},h=g=>{d(g,c===window||c===document||t.useGlobalTarget||Uf(c,g.target))},p=g=>{d(g,!1)};window.addEventListener("pointerup",h,u),window.addEventListener("pointercancel",p,u)};return i.forEach(o=>{(t.useGlobalTarget?window:o).addEventListener("pointerdown",a,s),Cs(o)&&(o.addEventListener("focus",l=>H0(l,s)),!V0(o)&&!o.hasAttribute("tabindex")&&(o.tabIndex=0))}),r}function cc(n){return Od(n)&&"ownerSVGElement"in n}const Ir=new WeakMap;let Ur;const Ff=(n,e,t)=>(i,s)=>s&&s[0]?s[0][n+"Size"]:cc(i)&&"getBBox"in i?i.getBBox()[e]:i[t],W0=Ff("inline","width","offsetWidth"),X0=Ff("block","height","offsetHeight");function j0({target:n,borderBoxSize:e}){Ir.get(n)?.forEach(t=>{t(n,{get width(){return W0(n,e)},get height(){return X0(n,e)}})})}function Y0(n){n.forEach(j0)}function q0(){typeof ResizeObserver>"u"||(Ur=new ResizeObserver(Y0))}function $0(n,e){Ur||q0();const t=Lf(n);return t.forEach(i=>{let s=Ir.get(i);s||(s=new Set,Ir.set(i,s)),s.add(e),Ur?.observe(i)}),()=>{t.forEach(i=>{const s=Ir.get(i);s?.delete(e),s?.size||Ur?.unobserve(i)})}}const Fr=new Set;let $i;function K0(){$i=()=>{const n={get width(){return window.innerWidth},get height(){return window.innerHeight}};Fr.forEach(e=>e(n))},window.addEventListener("resize",$i)}function Z0(n){return Fr.add(n),$i||K0(),()=>{Fr.delete(n),!Fr.size&&typeof $i=="function"&&(window.removeEventListener("resize",$i),$i=void 0)}}function Xo(n,e){return typeof n=="function"?Z0(n):$0(n,e)}function Of(n,e){let t;const i=()=>{const{currentTime:s}=e,a=(s===null?0:s.value)/100;t!==a&&n(a),t=a};return qe.preUpdate(i,!0),()=>tn(i)}function J0(n){return cc(n)&&n.tagName==="svg"}function Q0(...n){const e=!Array.isArray(n[0]),t=e?0:-1,i=n[0+t],s=n[1+t],r=n[2+t],a=n[3+t],o=Jl(s,r,a);return e?o(i):o}function ev(n,e,t={}){const i=n.get();let s=null,r=i,a;const o=typeof i=="string"?i.replace(/[\d.-]/g,""):void 0,c=()=>{s&&(s.stop(),s=null),n.animation=void 0},l=()=>{const d=pu(n.get()),h=pu(r);if(d===h){c();return}const p=s?s.getGeneratorVelocity():n.getVelocity();c(),s=new Fs({keyframes:[d,h],velocity:p,type:"spring",restDelta:.001,restSpeed:.01,...t,onUpdate:a})},u=()=>{l(),n.animation=s??void 0,n.events.animationStart?.notify(),s?.then(()=>{n.animation=void 0,n.events.animationComplete?.notify()})};if(n.attach((d,h)=>{r=d,a=p=>h(Na(p,o)),qe.postRender(u)},c),Et(e)){let d=t.skipInitialAnimation===!0;const h=e.on("change",g=>{d?(d=!1,n.jump(Na(g,o),!1)):n.set(Na(g,o))}),p=n.on("destroy",h);return()=>{h(),p()}}return c}function Na(n,e){return e?n+e:n}function pu(n){return typeof n=="number"?n:parseFloat(n)}const tv=[...Rf,yt,fn],nv=n=>tv.find(wf(n)),mu=()=>({translate:0,scale:1,origin:0,originPoint:0}),Ki=()=>({x:mu(),y:mu()}),gu=()=>({min:0,max:0}),Mt=()=>({x:gu(),y:gu()}),iv=new WeakMap;function ga(n){return n!==null&&typeof n=="object"&&typeof n.start=="function"}function Os(n){return typeof n=="string"||Array.isArray(n)}const uc=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],hc=["initial",...uc];function va(n){return ga(n.animate)||hc.some(e=>Os(n[e]))}function Bf(n){return!!(va(n)||n.variants)}function sv(n,e,t){for(const i in e){const s=e[i],r=t[i];if(Et(s))n.addValue(i,s);else if(Et(r))n.addValue(i,hn(s,{owner:n}));else if(r!==s)if(n.hasValue(i)){const a=n.getValue(i);a.liveStyle===!0?a.jump(s):a.hasAnimated||a.set(s)}else{const a=n.getStaticValue(i);n.addValue(i,hn(a!==void 0?a:s,{owner:n}))}}for(const i in t)e[i]===void 0&&n.removeValue(i);return e}const Jr={current:null},dc={current:!1},rv=typeof window<"u";function Vf(){if(dc.current=!0,!!rv)if(window.matchMedia){const n=window.matchMedia("(prefers-reduced-motion)"),e=()=>Jr.current=n.matches;n.addEventListener("change",e),e()}else Jr.current=!1}const vu=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let Qr={};function kf(n){Qr=n}function av(){return Qr}class ov{scrapeMotionValuesFromProps(e,t,i){return{}}constructor({parent:e,props:t,presenceContext:i,reducedMotionConfig:s,skipAnimations:r,blockInitialAnimation:a,visualState:o},c={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=ec,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const p=Bt.now();this.renderScheduledAt<p&&(this.renderScheduledAt=p,qe.render(this.render,!1,!0))};const{latestValues:l,renderState:u}=o;this.latestValues=l,this.baseTarget={...l},this.initialValues=t.initial?{...l}:{},this.renderState=u,this.parent=e,this.props=t,this.presenceContext=i,this.depth=e?e.depth+1:0,this.reducedMotionConfig=s,this.skipAnimationsConfig=r,this.options=c,this.blockInitialAnimation=!!a,this.isControllingVariants=va(t),this.isVariantNode=Bf(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:d,...h}=this.scrapeMotionValuesFromProps(t,{},this);for(const p in h){const g=h[p];l[p]!==void 0&&Et(g)&&g.set(l[p])}}mount(e){if(this.hasBeenMounted)for(const t in this.initialValues)this.values.get(t)?.jump(this.initialValues[t]),this.latestValues[t]=this.initialValues[t];this.current=e,iv.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((t,i)=>this.bindToMotionValue(i,t)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(dc.current||Vf(),this.shouldReduceMotion=Jr.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,this.parent?.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){this.projection&&this.projection.unmount(),tn(this.notifyUpdate),tn(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent?.removeChild(this);for(const e in this.events)this.events[e].clear();for(const e in this.features){const t=this.features[e];t&&(t.unmount(),t.isMounted=!1)}this.current=null}addChild(e){this.children.add(e),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(e)}removeChild(e){this.children.delete(e),this.enteringChildren&&this.enteringChildren.delete(e)}bindToMotionValue(e,t){if(this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)(),t.accelerate&&_f.has(e)&&this.current instanceof HTMLElement){const{factory:a,keyframes:o,times:c,ease:l,duration:u}=t.accelerate,d=new vf({element:this.current,name:e,keyframes:o,times:c,ease:l,duration:qt(u)}),h=a(d);this.valueSubscriptions.set(e,()=>{h(),d.cancel()});return}const i=cs.has(e);i&&this.onBindTransform&&this.onBindTransform();const s=t.on("change",a=>{this.latestValues[e]=a,this.props.onUpdate&&qe.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,e,t)),this.valueSubscriptions.set(e,()=>{s(),r&&r()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in Qr){const t=Qr[e];if(!t)continue;const{isEnabled:i,Feature:s}=t;if(!this.features[e]&&s&&i(this.props)&&(this.features[e]=new s(this)),this.features[e]){const r=this.features[e];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Mt()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,t){this.latestValues[e]=t}update(e,t){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let i=0;i<vu.length;i++){const s=vu[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,a=e[r];a&&(this.propEventSubscriptions[s]=this.on(s,a))}this.prevMotionValues=sv(this,this.scrapeMotionValuesFromProps(e,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(e),()=>t.variantChildren.delete(e)}addValue(e,t){const i=this.values.get(e);t!==i&&(i&&this.removeValue(e),this.bindToMotionValue(e,t),this.values.set(e,t),this.latestValues[e]=t.get())}removeValue(e){this.values.delete(e);const t=this.valueSubscriptions.get(e);t&&(t(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,t){if(this.props.values&&this.props.values[e])return this.props.values[e];let i=this.values.get(e);return i===void 0&&t!==void 0&&(i=hn(t===null?void 0:t,{owner:this}),this.addValue(e,i)),i}readValue(e,t){let i=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:this.getBaseTargetFromProps(this.props,e)??this.readValueFromInstance(this.current,e,this.options);return i!=null&&(typeof i=="string"&&(Fd(i)||Bd(i))?i=parseFloat(i):!nv(i)&&fn.test(t)&&(i=Pf(e,t)),this.setBaseTarget(e,Et(i)?i.get():i)),Et(i)?i.get():i}setBaseTarget(e,t){this.baseTarget[e]=t}getBaseTarget(e){const{initial:t}=this.props;let i;if(typeof t=="string"||typeof t=="object"){const r=rc(this.props,t,this.presenceContext?.custom);r&&(i=r[e])}if(t&&i!==void 0)return i;const s=this.getBaseTargetFromProps(this.props,e);return s!==void 0&&!Et(s)?s:this.initialValues[e]!==void 0&&i===void 0?void 0:this.baseTarget[e]}on(e,t){return this.events[e]||(this.events[e]=new Gl),this.events[e].add(t)}notify(e,...t){this.events[e]&&this.events[e].notify(...t)}scheduleRenderMicrotask(){ss.render(this.render)}}class zf extends ov{constructor(){super(...arguments),this.KeyframeResolver=I0}sortInstanceNodePosition(e,t){return e.compareDocumentPosition(t)&2?1:-1}getBaseTargetFromProps(e,t){const i=e.style;return i?i[t]:void 0}removeValueFromRenderState(e,{vars:t,style:i}){delete t[e],delete i[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;Et(e)&&(this.childSubscription=e.on("change",t=>{this.current&&(this.current.textContent=`${t}`)}))}}class ri{constructor(e){this.isMounted=!1,this.node=e}update(){}}function Hf({top:n,left:e,right:t,bottom:i}){return{x:{min:e,max:t},y:{min:n,max:i}}}function lv({x:n,y:e}){return{top:e.min,right:n.max,bottom:e.max,left:n.min}}function cv(n,e){if(!e)return n;const t=e({x:n.left,y:n.top}),i=e({x:n.right,y:n.bottom});return{top:t.y,left:t.x,bottom:i.y,right:i.x}}function Ia(n){return n===void 0||n===1}function jo({scale:n,scaleX:e,scaleY:t}){return!Ia(n)||!Ia(e)||!Ia(t)}function mi(n){return jo(n)||Gf(n)||n.z||n.rotate||n.rotateX||n.rotateY||n.skewX||n.skewY}function Gf(n){return xu(n.x)||xu(n.y)}function xu(n){return n&&n!=="0%"}function ea(n,e,t){const i=n-t,s=e*i;return t+s}function _u(n,e,t,i,s){return s!==void 0&&(n=ea(n,s,i)),ea(n,t,i)+e}function Yo(n,e=0,t=1,i,s){n.min=_u(n.min,e,t,i,s),n.max=_u(n.max,e,t,i,s)}function Wf(n,{x:e,y:t}){Yo(n.x,e.translate,e.scale,e.originPoint),Yo(n.y,t.translate,t.scale,t.originPoint)}const yu=.999999999999,Su=1.0000000000001;function uv(n,e,t,i=!1){const s=t.length;if(!s)return;e.x=e.y=1;let r,a;for(let o=0;o<s;o++){r=t[o],a=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(Sn(n.x,-r.scroll.offset.x),Sn(n.y,-r.scroll.offset.y)),a&&(e.x*=a.x.scale,e.y*=a.y.scale,Wf(n,a)),i&&mi(r.latestValues)&&Or(n,r.latestValues,r.layout?.layoutBox))}e.x<Su&&e.x>yu&&(e.x=1),e.y<Su&&e.y>yu&&(e.y=1)}function Sn(n,e){n.min+=e,n.max+=e}function Mu(n,e,t,i,s=.5){const r=at(n.min,n.max,s);Yo(n,e,t,r,i)}function Eu(n,e){return typeof n=="string"?parseFloat(n)/100*(e.max-e.min):n}function Or(n,e,t){const i=t??n;Mu(n.x,Eu(e.x,i.x),e.scaleX,e.scale,e.originX),Mu(n.y,Eu(e.y,i.y),e.scaleY,e.scale,e.originY)}function Xf(n,e){return Hf(cv(n.getBoundingClientRect(),e))}function hv(n,e,t){const i=Xf(n,t),{scroll:s}=e;return s&&(Sn(i.x,s.offset.x),Sn(i.y,s.offset.y)),i}const dv={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},fv=ls.length;function pv(n,e,t){let i="",s=!0;for(let a=0;a<fv;a++){const o=ls[a],c=n[o];if(c===void 0)continue;let l=!0;if(typeof c=="number")l=c===(o.startsWith("scale")?1:0);else{const u=parseFloat(c);l=o.startsWith("scale")?u===1:u===0}if(!l||t){const u=Wo(c,Zr[o]);if(!l){s=!1;const d=dv[o]||o;i+=`${d}(${u}) `}t&&(e[o]=u)}}const r=n.pathRotation;return r&&(s=!1,i+=`rotate(${Wo(r,Zr.pathRotation)}) `),i=i.trim(),t?i=t(e,s?"":i):s&&(i="none"),i}function fc(n,e,t){const{style:i,vars:s,transformOrigin:r}=n;let a=!1,o=!1;for(const c in e){const l=e[c];if(cs.has(c)){a=!0;continue}else if(Jd(c)){s[c]=l;continue}else{const u=Wo(l,Zr[c]);c.startsWith("origin")?(o=!0,r[c]=u):i[c]=u}}if(e.transform||(a||t?i.transform=pv(e,n.transform,t):i.transform&&(i.transform="none")),o){const{originX:c="50%",originY:l="50%",originZ:u=0}=r;i.transformOrigin=`${c} ${l} ${u}`}}function jf(n,{style:e,vars:t},i,s){const r=n.style;let a;for(a in e)r[a]=e[a];s?.applyProjectionStyles(r,i);for(a in t)r.setProperty(a,t[a])}function bu(n,e){return e.max===e.min?0:n/(e.max-e.min)*100}const fs={correct:(n,e)=>{if(!e.target)return n;if(typeof n=="string")if(Me.test(n))n=parseFloat(n);else return n;const t=bu(n,e.target.x),i=bu(n,e.target.y);return`${t}% ${i}%`}},mv={correct:(n,{treeScale:e,projectionDelta:t})=>{const i=n,s=fn.parse(n);if(s.length>5)return i;const r=fn.createTransformer(n),a=typeof s[0]!="number"?1:0,o=t.x.scale*e.x,c=t.y.scale*e.y;s[0+a]/=o,s[1+a]/=c;const l=at(o,c,.5);return typeof s[2+a]=="number"&&(s[2+a]/=l),typeof s[3+a]=="number"&&(s[3+a]/=l),r(s)}},qo={borderRadius:{...fs,applyTo:[...oc]},borderTopLeftRadius:fs,borderTopRightRadius:fs,borderBottomLeftRadius:fs,borderBottomRightRadius:fs,boxShadow:mv};function Yf(n,{layout:e,layoutId:t}){return cs.has(n)||n.startsWith("origin")||(e||t!==void 0)&&(!!qo[n]||n==="opacity")}function pc(n,e,t){const i=n.style,s=e?.style,r={};if(!i)return r;for(const a in i)(Et(i[a])||s&&Et(s[a])||Yf(a,n)||t?.getValue(a)?.liveStyle!==void 0)&&(r[a]=i[a]);return r}function gv(n){return window.getComputedStyle(n)}class vv extends zf{constructor(){super(...arguments),this.type="html",this.renderInstance=jf}mount(e){pa(!!e.style),super.mount(e)}readValueFromInstance(e,t){if(cs.has(t))return this.projection?.isProjecting?No(t):Og(e,t);{const i=gv(e),s=(Jd(t)?i.getPropertyValue(t):i[t])||0;return typeof s=="string"?s.trim():s}}measureInstanceViewportBox(e,{transformPagePoint:t}){return Xf(e,t)}build(e,t,i){fc(e,t,i.transformTemplate)}scrapeMotionValuesFromProps(e,t,i){return pc(e,t,i)}}const xv={offset:"stroke-dashoffset",array:"stroke-dasharray"},_v={offset:"strokeDashoffset",array:"strokeDasharray"};function yv(n,e,t=1,i=0,s=!0){n.pathLength=1;const r=s?xv:_v;n[r.offset]=`${-i}`,n[r.array]=`${e} ${t}`}const Sv=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function qf(n,{attrX:e,attrY:t,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:a=0,...o},c,l,u){if(fc(n,o,l),c){n.style.viewBox&&(n.attrs.viewBox=n.style.viewBox);return}n.attrs=n.style,n.style={};const{attrs:d,style:h}=n;d.transform&&(h.transform=d.transform,delete d.transform),(h.transform||d.transformOrigin)&&(h.transformOrigin=d.transformOrigin??"50% 50%",delete d.transformOrigin),h.transform&&(h.transformBox=u?.transformBox??"fill-box",delete d.transformBox);for(const p of Sv)d[p]!==void 0&&(h[p]=d[p],delete d[p]);e!==void 0&&(d.x=e),t!==void 0&&(d.y=t),i!==void 0&&(d.scale=i),s!==void 0&&yv(d,s,r,a,!1)}const $f=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Kf=n=>typeof n=="string"&&n.toLowerCase()==="svg";function Mv(n,e,t,i){jf(n,e,void 0,i);for(const s in e.attrs)n.setAttribute($f.has(s)?s:ac(s),e.attrs[s])}function Zf(n,e,t){const i=pc(n,e,t);for(const s in n)if(Et(n[s])||Et(e[s])){const r=ls.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=n[s]}return i}class Ev extends zf{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=Mt}getBaseTargetFromProps(e,t){return e[t]}readValueFromInstance(e,t){if(cs.has(t)){const i=Cf(t);return i&&i.default||0}return t=$f.has(t)?t:ac(t),e.getAttribute(t)}scrapeMotionValuesFromProps(e,t,i){return Zf(e,t,i)}build(e,t,i){qf(e,t,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(e,t,i,s){Mv(e,t,i,s)}mount(e){this.isSVGTag=Kf(e.tagName),super.mount(e)}}const bv=hc.length;function Jf(n){if(!n)return;if(!n.isControllingVariants){const t=n.parent?Jf(n.parent)||{}:{};return n.props.initial!==void 0&&(t.initial=n.props.initial),t}const e={};for(let t=0;t<bv;t++){const i=hc[t],s=n.props[i];(Os(s)||s===!1)&&(e[i]=s)}return e}function Qf(n,e){if(!Array.isArray(e))return!1;const t=e.length;if(t!==n.length)return!1;for(let i=0;i<t;i++)if(e[i]!==n[i])return!1;return!0}const Tv=[...uc].reverse(),Av=uc.length;function wv(n){return e=>Promise.all(e.map(({animation:t,options:i})=>E0(n,t,i)))}function Rv(n){let e=wv(n),t=Tu(),i=!0,s=!1;const r=l=>(u,d)=>{const h=Mi(n,d,l==="exit"?n.presenceContext?.custom:void 0);if(h){const{transition:p,transitionEnd:g,...y}=h;u={...u,...y,...g}}return u};function a(l){e=l(n)}function o(l){const{props:u}=n,d=Jf(n.parent)||{},h=[],p=new Set;let g={},y=1/0;for(let f=0;f<Av;f++){const b=Tv[f],A=t[b],S=u[b]!==void 0?u[b]:d[b],T=Os(S),M=b===l?A.isActive:null;M===!1&&(y=f);let P=S===d[b]&&S!==u[b]&&T;if(P&&(i||s)&&n.manuallyAnimateOnMount&&(P=!1),A.protectedKeys={...g},!A.isActive&&M===null||!S&&!A.prevProp||ga(S)||typeof S=="boolean")continue;if(b==="exit"&&A.isActive&&M!==!0){A.prevResolvedValues&&(g={...g,...A.prevResolvedValues});continue}const _=Cv(A.prevProp,S);let w=_||b===l&&A.isActive&&!P&&T||f>y&&T,L=!1;const N=Array.isArray(S)?S:[S];let F=N.reduce(r(b),{});M===!1&&(F={});const{prevResolvedValues:V={}}=A,D={...V,...F},k=X=>{w=!0,p.has(X)&&(L=!0,p.delete(X)),A.needsAnimating[X]=!0;const R=n.getValue(X);R&&(R.liveStyle=!1)};for(const X in D){const R=F[X],O=V[X];if(g.hasOwnProperty(X))continue;let H=!1;Vo(R)&&Vo(O)?H=!Qf(R,O)||_:H=R!==O,H?R!=null?k(X):p.add(X):R!==void 0&&p.has(X)?k(X):A.protectedKeys[X]=!0}A.prevProp=S,A.prevResolvedValues=F,A.isActive&&(g={...g,...F}),(i||s)&&n.blockInitialAnimation&&(w=!1);const $=P&&_;w&&(!$||L)&&h.push(...N.map(X=>{const R={type:b};if(typeof X=="string"&&(i||s)&&!$&&n.manuallyAnimateOnMount&&n.parent){const{parent:O}=n,H=Mi(O,X);if(O.enteringChildren&&H){const{delayChildren:re}=H.transition||{};R.delay=yf(O.enteringChildren,n,re)}}return{animation:X,options:R}}))}if(p.size){const f={};if(typeof u.initial!="boolean"){const b=Mi(n,Array.isArray(u.initial)?u.initial[0]:u.initial);b&&b.transition&&(f.transition=b.transition)}p.forEach(b=>{const A=n.getBaseTarget(b),S=n.getValue(b);S&&(S.liveStyle=!0),f[b]=A??null}),h.push({animation:f})}let m=!!h.length;return i&&(u.initial===!1||u.initial===u.animate)&&!n.manuallyAnimateOnMount&&(m=!1),i=!1,s=!1,m?e(h):Promise.resolve()}function c(l,u){if(t[l].isActive===u)return Promise.resolve();n.variantChildren?.forEach(h=>h.animationState?.setActive(l,u)),t[l].isActive=u;const d=o(l);for(const h in t)t[h].protectedKeys={};return d}return{animateChanges:o,setActive:c,setAnimateFunction:a,getState:()=>t,reset:()=>{t=Tu(),s=!0}}}function Cv(n,e){return typeof e=="string"?e!==n:Array.isArray(e)?!Qf(e,n):!1}function oi(n=!1){return{isActive:n,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Tu(){return{animate:oi(!0),whileInView:oi(),whileHover:oi(),whileTap:oi(),whileDrag:oi(),whileFocus:oi(),exit:oi()}}function $o(n,e){n.min=e.min,n.max=e.max}function rn(n,e){$o(n.x,e.x),$o(n.y,e.y)}function Au(n,e){n.translate=e.translate,n.scale=e.scale,n.originPoint=e.originPoint,n.origin=e.origin}const ep=1e-4,Pv=1-ep,Lv=1+ep,tp=.01,Dv=0-tp,Nv=0+tp;function Vt(n){return n.max-n.min}function Iv(n,e,t){return Math.abs(n-e)<=t}function wu(n,e,t,i=.5){n.origin=i,n.originPoint=at(e.min,e.max,n.origin),n.scale=Vt(t)/Vt(e),n.translate=at(t.min,t.max,n.origin)-n.originPoint,(n.scale>=Pv&&n.scale<=Lv||isNaN(n.scale))&&(n.scale=1),(n.translate>=Dv&&n.translate<=Nv||isNaN(n.translate))&&(n.translate=0)}function Ps(n,e,t,i){wu(n.x,e.x,t.x,i?i.originX:void 0),wu(n.y,e.y,t.y,i?i.originY:void 0)}function Ru(n,e,t,i=0){const s=i?at(t.min,t.max,i):t.min;n.min=s+e.min,n.max=n.min+Vt(e)}function Uv(n,e,t,i){Ru(n.x,e.x,t.x,i?.x),Ru(n.y,e.y,t.y,i?.y)}function Cu(n,e,t,i=0){const s=i?at(t.min,t.max,i):t.min;n.min=e.min-s,n.max=n.min+Vt(e)}function ta(n,e,t,i){Cu(n.x,e.x,t.x,i?.x),Cu(n.y,e.y,t.y,i?.y)}function Pu(n,e,t,i,s){return n-=e,n=ea(n,1/t,i),s!==void 0&&(n=ea(n,1/s,i)),n}function Fv(n,e=0,t=1,i=.5,s,r=n,a=n){if(Tn.test(e)&&(e=parseFloat(e),e=at(a.min,a.max,e/100)-a.min),typeof e!="number")return;let o=at(r.min,r.max,i);n===r&&(o-=e),n.min=Pu(n.min,e,t,o,s),n.max=Pu(n.max,e,t,o,s)}function Lu(n,e,[t,i,s],r,a){Fv(n,e[t],e[i],e[s],e.scale,r,a)}const Ov=["x","scaleX","originX"],Bv=["y","scaleY","originY"];function Du(n,e,t,i){Lu(n.x,e,Ov,t?t.x:void 0,i?i.x:void 0),Lu(n.y,e,Bv,t?t.y:void 0,i?i.y:void 0)}function Nu(n){return n.translate===0&&n.scale===1}function np(n){return Nu(n.x)&&Nu(n.y)}function Iu(n,e){return n.min===e.min&&n.max===e.max}function Vv(n,e){return Iu(n.x,e.x)&&Iu(n.y,e.y)}function Uu(n,e){return Math.round(n.min)===Math.round(e.min)&&Math.round(n.max)===Math.round(e.max)}function ip(n,e){return Uu(n.x,e.x)&&Uu(n.y,e.y)}function Fu(n){return Vt(n.x)/Vt(n.y)}function Ou(n,e){return n.translate===e.translate&&n.scale===e.scale&&n.originPoint===e.originPoint}function yn(n){return[n("x"),n("y")]}function kv(n,e,t){let i="";const s=n.x.translate/e.x,r=n.y.translate/e.y,a=t?.z||0;if((s||r||a)&&(i=`translate3d(${s}px, ${r}px, ${a}px) `),(e.x!==1||e.y!==1)&&(i+=`scale(${1/e.x}, ${1/e.y}) `),t){const{transformPerspective:l,rotate:u,pathRotation:d,rotateX:h,rotateY:p,skewX:g,skewY:y}=t;l&&(i=`perspective(${l}px) ${i}`),u&&(i+=`rotate(${u}deg) `),d&&(i+=`rotate(${d}deg) `),h&&(i+=`rotateX(${h}deg) `),p&&(i+=`rotateY(${p}deg) `),g&&(i+=`skewX(${g}deg) `),y&&(i+=`skewY(${y}deg) `)}const o=n.x.scale*e.x,c=n.y.scale*e.y;return(o!==1||c!==1)&&(i+=`scale(${o}, ${c})`),i||"none"}const zv=oc.length,Bu=n=>typeof n=="string"?parseFloat(n):n,Vu=n=>typeof n=="number"||Me.test(n);function Hv(n,e,t,i,s,r){s?(n.opacity=at(0,t.opacity??1,Gv(i)),n.opacityExit=at(e.opacity??1,0,Wv(i))):r&&(n.opacity=at(e.opacity??1,t.opacity??1,i));for(let a=0;a<zv;a++){const o=oc[a];let c=ku(e,o),l=ku(t,o);if(c===void 0&&l===void 0)continue;c||(c=0),l||(l=0),c===0||l===0||Vu(c)===Vu(l)?(n[o]=Math.max(at(Bu(c),Bu(l),i),0),(Tn.test(l)||Tn.test(c))&&(n[o]+="%")):n[o]=l}(e.rotate||t.rotate)&&(n.rotate=at(e.rotate||0,t.rotate||0,i))}function ku(n,e){return n[e]!==void 0?n[e]:n.borderRadius}const Gv=sp(0,.5,jd),Wv=sp(.5,.95,Ht);function sp(n,e,t){return i=>i<n?0:i>e?1:t(ns(n,e,i))}function Xv(n,e,t){const i=Et(n)?n:hn(n);return i.start(sc("",i,e,t)),i.animation}function Bs(n,e,t,i={passive:!0}){return n.addEventListener(e,t,i),()=>n.removeEventListener(e,t,i)}const jv=(n,e)=>n.depth-e.depth;class Yv{constructor(){this.children=[],this.isDirty=!1}add(e){Hl(this.children,e),this.isDirty=!0}remove(e){Yr(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(jv),this.isDirty=!1,this.children.forEach(e)}}function qv(n,e){const t=Bt.now(),i=({timestamp:s})=>{const r=s-t;r>=e&&(tn(i),n(r-e))};return qe.setup(i,!0),()=>tn(i)}function Br(n){return Et(n)?n.get():n}class $v{constructor(){this.members=[]}add(e){Hl(this.members,e);for(let t=this.members.length-1;t>=0;t--){const i=this.members[t];if(i===e||i===this.lead||i===this.prevLead)continue;const s=i.instance;(!s||s.isConnected===!1)&&!i.snapshot&&(Yr(this.members,i),i.unmount())}e.scheduleRender()}remove(e){if(Yr(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const t=this.members[this.members.length-1];t&&this.promote(t)}}relegate(e){for(let t=this.members.indexOf(e)-1;t>=0;t--){const i=this.members[t];if(i.isPresent!==!1&&i.instance?.isConnected!==!1)return this.promote(i),!0}return!1}promote(e,t){const i=this.lead;if(e!==i&&(this.prevLead=i,this.lead=e,e.show(),i)){i.updateSnapshot(),e.scheduleRender();const{layoutDependency:s}=i.options,{layoutDependency:r}=e.options;(s===void 0||s!==r)&&(e.resumeFrom=i,t&&(i.preserveOpacity=!0),i.snapshot&&(e.snapshot=i.snapshot,e.snapshot.latestValues=i.animationValues||i.latestValues),e.root?.isUpdating&&(e.isLayoutDirty=!0)),e.options.crossfade===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(e=>{e.options.onExitComplete?.(),e.resumingFrom?.options.onExitComplete?.()})}scheduleRender(){this.members.forEach(e=>e.instance&&e.scheduleRender(!1))}removeLeadSnapshot(){this.lead?.snapshot&&(this.lead.snapshot=void 0)}}const Vr={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Ua=["","X","Y","Z"],Kv=1e3;let Zv=0;function Fa(n,e,t,i){const{latestValues:s}=e;s[n]&&(t[n]=s[n],e.setStaticValue(n,0),i&&(i[n]=0))}function rp(n){if(n.hasCheckedOptimisedAppear=!0,n.root===n)return;const{visualElement:e}=n.options;if(!e)return;const t=Tf(e);if(window.MotionHasOptimisedAnimation(t,"transform")){const{layout:s,layoutId:r}=n.options;window.MotionCancelOptimisedAnimation(t,"transform",qe,!(s||r))}const{parent:i}=n;i&&!i.hasCheckedOptimisedAppear&&rp(i)}function ap({attachResizeListener:n,defaultParent:e,measureScroll:t,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(a={},o=e?.()){this.id=Zv++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(ex),this.nodes.forEach(ax),this.nodes.forEach(ox),this.nodes.forEach(tx)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=a,this.root=o?o.root||o:this,this.path=o?[...o.path,o]:[],this.parent=o,this.depth=o?o.depth+1:0;for(let c=0;c<this.path.length;c++)this.path[c].shouldResetTransform=!0;this.root===this&&(this.nodes=new Yv)}addEventListener(a,o){return this.eventHandlers.has(a)||this.eventHandlers.set(a,new Gl),this.eventHandlers.get(a).add(o)}notifyListeners(a,...o){const c=this.eventHandlers.get(a);c&&c.notify(...o)}hasListeners(a){return this.eventHandlers.has(a)}mount(a){if(this.instance)return;this.isSVG=cc(a)&&!J0(a),this.instance=a;const{layoutId:o,layout:c,visualElement:l}=this.options;if(l&&!l.current&&l.mount(a),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(c||o)&&(this.isLayoutDirty=!0),n){let u,d=0;const h=()=>this.root.updateBlockedByResize=!1;qe.read(()=>{d=window.innerWidth}),n(a,()=>{const p=window.innerWidth;p!==d&&(d=p,this.root.updateBlockedByResize=!0,u&&u(),u=qv(h,250),Vr.hasAnimatedSinceResize&&(Vr.hasAnimatedSinceResize=!1,this.nodes.forEach(Gu)))})}o&&this.root.registerSharedNode(o,this),this.options.animate!==!1&&l&&(o||c)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:d,hasRelativeLayoutChanged:h,layout:p})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||l.getDefaultTransition()||dx,{onLayoutAnimationStart:y,onLayoutAnimationComplete:m}=l.getProps(),f=!this.targetLayout||!ip(this.targetLayout,p),b=!d&&h;if(this.options.layoutRoot||this.resumeFrom||b||d&&(f||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const A={...ic(g,"layout"),onPlay:y,onComplete:m};(l.shouldReduceMotion||this.options.layoutRoot)&&(A.delay=0,A.type=!1),this.startAnimation(A),this.setAnimationOrigin(u,b,A.path)}else d||Gu(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=p})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const a=this.getStack();a&&a.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),tn(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(lx),this.animationId++)}getTransformTemplate(){const{visualElement:a}=this.options;return a&&a.getProps().transformTemplate}willUpdate(a=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&rp(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const d=this.path[u];d.shouldResetTransform=!0,(typeof d.latestValues.x=="string"||typeof d.latestValues.y=="string")&&(d.isLayoutDirty=!0),d.updateScroll("snapshot"),d.options.layoutRoot&&d.willUpdate(!1)}const{layoutId:o,layout:c}=this.options;if(o===void 0&&!c)return;const l=this.getTransformTemplate();this.prevTransformTemplateValue=l?l(this.latestValues,""):void 0,this.updateSnapshot(),a&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const c=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),c&&this.nodes.forEach(ix),this.nodes.forEach(zu);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Hu);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(sx),this.nodes.forEach(rx),this.nodes.forEach(Jv),this.nodes.forEach(Qv)):this.nodes.forEach(Hu),this.clearAllSnapshots();const o=Bt.now();Rt.delta=mn(0,1e3/60,o-Rt.timestamp),Rt.timestamp=o,Rt.isProcessing=!0,Aa.update.process(Rt),Aa.preRender.process(Rt),Aa.render.process(Rt),Rt.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ss.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(nx),this.sharedNodes.forEach(cx)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,qe.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){qe.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!Vt(this.snapshot.measuredBox.x)&&!Vt(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let c=0;c<this.path.length;c++)this.path[c].updateScroll();const a=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=Mt()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:o}=this.options;o&&o.notify("LayoutMeasure",this.layout.layoutBox,a?a.layoutBox:void 0)}updateScroll(a="measure"){let o=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===a&&(o=!1),o&&this.instance){const c=i(this.instance);this.scroll={animationId:this.root.animationId,phase:a,isRoot:c,offset:t(this.instance),wasRoot:this.scroll?this.scroll.isRoot:c}}}resetTransform(){if(!s)return;const a=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,o=this.projectionDelta&&!np(this.projectionDelta),c=this.getTransformTemplate(),l=c?c(this.latestValues,""):void 0,u=l!==this.prevTransformTemplateValue;a&&this.instance&&(o||mi(this.latestValues)||u)&&(s(this.instance,l),this.shouldResetTransform=!1,this.scheduleRender())}measure(a=!0){const o=this.measurePageBox();let c=this.removeElementScroll(o);return a&&(c=this.removeTransform(c)),fx(c),{animationId:this.root.animationId,measuredBox:o,layoutBox:c,latestValues:{},source:this.id}}measurePageBox(){const{visualElement:a}=this.options;if(!a)return Mt();const o=a.measureViewportBox();if(!(this.scroll?.wasRoot||this.path.some(px))){const{scroll:l}=this.root;l&&(Sn(o.x,l.offset.x),Sn(o.y,l.offset.y))}return o}removeElementScroll(a){const o=Mt();if(rn(o,a),this.scroll?.wasRoot)return o;for(let c=0;c<this.path.length;c++){const l=this.path[c],{scroll:u,options:d}=l;l!==this.root&&u&&d.layoutScroll&&(u.wasRoot&&rn(o,a),Sn(o.x,u.offset.x),Sn(o.y,u.offset.y))}return o}applyTransform(a,o=!1,c){const l=c||Mt();rn(l,a);for(let u=0;u<this.path.length;u++){const d=this.path[u];!o&&d.options.layoutScroll&&d.scroll&&d!==d.root&&(Sn(l.x,-d.scroll.offset.x),Sn(l.y,-d.scroll.offset.y)),mi(d.latestValues)&&Or(l,d.latestValues,d.layout?.layoutBox)}return mi(this.latestValues)&&Or(l,this.latestValues,this.layout?.layoutBox),l}removeTransform(a){const o=Mt();rn(o,a);for(let c=0;c<this.path.length;c++){const l=this.path[c];if(!mi(l.latestValues))continue;let u;l.instance&&(jo(l.latestValues)&&l.updateSnapshot(),u=Mt(),rn(u,l.measurePageBox())),Du(o,l.latestValues,l.snapshot?.layoutBox,u)}return mi(this.latestValues)&&Du(o,this.latestValues),o}setTargetDelta(a){this.targetDelta=a,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(a){this.options={...this.options,...a,crossfade:a.crossfade!==void 0?a.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Rt.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(a=!1){const o=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=o.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=o.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=o.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==o;if(!(a||c&&this.isSharedProjectionDirty||this.isProjectionDirty||this.parent?.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:d}=this.options;if(!this.layout||!(u||d))return;this.resolvedRelativeTargetAt=Rt.timestamp;const h=this.getClosestProjectingParent();h&&this.linkedParentVersion!==h.layoutVersion&&!h.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&h&&h.layout?this.createRelativeTarget(h,this.layout.layoutBox,h.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=Mt(),this.targetWithTransforms=Mt()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Uv(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):rn(this.target,this.layout.layoutBox),Wf(this.target,this.targetDelta)):rn(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&h&&!!h.resumingFrom==!!this.resumingFrom&&!h.options.layoutScroll&&h.target&&this.animationProgress!==1?this.createRelativeTarget(h,this.target,h.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||jo(this.parent.latestValues)||Gf(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(a,o,c){this.relativeParent=a,this.linkedParentVersion=a.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Mt(),this.relativeTargetOrigin=Mt(),ta(this.relativeTargetOrigin,o,c,this.options.layoutAnchor||void 0),rn(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){const a=this.getLead(),o=!!this.resumingFrom||this!==a;let c=!0;if((this.isProjectionDirty||this.parent?.isProjectionDirty)&&(c=!1),o&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===Rt.timestamp&&(c=!1),c)return;const{layout:l,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(l||u))return;rn(this.layoutCorrected,this.layout.layoutBox);const d=this.treeScale.x,h=this.treeScale.y;uv(this.layoutCorrected,this.treeScale,this.path,o),a.layout&&!a.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(a.target=a.layout.layoutBox,a.targetWithTransforms=Mt());const{target:p}=a;if(!p){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Au(this.prevProjectionDelta.x,this.projectionDelta.x),Au(this.prevProjectionDelta.y,this.projectionDelta.y)),Ps(this.projectionDelta,this.layoutCorrected,p,this.latestValues),(this.treeScale.x!==d||this.treeScale.y!==h||!Ou(this.projectionDelta.x,this.prevProjectionDelta.x)||!Ou(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",p))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(a=!0){if(this.options.visualElement?.scheduleRender(),a){const o=this.getStack();o&&o.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Ki(),this.projectionDelta=Ki(),this.projectionDeltaWithTransform=Ki()}setAnimationOrigin(a,o=!1,c){const l=this.snapshot,u=l?l.latestValues:{},d={...this.latestValues},h=Ki();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!o;const p=Mt(),g=l?l.source:void 0,y=this.layout?this.layout.source:void 0,m=g!==y,f=this.getStack(),b=!f||f.members.length<=1,A=!!(m&&!b&&this.options.crossfade===!0&&!this.path.some(hx));this.animationProgress=0;let S;const T=c?.interpolateProjection(a);this.mixTargetDelta=M=>{const P=M/1e3,_=T?.(P);_?(h.x.translate=_.x,h.x.scale=at(a.x.scale,1,P),h.x.origin=a.x.origin,h.x.originPoint=a.x.originPoint,h.y.translate=_.y,h.y.scale=at(a.y.scale,1,P),h.y.origin=a.y.origin,h.y.originPoint=a.y.originPoint):(Wu(h.x,a.x,P),Wu(h.y,a.y,P)),this.setTargetDelta(h),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(ta(p,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),ux(this.relativeTarget,this.relativeTargetOrigin,p,P),S&&Vv(this.relativeTarget,S)&&(this.isProjectionDirty=!1),S||(S=Mt()),rn(S,this.relativeTarget)),m&&(this.animationValues=d,Hv(d,u,this.latestValues,P,A,b)),_&&_.rotate!==void 0&&(this.animationValues||(this.animationValues=d),this.animationValues.pathRotation=_.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=P},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(a){this.notifyListeners("animationStart"),this.currentAnimation?.stop(),this.resumingFrom?.currentAnimation?.stop(),this.pendingAnimation&&(tn(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=qe.update(()=>{Vr.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=hn(0)),this.motionValue.jump(0,!1),this.currentAnimation=Xv(this.motionValue,[0,1e3],{...a,velocity:0,isSync:!0,onUpdate:o=>{this.mixTargetDelta(o),a.onUpdate&&a.onUpdate(o)},onComplete:()=>{a.onComplete&&a.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const a=this.getStack();a&&a.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(Kv),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const a=this.getLead();let{targetWithTransforms:o,target:c,layout:l,latestValues:u}=a;if(!(!o||!c||!l)){if(this!==a&&this.layout&&l&&op(this.options.animationType,this.layout.layoutBox,l.layoutBox)){c=this.target||Mt();const d=Vt(this.layout.layoutBox.x);c.x.min=a.target.x.min,c.x.max=c.x.min+d;const h=Vt(this.layout.layoutBox.y);c.y.min=a.target.y.min,c.y.max=c.y.min+h}rn(o,c),Or(o,u),Ps(this.projectionDeltaWithTransform,this.layoutCorrected,o,u)}}registerSharedNode(a,o){this.sharedNodes.has(a)||this.sharedNodes.set(a,new $v),this.sharedNodes.get(a).add(o);const l=o.options.initialPromotionConfig;o.promote({transition:l?l.transition:void 0,preserveFollowOpacity:l&&l.shouldPreserveFollowOpacity?l.shouldPreserveFollowOpacity(o):void 0})}isLead(){const a=this.getStack();return a?a.lead===this:!0}getLead(){const{layoutId:a}=this.options;return a?this.getStack()?.lead||this:this}getPrevLead(){const{layoutId:a}=this.options;return a?this.getStack()?.prevLead:void 0}getStack(){const{layoutId:a}=this.options;if(a)return this.root.sharedNodes.get(a)}promote({needsReset:a,transition:o,preserveFollowOpacity:c}={}){const l=this.getStack();l&&l.promote(this,c),a&&(this.projectionDelta=void 0,this.needsReset=!0),o&&this.setOptions({transition:o})}relegate(){const a=this.getStack();return a?a.relegate(this):!1}resetSkewAndRotation(){const{visualElement:a}=this.options;if(!a)return;let o=!1;const{latestValues:c}=a;if((c.z||c.rotate||c.rotateX||c.rotateY||c.rotateZ||c.skewX||c.skewY)&&(o=!0),!o)return;const l={};c.z&&Fa("z",a,l,this.animationValues);for(let u=0;u<Ua.length;u++)Fa(`rotate${Ua[u]}`,a,l,this.animationValues),Fa(`skew${Ua[u]}`,a,l,this.animationValues);a.render();for(const u in l)a.setStaticValue(u,l[u]),this.animationValues&&(this.animationValues[u]=l[u]);a.scheduleRender()}applyProjectionStyles(a,o){if(!this.instance||this.isSVG)return;if(!this.isVisible){a.visibility="hidden";return}const c=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,a.visibility="",a.opacity="",a.pointerEvents=Br(o?.pointerEvents)||"",a.transform=c?c(this.latestValues,""):"none";return}const l=this.getLead();if(!this.projectionDelta||!this.layout||!l.target){this.options.layoutId&&(a.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,a.pointerEvents=Br(o?.pointerEvents)||""),this.hasProjected&&!mi(this.latestValues)&&(a.transform=c?c({},""):"none",this.hasProjected=!1);return}a.visibility="";const u=l.animationValues||l.latestValues;this.applyTransformsToTarget();let d=kv(this.projectionDeltaWithTransform,this.treeScale,u);c&&(d=c(u,d)),a.transform=d;const{x:h,y:p}=this.projectionDelta;a.transformOrigin=`${h.origin*100}% ${p.origin*100}% 0`,l.animationValues?a.opacity=l===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:a.opacity=l===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const g in qo){if(u[g]===void 0)continue;const{correct:y,applyTo:m,isCSSVariable:f}=qo[g],b=d==="none"?u[g]:y(u[g],l);if(m){const A=m.length;for(let S=0;S<A;S++)a[m[S]]=b}else f?this.options.visualElement.renderState.vars[g]=b:a[g]=b}this.options.layoutId&&(a.pointerEvents=l===this?Br(o?.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(a=>a.currentAnimation?.stop()),this.root.nodes.forEach(zu),this.root.sharedNodes.clear()}}}function Jv(n){n.updateLayout()}function Qv(n){const e=n.resumeFrom?.snapshot||n.snapshot;if(n.isLead()&&n.layout&&e&&n.hasListeners("didUpdate")){const{layoutBox:t,measuredBox:i}=n.layout,{animationType:s}=n.options,r=e.source!==n.layout.source;if(s==="size")yn(u=>{const d=r?e.measuredBox[u]:e.layoutBox[u],h=Vt(d);d.min=t[u].min,d.max=d.min+h});else if(s==="x"||s==="y"){const u=s==="x"?"y":"x";$o(r?e.measuredBox[u]:e.layoutBox[u],t[u])}else op(s,e.layoutBox,t)&&yn(u=>{const d=r?e.measuredBox[u]:e.layoutBox[u],h=Vt(t[u]);d.max=d.min+h,n.relativeTarget&&!n.currentAnimation&&(n.isProjectionDirty=!0,n.relativeTarget[u].max=n.relativeTarget[u].min+h)});const a=Ki();Ps(a,t,e.layoutBox);const o=Ki();r?Ps(o,n.applyTransform(i,!0),e.measuredBox):Ps(o,t,e.layoutBox);const c=!np(a);let l=!1;if(!n.resumeFrom){const u=n.getClosestProjectingParent();if(u&&!u.resumeFrom){const{snapshot:d,layout:h}=u;if(d&&h){const p=n.options.layoutAnchor||void 0,g=Mt();ta(g,e.layoutBox,d.layoutBox,p);const y=Mt();ta(y,t,h.layoutBox,p),ip(g,y)||(l=!0),u.options.layoutRoot&&(n.relativeTarget=y,n.relativeTargetOrigin=g,n.relativeParent=u)}}}n.notifyListeners("didUpdate",{layout:t,snapshot:e,delta:o,layoutDelta:a,hasLayoutChanged:c,hasRelativeLayoutChanged:l})}else if(n.isLead()){const{onExitComplete:t}=n.options;t&&t()}n.options.transition=void 0}function ex(n){n.parent&&(n.isProjecting()||(n.isProjectionDirty=n.parent.isProjectionDirty),n.isSharedProjectionDirty||(n.isSharedProjectionDirty=!!(n.isProjectionDirty||n.parent.isProjectionDirty||n.parent.isSharedProjectionDirty)),n.isTransformDirty||(n.isTransformDirty=n.parent.isTransformDirty))}function tx(n){n.isProjectionDirty=n.isSharedProjectionDirty=n.isTransformDirty=!1}function nx(n){n.clearSnapshot()}function zu(n){n.clearMeasurements()}function ix(n){n.isLayoutDirty=!0,n.updateLayout()}function Hu(n){n.isLayoutDirty=!1}function sx(n){n.isAnimationBlocked&&n.layout&&!n.isLayoutDirty&&(n.snapshot=n.layout,n.isLayoutDirty=!0)}function rx(n){const{visualElement:e}=n.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),n.resetTransform()}function Gu(n){n.finishAnimation(),n.targetDelta=n.relativeTarget=n.target=void 0,n.isProjectionDirty=!0}function ax(n){n.resolveTargetDelta()}function ox(n){n.calcProjection()}function lx(n){n.resetSkewAndRotation()}function cx(n){n.removeLeadSnapshot()}function Wu(n,e,t){n.translate=at(e.translate,0,t),n.scale=at(e.scale,1,t),n.origin=e.origin,n.originPoint=e.originPoint}function Xu(n,e,t,i){n.min=at(e.min,t.min,i),n.max=at(e.max,t.max,i)}function ux(n,e,t,i){Xu(n.x,e.x,t.x,i),Xu(n.y,e.y,t.y,i)}function hx(n){return n.animationValues&&n.animationValues.opacityExit!==void 0}const dx={duration:.45,ease:[.4,0,.1,1]},ju=n=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(n),Yu=ju("applewebkit/")&&!ju("chrome/")?Math.round:Ht;function qu(n){n.min=Yu(n.min),n.max=Yu(n.max)}function fx(n){qu(n.x),qu(n.y)}function op(n,e,t){return n==="position"||n==="preserve-aspect"&&!Iv(Fu(e),Fu(t),.2)}function px(n){return n!==n.root&&n.scroll?.wasRoot}const mx=ap({attachResizeListener:(n,e)=>Bs(n,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body?.scrollLeft||0,y:document.documentElement.scrollTop||document.body?.scrollTop||0}),checkIsScrollRoot:()=>!0}),Oa={current:void 0},lp=ap({measureScroll:n=>({x:n.scrollLeft,y:n.scrollTop}),defaultParent:()=>{if(!Oa.current){const n=new mx({});n.mount(window),n.setOptions({layoutScroll:!0}),Oa.current=n}return Oa.current},resetTransform:(n,e)=>{n.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:n=>window.getComputedStyle(n).position==="fixed"}),qs=Z.createContext({transformPagePoint:n=>n,isStatic:!1,reducedMotion:"never"});function $u(n,e){if(typeof n=="function")return n(e);n!=null&&(n.current=e)}function gx(...n){return e=>{let t=!1;const i=n.map(s=>{const r=$u(s,e);return!t&&typeof r=="function"&&(t=!0),r});if(t)return()=>{for(let s=0;s<i.length;s++){const r=i[s];typeof r=="function"?r():$u(n[s],null)}}}}function vx(...n){return Z.useCallback(gx(...n),n)}class xx extends Z.Component{getSnapshotBeforeUpdate(e){const t=this.props.childRef.current;if(Cs(t)&&e.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const i=t.offsetParent,s=Cs(i)&&i.offsetWidth||0,r=Cs(i)&&i.offsetHeight||0,a=getComputedStyle(t),o=this.props.sizeRef.current;o.height=parseFloat(a.height),o.width=parseFloat(a.width),o.top=t.offsetTop,o.left=t.offsetLeft,o.right=s-o.width-o.left,o.bottom=r-o.height-o.top,o.direction=a.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function _x({children:n,isPresent:e,anchorX:t,anchorY:i,root:s,pop:r}){const a=Z.useId(),o=Z.useRef(null),c=Z.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:l}=Z.useContext(qs),u=r!==!1?n.props?.ref??n?.ref:void 0,d=vx(o,u);return Z.useInsertionEffect(()=>{const{width:h,height:p,top:g,left:y,right:m,bottom:f,direction:b}=c.current;if(e||r===!1||!o.current||!h||!p)return;const A=b==="rtl",S=t==="left"?A?`right: ${m}`:`left: ${y}`:A?`left: ${y}`:`right: ${m}`,T=i==="bottom"?`bottom: ${f}`:`top: ${g}`;o.current.dataset.motionPopId=a;const M=document.createElement("style");l&&(M.nonce=l);const P=s??document.head;return P.appendChild(M),M.sheet&&M.sheet.insertRule(`
          [data-motion-pop-id="${a}"] {
            position: absolute !important;
            width: ${h}px !important;
            height: ${p}px !important;
            ${S}px !important;
            ${T}px !important;
          }
        `),()=>{o.current?.removeAttribute("data-motion-pop-id"),P.contains(M)&&P.removeChild(M)}},[e]),v.jsx(xx,{isPresent:e,childRef:o,sizeRef:c,pop:r,children:r===!1?n:Z.cloneElement(n,{ref:d})})}const yx=({children:n,initial:e,isPresent:t,onExitComplete:i,custom:s,presenceAffectsLayout:r,mode:a,anchorX:o,anchorY:c,root:l})=>{const u=ni(Sx),d=Z.useId(),h=Z.useRef(t),p=Z.useRef(i);Ws(()=>{h.current=t,p.current=i});let g=!0,y=Z.useMemo(()=>(g=!1,{id:d,initial:e,isPresent:t,custom:s,onExitComplete:m=>{u.set(m,!0);for(const f of u.values())if(!f)return;i&&i()},register:m=>(u.set(m,!1),()=>{u.delete(m),!h.current&&!u.size&&p.current?.()})}),[t,u,i]);return r&&g&&(y={...y}),Z.useMemo(()=>{u.forEach((m,f)=>u.set(f,!1))},[t]),Z.useEffect(()=>{!t&&!u.size&&i&&i()},[t]),n=v.jsx(_x,{pop:a==="popLayout",isPresent:t,anchorX:o,anchorY:c,root:l,children:n}),v.jsx(fa.Provider,{value:y,children:n})};function Sx(){return new Map}function cp(n=!0){const e=Z.useContext(fa);if(e===null)return[!0,null];const{isPresent:t,onExitComplete:i,register:s}=e,r=Z.useId();Z.useEffect(()=>{if(n)return s(r)},[n]);const a=Z.useCallback(()=>n&&i&&i(r),[r,i,n]);return!t&&i?[!1,a]:[!0]}const ir=n=>n.key||"";function Ku(n){const e=[];return Z.Children.forEach(n,t=>{Z.isValidElement(t)&&e.push(t)}),e}const Jn=({children:n,custom:e,initial:t=!0,onExitComplete:i,presenceAffectsLayout:s=!0,mode:r="sync",propagate:a=!1,anchorX:o="left",anchorY:c="top",root:l})=>{const[u,d]=cp(a),h=Z.useMemo(()=>Ku(n),[n]),p=a&&!u?[]:h.map(ir),g=Z.useRef(!0),y=Z.useRef(h),m=ni(()=>new Map),f=Z.useRef(new Set),[b,A]=Z.useState(h),[S,T]=Z.useState(h);Ws(()=>{g.current=!1,y.current=h;for(let _=0;_<S.length;_++){const w=ir(S[_]);p.includes(w)?(m.delete(w),f.current.delete(w)):m.get(w)!==!0&&m.set(w,!1)}},[S,p.length,p.join("-")]);const M=[];if(h!==b){let _=[...h];for(let w=0;w<S.length;w++){const L=S[w],N=ir(L);p.includes(N)||(_.splice(w,0,L),M.push(L))}return r==="wait"&&M.length&&(_=M),T(Ku(_)),A(h),null}const{forceRender:P}=Z.useContext(zl);return v.jsx(v.Fragment,{children:S.map(_=>{const w=ir(_),L=a&&!u?!1:h===S||p.includes(w),N=()=>{if(f.current.has(w))return;if(m.has(w))f.current.add(w),m.set(w,!0);else return;let F=!0;m.forEach(V=>{V||(F=!1)}),F&&(P?.(),T(y.current),a&&d?.(),i&&i())};return v.jsx(yx,{isPresent:L,initial:!g.current||t?void 0:!1,custom:e,presenceAffectsLayout:s,mode:r,root:l,onExitComplete:L?void 0:N,anchorX:o,anchorY:c,children:_},w)})})},up=Z.createContext({strict:!1}),Zu={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Ju=!1;function Mx(){if(Ju)return;const n={};for(const e in Zu)n[e]={isEnabled:t=>Zu[e].some(i=>!!t[i])};kf(n),Ju=!0}function hp(){return Mx(),av()}function Ex(n){const e=hp();for(const t in n)e[t]={...e[t],...n[t]};kf(e)}const bx=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function na(n){return n.startsWith("while")||n.startsWith("drag")&&n!=="draggable"||n.startsWith("layout")||n.startsWith("onTap")||n.startsWith("onPan")||n.startsWith("onLayout")||bx.has(n)}let dp=n=>!na(n);function Tx(n){typeof n=="function"&&(dp=e=>e.startsWith("on")?!na(e):n(e))}try{Tx(require("@emotion/is-prop-valid").default)}catch{}function Ax(n,e,t){const i={};for(const s in n)s==="values"&&typeof n.values=="object"||Et(n[s])||(dp(s)||t===!0&&na(s)||!e&&!na(s)||n.draggable&&s.startsWith("onDrag"))&&(i[s]=n[s]);return i}const xa=Z.createContext({});function wx(n,e){if(va(n)){const{initial:t,animate:i}=n;return{initial:t===!1||Os(t)?t:void 0,animate:Os(i)?i:void 0}}return n.inherit!==!1?e:{}}function Rx(n){const{initial:e,animate:t}=wx(n,Z.useContext(xa));return Z.useMemo(()=>({initial:e,animate:t}),[Qu(e),Qu(t)])}function Qu(n){return Array.isArray(n)?n.join(" "):n}const mc=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function fp(n,e,t){for(const i in e)!Et(e[i])&&!Yf(i,t)&&(n[i]=e[i])}function Cx({transformTemplate:n},e){return Z.useMemo(()=>{const t=mc();return fc(t,e,n),Object.assign({},t.vars,t.style)},[e])}function Px(n,e){const t=n.style||{},i={};return fp(i,t,n),Object.assign(i,Cx(n,e)),i}function Lx(n,e){const t={},i=Px(n,e);return n.drag&&n.dragListener!==!1&&(t.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=n.drag===!0?"none":`pan-${n.drag==="x"?"y":"x"}`),n.tabIndex===void 0&&(n.onTap||n.onTapStart||n.whileTap)&&(t.tabIndex=0),t.style=i,t}const pp=()=>({...mc(),attrs:{}});function Dx(n,e,t,i){const s=Z.useMemo(()=>{const r=pp();return qf(r,e,Kf(i),n.transformTemplate,n.style),{...r.attrs,style:{...r.style}}},[e]);if(n.style){const r={};fp(r,n.style,n),s.style={...r,...s.style}}return s}const Nx=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function gc(n){return typeof n!="string"||n.includes("-")?!1:!!(Nx.indexOf(n)>-1||/[A-Z]/u.test(n))}function Ix(n,e,t,{latestValues:i},s,r=!1,a){const c=(a??gc(n)?Dx:Lx)(e,i,s,n),l=Ax(e,typeof n=="string",r),u=n!==Z.Fragment?{...l,...c,ref:t}:{},{children:d}=e,h=Z.useMemo(()=>Et(d)?d.get():d,[d]);return Z.createElement(n,{...u,children:h})}function Ux({scrapeMotionValuesFromProps:n,createRenderState:e},t,i,s){return{latestValues:Fx(t,i,s,n),renderState:e()}}function Fx(n,e,t,i){const s={},r=i(n,{});for(const h in r)s[h]=Br(r[h]);let{initial:a,animate:o}=n;const c=va(n),l=Bf(n);e&&l&&!c&&n.inherit!==!1&&(a===void 0&&(a=e.initial),o===void 0&&(o=e.animate));let u=t?t.initial===!1:!1;u=u||a===!1;const d=u?o:a;if(d&&typeof d!="boolean"&&!ga(d)){const h=Array.isArray(d)?d:[d];for(let p=0;p<h.length;p++){const g=rc(n,h[p]);if(g){const{transitionEnd:y,transition:m,...f}=g;for(const b in f){let A=f[b];if(Array.isArray(A)){const S=u?A.length-1:0;A=A[S]}A!==null&&(s[b]=A)}for(const b in y)s[b]=y[b]}}}return s}const mp=n=>(e,t)=>{const i=Z.useContext(xa),s=Z.useContext(fa),r=()=>Ux(n,e,i,s);return t?r():ni(r)},Ox=mp({scrapeMotionValuesFromProps:pc,createRenderState:mc}),Bx=mp({scrapeMotionValuesFromProps:Zf,createRenderState:pp}),Vx=Symbol.for("motionComponentSymbol");function kx(n,e,t){const i=Z.useRef(t);Z.useInsertionEffect(()=>{i.current=t});const s=Z.useRef(null);return Z.useCallback(r=>{r&&n.onMount?.(r),e&&(r?e.mount(r):e.unmount());const a=i.current;if(typeof a=="function")if(r){const o=a(r);typeof o=="function"&&(s.current=o)}else s.current?(s.current(),s.current=null):a(r);else a&&(a.current=r)},[e])}const gp=Z.createContext({});function Wi(n){return n&&typeof n=="object"&&Object.prototype.hasOwnProperty.call(n,"current")}function zx(n,e,t,i,s,r){const{visualElement:a}=Z.useContext(xa),o=Z.useContext(up),c=Z.useContext(fa),l=Z.useContext(qs),u=l.reducedMotion,d=l.skipAnimations,h=Z.useRef(null),p=Z.useRef(!1);i=i||o.renderer,!h.current&&i&&(h.current=i(n,{visualState:e,parent:a,props:t,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u,skipAnimations:d,isSVG:r}),p.current&&h.current&&(h.current.manuallyAnimateOnMount=!0));const g=h.current,y=Z.useContext(gp);g&&!g.projection&&s&&(g.type==="html"||g.type==="svg")&&Hx(h.current,t,s,y);const m=Z.useRef(!1);Z.useInsertionEffect(()=>{g&&m.current&&g.update(t,c)});const f=t[bf],b=Z.useRef(!!f&&typeof window<"u"&&!window.MotionHandoffIsComplete?.(f)&&window.MotionHasOptimisedAnimation?.(f));return Ws(()=>{p.current=!0,g&&(m.current=!0,window.MotionIsMounted=!0,g.updateFeatures(),g.scheduleRenderMicrotask(),b.current&&g.animationState&&g.animationState.animateChanges())}),Z.useEffect(()=>{g&&(!b.current&&g.animationState&&g.animationState.animateChanges(),b.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(f)}),b.current=!1),g.enteringChildren=void 0)}),g}function Hx(n,e,t,i){const{layoutId:s,layout:r,drag:a,dragConstraints:o,layoutScroll:c,layoutRoot:l,layoutAnchor:u,layoutCrossfade:d}=e;n.projection=new t(n.latestValues,e["data-framer-portal-id"]?void 0:vp(n.parent)),n.projection.setOptions({layoutId:s,layout:r,alwaysMeasureLayout:!!a||o&&Wi(o),visualElement:n,animationType:typeof r=="string"?r:"both",initialPromotionConfig:i,crossfade:d,layoutScroll:c,layoutRoot:l,layoutAnchor:u})}function vp(n){if(n)return n.options.allowProjection!==!1?n.projection:vp(n.parent)}function Ba(n,{forwardMotionProps:e=!1,type:t}={},i,s){i&&Ex(i);const r=t?t==="svg":gc(n),a=r?Bx:Ox;function o(l,u){let d;const h={...Z.useContext(qs),...l,layoutId:Gx(l)},{isStatic:p}=h,g=Rx(l),y=a(l,p);if(!p&&typeof window<"u"){Wx();const m=Xx(h);d=m.MeasureLayout,g.visualElement=zx(n,y,h,s,m.ProjectionNode,r)}return v.jsxs(xa.Provider,{value:g,children:[d&&g.visualElement?v.jsx(d,{visualElement:g.visualElement,...h}):null,Ix(n,l,kx(y,g.visualElement,u),y,p,e,r)]})}o.displayName=`motion.${typeof n=="string"?n:`create(${n.displayName??n.name??""})`}`;const c=Z.forwardRef(o);return c[Vx]=n,c}function Gx({layoutId:n}){const e=Z.useContext(zl).id;return e&&n!==void 0?e+"-"+n:n}function Wx(n,e){Z.useContext(up).strict}function Xx(n){const e=hp(),{drag:t,layout:i}=e;if(!t&&!i)return{};const s={...t,...i};return{MeasureLayout:t?.isEnabled(n)||i?.isEnabled(n)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}function jx(n,e){if(typeof Proxy>"u")return Ba;const t=new Map,i=(r,a)=>Ba(r,a,n,e),s=(r,a)=>i(r,a);return new Proxy(s,{get:(r,a)=>a==="create"?i:(t.has(a)||t.set(a,Ba(a,void 0,n,e)),t.get(a))})}const Yx=(n,e)=>e.isSVG??gc(n)?new Ev(e):new vv(e,{allowProjection:n!==Z.Fragment});class qx extends ri{constructor(e){super(e),e.animationState||(e.animationState=Rv(e))}updateAnimationControlsSubscription(){const{animate:e}=this.node.getProps();ga(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:e}=this.node.getProps(),{animate:t}=this.node.prevProps||{};e!==t&&this.updateAnimationControlsSubscription()}unmount(){this.node.animationState.reset(),this.unmountControls?.()}}let $x=0;class Kx extends ri{constructor(){super(...arguments),this.id=$x++,this.isExitComplete=!1}update(){if(!this.node.presenceContext)return;const{isPresent:e,onExitComplete:t}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===i)return;if(e&&i===!1){if(this.isExitComplete){const{initial:r,custom:a}=this.node.getProps();if(typeof r=="string"||typeof r=="object"&&r!==null&&!Array.isArray(r)){const o=Mi(this.node,r,a);if(o){const{transition:c,transitionEnd:l,...u}=o;for(const d in u)this.node.getValue(d)?.jump(u[d])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const s=this.node.animationState.setActive("exit",!e);t&&!e&&s.then(()=>{this.isExitComplete=!0,t(this.id)})}mount(){const{register:e,onExitComplete:t}=this.node.presenceContext||{};t&&t(this.id),e&&(this.unmount=e(this.id))}unmount(){}}const Zx={animation:{Feature:qx},exit:{Feature:Kx}};function $s(n){return{point:{x:n.pageX,y:n.pageY}}}const Jx=n=>e=>lc(e)&&n(e,$s(e));function Ls(n,e,t,i){return Bs(n,e,Jx(t),i)}const xp=({current:n})=>n?n.ownerDocument.defaultView:null,eh=(n,e)=>Math.abs(n-e);function Qx(n,e){const t=eh(n.x,e.x),i=eh(n.y,e.y);return Math.sqrt(t**2+i**2)}const th=new Set(["auto","scroll"]);class _p{constructor(e,t,{transformPagePoint:i,contextWindow:s=window,dragSnapToOrigin:r=!1,distanceThreshold:a=3,element:o}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=g=>{this.handleScroll(g.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=sr(this.lastRawMoveEventInfo,this.transformPagePoint));const g=Va(this.lastMoveEventInfo,this.history),y=this.startEvent!==null,m=Qx(g.offset,{x:0,y:0})>=this.distanceThreshold;if(!y&&!m)return;const{point:f}=g,{timestamp:b}=Rt;this.history.push({...f,timestamp:b});const{onStart:A,onMove:S}=this.handlers;y||(A&&A(this.lastMoveEvent,g),this.startEvent=this.lastMoveEvent),S&&S(this.lastMoveEvent,g)},this.handlePointerMove=(g,y)=>{this.lastMoveEvent=g,this.lastRawMoveEventInfo=y,this.lastMoveEventInfo=sr(y,this.transformPagePoint),qe.update(this.updatePoint,!0)},this.handlePointerUp=(g,y)=>{this.end();const{onEnd:m,onSessionEnd:f,resumeAnimation:b}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&b&&b(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const A=Va(g.type==="pointercancel"?this.lastMoveEventInfo:sr(y,this.transformPagePoint),this.history);this.startEvent&&m&&m(g,A),f&&f(g,A)},!lc(e))return;this.dragSnapToOrigin=r,this.handlers=t,this.transformPagePoint=i,this.distanceThreshold=a,this.contextWindow=s||window;const c=$s(e),l=sr(c,this.transformPagePoint),{point:u}=l,{timestamp:d}=Rt;this.history=[{...u,timestamp:d}];const{onSessionStart:h}=t;h&&h(e,Va(l,this.history));const p={passive:!0,capture:!0};this.removeListeners=Xs(Ls(this.contextWindow,"pointermove",this.handlePointerMove,p),Ls(this.contextWindow,"pointerup",this.handlePointerUp,p),Ls(this.contextWindow,"pointercancel",this.handlePointerUp,p)),o&&this.startScrollTracking(o)}startScrollTracking(e){let t=e.parentElement;for(;t;){const i=getComputedStyle(t);(th.has(i.overflowX)||th.has(i.overflowY))&&this.scrollPositions.set(t,{x:t.scrollLeft,y:t.scrollTop}),t=t.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(e){const t=this.scrollPositions.get(e);if(!t)return;const i=e===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:e.scrollLeft,y:e.scrollTop},r={x:s.x-t.x,y:s.y-t.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(e,s),qe.update(this.updatePoint,!0))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),tn(this.updatePoint)}}function sr(n,e){return e?{point:e(n.point)}:n}function nh(n,e){return{x:n.x-e.x,y:n.y-e.y}}function Va({point:n},e){return{point:n,delta:nh(n,yp(e)),offset:nh(n,e_(e)),velocity:t_(e,.1)}}function e_(n){return n[0]}function yp(n){return n[n.length-1]}function t_(n,e){if(n.length<2)return{x:0,y:0};let t=n.length-1,i=null;const s=yp(n);for(;t>=0&&(i=n[t],!(s.timestamp-i.timestamp>qt(e)));)t--;if(!i)return{x:0,y:0};i===n[0]&&n.length>2&&s.timestamp-i.timestamp>qt(e)*2&&(i=n[1]);const r=en(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const a={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return a.x===1/0&&(a.x=0),a.y===1/0&&(a.y=0),a}function n_(n,{min:e,max:t},i){return e!==void 0&&n<e?n=i?at(e,n,i.min):Math.max(n,e):t!==void 0&&n>t&&(n=i?at(t,n,i.max):Math.min(n,t)),n}function ih(n,e,t){return{min:e!==void 0?n.min+e:void 0,max:t!==void 0?n.max+t-(n.max-n.min):void 0}}function i_(n,{top:e,left:t,bottom:i,right:s}){return{x:ih(n.x,t,s),y:ih(n.y,e,i)}}function sh(n,e){let t=e.min-n.min,i=e.max-n.max;return e.max-e.min<n.max-n.min&&([t,i]=[i,t]),{min:t,max:i}}function s_(n,e){return{x:sh(n.x,e.x),y:sh(n.y,e.y)}}function r_(n,e){let t=.5;const i=Vt(n),s=Vt(e);return s>i?t=ns(e.min,e.max-i,n.min):i>s&&(t=ns(n.min,n.max-s,e.min)),mn(0,1,t)}function a_(n,e){const t={};return e.min!==void 0&&(t.min=e.min-n.min),e.max!==void 0&&(t.max=e.max-n.min),t}const Ko=.35;function o_(n=Ko){return n===!1?n=0:n===!0&&(n=Ko),{x:rh(n,"left","right"),y:rh(n,"top","bottom")}}function rh(n,e,t){return{min:ah(n,e),max:ah(n,t)}}function ah(n,e){return typeof n=="number"?n:n[e]||0}const l_=new WeakMap;class c_{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Mt(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=e}start(e,{snapToCursor:t=!1,distanceThreshold:i}={}){const{presenceContext:s}=this.visualElement;if(s&&s.isPresent===!1)return;const r=d=>{t&&this.snapToCursor($s(d).point),this.stopAnimation()},a=(d,h)=>{const{drag:p,dragPropagation:g,onDragStart:y}=this.getProps();if(p&&!g&&(this.openDragLock&&this.openDragLock(),this.openDragLock=U0(p),!this.openDragLock))return;this.latestPointerEvent=d,this.latestPanInfo=h,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),yn(f=>{let b=this.getAxisMotionValue(f).get()||0;if(Tn.test(b)){const{projection:A}=this.visualElement;if(A&&A.layout){const S=A.layout.layoutBox[f];S&&(b=Vt(S)*(parseFloat(b)/100))}}this.originPoint[f]=b}),y&&qe.update(()=>y(d,h),!1,!0),ko(this.visualElement,"transform");const{animationState:m}=this.visualElement;m&&m.setActive("whileDrag",!0)},o=(d,h)=>{this.latestPointerEvent=d,this.latestPanInfo=h;const{dragPropagation:p,dragDirectionLock:g,onDirectionLock:y,onDrag:m}=this.getProps();if(!p&&!this.openDragLock)return;const{offset:f}=h;if(g&&this.currentDirection===null){this.currentDirection=h_(f),this.currentDirection!==null&&y&&y(this.currentDirection);return}this.updateAxis("x",h.point,f),this.updateAxis("y",h.point,f),this.visualElement.render(),m&&qe.update(()=>m(d,h),!1,!0)},c=(d,h)=>{this.latestPointerEvent=d,this.latestPanInfo=h,this.stop(d,h),this.latestPointerEvent=null,this.latestPanInfo=null},l=()=>{const{dragSnapToOrigin:d}=this.getProps();(d||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:u}=this.getProps();this.panSession=new _p(e,{onSessionStart:r,onStart:a,onMove:o,onSessionEnd:c,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,distanceThreshold:i,contextWindow:xp(this.visualElement),element:this.visualElement.current})}stop(e,t){const i=e||this.latestPointerEvent,s=t||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!s||!i)return;const{velocity:a}=s;this.startAnimation(a);const{onDragEnd:o}=this.getProps();o&&qe.postRender(()=>o(i,s))}cancel(){this.isDragging=!1;const{projection:e,animationState:t}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),t&&t.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(e,t,i){const{drag:s}=this.getProps();if(!i||!rr(e,s,this.currentDirection))return;const r=this.getAxisMotionValue(e);let a=this.originPoint[e]+i[e];this.constraints&&this.constraints[e]&&(a=n_(a,this.constraints[e],this.elastic[e])),r.set(a)}resolveConstraints(){const{dragConstraints:e,dragElastic:t}=this.getProps(),i=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):this.visualElement.projection?.layout,s=this.constraints;e&&Wi(e)?this.constraints||(this.constraints=this.resolveRefConstraints()):e&&i?this.constraints=i_(i.layoutBox,e):this.constraints=!1,this.elastic=o_(t),s!==this.constraints&&!Wi(e)&&i&&this.constraints&&!this.hasMutatedConstraints&&yn(r=>{this.constraints!==!1&&this.getAxisMotionValue(r)&&(this.constraints[r]=a_(i.layoutBox[r],this.constraints[r]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:t}=this.getProps();if(!e||!Wi(e))return!1;const i=e.current,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;s.root&&(s.root.scroll=void 0,s.root.updateScroll());const r=hv(i,s.root,this.visualElement.getTransformPagePoint());let a=s_(s.layout.layoutBox,r);if(t){const o=t(lv(a));this.hasMutatedConstraints=!!o,o&&(a=Hf(o))}return a}startAnimation(e){const{drag:t,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:a,onDragTransitionEnd:o}=this.getProps(),c=this.constraints||{},l=yn(u=>{if(!rr(u,t,this.currentDirection))return;let d=c&&c[u]||{};(a===!0||a===u)&&(d={min:0,max:0});const h=s?200:1e6,p=s?40:1e7,g={type:"inertia",velocity:i?e[u]:0,bounceStiffness:h,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...r,...d};return this.startAxisValueAnimation(u,g)});return Promise.all(l).then(o)}startAxisValueAnimation(e,t){const i=this.getAxisMotionValue(e);return ko(this.visualElement,e),i.start(sc(e,i,0,t,this.visualElement,!1))}stopAnimation(){yn(e=>this.getAxisMotionValue(e).stop())}getAxisMotionValue(e){const t=`_drag${e.toUpperCase()}`,s=this.visualElement.getProps()[t];return s||this.visualElement.getValue(e,this.visualElement.latestValues[e]??0)}snapToCursor(e){yn(t=>{const{drag:i}=this.getProps();if(!rr(t,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(t);if(s&&s.layout){const{min:a,max:o}=s.layout.layoutBox[t],c=r.get()||0;r.set(e[t]-at(a,o,.5)+c)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:t}=this.getProps(),{projection:i}=this.visualElement;if(!Wi(t)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};yn(a=>{const o=this.getAxisMotionValue(a);if(o&&this.constraints!==!1){const c=o.get();s[a]=r_({min:c,max:c},this.constraints[a])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.constraints=!1,this.resolveConstraints(),yn(a=>{if(!rr(a,e,null))return;const o=this.getAxisMotionValue(a),{min:c,max:l}=this.constraints[a];o.set(at(c,l,s[a]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;l_.set(this.visualElement,this);const e=this.visualElement.current,t=Ls(e,"pointerdown",l=>{const{drag:u,dragListener:d=!0}=this.getProps(),h=l.target,p=h!==e&&z0(h);u&&d&&!p&&this.start(l)});let i;const s=()=>{const{dragConstraints:l}=this.getProps();Wi(l)&&l.current&&(this.constraints=this.resolveRefConstraints(),i||(i=u_(e,l.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,a=r.addEventListener("measure",s);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),qe.read(s);const o=Bs(window,"resize",()=>this.scalePositionWithinConstraints()),c=r.addEventListener("didUpdate",(({delta:l,hasLayoutChanged:u})=>{this.isDragging&&u&&(yn(d=>{const h=this.getAxisMotionValue(d);h&&(this.originPoint[d]+=l[d].translate,h.set(h.get()+l[d].translate))}),this.visualElement.render())}));return()=>{o(),t(),a(),c&&c(),i&&i()}}getProps(){const e=this.visualElement.getProps(),{drag:t=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:a=Ko,dragMomentum:o=!0}=e;return{...e,drag:t,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:a,dragMomentum:o}}}function oh(n){let e=!0;return()=>{if(e){e=!1;return}n()}}function u_(n,e,t){const i=Xo(n,oh(t)),s=Xo(e,oh(t));return()=>{i(),s()}}function rr(n,e,t){return(e===!0||e===n)&&(t===null||t===n)}function h_(n,e=10){let t=null;return Math.abs(n.y)>e?t="y":Math.abs(n.x)>e&&(t="x"),t}class d_ extends ri{constructor(e){super(e),this.removeGroupControls=Ht,this.removeListeners=Ht,this.controls=new c_(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Ht}update(){const{dragControls:e}=this.node.getProps(),{dragControls:t}=this.node.prevProps||{};e!==t&&(this.removeGroupControls(),e&&(this.removeGroupControls=e.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const ka=n=>(e,t)=>{n&&qe.update(()=>n(e,t),!1,!0)};class f_ extends ri{constructor(){super(...arguments),this.removePointerDownListener=Ht}onPointerDown(e){this.session=new _p(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:xp(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:t,onPan:i,onPanEnd:s}=this.node.getProps();return{onSessionStart:ka(e),onStart:ka(t),onMove:ka(i),onEnd:(r,a)=>{delete this.session,s&&qe.postRender(()=>s(r,a))}}}mount(){this.removePointerDownListener=Ls(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let za=!1;class p_ extends Z.Component{componentDidMount(){const{visualElement:e,layoutGroup:t,switchLayoutGroup:i,layoutId:s}=this.props,{projection:r}=e;r&&(t.group&&t.group.add(r),i&&i.register&&s&&i.register(r),za&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Vr.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:t,visualElement:i,drag:s,isPresent:r}=this.props,{projection:a}=i;return a&&(a.isPresent=r,e.layoutDependency!==t&&a.setOptions({...a.options,layoutDependency:t}),za=!0,s||e.layoutDependency!==t||t===void 0||e.isPresent!==r?a.willUpdate():this.safeToRemove(),e.isPresent!==r&&(r?a.promote():a.relegate()||qe.postRender(()=>{const o=a.getStack();(!o||!o.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:e,layoutAnchor:t}=this.props,{projection:i}=e;i&&(i.options.layoutAnchor=t,i.root.didUpdate(),ss.postRender(()=>{!i.currentAnimation&&i.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:t,switchLayoutGroup:i}=this.props,{projection:s}=e;za=!0,s&&(s.scheduleCheckAfterUnmount(),t&&t.group&&t.group.remove(s),i&&i.deregister&&i.deregister(s))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Sp(n){const[e,t]=cp(),i=Z.useContext(zl);return v.jsx(p_,{...n,layoutGroup:i,switchLayoutGroup:Z.useContext(gp),isPresent:e,safeToRemove:t})}const m_={pan:{Feature:f_},drag:{Feature:d_,ProjectionNode:lp,MeasureLayout:Sp}};function lh(n,e,t){const{props:i}=n;n.animationState&&i.whileHover&&n.animationState.setActive("whileHover",t==="Start");const s="onHover"+t,r=i[s];r&&qe.postRender(()=>r(e,$s(e)))}class g_ extends ri{mount(){const{current:e}=this.node;e&&(this.unmount=O0(e,(t,i)=>(lh(this.node,i,"Start"),s=>lh(this.node,s,"End"))))}unmount(){}}class v_ extends ri{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(":focus-visible")}catch{e=!0}!e||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Xs(Bs(this.node.current,"focus",()=>this.onFocus()),Bs(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function ch(n,e,t){const{props:i}=n;if(n.current instanceof HTMLButtonElement&&n.current.disabled)return;n.animationState&&i.whileTap&&n.animationState.setActive("whileTap",t==="Start");const s="onTap"+(t==="End"?"":t),r=i[s];r&&qe.postRender(()=>r(e,$s(e)))}class x_ extends ri{mount(){const{current:e}=this.node;if(!e)return;const{globalTapTarget:t,propagate:i}=this.node.props;this.unmount=G0(e,(s,r)=>(ch(this.node,r,"Start"),(a,{success:o})=>ch(this.node,a,o?"End":"Cancel")),{useGlobalTarget:t,stopPropagation:i?.tap===!1})}unmount(){}}const Zo=new WeakMap,Ha=new WeakMap,__=n=>{const e=Zo.get(n.target);e&&e(n)},y_=n=>{n.forEach(__)};function S_({root:n,...e}){const t=n||document;Ha.has(t)||Ha.set(t,{});const i=Ha.get(t),s=JSON.stringify(e);return i[s]||(i[s]=new IntersectionObserver(y_,{root:n,...e})),i[s]}function M_(n,e,t){const i=S_(e);return Zo.set(n,t),i.observe(n),()=>{Zo.delete(n),i.unobserve(n)}}const E_={some:0,all:1};class b_ extends ri{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.stopObserver?.();const{viewport:e={}}=this.node.getProps(),{root:t,margin:i,amount:s="some",once:r}=e,a={root:t?t.current:void 0,rootMargin:i,threshold:typeof s=="number"?s:E_[s]},o=c=>{const{isIntersecting:l}=c;if(this.isInView===l||(this.isInView=l,r&&!l&&this.hasEnteredView))return;l&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",l);const{onViewportEnter:u,onViewportLeave:d}=this.node.getProps(),h=l?u:d;h&&h(c)};this.stopObserver=M_(this.node.current,a,o)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:e,prevProps:t}=this.node;["amount","margin","root"].some(T_(e,t))&&this.startObserver()}unmount(){this.stopObserver?.(),this.hasEnteredView=!1,this.isInView=!1}}function T_({viewport:n={}},{viewport:e={}}={}){return t=>n[t]!==e[t]}const A_={inView:{Feature:b_},tap:{Feature:x_},focus:{Feature:v_},hover:{Feature:g_}},w_={layout:{ProjectionNode:lp,MeasureLayout:Sp}},R_={...Zx,...A_,...m_,...w_},Oe=jx(R_,Yx);function ia(n){return typeof window>"u"?!1:n?ff():nc()}const C_=50,uh=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),P_=()=>({time:0,x:uh(),y:uh()}),L_={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function hh(n,e,t,i){const s=t[e],{length:r,position:a}=L_[e],o=s.current,c=t.time;s.current=Math.abs(n[`scroll${a}`]),s.scrollLength=n[`scroll${r}`]-n[`client${r}`],s.offset.length=0,s.offset[0]=0,s.offset[1]=s.scrollLength,s.progress=ns(0,s.scrollLength,s.current);const l=i-c;s.velocity=l>C_?0:Wl(s.current-o,l)}function D_(n,e,t){hh(n,"x",e,t),hh(n,"y",e,t),e.time=t}function N_(n,e){const t={x:0,y:0};let i=n;for(;i&&i!==e;)if(Cs(i))t.x+=i.offsetLeft,t.y+=i.offsetTop,i=i.offsetParent;else if(i.tagName==="svg"){const s=i.getBoundingClientRect();i=i.parentElement;const r=i.getBoundingClientRect();t.x+=s.left-r.left,t.y+=s.top-r.top}else if(i instanceof SVGGraphicsElement){const{x:s,y:r}=i.getBBox();t.x+=s,t.y+=r;let a=null,o=i.parentNode;for(;!a;)o.tagName==="svg"&&(a=o),o=i.parentNode;i=a}else break;return t}const Jo={start:0,center:.5,end:1};function dh(n,e,t=0){let i=0;if(n in Jo&&(n=Jo[n]),typeof n=="string"){const s=parseFloat(n);n.endsWith("px")?i=s:n.endsWith("%")?n=s/100:n.endsWith("vw")?i=s/100*document.documentElement.clientWidth:n.endsWith("vh")?i=s/100*document.documentElement.clientHeight:n=s}return typeof n=="number"&&(i=e*n),t+i}const I_=[0,0];function U_(n,e,t,i){let s=Array.isArray(n)?n:I_,r=0,a=0;return typeof n=="number"?s=[n,n]:typeof n=="string"&&(n=n.trim(),n.includes(" ")?s=n.split(" "):s=[n,Jo[n]?n:"0"]),r=dh(s[0],t,i),a=dh(s[1],e),r-a}const Es={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},F_={x:0,y:0};function O_(n){return"getBBox"in n&&n.tagName!=="svg"?n.getBBox():{width:n.clientWidth,height:n.clientHeight}}function B_(n,e,t){const{offset:i=Es.All}=t,{target:s=n,axis:r="y"}=t,a=r==="y"?"height":"width",o=s!==n?N_(s,n):F_,c=s===n?{width:n.scrollWidth,height:n.scrollHeight}:O_(s),l={width:n.clientWidth,height:n.clientHeight};e[r].offset.length=0;let u=!e[r].interpolate;const d=i.length;for(let h=0;h<d;h++){const p=U_(i[h],l[a],c[a],o[r]);!u&&p!==e[r].interpolatorOffsets[h]&&(u=!0),e[r].offset[h]=p}u&&(e[r].interpolate=Jl(e[r].offset,lf(i),{clamp:!1}),e[r].interpolatorOffsets=[...e[r].offset]),e[r].progress=mn(0,1,e[r].interpolate(e[r].current))}function V_(n,e=n,t){if(t.x.targetOffset=0,t.y.targetOffset=0,e!==n){let i=e;for(;i&&i!==n;)t.x.targetOffset+=i.offsetLeft,t.y.targetOffset+=i.offsetTop,i=i.offsetParent}t.x.targetLength=e===n?e.scrollWidth:e.clientWidth,t.y.targetLength=e===n?e.scrollHeight:e.clientHeight,t.x.containerLength=n.clientWidth,t.y.containerLength=n.clientHeight}function k_(n,e,t,i={}){return{measure:s=>{V_(n,i.target,t),D_(n,t,s),(i.offset||i.target)&&B_(n,t,i)},notify:()=>e(t)}}const Pi=new WeakMap,fh=new WeakMap,Ga=new WeakMap,ph=new WeakMap,ar=new WeakMap,mh=n=>n===document.scrollingElement?window:n;function Mp(n,{container:e=document.scrollingElement,trackContentSize:t=!1,...i}={}){if(!e)return Ht;let s=Ga.get(e);s||(s=new Set,Ga.set(e,s));const r=P_(),a=k_(e,n,r,i);if(s.add(a),!Pi.has(e)){const c=()=>{for(const h of s)h.measure(Rt.timestamp);qe.preUpdate(l)},l=()=>{for(const h of s)h.notify()},u=()=>qe.read(c);Pi.set(e,u);const d=mh(e);window.addEventListener("resize",u),e!==document.documentElement&&fh.set(e,Xo(e,u)),d.addEventListener("scroll",u),u()}if(t&&!ar.has(e)){const c=Pi.get(e),l={width:e.scrollWidth,height:e.scrollHeight};ph.set(e,l);const u=()=>{const h=e.scrollWidth,p=e.scrollHeight;(l.width!==h||l.height!==p)&&(c(),l.width=h,l.height=p)},d=qe.read(u,!0);ar.set(e,d)}const o=Pi.get(e);return qe.read(o,!1,!0),()=>{tn(o);const c=Ga.get(e);if(!c||(c.delete(a),c.size))return;const l=Pi.get(e);Pi.delete(e),l&&(mh(e).removeEventListener("scroll",l),fh.get(e)?.(),window.removeEventListener("resize",l));const u=ar.get(e);u&&(tn(u),ar.delete(e)),ph.delete(e)}}const z_=[[Es.Enter,"entry"],[Es.Exit,"exit"],[Es.Any,"cover"],[Es.All,"contain"]],gh={start:0,end:1};function H_(n){const e=n.trim().split(/\s+/);if(e.length!==2)return;const t=gh[e[0]],i=gh[e[1]];if(!(t===void 0||i===void 0))return[t,i]}function G_(n){if(n.length!==2)return;const e=[];for(const t of n)if(Array.isArray(t))e.push(t);else if(typeof t=="string"){const i=H_(t);if(!i)return;e.push(i)}else return;return e}function W_(n,e){const t=G_(n);if(!t)return!1;for(let i=0;i<2;i++){const s=t[i],r=e[i];if(s[0]!==r[0]||s[1]!==r[1])return!1}return!0}function vc(n){if(!n)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(const[e,t]of z_)if(W_(n,e))return{rangeStart:`${t} 0%`,rangeEnd:`${t} 100%`}}const vh=new Map;function xh(n){const e={value:0},t=Mp(i=>{e.value=i[n.axis].progress*100},n);return{currentTime:e,cancel:t}}function Ep({source:n,container:e,...t}){const{axis:i}=t;n&&(e=n);let s=vh.get(e);s||(s=new Map,vh.set(e,s));const r=t.target??"self";let a=s.get(r);a||(a={},s.set(r,a));const o=i+(t.offset??[]).join(",");return a[o]||(t.target&&ia(t.target)?vc(t.offset)?a[o]=new ViewTimeline({subject:t.target,axis:i}):a[o]=xh({container:e,...t}):ia()?a[o]=new ScrollTimeline({source:e,axis:i}):a[o]=xh({container:e,...t})),a[o]}function X_(n,e){const t=Ep(e),i=e.target?vc(e.offset):void 0,s=e.target?ia(e.target)&&!!i:ia();return n.attachTimeline({timeline:s?t:void 0,...i&&s&&{rangeStart:i.rangeStart,rangeEnd:i.rangeEnd},observe:r=>(r.pause(),Of(a=>{r.time=r.iterationDuration*a},t))})}function j_(n){return n&&(n.target||n.offset)}function Y_(n){return n.length===2}function q_(n,e){return Y_(n)||j_(e)?Mp(t=>{n(t[e.axis].progress,t)},e):Of(n,Ep(e))}function bp(n,{axis:e="y",container:t=document.scrollingElement,...i}={}){if(!t)return Ht;const s={axis:e,container:t,...i};return typeof n=="function"?q_(n,s):X_(n,s)}const $_=()=>({scrollX:hn(0),scrollY:hn(0),scrollXProgress:hn(0),scrollYProgress:hn(0)}),Zi=n=>n?!n.current:!1;function _h(n,e,t,i){return{factory:s=>{let r;const a=()=>{if(Zi(t)||Zi(i)){ss.read(a);return}r=bp(s,{...e,axis:n,container:t?.current||void 0,target:i?.current||void 0})};return ss.read(a),()=>{Df(a),r?.()}},times:[0,1],keyframes:[0,1],ease:s=>s,duration:1}}function K_(n,e){return typeof window>"u"?!1:n?ff()&&!!vc(e):nc()}function yh({container:n,target:e,...t}={}){const i=ni($_);K_(e,t.offset)&&(i.scrollXProgress.accelerate=_h("x",t,n,e),i.scrollYProgress.accelerate=_h("y",t,n,e));const s=Z.useRef(null),r=Z.useRef(!1),a=Z.useCallback(()=>(s.current=bp((o,{x:c,y:l})=>{i.scrollX.set(c.current),i.scrollXProgress.set(c.progress),i.scrollY.set(l.current),i.scrollYProgress.set(l.progress)},{...t,container:n?.current||void 0,target:e?.current||void 0}),()=>{s.current?.()}),[n,e,JSON.stringify(t.offset)]);return Ws(()=>{if(r.current=!1,Zi(n)||Zi(e)){r.current=!0;return}else return a()},[a]),Z.useEffect(()=>{if(!r.current)return;let o;const c=()=>{const l=Zi(n),u=Zi(e);!l&&!u&&(o=a())};return ss.read(c),()=>{Df(c),o?.()}},[a]),i}function gi(n){const e=ni(()=>hn(n)),{isStatic:t}=Z.useContext(qs);if(t){const[,i]=Z.useState(n);Z.useEffect(()=>e.on("change",i),[])}return e}function Tp(n,e){const t=gi(e()),i=()=>t.set(e());return i(),Ws(()=>{const s=()=>qe.preRender(i,!1,!0),r=n.map(a=>a.on("change",s));return()=>{r.forEach(a=>a()),tn(i)}}),t}function Z_(n){Rs.current=[],n();const e=Tp(Rs.current,n);return Rs.current=void 0,e}function xc(n,e,t,i){if(typeof n=="function")return Z_(n);if(t!==void 0&&!Array.isArray(t)&&typeof e!="function")return J_(n,e,t,i);const a=typeof e=="function"?e:Q0(e,t,i),o=Array.isArray(n)?Sh(n,a):Sh([n],([l])=>a(l)),c=Array.isArray(n)?void 0:n.accelerate;return c&&!c.isTransformed&&typeof e!="function"&&Array.isArray(t)&&i?.clamp!==!1&&(o.accelerate={...c,times:e,keyframes:t,isTransformed:!0}),o}function Sh(n,e){const t=ni(()=>[]);return Tp(n,()=>{t.length=0;const i=n.length;for(let s=0;s<i;s++)t[s]=n[s].get();return e(t)})}function J_(n,e,t,i){const s=ni(()=>Object.keys(t)),r=ni(()=>({}));for(const a of s)r[a]=xc(n,e,t[a],i);return r}function Q_(n,e={}){const{isStatic:t}=Z.useContext(qs),i=()=>Et(n)?n.get():n;if(t)return xc(i);const s=gi(i());return Z.useInsertionEffect(()=>ev(s,n,e),[s,JSON.stringify(e)]),s}function Xi(n,e={}){return Q_(n,{type:"spring",...e})}function Ap(){!dc.current&&Vf();const[n]=Z.useState(Jr.current);return n}const _c="186",ey=0,Mh=1,ty=2,kr=1,ny=2,bs=3,Ei=0,Gt=1,Fn=2,Bn=0,Ds=1,Eh=2,bh=3,Th=4,iy=5,ji=100,sy=101,ry=102,ay=103,oy=104,ly=200,cy=201,uy=202,hy=203,wp=204,Rp=205,dy=206,fy=207,py=208,my=209,gy=210,vy=211,xy=212,_y=213,yy=214,Qo=0,el=1,tl=2,Vs=3,nl=4,il=5,sl=6,rl=7,Cp=0,Sy=1,My=2,An=0,Pp=1,Lp=2,Dp=3,Np=4,Ip=5,Up=6,Fp=7,Op=300,bi=301,rs=302,Wa=303,Xa=304,_a=306,al=1e3,On=1001,ol=1002,Ct=1003,Ey=1004,or=1005,It=1006,ja=1007,_i=1008,Qt=1009,Bp=1010,Vp=1011,ks=1012,yc=1013,wn=1014,En=1015,Rn=1016,Sc=1017,Mc=1018,zs=1020,kp=35902,zp=35899,Hp=1021,Gp=1022,dn=1023,zn=1026,yi=1027,Wp=1028,Ec=1029,Ti=1030,bc=1031,Tc=1033,zr=33776,Hr=33777,Gr=33778,Wr=33779,ll=35840,cl=35841,ul=35842,hl=35843,dl=36196,fl=37492,pl=37496,ml=37488,gl=37489,sa=37490,vl=37491,xl=37808,_l=37809,yl=37810,Sl=37811,Ml=37812,El=37813,bl=37814,Tl=37815,Al=37816,wl=37817,Rl=37818,Cl=37819,Pl=37820,Ll=37821,Dl=36492,Nl=36494,Il=36495,Ul=36283,Fl=36284,ra=36285,Ol=36286,by=3200,Ah=0,Ty=1,ei="",Yt="srgb",aa="srgb-linear",oa="linear",it="srgb",Ya=7680,Ay=519,wy=512,Ry=513,Cy=514,Ac=515,Py=516,Ly=517,wc=518,Dy=519,Ny=35044,wh="300 es",bn=2e3,la=2001;function Iy(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ca(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Uy(){const n=ca("canvas");return n.style.display="block",n}const Rh={};function Ch(...n){const e="THREE."+n.shift();console.log(e,...n)}function Xp(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Le(...n){n=Xp(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Je(...n){n=Xp(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function es(...n){const e=n.join(" ");e in Rh||(Rh[e]=!0,Le(...n))}function Fy(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const Oy={[Qo]:el,[tl]:sl,[nl]:rl,[Vs]:il,[el]:Qo,[sl]:tl,[rl]:nl,[il]:Vs};class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ph=1234567;const Ns=Math.PI/180,Hs=180/Math.PI;function us(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function Xe(n,e,t){return Math.max(e,Math.min(t,n))}function Rc(n,e){return(n%e+e)%e}function By(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Vy(n,e,t){return n!==e?(t-n)/(e-n):0}function Is(n,e,t){return(1-t)*n+t*e}function ky(n,e,t,i){return Is(n,e,1-Math.exp(-t*i))}function zy(n,e=1){return e-Math.abs(Rc(n,e*2)-e)}function Hy(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Gy(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Wy(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Xy(n,e){return n+Math.random()*(e-n)}function jy(n){return n*(.5-Math.random())}function Yy(n){n!==void 0&&(Ph=n);let e=Ph+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qy(n){return n*Ns}function $y(n){return n*Hs}function Ky(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Zy(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Jy(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Qy(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+i)/2),u=a((e+i)/2),d=r((e-i)/2),h=a((e-i)/2),p=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*u,c*d,c*h,o*l);break;case"YZY":n.set(c*h,o*u,c*d,o*l);break;case"ZXZ":n.set(c*d,c*h,o*u,o*l);break;case"XZX":n.set(o*u,c*g,c*p,o*l);break;case"YXY":n.set(c*p,o*u,c*g,o*l);break;case"ZYZ":n.set(c*g,c*p,o*u,o*l);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Yi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ft(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Lh={DEG2RAD:Ns,RAD2DEG:Hs,generateUUID:us,clamp:Xe,euclideanModulo:Rc,mapLinear:By,inverseLerp:Vy,lerp:Is,damp:ky,pingpong:zy,smoothstep:Hy,smootherstep:Gy,randInt:Wy,randFloat:Xy,randFloatSpread:jy,seededRandom:Yy,degToRad:qy,radToDeg:$y,isPowerOfTwo:Ky,ceilPowerOfTwo:Zy,floorPowerOfTwo:Jy,setQuaternionFromProperEuler:Qy,normalize:Ft,denormalize:Yi},Pc=class Pc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Pc.prototype.isVector2=!0;let Qe=Pc;class hs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],d=i[s+3],h=r[a+0],p=r[a+1],g=r[a+2],y=r[a+3];if(d!==y||c!==h||l!==p||u!==g){let m=c*h+l*p+u*g+d*y;m<0&&(h=-h,p=-p,g=-g,y=-y,m=-m);let f=1-o;if(m<.9995){const b=Math.acos(m),A=Math.sin(b);f=Math.sin(f*b)/A,o=Math.sin(o*b)/A,c=c*f+h*o,l=l*f+p*o,u=u*f+g*o,d=d*f+y*o}else{c=c*f+h*o,l=l*f+p*o,u=u*f+g*o,d=d*f+y*o;const b=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=b,l*=b,u*=b,d*=b}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],d=r[a],h=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+u*d+c*p-l*h,e[t+1]=c*g+u*h+l*d-o*p,e[t+2]=l*g+u*p+o*h-c*d,e[t+3]=u*g-o*d-c*h-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),d=o(r/2),h=c(i/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"YZX":this._x=h*u*d+l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d-h*p*g;break;case"XZY":this._x=h*u*d-l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d+h*p*g;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=i+o+d;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(i>o&&i>d){const p=2*Math.sqrt(1+i-o-d);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>d){const p=2*Math.sqrt(1+o-i-d);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+d-i-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xe(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Lc=class Lc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),u=2*(o*t-r*s),d=2*(r*i-a*t);return this.x=t+c*l+a*d-o*u,this.y=i+c*u+o*l-r*d,this.z=s+c*d+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qa.copy(this).projectOnVector(e),this.sub(qa)}reflect(e){return this.sub(qa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Lc.prototype.isVector3=!0;let j=Lc;const qa=new j,Dh=new hs,Dc=class Dc{constructor(e,t,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l)}set(e,t,i,s,r,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],d=i[7],h=i[2],p=i[5],g=i[8],y=s[0],m=s[3],f=s[6],b=s[1],A=s[4],S=s[7],T=s[2],M=s[5],P=s[8];return r[0]=a*y+o*b+c*T,r[3]=a*m+o*A+c*M,r[6]=a*f+o*S+c*P,r[1]=l*y+u*b+d*T,r[4]=l*m+u*A+d*M,r[7]=l*f+u*S+d*P,r[2]=h*y+p*b+g*T,r[5]=h*m+p*A+g*M,r[8]=h*f+p*S+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,h=o*c-u*r,p=l*r-a*c,g=t*d+i*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=d*y,e[1]=(s*l-u*i)*y,e[2]=(o*i-s*a)*y,e[3]=h*y,e[4]=(u*t-s*c)*y,e[5]=(s*r-o*t)*y,e[6]=p*y,e[7]=(i*c-l*t)*y,e[8]=(a*t-i*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return es("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply($a.makeScale(e,t)),this}rotate(e){return es("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply($a.makeRotation(-e)),this}translate(e,t){return es("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Dc.prototype.isMatrix3=!0;let Ie=Dc;const $a=new Ie,Nh=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ih=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function eS(){const n={enabled:!0,workingColorSpace:aa,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=Vn(s.r),s.g=Vn(s.g),s.b=Vn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ei?oa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return es("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return es("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[aa]:{primaries:e,whitePoint:i,transfer:oa,toXYZ:Nh,fromXYZ:Ih,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Yt},outputColorSpaceConfig:{drawingBufferColorSpace:Yt}},[Yt]:{primaries:e,whitePoint:i,transfer:it,toXYZ:Nh,fromXYZ:Ih,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Yt}}}),n}const Ye=eS();function Vn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ts(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Li;class tS{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Li===void 0&&(Li=ca("canvas")),Li.width=e.width,Li.height=e.height;const s=Li.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Li}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ca("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Vn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Vn(t[i]/255)*255):t[i]=Vn(t[i]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nS=0;class Cc{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:nS++}),this.uuid=us(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ka(s[a].image)):r.push(Ka(s[a]))}else r=Ka(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Ka(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?tS.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let iS=0;const Za=new j;class kt extends wi{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,i=On,s=On,r=It,a=_i,o=dn,c=Qt,l=kt.DEFAULT_ANISOTROPY,u=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iS++}),this.uuid=us(),this.name="",this.source=new Cc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Qe(0,0),this.repeat=new Qe(1,1),this.center=new Qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Za).x}get height(){return this.source.getSize(Za).y}get depth(){return this.source.getSize(Za).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Op)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case al:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case ol:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case al:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case ol:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Op;kt.DEFAULT_ANISOTROPY=1;const Nc=class Nc{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],p=c[5],g=c[9],y=c[2],m=c[6],f=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(l+1)/2,S=(p+1)/2,T=(f+1)/2,M=(u+h)/4,P=(d+y)/4,_=(g+m)/4;return A>S&&A>T?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=M/i,r=P/i):S>T?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=M/s,r=_/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=P/r,s=_/r),this.set(i,s,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(d-y)/b,this.z=(h-u)/b,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this.w=Xe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this.w=Xe(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Nc.prototype.isVector4=!0;let pt=Nc;class sS extends wi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new kt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:It,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Cc(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends sS{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class jp extends kt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class rS extends kt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const da=class da{constructor(e,t,i,s,r,a,o,c,l,u,d,h,p,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,c,l,u,d,h,p,g,y,m)}set(e,t,i,s,r,a,o,c,l,u,d,h,p,g,y,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=y,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new da().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Di.setFromMatrixColumn(e,0).length(),r=1/Di.setFromMatrixColumn(e,1).length(),a=1/Di.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=a*u,p=a*d,g=o*u,y=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=p+g*l,t[5]=h-y*l,t[9]=-o*c,t[2]=y-h*l,t[6]=g+p*l,t[10]=a*c}else if(e.order==="YXZ"){const h=c*u,p=c*d,g=l*u,y=l*d;t[0]=h+y*o,t[4]=g*o-p,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-g,t[6]=y+h*o,t[10]=a*c}else if(e.order==="ZXY"){const h=c*u,p=c*d,g=l*u,y=l*d;t[0]=h-y*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*u,t[9]=y-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const h=a*u,p=a*d,g=o*u,y=o*d;t[0]=c*u,t[4]=g*l-p,t[8]=h*l+y,t[1]=c*d,t[5]=y*l+h,t[9]=p*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const h=a*c,p=a*l,g=o*c,y=o*l;t[0]=c*u,t[4]=y-h*d,t[8]=g*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=p*d+g,t[10]=h-y*d}else if(e.order==="XZY"){const h=a*c,p=a*l,g=o*c,y=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+y,t[5]=a*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*u,t[10]=y*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(aS,e,oS)}lookAt(e,t,i){const s=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Yn.crossVectors(i,Xt),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Yn.crossVectors(i,Xt)),Yn.normalize(),lr.crossVectors(Xt,Yn),s[0]=Yn.x,s[4]=lr.x,s[8]=Xt.x,s[1]=Yn.y,s[5]=lr.y,s[9]=Xt.y,s[2]=Yn.z,s[6]=lr.z,s[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],d=i[5],h=i[9],p=i[13],g=i[2],y=i[6],m=i[10],f=i[14],b=i[3],A=i[7],S=i[11],T=i[15],M=s[0],P=s[4],_=s[8],w=s[12],L=s[1],N=s[5],F=s[9],V=s[13],D=s[2],k=s[6],$=s[10],Y=s[14],X=s[3],R=s[7],O=s[11],H=s[15];return r[0]=a*M+o*L+c*D+l*X,r[4]=a*P+o*N+c*k+l*R,r[8]=a*_+o*F+c*$+l*O,r[12]=a*w+o*V+c*Y+l*H,r[1]=u*M+d*L+h*D+p*X,r[5]=u*P+d*N+h*k+p*R,r[9]=u*_+d*F+h*$+p*O,r[13]=u*w+d*V+h*Y+p*H,r[2]=g*M+y*L+m*D+f*X,r[6]=g*P+y*N+m*k+f*R,r[10]=g*_+y*F+m*$+f*O,r[14]=g*w+y*V+m*Y+f*H,r[3]=b*M+A*L+S*D+T*X,r[7]=b*P+A*N+S*k+T*R,r[11]=b*_+A*F+S*$+T*O,r[15]=b*w+A*V+S*Y+T*H,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],y=e[7],m=e[11],f=e[15],b=c*p-l*h,A=o*p-l*d,S=o*h-c*d,T=a*p-l*u,M=a*h-c*u,P=a*d-o*u;return t*(y*b-m*A+f*S)-i*(g*b-m*T+f*M)+s*(g*A-y*T+f*P)-r*(g*S-y*M+m*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-i*(r*u-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],y=e[13],m=e[14],f=e[15],b=t*o-i*a,A=t*c-s*a,S=t*l-r*a,T=i*c-s*o,M=i*l-r*o,P=s*l-r*c,_=u*y-d*g,w=u*m-h*g,L=u*f-p*g,N=d*m-h*y,F=d*f-p*y,V=h*f-p*m,D=b*V-A*F+S*N+T*L-M*w+P*_;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/D;return e[0]=(o*V-c*F+l*N)*k,e[1]=(s*F-i*V-r*N)*k,e[2]=(y*P-m*M+f*T)*k,e[3]=(h*M-d*P-p*T)*k,e[4]=(c*L-a*V-l*w)*k,e[5]=(t*V-s*L+r*w)*k,e[6]=(m*S-g*P-f*A)*k,e[7]=(u*P-h*S+p*A)*k,e[8]=(a*F-o*L+l*_)*k,e[9]=(i*L-t*F-r*_)*k,e[10]=(g*M-y*S+f*b)*k,e[11]=(d*S-u*M-p*b)*k,e[12]=(o*w-a*N-c*_)*k,e[13]=(t*N-i*w+s*_)*k,e[14]=(y*A-g*T-m*b)*k,e[15]=(u*T-d*A+h*b)*k,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,u=a+a,d=o+o,h=r*l,p=r*u,g=r*d,y=a*u,m=a*d,f=o*d,b=c*l,A=c*u,S=c*d,T=i.x,M=i.y,P=i.z;return s[0]=(1-(y+f))*T,s[1]=(p+S)*T,s[2]=(g-A)*T,s[3]=0,s[4]=(p-S)*M,s[5]=(1-(h+f))*M,s[6]=(m+b)*M,s[7]=0,s[8]=(g+A)*P,s[9]=(m-b)*P,s[10]=(1-(h+y))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Di.set(s[0],s[1],s[2]).length();const o=Di.set(s[4],s[5],s[6]).length(),c=Di.set(s[8],s[9],s[10]).length();r<0&&(a=-a),an.copy(this);const l=1/a,u=1/o,d=1/c;return an.elements[0]*=l,an.elements[1]*=l,an.elements[2]*=l,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=d,an.elements[9]*=d,an.elements[10]*=d,t.setFromRotationMatrix(an),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,s,r,a,o=bn,c=!1){const l=this.elements,u=2*r/(t-e),d=2*r/(i-s),h=(t+e)/(t-e),p=(i+s)/(i-s);let g,y;if(c)g=r/(a-r),y=a*r/(a-r);else if(o===bn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===la)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=bn,c=!1){const l=this.elements,u=2/(t-e),d=2/(i-s),h=-(t+e)/(t-e),p=-(i+s)/(i-s);let g,y;if(c)g=1/(a-r),y=a/(a-r);else if(o===bn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===la)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};da.prototype.isMatrix4=!0;let gt=da;const Di=new j,an=new gt,aS=new j(0,0,0),oS=new j(1,1,1),Yn=new j,lr=new j,Xt=new j,Uh=new gt,Fh=new hs;class Ai{constructor(e=0,t=0,i=0,s=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Uh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Uh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Fh.setFromEuler(this),this.setFromQuaternion(Fh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class Yp{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let lS=0;const Oh=new j,Ni=new hs,Pn=new gt,cr=new j,ps=new j,cS=new j,uS=new hs,Bh=new j(1,0,0),Vh=new j(0,1,0),kh=new j(0,0,1),zh={type:"added"},hS={type:"removed"},Ii={type:"childadded",child:null},Ja={type:"childremoved",child:null};class Wt extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lS++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wt.DEFAULT_UP.clone();const e=new j,t=new Ai,i=new hs,s=new j(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new Ie}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=Wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.premultiply(Ni),this}rotateX(e){return this.rotateOnAxis(Bh,e)}rotateY(e){return this.rotateOnAxis(Vh,e)}rotateZ(e){return this.rotateOnAxis(kh,e)}translateOnAxis(e,t){return Oh.copy(e).applyQuaternion(this.quaternion),this.position.add(Oh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bh,e)}translateY(e){return this.translateOnAxis(Vh,e)}translateZ(e){return this.translateOnAxis(kh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?cr.copy(e):cr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(ps,cr,this.up):Pn.lookAt(cr,ps,this.up),this.quaternion.setFromRotationMatrix(Pn),s&&(Pn.extractRotation(s.matrixWorld),Ni.setFromRotationMatrix(Pn),this.quaternion.premultiply(Ni.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zh),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hS),Ja.child=e,this.dispatchEvent(Ja),Ja.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zh),Ii.child=e,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,e,cS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,uS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Wt.DEFAULT_UP=new j(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ji extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dS={type:"move"};class Qa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ji,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ji,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ji,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,i),f=this._getHandJoint(l,y);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&h>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dS)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ji;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const qp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},ur={h:0,s:0,l:0};function eo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ke{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ye.workingColorSpace){if(e=Rc(e,1),t=Xe(t,0,1),i=Xe(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=eo(a,r,e+1/3),this.g=eo(a,r,e),this.b=eo(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=Yt){function i(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){const i=qp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vn(e.r),this.g=Vn(e.g),this.b=Vn(e.b),this}copyLinearToSRGB(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return Ye.workingToColorSpace(Nt.copy(this),e),Math.round(Xe(Nt.r*255,0,255))*65536+Math.round(Xe(Nt.g*255,0,255))*256+Math.round(Xe(Nt.b*255,0,255))}getHexString(e=Yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Nt.copy(this),t);const i=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case i:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-i)/d+2;break;case r:c=(i-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Yt){Ye.workingToColorSpace(Nt.copy(this),e);const t=Nt.r,i=Nt.g,s=Nt.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(qn),this.setHSL(qn.h+e,qn.s+t,qn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(qn),e.getHSL(ur);const i=Is(qn.h,ur.h,t),s=Is(qn.s,ur.s,t),r=Is(qn.l,ur.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new Ke;Ke.NAMES=qp;class fS extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const on=new j,Ln=new j,to=new j,Dn=new j,Ui=new j,Fi=new j,Hh=new j,no=new j,io=new j,so=new j,ro=new pt,ao=new pt,oo=new pt;class un{constructor(e=new j,t=new j,i=new j){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),on.subVectors(e,t),s.cross(on);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){on.subVectors(s,t),Ln.subVectors(i,t),to.subVectors(e,t);const a=on.dot(on),o=on.dot(Ln),c=on.dot(to),l=Ln.dot(Ln),u=Ln.dot(to),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const h=1/d,p=(l*c-o*u)*h,g=(a*u-o*c)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,i,s,r,a,o,c){return this.getBarycoord(e,t,i,s,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Dn.x),c.addScaledVector(a,Dn.y),c.addScaledVector(o,Dn.z),c)}static getInterpolatedAttribute(e,t,i,s,r,a){return ro.setScalar(0),ao.setScalar(0),oo.setScalar(0),ro.fromBufferAttribute(e,t),ao.fromBufferAttribute(e,i),oo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ro,r.x),a.addScaledVector(ao,r.y),a.addScaledVector(oo,r.z),a}static isFrontFacing(e,t,i,s){return on.subVectors(i,t),Ln.subVectors(e,t),on.cross(Ln).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),on.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return un.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Ui.subVectors(s,i),Fi.subVectors(r,i),no.subVectors(e,i);const c=Ui.dot(no),l=Fi.dot(no);if(c<=0&&l<=0)return t.copy(i);io.subVectors(e,s);const u=Ui.dot(io),d=Fi.dot(io);if(u>=0&&d<=u)return t.copy(s);const h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(i).addScaledVector(Ui,a);so.subVectors(e,r);const p=Ui.dot(so),g=Fi.dot(so);if(g>=0&&p<=g)return t.copy(r);const y=p*l-c*g;if(y<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(Fi,o);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return Hh.subVectors(r,s),o=(d-u)/(d-u+(p-g)),t.copy(s).addScaledVector(Hh,o);const f=1/(m+y+h);return a=y*f,o=h*f,t.copy(i).addScaledVector(Ui,a).addScaledVector(Fi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ks{constructor(e=new j(1/0,1/0,1/0),t=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ln):ln.fromBufferAttribute(r,a),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),hr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),hr.copy(i.boundingBox)),hr.applyMatrix4(e.matrixWorld),this.union(hr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ms),dr.subVectors(this.max,ms),Oi.subVectors(e.a,ms),Bi.subVectors(e.b,ms),Vi.subVectors(e.c,ms),$n.subVectors(Bi,Oi),Kn.subVectors(Vi,Bi),li.subVectors(Oi,Vi);let t=[0,-$n.z,$n.y,0,-Kn.z,Kn.y,0,-li.z,li.y,$n.z,0,-$n.x,Kn.z,0,-Kn.x,li.z,0,-li.x,-$n.y,$n.x,0,-Kn.y,Kn.x,0,-li.y,li.x,0];return!lo(t,Oi,Bi,Vi,dr)||(t=[1,0,0,0,1,0,0,0,1],!lo(t,Oi,Bi,Vi,dr))?!1:(fr.crossVectors($n,Kn),t=[fr.x,fr.y,fr.z],lo(t,Oi,Bi,Vi,dr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new j,new j,new j,new j,new j,new j,new j,new j],ln=new j,hr=new Ks,Oi=new j,Bi=new j,Vi=new j,$n=new j,Kn=new j,li=new j,ms=new j,dr=new j,fr=new j,ci=new j;function lo(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ci.fromArray(n,r);const o=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),c=e.dot(ci),l=t.dot(ci),u=i.dot(ci);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const _t=new j,pr=new Qe;let pS=0;class kn extends wi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pS++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ny,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)pr.fromBufferAttribute(this,t),pr.applyMatrix3(e),this.setXY(t,pr.x,pr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Yi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class $p extends kn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Kp extends kn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class $t extends kn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const mS=new Ks,gs=new j,co=new j;class ya{constructor(e=new j,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):mS.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gs.subVectors(e,this.center);const t=gs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(gs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(co.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gs.copy(e.center).add(co)),this.expandByPoint(gs.copy(e.center).sub(co))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let gS=0;const Zt=new gt,uo=new Wt,ki=new j,jt=new Ks,vs=new Ks,wt=new j;class nn extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gS++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Iy(e)?Kp:$p)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ie().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Zt.makeRotationFromQuaternion(e),this.applyMatrix4(Zt),this}rotateX(e){return Zt.makeRotationX(e),this.applyMatrix4(Zt),this}rotateY(e){return Zt.makeRotationY(e),this.applyMatrix4(Zt),this}rotateZ(e){return Zt.makeRotationZ(e),this.applyMatrix4(Zt),this}translate(e,t,i){return Zt.makeTranslation(e,t,i),this.applyMatrix4(Zt),this}scale(e,t,i){return Zt.makeScale(e,t,i),this.applyMatrix4(Zt),this}lookAt(e){return uo.lookAt(e),uo.updateMatrix(),this.applyMatrix4(uo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $t(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];jt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ya);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(jt.min,vs.min),jt.expandByPoint(wt),wt.addVectors(jt.max,vs.max),jt.expandByPoint(wt)):(jt.expandByPoint(vs.min),jt.expandByPoint(vs.max))}jt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)wt.fromBufferAttribute(o,l),c&&(ki.fromBufferAttribute(e,l),wt.add(ki)),s=Math.max(s,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new kn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let _=0;_<i.count;_++)o[_]=new j,c[_]=new j;const l=new j,u=new j,d=new j,h=new Qe,p=new Qe,g=new Qe,y=new j,m=new j;function f(_,w,L){l.fromBufferAttribute(i,_),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,L),h.fromBufferAttribute(r,_),p.fromBufferAttribute(r,w),g.fromBufferAttribute(r,L),u.sub(l),d.sub(l),p.sub(h),g.sub(h);const N=1/(p.x*g.y-g.x*p.y);isFinite(N)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(N),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(N),o[_].add(y),o[w].add(y),o[L].add(y),c[_].add(m),c[w].add(m),c[L].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let _=0,w=b.length;_<w;++_){const L=b[_],N=L.start,F=L.count;for(let V=N,D=N+F;V<D;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const A=new j,S=new j,T=new j,M=new j;function P(_){T.fromBufferAttribute(s,_),M.copy(T);const w=o[_];A.copy(w),A.sub(T.multiplyScalar(T.dot(w))).normalize(),S.crossVectors(M,w);const N=S.dot(c[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,N)}for(let _=0,w=b.length;_<w;++_){const L=b[_],N=L.start,F=L.count;for(let V=N,D=N+F;V<D;V+=3)P(e.getX(V+0)),P(e.getX(V+1)),P(e.getX(V+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new kn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const s=new j,r=new j,a=new j,o=new j,c=new j,l=new j,u=new j,d=new j;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),y=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,y),l.fromBufferAttribute(i,m),o.add(u),c.add(u),l.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,h=new l.constructor(c.length*u);let p=0,g=0;for(let y=0,m=c.length;y<m;y++){o.isInterleavedBufferAttribute?p=c[y]*o.data.stride+o.offset:p=c[y]*u;for(let f=0;f<u;f++)h[g++]=l[p++]}return new kn(h,u,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new nn,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let u=0,d=l.length;u<d;u++){const h=l[u],p=e(h,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){const p=l[d];u.push(p.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],d=r[l];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ho=new j,vS=new j,xS=new Ie;class Qn{constructor(e=new j(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ho.subVectors(i,t).cross(vS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(ho),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||xS.getNormalMatrix(e),s=this.coplanarPoint(ho).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let _S=0;class Zs extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_S++}),this.uuid=us(),this.name="",this.type="Material",this.blending=Ds,this.side=Ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wp,this.blendDst=Rp,this.blendEquation=ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ay,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ya,this.stencilZFail=Ya,this.stencilZPass=Ya,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Qn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Qe().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Qe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const In=new j,fo=new j,mr=new j,gr=new j;class Zp{constructor(e=new j,t=new j(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,In)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=In.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(In.copy(this.origin).addScaledVector(this.direction,t),In.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){fo.copy(e).add(t).multiplyScalar(.5),mr.copy(t).sub(e).normalize(),gr.copy(this.origin).sub(fo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(mr),o=gr.dot(this.direction),c=-gr.dot(mr),l=gr.lengthSq(),u=Math.abs(1-a*a);let d,h,p,g;if(u>0)if(d=a*c-o,h=a*o-c,g=r*u,d>=0)if(h>=-g)if(h<=g){const y=1/u;d*=y,h*=y,p=d*(d+a*h+2*o)+h*(a*d+h+2*c)+l}else h=r,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-a*r+o)),h=d>0?-r:Math.min(Math.max(-r,-c),r),p=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-r,-c),r),p=h*(h+2*c)+l):(d=Math.max(0,-(a*r+o)),h=d>0?r:Math.min(Math.max(-r,-c),r),p=-d*d+h*(h+2*c)+l);else h=a>0?-r:r,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(fo).addScaledVector(mr,h),p}intersectSphere(e,t){if(e.radius<0)return null;In.subVectors(e.center,this.origin);const i=In.dot(this.direction),s=In.dot(In)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(i=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(i=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,In)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,d=e.x-a.x,h=e.y-a.y,p=e.z-a.z,g=t.x-a.x,y=t.y-a.y,m=t.z-a.z,f=i.x-a.x,b=i.y-a.y,A=i.z-a.z,S=Math.abs(c),T=Math.abs(l),M=Math.abs(u);let P,_,w,L,N,F,V,D,k,$,Y,X;if(S>=T&&S>=M?(w=c,F=d,k=g,X=f,c>=0?(P=l,_=u,L=h,N=p,V=y,D=m,$=b,Y=A):(P=u,_=l,L=p,N=h,V=m,D=y,$=A,Y=b)):T>=M?(w=l,F=h,k=y,X=b,l>=0?(P=u,_=c,L=p,N=d,V=m,D=g,$=A,Y=f):(P=c,_=u,L=d,N=p,V=g,D=m,$=f,Y=A)):(w=u,F=p,k=m,X=A,u>=0?(P=c,_=l,L=d,N=h,V=g,D=y,$=f,Y=b):(P=l,_=c,L=h,N=d,V=y,D=g,$=b,Y=f)),w===0)return null;const R=P/w,O=_/w,H=1/w,re=L-R*F,ae=N-O*F,Ve=V-R*k,ke=D-O*k,je=$-R*X,J=Y-O*X,ie=je*ke-J*Ve,_e=re*J-ae*je,De=Ve*ae-ke*re;if(s){if(ie<0||_e<0||De<0)return null}else if((ie<0||_e<0||De<0)&&(ie>0||_e>0||De>0))return null;const xe=ie+_e+De;if(xe===0)return null;const ze=H*(ie*F+_e*k+De*X);return(xe>0?ze<0:ze>0)?null:this.at(ze/xe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Jp extends Zs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=Cp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Gh=new gt,ui=new Zp,vr=new ya,Wh=new j,xr=new j,_r=new j,yr=new j,po=new j,Sr=new j,Xh=new j,Mr=new j;class Hn extends Wt{constructor(e=new nn,t=new Jp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Sr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=o[c],d=r[c];u!==0&&(po.fromBufferAttribute(d,e),a?Sr.addScaledVector(po,u):Sr.addScaledVector(po.sub(t),u))}t.add(Sr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),vr.copy(i.boundingSphere),vr.applyMatrix4(r),ui.copy(e.ray).recast(e.near),!(vr.containsPoint(ui.origin)===!1&&(ui.intersectSphere(vr,Wh)===null||ui.origin.distanceToSquared(Wh)>(e.far-e.near)**2))&&(Gh.copy(r).invert(),ui.copy(e.ray).applyMatrix4(Gh),!(i.boundingBox!==null&&ui.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ui)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const m=h[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),A=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let S=b,T=A;S<T;S+=3){const M=o.getX(S),P=o.getX(S+1),_=o.getX(S+2);s=Er(this,f,e,i,l,u,d,M,P,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){const b=o.getX(m),A=o.getX(m+1),S=o.getX(m+2);s=Er(this,a,e,i,l,u,d,b,A,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const m=h[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),A=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let S=b,T=A;S<T;S+=3){const M=S,P=S+1,_=S+2;s=Er(this,f,e,i,l,u,d,M,P,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){const b=m,A=m+1,S=m+2;s=Er(this,a,e,i,l,u,d,b,A,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function yS(n,e,t,i,s,r,a,o){let c;if(e.side===Gt?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===Ei,o),c===null)return null;Mr.copy(o),Mr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Mr);return l<t.near||l>t.far?null:{distance:l,point:Mr.clone(),object:n}}function Er(n,e,t,i,s,r,a,o,c,l){n.getVertexPosition(o,xr),n.getVertexPosition(c,_r),n.getVertexPosition(l,yr);const u=yS(n,e,t,i,xr,_r,yr,Xh);if(u){const d=new j;un.getBarycoord(Xh,xr,_r,yr,d),s&&(u.uv=un.getInterpolatedAttribute(s,o,c,l,d,new Qe)),r&&(u.uv1=un.getInterpolatedAttribute(r,o,c,l,d,new Qe)),a&&(u.normal=un.getInterpolatedAttribute(a,o,c,l,d,new j),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new j,materialIndex:0};un.getNormal(xr,_r,yr,h.normal),u.face=h,u.barycoord=d}return u}class SS extends kt{constructor(e=null,t=1,i=1,s,r,a,o,c,l=Ct,u=Ct,d,h){super(null,a,o,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hi=new ya,MS=new Qe(.5,.5),br=new j;class Qp{constructor(e=new Qn,t=new Qn,i=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=bn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],p=r[7],g=r[8],y=r[9],m=r[10],f=r[11],b=r[12],A=r[13],S=r[14],T=r[15];if(s[0].setComponents(l-a,p-u,f-g,T-b).normalize(),s[1].setComponents(l+a,p+u,f+g,T+b).normalize(),s[2].setComponents(l+o,p+d,f+y,T+A).normalize(),s[3].setComponents(l-o,p-d,f-y,T-A).normalize(),i)s[4].setComponents(c,h,m,S).normalize(),s[5].setComponents(l-c,p-h,f-m,T-S).normalize();else if(s[4].setComponents(l-c,p-h,f-m,T-S).normalize(),t===bn)s[5].setComponents(l+c,p+h,f+m,T+S).normalize();else if(t===la)s[5].setComponents(c,h,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hi)}intersectsSprite(e){hi.center.set(0,0,0);const t=MS.distanceTo(e.center);return hi.radius=.7071067811865476+t,hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(hi)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(br.x=s.normal.x>0?e.max.x:e.min.x,br.y=s.normal.y>0?e.max.y:e.min.y,br.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(br)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Bl extends Zs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ua=new j,ha=new j,jh=new gt,xs=new Zp,Tr=new ya,mo=new j,Yh=new j;class ES extends Wt{constructor(e=new nn,t=new Bl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)ua.fromBufferAttribute(t,s-1),ha.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ua.distanceTo(ha);e.setAttribute("lineDistance",new $t(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Tr.copy(i.boundingSphere),Tr.applyMatrix4(s),Tr.radius+=r,e.ray.intersectsSphere(Tr)===!1)return;jh.copy(s).invert(),xs.copy(e.ray).applyMatrix4(jh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=l){const f=u.getX(y),b=u.getX(y+1),A=Ar(this,e,xs,c,f,b,y);A&&t.push(A)}if(this.isLineLoop){const y=u.getX(g-1),m=u.getX(p),f=Ar(this,e,xs,c,y,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=l){const f=Ar(this,e,xs,c,y,y+1,y);f&&t.push(f)}if(this.isLineLoop){const y=Ar(this,e,xs,c,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ar(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(ua.fromBufferAttribute(o,s),ha.fromBufferAttribute(o,r),t.distanceSqToSegment(ua,ha,mo,Yh)>i)return;mo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(mo);if(!(l<e.near||l>e.far))return{distance:l,point:Yh.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const qh=new j,$h=new j;class go extends ES{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)qh.fromBufferAttribute(t,s),$h.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+qh.distanceTo($h);e.setAttribute("lineDistance",new $t(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class em extends kt{constructor(e=[],t=bi,i,s,r,a,o,c,l,u){super(e,t,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gs extends kt{constructor(e,t,i=wn,s,r,a,o=Ct,c=Ct,l,u=zn,d=1){if(u!==zn&&u!==yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class bS extends Gs{constructor(e,t=wn,i=bi,s,r,a=Ct,o=Ct,c,l=zn){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,s,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class tm extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Js extends nn{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],u=[],d=[];let h=0,p=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new $t(l,3)),this.setAttribute("normal",new $t(u,3)),this.setAttribute("uv",new $t(d,2));function g(y,m,f,b,A,S,T,M,P,_,w){const L=S/P,N=T/_,F=S/2,V=T/2,D=M/2,k=P+1,$=_+1;let Y=0,X=0;const R=new j;for(let O=0;O<$;O++){const H=O*N-V;for(let re=0;re<k;re++){const ae=re*L-F;R[y]=ae*b,R[m]=H*A,R[f]=D,l.push(R.x,R.y,R.z),R[y]=0,R[m]=0,R[f]=M>0?1:-1,u.push(R.x,R.y,R.z),d.push(re/P),d.push(1-O/_),Y+=1}}for(let O=0;O<_;O++)for(let H=0;H<P;H++){const re=h+H+k*O,ae=h+H+k*(O+1),Ve=h+(H+1)+k*(O+1),ke=h+(H+1)+k*O;c.push(re,ae,ke),c.push(ae,Ve,ke),X+=6}o.addGroup(p,X,w),p+=X,h+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Js(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Sa extends nn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,d=e/o,h=t/c,p=[],g=[],y=[],m=[];for(let f=0;f<u;f++){const b=f*h-a;for(let A=0;A<l;A++){const S=A*d-r;g.push(S,-b,0),y.push(0,0,1),m.push(A/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let b=0;b<o;b++){const A=b+l*f,S=b+l*(f+1),T=b+1+l*(f+1),M=b+1+l*f;p.push(A,S,M),p.push(S,T,M)}this.setIndex(p),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(y,3)),this.setAttribute("uv",new $t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sa(e.width,e.height,e.widthSegments,e.heightSegments)}}function as(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Kh(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Kh(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Ot(n){const e={};for(let t=0;t<n.length;t++){const i=as(n[t]);for(const s in i)e[s]=i[s]}return e}function Kh(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function TS(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function nm(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const AS={clone:as,merge:Ot};var wS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,RS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends Zs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wS,this.fragmentShader=RS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=as(e.uniforms),this.uniformsGroups=TS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ke().setHex(s.value);break;case"v2":this.uniforms[i].value=new Qe().fromArray(s.value);break;case"v3":this.uniforms[i].value=new j().fromArray(s.value);break;case"v4":this.uniforms[i].value=new pt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ie().fromArray(s.value);break;case"m4":this.uniforms[i].value=new gt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class CS extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class PS extends Zs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=by,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class LS extends Zs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const wr=new j,Rr=new hs,xn=new j;class im extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(wr,Rr,xn),xn.x===1&&xn.y===1&&xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wr,Rr,xn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(wr,Rr,xn),xn.x===1&&xn.y===1&&xn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wr,Rr,xn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Zn=new j,Zh=new Qe,Jh=new Qe;class Jt extends im{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Hs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zn.x,Zn.y).multiplyScalar(-e/Zn.z),Zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zn.x,Zn.y).multiplyScalar(-e/Zn.z)}getViewSize(e,t){return this.getViewBounds(e,Zh,Jh),t.subVectors(Jh,Zh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ns*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class sm extends im{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const zi=-90,Hi=1;class DS extends Wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Jt(zi,Hi,e,t);s.layers=this.layers,this.add(s);const r=new Jt(zi,Hi,e,t);r.layers=this.layers,this.add(r);const a=new Jt(zi,Hi,e,t);a.layers=this.layers,this.add(a);const o=new Jt(zi,Hi,e,t);o.layers=this.layers,this.add(o);const c=new Jt(zi,Hi,e,t);c.layers=this.layers,this.add(c);const l=new Jt(zi,Hi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===bn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===la)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class NS extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Ic=class Ic{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};Ic.prototype.isMatrix2=!0;let Qh=Ic;function ed(n,e,t,i){const s=IS(i);switch(t){case Hp:return n*e;case Wp:return n*e/s.components*s.byteLength;case Ec:return n*e/s.components*s.byteLength;case Ti:return n*e*2/s.components*s.byteLength;case bc:return n*e*2/s.components*s.byteLength;case Gp:return n*e*3/s.components*s.byteLength;case dn:return n*e*4/s.components*s.byteLength;case Tc:return n*e*4/s.components*s.byteLength;case zr:case Hr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Gr:case Wr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case cl:case hl:return Math.max(n,16)*Math.max(e,8)/4;case ll:case ul:return Math.max(n,8)*Math.max(e,8)/2;case dl:case fl:case ml:case gl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pl:case sa:case vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case xl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _l:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case yl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ml:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case El:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case bl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Tl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Al:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case wl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Rl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Cl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Pl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ll:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Dl:case Nl:case Il:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Ul:case Fl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ra:case Ol:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function IS(n){switch(n){case Qt:case Bp:return{byteLength:1,components:1};case ks:case Vp:case Rn:return{byteLength:2,components:1};case Sc:case Mc:return{byteLength:2,components:4};case wn:case yc:case En:return{byteLength:4,components:1};case kp:case zp:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_c}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_c);function rm(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function US(n){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const u=c.array,d=c.updateRanges;if(n.bindBuffer(l,o),d.length===0)n.bufferSubData(l,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){const g=d[h],y=d[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){const y=d[p];n.bufferSubData(l,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var FS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,OS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,BS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,VS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,HS=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,GS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,WS=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,XS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,YS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qS=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$S=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,KS=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ZS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,JS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,QS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,nM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,iM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,rM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,aM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,oM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,lM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dM="gl_FragColor = linearToOutputTexel( gl_FragColor );",fM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,mM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_M=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,SM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,MM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,EM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,bM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,TM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,AM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,RM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,CM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,PM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,LM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,DM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,NM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,IM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,UM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,FM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,OM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,BM=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,VM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,HM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,GM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,WM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,XM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,YM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$M=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,KM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ZM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,JM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,QM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,rE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,aE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,oE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,dE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,_E=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,SE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ME=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,EE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,bE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,TE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,AE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,RE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,CE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,PE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,LE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,DE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,NE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,IE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,UE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const FE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,OE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,VE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,GE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,WE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,XE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,jE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,YE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$E=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,KE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ZE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ib=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,sb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ab=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ob=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ub=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,hb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,db=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Be={alphahash_fragment:FS,alphahash_pars_fragment:OS,alphamap_fragment:BS,alphamap_pars_fragment:VS,alphatest_fragment:kS,alphatest_pars_fragment:zS,aomap_fragment:HS,aomap_pars_fragment:GS,batching_pars_vertex:WS,batching_vertex:XS,begin_vertex:jS,beginnormal_vertex:YS,bsdfs:qS,iridescence_fragment:$S,bumpmap_pars_fragment:KS,clipping_planes_fragment:ZS,clipping_planes_pars_fragment:JS,clipping_planes_pars_vertex:QS,clipping_planes_vertex:eM,color_fragment:tM,color_pars_fragment:nM,color_pars_vertex:iM,color_vertex:sM,common:rM,cube_uv_reflection_fragment:aM,defaultnormal_vertex:oM,displacementmap_pars_vertex:lM,displacementmap_vertex:cM,emissivemap_fragment:uM,emissivemap_pars_fragment:hM,colorspace_fragment:dM,colorspace_pars_fragment:fM,envmap_fragment:pM,envmap_common_pars_fragment:mM,envmap_pars_fragment:gM,envmap_pars_vertex:vM,envmap_physical_pars_fragment:RM,envmap_vertex:xM,fog_vertex:_M,fog_pars_vertex:yM,fog_fragment:SM,fog_pars_fragment:MM,gradientmap_pars_fragment:EM,lightmap_pars_fragment:bM,lights_lambert_fragment:TM,lights_lambert_pars_fragment:AM,lights_pars_begin:wM,lights_toon_fragment:CM,lights_toon_pars_fragment:PM,lights_phong_fragment:LM,lights_phong_pars_fragment:DM,lights_physical_fragment:NM,lights_physical_pars_fragment:IM,lights_fragment_begin:UM,lights_fragment_maps:FM,lights_fragment_end:OM,lightprobes_pars_fragment:BM,logdepthbuf_fragment:VM,logdepthbuf_pars_fragment:kM,logdepthbuf_pars_vertex:zM,logdepthbuf_vertex:HM,map_fragment:GM,map_pars_fragment:WM,map_particle_fragment:XM,map_particle_pars_fragment:jM,metalnessmap_fragment:YM,metalnessmap_pars_fragment:qM,morphinstance_vertex:$M,morphcolor_vertex:KM,morphnormal_vertex:ZM,morphtarget_pars_vertex:JM,morphtarget_vertex:QM,normal_fragment_begin:eE,normal_fragment_maps:tE,normal_pars_fragment:nE,normal_pars_vertex:iE,normal_vertex:sE,normalmap_pars_fragment:rE,clearcoat_normal_fragment_begin:aE,clearcoat_normal_fragment_maps:oE,clearcoat_pars_fragment:lE,iridescence_pars_fragment:cE,opaque_fragment:uE,packing:hE,premultiplied_alpha_fragment:dE,project_vertex:fE,dithering_fragment:pE,dithering_pars_fragment:mE,roughnessmap_fragment:gE,roughnessmap_pars_fragment:vE,shadowmap_pars_fragment:xE,shadowmap_pars_vertex:_E,shadowmap_vertex:yE,shadowmask_pars_fragment:SE,skinbase_vertex:ME,skinning_pars_vertex:EE,skinning_vertex:bE,skinnormal_vertex:TE,specularmap_fragment:AE,specularmap_pars_fragment:wE,tonemapping_fragment:RE,tonemapping_pars_fragment:CE,transmission_fragment:PE,transmission_pars_fragment:LE,uv_pars_fragment:DE,uv_pars_vertex:NE,uv_vertex:IE,worldpos_vertex:UE,background_vert:FE,background_frag:OE,backgroundCube_vert:BE,backgroundCube_frag:VE,cube_vert:kE,cube_frag:zE,depth_vert:HE,depth_frag:GE,distance_vert:WE,distance_frag:XE,equirect_vert:jE,equirect_frag:YE,linedashed_vert:qE,linedashed_frag:$E,meshbasic_vert:KE,meshbasic_frag:ZE,meshlambert_vert:JE,meshlambert_frag:QE,meshmatcap_vert:eb,meshmatcap_frag:tb,meshnormal_vert:nb,meshnormal_frag:ib,meshphong_vert:sb,meshphong_frag:rb,meshphysical_vert:ab,meshphysical_frag:ob,meshtoon_vert:lb,meshtoon_frag:cb,points_vert:ub,points_frag:hb,shadow_vert:db,shadow_frag:fb,sprite_vert:pb,sprite_frag:mb},pe={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new Qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new j},probesMax:{value:new j},probesResolution:{value:new j}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},Mn={basic:{uniforms:Ot([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Ot([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Ot([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Ot([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Ot([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Ot([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Ot([pe.points,pe.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Ot([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Ot([pe.common,pe.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Ot([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Ot([pe.sprite,pe.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:Ot([pe.common,pe.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:Ot([pe.lights,pe.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};Mn.physical={uniforms:Ot([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new Qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new Qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new Qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Cr={r:0,b:0,g:0},gb=new gt,am=new Ie;am.set(-1,0,0,0,1,0,0,0,1);function vb(n,e,t,i,s,r){const a=new Ke(0);let o=s===!0?0:1,c,l,u=null,d=0,h=null;function p(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){const S=b.backgroundBlurriness>0;A=e.get(A,S)}return A}function g(b){let A=!1;const S=p(b);S===null?m(a,o):S&&S.isColor&&(m(S,1),A=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function y(b,A){const S=p(A);S&&(S.isCubeTexture||S.mapping===_a)?(l===void 0&&(l=new Hn(new Js(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:as(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,M,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(gb.makeRotationFromEuler(A.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(am),l.material.toneMapped=Ye.getTransfer(S.colorSpace)!==it,(u!==S||d!==S.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,h=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Hn(new Sa(2,2),new Cn({name:"BackgroundMaterial",uniforms:as(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(S.colorSpace)!==it,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=S,d=S.version,h=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function m(b,A){b.getRGB(Cr,nm(n)),t.buffers.color.setClear(Cr.r,Cr.g,Cr.b,A,r)}function f(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,A=1){a.set(b),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:g,addToRenderList:y,dispose:f}}function xb(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(N,F,V,D,k){let $=!1;const Y=d(N,D,V,F);r!==Y&&(r=Y,l(r.object)),$=p(N,D,V,k),$&&g(N,D,V,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,S(N,F,V,D),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return n.createVertexArray()}function l(N){return n.bindVertexArray(N)}function u(N){return n.deleteVertexArray(N)}function d(N,F,V,D){const k=D.wireframe===!0;let $=i[F.id];$===void 0&&($={},i[F.id]=$);const Y=N.isInstancedMesh===!0?N.id:0;let X=$[Y];X===void 0&&(X={},$[Y]=X);let R=X[V.id];R===void 0&&(R={},X[V.id]=R);let O=R[k];return O===void 0&&(O=h(c()),R[k]=O),O}function h(N){const F=[],V=[],D=[];for(let k=0;k<t;k++)F[k]=0,V[k]=0,D[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:V,attributeDivisors:D,object:N,attributes:{},index:null}}function p(N,F,V,D){const k=r.attributes,$=F.attributes;let Y=0;const X=V.getAttributes();for(const R in X)if(X[R].location>=0){const H=k[R];let re=$[R];if(re===void 0&&(R==="instanceMatrix"&&N.instanceMatrix&&(re=N.instanceMatrix),R==="instanceColor"&&N.instanceColor&&(re=N.instanceColor)),H===void 0||H.attribute!==re||re&&H.data!==re.data)return!0;Y++}return r.attributesNum!==Y||r.index!==D}function g(N,F,V,D){const k={},$=F.attributes;let Y=0;const X=V.getAttributes();for(const R in X)if(X[R].location>=0){let H=$[R];H===void 0&&(R==="instanceMatrix"&&N.instanceMatrix&&(H=N.instanceMatrix),R==="instanceColor"&&N.instanceColor&&(H=N.instanceColor));const re={};re.attribute=H,H&&H.data&&(re.data=H.data),k[R]=re,Y++}r.attributes=k,r.attributesNum=Y,r.index=D}function y(){const N=r.newAttributes;for(let F=0,V=N.length;F<V;F++)N[F]=0}function m(N){f(N,0)}function f(N,F){const V=r.newAttributes,D=r.enabledAttributes,k=r.attributeDivisors;V[N]=1,D[N]===0&&(n.enableVertexAttribArray(N),D[N]=1),k[N]!==F&&(n.vertexAttribDivisor(N,F),k[N]=F)}function b(){const N=r.newAttributes,F=r.enabledAttributes;for(let V=0,D=F.length;V<D;V++)F[V]!==N[V]&&(n.disableVertexAttribArray(V),F[V]=0)}function A(N,F,V,D,k,$,Y){Y===!0?n.vertexAttribIPointer(N,F,V,k,$):n.vertexAttribPointer(N,F,V,D,k,$)}function S(N,F,V,D){y();const k=D.attributes,$=V.getAttributes(),Y=F.defaultAttributeValues;for(const X in $){const R=$[X];if(R.location>=0){let O=k[X];if(O===void 0&&(X==="instanceMatrix"&&N.instanceMatrix&&(O=N.instanceMatrix),X==="instanceColor"&&N.instanceColor&&(O=N.instanceColor)),O!==void 0){const H=O.normalized,re=O.itemSize,ae=e.get(O);if(ae===void 0)continue;const Ve=ae.buffer,ke=ae.type,je=ae.bytesPerElement,J=ke===n.INT||ke===n.UNSIGNED_INT||O.gpuType===yc;if(O.isInterleavedBufferAttribute){const ie=O.data,_e=ie.stride,De=O.offset;if(ie.isInstancedInterleavedBuffer){for(let xe=0;xe<R.locationSize;xe++)f(R.location+xe,ie.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let xe=0;xe<R.locationSize;xe++)m(R.location+xe);n.bindBuffer(n.ARRAY_BUFFER,Ve);for(let xe=0;xe<R.locationSize;xe++)A(R.location+xe,re/R.locationSize,ke,H,_e*je,(De+re/R.locationSize*xe)*je,J)}else{if(O.isInstancedBufferAttribute){for(let ie=0;ie<R.locationSize;ie++)f(R.location+ie,O.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let ie=0;ie<R.locationSize;ie++)m(R.location+ie);n.bindBuffer(n.ARRAY_BUFFER,Ve);for(let ie=0;ie<R.locationSize;ie++)A(R.location+ie,re/R.locationSize,ke,H,re*je,re/R.locationSize*ie*je,J)}}else if(Y!==void 0){const H=Y[X];if(H!==void 0)switch(H.length){case 2:n.vertexAttrib2fv(R.location,H);break;case 3:n.vertexAttrib3fv(R.location,H);break;case 4:n.vertexAttrib4fv(R.location,H);break;default:n.vertexAttrib1fv(R.location,H)}}}}b()}function T(){w();for(const N in i){const F=i[N];for(const V in F){const D=F[V];for(const k in D){const $=D[k];for(const Y in $)u($[Y].object),delete $[Y];delete D[k]}}delete i[N]}}function M(N){if(i[N.id]===void 0)return;const F=i[N.id];for(const V in F){const D=F[V];for(const k in D){const $=D[k];for(const Y in $)u($[Y].object),delete $[Y];delete D[k]}}delete i[N.id]}function P(N){for(const F in i){const V=i[F];for(const D in V){const k=V[D];if(k[N.id]===void 0)continue;const $=k[N.id];for(const Y in $)u($[Y].object),delete $[Y];delete k[N.id]}}}function _(N){for(const F in i){const V=i[F],D=N.isInstancedMesh===!0?N.id:0,k=V[D];if(k!==void 0){for(const $ in k){const Y=k[$];for(const X in Y)u(Y[X].object),delete Y[X];delete k[$]}delete V[D],Object.keys(V).length===0&&delete i[F]}}}function w(){L(),a=!0,r!==s&&(r=s,l(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:T,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:y,enableAttribute:m,disableUnusedAttributes:b}}function _b(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let h=0;for(let p=0;p<u;p++)h+=l[p];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function yb(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==dn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const _=P===Rn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Qt&&P!==En&&!_&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Le("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),M=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:S,maxSamples:T,samples:M}}function Sb(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Qn,o=new Ie,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const p=d.length!==0||h||i!==0||s;return s=h,i=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){const g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,f=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const b=r?0:i,A=b*4;let S=f.clippingState||null;c.value=S,S=u(g,h,A,p);for(let T=0;T!==A;++T)S[T]=t[T];f.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,p,g){const y=d!==null?d.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const f=p+y*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let A=0,S=p;A!==y;++A,S+=4)a.copy(d[A]).applyMatrix4(b,o),a.normal.toArray(m,S),m[S+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}const Qi=4,Mb=6,Eb=20,bb=256,_s=new sm,td=new Ke;let vo=null,xo=0,_o=0,yo=!1;const Tb=new j,di=new j;class nd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Tb}=r;vo=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),_o=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(vo,xo,_o),this._renderer.xr.enabled=yo,e.scissorTest=!1,Gi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===bi||e.mapping===rs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vo=this._renderer.getRenderTarget(),xo=this._renderer.getActiveCubeFace(),_o=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:It,minFilter:It,generateMipmaps:!1,type:Rn,format:dn,colorSpace:aa,depthBuffer:!1},s=id(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=id(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Ab(r)),this._blurMaterial=Rb(r,e,t),this._ggxMaterial=wb(r,e,t)}return s}_compileMaterial(e){const t=new Hn(new nn,e);this._renderer.compile(t,_s)}_sceneToCubeUV(e,t,i,s,r){const c=new Jt(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(td),d.toneMapping=An,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Hn(new Js,new Jp({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let f=!1;const b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,f=!0):(m.color.copy(td),f=!0);for(let A=0;A<6;A++){const S=A%3;S===0?(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[A],r.y,r.z)):S===1?(c.up.set(0,0,l[A]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[A],r.z)):(c.up.set(0,l[A],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[A]));const T=this._cubeSize;Gi(s,S*T,A>2?T:0,T,T),d.setRenderTarget(s),f&&d.render(y,c),d.render(e,c)}d.toneMapping=p,d.autoClear=h,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===bi||e.mapping===rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Gi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,_s)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=l*1.25,p=d*h,{_lodMax:g}=this,y=this._sizeLods[i],m=3*y*(i>g-Qi?i-g+Qi:0),f=4*(this._cubeSize-y);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=g-t,Gi(r,m,f,3*y,2*y),s.setRenderTarget(r),s.render(o,_s),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,Gi(e,m,f,3*y,2*y),s.setRenderTarget(e),s.render(o,_s)}_blur(e,t,i,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,a),this._blurPass(r,e,i,i,a)}_blurPass(e,t,i,s,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;const u=this._sizeLods[s],d=3*u*(s>this._lodMax-Qi?s-this._lodMax+Qi:0),h=4*(this._cubeSize-u);Gi(t,d,h,3*u,2*u),a.setRenderTarget(t),a.render(c,_s)}}function Ab(n){const e=[],t=[];let i=n;const s=n-Qi+1+Mb;for(let r=0;r<s;r++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),c=-o,l=1+o,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,h=6,p=3,g=new Float32Array(p*h*d),y=new Float32Array(p*h*d);for(let f=0;f<d;f++){const b=f%3*2/3-1,A=f>2?0:-1,S=[b,A,0,b+2/3,A,0,b+2/3,A+1,0,b,A,0,b+2/3,A+1,0,b,A+1,0];g.set(S,p*h*f);for(let T=0;T<h;T++){const M=u[T*2]*2-1,P=u[T*2+1]*2-1;f===0?di.set(1,P,M):f===1?di.set(-M,1,-P):f===2?di.set(-M,P,1):f===3?di.set(-1,P,-M):f===4?di.set(-M,-1,P):di.set(M,P,-1),di.toArray(y,(f*h+T)*p)}}const m=new nn;m.setAttribute("position",new kn(g,p)),m.setAttribute("outputDirection",new kn(y,p)),t.push(new Hn(m,null)),i>Qi&&i--}return{lodMeshes:t,sizeLods:e}}function id(n,e,t){const i=new pn(n,e,t);return i.texture.mapping=_a,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Gi(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function wb(n,e,t){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:bb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ma(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Rb(n,e,t){return new Cn({name:"SphericalGaussianBlur",defines:{SAMPLES:Eb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ma(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function sd(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function rd(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Ma(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class om extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new em(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Js(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:as(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gt,blending:Bn});r.uniforms.tEquirect.value=t;const a=new Hn(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=It),new DS(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function Cb(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,p=!1){return h==null?null:p?a(h):r(h)}function r(h){if(h&&h.isTexture){const p=h.mapping;if(p===Wa||p===Xa)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new om(g.height);return y.fromEquirectangularTexture(n,h),e.set(h,y),h.addEventListener("dispose",l),o(y.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const p=h.mapping,g=p===Wa||p===Xa,y=p===bi||p===rs;if(g||y){let m=t.get(h);const f=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new nd(n)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const b=h.image;return g&&b&&b.height>0||y&&b&&c(b)?(i===null&&(i=new nd(n)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,p){return p===Wa?h.mapping=bi:p===Xa&&(h.mapping=rs),h}function c(h){let p=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&p++;return p===g}function l(h){const p=h.target;p.removeEventListener("dispose",l);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function u(h){const p=h.target;p.removeEventListener("dispose",u);const g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function Pb(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&es("WebGLRenderer: "+i+" extension not supported."),s}}}function Lb(n,e,t,i){const s={},r=new WeakMap;function a(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];const p=r.get(h);p&&(e.remove(p),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function c(d){const h=d.attributes;for(const p in h)e.update(h[p],n.ARRAY_BUFFER)}function l(d){const h=[],p=d.index,g=d.attributes.position;let y=0;if(g===void 0)return;if(p!==null){const b=p.array;y=p.version;for(let A=0,S=b.length;A<S;A+=3){const T=b[A+0],M=b[A+1],P=b[A+2];h.push(T,M,M,P,P,T)}}else{const b=g.array;y=g.version;for(let A=0,S=b.length/3-1;A<S;A+=3){const T=A+0,M=A+1,P=A+2;h.push(T,M,M,P,P,T)}}const m=new(g.count>=65535?Kp:$p)(h,1);m.version=y;const f=r.get(d);f&&e.remove(f),r.set(d,m)}function u(d){const h=r.get(d);if(h){const p=d.index;p!==null&&h.version<p.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function Db(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,h){n.drawElements(i,h,r,d*a),t.update(h,i,1)}function l(d,h,p){p!==0&&(n.drawElementsInstanced(i,h,r,d*a,p),t.update(h,i,p))}function u(d,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,d,0,p);let y=0;for(let m=0;m<p;m++)y+=h[m];t.update(y,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Nb(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Je("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Ib(n,e,t){const i=new WeakMap,s=new pt;function r(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(o);if(h===void 0||h.count!==d){let w=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let A=0;p===!0&&(A=1),g===!0&&(A=2),y===!0&&(A=3);let S=o.attributes.position.count*A,T=1;S>e.maxTextureSize&&(T=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const M=new Float32Array(S*T*4*d),P=new jp(M,S,T,d);P.type=En,P.needsUpdate=!0;const _=A*4;for(let L=0;L<d;L++){const N=m[L],F=f[L],V=b[L],D=S*T*4*L;for(let k=0;k<N.count;k++){const $=k*_;p===!0&&(s.fromBufferAttribute(N,k),M[D+$+0]=s.x,M[D+$+1]=s.y,M[D+$+2]=s.z,M[D+$+3]=0),g===!0&&(s.fromBufferAttribute(F,k),M[D+$+4]=s.x,M[D+$+5]=s.y,M[D+$+6]=s.z,M[D+$+7]=0),y===!0&&(s.fromBufferAttribute(V,k),M[D+$+8]=s.x,M[D+$+9]=s.y,M[D+$+10]=s.z,M[D+$+11]=V.itemSize===4?s.w:1)}}h={count:d,texture:P,size:new Qe(S,T)},i.set(o,h),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let y=0;y<l.length;y++)p+=l[y];const g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function Ub(n,e,t,i,s){let r=new WeakMap;function a(l){const u=s.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==u&&(p.update(),r.set(p,u))}return h}function o(){r=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const Fb={[Pp]:"LINEAR_TONE_MAPPING",[Lp]:"REINHARD_TONE_MAPPING",[Dp]:"CINEON_TONE_MAPPING",[Np]:"ACES_FILMIC_TONE_MAPPING",[Up]:"AGX_TONE_MAPPING",[Fp]:"NEUTRAL_TONE_MAPPING",[Ip]:"CUSTOM_TONE_MAPPING"};function Ob(n,e,t,i,s,r){const a=new pn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new nn;l.setAttribute("position",new $t([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new $t([0,2,0,0,2,0],2));const u=new CS({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Hn(l,u),h=new sm(-1,1,1,-1,0,1);let p=null,g=null,y=!1,m,f=null,b=[],A=!1;this.setSize=function(S,T){a.setSize(S,T),o!==null&&o.setSize(S,T),c!==null&&c.setSize(S,T);for(let M=0;M<b.length;M++){const P=b[M];P.setSize&&P.setSize(S,T)}},this.setEffects=function(S){b=S,A=b.length>0&&b[0].isRenderPass===!0;const T=a.width,M=a.height;b.length>0&&o===null&&(o=new pn(T,M,{type:Rn,depthBuffer:!1,stencilBuffer:!1}),c=new pn(T,M,{type:Rn,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<b.length;P++){const _=b[P];_.setSize&&_.setSize(T,M)}},this.begin=function(S,T){if(y||S.toneMapping===An&&b.length===0)return!1;if(f=T,T!==null){const M=T.width,P=T.height;(a.width!==M||a.height!==P)&&this.setSize(M,P)}return A===!1&&S.setRenderTarget(a),m=S.toneMapping,S.toneMapping=An,!0},this.hasRenderPass=function(){return A},this.end=function(S,T){S.toneMapping=m,y=!0;let M=a,P=o;for(let _=0;_<b.length;_++){const w=b[_];w.enabled!==!1&&(w.render(S,P,M,T),w.needsSwap!==!1&&(M=P,P=P===o?c:o))}if(p!==S.outputColorSpace||g!==S.toneMapping){p=S.outputColorSpace,g=S.toneMapping,u.defines={},Ye.getTransfer(p)===it&&(u.defines.SRGB_TRANSFER="");const _=Fb[g];_&&(u.defines[_]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=M.texture,S.setRenderTarget(f),S.render(d,h),f=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}const lm=new kt,Vl=new Gs(1,1),cm=new jp,um=new rS,hm=new em,ad=[],od=[],ld=new Float32Array(16),cd=new Float32Array(9),ud=new Float32Array(4);function ds(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=ad[s];if(r===void 0&&(r=new Float32Array(s),ad[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function bt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Tt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ea(n,e){let t=od[e];t===void 0&&(t=new Int32Array(e),od[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Bb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Vb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2fv(this.addr,e),Tt(t,e)}}function kb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;n.uniform3fv(this.addr,e),Tt(t,e)}}function zb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4fv(this.addr,e),Tt(t,e)}}function Hb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;ud.set(i),n.uniformMatrix2fv(this.addr,!1,ud),Tt(t,i)}}function Gb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;cd.set(i),n.uniformMatrix3fv(this.addr,!1,cd),Tt(t,i)}}function Wb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,i))return;ld.set(i),n.uniformMatrix4fv(this.addr,!1,ld),Tt(t,i)}}function Xb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function jb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2iv(this.addr,e),Tt(t,e)}}function Yb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3iv(this.addr,e),Tt(t,e)}}function qb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4iv(this.addr,e),Tt(t,e)}}function $b(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Kb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2uiv(this.addr,e),Tt(t,e)}}function Zb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3uiv(this.addr,e),Tt(t,e)}}function Jb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4uiv(this.addr,e),Tt(t,e)}}function Qb(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Vl.compareFunction=t.isReversedDepthBuffer()?wc:Ac,r=Vl):r=lm,t.setTexture2D(e||r,s)}function e1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||um,s)}function t1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||hm,s)}function n1(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||cm,s)}function i1(n){switch(n){case 5126:return Bb;case 35664:return Vb;case 35665:return kb;case 35666:return zb;case 35674:return Hb;case 35675:return Gb;case 35676:return Wb;case 5124:case 35670:return Xb;case 35667:case 35671:return jb;case 35668:case 35672:return Yb;case 35669:case 35673:return qb;case 5125:return $b;case 36294:return Kb;case 36295:return Zb;case 36296:return Jb;case 35678:case 36198:case 36298:case 36306:case 35682:return Qb;case 35679:case 36299:case 36307:return e1;case 35680:case 36300:case 36308:case 36293:return t1;case 36289:case 36303:case 36311:case 36292:return n1}}function s1(n,e){n.uniform1fv(this.addr,e)}function r1(n,e){const t=ds(e,this.size,2);n.uniform2fv(this.addr,t)}function a1(n,e){const t=ds(e,this.size,3);n.uniform3fv(this.addr,t)}function o1(n,e){const t=ds(e,this.size,4);n.uniform4fv(this.addr,t)}function l1(n,e){const t=ds(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function c1(n,e){const t=ds(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function u1(n,e){const t=ds(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function h1(n,e){n.uniform1iv(this.addr,e)}function d1(n,e){n.uniform2iv(this.addr,e)}function f1(n,e){n.uniform3iv(this.addr,e)}function p1(n,e){n.uniform4iv(this.addr,e)}function m1(n,e){n.uniform1uiv(this.addr,e)}function g1(n,e){n.uniform2uiv(this.addr,e)}function v1(n,e){n.uniform3uiv(this.addr,e)}function x1(n,e){n.uniform4uiv(this.addr,e)}function _1(n,e,t){const i=this.cache,s=e.length,r=Ea(t,s);bt(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Vl:a=lm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function y1(n,e,t){const i=this.cache,s=e.length,r=Ea(t,s);bt(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||um,r[a])}function S1(n,e,t){const i=this.cache,s=e.length,r=Ea(t,s);bt(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||hm,r[a])}function M1(n,e,t){const i=this.cache,s=e.length,r=Ea(t,s);bt(i,r)||(n.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||cm,r[a])}function E1(n){switch(n){case 5126:return s1;case 35664:return r1;case 35665:return a1;case 35666:return o1;case 35674:return l1;case 35675:return c1;case 35676:return u1;case 5124:case 35670:return h1;case 35667:case 35671:return d1;case 35668:case 35672:return f1;case 35669:case 35673:return p1;case 5125:return m1;case 36294:return g1;case 36295:return v1;case 36296:return x1;case 35678:case 36198:case 36298:case 36306:case 35682:return _1;case 35679:case 36299:case 36307:return y1;case 35680:case 36300:case 36308:case 36293:return S1;case 36289:case 36303:case 36311:case 36292:return M1}}class b1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=i1(t.type)}}class T1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=E1(t.type)}}class A1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const So=/(\w+)(\])?(\[|\.)?/g;function hd(n,e){n.seq.push(e),n.map[e.id]=e}function w1(n,e,t){const i=n.name,s=i.length;for(So.lastIndex=0;;){const r=So.exec(i),a=So.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){hd(t,l===void 0?new b1(o,n,e):new T1(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new A1(o),hd(t,d)),t=d}}}class Xr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);w1(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function dd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const R1=37297;let C1=0;function P1(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const fd=new Ie;function L1(n){Ye._getMatrix(fd,Ye.workingColorSpace,n);const e=`mat3( ${fd.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(n)){case oa:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function pd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+P1(n.getShaderSource(e),o)}else return r}function D1(n,e){const t=L1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const N1={[Pp]:"Linear",[Lp]:"Reinhard",[Dp]:"Cineon",[Np]:"ACESFilmic",[Up]:"AgX",[Fp]:"Neutral",[Ip]:"Custom"};function I1(n,e){const t=N1[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Pr=new j;function U1(){Ye.getLuminanceCoefficients(Pr);const n=Pr.x.toFixed(4),e=Pr.y.toFixed(4),t=Pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function F1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ts).join(`
`)}function O1(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function B1(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ts(n){return n!==""}function md(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const V1=/^[ \t]*#include +<([\w\d./]+)>/gm;function kl(n){return n.replace(V1,z1)}const k1=new Map;function z1(n,e){let t=Be[e];if(t===void 0){const i=k1.get(e);if(i!==void 0)t=Be[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return kl(t)}const H1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vd(n){return n.replace(H1,G1)}function G1(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xd(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const W1={[kr]:"SHADOWMAP_TYPE_PCF",[bs]:"SHADOWMAP_TYPE_VSM"};function X1(n){return W1[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const j1={[bi]:"ENVMAP_TYPE_CUBE",[rs]:"ENVMAP_TYPE_CUBE",[_a]:"ENVMAP_TYPE_CUBE_UV"};function Y1(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":j1[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const q1={[rs]:"ENVMAP_MODE_REFRACTION"};function $1(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":q1[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const K1={[Cp]:"ENVMAP_BLENDING_MULTIPLY",[Sy]:"ENVMAP_BLENDING_MIX",[My]:"ENVMAP_BLENDING_ADD"};function Z1(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":K1[n.combine]||"ENVMAP_BLENDING_NONE"}function J1(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Q1(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=X1(t),l=Y1(t),u=$1(t),d=Z1(t),h=J1(t),p=F1(t),g=O1(r),y=s.createProgram();let m,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ts).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ts).join(`
`),f.length>0&&(f+=`
`)):(m=[xd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),f=[xd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==An?"#define TONE_MAPPING":"",t.toneMapping!==An?Be.tonemapping_pars_fragment:"",t.toneMapping!==An?I1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,D1("linearToOutputTexel",t.outputColorSpace),U1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ts).join(`
`)),a=kl(a),a=md(a,t),a=gd(a,t),o=kl(o),o=md(o,t),o=gd(o,t),a=vd(a),o=vd(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const A=b+m+a,S=b+f+o,T=dd(s,s.VERTEX_SHADER,A),M=dd(s,s.FRAGMENT_SHADER,S);s.attachShader(y,T),s.attachShader(y,M),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function P(N){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(y)||"",V=s.getShaderInfoLog(T)||"",D=s.getShaderInfoLog(M)||"",k=F.trim(),$=V.trim(),Y=D.trim();let X=!0,R=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,T,M);else{const O=pd(s,T,"vertex"),H=pd(s,M,"fragment");Je("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+k+`
`+O+`
`+H)}else k!==""?Le("WebGLProgram: Program Info Log:",k):($===""||Y==="")&&(R=!1);R&&(N.diagnostics={runnable:X,programLog:k,vertexShader:{log:$,prefix:m},fragmentShader:{log:Y,prefix:f}})}s.deleteShader(T),s.deleteShader(M),_=new Xr(s,y),w=B1(s,y)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(y,R1)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=C1++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=M,this}let eT=0;class tT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new nT(e),t.set(e,i)),i}}class nT{constructor(e){this.id=eT++,this.code=e,this.usedTimes=0}}function iT(n){return n===Ti||n===sa||n===ra}function sT(n,e,t,i,s,r){const a=new Yp,o=new tT,c=new Set,l=[],u=new Map,d=i.logarithmicDepthBuffer;let h=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function y(_,w,L,N,F,V){const D=N.fog,k=F.geometry,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?N.environment:null,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,X=e.get(_.envMap||$,Y),R=X&&X.mapping===_a?X.image.height:null,O=p[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));const H=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,re=H!==void 0?H.length:0;let ae=0;k.morphAttributes.position!==void 0&&(ae=1),k.morphAttributes.normal!==void 0&&(ae=2),k.morphAttributes.color!==void 0&&(ae=3);let Ve,ke,je,J;if(O){const lt=Mn[O];Ve=lt.vertexShader,ke=lt.fragmentShader}else{Ve=_.vertexShader,ke=_.fragmentShader;const lt=o.getVertexShaderStage(_),et=o.getFragmentShaderStage(_);o.update(_,lt,et),je=lt.id,J=et.id}const ie=n.getRenderTarget(),_e=n.state.buffers.depth.getReversed(),De=F.isInstancedMesh===!0,xe=F.isBatchedMesh===!0,ze=!!_.map,St=!!_.matcap,He=!!X,Ze=!!_.aoMap,ot=!!_.lightMap,We=!!_.bumpMap&&_.wireframe===!1,ht=!!_.normalMap,At=!!_.displacementMap,zt=!!_.emissiveMap,dt=!!_.metalnessMap,vt=!!_.roughnessMap,B=_.anisotropy>0,Pt=_.clearcoat>0,nt=_.dispersion>0,C=_.retroreflectivity>0,x=_.iridescence>0,z=_.sheen>0,q=_.transmission>0,Q=B&&!!_.anisotropyMap,oe=Pt&&!!_.clearcoatMap,le=Pt&&!!_.clearcoatNormalMap,ee=Pt&&!!_.clearcoatRoughnessMap,ne=x&&!!_.iridescenceMap,ce=x&&!!_.iridescenceThicknessMap,we=z&&!!_.sheenColorMap,fe=z&&!!_.sheenRoughnessMap,ue=!!_.specularMap,Re=!!_.specularColorMap,Pe=!!_.specularIntensityMap,Ue=q&&!!_.transmissionMap,U=q&&!!_.thicknessMap,he=!!_.gradientMap,te=!!_.alphaMap,de=_.alphaTest>0,ve=!!_.alphaHash,se=!!_.extensions;let Ce=An;_.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ce=n.toneMapping);const Te={shaderID:O,shaderType:_.type,shaderName:_.name,vertexShader:Ve,fragmentShader:ke,defines:_.defines,customVertexShaderID:je,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:xe,batchingColor:xe&&F._colorsTexture!==null,instancing:De,instancingColor:De&&F.instanceColor!==null,instancingMorph:De&&F.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:ze,matcap:St,envMap:He,envMapMode:He&&X.mapping,envMapCubeUVHeight:R,aoMap:Ze,lightMap:ot,bumpMap:We,normalMap:ht,displacementMap:At,emissiveMap:zt,normalMapObjectSpace:ht&&_.normalMapType===Ty,normalMapTangentSpace:ht&&_.normalMapType===Ah,packedNormalMap:ht&&_.normalMapType===Ah&&iT(_.normalMap.format),metalnessMap:dt,roughnessMap:vt,anisotropy:B,anisotropyMap:Q,clearcoat:Pt,clearcoatMap:oe,clearcoatNormalMap:le,clearcoatRoughnessMap:ee,dispersion:nt,retroreflection:C,iridescence:x,iridescenceMap:ne,iridescenceThicknessMap:ce,sheen:z,sheenColorMap:we,sheenRoughnessMap:fe,specularMap:ue,specularColorMap:Re,specularIntensityMap:Pe,transmission:q,transmissionMap:Ue,thicknessMap:U,gradientMap:he,opaque:_.transparent===!1&&_.blending===Ds&&_.alphaToCoverage===!1,alphaMap:te,alphaTest:de,alphaHash:ve,combine:_.combine,mapUv:ze&&g(_.map.channel),aoMapUv:Ze&&g(_.aoMap.channel),lightMapUv:ot&&g(_.lightMap.channel),bumpMapUv:We&&g(_.bumpMap.channel),normalMapUv:ht&&g(_.normalMap.channel),displacementMapUv:At&&g(_.displacementMap.channel),emissiveMapUv:zt&&g(_.emissiveMap.channel),metalnessMapUv:dt&&g(_.metalnessMap.channel),roughnessMapUv:vt&&g(_.roughnessMap.channel),anisotropyMapUv:Q&&g(_.anisotropyMap.channel),clearcoatMapUv:oe&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:we&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:fe&&g(_.sheenRoughnessMap.channel),specularMapUv:ue&&g(_.specularMap.channel),specularColorMapUv:Re&&g(_.specularColorMap.channel),specularIntensityMapUv:Pe&&g(_.specularIntensityMap.channel),transmissionMapUv:Ue&&g(_.transmissionMap.channel),thicknessMapUv:U&&g(_.thicknessMap.channel),alphaMapUv:te&&g(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(ht||B),vertexNormals:!!k.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(ze||te),fog:!!D,useFog:_.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||k.attributes.normal===void 0&&ht===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:_e,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:ae,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ce,decodeVideoTexture:ze&&_.map.isVideoTexture===!0&&Ye.getTransfer(_.map.colorSpace)===it,decodeVideoTextureEmissive:zt&&_.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(_.emissiveMap.colorSpace)===it,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Fn,flipSided:_.side===Gt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||xe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function m(_){const w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)w.push(L),w.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(f(w,_),b(w,_),w.push(n.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function f(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numSunLights),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numSunLightShadows),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function b(_,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){const w=p[_.type];let L;if(w){const N=Mn[w];L=AS.clone(N.uniforms)}else L=_.uniforms;return L}function S(_,w){let L=u.get(w);return L!==void 0?++L.usedTimes:(L=new Q1(n,w,_,s),l.push(L),u.set(w,L)),L}function T(_){if(--_.usedTimes===0){const w=l.indexOf(_);l[w]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function M(_){o.remove(_)}function P(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:A,acquireProgram:S,releaseProgram:T,releaseShaderCache:M,programs:l,dispose:P}}function rT(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,c){n.get(a)[o]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function aT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function _d(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function yd(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function o(h,p,g,y,m,f){let b=n[e];return b===void 0?(b={id:h.id,object:h,geometry:p,material:g,materialVariant:a(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:f},n[e]=b):(b.id=h.id,b.object=h,b.geometry=p,b.material=g,b.materialVariant=a(h),b.groupOrder=y,b.renderOrder=h.renderOrder,b.z=m,b.group=f),e++,b}function c(h,p,g,y,m,f,b){b.reversedDepth===!0&&(m=-m);const A=o(h,p,g,y,m,f);g.transmission>0?i.push(A):g.transparent===!0?s.push(A):t.push(A)}function l(h,p,g,y,m,f){const b=o(h,p,g,y,m,f);g.transmission>0?i.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function u(h,p){t.length>1&&t.sort(h||aT),i.length>1&&i.sort(p||_d),s.length>1&&s.sort(p||_d)}function d(){for(let h=e,p=n.length;h<p;h++){const g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function oT(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new yd,n.set(i,[a])):s>=r.length?(a=new yd,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function lT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new j,color:new Ke};break;case"SpotLight":t={position:new j,direction:new j,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new j,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new j,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new j,halfWidth:new j,halfHeight:new j};break}return n[e.id]=t,t}}}function cT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let uT=0;function hT(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function dT(n){const e=new lT,t=cT(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new j);const s=new j,r=new gt,a=new gt;function o(l){let u=0,d=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let p=0,g=0,y=0,m=0,f=0,b=0,A=0,S=0,T=0,M=0,P=0,_=0,w=0,L=0;l.sort(hT);for(let F=0,V=l.length;F<V;F++){const D=l[F],k=D.color,$=D.intensity,Y=D.distance;let X=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ti?X=D.shadow.map.texture:X=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=k.r*$,d+=k.g*$,h+=k.b*$;else if(D.isLightProbe){for(let R=0;R<9;R++)i.probe[R].addScaledVector(D.sh.coefficients[R],$);L++}else if(D.isSunLight){const R=e.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const O=D.shadow,H=t.get(D);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize.copy(O.mapSize).multiply(O.getFrameExtents()),i.sunShadow[g]=H,i.sunShadowMap[g]=X;const re=O.getViewportCount();for(let ae=0;ae<re;ae++)i.sunShadowMatrix[y+ae]=O.getMatrix(ae),i.sunShadowCascade[y+ae]=O._cascadeData[ae];y+=re,g++}i.sun[p]=R,p++}else if(D.isDirectionalLight){const R=e.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const O=D.shadow,H=t.get(D);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,i.directionalShadow[m]=H,i.directionalShadowMap[m]=X,i.directionalShadowMatrix[m]=D.shadow.matrix,T++}i.directional[m]=R,m++}else if(D.isSpotLight){const R=e.get(D);R.position.setFromMatrixPosition(D.matrixWorld),R.color.copy(k).multiplyScalar($),R.distance=Y,R.coneCos=Math.cos(D.angle),R.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),R.decay=D.decay,i.spot[b]=R;const O=D.shadow;if(D.map&&(i.spotLightMap[_]=D.map,_++,O.updateMatrices(D),D.castShadow&&w++),i.spotLightMatrix[b]=O.matrix,D.castShadow){const H=t.get(D);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,i.spotShadow[b]=H,i.spotShadowMap[b]=X,P++}b++}else if(D.isRectAreaLight){const R=e.get(D);R.color.copy(k).multiplyScalar($),R.halfWidth.set(D.width*.5,0,0),R.halfHeight.set(0,D.height*.5,0),i.rectArea[A]=R,A++}else if(D.isPointLight){const R=e.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),R.distance=D.distance,R.decay=D.decay,D.castShadow){const O=D.shadow,H=t.get(D);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,H.shadowCameraNear=O.camera.near,H.shadowCameraFar=O.camera.far,i.pointShadow[f]=H,i.pointShadowMap[f]=X,i.pointShadowMatrix[f]=D.shadow.matrix,M++}i.point[f]=R,f++}else if(D.isHemisphereLight){const R=e.get(D);R.skyColor.copy(D.color).multiplyScalar($),R.groundColor.copy(D.groundColor).multiplyScalar($),i.hemi[S]=R,S++}}A>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pe.LTC_FLOAT_1,i.rectAreaLTC2=pe.LTC_FLOAT_2):(i.rectAreaLTC1=pe.LTC_HALF_1,i.rectAreaLTC2=pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const N=i.hash;(N.sunLength!==p||N.directionalLength!==m||N.pointLength!==f||N.spotLength!==b||N.rectAreaLength!==A||N.hemiLength!==S||N.numSunShadows!==g||N.numDirectionalShadows!==T||N.numPointShadows!==M||N.numSpotShadows!==P||N.numSpotMaps!==_||N.numLightProbes!==L)&&(i.sun.length=p,i.directional.length=m,i.spot.length=b,i.rectArea.length=A,i.point.length=f,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=y,i.sunShadowCascade.length=y,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=P,i.spotShadowMap.length=P,i.spotLightMatrix.length=P+_-w,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=L,N.sunLength=p,N.directionalLength=m,N.pointLength=f,N.spotLength=b,N.rectAreaLength=A,N.hemiLength=S,N.numSunShadows=g,N.numDirectionalShadows=T,N.numPointShadows=M,N.numSpotShadows=P,N.numSpotMaps=_,N.numLightProbes=L,i.version=uT++)}function c(l,u){let d=0,h=0,p=0,g=0,y=0,m=0;const f=u.matrixWorldInverse;for(let b=0,A=l.length;b<A;b++){const S=l[b];if(S.isSunLight){const T=i.sun[d];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(f),d++}else if(S.isDirectionalLight){const T=i.directional[h];T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(f),h++}else if(S.isSpotLight){const T=i.spot[g];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),T.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(f),g++}else if(S.isRectAreaLight){const T=i.rectArea[y];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),a.identity(),r.copy(S.matrixWorld),r.premultiply(f),a.extractRotation(r),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),y++}else if(S.isPointLight){const T=i.point[p];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),p++}else if(S.isHemisphereLight){const T=i.hemi[m];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(f),m++}}}return{setup:o,setupView:c,state:i}}function Sd(n){const e=new dT(n),t=[],i=[],s=[];function r(h){d.camera=h,t.length=0,i.length=0,s.length=0}function a(h){t.push(h)}function o(h){i.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function fT(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Sd(n),e.set(s,[o])):r>=a.length?(o=new Sd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const pT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,gT=[new j(1,0,0),new j(-1,0,0),new j(0,1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1)],vT=[new j(0,-1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1),new j(0,-1,0),new j(0,-1,0)],Md=new gt,ys=new j,Mo=new j;function xT(n,e,t){let i=new Qp;const s=new Qe,r=new Qe,a=new pt,o=new PS,c=new LS,l={},u=t.maxTextureSize,d={[Ei]:Gt,[Gt]:Ei,[Fn]:Fn},h=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qe},radius:{value:4}},vertexShader:pT,fragmentShader:mT}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new nn;g.setAttribute("position",new kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Hn(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kr;let f=this.type;this.render=function(M,P,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===ny&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=kr);const w=n.getRenderTarget(),L=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Bn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const V=f!==this.type;V&&P.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(k=>k.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,k=M.length;D<k;D++){const $=M[D],Y=$.shadow;if(Y===void 0){Le("WebGLShadowMap:",$,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const X=Y.getFrameExtents();s.multiply(X),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/X.x),s.x=r.x*X.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/X.y),s.y=r.y*X.y,Y.mapSize.y=r.y));const R=n.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=R,Y.map===null||V===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===bs){if($.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new pn(s.x,s.y,{format:Ti,type:Rn,minFilter:It,magFilter:It,generateMipmaps:!1}),Y.map.texture.name=$.name+".shadowMap",Y.map.depthTexture=new Gs(s.x,s.y,En),Y.map.depthTexture.name=$.name+".shadowMapDepth",Y.map.depthTexture.format=zn,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Ct,Y.map.depthTexture.magFilter=Ct}else $.isPointLight?(Y.map=new om(s.x),Y.map.depthTexture=new bS(s.x,wn)):(Y.map=new pn(s.x,s.y),Y.map.depthTexture=new Gs(s.x,s.y,wn)),Y.map.depthTexture.name=$.name+".shadowMap",Y.map.depthTexture.format=zn,this.type===kr?(Y.map.depthTexture.compareFunction=R?wc:Ac,Y.map.depthTexture.minFilter=It,Y.map.depthTexture.magFilter=It):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Ct,Y.map.depthTexture.magFilter=Ct);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==s.x||Y.map.height!==s.y)&&Y.map.setSize(s.x,s.y);const O=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();$.isPointLight!==!0&&Y.updateMatrices($,_);for(let H=0;H<O;H++){const re=Y.getCamera(H);if($.isPointLight){const ae=Y.camera,Ve=Y.matrix,ke=$.distance||ae.far;ke!==ae.far&&(ae.far=ke,ae.updateProjectionMatrix()),ys.setFromMatrixPosition($.matrixWorld),ae.position.copy(ys),Mo.copy(ae.position),Mo.add(gT[H]),ae.up.copy(vT[H]),ae.lookAt(Mo),ae.updateMatrixWorld(),Ve.makeTranslation(-ys.x,-ys.y,-ys.z),Md.multiplyMatrices(ae.projectionMatrix,ae.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Md,ae.coordinateSystem,ae.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)n.setRenderTarget(Y.map,H),n.clear();else{H===0&&(n.setRenderTarget(Y.map),n.clear());const ae=Y.getViewport(H);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),F.viewport(a)}i=Y.getFrustum(H),S(P,_,re,$,this.type)}Y.isPointLightShadow!==!0&&this.type===bs&&b(Y,_),Y.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(w,L,N)};function b(M,P){const _=e.update(y);h.defines.VSM_SAMPLES!==M.blurSamples&&(h.defines.VSM_SAMPLES=M.blurSamples,p.defines.VSM_SAMPLES=M.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),M.mapPass===null?M.mapPass=new pn(s.x,s.y,{format:Ti,type:Rn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),h.uniforms.shadow_pass.value=M.map.depthTexture,h.uniforms.resolution.value.set(M.map.width,M.map.height),h.uniforms.radius.value=M.radius,n.setRenderTarget(M.mapPass),n.clear(),n.renderBufferDirect(P,null,_,h,y,null),p.uniforms.shadow_pass.value=M.mapPass.texture,p.uniforms.resolution.value.set(M.map.width,M.map.height),p.uniforms.radius.value=M.radius,n.setRenderTarget(M.map),n.clear(),n.renderBufferDirect(P,null,_,p,y,null)}function A(M,P,_,w){let L=null;const N=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(N!==void 0)L=N;else if(L=_.isPointLight===!0?c:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=L.uuid,V=P.uuid;let D=l[F];D===void 0&&(D={},l[F]=D);let k=D[V];k===void 0&&(k=L.clone(),D[V]=k,P.addEventListener("dispose",T)),L=k}if(L.visible=P.visible,L.wireframe=P.wireframe,w===bs?L.side=P.shadowSide!==null?P.shadowSide:P.side:L.side=P.shadowSide!==null?P.shadowSide:d[P.side],L.alphaMap=P.alphaMap,L.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,L.map=P.map,L.clipShadows=P.clipShadows,L.clippingPlanes=P.clippingPlanes,L.clipIntersection=P.clipIntersection,L.displacementMap=P.displacementMap,L.displacementScale=P.displacementScale,L.displacementBias=P.displacementBias,L.wireframeLinewidth=P.wireframeLinewidth,L.linewidth=P.linewidth,_.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const F=n.properties.get(L);F.light=_}return L}function S(M,P,_,w,L){if(M.visible===!1)return;if(M.layers.test(P.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&L===bs)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);const V=e.update(M),D=M.material;if(Array.isArray(D)){const k=V.groups;for(let $=0,Y=k.length;$<Y;$++){const X=k[$],R=D[X.materialIndex];if(R&&R.visible){const O=A(M,R,w,L);M.onBeforeShadow(n,M,P,_,V,O,X),n.renderBufferDirect(_,null,V,O,M,X),M.onAfterShadow(n,M,P,_,V,O,X)}}}else if(D.visible){const k=A(M,D,w,L);M.onBeforeShadow(n,M,P,_,V,k,null),n.renderBufferDirect(_,null,V,k,M,null),M.onAfterShadow(n,M,P,_,V,k,null)}}const F=M.children;for(let V=0,D=F.length;V<D;V++)S(F[V],P,_,w,L)}function T(M){M.target.removeEventListener("dispose",T);for(const _ in l){const w=l[_],L=M.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function _T(n,e){function t(){let U=!1;const he=new pt;let te=null;const de=new pt(0,0,0,0);return{setMask:function(ve){te!==ve&&!U&&(n.colorMask(ve,ve,ve,ve),te=ve)},setLocked:function(ve){U=ve},setClear:function(ve,se,Ce,Te,lt){lt===!0&&(ve*=Te,se*=Te,Ce*=Te),he.set(ve,se,Ce,Te),de.equals(he)===!1&&(n.clearColor(ve,se,Ce,Te),de.copy(he))},reset:function(){U=!1,te=null,de.set(-1,0,0,0)}}}function i(){let U=!1,he=!1,te=null,de=null,ve=null;return{setReversed:function(se){if(he!==se){const Ce=e.get("EXT_clip_control");se?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),he=se;const Te=ve;ve=null,this.setClear(Te)}},getReversed:function(){return he},setTest:function(se){se?ie(n.DEPTH_TEST):_e(n.DEPTH_TEST)},setMask:function(se){te!==se&&!U&&(n.depthMask(se),te=se)},setFunc:function(se){if(he&&(se=Oy[se]),de!==se){switch(se){case Qo:n.depthFunc(n.NEVER);break;case el:n.depthFunc(n.ALWAYS);break;case tl:n.depthFunc(n.LESS);break;case Vs:n.depthFunc(n.LEQUAL);break;case nl:n.depthFunc(n.EQUAL);break;case il:n.depthFunc(n.GEQUAL);break;case sl:n.depthFunc(n.GREATER);break;case rl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=se}},setLocked:function(se){U=se},setClear:function(se){ve!==se&&(ve=se,he&&(se=1-se),n.clearDepth(se))},reset:function(){U=!1,te=null,de=null,ve=null,he=!1}}}function s(){let U=!1,he=null,te=null,de=null,ve=null,se=null,Ce=null,Te=null,lt=null;return{setTest:function(et){U||(et?ie(n.STENCIL_TEST):_e(n.STENCIL_TEST))},setMask:function(et){he!==et&&!U&&(n.stencilMask(et),he=et)},setFunc:function(et,sn,gn){(te!==et||de!==sn||ve!==gn)&&(n.stencilFunc(et,sn,gn),te=et,de=sn,ve=gn)},setOp:function(et,sn,gn){(se!==et||Ce!==sn||Te!==gn)&&(n.stencilOp(et,sn,gn),se=et,Ce=sn,Te=gn)},setLocked:function(et){U=et},setClear:function(et){lt!==et&&(n.clearStencil(et),lt=et)},reset:function(){U=!1,he=null,te=null,de=null,ve=null,se=null,Ce=null,Te=null,lt=null}}}const r=new t,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let u={},d={},h={},p=new WeakMap,g=[],y=null,m=!1,f=null,b=null,A=null,S=null,T=null,M=null,P=null,_=new Ke(0,0,0),w=0,L=!1,N=null,F=null,V=null,D=null,k=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,X=0;const R=n.getParameter(n.VERSION);R.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(R)[1]),Y=X>=1):R.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(R)[1]),Y=X>=2);let O=null,H={};const re=n.getParameter(n.SCISSOR_BOX),ae=n.getParameter(n.VIEWPORT),Ve=new pt().fromArray(re),ke=new pt().fromArray(ae);function je(U,he,te,de){const ve=new Uint8Array(4),se=n.createTexture();n.bindTexture(U,se),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<te;Ce++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(he,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(he+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return se}const J={};J[n.TEXTURE_2D]=je(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=je(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=je(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=je(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(Vs),We(!1),ht(Mh),ie(n.CULL_FACE),Ze(Bn);function ie(U){u[U]!==!0&&(n.enable(U),u[U]=!0)}function _e(U){u[U]!==!1&&(n.disable(U),u[U]=!1)}function De(U,he){return h[U]!==he?(n.bindFramebuffer(U,he),h[U]=he,U===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=he),U===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=he),!0):!1}function xe(U,he){let te=g,de=!1;if(U){te=p.get(he),te===void 0&&(te=[],p.set(he,te));const ve=U.textures;if(te.length!==ve.length||te[0]!==n.COLOR_ATTACHMENT0){for(let se=0,Ce=ve.length;se<Ce;se++)te[se]=n.COLOR_ATTACHMENT0+se;te.length=ve.length,de=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,de=!0);de&&n.drawBuffers(te)}function ze(U){return y!==U?(n.useProgram(U),y=U,!0):!1}const St={[ji]:n.FUNC_ADD,[sy]:n.FUNC_SUBTRACT,[ry]:n.FUNC_REVERSE_SUBTRACT};St[ay]=n.MIN,St[oy]=n.MAX;const He={[ly]:n.ZERO,[cy]:n.ONE,[uy]:n.SRC_COLOR,[wp]:n.SRC_ALPHA,[gy]:n.SRC_ALPHA_SATURATE,[py]:n.DST_COLOR,[dy]:n.DST_ALPHA,[hy]:n.ONE_MINUS_SRC_COLOR,[Rp]:n.ONE_MINUS_SRC_ALPHA,[my]:n.ONE_MINUS_DST_COLOR,[fy]:n.ONE_MINUS_DST_ALPHA,[vy]:n.CONSTANT_COLOR,[xy]:n.ONE_MINUS_CONSTANT_COLOR,[_y]:n.CONSTANT_ALPHA,[yy]:n.ONE_MINUS_CONSTANT_ALPHA};function Ze(U,he,te,de,ve,se,Ce,Te,lt,et){if(U===Bn){m===!0&&(_e(n.BLEND),m=!1);return}if(m===!1&&(ie(n.BLEND),m=!0),U!==iy){if(U!==f||et!==L){if((b!==ji||T!==ji)&&(n.blendEquation(n.FUNC_ADD),b=ji,T=ji),et)switch(U){case Ds:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eh:n.blendFunc(n.ONE,n.ONE);break;case bh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Th:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",U);break}else switch(U){case Ds:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case bh:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Th:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",U);break}A=null,S=null,M=null,P=null,_.set(0,0,0),w=0,f=U,L=et}return}ve=ve||he,se=se||te,Ce=Ce||de,(he!==b||ve!==T)&&(n.blendEquationSeparate(St[he],St[ve]),b=he,T=ve),(te!==A||de!==S||se!==M||Ce!==P)&&(n.blendFuncSeparate(He[te],He[de],He[se],He[Ce]),A=te,S=de,M=se,P=Ce),(Te.equals(_)===!1||lt!==w)&&(n.blendColor(Te.r,Te.g,Te.b,lt),_.copy(Te),w=lt),f=U,L=!1}function ot(U,he){U.side===Fn?_e(n.CULL_FACE):ie(n.CULL_FACE);let te=U.side===Gt;he&&(te=!te),We(te),U.blending===Ds&&U.transparent===!1?Ze(Bn):Ze(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const de=U.stencilWrite;o.setTest(de),de&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),zt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):_e(n.SAMPLE_ALPHA_TO_COVERAGE)}function We(U){N!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),N=U)}function ht(U){U!==ey?(ie(n.CULL_FACE),U!==F&&(U===Mh?n.cullFace(n.BACK):U===ty?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):_e(n.CULL_FACE),F=U}function At(U){U!==V&&(Y&&n.lineWidth(U),V=U)}function zt(U,he,te){U?(ie(n.POLYGON_OFFSET_FILL),(D!==he||k!==te)&&(D=he,k=te,a.getReversed()&&(he=-he),n.polygonOffset(he,te))):_e(n.POLYGON_OFFSET_FILL)}function dt(U){U?ie(n.SCISSOR_TEST):_e(n.SCISSOR_TEST)}function vt(U){U===void 0&&(U=n.TEXTURE0+$-1),O!==U&&(n.activeTexture(U),O=U)}function B(U,he,te){te===void 0&&(O===null?te=n.TEXTURE0+$-1:te=O);let de=H[te];de===void 0&&(de={type:void 0,texture:void 0},H[te]=de),(de.type!==U||de.texture!==he)&&(O!==te&&(n.activeTexture(te),O=te),n.bindTexture(U,he||J[U]),de.type=U,de.texture=he)}function Pt(){const U=H[O];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function nt(){try{n.compressedTexImage2D(...arguments)}catch(U){Je("WebGLState:",U)}}function C(){try{n.compressedTexImage3D(...arguments)}catch(U){Je("WebGLState:",U)}}function x(){try{n.texSubImage2D(...arguments)}catch(U){Je("WebGLState:",U)}}function z(){try{n.texSubImage3D(...arguments)}catch(U){Je("WebGLState:",U)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(U){Je("WebGLState:",U)}}function Q(){try{n.compressedTexSubImage3D(...arguments)}catch(U){Je("WebGLState:",U)}}function oe(){try{n.texStorage2D(...arguments)}catch(U){Je("WebGLState:",U)}}function le(){try{n.texStorage3D(...arguments)}catch(U){Je("WebGLState:",U)}}function ee(){try{n.texImage2D(...arguments)}catch(U){Je("WebGLState:",U)}}function ne(){try{n.texImage3D(...arguments)}catch(U){Je("WebGLState:",U)}}function ce(U){return d[U]!==void 0?d[U]:n.getParameter(U)}function we(U,he){d[U]!==he&&(n.pixelStorei(U,he),d[U]=he)}function fe(U){Ve.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Ve.copy(U))}function ue(U){ke.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),ke.copy(U))}function Re(U,he){let te=l.get(he);te===void 0&&(te=new WeakMap,l.set(he,te));let de=te.get(U);de===void 0&&(de=n.getUniformBlockIndex(he,U.name),te.set(U,de))}function Pe(U,he){const de=l.get(he).get(U);c.get(he)!==de&&(n.uniformBlockBinding(he,de,U.__bindingPointIndex),c.set(he,de))}function Ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},O=null,H={},h={},p=new WeakMap,g=[],y=null,m=!1,f=null,b=null,A=null,S=null,T=null,M=null,P=null,_=new Ke(0,0,0),w=0,L=!1,N=null,F=null,V=null,D=null,k=null,Ve.set(0,0,n.canvas.width,n.canvas.height),ke.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:_e,bindFramebuffer:De,drawBuffers:xe,useProgram:ze,setBlending:Ze,setMaterial:ot,setFlipSided:We,setCullFace:ht,setLineWidth:At,setPolygonOffset:zt,setScissorTest:dt,activeTexture:vt,bindTexture:B,unbindTexture:Pt,compressedTexImage2D:nt,compressedTexImage3D:C,texImage2D:ee,texImage3D:ne,pixelStorei:we,getParameter:ce,updateUBOMapping:Re,uniformBlockBinding:Pe,texStorage2D:oe,texStorage3D:le,texSubImage2D:x,texSubImage3D:z,compressedTexSubImage2D:q,compressedTexSubImage3D:Q,scissor:fe,viewport:ue,reset:Ue}}function yT(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Qe,u=new WeakMap,d=new Set;let h;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(C,x){return g?new OffscreenCanvas(C,x):ca("canvas")}function m(C,x,z){let q=1;const Q=nt(C);if((Q.width>z||Q.height>z)&&(q=z/Math.max(Q.width,Q.height)),q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const oe=Math.floor(q*Q.width),le=Math.floor(q*Q.height);h===void 0&&(h=y(oe,le));const ee=x?y(oe,le):h;return ee.width=oe,ee.height=le,ee.getContext("2d").drawImage(C,0,0,oe,le),Le("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+oe+"x"+le+")."),ee}else return"data"in C&&Le("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function f(C){return C.generateMipmaps}function b(C){n.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(C,x,z,q,Q,oe=!1){if(C!==null){if(n[C]!==void 0)return n[C];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let le;q&&(le=e.get("EXT_texture_norm16"),le||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=x;if(x===n.RED&&(z===n.FLOAT&&(ee=n.R32F),z===n.HALF_FLOAT&&(ee=n.R16F),z===n.UNSIGNED_BYTE&&(ee=n.R8),z===n.UNSIGNED_SHORT&&le&&(ee=le.R16_EXT),z===n.SHORT&&le&&(ee=le.R16_SNORM_EXT)),x===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.R8UI),z===n.UNSIGNED_SHORT&&(ee=n.R16UI),z===n.UNSIGNED_INT&&(ee=n.R32UI),z===n.BYTE&&(ee=n.R8I),z===n.SHORT&&(ee=n.R16I),z===n.INT&&(ee=n.R32I)),x===n.RG&&(z===n.FLOAT&&(ee=n.RG32F),z===n.HALF_FLOAT&&(ee=n.RG16F),z===n.UNSIGNED_BYTE&&(ee=n.RG8),z===n.UNSIGNED_SHORT&&le&&(ee=le.RG16_EXT),z===n.SHORT&&le&&(ee=le.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RG8UI),z===n.UNSIGNED_SHORT&&(ee=n.RG16UI),z===n.UNSIGNED_INT&&(ee=n.RG32UI),z===n.BYTE&&(ee=n.RG8I),z===n.SHORT&&(ee=n.RG16I),z===n.INT&&(ee=n.RG32I)),x===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),z===n.UNSIGNED_INT&&(ee=n.RGB32UI),z===n.BYTE&&(ee=n.RGB8I),z===n.SHORT&&(ee=n.RGB16I),z===n.INT&&(ee=n.RGB32I)),x===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),z===n.UNSIGNED_INT&&(ee=n.RGBA32UI),z===n.BYTE&&(ee=n.RGBA8I),z===n.SHORT&&(ee=n.RGBA16I),z===n.INT&&(ee=n.RGBA32I)),x===n.RGB&&(z===n.UNSIGNED_SHORT&&le&&(ee=le.RGB16_EXT),z===n.SHORT&&le&&(ee=le.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),x===n.RGBA){const ne=oe?oa:Ye.getTransfer(Q);z===n.FLOAT&&(ee=n.RGBA32F),z===n.HALF_FLOAT&&(ee=n.RGBA16F),z===n.UNSIGNED_BYTE&&(ee=ne===it?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&le&&(ee=le.RGBA16_EXT),z===n.SHORT&&le&&(ee=le.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function T(C,x){let z;return C?x===null||x===wn||x===zs?z=n.DEPTH24_STENCIL8:x===En?z=n.DEPTH32F_STENCIL8:x===ks&&(z=n.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===wn||x===zs?z=n.DEPTH_COMPONENT24:x===En?z=n.DEPTH_COMPONENT32F:x===ks&&(z=n.DEPTH_COMPONENT16),z}function M(C,x){return f(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ct&&C.minFilter!==It?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function P(C){const x=C.target;x.removeEventListener("dispose",P),w(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function _(C){const x=C.target;x.removeEventListener("dispose",_),N(x)}function w(C){const x=i.get(C);if(x.__webglInit===void 0)return;const z=C.source,q=p.get(z);if(q){const Q=q[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&L(C),Object.keys(q).length===0&&p.delete(z)}i.remove(C)}function L(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const z=C.source,q=p.get(z);delete q[x.__cacheKey],a.memory.textures--}function N(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(x.__webglFramebuffer[q]))for(let Q=0;Q<x.__webglFramebuffer[q].length;Q++)n.deleteFramebuffer(x.__webglFramebuffer[q][Q]);else n.deleteFramebuffer(x.__webglFramebuffer[q]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[q])}else{if(Array.isArray(x.__webglFramebuffer))for(let q=0;q<x.__webglFramebuffer.length;q++)n.deleteFramebuffer(x.__webglFramebuffer[q]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let q=0;q<x.__webglColorRenderbuffer.length;q++)x.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[q]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const z=C.textures;for(let q=0,Q=z.length;q<Q;q++){const oe=i.get(z[q]);oe.__webglTexture&&(n.deleteTexture(oe.__webglTexture),a.memory.textures--),i.remove(z[q])}i.remove(C)}let F=0;function V(){F=0}function D(){return F}function k(C){F=C}function $(){const C=F;return C>=s.maxTextures&&Le("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,C}function Y(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function X(C,x){const z=i.get(C);if(C.isVideoTexture&&B(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){const q=C.image;if(q===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(z,C,x);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+x)}function R(C,x){const z=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){_e(z,C,x);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+x)}function O(C,x){const z=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){_e(z,C,x);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+x)}function H(C,x){const z=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){De(z,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+x)}const re={[al]:n.REPEAT,[On]:n.CLAMP_TO_EDGE,[ol]:n.MIRRORED_REPEAT},ae={[Ct]:n.NEAREST,[Ey]:n.NEAREST_MIPMAP_NEAREST,[or]:n.NEAREST_MIPMAP_LINEAR,[It]:n.LINEAR,[ja]:n.LINEAR_MIPMAP_NEAREST,[_i]:n.LINEAR_MIPMAP_LINEAR},Ve={[wy]:n.NEVER,[Dy]:n.ALWAYS,[Ry]:n.LESS,[Ac]:n.LEQUAL,[Cy]:n.EQUAL,[wc]:n.GEQUAL,[Py]:n.GREATER,[Ly]:n.NOTEQUAL};function ke(C,x){if(x.type===En&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===It||x.magFilter===ja||x.magFilter===or||x.magFilter===_i||x.minFilter===It||x.minFilter===ja||x.minFilter===or||x.minFilter===_i)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,re[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,re[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,re[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,ae[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,ae[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,Ve[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ct||x.minFilter!==or&&x.minFilter!==_i||x.type===En&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function je(C,x){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",P));const q=x.source;let Q=p.get(q);Q===void 0&&(Q={},p.set(q,Q));const oe=Y(x);if(oe!==C.__cacheKey){Q[oe]===void 0&&(Q[oe]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Q[oe].usedTimes++;const le=Q[C.__cacheKey];le!==void 0&&(Q[C.__cacheKey].usedTimes--,le.usedTimes===0&&L(x)),C.__cacheKey=oe,C.__webglTexture=Q[oe].texture}return z}function J(C,x,z){return Math.floor(Math.floor(C/z)/x)}function ie(C,x,z,q){const oe=C.updateRanges;if(oe.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,z,q,x.data);else{oe.sort((we,fe)=>we.start-fe.start);let le=0;for(let we=1;we<oe.length;we++){const fe=oe[le],ue=oe[we],Re=fe.start+fe.count,Pe=J(ue.start,x.width,4),Ue=J(fe.start,x.width,4);ue.start<=Re+1&&Pe===Ue&&J(ue.start+ue.count-1,x.width,4)===Pe?fe.count=Math.max(fe.count,ue.start+ue.count-fe.start):(++le,oe[le]=ue)}oe.length=le+1;const ee=t.getParameter(n.UNPACK_ROW_LENGTH),ne=t.getParameter(n.UNPACK_SKIP_PIXELS),ce=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let we=0,fe=oe.length;we<fe;we++){const ue=oe[we],Re=Math.floor(ue.start/4),Pe=Math.ceil(ue.count/4),Ue=Re%x.width,U=Math.floor(Re/x.width),he=Pe,te=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,U),t.texSubImage2D(n.TEXTURE_2D,0,Ue,U,he,te,z,q,x.data)}C.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,ee),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(n.UNPACK_SKIP_ROWS,ce)}}function _e(C,x,z){let q=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(q=n.TEXTURE_3D);const Q=je(C,x),oe=x.source;t.bindTexture(q,C.__webglTexture,n.TEXTURE0+z);const le=i.get(oe);if(oe.version!==le.__version||Q===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const te=Ye.getPrimaries(Ye.workingColorSpace),de=x.colorSpace===ei?null:Ye.getPrimaries(x.colorSpace),ve=x.colorSpace===ei||te===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let ne=m(x.image,!1,s.maxTextureSize);ne=Pt(x,ne);const ce=r.convert(x.format,x.colorSpace),we=r.convert(x.type);let fe=S(x.internalFormat,ce,we,x.normalized,x.colorSpace,x.isVideoTexture);ke(q,x);let ue;const Re=x.mipmaps,Pe=x.isVideoTexture!==!0,Ue=le.__version===void 0||Q===!0,U=oe.dataReady,he=M(x,ne);if(x.isDepthTexture)fe=T(x.format===yi,x.type),Ue&&(Pe?t.texStorage2D(n.TEXTURE_2D,1,fe,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,fe,ne.width,ne.height,0,ce,we,null));else if(x.isDataTexture)if(Re.length>0){Pe&&Ue&&t.texStorage2D(n.TEXTURE_2D,he,fe,Re[0].width,Re[0].height);for(let te=0,de=Re.length;te<de;te++)ue=Re[te],Pe?U&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,we,ue.data):t.texImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ce,we,ue.data);x.generateMipmaps=!1}else Pe?(Ue&&t.texStorage2D(n.TEXTURE_2D,he,fe,ne.width,ne.height),U&&ie(x,ne,ce,we)):t.texImage2D(n.TEXTURE_2D,0,fe,ne.width,ne.height,0,ce,we,ne.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Pe&&Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,fe,Re[0].width,Re[0].height,ne.depth);for(let te=0,de=Re.length;te<de;te++)if(ue=Re[te],x.format!==dn)if(ce!==null)if(Pe){if(U)if(x.layerUpdates.size>0){const ve=ed(ue.width,ue.height,x.format,x.type);for(const se of x.layerUpdates){const Ce=ue.data.subarray(se*ve/ue.data.BYTES_PER_ELEMENT,(se+1)*ve/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,se,ue.width,ue.height,1,ce,Ce)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,ne.depth,ce,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,te,fe,ue.width,ue.height,ne.depth,0,ue.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,ne.depth,ce,we,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,te,fe,ue.width,ue.height,ne.depth,0,ce,we,ue.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Pe&&Ue&&t.texStorage2D(n.TEXTURE_2D,he,fe,Re[0].width,Re[0].height);for(let te=0,de=Re.length;te<de;te++)ue=Re[te],x.format!==dn?ce!==null?Pe?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ue.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?U&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,we,ue.data):t.texImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ce,we,ue.data)}else if(x.isDataArrayTexture)if(Pe){if(Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,fe,ne.width,ne.height,ne.depth),U)if(x.layerUpdates.size>0){const te=ed(ne.width,ne.height,x.format,x.type);for(const de of x.layerUpdates){const ve=ne.data.subarray(de*te/ne.data.BYTES_PER_ELEMENT,(de+1)*te/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,de,ne.width,ne.height,1,ce,we,ve)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ce,we,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,fe,ne.width,ne.height,ne.depth,0,ce,we,ne.data);else if(x.isData3DTexture)Pe?(Ue&&t.texStorage3D(n.TEXTURE_3D,he,fe,ne.width,ne.height,ne.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ce,we,ne.data)):t.texImage3D(n.TEXTURE_3D,0,fe,ne.width,ne.height,ne.depth,0,ce,we,ne.data);else if(x.isFramebufferTexture){if(Ue)if(Pe)t.texStorage2D(n.TEXTURE_2D,he,fe,ne.width,ne.height);else{let te=ne.width,de=ne.height;for(let ve=0;ve<he;ve++)t.texImage2D(n.TEXTURE_2D,ve,fe,te,de,0,ce,we,null),te>>=1,de>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const te=n.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ne.parentNode!==te){te.appendChild(ne),d.add(x),te.onpaint=de=>{const ve=de.changedElements;for(const se of d)ve.includes(se.image)&&(se.needsUpdate=!0)},te.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ne);else{const ve=n.RGBA,se=n.RGBA,Ce=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ve,se,Ce,ne)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Re.length>0){if(Pe&&Ue){const te=nt(Re[0]);t.texStorage2D(n.TEXTURE_2D,he,fe,te.width,te.height)}for(let te=0,de=Re.length;te<de;te++)ue=Re[te],Pe?U&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ce,we,ue):t.texImage2D(n.TEXTURE_2D,te,fe,ce,we,ue);x.generateMipmaps=!1}else if(Pe){if(Ue){const te=nt(ne);t.texStorage2D(n.TEXTURE_2D,he,fe,te.width,te.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,we,ne)}else t.texImage2D(n.TEXTURE_2D,0,fe,ce,we,ne);f(x)&&b(q),le.__version=oe.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function De(C,x,z){if(x.image.length!==6)return;const q=je(C,x),Q=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+z);const oe=i.get(Q);if(Q.version!==oe.__version||q===!0){t.activeTexture(n.TEXTURE0+z);const le=Ye.getPrimaries(Ye.workingColorSpace),ee=x.colorSpace===ei?null:Ye.getPrimaries(x.colorSpace),ne=x.colorSpace===ei||le===ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);const ce=x.isCompressedTexture||x.image[0].isCompressedTexture,we=x.image[0]&&x.image[0].isDataTexture,fe=[];for(let se=0;se<6;se++)!ce&&!we?fe[se]=m(x.image[se],!0,s.maxCubemapSize):fe[se]=we?x.image[se].image:x.image[se],fe[se]=Pt(x,fe[se]);const ue=fe[0],Re=r.convert(x.format,x.colorSpace),Pe=r.convert(x.type),Ue=S(x.internalFormat,Re,Pe,x.normalized,x.colorSpace),U=x.isVideoTexture!==!0,he=oe.__version===void 0||q===!0,te=Q.dataReady;let de=M(x,ue);ke(n.TEXTURE_CUBE_MAP,x);let ve;if(ce){U&&he&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Ue,ue.width,ue.height);for(let se=0;se<6;se++){ve=fe[se].mipmaps;for(let Ce=0;Ce<ve.length;Ce++){const Te=ve[Ce];x.format!==dn?Re!==null?U?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce,0,0,Te.width,Te.height,Re,Te.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce,Ue,Te.width,Te.height,0,Te.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce,0,0,Te.width,Te.height,Re,Pe,Te.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce,Ue,Te.width,Te.height,0,Re,Pe,Te.data)}}}else{if(ve=x.mipmaps,U&&he){ve.length>0&&de++;const se=nt(fe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Ue,se.width,se.height)}for(let se=0;se<6;se++)if(we){U?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,fe[se].width,fe[se].height,Re,Pe,fe[se].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ue,fe[se].width,fe[se].height,0,Re,Pe,fe[se].data);for(let Ce=0;Ce<ve.length;Ce++){const lt=ve[Ce].image[se].image;U?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce+1,0,0,lt.width,lt.height,Re,Pe,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce+1,Ue,lt.width,lt.height,0,Re,Pe,lt.data)}}else{U?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Re,Pe,fe[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ue,Re,Pe,fe[se]);for(let Ce=0;Ce<ve.length;Ce++){const Te=ve[Ce];U?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce+1,0,0,Re,Pe,Te.image[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ce+1,Ue,Re,Pe,Te.image[se])}}}f(x)&&b(n.TEXTURE_CUBE_MAP),oe.__version=Q.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function xe(C,x,z,q,Q,oe){const le=r.convert(z.format,z.colorSpace),ee=r.convert(z.type),ne=S(z.internalFormat,le,ee,z.normalized,z.colorSpace),ce=i.get(x),we=i.get(z);if(we.__renderTarget=x,!ce.__hasExternalTextures){const fe=Math.max(1,x.width>>oe),ue=Math.max(1,x.height>>oe);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,oe,ne,fe,ue,x.depth,0,le,ee,null):t.texImage2D(Q,oe,ne,fe,ue,0,le,ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),vt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,Q,we.__webglTexture,0,dt(x)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,Q,we.__webglTexture,oe),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ze(C,x,z){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const q=x.depthTexture,Q=q&&q.isDepthTexture?q.type:null,oe=T(x.stencilBuffer,Q),le=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;vt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt(x),oe,x.width,x.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt(x),oe,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,oe,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,C)}else{const q=x.textures;for(let Q=0;Q<q.length;Q++){const oe=q[Q],le=r.convert(oe.format,oe.colorSpace),ee=r.convert(oe.type),ne=S(oe.internalFormat,le,ee,oe.normalized,oe.colorSpace);vt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt(x),ne,x.width,x.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt(x),ne,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ne,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function St(C,x,z){const q=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Q=i.get(x.depthTexture);if(Q.__renderTarget=x,(!Q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),q){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),Q.__webglTexture===void 0){Q.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),ke(n.TEXTURE_CUBE_MAP,x.depthTexture);const ce=r.convert(x.depthTexture.format),we=r.convert(x.depthTexture.type);let fe;x.depthTexture.format===zn?fe=n.DEPTH_COMPONENT24:x.depthTexture.format===yi&&(fe=n.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,fe,x.width,x.height,0,ce,we,null)}}else X(x.depthTexture,0);const oe=Q.__webglTexture,le=dt(x),ee=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,ne=x.depthTexture.format===yi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===zn)vt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ne,ee,oe,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,ne,ee,oe,0);else if(x.depthTexture.format===yi)vt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ne,ee,oe,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,ne,ee,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function He(C){const x=i.get(C),z=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const q=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),q){const Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,q.removeEventListener("dispose",Q)};q.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=q}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let q=0;q<6;q++)St(x.__webglFramebuffer[q],C,q);else{const q=C.texture.mipmaps;q&&q.length>0?St(x.__webglFramebuffer[0],C,0):St(x.__webglFramebuffer,C,0)}else if(z){x.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[q]),x.__webglDepthbuffer[q]===void 0)x.__webglDepthbuffer[q]=n.createRenderbuffer(),ze(x.__webglDepthbuffer[q],C,!1);else{const Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=x.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,oe)}}else{const q=C.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ze(x.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,oe)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ze(C,x,z){const q=i.get(C);x!==void 0&&xe(q.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&He(C)}function ot(C){const x=C.texture,z=i.get(C),q=i.get(x);C.addEventListener("dispose",_);const Q=C.textures,oe=C.isWebGLCubeRenderTarget===!0,le=Q.length>1;if(le||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=x.version,a.memory.textures++),oe){z.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[ee]=[];for(let ne=0;ne<x.mipmaps.length;ne++)z.__webglFramebuffer[ee][ne]=n.createFramebuffer()}else z.__webglFramebuffer[ee]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let ee=0;ee<x.mipmaps.length;ee++)z.__webglFramebuffer[ee]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(le)for(let ee=0,ne=Q.length;ee<ne;ee++){const ce=i.get(Q[ee]);ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&vt(C)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ee=0;ee<Q.length;ee++){const ne=Q[ee];z.__webglColorRenderbuffer[ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[ee]);const ce=r.convert(ne.format,ne.colorSpace),we=r.convert(ne.type),fe=S(ne.internalFormat,ce,we,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),ue=dt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,fe,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ee,n.RENDERBUFFER,z.__webglColorRenderbuffer[ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),ze(z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(oe){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),ke(n.TEXTURE_CUBE_MAP,x);for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0)for(let ne=0;ne<x.mipmaps.length;ne++)xe(z.__webglFramebuffer[ee][ne],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ne);else xe(z.__webglFramebuffer[ee],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(x)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let ee=0,ne=Q.length;ee<ne;ee++){const ce=Q[ee],we=i.get(ce);let fe=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(fe=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(fe,we.__webglTexture),ke(fe,ce),xe(z.__webglFramebuffer,C,ce,n.COLOR_ATTACHMENT0+ee,fe,0),f(ce)&&b(fe)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ee=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,q.__webglTexture),ke(ee,x),x.mipmaps&&x.mipmaps.length>0)for(let ne=0;ne<x.mipmaps.length;ne++)xe(z.__webglFramebuffer[ne],C,x,n.COLOR_ATTACHMENT0,ee,ne);else xe(z.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,ee,0);f(x)&&b(ee),t.unbindTexture()}C.depthBuffer&&He(C)}function We(C){const x=C.textures;for(let z=0,q=x.length;z<q;z++){const Q=x[z];if(f(Q)){const oe=A(C),le=i.get(Q).__webglTexture;t.bindTexture(oe,le),b(oe),t.unbindTexture()}}}const ht=[],At=[];function zt(C){if(C.samples>0){if(vt(C)===!1){const x=C.textures,z=C.width,q=C.height;let Q=n.COLOR_BUFFER_BIT;const oe=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(C),ee=x.length>1;if(ee)for(let ce=0;ce<x.length;ce++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const ne=C.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let ce=0;ce<x.length;ce++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[ce]);const we=i.get(x[ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,we,0)}n.blitFramebuffer(0,0,z,q,0,0,z,q,Q,n.NEAREST),c===!0&&(ht.length=0,At.length=0,ht.push(n.COLOR_ATTACHMENT0+ce),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(ht.push(oe),At.push(oe),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,At)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ht))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ee)for(let ce=0;ce<x.length;ce++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,le.__webglColorRenderbuffer[ce]);const we=i.get(x[ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,we,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function dt(C){return Math.min(s.maxSamples,C.samples)}function vt(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function B(C){const x=a.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function Pt(C,x){const z=C.colorSpace,q=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==aa&&z!==ei&&(Ye.getTransfer(z)===it?(q!==dn||Q!==Qt)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",z)),x}function nt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=V,this.getTextureUnits=D,this.setTextureUnits=k,this.setTexture2D=X,this.setTexture2DArray=R,this.setTexture3D=O,this.setTextureCube=H,this.rebindTextures=Ze,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=vt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ST(n,e){function t(i,s=ei){let r;const a=Ye.getTransfer(s);if(i===Qt)return n.UNSIGNED_BYTE;if(i===Sc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Mc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===kp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zp)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bp)return n.BYTE;if(i===Vp)return n.SHORT;if(i===ks)return n.UNSIGNED_SHORT;if(i===yc)return n.INT;if(i===wn)return n.UNSIGNED_INT;if(i===En)return n.FLOAT;if(i===Rn)return n.HALF_FLOAT;if(i===Hp)return n.ALPHA;if(i===Gp)return n.RGB;if(i===dn)return n.RGBA;if(i===zn)return n.DEPTH_COMPONENT;if(i===yi)return n.DEPTH_STENCIL;if(i===Wp)return n.RED;if(i===Ec)return n.RED_INTEGER;if(i===Ti)return n.RG;if(i===bc)return n.RG_INTEGER;if(i===Tc)return n.RGBA_INTEGER;if(i===zr||i===Hr||i===Gr||i===Wr)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Wr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ll||i===cl||i===ul||i===hl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ll)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===cl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ul)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===hl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===dl||i===fl||i===pl||i===ml||i===gl||i===sa||i===vl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===dl||i===fl)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===pl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ml)return r.COMPRESSED_R11_EAC;if(i===gl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===sa)return r.COMPRESSED_RG11_EAC;if(i===vl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===xl||i===_l||i===yl||i===Sl||i===Ml||i===El||i===bl||i===Tl||i===Al||i===wl||i===Rl||i===Cl||i===Pl||i===Ll)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===xl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===_l)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===yl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Sl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ml)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===El)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===bl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Tl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Al)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===wl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Rl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Cl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Pl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ll)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Dl||i===Nl||i===Il)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Dl)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Il)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ul||i===Fl||i===ra||i===Ol)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Ul)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Fl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ra)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ol)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const MT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ET=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class bT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new tm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Cn({vertexShader:MT,fragmentShader:ET,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Hn(new Sa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class TT extends wi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,h=null,p=null,g=null;const y=typeof XRWebGLBinding<"u",m=new bT,f={},b=t.getContextAttributes();let A=null,S=null;const T=[],M=[],P=new Qe;let _=null,w=null;const L=new Jt;L.viewport=new pt;const N=new Jt;N.viewport=new pt;const F=[L,N],V=new NS;let D=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=T[J];return ie===void 0&&(ie=new Qa,T[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=T[J];return ie===void 0&&(ie=new Qa,T[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=T[J];return ie===void 0&&(ie=new Qa,T[J]=ie),ie.getHandSpace()};function $(J){const ie=M.indexOf(J.inputSource);if(ie===-1)return;const _e=T[ie];_e!==void 0&&(_e.update(J.inputSource,J.frame,l||a),_e.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",X);for(let J=0;J<T.length;J++){const ie=M[J];ie!==null&&(M[J]=null,T[J].disconnect(ie))}D=null,k=null,m.reset();for(const J in f)delete f[J];if(e.setRenderTarget(A),p=null,h=null,d=null,s=null,S=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),w!==null){const J=w.camera;J.fov=w.fov,J.zoom=w.zoom,J.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",X),b.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,De=null,xe=null;b.depth&&(xe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=b.stencil?yi:zn,De=b.stencil?zs:wn);const ze={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(ze),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new pn(h.textureWidth,h.textureHeight,{format:dn,type:Qt,depthTexture:new Gs(h.textureWidth,h.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const _e={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new pn(p.framebufferWidth,p.framebufferHeight,{format:dn,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),je.setContext(s),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(J){for(let ie=0;ie<J.removed.length;ie++){const _e=J.removed[ie],De=M.indexOf(_e);De>=0&&(M[De]=null,T[De].disconnect(_e))}for(let ie=0;ie<J.added.length;ie++){const _e=J.added[ie];let De=M.indexOf(_e);if(De===-1){for(let ze=0;ze<T.length;ze++)if(ze>=M.length){M.push(_e),De=ze;break}else if(M[ze]===null){M[ze]=_e,De=ze;break}if(De===-1)break}const xe=T[De];xe&&xe.connect(_e)}}const R=new j,O=new j;function H(J,ie,_e){R.setFromMatrixPosition(ie.matrixWorld),O.setFromMatrixPosition(_e.matrixWorld);const De=R.distanceTo(O),xe=ie.projectionMatrix.elements,ze=_e.projectionMatrix.elements,St=xe[14]/(xe[10]-1),He=xe[14]/(xe[10]+1),Ze=(xe[9]+1)/xe[5],ot=(xe[9]-1)/xe[5],We=(xe[8]-1)/xe[0],ht=(ze[8]+1)/ze[0],At=St*We,zt=St*ht,dt=De/(-We+ht),vt=dt*-We;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(vt),J.translateZ(dt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),xe[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const B=St+dt,Pt=He+dt,nt=At-vt,C=zt+(De-vt),x=Ze*He/Pt*B,z=ot*He/Pt*B;J.projectionMatrix.makePerspective(nt,C,x,z,B,Pt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function re(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ie=J.near,_e=J.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),V.near=N.near=L.near=ie,V.far=N.far=L.far=_e,(D!==V.near||k!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),D=V.near,k=V.far),V.layers.mask=J.layers.mask|6,L.layers.mask=V.layers.mask&-5,N.layers.mask=V.layers.mask&-3;const De=J.parent,xe=V.cameras;re(V,De);for(let ze=0;ze<xe.length;ze++)re(xe[ze],De);xe.length===2?H(V,L,N):V.projectionMatrix.copy(L.projectionMatrix),w===null&&J.isPerspectiveCamera&&(w={camera:J,fov:J.fov,zoom:J.zoom}),ae(J,V,De)};function ae(J,ie,_e){_e===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(_e.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Hs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function(J){c=J,h!==null&&(h.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function(J){return f[J]};let Ve=null;function ke(J,ie){if(u=ie.getViewerPose(l||a),g=ie,u!==null){const _e=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let De=!1;_e.length!==V.cameras.length&&(V.cameras.length=0,De=!0);for(let He=0;He<_e.length;He++){const Ze=_e[He];let ot=null;if(p!==null)ot=p.getViewport(Ze);else{const ht=d.getViewSubImage(h,Ze);ot=ht.viewport,He===0&&(e.setRenderTargetTextures(S,ht.colorTexture,ht.depthStencilTexture),e.setRenderTarget(S))}let We=F[He];We===void 0&&(We=new Jt,We.layers.enable(He),We.viewport=new pt,F[He]=We),We.matrix.fromArray(Ze.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ze.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(ot.x,ot.y,ot.width,ot.height),He===0&&(V.matrix.copy(We.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),De===!0&&V.cameras.push(We)}const xe=s.enabledFeatures;if(xe&&xe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=i.getBinding();const He=d.getDepthInformation(_e[0]);He&&He.isValid&&He.texture&&m.init(He,s.renderState)}if(xe&&xe.includes("camera-access")&&y){e.state.unbindTexture(),d=i.getBinding();for(let He=0;He<_e.length;He++){const Ze=_e[He].camera;if(Ze){let ot=f[Ze];ot||(ot=new tm,f[Ze]=ot);const We=d.getCameraImage(Ze);ot.sourceTexture=We}}}}for(let _e=0;_e<T.length;_e++){const De=M[_e],xe=T[_e];De!==null&&xe!==void 0&&xe.update(De,ie,l||a)}Ve&&Ve(J,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}const je=new rm;je.setAnimationLoop(ke),this.setAnimationLoop=function(J){Ve=J},this.dispose=function(){}}}const AT=new gt,dm=new Ie;dm.set(-1,0,0,0,1,0,0,0,1);function wT(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,nm(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,b,A,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,S)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),y(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,b,A):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Gt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Gt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const b=e.get(f),A=b.envMap,S=b.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(AT.makeRotationFromEuler(S)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(dm),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,b,A){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=A*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Gt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function y(m,f){const b=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function RT(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,T){const M=T.program;i.uniformBlockBinding(S,M)}function l(S,T){let M=s[S.id];M===void 0&&(m(S),M=u(S),s[S.id]=M,S.addEventListener("dispose",b));const P=T.program;i.updateUBOMapping(S,P);const _=e.render.frame;r[S.id]!==_&&(h(S),r[S.id]=_)}function u(S){const T=d();S.__bindingPointIndex=T;const M=n.createBuffer(),P=S.__size,_=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,P,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,M),M}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const T=s[S.id],M=S.uniforms,P=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let _=0,w=M.length;_<w;_++){const L=M[_];if(Array.isArray(L))for(let N=0,F=L.length;N<F;N++)p(L[N],_,N,P);else p(L,_,0,P)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,T,M,P){if(y(S,T,M,P)===!0){const _=S.__offset,w=S.value;if(Array.isArray(w)){let L=0;for(let N=0;N<w.length;N++){const F=w[N],V=f(F);g(F,S.__data,L),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(L+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,S.__data)}}function g(S,T,M){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,M)}function y(S,T,M,P){const _=S.value,w=T+"_"+M;if(P[w]===void 0)return typeof _=="number"||typeof _=="boolean"?P[w]=_:ArrayBuffer.isView(_)?P[w]=_.slice():P[w]=_.clone(),!0;{const L=P[w];if(typeof _=="number"||typeof _=="boolean"){if(L!==_)return P[w]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(L.equals(_)===!1)return L.copy(_),!0}}return!1}function m(S){const T=S.uniforms;let M=0;const P=16;for(let w=0,L=T.length;w<L;w++){const N=Array.isArray(T[w])?T[w]:[T[w]];for(let F=0,V=N.length;F<V;F++){const D=N[F],k=Array.isArray(D.value)?D.value:[D.value];for(let $=0,Y=k.length;$<Y;$++){const X=k[$],R=f(X),O=M%P,H=O%R.boundary,re=O+H;M+=H,re!==0&&P-re<R.storage&&(M+=P-re),D.__data=new Float32Array(R.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=M,M+=R.storage}}}const _=M%P;return _>0&&(M+=P-_),S.__size=M,S.__cache={},this}function f(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",S),T}function b(S){const T=S.target;T.removeEventListener("dispose",b);const M=a.indexOf(T.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function A(){for(const S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:A}}const CT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let _n=null;function PT(){return _n===null&&(_n=new SS(CT,16,16,Ti,Rn),_n.name="DFG_LUT",_n.minFilter=It,_n.magFilter=It,_n.wrapS=On,_n.wrapT=On,_n.generateMipmaps=!1,_n.needsUpdate=!0),_n}class LT{constructor(e={}){const{canvas:t=Uy(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:p=Qt}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const y=p,m=new Set([Tc,bc,Ec]),f=new Set([Qt,wn,ks,zs,Sc,Mc]),b=new Uint32Array(4),A=new Int32Array(4),S=new j;let T=null,M=null;const P=[],_=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let N=!1,F=null,V=null,D=null,k=null;this._outputColorSpace=Yt;let $=0,Y=0,X=null,R=-1,O=null;const H=new pt,re=new pt;let ae=null;const Ve=new Ke(0);let ke=0,je=t.width,J=t.height,ie=1,_e=null,De=null;const xe=new pt(0,0,je,J),ze=new pt(0,0,je,J);let St=!1;const He=new Qp;let Ze=!1,ot=!1;const We=new gt,ht=new j,At=new pt,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let dt=!1;function vt(){return X===null?ie:1}let B=i;function Pt(E,I){return t.getContext(E,I)}let nt,C,x,z,q,Q,oe,le,ee,ne,ce,we,fe,ue,Re,Pe,Ue,U,he,te,de,ve,se;try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_c}`),t.addEventListener("webglcontextlost",lt,!1),t.addEventListener("webglcontextrestored",et,!1),t.addEventListener("webglcontextcreationerror",sn,!1),B===null){const I="webgl2";if(B=Pt(I,E),B===null)throw Pt(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ce()}catch(E){throw t.removeEventListener("webglcontextlost",lt,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Je("WebGLRenderer: "+E.message),E}function Ce(){nt=new Pb(B),nt.init(),de=new ST(B,nt),C=new yb(B,nt,e,de),x=new _T(B,nt),C.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),V=B.createFramebuffer(),D=B.createFramebuffer(),k=B.createFramebuffer(),z=new Nb(B),q=new rT,Q=new yT(B,nt,x,q,C,de,z),oe=new Cb(L),le=new US(B),ve=new xb(B,le),ee=new Lb(B,le,z,ve),ne=new Ub(B,ee,le,ve,z),U=new Ib(B,C,Q),Re=new Sb(q),ce=new sT(L,oe,nt,C,ve,Re),we=new wT(L,q),fe=new oT,ue=new fT(nt),Ue=new vb(L,oe,x,ne,g,c),Pe=new xT(L,ne,C),se=new RT(B,z,C,x),he=new _b(B,nt,z),te=new Db(B,nt,z),z.programs=ce.programs,L.capabilities=C,L.extensions=nt,L.properties=q,L.renderLists=fe,L.shadowMap=Pe,L.state=x,L.info=z}y!==Qt&&(w=new Ob(y,t.width,t.height,o,s,r));const Te=new TT(L,B);this.xr=Te,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const E=nt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=nt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(E){E!==void 0&&(ie=E,this.setSize(je,J,!1))},this.getSize=function(E){return E.set(je,J)},this.setSize=function(E,I,K=!0){if(Te.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}je=E,J=I,t.width=Math.floor(E*ie),t.height=Math.floor(I*ie),K===!0&&(t.style.width=E+"px",t.style.height=I+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(je*ie,J*ie).floor()},this.setDrawingBufferSize=function(E,I,K){je=E,J=I,ie=K,t.width=Math.floor(E*K),t.height=Math.floor(I*K),this.setViewport(0,0,E,I)},this.setEffects=function(E){if(y===Qt){Je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let I=0;I<E.length;I++)if(E[I].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(H)},this.getViewport=function(E){return E.copy(xe)},this.setViewport=function(E,I,K,G){E.isVector4?xe.set(E.x,E.y,E.z,E.w):xe.set(E,I,K,G),x.viewport(H.copy(xe).multiplyScalar(ie).round())},this.getScissor=function(E){return E.copy(ze)},this.setScissor=function(E,I,K,G){E.isVector4?ze.set(E.x,E.y,E.z,E.w):ze.set(E,I,K,G),x.scissor(re.copy(ze).multiplyScalar(ie).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(E){x.setScissorTest(St=E)},this.setOpaqueSort=function(E){_e=E},this.setTransparentSort=function(E){De=E},this.getClearColor=function(E){return E.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(E=!0,I=!0,K=!0){let G=0;if(E){let W=!1;if(X!==null){const ge=X.texture.format;W=m.has(ge)}if(W){const ge=X.texture.type,Se=f.has(ge),me=Ue.getClearColor(),Ee=Ue.getClearAlpha(),Ae=me.r,Fe=me.g,Ge=me.b;Se?(b[0]=Ae,b[1]=Fe,b[2]=Ge,b[3]=Ee,B.clearBufferuiv(B.COLOR,0,b)):(A[0]=Ae,A[1]=Fe,A[2]=Ge,A[3]=Ee,B.clearBufferiv(B.COLOR,0,A))}else G|=B.COLOR_BUFFER_BIT}I&&(G|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(G|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&B.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),F=E},this.dispose=function(){t.removeEventListener("webglcontextlost",lt,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Ue.dispose(),fe.dispose(),ue.dispose(),q.dispose(),oe.dispose(),ne.dispose(),ve.dispose(),se.dispose(),ce.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Fc),Te.removeEventListener("sessionend",Oc),ai.stop()};function lt(E){E.preventDefault(),Ch("WebGLRenderer: Context Lost."),N=!0}function et(){Ch("WebGLRenderer: Context Restored."),N=!1;const E=z.autoReset,I=Pe.enabled,K=Pe.autoUpdate,G=Pe.needsUpdate,W=Pe.type;Ce(),z.autoReset=E,Pe.enabled=I,Pe.autoUpdate=K,Pe.needsUpdate=G,Pe.type=W}function sn(E){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function gn(E){const I=E.target;I.removeEventListener("dispose",gn),xm(I)}function xm(E){_m(E),q.remove(E)}function _m(E){const I=q.get(E).programs;I!==void 0&&(I.forEach(function(K){ce.releaseProgram(K)}),E.isShaderMaterial&&ce.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,K,G,W,ge){I===null&&(I=zt);const Se=W.isMesh&&W.matrixWorld.determinantAffine()<0,me=Mm(E,I,K,G,W);x.setMaterial(G,Se);let Ee=K.index,Ae=1;if(G.wireframe===!0){if(Ee=ee.getWireframeAttribute(K),Ee===void 0)return;Ae=2}const Fe=K.drawRange,Ge=K.attributes.position;let be=Fe.start*Ae,tt=(Fe.start+Fe.count)*Ae;ge!==null&&(be=Math.max(be,ge.start*Ae),tt=Math.min(tt,(ge.start+ge.count)*Ae)),Ee!==null?(be=Math.max(be,0),tt=Math.min(tt,Ee.count)):Ge!=null&&(be=Math.max(be,0),tt=Math.min(tt,Ge.count));const xt=tt-be;if(xt<0||xt===1/0)return;ve.setup(W,G,me,K,Ee);let ut,rt=he;if(Ee!==null&&(ut=le.get(Ee),rt=te,rt.setIndex(ut)),W.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*vt()),rt.setMode(B.LINES)):rt.setMode(B.TRIANGLES);else if(W.isLine){let Lt=G.linewidth;Lt===void 0&&(Lt=1),x.setLineWidth(Lt*vt()),W.isLineSegments?rt.setMode(B.LINES):W.isLineLoop?rt.setMode(B.LINE_LOOP):rt.setMode(B.LINE_STRIP)}else W.isPoints?rt.setMode(B.POINTS):W.isSprite&&rt.setMode(B.TRIANGLES);if(W.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))rt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Lt=W._multiDrawStarts,ye=W._multiDrawCounts,Ut=W._multiDrawCount,$e=Ee?le.get(Ee).bytesPerElement:1,Kt=q.get(G).currentProgram.getUniforms();for(let vn=0;vn<Ut;vn++)Kt.setValue(B,"_gl_DrawID",vn),rt.render(Lt[vn]/$e,ye[vn])}else if(W.isInstancedMesh)rt.renderInstances(be,xt,W.count);else if(K.isInstancedBufferGeometry){const Lt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ye=Math.min(K.instanceCount,Lt);rt.renderInstances(be,xt,ye)}else rt.render(be,xt)};function Uc(E,I,K,G){F!==null&&E.isNodeMaterial&&F.setObject(G,E),Ze===!0&&Re.setState(E,K,!1),E.transparent===!0&&E.side===Fn&&E.forceSinglePass===!1?(E.side=Gt,E.needsUpdate=!0,er(E,I,G),E.side=Ei,E.needsUpdate=!0,er(E,I,G),E.side=Fn):er(E,I,G)}this.compile=function(E,I,K=null){K===null&&(K=E),F!==null&&F.renderStart(E,I,K),M=ue.get(K),M.init(I),_.push(M),K.traverseVisible(function(W){W.isLight&&W.layers.test(I.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),E!==K&&E.traverseVisible(function(W){W.isLight&&W.layers.test(I.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights(),F!==null&&F.updateLights(M.state.lightsArray),ot=this.localClippingEnabled,Ze=Re.init(this.clippingPlanes,ot),Ze===!0&&Re.setGlobalState(this.clippingPlanes,I),F!==null&&Pe.render(M.state.shadowsArray,K,I);const G=new Set;return E.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ge=W.material;if(ge)if(Array.isArray(ge))for(let Se=0;Se<ge.length;Se++){const me=ge[Se];Uc(me,K,I,W),G.add(me)}else Uc(ge,K,I,W),G.add(ge)}),M=_.pop(),F!==null&&F.renderEnd(),G},this.compileAsync=function(E,I,K=null){const G=this.compile(E,I,K);return new Promise(W=>{function ge(){if(G.forEach(function(Se){const Ee=q.get(Se).currentProgram;(Ee===void 0||Ee.isReady())&&G.delete(Se)}),G.size===0){W(E);return}setTimeout(ge,10)}nt.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let ba=null;function ym(E){ba&&ba(E)}function Fc(){ai.stop()}function Oc(){ai.start()}const ai=new rm;ai.setAnimationLoop(ym),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(E){ba=E,Te.setAnimationLoop(E),E===null?ai.stop():ai.start()},Te.addEventListener("sessionstart",Fc),Te.addEventListener("sessionend",Oc),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;F!==null&&F.renderStart(E,I);const K=Te.enabled===!0&&Te.isPresenting===!0,G=w!==null&&(X===null||K)&&w.begin(L,X);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(I),I=Te.getCamera()),E.isScene===!0&&E.onBeforeRender(L,E,I,X),M=ue.get(E,_.length),M.init(I),M.state.textureUnits=Q.getTextureUnits(),_.push(M),We.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),He.setFromProjectionMatrix(We,bn,I.reversedDepth),ot=this.localClippingEnabled,Ze=Re.init(this.clippingPlanes,ot),T=fe.get(E,P.length),T.init(),P.push(T),Te.enabled===!0&&Te.isPresenting===!0){const Se=L.xr.getDepthSensingMesh();Se!==null&&Ta(Se,I,-1/0,L.sortObjects)}Ta(E,I,0,L.sortObjects),T.finish(),F!==null&&F.updateLights(M.state.lightsArray),L.sortObjects===!0&&T.sort(_e,De),dt=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,dt&&Ue.addToRenderList(T,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ze===!0&&Re.beginShadows();const W=M.state.shadowsArray;if(Pe.render(W,E,I),Ze===!0&&Re.endShadows(),(G&&w.hasRenderPass())===!1){const Se=T.opaque,me=T.transmissive;if(M.setupLights(),I.isArrayCamera){const Ee=I.cameras;if(me.length>0)for(let Ae=0,Fe=Ee.length;Ae<Fe;Ae++){const Ge=Ee[Ae];Vc(Se,me,E,Ge)}dt&&Ue.render(E);for(let Ae=0,Fe=Ee.length;Ae<Fe;Ae++){const Ge=Ee[Ae];Bc(T,E,Ge,Ge.viewport)}}else me.length>0&&Vc(Se,me,E,I),dt&&Ue.render(E),Bc(T,E,I)}X!==null&&Y===0&&(Q.updateMultisampleRenderTarget(X),Q.updateRenderTargetMipmap(X)),G&&w.end(L),E.isScene===!0&&E.onAfterRender(L,E,I),ve.resetDefaultState(),R=-1,O=null,_.pop(),_.length>0?(M=_[_.length-1],Q.setTextureUnits(M.state.textureUnits),Ze===!0&&Re.setGlobalState(L.clippingPlanes,M.state.camera)):M=null,P.pop(),P.length>0?T=P[P.length-1]:T=null,F!==null&&F.renderEnd()};function Ta(E,I,K,G){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)K=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLightProbeGrid)M.pushLightProbeGrid(E);else if(E.isLight)M.pushLight(E),E.castShadow&&M.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(He)){G&&At.setFromMatrixPosition(E.matrixWorld).applyMatrix4(We);const Se=ne.update(E),me=E.material;me.visible&&T.push(E,Se,me,K,At.z,null,I)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(He))){const Se=ne.update(E),me=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),At.copy(E.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),At.copy(Se.boundingSphere.center)),At.applyMatrix4(E.matrixWorld).applyMatrix4(We)),Array.isArray(me)){const Ee=Se.groups;for(let Ae=0,Fe=Ee.length;Ae<Fe;Ae++){const Ge=Ee[Ae],be=me[Ge.materialIndex];be&&be.visible&&T.push(E,Se,be,K,At.z,Ge,I)}}else me.visible&&T.push(E,Se,me,K,At.z,null,I)}}const ge=E.children;for(let Se=0,me=ge.length;Se<me;Se++)Ta(ge[Se],I,K,G)}function Bc(E,I,K,G){const{opaque:W,transmissive:ge,transparent:Se}=E;M.setupLightsView(K),Ze===!0&&Re.setGlobalState(L.clippingPlanes,K),G&&x.viewport(H.copy(G)),W.length>0&&Qs(W,I,K),ge.length>0&&Qs(ge,I,K),Se.length>0&&Qs(Se,I,K),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Vc(E,I,K,G){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[G.id]===void 0){const be=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[G.id]=new pn(1,1,{generateMipmaps:!0,type:be?Rn:Qt,minFilter:_i,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}const ge=M.state.transmissionRenderTarget[G.id],Se=G.viewport||H;ge.setSize(Se.z*L.transmissionResolutionScale,Se.w*L.transmissionResolutionScale);const me=L.getRenderTarget(),Ee=L.getActiveCubeFace(),Ae=L.getActiveMipmapLevel();L.setRenderTarget(ge),L.getClearColor(Ve),ke=L.getClearAlpha(),ke<1&&L.setClearColor(16777215,.5),L.clear(),dt&&Ue.render(K);const Fe=L.toneMapping;L.toneMapping=An;const Ge=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),M.setupLightsView(G),Ze===!0&&Re.setGlobalState(L.clippingPlanes,G),Qs(E,K,G),Q.updateMultisampleRenderTarget(ge),Q.updateRenderTargetMipmap(ge),nt.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let tt=0,xt=I.length;tt<xt;tt++){const ut=I[tt],{object:rt,geometry:Lt,material:ye,group:Ut}=ut;if(ye.side===Fn&&rt.layers.test(G.layers)){const $e=ye.side;ye.side=Gt,ye.needsUpdate=!0,kc(rt,K,G,Lt,ye,Ut),ye.side=$e,ye.needsUpdate=!0,be=!0}}be===!0&&(Q.updateMultisampleRenderTarget(ge),Q.updateRenderTargetMipmap(ge))}L.setRenderTarget(me,Ee,Ae),L.setClearColor(Ve,ke),Ge!==void 0&&(G.viewport=Ge),L.toneMapping=Fe}function Qs(E,I,K){const G=I.isScene===!0?I.overrideMaterial:null;for(let W=0,ge=E.length;W<ge;W++){const Se=E[W],{object:me,geometry:Ee,group:Ae}=Se;let Fe=Se.material;Fe.allowOverride===!0&&G!==null&&(Fe=G),me.layers.test(K.layers)&&kc(me,I,K,Ee,Fe,Ae)}}function kc(E,I,K,G,W,ge){F!==null&&W.isNodeMaterial&&F.setObject(E,W),E.onBeforeRender(L,I,K,G,W,ge),E.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(L,I,K,G,E,ge),W.transparent===!0&&W.side===Fn&&W.forceSinglePass===!1?(W.side=Gt,W.needsUpdate=!0,L.renderBufferDirect(K,I,G,W,E,ge),W.side=Ei,W.needsUpdate=!0,L.renderBufferDirect(K,I,G,W,E,ge),W.side=Fn):L.renderBufferDirect(K,I,G,W,E,ge),E.onAfterRender(L,I,K,G,W,ge)}function er(E,I,K){I.isScene!==!0&&(I=zt);const G=q.get(E),W=M.state.lights,ge=M.state.shadowsArray,Se=W.state.version,me=ce.getParameters(E,W.state,ge,I,K,M.state.lightProbeGridArray),Ee=ce.getProgramCacheKey(me);let Ae=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?I.environment:null,G.fog=I.fog;const Fe=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=oe.get(E.envMap||G.environment,Fe),G.envMapRotation=G.environment!==null&&E.envMap===null?I.environmentRotation:E.envMapRotation,Ae===void 0&&(E.addEventListener("dispose",gn),Ae=new Map,G.programs=Ae);let Ge=Ae.get(Ee);if(Ge!==void 0){if(G.currentProgram===Ge&&G.lightsStateVersion===Se)return Hc(E,me),Ge}else me.uniforms=ce.getUniforms(E),F!==null&&E.isNodeMaterial&&F.build(E,K,me),E.onBeforeCompile(me,L),Ge=ce.acquireProgram(me,Ee),Ae.set(Ee,Ge),G.uniforms=me.uniforms;const be=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(be.clippingPlanes=Re.uniform),Hc(E,me),G.needsLights=bm(E),G.lightsStateVersion=Se,G.needsLights&&(be.ambientLightColor.value=W.state.ambient,be.lightProbe.value=W.state.probe,be.sunLights.value=W.state.sun,be.sunLightShadows.value=W.state.sunShadow,be.directionalLights.value=W.state.directional,be.directionalLightShadows.value=W.state.directionalShadow,be.spotLights.value=W.state.spot,be.spotLightShadows.value=W.state.spotShadow,be.rectAreaLights.value=W.state.rectArea,be.ltc_1.value=W.state.rectAreaLTC1,be.ltc_2.value=W.state.rectAreaLTC2,be.pointLights.value=W.state.point,be.pointLightShadows.value=W.state.pointShadow,be.hemisphereLights.value=W.state.hemi,be.sunShadowMatrix.value=W.state.sunShadowMatrix,be.sunShadowCascade.value=W.state.sunShadowCascade,be.directionalShadowMatrix.value=W.state.directionalShadowMatrix,be.spotLightMatrix.value=W.state.spotLightMatrix,be.spotLightMap.value=W.state.spotLightMap,be.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=M.state.lightProbeGridArray.length>0,G.currentProgram=Ge,G.uniformsList=null,Ge}function zc(E){if(E.uniformsList===null){const I=E.currentProgram.getUniforms();E.uniformsList=Xr.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function Hc(E,I){const K=q.get(E);K.outputColorSpace=I.outputColorSpace,K.batching=I.batching,K.batchingColor=I.batchingColor,K.instancing=I.instancing,K.instancingColor=I.instancingColor,K.instancingMorph=I.instancingMorph,K.skinning=I.skinning,K.morphTargets=I.morphTargets,K.morphNormals=I.morphNormals,K.morphColors=I.morphColors,K.morphTargetsCount=I.morphTargetsCount,K.numClippingPlanes=I.numClippingPlanes,K.numIntersection=I.numClipIntersection,K.vertexAlphas=I.vertexAlphas,K.vertexTangents=I.vertexTangents,K.toneMapping=I.toneMapping}function Sm(E,I){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;S.setFromMatrixPosition(I.matrixWorld);for(let K=0,G=E.length;K<G;K++){const W=E[K];if(W.texture!==null&&W.boundingBox.containsPoint(S))return W}return null}function Mm(E,I,K,G,W){I.isScene!==!0&&(I=zt),Q.resetTextureUnits();const ge=I.fog,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?I.environment:null,me=X===null?L.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Ye.workingColorSpace,Ee=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ae=oe.get(G.envMap||Se,Ee),Fe=G.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Ge=!!K.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),be=!!K.morphAttributes.position,tt=!!K.morphAttributes.normal,xt=!!K.morphAttributes.color;let ut=An;G.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(ut=L.toneMapping);const rt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Lt=rt!==void 0?rt.length:0,ye=q.get(G),Ut=M.state.lights;if(Ze===!0&&(ot===!0||E!==O)){const ct=E===O&&G.id===R;Re.setState(G,E,ct)}let $e=!1;G.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Ut.state.version||ye.outputColorSpace!==me||W.isBatchedMesh&&ye.batching===!1||!W.isBatchedMesh&&ye.batching===!0||W.isBatchedMesh&&ye.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&ye.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&ye.instancing===!1||!W.isInstancedMesh&&ye.instancing===!0||W.isSkinnedMesh&&ye.skinning===!1||!W.isSkinnedMesh&&ye.skinning===!0||W.isInstancedMesh&&ye.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ye.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ye.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ye.instancingMorph===!1&&W.morphTexture!==null||ye.envMap!==Ae||G.fog===!0&&ye.fog!==ge||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Re.numPlanes||ye.numIntersection!==Re.numIntersection)||ye.vertexAlphas!==Fe||ye.vertexTangents!==Ge||ye.morphTargets!==be||ye.morphNormals!==tt||ye.morphColors!==xt||ye.toneMapping!==ut||ye.morphTargetsCount!==Lt||!!ye.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&($e=!0):($e=!0,ye.__version=G.version);let Kt=ye.currentProgram;$e===!0&&(Kt=er(G,I,W),F&&G.isNodeMaterial&&F.onUpdateProgram(G,Kt,ye));let vn=!1,Gn=!1,Ri=!1;const st=Kt.getUniforms(),mt=ye.uniforms;if(x.useProgram(Kt.program)&&(vn=!0,Gn=!0,Ri=!0),G.id!==R&&(R=G.id,Gn=!0),ye.needsLights){const ct=Sm(M.state.lightProbeGridArray,W);ye.lightProbeGrid!==ct&&(ye.lightProbeGrid=ct,Gn=!0)}if(vn||O!==E){x.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),st.setValue(B,"projectionMatrix",E.projectionMatrix),st.setValue(B,"viewMatrix",E.matrixWorldInverse);const Xn=st.map.cameraPosition;Xn!==void 0&&Xn.setValue(B,ht.setFromMatrixPosition(E.matrixWorld)),C.logarithmicDepthBuffer&&st.setValue(B,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&st.setValue(B,"isOrthographic",E.isOrthographicCamera===!0),O!==E&&(O=E,Gn=!0,Ri=!0)}if(ye.needsLights&&(Ut.state.sunShadowMap.length>0&&st.setValue(B,"sunShadowMap",Ut.state.sunShadowMap,Q),Ut.state.directionalShadowMap.length>0&&st.setValue(B,"directionalShadowMap",Ut.state.directionalShadowMap,Q),Ut.state.spotShadowMap.length>0&&st.setValue(B,"spotShadowMap",Ut.state.spotShadowMap,Q),Ut.state.pointShadowMap.length>0&&st.setValue(B,"pointShadowMap",Ut.state.pointShadowMap,Q)),W.isSkinnedMesh){st.setOptional(B,W,"bindMatrix"),st.setOptional(B,W,"bindMatrixInverse");const ct=W.skeleton;ct&&(ct.boneTexture===null&&ct.computeBoneTexture(),st.setValue(B,"boneTexture",ct.boneTexture,Q))}W.isBatchedMesh&&(st.setOptional(B,W,"batchingTexture"),st.setValue(B,"batchingTexture",W._matricesTexture,Q),st.setOptional(B,W,"batchingIdTexture"),st.setValue(B,"batchingIdTexture",W._indirectTexture,Q),st.setOptional(B,W,"batchingColorTexture"),W._colorsTexture!==null&&st.setValue(B,"batchingColorTexture",W._colorsTexture,Q));const Wn=K.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&U.update(W,K,Kt),(Gn||ye.receiveShadow!==W.receiveShadow)&&(ye.receiveShadow=W.receiveShadow,st.setValue(B,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&I.environment!==null&&(mt.envMapIntensity.value=I.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=PT()),Gn){if(st.setValue(B,"toneMappingExposure",L.toneMappingExposure),ye.needsLights&&Em(mt,Ri),ge&&G.fog===!0&&we.refreshFogUniforms(mt,ge),we.refreshMaterialUniforms(mt,G,ie,J,M.state.transmissionRenderTarget[E.id]),ye.needsLights&&ye.lightProbeGrid){const ct=ye.lightProbeGrid;mt.probesSH.value=ct.texture,mt.probesMin.value.copy(ct.boundingBox.min),mt.probesMax.value.copy(ct.boundingBox.max),mt.probesResolution.value.copy(ct.resolution)}Xr.upload(B,zc(ye),mt,Q)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Xr.upload(B,zc(ye),mt,Q),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&st.setValue(B,"center",W.center),st.setValue(B,"modelViewMatrix",W.modelViewMatrix),st.setValue(B,"normalMatrix",W.normalMatrix),st.setValue(B,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){const ct=G.uniformsGroups;for(let Xn=0,Ci=ct.length;Xn<Ci;Xn++){const Wc=ct[Xn];se.update(Wc,Kt),se.bind(Wc,Kt)}}return Kt}function Em(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.sunLights.needsUpdate=I,E.sunLightShadows.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function bm(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(E,I,K){const G=q.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),q.get(E.texture).__webglTexture=I,q.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:K,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,I){const K=q.get(E);K.__webglFramebuffer=I,K.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(E,I=0,K=0){X=E,$=I,Y=K;let G=null,W=!1,ge=!1;if(E){const me=q.get(E);if(me.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(B.FRAMEBUFFER,me.__webglFramebuffer),H.copy(E.viewport),re.copy(E.scissor),ae=E.scissorTest,x.viewport(H),x.scissor(re),x.setScissorTest(ae),R=-1;return}else if(me.__webglFramebuffer===void 0)Q.setupRenderTarget(E);else if(me.__hasExternalTextures)Q.rebindTextures(E,q.get(E.texture).__webglTexture,q.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Fe=E.depthTexture;if(me.__boundDepthTexture!==Fe){if(Fe!==null&&q.has(Fe)&&(E.width!==Fe.image.width||E.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(E)}}const Ee=E.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ge=!0);const Ae=q.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ae[I])?G=Ae[I][K]:G=Ae[I],W=!0):E.samples>0&&Q.useMultisampledRTT(E)===!1?G=q.get(E).__webglMultisampledFramebuffer:Array.isArray(Ae)?G=Ae[K]:G=Ae,H.copy(E.viewport),re.copy(E.scissor),ae=E.scissorTest}else H.copy(xe).multiplyScalar(ie).floor(),re.copy(ze).multiplyScalar(ie).floor(),ae=St;if(K!==0&&(G=V),x.bindFramebuffer(B.FRAMEBUFFER,G)&&x.drawBuffers(E,G),x.viewport(H),x.scissor(re),x.setScissorTest(ae),W){const me=q.get(E.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+I,me.__webglTexture,K)}else if(ge){const me=I;for(let Ee=0;Ee<E.textures.length;Ee++){const Ae=q.get(E.textures[Ee]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Ee,Ae.__webglTexture,K,me)}}else if(E!==null&&K!==0){const me=q.get(E.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,me.__webglTexture,K)}R=-1};function Gc(E){const I=q.get(E);return(I.__readFormat!==E.format||I.__readType!==E.type)&&(I.__readFormat=E.format,I.__readType=E.type,I.__formatReadable=C.textureFormatReadable(E.format),I.__typeReadable=C.textureTypeReadable(E.type)),I}this.readRenderTargetPixels=function(E,I,K,G,W,ge,Se,me=0){if(!(E&&E.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee){x.bindFramebuffer(B.FRAMEBUFFER,Ee);try{const Ae=E.textures[me],Fe=Ae.format,Ge=Ae.type;E.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me);const be=Gc(Ae);if(be.__formatReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(be.__typeReadable===!1){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-G&&K>=0&&K<=E.height-W&&B.readPixels(I,K,G,W,de.convert(Fe),de.convert(Ge),ge)}finally{const Ae=X!==null?q.get(X).__webglFramebuffer:null;x.bindFramebuffer(B.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(E,I,K,G,W,ge,Se,me=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee)if(I>=0&&I<=E.width-G&&K>=0&&K<=E.height-W){x.bindFramebuffer(B.FRAMEBUFFER,Ee);const Ae=E.textures[me],Fe=Ae.format,Ge=Ae.type;E.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+me);const be=Gc(Ae);if(be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const tt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,tt),B.bufferData(B.PIXEL_PACK_BUFFER,ge.byteLength,B.STREAM_READ),B.readPixels(I,K,G,W,de.convert(Fe),de.convert(Ge),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);const xt=X!==null?q.get(X).__webglFramebuffer:null;x.bindFramebuffer(B.FRAMEBUFFER,xt);const ut=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Fy(B,ut,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,tt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ge),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(tt),B.deleteSync(ut),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,I=null,K=0){const G=Math.pow(2,-K),W=Math.floor(E.image.width*G),ge=Math.floor(E.image.height*G),Se=I!==null?I.x:0,me=I!==null?I.y:0;Q.setTexture2D(E,0),B.copyTexSubImage2D(B.TEXTURE_2D,K,0,0,Se,me,W,ge),x.unbindTexture()},this.copyTextureToTexture=function(E,I,K=null,G=null,W=0,ge=0){let Se,me,Ee,Ae,Fe,Ge,be,tt,xt;const ut=E.isCompressedTexture?E.mipmaps[ge]:E.image;if(K!==null)Se=K.max.x-K.min.x,me=K.max.y-K.min.y,Ee=K.isBox3?K.max.z-K.min.z:1,Ae=K.min.x,Fe=K.min.y,Ge=K.isBox3?K.min.z:0;else{const mt=Math.pow(2,-W);Se=Math.floor(ut.width*mt),me=Math.floor(ut.height*mt),E.isDataArrayTexture?Ee=ut.depth:E.isData3DTexture?Ee=Math.floor(ut.depth*mt):Ee=1,Ae=0,Fe=0,Ge=0}G!==null?(be=G.x,tt=G.y,xt=G.z):(be=0,tt=0,xt=0);const rt=de.convert(I.format),Lt=de.convert(I.type);let ye;I.isData3DTexture?(Q.setTexture3D(I,0),ye=B.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Q.setTexture2DArray(I,0),ye=B.TEXTURE_2D_ARRAY):(Q.setTexture2D(I,0),ye=B.TEXTURE_2D),x.activeTexture(B.TEXTURE0),x.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,I.flipY),x.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),x.pixelStorei(B.UNPACK_ALIGNMENT,I.unpackAlignment);const Ut=x.getParameter(B.UNPACK_ROW_LENGTH),$e=x.getParameter(B.UNPACK_IMAGE_HEIGHT),Kt=x.getParameter(B.UNPACK_SKIP_PIXELS),vn=x.getParameter(B.UNPACK_SKIP_ROWS),Gn=x.getParameter(B.UNPACK_SKIP_IMAGES);x.pixelStorei(B.UNPACK_ROW_LENGTH,ut.width),x.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ut.height),x.pixelStorei(B.UNPACK_SKIP_PIXELS,Ae),x.pixelStorei(B.UNPACK_SKIP_ROWS,Fe),x.pixelStorei(B.UNPACK_SKIP_IMAGES,Ge);const Ri=E.isDataArrayTexture||E.isData3DTexture,st=I.isDataArrayTexture||I.isData3DTexture;if(E.isDepthTexture){const mt=q.get(E),Wn=q.get(I),ct=q.get(mt.__renderTarget),Xn=q.get(Wn.__renderTarget);x.bindFramebuffer(B.READ_FRAMEBUFFER,ct.__webglFramebuffer),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let Ci=0;Ci<Ee;Ci++)Ri&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(E).__webglTexture,W,Ge+Ci),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(I).__webglTexture,ge,xt+Ci)),B.blitFramebuffer(Ae,Fe,Se,me,be,tt,Se,me,B.DEPTH_BUFFER_BIT,B.NEAREST);x.bindFramebuffer(B.READ_FRAMEBUFFER,null),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(W!==0||E.isRenderTargetTexture||q.has(E)){const mt=q.get(E),Wn=q.get(I);x.bindFramebuffer(B.READ_FRAMEBUFFER,D),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,k);for(let ct=0;ct<Ee;ct++)Ri?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,mt.__webglTexture,W,Ge+ct):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,mt.__webglTexture,W),st?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Wn.__webglTexture,ge,xt+ct):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Wn.__webglTexture,ge),W!==0?B.blitFramebuffer(Ae,Fe,Se,me,be,tt,Se,me,B.COLOR_BUFFER_BIT,B.NEAREST):st?B.copyTexSubImage3D(ye,ge,be,tt,xt+ct,Ae,Fe,Se,me):B.copyTexSubImage2D(ye,ge,be,tt,Ae,Fe,Se,me);x.bindFramebuffer(B.READ_FRAMEBUFFER,null),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else st?E.isDataTexture||E.isData3DTexture?B.texSubImage3D(ye,ge,be,tt,xt,Se,me,Ee,rt,Lt,ut.data):I.isCompressedArrayTexture?B.compressedTexSubImage3D(ye,ge,be,tt,xt,Se,me,Ee,rt,ut.data):B.texSubImage3D(ye,ge,be,tt,xt,Se,me,Ee,rt,Lt,ut):E.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,ge,be,tt,Se,me,rt,Lt,ut.data):E.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,ge,be,tt,ut.width,ut.height,rt,ut.data):B.texSubImage2D(B.TEXTURE_2D,ge,be,tt,Se,me,rt,Lt,ut);x.pixelStorei(B.UNPACK_ROW_LENGTH,Ut),x.pixelStorei(B.UNPACK_IMAGE_HEIGHT,$e),x.pixelStorei(B.UNPACK_SKIP_PIXELS,Kt),x.pixelStorei(B.UNPACK_SKIP_ROWS,vn),x.pixelStorei(B.UNPACK_SKIP_IMAGES,Gn),ge===0&&I.generateMipmaps&&B.generateMipmap(ye),x.unbindTexture()},this.initRenderTarget=function(E){q.get(E).__webglFramebuffer===void 0&&Q.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Q.setTextureCube(E,0):E.isData3DTexture?Q.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Q.setTexture2DArray(E,0):Q.setTexture2D(E,0),x.unbindTexture()},this.resetState=function(){$=0,Y=0,X=null,x.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const DT=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),fm=(...n)=>n.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();var NT={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const IT=Z.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:s="",children:r,iconNode:a,...o},c)=>Z.createElement("svg",{ref:c,...NT,width:e,height:e,stroke:n,strokeWidth:i?Number(t)*24/Number(e):t,className:fm("lucide",s),...o},[...a.map(([l,u])=>Z.createElement(l,u)),...Array.isArray(r)?r:[r]]));const Ne=(n,e)=>{const t=Z.forwardRef(({className:i,...s},r)=>Z.createElement(IT,{ref:r,iconNode:e,className:fm(`lucide-${DT(n)}`,i),...s}));return t.displayName=`${n}`,t};const jr=Ne("ArrowDownRight",[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]);const UT=Ne("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);const Eo=Ne("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);const bo=Ne("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);const FT=Ne("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);const OT=Ne("Atom",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]]);const BT=Ne("BadgeCheck",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);const VT=Ne("Blocks",[["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["path",{d:"M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3",key:"1fpvtg"}]]);const pm=Ne("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]);const kT=Ne("BrainCircuit",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M9 13a4.5 4.5 0 0 0 3-4",key:"10igwf"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M16 8V5a2 2 0 0 1 2-2",key:"u6izg6"}],["circle",{cx:"16",cy:"13",r:".5",key:"ry7gng"}],["circle",{cx:"18",cy:"3",r:".5",key:"1aiba7"}],["circle",{cx:"20",cy:"21",r:".5",key:"yhc1fs"}],["circle",{cx:"20",cy:"8",r:".5",key:"1e43v0"}]]);const zT=Ne("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);const HT=Ne("CirclePlay",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]]);const GT=Ne("CircleUserRound",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);const WT=Ne("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]);const Ed=Ne("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]]);const mm=Ne("Component",[["path",{d:"M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",key:"1uwlt4"}],["path",{d:"M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z",key:"10291m"}],["path",{d:"M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z",key:"1tqoq1"}],["path",{d:"M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",key:"1x6lto"}]]);const XT=Ne("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);const jT=Ne("FileCode2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m5 12-3 3 3 3",key:"oke12k"}],["path",{d:"m9 18 3-3-3-3",key:"112psh"}]]);const YT=Ne("Gem",[["path",{d:"M6 3h12l4 6-10 13L2 9Z",key:"1pcd5k"}],["path",{d:"M11 3 8 9l4 13 4-13-3-6",key:"1fcu3u"}],["path",{d:"M2 9h20",key:"16fsjt"}]]);const qT=Ne("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);const $T=Ne("ImagePlus",[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]]);const KT=Ne("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);const ZT=Ne("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);const JT=Ne("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);const QT=Ne("MessageSquareText",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M13 8H7",key:"14i4kc"}],["path",{d:"M17 12H7",key:"16if0g"}]]);const eA=Ne("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);const tA=Ne("MousePointer2",[["path",{d:"M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",key:"edeuup"}]]);const nA=Ne("Move",[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m19 9 3 3-3 3",key:"1mg7y2"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]]);const iA=Ne("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]);const bd=Ne("PanelsTopLeft",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]]);const sA=Ne("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);const gm=Ne("PenTool",[["path",{d:"M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",key:"nt11vn"}],["path",{d:"m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",key:"15qc1e"}],["path",{d:"m2.3 2.3 7.286 7.286",key:"1wuzzi"}],["circle",{cx:"11",cy:"11",r:"2",key:"xmgehs"}]]);const rA=Ne("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);const aA=Ne("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);const oA=Ne("Quote",[["path",{d:"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"rib7q0"}],["path",{d:"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"1ymkrd"}]]);const lA=Ne("Scan",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]]);const cA=Ne("Shapes",[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",key:"1bo67w"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",key:"1bkyp8"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5",key:"w3z12y"}]]);const Td=Ne("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);const vm=Ne("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);const uA=Ne("SquareTerminal",[["path",{d:"m7 11 2-2-2-2",key:"1lz0vl"}],["path",{d:"M11 13h4",key:"1p7l4v"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}]]);const hA=Ne("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);const dA=Ne("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);const fA=Ne("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);const pA=Ne("WandSparkles",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]);const mA=Ne("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),gA="/assets/euxd-symbol-transparent-C2De_RbL.png",vA="/assets/xu-dejie-portrait-h06_vjdc.jpg",si=(()=>{const n="./library/index.html#library",e=new URL(n,window.location.href);return e.searchParams.set("mode","immersive"),e.searchParams.set("entry","portfolio"),e.hash||(e.hash="#library"),e.toString()})(),xA="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E7%AE%80%E5%8E%86/%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6/%E8%AE%B8%E5%BE%B7%E6%9D%B0%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86.pdf?v=20261020182226",_A=(()=>{const n=new URL(si);return n.searchParams.set("root","medical-insurance"),n.hash="#project/c117f2c8-c22c-4554-bf09-81b90e352b83",n.toString()})(),yA=(()=>{const n=new URL(si);return n.searchParams.set("root","digital-portal"),n.hash="#project/73400866-eb3f-4405-8550-7b29cb305715",n.toString()})(),SA=(()=>{const n=new URL(si);return n.searchParams.set("root","favorites"),n.hash="#project/5217b0cc-6e18-4b9b-8e7c-2e82a20a9fdc",n.toString()})(),MA=(()=>{const n=new URL(si);return n.searchParams.set("root","favorites"),n.hash="#project/450489d8-8fdf-417a-bb7a-202b6c5873d7",n.toString()})(),EA=(()=>{const n=new URL(si);return n.searchParams.set("root","favorites"),n.hash="#project/5a93963d-0d2e-4d92-b1ad-21e2f990bac9",n.toString()})(),bA=(()=>{const n=new URL(si);return n.searchParams.set("root","other-projects"),n.hash="#project/ce93d2cb-102c-42e6-ab5d-76fbdd1d4dcf",n.toString()})();function TA(){return v.jsxs("svg",{className:"contact-brand-euxui",viewBox:"584.2 849.7 300 300","aria-hidden":"true",focusable:"false",children:[v.jsx("defs",{children:v.jsx("clipPath",{id:"contact-euxui-cutout-clip",children:v.jsx("path",{transform:"matrix(1,0,0,-1,0,2000)",d:"M634.202 900.298H754.202V1020.3H634.202Z"})})}),v.jsx("path",{transform:"matrix(1,0,0,-1,884.2017,999.7017)",d:"M0 0C0-82.843-67.157-150-150-150-232.843-150-300-82.843-300 0-300 82.843-232.843 150-150 150-67.157 150 0 82.843 0 0",fill:"#196ffa"}),v.jsxs("g",{className:"contact-brand-euxui-cutouts",children:[v.jsx("g",{className:"contact-brand-euxui-cutout-piece",opacity:".6",clipPath:"url(#contact-euxui-cutout-clip)",children:v.jsx("path",{transform:"matrix(1,0,0,-1,677.642,1019.7017)",d:"M0 0H36.56V40H-41.438C-42.75 33.538-43.44 26.85-43.44 20-43.44-35.229 1.331-80 56.56-80 63.409-80 70.097-79.31 76.56-77.998V-36.56C70.3-38.78 63.571-40 56.56-40 30.487-40 8.256-23.278 0 0",fill:"#fff"})}),v.jsx("g",{className:"contact-brand-euxui-cutout-piece",children:v.jsx("path",{transform:"matrix(1,0,0,-1,734.2017,899.70169)",d:"M0 0C-6.85 0-13.538-.69-20-2.002V-43.44C-13.74-41.22-7.011-40 0-40 26.073-40 48.303-56.722 56.56-80H20V-120H97.998C99.31-113.538 100-106.85 100-100 100-44.771 55.229 0 0 0",fill:"#fff"})})]})]})}function AA(){return v.jsxs("svg",{className:"contact-project-library-icon",viewBox:"0 0 52 52","aria-hidden":"true",focusable:"false",children:[v.jsx("rect",{className:"contact-library-slab contact-library-slab-back",x:"12",y:"6",width:"34",height:"34",rx:"7"}),v.jsx("rect",{className:"contact-library-slab contact-library-slab-middle",x:"8",y:"10",width:"34",height:"34",rx:"7"}),v.jsx("rect",{className:"contact-library-body",x:"4",y:"14",width:"34",height:"34",rx:"7"}),v.jsxs("g",{className:"contact-library-tiles",children:[v.jsx("rect",{x:"10",y:"20",width:"9",height:"9",rx:"2"}),v.jsx("rect",{x:"23",y:"20",width:"9",height:"9",rx:"2"}),v.jsx("rect",{x:"10",y:"33",width:"9",height:"9",rx:"2"}),v.jsx("rect",{x:"23",y:"33",width:"9",height:"9",rx:"2"})]})]})}const Ss=[{icon:gm,title:"产品体验设计",body:"把复杂业务转化为清晰的产品流程、信息架构与多端体验方案。",accent:"#4f7df3"},{icon:iA,title:"设计管理",body:"建设团队、培养骨干、调配资源，让多产品线在高约束下稳定交付。",accent:"#df6b57"},{icon:mm,title:"设计系统",body:"连接规范、设计源、前端组件与业务模块，沉淀可持续复用的组织资产。",accent:"#259a78"},{icon:pm,title:"AI 产品工程",body:"从需求分析到可运行 Demo，用 AI Coding 缩短想法与真实产品之间的距离。",accent:"#8b63d9"},{icon:VT,title:"跨专业协作",body:"协同产品、研发、业务和客户，持续控制方案、实现与最终体验的一致性。",accent:"#d49322"}],Lr=[{label:"定位",title:"个人定位与职业画像",description:"职业定位、成长主线与就业方向",modal:{kicker:"PRODUCT EXPERIENCE · DESIGN LEADERSHIP",lead:"长期深耕医疗数字化的产品体验与设计管理负责人，具备 UX / UI、复杂业务理解、跨专业团队管理、设计体系和 Design Engineering 实践经验。",stats:[{value:"2014",label:"职业设计起点"},{value:"2017",label:"开始深耕医疗数字化"},{value:"200+",label:"项目参与及统筹支持"},{value:"44 人",label:"跨专业团队管理峰值"}],sections:[{title:"职业定位",body:"从工业设计学习和平面视觉实践开始，逐步进入数字产品界面设计、用户体验设计与医疗数字化领域。随着项目和团队责任扩大，工作内容从具体页面输出，延伸到业务理解、体验方案、跨专业协作、人员管理、落地质量和组织资产建设。"},{title:"职业成长主线",body:"工业设计 → 平面与品牌视觉 → UI 设计 → UX 设计 → 设计管理 → 跨设计与研发团队管理 → AI × Design PDE 全链路产品体验工程师。"},{title:"职业方向",items:["产品设计工程师（PDE）｜产品规划 × UX × AI 开发实现：独立完成需求分析、功能规划、业务流程、交互与视觉设计，并借助 AI Coding 实现可运行的前端 Demo。交付物包含可供研发接续开发的真实前端代码，具备将产品想法从 0 到 1 推进为可体验成品并完成产品落地的能力。","设计管理负责人｜团队管理 × 人才培养 × 体验体系：负责团队建设、人才培养、资源调配、绩效评价与跨部门协作。建立跨部门协作、体验走查及组件库机制，引入 AI 辅助设计流程，让团队稳定支撑多条并行产品线并保障产出质量。"]}]}},{label:"职责",title:"核心职责",description:"产品体验、项目协作、团队管理与资产沉淀",modal:{kicker:"ROLE · DELIVERY · SYSTEMIZE",lead:"工作不只停留在界面输出，而是持续参与复杂医疗产品的需求理解、流程设计、交互视觉、研发协作与交付检查，并把有效经验沉淀为团队能力。",stats:[{value:"需求",label:"理解业务与问题定义"},{value:"设计",label:"流程、交互与视觉方案"},{value:"落地",label:"研发协作与实现验证"},{value:"沉淀",label:"组件、规范与组织资产"}],sections:[{title:"医疗数字化产品体验设计",items:["持续参与需求理解、信息架构、交互与视觉方案、设计评审和落地推进","覆盖医保电子凭证、电子健康卡等国家及行业规范","覆盖医保移动支付、医保刷脸终端和医保综合服务终端","覆盖区域便民服务、健康档案、医院公众号、小程序、APP 与互联网医院","覆盖 PC 管理后台、可视化大屏、AI 数字人自助机和医疗终端"]},{title:"项目统筹与跨部门推进",items:["协同产品、研发、业务、运营、项目与设计之间的资源和需求调配","参与需求判断、项目排期、资源协调和方案评审","控制最终交付的体验质量并跟进问题整改","对重点项目和高标准需求组织专项攻坚，在时间与资源受限时保障关键节点"]},{title:"跨专业团队管理",items:["形成设计与前端深度协作机制，把设计质量延伸到最终产品体验","综合关注产品线支撑、人员调配、响应速度、质量、成本和业务价值","在团队规模变化中持续调整岗位结构、骨干分工和项目支撑方式","通过负责人和 AB 角机制保障并行项目的连续性"]},{title:"体验体系与设计资产",items:["牵头推进体验走查系统，让问题发现、记录、整改、跟踪和复核形成闭环","推动公司级 EUXD 组件库及设计与前端组件映射","建设插画库、图标库、页面库、业务库和标准化界面资产","参与体验门户、内容平台、设计协作平台和组件展示平台建设","通过规范、文章与 Case Study 持续沉淀团队经验"]},{title:"人才培养与团队文化",items:["参与招聘、面试、职级评估、人才配置与绩效管理","通过设计周练、内部分享和专业交流提升团队能力","推动设计师从界面执行成长为能够理解业务、表达方案并独立解决问题的人","搭建 EUXD 公众号，持续沉淀团队知识与文化"],image:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A6%96%E9%A1%B5/%E5%9B%A2%E9%98%9F%E6%96%87%E5%8C%96/%E5%9B%A2%E9%98%9F%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.png?v=20261019153905",alt:"易惠科技 EUXD 团队公众号二维码"}}]}},{label:"管理",title:"管理经验",description:"资源调度、结果评价、协作与人才培养",modal:{kicker:"LEADERSHIP · TEAM · OPERATIONS",lead:"管理能力来自真实组织与业务场景：在多产品线、突发需求和资源变化中，通过负责人机制、互补角色和组织资产建立稳定支撑。",stats:[{value:"0→1",label:"用户体验团队与体系建设"},{value:"44 人",label:"跨专业团队最高规模"},{value:"23 人",label:"设计与 APP 前端管理规模"},{value:"5 人",label:"精简团队支撑多产品线"}],sections:[{title:"从人员规模转向组织能力",items:["管理目标不是单纯扩大人数，而是提高团队在多人、多项目环境中的稳定交付能力","面对资源紧张和需求波动，优先稳定骨干、明确产品线负责人并进行跨项目机动调配","建立互补角色，降低对单一成员临时救火的依赖","用高能力的小团队配合标准化资产，提高真实交付效率"]},{title:"以结果和实际价值评价",items:["数量与时间：项目产出和关键节点响应","质量：方案质量、落地一致性和问题修复","成本与效率：返工、重复劳动和资源使用","项目支撑：对产品线与项目推进的实际贡献","项目配合：跨部门沟通、协作态度和问题处理","专业能力：复杂问题解决、业务理解和设计判断","团队贡献：知识分享、人才培养和组织资产沉淀"]},{title:"多产品线支撑与资源调度",items:["通过产品线映射明确成员的主要支撑方向","根据项目优先级和资源紧张程度动态调配","对高风险、高标准和紧急项目安排骨干攻坚","通过阶段复盘掌握产出情况并评估风险点","通过多项目 AB 角互补保障项目协作连续性"]},{title:"跨部门共同负责结果",items:["参与需求和体验判断","参与产品流程与方案讨论","通过原型、组件和前端实现验证方案","在研发过程中定位并推动解决体验问题","执行上线前后的体验走查","参与客户沟通、展示与方案审核"]},{title:"人才培养",items:["专业能力：视觉、交互、设计系统和工具能力","业务理解：理解产品目标、用户场景和医疗业务","表达能力：文档、分享、汇报和设计理念讲述","总结能力：把项目经验提炼为方法和知识资产","跨部门沟通：与产品、研发、业务和客户有效协作","独立解决问题：从接受任务走向识别问题并推动解决"]}]}},{label:"能力",title:"专业能力地图",description:"产品、设计、AI",modal:{kicker:"EXPERTISE · EVIDENCE · PRACTICE",lead:"以能力与证据对应的方式呈现专业深度：从复杂业务、信息架构和视觉表达，到设计系统、体验评估、多端设计、工程验证与 AI 产品体验。",stats:[{value:"8 项",label:"核心专业能力"},{value:"多端",label:"移动端、后台、大屏与终端"},{value:"Vibe Coding",label:"设计与前端组件映射"},{value:"AI × UX",label:"新工具进入真实业务"}],sections:[{title:"产品与业务",items:["复杂医疗、医保和区域健康业务理解","需求分析、目标判断与产品流程设计","多角色、多渠道和多终端场景设计","产品标准化、SaaS 与模块复用","项目优先级、风险和资源协调","把业务规则转化为清晰的信息架构"]},{title:"用户体验与视觉设计",items:["UX / UI 视觉界面设计","交互流程与高保真原型","多端一致性与定制化适配","设计规范和组件体系","体验走查与落地质量控制"]},{title:"设计系统与组件化",items:["全局组件库与业务组件建设","设计源与前端组件 1:1 映射","页面、图标、插画与标准化资产","产品框架与业务模块复用","通过门户和文档建立持续维护机制"]},{title:"Design Engineering",items:["快速完成高保真原型设计与演示","通过 Prototype / Demo 提前验证方案","使用 AI 工具直接编写前端代码并完成开发交付","把设计方案转化为可继续开发的真实前端成品"]},{title:"AI 辅助设计与产品体验",items:["AI 医疗数字人、预问诊、就医指引与智能外呼","AI 辅助视觉、IP、插画和图标设计","使用 GPT-4o、Codex 等工具开展方案探索与实现","推动 Vibe Coding 进入设计和前端验证过程"]},{title:"工具与技术",items:["设计：Sketch、Figma、Illustrator、Photoshop、Flinto","协作与资产：蓝湖、Synology Drive","研发概念与框架：Taro、Vue、Vant UI","多端：小程序、H5、PC 后台、可视化大屏与自助终端","方法：组件化、标准化、走查和前端验证"]}]}},{label:"资产",title:"EUXD组件库与设计资产体系",description:"组件、规范、复用效率、走查系统、展示门户",modal:{kicker:"DESIGN SYSTEM · COMPONENT PLATFORM",lead:"推动设计规范、设计组件和前端组件建立映射，把多个医疗项目中的共性能力沉淀为公司级资产，从重复制作走向组织级复用。",stats:[{value:"4 组",label:"原子库"},{value:"11 组",label:"分子库"},{value:"20 组",label:"页面库"},{value:"1300+",label:"图标资产"},{value:"25 组",label:"开发组件"},{value:"120+",label:"2.0 版本使用反馈"}],sections:[{title:"界面走查校对系统",items:["前端实现与设计方案存在偏差，零散沟通缺少统一记录","问题难以持续跟踪，版本之间容易重复出现","体验检查依赖个人经验，缺少可复盘的数据和机制","将设计工作的终点从交付设计稿延伸到产品落地达标"]},{title:"体验质量闭环",items:["发现问题 → 记录问题 → 评估建议 → 进入排期 → 完成优化 → 复核结果","支持界面还原度走查和产品流程自查","管理问题、版本、整改状态与优化效果","一键生成走查报告，并通过体验评分辅助后续优化"],note:"界面走查校对系统于 2020 年正式上线使用。"},{title:"组件体系建设动因",items:["多医院、多区域和多终端项目存在大量相似需求","设计风格、交互逻辑和前端实现不一致","设计与前端重复制作基础元素","组件版本分散，维护与复用成本高","项目周期紧张时交付质量不稳定"]},{title:"体系组成",items:["原子库、分子库和页面库","图标库、插画库、业务库与项目模板","前端组件和项目框架","组件门户、知识文档和私有 NPM 源","覆盖后台、可视化大屏、标准页面和多类业务场景"]},{title:"设计与研发映射",items:["设计组件与前端组件采用 1:1 映射思路","设计师从组件库调用设计资源，前端调用对应组件和代码包","统一维护组件和版本升级，降低跨部门规范对齐成本","通过私有 NPM 源、门户展示和项目框架形成从设计到开发的使用链路"]},{title:"阶段效率数据",items:["总交付周期：32.5 天 → 17.1 天","UI 设计平均交付周期：7.5 天 → 3.4 天","前端开发平均交付周期：25 天 → 14.6 天"],note:"以上为阶段性样本，正式公开时需结合统计年份和样本范围理解。"},{title:"插画与视觉资产",items:["沉淀统一的风格、角色、姿势、场景与可复用素材","减少 Banner 和场景插画的重复绘制","提高跨项目视觉一致性和交付速度","逐步形成角色、背景、建筑、家具、动物、医疗和支付等场景资产"]},{title:"EUXD 团队展示矩阵",items:["完成 EUXD PC 门户、小程序和微信公众号上线","统一团队品牌形象、视觉风格与内容表达","持续发布项目案例、设计成果、专业文章和团队动态","将分散成果沉淀为可持续更新的团队数字资产"],note:"EUXD 门户于 2020 年底上线，形成 PC 网站、小程序和公众号的多端展示入口。"}]}},{label:"荣誉",title:"个人荣誉",description:"2023 年厦门市思明区骨干人才引进批次 · 2017 年优秀员工 · 2018 年最佳导师",modal:{kicker:"HONORS · RECOGNITION",lead:"来自城市人才政策与企业内部评价的阶段性认可，记录专业成长、团队协作与人才培养中的持续投入。",stats:[{value:"2023",label:"思明区骨干人才引进批次"},{value:"2017",label:"优秀员工"},{value:"2018",label:"最佳导师"}],sections:[{title:"荣誉记录",items:["2023 年厦门市思明区骨干人才引进批次","2017 年优秀员工","2018 年最佳导师"]}]}}],fi=[{number:"01",eyebrow:"国家级医保服务",title:"医保电子凭证",summary:"刷社保卡曾是就医核身与结算的常态，但在互联互通时代，实体卡易遗忘、易丢失、跨渠道使用受限。医保电子凭证将“刷卡”转化为“展码、扫码”，让无卡就医成为更便捷的体验。作为国家医保局相关软件承建方，我们深度参与展码界面及规范标准制定，并承担后续医保移动支付 SDK 的流程设计。围绕真实结算场景，将身份核验、费用拆分、个人账户与亲情账户支付、多渠道支付整合为连续清晰的移动体验；统一视觉与交互标准并推广至各地渠道，为地方定制提供可对接的国家规范。电子凭证上线后，显著减少窗口排队、流程反复和实体卡依赖，提升患者就医缴费的便捷性与安全感。",tags:["医保移动支付","国家级项目","服务设计","移动端"],image:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A6%96%E9%A1%B5/%E9%A1%B9%E7%9B%AE%E9%85%8D%E5%9B%BE/medical-insurance-voucher-payment.jpg?v=20261016175433",alt:"手持手机展示医保电子凭证移动支付界面"},detailUrl:_A,visual:"insurance"},{number:"02",eyebrow:"医院数字服务入口",title:"数字医院门户",summary:"专注于医院就医服务的线上便民化，覆盖患者从就医前准备到诊后管理的连续服务，将医院介绍、智能导诊、预约挂号、门诊缴费、报告查询、住院服务与个人中心整合为统一的数字医院入口。在公众号、小程序等渠道承接不同场景下的就医需求，提升患者使用效率与医院线上服务能力。近期，我们为福建孟超肝胆医院完成数字医院 3.0 版本升级，个人全程独立完成产品规划、UI 设计及前端小程序代码，并最终以代码方式进行开发交付，最终产品上线落地。",tags:["数字医院","患者服务","多端门户","全流程体验"],image:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A6%96%E9%A1%B5/%E9%A1%B9%E7%9B%AE%E9%85%8D%E5%9B%BE/digital-hospital-portal.jpg?v=20261019173646",alt:"福州大学孟超肝胆智慧医院数字医院门户界面展示"},detailUrl:yA,visual:"regional"},{number:"03",eyebrow:"线上诊疗服务",title:"互联网医院",summary:"围绕线上复诊与持续健康服务，将图文问诊、视频问诊、病情资料提交、医生接诊、电子处方、在线支付、药品配送和诊后随访连接为完整的互联网诊疗链路，让患者能够在院外持续获得专业医疗服务，也帮助医生和运营人员更高效地处理问诊、处方与履约任务。同时也衍生了很多互联网服务相关的医疗服务，例如护士护理上门、病例邮寄、家庭病床等等。",tags:["在线问诊","电子处方","远程医疗","诊疗闭环"],image:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A6%96%E9%A1%B5/%E9%A1%B9%E7%9B%AE%E9%85%8D%E5%9B%BE/internet-hospital-project.jpg?v=20261019174514",alt:"小易护理上门护理服务界面展示"},detailUrl:SA,visual:"health-card"},{number:"04",eyebrow:"院内智慧服务",title:"AI刷脸终端",summary:"公共区域的医院自助终端长期沿用带有明显时代感的设计，无论操作体验还是视觉呈现都有较大升级空间。近年来，我们面向多家医院持续迭代全新的自助终端方案，并结合刷脸与 AI 能力，覆盖医院大厅、药房和服务窗口等场景，将建档、挂号、缴费、报告打印、医保结算、业务查询与智能用药咨询集中到一台设备。通过刷脸、语音对话等交互方式简化高频业务步骤，并针对老年用户及不同需求人群的操作痛点进行优化，帮助医院分流人工窗口压力，提升院内服务效率与可达性。我们还与支付宝、蚂蚁金服等合作方共同制定刷脸终端的界面标准与交互规范。",tags:["自助服务","医保结算","多尺寸终端","适老体验"],video:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E5%85%B6%E4%BB%96%E9%A1%B9%E7%9B%AE/%E5%85%B6%E4%BB%96/ai-face-terminal-demo-540x960-30fps.mp4?v=20261019161447",poster:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E5%85%B6%E4%BB%96%E9%A1%B9%E7%9B%AE/%E5%85%B6%E4%BB%96/AI%E8%B4%AD%E8%8D%AF%E7%BB%88%E7%AB%AF%E6%BC%94%E7%A4%BA%E5%8A%A8%E7%94%BB-poster.webp?v=20261016161044"},detailUrl:MA,visual:"system"},{number:"05",eyebrow:"AI 智能就医",title:"AI智能问诊助手",summary:"结合自然语言交互、症状采集与医疗知识，为患者提供预问诊、智能导诊、就医指引、问题补充和用药信息查询。系统将用户口语化、碎片化的描述逐步整理为结构化诊前信息，并通过追问和风险提示帮助用户明确下一步就医方向，同时为医生提供更完整的病情摘要，减少重复沟通并提升接诊效率。",tags:["AI 助手","智能问诊","就医引导","结构化采集"],image:{src:"https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86/%E9%A6%96%E9%A1%B5/%E9%A1%B9%E7%9B%AE%E9%85%8D%E5%9B%BE/ai%E5%8A%A9%E6%89%8B.png?imageMogr2/thumbnail/1600x/format/webp/quality/82",alt:"手持手机展示AI数字人就医助手界面"},detailUrl:EA,visual:"ai"}],Ad=[[{name:"Figma",icon:cA},{name:"Sketch",icon:YT},{name:"Illustrator",icon:gm},{name:"Photoshop",icon:KT},{name:"Flinto",icon:Td},{name:"Axure RP",icon:bd},{name:"Principle",icon:HT},{name:"After Effects",icon:pA},{name:"设计系统",icon:mm}],[{name:"GPT-4o",icon:QT},{name:"Codex",icon:uA},{name:"Claude",icon:kT},{name:"Gemini",icon:vm},{name:"Cursor",icon:tA},{name:"AI 视觉生成",icon:$T},{name:"Vibe Coding",icon:Ed},{name:"高保真原型",icon:lA}],[{name:"蓝湖",icon:WT},{name:"Synology Drive",icon:qT},{name:"Taro",icon:Td},{name:"Vue",icon:Ed},{name:"Vant UI",icon:bd},{name:"React",icon:OT},{name:"TypeScript",icon:jT},{name:"Framer Motion",icon:nA},{name:"前端验证",icon:BT}]],wA=[["#ef5b35","#d18b00","#e87900","#1473e6","#705cf6","#326ce5","#8b5cf6","#7c68e8","#119b72"],["#10a37f","#64748b","#d97757","#4285f4","#4f46e5","#db4f9b","#7c3aed","#0891b2"],["#1689f8","#d59b00","#6190e8","#35a872","#07a957","#149eca","#3178c6","#3366ff","#0d9488"]],RA=[{years:"2024 — 至今",company:"腾云易惠科技",department:"产品体验部",level:"部门经理",responsibilities:["主导公司设计团队的创建与管理，负责人员绩效考评及专业能力培养。","保障重点项目难点攻坚，并统筹调配公司内部多条产品线的设计资源。","主导完成国家级项目医保电子凭证、CHS 刷脸终端等多个重点战略项目的设计及标准规范制定。","探索并引入 AI 新机制，解锁 Vibe Coding 等全新的 AI 技能。","牵头搭建公司级组件库，完成设计团队标准化 SOP，促进团队产出与交付效率提升。","建立团队整体设计风格趋势与规范，并推动其在团队产出中落地。"],achievements:["主导产出公司级组件库平台。","完成界面走查系统搭建。","完成国家级重大项目设计，包括医保电子凭证、电子健康卡建设、刷脸终端等。","通过 Vibe Coding 实现从单一技能设计师到全栈 AI 工程师的转变，将静态设计稿交付升级为代码交付。","在司期间获评年度优秀员工、优秀导师，并入选 2023 年厦门市思明区骨干人才引进批次。"]},{years:"2017 — 2024",company:"易联众易惠科技",phases:[{years:"2021 — 2024",department:"产品体验部",level:"部门经理",summary:"管理 UI 设计与前端开发团队共 23 人，持续推进体验走查、组件库、前端框架、标准化产品与人才梯队建设。"},{years:"2020 — 2021",department:"用户体验中心",level:"中心负责人",summary:"负责 UI、APP 前端和中台开发三支团队，最高管理规模 44 人，建立跨设计与研发的体验质量协作机制。"},{years:"2017 — 2019",department:"UI 设计组",level:"UI 主管",summary:"建设设计团队基础协作方式，参与区域医疗、医院服务和医保产品设计，推动设计质量与跨部门协作。"}]},{years:"2015.05 — 2017.04",company:"厦门象屿集团有限公司",department:"信息中心",level:"UI 设计主管",responsibilities:["负责 OA 移动化、供应链 ERP 与物业 APP 等业务产品的界面设计，推动企业服务从桌面端向移动端延伸。"],achievements:["完成集团物流 ERP 系统搭建。","完成集团 OA 办公平台设计。","完成集团官网门户设计。"]},{years:"2014.02 — 2015.05",company:"百鱼科技",department:"UI 设计部",level:"UI 设计师",responsibilities:["参与数字产品的界面与视觉设计，持续积累产品结构、交互呈现和多页面视觉一致性的实践经验。"],achievements:["推动百鱼 APP 成就系统上线运营。"]},{years:"2013.04 — 2014.02",company:"厦门蜗牛传媒有限公司",department:"设计部",level:"实习设计师",responsibilities:["从品牌、包装和平面视觉设计开始职业实践，建立对形式、色彩、版式与视觉表达的基础认知，负责各类项目的 VI 提案与视觉包装。"],achievements:["在职期间以实习设计师身份独自主导卡尔顿企业整体 VI 设计，包括品牌标志从 0 到 1 的设计与落地。该品牌现已发展为漳州烘焙行业的龙头企业，相关品牌信息可通过公开渠道查询。"]}],CA=[{years:"2010 — 2014",company:"福州大学",department:"工业设计",level:"本科",summary:"以工业设计为专业基础，系统建立对形式、色彩、信息层级与视觉表达的认知，为后续品牌视觉、数字产品界面与用户体验设计形成跨媒介的设计基础。"},{years:"2007 — 2010",company:"铭选中学",department:"高中",level:"高中",summary:"完成高中阶段学习，并在此后进入福州大学工业设计专业继续学习。"}],PA=[{label:"首页",english:"Home",id:"home"},{label:"能力",english:"Expertise",id:"expertise"},{label:"项目",english:"Projects",id:"projects"},{label:"工具",english:"Tools",id:"tools"},{label:"经历",english:"Experience",id:"experience"},{label:"联系",english:"Contact",id:"contact"}],wd=[{title:"产品体验工程师"},{title:"体验设计师"},{title:"AI开发工程师"},{title:"AI产品经理"}],Rd="我是许德杰，一名专注且有强迫症的",Cd=["复杂需求，我能先帮你梳理明白","你给我一个想法，我能把它做成完整方案","原型、交互和视觉，我可以一套做完","陌生又复杂的业务，我也能快速找到重点","多端产品，我能把体验和规范统一起来","设计稿交出去后，我会一直盯到真正落地","项目多、资源紧，我能把人和事情协调好","组件库和设计系统，我能从零开始搭起来","用 AI 做原型和前端，我能快速跑出 Demo","人少事多的时候，我也能把交付稳住"],To=["业务需求","产品原型","交互体验","视觉界面","前端落地","AI开发"],Pd=["BR","PR","UX","UI","FE","AI"],pi=[{light:"#167e91",dark:"#68c8d6"},{light:"#456fc4",dark:"#82a8f2"},{light:"#7859a6",dark:"#b59ae0"},{light:"#c75f55",dark:"#ef958c"},{light:"#b47725",dark:"#e5b364"},{light:"#2b8a68",dark:"#6bc6a4"}],LA={hidden:{},visible:{transition:{delayChildren:.28,staggerChildren:.045}},exit:{transition:{staggerChildren:.04}}},Ld={hidden:{opacity:0,y:"155%"},visible:{opacity:1,y:0,transition:{duration:.8,ease:[.19,1,.22,1]}},exit:{opacity:0,y:"-110%",transition:{duration:.36,ease:[.4,0,1,1]}}},DA={hidden:{},visible:{transition:{delayChildren:.12,staggerChildren:.035}}},Dd={A:[[[0,0],[.5,1],[1,0]],[[.22,.43],[.78,.43]]],B:[[[0,0],[0,1],[.58,1],[.86,.86],[.86,.63],[.6,.5],[0,.5]],[[.6,.5],[.94,.37],[.94,.14],[.62,0],[0,0]]],E:[[[.92,1],[0,1],[0,0],[.92,0]],[[0,.5],[.72,.5]]],F:[[[.92,1],[0,1],[0,0]],[[0,.5],[.72,.5]]],I:[[[0,1],[1,1]],[[.5,1],[.5,0]],[[0,0],[1,0]]],P:[[[0,0],[0,1],[.6,1],[.9,.84],[.9,.64],[.6,.5],[0,.5]]],R:[[[0,0],[0,1],[.58,1],[.9,.84],[.9,.64],[.58,.5],[0,.5]],[[.5,.5],[1,0]]],U:[[[0,1],[0,.25],[.16,.04],[.5,0],[.84,.04],[1,.25],[1,1]]],X:[[[0,1],[1,0]],[[1,1],[0,0]]]};function NA(n){const i=n.length*1+Math.max(0,n.length-1)*.34,s=[-.48,-.24,0,.24,.48],r=.055,a=[],o=s.slice(0,-1).map(()=>[]),c=(d,h,p)=>{d.push(h.x,h.y,h.z,p.x,p.y,p.z)};Array.from(n).forEach((d,h)=>{const p=Dd[d]??Dd.I,g=h*(1+.34)-i/2;p.forEach(y=>{for(let m=0;m<y.length-1;m+=1){const[f,b]=y[m],[A,S]=y[m+1],T=g+f,M=b-.5,P=g+A,_=S-.5,w=Math.max(.001,Math.hypot(P-T,_-M)),L=-(_-M)/w*r,N=(P-T)/w*r,F=[[T+L,M+N],[P+L,_+N],[P-L,_-N],[T-L,M-N]];s.forEach((V,D)=>{const k=D===s.length-1?a:o[D];F.forEach(([$,Y],X)=>{const[R,O]=F[(X+1)%F.length];c(k,new j($,Y,V),new j(R,O,V))})}),F.forEach(([V,D])=>{for(let k=0;k<s.length-1;k+=1)c(o[k],new j(V,D,s[k]),new j(V,D,s[k+1]))})}})});const l=new nn;l.setAttribute("position",new $t(a,3)),l.computeBoundingSphere();const u=o.map(d=>{const h=new nn;return h.setAttribute("position",new $t(d,3)),h.computeBoundingSphere(),h});return{faceGeometry:l,depthGeometries:u,wordWidth:i}}function IA({reduceMotion:n}){const[e,t]=Z.useState(0),i=Z.useRef(null);return Z.useEffect(()=>{if(n)return;const s=window.setInterval(()=>{t(r=>(r+1)%To.length)},5e3);return()=>window.clearInterval(s)},[n]),Z.useEffect(()=>{const s=i.current,r=s?.parentElement;if(!s||!r)return;const a=new fS,o=new Jt(28,1,.1,100);o.position.set(0,.08,7.8),o.lookAt(0,0,0);const c=new LT({canvas:s,antialias:!0,alpha:!0,powerPreference:"high-performance"});c.setClearColor(0,0),c.outputColorSpace=Yt;const l=new Ji;l.scale.setScalar(1.07),l.position.y=.08,l.rotation.set(-.16,-.42,.02),a.add(l);const u=Pd.map((D,k)=>{const{faceGeometry:$,depthGeometries:Y,wordWidth:X}=NA(D),R=new Ji,O=new Bl({color:pi[k].light,transparent:!0,opacity:0,depthWrite:!1}),H=Y.map(()=>new Bl({color:pi[k].light,transparent:!0,opacity:0,depthWrite:!1})),re=new go($,O),ae=Y.map((ke,je)=>new go(ke,H[je])),Ve=Math.min(1.6,3.25/X);return R.scale.setScalar(Ve),R.add(...ae,re),R.visible=!1,l.add(R),{group:R,faceMaterial:O,depthMaterials:H,baseScale:Ve,amount:0}});let d=0,h=!0,p=0,g="",y=0,m=0,f=0,b=0,A=0,S=0,T=r.getBoundingClientRect();const M=[.22,.27,.34,.42],P=D=>{if(D.pointerType&&D.pointerType!=="mouse")return;const k=Math.max(T.left-D.clientX,0,D.clientX-T.right),$=Math.max(T.top-D.clientY,0,D.clientY-T.bottom),Y=Math.hypot(k,$)<=120;if(y=Y?1:0,!Y)return;const X=T.left+T.width/2,R=T.top+T.height/2,O=Lh.clamp((D.clientX-X)/(T.width*.5),-1.15,1.15),H=Lh.clamp((D.clientY-R)/(T.height*.5),-1.15,1.15);b=O*.3,f=-H*.18},_=()=>{y=0},w=()=>{T=r.getBoundingClientRect()},L=()=>{w();const D=s.getBoundingClientRect();c.setPixelRatio(Math.min(window.devicePixelRatio||1,1.45)),c.setSize(D.width,D.height,!1),o.aspect=D.width/Math.max(1,D.height),o.updateProjectionMatrix()},N=D=>{if(!h){d=0;return}d=window.requestAnimationFrame(N);const k=y>0||m>.01;if(!n&&!k&&D-p<1e3/30)return;p=D;const $=Number(r.dataset.pattern??0);if(u.forEach((X,R)=>{const O=R===$?1:0;X.amount+=(O-X.amount)*(n?1:.075),X.group.visible=X.amount>.008,X.faceMaterial.opacity=X.amount*.94,X.depthMaterials.forEach((H,re)=>{H.opacity=X.amount*M[re]}),X.group.scale.setScalar(X.baseScale*(.9+X.amount*.1)),X.group.position.y=(1-X.amount)*-.18+(n?0:Math.sin(D*.001+R)*.025),X.group.rotation.y=(1-X.amount)*.24}),!n){m+=(y-m)*.16,A+=(f-A)*.2,S+=(b-S)*.2;const X=1-m*.78;l.rotation.x=-.13+Math.sin(D*32e-5)*.035*X+A*m,l.rotation.y=-.42+Math.sin(D*23e-5)*.14*X+S*m,l.position.x=S*m*.05,l.position.y=.08+Math.sin(D*52e-5)*.035*X-A*m*.05}const Y=document.documentElement.dataset.theme==="dark"?"dark":"light";if(Y!==g){const X=Y==="dark";u.forEach(({faceMaterial:R,depthMaterials:O},H)=>{const re=pi[H][X?"dark":"light"],ae=new Ke(re).lerp(new Ke(X?"#aeb6c2":"#a3acb8"),.48);R.color.set(re),O.forEach(Ve=>Ve.color.copy(ae))}),g=Y}c.render(a,o),n&&window.cancelAnimationFrame(d)};L();const F=new ResizeObserver(L);F.observe(r);const V=new IntersectionObserver(([D])=>{h=D.isIntersecting,h&&!d&&(d=window.requestAnimationFrame(N))},{rootMargin:"120px"});return V.observe(r),n||(window.addEventListener("pointermove",P,{passive:!0}),window.addEventListener("scroll",w,{passive:!0}),document.documentElement.addEventListener("pointerleave",_)),d=window.requestAnimationFrame(N),()=>{window.cancelAnimationFrame(d),F.disconnect(),V.disconnect(),window.removeEventListener("pointermove",P),window.removeEventListener("scroll",w),document.documentElement.removeEventListener("pointerleave",_),u.forEach(({group:D,faceMaterial:k,depthMaterials:$})=>{D.traverse(Y=>{Y instanceof go&&Y.geometry.dispose()}),k.dispose(),$.forEach(Y=>Y.dispose())}),c.dispose()}},[n]),v.jsxs(Oe.div,{className:"capability-particle-display capability-wire-type-display",style:{"--capability-accent-light":pi[e].light,"--capability-accent-dark":pi[e].dark},initial:{opacity:0,x:44},animate:{opacity:1,x:0},transition:{delay:.35,duration:.9,ease:[.22,1,.36,1]},children:[v.jsx("div",{className:"capability-particle-stage capability-wire-type-stage","data-pattern":e,role:"img","aria-label":`${To[e]}，立体网格字母 ${Pd[e]}`,children:v.jsx("canvas",{className:"capability-particle-canvas",ref:i,"aria-hidden":"true"})}),v.jsx("div",{className:"capability-index","aria-label":"六项核心能力",children:v.jsx("div",{children:To.map((s,r)=>v.jsx("span",{className:r===e?"is-active":"",style:{"--capability-accent-light":pi[r].light,"--capability-accent-dark":pi[r].dark},children:s},s))})})]})}function UA(n){const[e,t]=Z.useState(0),[i,s]=Z.useState(n?Number.MAX_SAFE_INTEGER:0),[r,a]=Z.useState("typing"),o=e%wd.length,c=wd[o],l=Cd[e],u=Math.max(c.title.length,l.length);return Z.useEffect(()=>{if(n)return;let d=70,h=()=>s(g=>g+1);r==="typing"&&i>=u?(d=1450,h=()=>a("deleting")):r==="deleting"&&i>0?(d=38,h=()=>s(g=>g-1)):r==="deleting"?(d=180,h=()=>a("switch")):r==="switch"&&(d=1,h=()=>{t(g=>(g+1)%Cd.length),a("typing")});const p=window.setTimeout(h,d);return()=>window.clearTimeout(p)},[i,u,r,n]),{roleIndex:o,title:c.title,detail:n?l:l.slice(0,i)}}function FA({expression:n,reduceMotion:e}){const t=Z.useRef(null);return Z.useEffect(()=>{const i=t.current;if(!i||e||!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;let s=0,r=-1e3,a=-1e3,o=i.getBoundingClientRect();const c=()=>{s=0;const d=r-(o.left+o.width/2),h=a-(o.top+o.height/2),p=Math.hypot(d,h);if(p<=100){const y=Math.min(1,p/52),m=Math.atan2(h,d);i.style.setProperty("--gaze-x",`${Math.cos(m)*3.2*y}px`),i.style.setProperty("--gaze-y",`${Math.sin(m)*2.5*y}px`),i.classList.add("is-tracking")}else i.style.setProperty("--gaze-x","0px"),i.style.setProperty("--gaze-y","0px"),i.classList.remove("is-tracking")},l=d=>{r=d.clientX,a=d.clientY,s||(s=window.requestAnimationFrame(c))},u=()=>{o=i.getBoundingClientRect()};return window.addEventListener("pointermove",l,{passive:!0}),window.addEventListener("scroll",u,{passive:!0}),window.addEventListener("resize",u),()=>{window.removeEventListener("pointermove",l),window.removeEventListener("scroll",u),window.removeEventListener("resize",u),s&&window.cancelAnimationFrame(s)}},[e]),v.jsx("span",{ref:t,className:`availability-status-dot status-motion-${n}`,"aria-hidden":"true",children:v.jsx("svg",{className:"assistant-face",viewBox:"0 0 36 36",role:"presentation",children:v.jsxs("g",{className:"assistant-gaze",children:[v.jsx("path",{className:"assistant-eye-path assistant-eye-left",d:"M12 12.5v8"}),v.jsx("path",{className:"assistant-eye-path assistant-eye-right",d:"M24 12.5v8"})]})})})}function OA(){const n=Z.useRef(null);return Z.useEffect(()=>{const e=n.current;if(!e||!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;let t=0,i=-100,s=-100,r=i,a=s,o=null,c=null,l=null,u=42,d=42;const h=A=>{if(!A)return null;if(!A.hasAttribute("data-focus-text"))return A.getBoundingClientRect();const S=document.createRange();S.selectNodeContents(A);const T=S.getBoundingClientRect();return S.detach(),T.width>0&&T.height>0?T:A.getBoundingClientRect()},p=()=>{o?.hasAttribute("data-magnetic-track")&&(l=h(o));const A=l,S=A?A.left+A.width/2:i,T=A?A.top+A.height/2:s;if(r=A?S:r+(S-r)*.52,a=A?T:a+(T-a)*.52,c&&A){const M=(i-S)*.08,P=(s-T)*.08;c.style.transform=`translate3d(${M}px, ${P}px, 0)`}e.style.transform=`translate3d(${r}px, ${a}px, 0) translate(-50%, -50%)`,e.style.setProperty("--dot-x",`${A?i-r:0}px`),e.style.setProperty("--dot-y",`${A?s-a:0}px`),t=requestAnimationFrame(p)},g=A=>{if(A.pointerType!=="mouse")return;i=A.clientX,s=A.clientY;const S=A.target,T=S.closest("[data-native-cursor]");e.classList.toggle("is-visible",!T);const M=S.closest("a, button, [data-cursor]"),P=T?null:S.closest("[data-magnetic]");o!==P&&(c?.style.removeProperty("transform"),o?.classList.remove("is-magnetic-target"),o=P,c=o?.querySelector("[data-magnetic-motion]")??o,l=h(o),o?.classList.add("is-magnetic-target"),u=l?l.width+20:42,d=l?l.height+20:42,l?(e.style.width=`${u}px`,e.style.height=`${d}px`):(e.style.removeProperty("width"),e.style.removeProperty("height"))),e.classList.toggle("is-active",!!M),e.classList.toggle("is-magnetic",!!P),e.classList.toggle("is-menu",M?.dataset.cursor==="menu"),e.classList.toggle("is-card",M?.dataset.cursor==="card")},y=()=>{e.classList.remove("is-visible"),c?.style.removeProperty("transform"),o?.classList.remove("is-magnetic-target"),o=null,c=null,l=null},m=()=>{o&&(c?.style.removeProperty("transform"),l=h(o))},f=()=>e.classList.add("is-pressed"),b=()=>e.classList.remove("is-pressed");return t=requestAnimationFrame(p),window.addEventListener("pointermove",g,{passive:!0}),document.addEventListener("mouseleave",y),window.addEventListener("pointerdown",f),window.addEventListener("pointerup",b),window.addEventListener("scroll",m,{passive:!0}),window.addEventListener("resize",m),()=>{cancelAnimationFrame(t),window.removeEventListener("pointermove",g),document.removeEventListener("mouseleave",y),window.removeEventListener("pointerdown",f),window.removeEventListener("pointerup",b),window.removeEventListener("scroll",m),window.removeEventListener("resize",m),c?.style.removeProperty("transform"),o?.classList.remove("is-magnetic-target")}},[]),v.jsxs("div",{className:"focus-cursor",ref:n,"aria-hidden":"true",children:[v.jsx("i",{className:"cursor-corner corner-tl"}),v.jsx("i",{className:"cursor-corner corner-tr"}),v.jsx("i",{className:"cursor-corner corner-bl"}),v.jsx("i",{className:"cursor-corner corner-br"}),v.jsx("span",{className:"cursor-dot"}),v.jsxs("span",{className:"cursor-bars",children:[v.jsx("i",{}),v.jsx("i",{}),v.jsx("i",{})]})]})}function BA({reduceMotion:n}){const e=Z.useRef(null),t=Z.useRef(null);return Z.useEffect(()=>{const i=e.current,s=t.current,r=s?.getContext("2d");if(!i||!s||!r)return;let a=0,o=0,c=-9999,l=-9999,u=!1,d=[],h=!1,p=Math.min(window.devicePixelRatio||1,1.5),g=i.getBoundingClientRect(),y=[16,18,23],m=document.documentElement.dataset.theme==="dark";const f=()=>{y=getComputedStyle(document.documentElement).color.match(/[\d.]+/g)?.slice(0,3).map(Number)??[16,18,23],m=document.documentElement.dataset.theme==="dark",n&&b()},b=(V=0)=>{const D=s.width/p,k=s.height/p,[$,Y,X]=y,R=154+Math.sin(V/520)*8,O=R*R,H=o?Math.min(2.2,Math.max(.45,(V-o)/16.67)):1,re=Math.pow(.94,H);o=V,r.clearRect(0,0,D,k),d.forEach(ae=>{if(!n&&u){const J=ae.x-c,ie=ae.y-l,_e=J*J+ie*ie;if(_e<O&&_e>.1){const De=Math.sqrt(_e),xe=Math.pow(1-De/R,1.55)*2.75*H;ae.velocityX+=J/De*xe,ae.velocityY+=ie/De*xe}}n||(ae.velocityX+=(ae.homeX-ae.x)*.018*H,ae.velocityY+=(ae.homeY-ae.y)*.018*H,ae.velocityX*=re,ae.velocityY*=re,ae.x+=ae.velocityX*H,ae.y+=ae.velocityY*H);const Ve=Math.min(1,Math.hypot(ae.x-ae.homeX,ae.y-ae.homeY)/28),ke=(m?.11:.13)+ae.emphasis*(m?.055:.045)+Ve*.11,je=.85+ae.emphasis*.18+Ve*.34;r.beginPath(),r.arc(ae.x,ae.y,je,0,Math.PI*2),r.fillStyle=`rgba(${$}, ${Y}, ${X}, ${ke})`,r.fill()})},A=()=>{g=i.getBoundingClientRect(),p=Math.min(window.devicePixelRatio||1,1.5),s.width=Math.round(g.width*p),s.height=Math.round(g.height*p),s.style.width=`${g.width}px`,s.style.height=`${g.height}px`,r.setTransform(p,0,0,p,0,0);const V=g.width<=620?15:18,D=Math.max(V,Math.sqrt(g.width*g.height/14e3)),k=Math.ceil(g.width/D)+2,$=Math.ceil(g.height/D)+2;d=[];for(let Y=0;Y<$;Y+=1)for(let X=0;X<k;X+=1){const R=X*D-D/2,O=Y*D-D/2;d.push({homeX:R,homeY:O,x:R,y:O,velocityX:0,velocityY:0,emphasis:(X+Y)%4===0?1:0})}n&&b()},S=V=>{h&&(b(V),a=window.requestAnimationFrame(S))},T=()=>{n||h||document.hidden||(h=!0,o=0,a=window.requestAnimationFrame(S))},M=()=>{h=!1,window.cancelAnimationFrame(a)},P=V=>{V.pointerType&&V.pointerType!=="mouse"||(c=V.clientX-g.left,l=V.clientY-g.top,u=!0)},_=()=>{u=!1,c=-9999,l=-9999};f(),A();const w=new ResizeObserver(A),L=new MutationObserver(f),N=new IntersectionObserver(([V])=>{V.isIntersecting?T():M()}),F=()=>{document.hidden?M():T()};return w.observe(i),L.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),N.observe(i),document.addEventListener("visibilitychange",F),n||(window.addEventListener("pointermove",P,{passive:!0}),document.documentElement.addEventListener("pointerleave",_)),()=>{M(),w.disconnect(),L.disconnect(),N.disconnect(),document.removeEventListener("visibilitychange",F),window.removeEventListener("pointermove",P),document.documentElement.removeEventListener("pointerleave",_)}},[n]),v.jsx("div",{className:"hero-particle-field",ref:e,"aria-hidden":"true",children:v.jsx("canvas",{className:"hero-particles",ref:t})})}function Ao({index:n,eyebrow:e,title:t,copy:i}){return v.jsxs(Oe.div,{className:"section-intro",initial:{opacity:0,y:48},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.25},transition:{duration:.75,ease:[.22,1,.36,1]},children:[v.jsx("div",{className:"section-index",children:n}),v.jsxs("div",{className:"section-label",children:[v.jsx("span",{}),e]}),v.jsx("h2",{children:t}),v.jsx("p",{children:i})]})}function VA({view:n,reduceMotion:e,onChange:t}){const i=[{id:"experience",label:"职业轨迹"},{id:"education",label:"教育经历"}],s=n==="experience"?"从视觉设计到用户体验、设计管理与跨研发团队协作，在数字化领域持续拓展职责边界。":"从工业设计出发，建立跨越实体产品、视觉表达与数字体验的综合设计基础。";return v.jsxs(Oe.div,{className:"section-intro journey-intro",initial:{opacity:0,y:48},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.25},transition:{duration:e?0:.75,ease:[.22,1,.36,1]},children:[v.jsx("div",{className:"section-index",children:"04"}),v.jsxs("div",{className:"section-label",children:[v.jsx("span",{}),"MY JOURNEY"]}),v.jsx("div",{className:"journey-switch",role:"tablist","aria-label":"经历类型",children:i.map(r=>{const a=n===r.id;return v.jsxs("button",{className:`journey-switch-option${a?" is-active":""}`,type:"button",role:"tab","aria-selected":a,"aria-controls":"journey-panel","data-magnetic":!0,onClick:()=>t(r.id),children:[v.jsx("span",{children:r.label}),a&&v.jsxs(Oe.i,{className:"journey-focus-frame",layoutId:"journey-focus-frame",transition:e?{duration:0}:{type:"spring",stiffness:340,damping:32,mass:.72},"aria-hidden":"true",children:[v.jsx("b",{}),v.jsx("b",{}),v.jsx("b",{}),v.jsx("b",{})]})]},r.id)})}),v.jsx(Jn,{mode:"wait",initial:!1,children:v.jsx(Oe.p,{initial:e?!1:{opacity:0,y:8,filter:"blur(5px)"},animate:{opacity:1,y:0,filter:"blur(0px)"},exit:e?void 0:{opacity:0,y:-6,filter:"blur(4px)"},transition:{duration:e?0:.38,ease:[.22,1,.36,1]},children:s},n)})]})}function kA({icon:n}){const e=Z.useRef(null);return Z.useLayoutEffect(()=>{e.current?.querySelectorAll("path, rect, circle, line, polyline, polygon").forEach(t=>t.setAttribute("pathLength","1"))},[]),v.jsxs("span",{className:"service-icon-motion",children:[v.jsx(n,{className:"service-icon-base",size:32,strokeWidth:1.45}),v.jsx(n,{ref:e,className:"service-icon-scan",size:32,strokeWidth:1.45})]})}function zA({children:n}){const e=Z.useRef(null);return Z.useLayoutEffect(()=>{const t=e.current,i=t?.parentElement;if(!t||!i)return;let s=0,r=!0;const a=()=>{window.cancelAnimationFrame(s),s=window.requestAnimationFrame(()=>{if(!r)return;t.style.fontSize="";const c=Number.parseFloat(window.getComputedStyle(t).fontSize),l=Math.min(1,(t.clientWidth-1)/t.scrollWidth);l<1&&(t.style.fontSize=`${Math.max(28,c*l)}px`)})};a();const o=new ResizeObserver(a);return o.observe(i),document.fonts?.ready.then(a),()=>{r=!1,window.cancelAnimationFrame(s),o.disconnect()}},[n]),v.jsx("h3",{ref:e,children:n})}function HA({video:n}){const e=Z.useRef(null),t=Z.useRef(null),[i,s]=Z.useState(!1),[r,a]=Z.useState(!1),[o,c]=Z.useState(!1),[l,u]=Z.useState(!0),[d,h]=Z.useState(!0);Z.useEffect(()=>{const g=e.current;if(!g)return;const y=new IntersectionObserver(([f])=>{f.isIntersecting&&(s(!0),y.disconnect())},{rootMargin:"360px 0px"}),m=new IntersectionObserver(([f])=>{a(f.isIntersecting&&f.intersectionRatio>=.2)},{threshold:[0,.2,.5]});return y.observe(g),m.observe(g),()=>{y.disconnect(),m.disconnect()}},[]),Z.useEffect(()=>{const g=t.current;if(!g||!i)return;const y=()=>{d&&r&&document.visibilityState==="visible"?g.play().catch(()=>c(!1)):g.pause()};return y(),document.addEventListener("visibilitychange",y),()=>document.removeEventListener("visibilitychange",y)},[r,i,d]);const p=()=>{const g=t.current;g&&(g.paused?(h(!0),g.play().catch(()=>c(!1))):(h(!1),g.pause()))};return v.jsxs("div",{ref:e,className:"terminal-demo",role:"group","aria-label":"AI刷脸终端演示",children:[v.jsxs("div",{className:"terminal-device",children:[v.jsx("div",{className:"terminal-screen-housing",children:v.jsx("div",{className:"terminal-screen-bezel",children:v.jsx("video",{ref:t,src:i?n.src:void 0,poster:n.poster,loop:!0,muted:l,playsInline:!0,preload:i?"metadata":"none","aria-label":"AI刷脸终端演示视频",onPlay:()=>c(!0),onPause:()=>c(!1)})})}),v.jsxs("div",{className:"terminal-body",children:[v.jsx("div",{className:"terminal-status-light"}),v.jsx("div",{className:"terminal-receipt-slot"}),v.jsx("div",{className:"terminal-card-reader"}),v.jsx("div",{className:"terminal-access-door",children:v.jsx("span",{})}),v.jsx("div",{className:"terminal-side-port"})]}),v.jsx("div",{className:"terminal-base"})]}),v.jsxs("div",{className:"terminal-demo-controls",children:[v.jsx("button",{type:"button",onClick:p,"aria-label":o?"暂停视频":"播放视频",title:o?"暂停视频":"播放视频",children:o?v.jsx(sA,{"aria-hidden":"true"}):v.jsx(aA,{"aria-hidden":"true"})}),v.jsx("button",{type:"button",onClick:()=>u(g=>!g),"aria-label":l?"开启声音":"静音",title:l?"开启声音":"静音",children:l?v.jsx(fA,{"aria-hidden":"true"}):v.jsx(dA,{"aria-hidden":"true"})})]})]})}function GA({project:n}){if(n.video)return v.jsx(HA,{video:n.video});if(n.image)return v.jsx("div",{className:"mock-shell project-photo-shell",children:v.jsx("img",{src:n.image.src,alt:n.image.alt,loading:"lazy",decoding:"async"})});const e=n.visual;return e==="health-card"?v.jsxs("div",{className:"mock-shell health-ui",children:[v.jsxs("div",{className:"health-header",children:["城市健康服务 ",v.jsx(GT,{size:20})]}),v.jsxs("div",{className:"health-card-main",children:[v.jsxs("div",{children:[v.jsx("small",{children:"电子健康卡"}),v.jsx("strong",{children:"许 **"}),v.jsx("span",{children:"居民健康身份统一入口"})]}),v.jsx("div",{className:"mini-code"})]}),v.jsx("div",{className:"service-grid",children:["预约挂号","门诊缴费","报告查询","健康档案"].map(t=>v.jsxs("div",{children:[v.jsx("span",{}),v.jsx("small",{children:t})]},t))}),v.jsxs("div",{className:"family-strip",children:[v.jsx("span",{children:"就诊人"}),v.jsx("b",{children:"本人"}),v.jsx("b",{children:"家人"}),v.jsx("button",{children:"+"})]})]}):e==="system"?v.jsxs("div",{className:"mock-shell system-ui",children:[v.jsxs("aside",{children:[v.jsx("div",{className:"system-logo",children:"E"}),[1,2,3,4,5].map(t=>v.jsx("span",{},t))]}),v.jsxs("main",{children:[v.jsxs("div",{className:"system-top",children:[v.jsx("b",{children:"EUXD Library"}),v.jsx("small",{children:"v3.2"})]}),v.jsxs("div",{className:"system-stats",children:[v.jsxs("div",{children:[v.jsx("small",{children:"组件"}),v.jsx("strong",{children:"286"})]}),v.jsxs("div",{children:[v.jsx("small",{children:"页面"}),v.jsx("strong",{children:"124"})]}),v.jsxs("div",{children:[v.jsx("small",{children:"业务模块"}),v.jsx("strong",{children:"42"})]})]}),v.jsx("div",{className:"component-grid",children:[1,2,3,4,5,6].map(t=>v.jsxs("div",{children:[v.jsx("span",{}),v.jsx("i",{}),v.jsx("i",{})]},t))})]})]}):e==="ai"?v.jsxs("div",{className:"mock-shell ai-ui",children:[v.jsx("div",{className:"ai-orb",children:v.jsx(vm,{size:24})}),v.jsxs("div",{className:"ai-copy",children:[v.jsx("small",{children:"AI 就医助手"}),v.jsx("strong",{children:"你好，我会帮你梳理本次就医需求"})]}),v.jsx("div",{className:"chat patient",children:"最近三天持续头痛，还有轻微发热。"}),v.jsxs("div",{className:"chat assistant",children:[v.jsx(pm,{size:16})," 已记录 3 项症状，建议前往神经内科。是否为你生成预问诊摘要？"]}),v.jsxs("div",{className:"ai-input",children:["继续描述症状 ",v.jsx(WA,{})]})]}):v.jsxs("div",{className:"mock-shell regional-ui",children:[v.jsx("div",{className:"map-lines"}),v.jsxs("div",{className:"region-title",children:[v.jsx("small",{children:"区域健康服务平台"}),v.jsx("strong",{children:"多机构服务态势"})]}),v.jsx("div",{className:"map-node n1",children:"居民端"}),v.jsx("div",{className:"map-node n2",children:"医院"}),v.jsx("div",{className:"map-node n3",children:"基层机构"}),v.jsx("div",{className:"map-node n4",children:"管理部门"}),v.jsxs("div",{className:"region-stat",children:[v.jsx("span",{children:"今日服务量"}),v.jsx("strong",{children:"28,406"}),v.jsx("small",{children:"较昨日 +12.6%"})]})]})}function WA(){return v.jsx(jr,{size:16,style:{transform:"rotate(180deg)"}})}function XA({children:n}){const e=Z.useRef(null),t=Ap(),i=gi(0),s=gi(0),r=gi(0),a=gi(0),o=gi(1),c={stiffness:145,damping:22,mass:.58},l=Xi(i,c),u=Xi(s,c),d=Xi(r,c),h=Xi(a,c),p=Xi(o,c),g=()=>{i.set(0),s.set(0),r.set(0),a.set(0),o.set(1),e.current?.classList.remove("is-gravity-active")},y=m=>{if(t||m.pointerType!=="mouse")return;const f=e.current;if(!f)return;const b=f.getBoundingClientRect(),A=(m.clientX-b.left)/b.width*2-1,S=(m.clientY-b.top)/b.height*2-1;i.set(S*-3.6),s.set(A*4.2),r.set(A*5),a.set(S*4),o.set(1.008),f.classList.add("is-gravity-active")};return v.jsx("div",{className:"project-gravity",onPointerMove:y,onPointerLeave:g,children:v.jsx(Oe.div,{ref:e,className:"project-gravity-card",style:{rotateX:l,rotateY:u,x:d,y:h,scale:p},children:n})})}const Nd=n=>{const e=Array.from({length:8},(t,i)=>i);for(let t=e.length-1;t>0;t-=1){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e[0]===n&&([e[0],e[1]]=[e[1],e[0]]),e};function qA(){const[n,e]=Z.useState(!1),[t,i]=Z.useState(!1),[s,r]=Z.useState(null),[a,o]=Z.useState(0),[c,l]=Z.useState(null),[u,d]=Z.useState("experience"),[h,p]=Z.useState(0),[g,y]=Z.useState(!1),m=Z.useRef(null),f=Z.useRef(null),b=Z.useRef(null),A=Z.useRef(null),S=Z.useRef(null),T=Z.useRef(null),M=Ap(),P=UA(M),{scrollYProgress:_}=yh({target:m,offset:["start start","end start"]}),{scrollYProgress:w}=yh({target:f,offset:["start 58%","end 58%"]}),L=Xi(w,{stiffness:105,damping:28,mass:.34}),N=xc(_,[0,.55,.95],[.8,.8,0]);Z.useEffect(()=>{document.documentElement.dataset.theme=n?"dark":"light"},[n]),Z.useEffect(()=>{const R=()=>y(window.scrollY>window.innerHeight*.65);return R(),window.addEventListener("scroll",R,{passive:!0}),window.addEventListener("resize",R),()=>{window.removeEventListener("scroll",R),window.removeEventListener("resize",R)}},[]),Z.useEffect(()=>{if(M)return;let R=0,O=Nd(R),H=0;const re=window.setInterval(()=>{const ae=O[H];R=ae,p(ae),H+=1,H===O.length&&(O=Nd(R),H=0)},2e3);return()=>window.clearInterval(re)},[M]),Z.useEffect(()=>{if(M)return;const R=new Nm({duration:1.1,smoothWheel:!0});b.current=R;let O=0;const H=re=>{R.raf(re),O=requestAnimationFrame(H)};return O=requestAnimationFrame(H),()=>{cancelAnimationFrame(O),R.destroy(),b.current=null}},[M]),Z.useEffect(()=>{const R=t||s!==null;return document.documentElement.style.overflow=R?"hidden":"",document.body.style.overflow=R?"hidden":"",R?b.current?.stop():b.current?.start(),()=>{document.documentElement.style.overflow="",document.body.style.overflow="",b.current?.start()}},[t,s]),Z.useEffect(()=>{if(s===null)return;S.current?.focus();const R=O=>{O.key==="Escape"&&r(null)};return window.addEventListener("keydown",R),()=>window.removeEventListener("keydown",R)},[s]);const F=fi[a],V=s===null?null:Lr[s],D=u==="experience"?RA:CA,k=Z.useMemo(()=>[...Ss,...Ss,...Ss,...Ss],[]),$=()=>{r(null),window.setTimeout(()=>T.current?.focus(),M?0:220)},Y=Z.useCallback(R=>{const O=document.getElementById(R);if(!O)return;const H=R==="contact"?Math.min(112,window.innerHeight*.1):0;if(b.current){b.current.scrollTo(O,{offset:H,immediate:!!M});return}const re=O.getBoundingClientRect().top+window.scrollY+H;window.scrollTo({top:re,behavior:M?"auto":"smooth"})},[M]),X=R=>{if(t){A.current=R,i(!1);return}Y(R)};return Z.useEffect(()=>{if(t||!A.current)return;const R=A.current;A.current=null;const O=window.requestAnimationFrame(()=>Y(R));return()=>window.cancelAnimationFrame(O)},[t,Y]),v.jsxs("div",{className:"site-shell",children:[v.jsx(OA,{}),v.jsx(BA,{reduceMotion:!!M}),v.jsx("a",{className:"skip-link",href:"#main",children:"跳到主要内容"}),v.jsxs("header",{className:`floating-header${t?" is-menu-open":""}`,"aria-label":"主导航",children:[v.jsx("button",{className:"icon-button","data-magnetic":!0,onClick:()=>e(R=>!R),"aria-label":n?"切换浅色模式":"切换深色模式",children:n?v.jsx(hA,{size:20}):v.jsx(eA,{size:20})}),v.jsxs(Oe.button,{className:"monogram",style:{opacity:N},onClick:()=>X("home"),"aria-label":"返回首页",children:[v.jsx("strong",{children:"Decolas"})," ",v.jsx("span",{children:"Design"})]}),v.jsx("div",{className:"header-actions",children:v.jsx("button",{className:`icon-button menu-toggle${t?" is-open":""}`,"data-cursor":"menu","data-magnetic":!0,type:"button",onClick:()=>i(R=>!R),"aria-label":t?"关闭菜单":"打开菜单","aria-expanded":t,children:v.jsxs("svg",{className:"menu-toggle-icon",viewBox:"0 0 24 24","aria-hidden":"true",children:[v.jsx("path",{className:"menu-toggle-line menu-toggle-line-top",d:"M3.5 7h17"}),v.jsx("path",{className:"menu-toggle-line menu-toggle-line-middle",d:"M3.5 12h17"}),v.jsx("path",{className:"menu-toggle-line menu-toggle-line-bottom",d:"M3.5 17h17"})]})})})]}),v.jsx(Jn,{children:t&&v.jsxs(Oe.div,{className:"menu-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:[v.jsx("div",{className:"menu-top",children:v.jsx("span",{children:"SELECTED WORK · 2026"})}),v.jsx("nav",{children:PA.map(({label:R,english:O,id:H},re)=>v.jsxs(Oe.button,{onClick:()=>X(H),initial:{opacity:0,x:-40},animate:{opacity:1,x:0},transition:{delay:re*.06},children:[v.jsxs("span",{className:"menu-index",children:["0",re+1]}),v.jsxs("span",{className:"menu-label",children:[v.jsx("b",{"data-magnetic":!0,children:R}),v.jsx("i",{"aria-label":O,children:v.jsxs("svg",{className:"menu-script-svg",viewBox:`0 0 ${Math.max(210,O.length*46)} 72`,style:{width:`${Math.max(3.2,O.length*.64)}em`},preserveAspectRatio:"xMinYMid meet","aria-hidden":"true",children:[v.jsx("text",{className:"menu-script-stroke",x:"4",y:"59",children:O}),v.jsx("text",{className:"menu-script-fill",x:"4",y:"59",children:O})]})})]}),v.jsx(jr,{className:"menu-arrow"})]},H))}),v.jsx("div",{className:"menu-foot",children:"产品体验 · 设计管理 · AI 产品工程"})]})}),v.jsxs("main",{id:"main",children:[v.jsxs("section",{ref:m,id:"home",className:"hero",children:[v.jsxs("div",{className:"hero-split",children:[v.jsxs(Oe.div,{className:"hero-content",children:[v.jsxs(Oe.div,{className:"availability",initial:{y:20},animate:{y:0},children:[v.jsx(FA,{expression:h,reduceMotion:M}),v.jsxs("span",{className:"availability-copy",children:[v.jsx("b",{children:P.detail}),v.jsx("i",{"aria-hidden":"true"})]})]}),v.jsx(Oe.div,{className:"hero-greeting",variants:DA,initial:M?!1:"hidden",animate:"visible","aria-label":Rd,children:Array.from(Rd).map((R,O)=>v.jsx("span",{className:"hero-greeting-clip","aria-hidden":"true",children:v.jsx(Oe.span,{className:"hero-greeting-character",variants:Ld,children:R===" "?" ":R})},`${R}-${O}`))}),v.jsx("h1",{className:"hero-title-stage",children:v.jsx(Jn,{mode:"sync",children:v.jsx(Oe.span,{variants:LA,initial:M?!1:"hidden",animate:"visible",exit:M?void 0:"exit","aria-label":P.title,children:Array.from(P.title).map((R,O)=>v.jsx("span",{className:"hero-title-clip","aria-hidden":"true",children:v.jsx(Oe.span,{className:"hero-title-character",variants:Ld,children:R})},`${R}-${O}`))},P.title)})}),v.jsx(Oe.div,{className:"hero-role-line",initial:{y:24,opacity:0},animate:{y:0,opacity:1},transition:{delay:.92,duration:.8,ease:[.19,1,.22,1]},children:"PRODUCT EXPERIENCE · DESIGN SYSTEM · AI DEVELOPMENT"}),v.jsxs(Oe.p,{className:"hero-description",initial:{y:28,opacity:0},animate:{y:0,opacity:1},transition:{delay:1.02,duration:.8,ease:[.19,1,.22,1]},children:[v.jsx("span",{children:"体验团队管理和体系建设，能够独立完成从口头需求直接到整个产品的规划、"}),v.jsx("span",{children:"交互视觉设计，并能够借助 AI 快速实现成品落地；"})]}),v.jsxs(Oe.div,{className:"hero-actions",initial:{y:24,opacity:0},animate:{y:0,opacity:1},transition:{delay:1.16,duration:.8,ease:[.19,1,.22,1]},children:[v.jsxs("a",{className:"button primary","data-magnetic":!0,href:si,target:"_blank",rel:"noopener noreferrer",children:["查看项目",v.jsx(Eo,{className:"hero-action-icon hero-action-icon-project",size:18})]}),v.jsxs("button",{className:"button secondary","data-magnetic":!0,onClick:()=>X("contact"),children:["联系我",v.jsx(JT,{className:"hero-action-icon hero-action-icon-mail",size:18})]}),v.jsxs("a",{className:"hero-resume","data-magnetic":!0,href:xA,download:"许德杰个人简历.pdf",children:["下载简历",v.jsx(XT,{className:"hero-action-icon hero-action-icon-download",size:20})]})]})]}),v.jsx("div",{className:"capability-visual",children:v.jsx(IA,{reduceMotion:!!M})})]}),v.jsxs(Oe.div,{className:"hero-meta",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:1.34,duration:.7,ease:[.19,1,.22,1]},children:[v.jsxs("div",{children:[v.jsx("small",{children:"所在地"}),v.jsx("strong",{children:"福建 / 厦门"})]}),v.jsxs("div",{children:[v.jsx("small",{children:"职业经验"}),v.jsx("strong",{children:"10+ 年 / 始于 2014"})]}),v.jsxs("div",{children:[v.jsx("small",{children:"毕业院校"}),v.jsx("strong",{children:"福州大学 / 工业设计"})]}),v.jsxs("div",{children:[v.jsx("small",{children:"长期方向"}),v.jsxs("strong",{className:"hero-direction",children:[v.jsx("span",{children:"产品体验 · 设计管理 ·"})," ",v.jsx("span",{children:"AI 产品工程"})]})]}),v.jsxs("a",{className:"scroll-cue",href:"#expertise",children:[v.jsx("span",{className:"scroll-cue-label",children:"滚动继续"}),v.jsxs("span",{className:"scroll-cue-indicator","aria-hidden":"true",children:[v.jsx("span",{className:"scroll-cue-track",children:v.jsx("i",{})}),v.jsx(zT,{className:"scroll-cue-arrow"})]})]})]})]}),v.jsxs("section",{id:"expertise",className:"expertise section-pad",children:[v.jsx("div",{className:"container",children:v.jsx(Ao,{index:"01",eyebrow:"MY EXPERTISE",title:"我能提供的价值",copy:"连接业务、体验与技术，在复杂约束中推动清晰决策与高效落地。"})}),v.jsx("div",{className:"service-marquee",children:v.jsx("div",{className:"service-track",children:k.map((R,O)=>v.jsxs("article",{className:"service-card","data-cursor":"card","data-magnetic":!0,style:{"--service-accent":R.accent},children:[v.jsx("div",{className:"service-card-top",children:v.jsx("span",{className:"service-card-number",children:String(O%Ss.length+1).padStart(2,"0")})}),v.jsx("span",{className:"service-icon-wrap","aria-hidden":"true",children:v.jsx(kA,{icon:R.icon})}),v.jsx("h3",{children:R.title}),v.jsx("p",{children:R.body}),v.jsx(jr,{className:"card-arrow"})]},`${R.title}-${O}`))})})]}),v.jsx("section",{id:"projects",className:"projects section-pad",children:v.jsxs("div",{className:"container",children:[v.jsx(Ao,{index:"02",eyebrow:"SELECTED WORK",title:"精选的一些项目",copy:"这些项目横跨医保支付、区域医疗、设计系统与 AI 服务，记录我如何在复杂业务、多端场景和交付约束中，把问题转化为清晰可用的产品体验。"}),v.jsxs(XA,{children:[v.jsxs("div",{className:"project-stage",children:[v.jsxs("div",{className:"project-copy",children:[v.jsx(Jn,{mode:"wait",children:v.jsxs(Oe.div,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},transition:{duration:.2,ease:[.22,1,.36,1]},children:[v.jsx("div",{className:"project-eyebrow",children:F.eyebrow}),v.jsx(zA,{children:F.title}),v.jsx("div",{className:"project-tags",children:F.tags.map(R=>v.jsx("span",{children:R},R))}),v.jsx("div",{className:"project-description",children:v.jsx("p",{children:F.summary})})]},F.number)}),v.jsxs("div",{className:"project-footer",children:[v.jsxs("div",{className:"project-counter","aria-label":`第 ${a+1} 个项目，共 ${fi.length} 个`,children:[v.jsx("span",{children:String(a+1).padStart(2,"0")}),v.jsx("i",{}),v.jsx("span",{children:String(fi.length).padStart(2,"0")})]}),F.detailUrl&&v.jsxs("a",{className:"project-detail-link","data-native-cursor":!0,href:F.detailUrl,target:"_blank",rel:"noopener noreferrer",children:[v.jsx("span",{children:"查看完整项目"}),v.jsx(bo,{"aria-hidden":"true"})]})]})]}),v.jsx("div",{className:`project-visual-wrap${F.video?" project-visual-terminal":F.visual==="insurance"||F.image?" project-visual-photo":""}`,children:v.jsx(Jn,{mode:"wait",children:v.jsx(Oe.div,{initial:{opacity:0,scale:.975,x:22},animate:{opacity:1,scale:1,x:0},exit:{opacity:0,scale:.99,x:-14},transition:{duration:.26,ease:[.22,1,.36,1]},children:v.jsx(GA,{project:F})},F.number)})})]}),v.jsxs("div",{className:"project-edge-navigation","aria-label":"项目切换",children:[v.jsx("div",{className:"project-edge-slot is-prev",children:v.jsx("button",{"data-magnetic":!0,type:"button","aria-label":"上一个项目",onClick:()=>o((a-1+fi.length)%fi.length),children:v.jsx(UT,{})})}),v.jsx("div",{className:"project-edge-slot is-next",children:v.jsx("button",{"data-magnetic":!0,type:"button","aria-label":"下一个项目",onClick:()=>o((a+1)%fi.length),children:v.jsx(Eo,{})})})]}),v.jsxs("div",{className:"project-tabs",children:[fi.map((R,O)=>v.jsxs("button",{"data-magnetic":!0,className:O===a?"active":"",onClick:()=>o(O),children:[v.jsx("span",{children:R.number}),R.title]},R.title)),v.jsxs("a",{className:"project-tabs-collection","data-magnetic":!0,href:bA,target:"_blank",rel:"noopener noreferrer","aria-label":"打开作品集精选",children:[v.jsx("strong",{children:"作品集精选"}),v.jsx(ZT,{"aria-hidden":"true"})]})]})]})]})}),v.jsxs("section",{id:"tools",className:"tools section-pad",children:[v.jsx("div",{className:"container",children:v.jsx(Ao,{index:"03",eyebrow:"MY TOOLKIT",title:"工具与方法",copy:"让工具服务于思考与落地，贯通设计规范、协作资产与前端验证。"})}),v.jsx("div",{className:"tool-belts",children:Ad.map((R,O)=>v.jsx("div",{className:`tool-belt row-${O}`,children:v.jsx("div",{className:"tool-track",children:[0,1,2,3].map(H=>v.jsx("div",{className:"tool-segment","aria-hidden":H!==0,children:R.map((re,ae)=>{const Ve=re.icon;return v.jsxs("span",{"data-magnetic":!0,style:{"--tool-accent":wA[O][ae]},children:[v.jsx("i",{"aria-hidden":"true",children:v.jsx(Ve,{size:17,strokeWidth:1.8})}),re.name]},`${re.name}-${H}`)})},H))})},R[0].name))}),v.jsxs("div",{className:"container profile-disclosure",children:[v.jsxs("div",{className:"skill-callout",children:[v.jsx(oA,{size:28}),v.jsx("span",{className:"skill-callout-copy",children:"看到这里，如果你想看到更多介绍，请点击以下标题"})]}),v.jsx("div",{id:"profile-details",className:"profile-details",children:v.jsx("div",{className:"profile-detail-list",children:Lr.map((R,O)=>{const H=.14+O*.11,re=[.22,1,.36,1];return v.jsxs(Oe.article,{className:"profile-detail-row",initial:M?!1:{opacity:0,y:38,filter:"blur(9px)"},animate:{opacity:1,y:0,filter:"blur(0px)"},transition:{delay:M?0:H,duration:M?0:.72,ease:re},children:[v.jsx(Oe.i,{className:"profile-detail-rule","aria-hidden":"true",initial:M?!1:{scaleX:0},animate:{scaleX:1},transition:{delay:M?0:H+.04,duration:M?0:.82,ease:re}}),v.jsxs("div",{className:"profile-detail-row-inner",children:[v.jsxs(Oe.div,{className:"profile-detail-meta",initial:M?!1:{opacity:0,x:-18},animate:{opacity:1,x:0},transition:{delay:M?0:H+.1,duration:M?0:.58,ease:re},children:[v.jsxs("span",{children:[v.jsx("i",{}),R.label]}),v.jsxs("strong",{children:[String(O+1).padStart(2,"0")," / ",String(Lr.length).padStart(2,"0")]})]}),v.jsxs("div",{className:"profile-detail-copy",children:[v.jsx(Oe.h3,{initial:M?!1:{opacity:0,y:28,filter:"blur(8px)"},animate:{opacity:1,y:0,filter:"blur(0px)"},transition:{delay:M?0:H+.15,duration:M?0:.68,ease:re},children:v.jsx("button",{className:"profile-detail-trigger","data-magnetic":!0,"data-focus-text":!0,type:"button","aria-haspopup":"dialog",onClick:ae=>{T.current=ae.currentTarget,r(O)},children:R.title})}),v.jsx(Oe.p,{initial:M?!1:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:M?0:H+.25,duration:M?0:.58,ease:re},children:R.description})]}),v.jsx("div",{className:"profile-detail-visual","aria-hidden":"true",children:v.jsx(Oe.span,{initial:M?!1:{opacity:0,x:72,y:64,rotateX:92,scaleY:.54,filter:"blur(14px)"},animate:M?{opacity:1}:{opacity:[0,.9,1],x:[72,-5,0],y:[64,-7,0],rotateX:[92,-9,0],scaleY:[.54,1.04,1],filter:["blur(14px)","blur(2px)","blur(0px)"]},transition:M?{duration:0}:{delay:H+.12,duration:1.05,times:[0,.72,1],ease:re},children:String(O+1).padStart(2,"0").split("").map((ae,Ve)=>v.jsx("span",{className:`profile-detail-digit ${Ve===0?"is-leading":"is-trailing"}`,children:ae},`${ae}-${Ve}`))})})]})]},R.title)})})})]})]}),v.jsx("section",{id:"experience",className:"experience section-pad",children:v.jsxs("div",{className:"container",children:[v.jsx(VA,{view:u,reduceMotion:!!M,onChange:R=>{R!==u&&(l(null),d(R))}}),v.jsx("div",{className:"journey-panel",id:"journey-panel",role:"tabpanel",ref:f,children:v.jsx(Jn,{mode:"wait",initial:!1,children:v.jsxs(Oe.div,{className:"experience-list",initial:M?!1:{opacity:0,x:u==="education"?30:-30,filter:"blur(8px)"},animate:{opacity:1,x:0,filter:"blur(0px)"},exit:M?void 0:{opacity:0,x:u==="education"?-24:24,filter:"blur(7px)"},transition:{duration:M?0:.52,ease:[.16,1,.3,1]},children:[v.jsx(Oe.i,{className:"experience-rail-progress","aria-hidden":"true",style:{scaleY:L}}),D.map((R,O)=>{const H=c===O;return v.jsxs(Oe.button,{className:`experience-item${R.phases?" has-phases":""}${H?" is-active":""}`,type:"button","aria-expanded":H,initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.35},transition:{delay:M?0:O*.05,duration:M?0:.55,ease:[.16,1,.3,1]},onMouseEnter:()=>l(O),onMouseLeave:re=>{document.activeElement!==re.currentTarget&&l(null)},onFocus:()=>l(O),onBlur:()=>l(null),onClick:()=>l(O),children:[v.jsx("span",{className:"experience-year",children:R.years}),v.jsxs("span",{className:"experience-dot","aria-hidden":"true",children:[v.jsx("i",{}),v.jsx("b",{})]}),v.jsxs("span",{className:"experience-main",children:[v.jsx("h3",{children:R.company}),R.phases?v.jsx("span",{className:"experience-phases",children:R.phases.map(re=>v.jsxs("span",{className:"experience-phase",children:[v.jsx("span",{className:"experience-phase-year",children:re.years}),v.jsx("strong",{className:"experience-phase-department",children:re.department}),v.jsx("span",{className:"experience-phase-level",children:re.level}),v.jsx("span",{className:"experience-phase-summary","aria-hidden":!H,children:v.jsx("span",{children:v.jsx("p",{children:re.summary})})})]},re.years))}):v.jsxs(v.Fragment,{children:[v.jsx("strong",{className:"experience-department",children:R.department}),v.jsx("span",{className:"experience-details","aria-hidden":!H,children:v.jsx("span",{children:R.responsibilities?v.jsxs("span",{className:"experience-detail-groups",children:[v.jsxs("span",{className:"experience-detail-group",children:[v.jsx("strong",{children:"内容"}),v.jsx("ul",{children:R.responsibilities.map(re=>v.jsx("li",{children:re},re))})]}),R.achievements&&v.jsxs("span",{className:"experience-detail-group",children:[v.jsx("strong",{children:"亮点"}),v.jsx("ul",{children:R.achievements.map(re=>v.jsx("li",{children:re},re))})]})]}):v.jsx("p",{children:R.summary})})})]})]}),v.jsxs("span",{className:"experience-side","aria-hidden":"true",children:[v.jsx("span",{className:"experience-level",children:R.phases?`${R.phases.length} 个任职阶段`:R.level}),v.jsx(jr,{className:"experience-arrow"})]})]},`${u}-${R.years}`)})]},u)})})]})}),v.jsxs("section",{id:"contact",className:"contact",children:[v.jsxs("div",{className:"contact-orbit","aria-hidden":"true",children:[v.jsx("i",{className:"contact-orbit-ring contact-orbit-ring-outer"}),v.jsx("i",{className:"contact-orbit-ring contact-orbit-ring-middle"}),v.jsx("i",{className:"contact-orbit-ring contact-orbit-ring-inner"})]}),v.jsxs("div",{className:"container contact-inner",children:[v.jsxs("h2",{className:"contact-headline",children:[v.jsx("span",{className:"contact-headline-kicker",children:"保持好奇"}),v.jsx("span",{className:"contact-headline-main",children:"让想法成为产品"})]}),v.jsxs("div",{className:"contact-bento",children:[v.jsxs("article",{className:"contact-bento-card contact-bento-portrait",children:[v.jsx("img",{src:vA,alt:"许德杰个人肖像"}),v.jsxs("div",{className:"contact-portrait-copy",children:[v.jsx("strong",{children:"许德杰"}),v.jsx("span",{children:"设计管理 · 产品体验 · AI 产品工程"})]})]}),v.jsx("article",{className:"contact-bento-card contact-bento-intro",children:v.jsx("strong",{children:v.jsx("span",{children:"中国福建厦门"})})}),v.jsxs("article",{className:"contact-bento-card contact-bento-phone","aria-label":"联系电话 137 7999 6421",children:[v.jsx(rA,{}),v.jsxs("span",{children:[v.jsx("small",{children:"PHONE"}),v.jsx("strong",{children:"137 7999 6421"})]})]}),v.jsxs("a",{className:"contact-bento-card contact-bento-link contact-bento-portal","data-magnetic":!0,href:"https://euxd.ylzpay.com",target:"_blank",rel:"noreferrer",children:[v.jsx("span",{className:"contact-link-icon contact-link-icon-brand",children:v.jsx("img",{src:gA,alt:""})}),v.jsxs("span",{children:[v.jsx("small",{children:"EUXD PORTAL"}),v.jsx("strong",{children:"体验设计门户"})]}),v.jsx(bo,{className:"contact-link-arrow"})]}),v.jsxs("a",{className:"contact-bento-card contact-bento-link contact-bento-library","data-magnetic":!0,href:"http://euxd.ylzpay.com/yh/",target:"_blank",rel:"noreferrer",children:[v.jsx("span",{className:"contact-link-icon contact-link-icon-brand",children:v.jsx(TA,{})}),v.jsxs("span",{children:[v.jsx("small",{children:"DESIGN SYSTEM"}),v.jsx("strong",{children:"EUXD 组件库"})]}),v.jsx(bo,{className:"contact-link-arrow"})]}),v.jsxs("a",{className:"contact-bento-card contact-bento-note","data-magnetic":!0,href:si,target:"_blank",rel:"noopener noreferrer","aria-label":"进入我的项目库",children:[v.jsxs("div",{className:"contact-note-copy",children:[v.jsx(AA,{}),v.jsxs("span",{className:"contact-note-label",children:[v.jsx("small",{children:"PROJECT LIBRARY"}),v.jsx("strong",{children:"我的项目库"})]})]}),v.jsx("div",{className:"contact-note-tools","aria-hidden":"true",children:Ad.slice(0,2).map((R,O)=>v.jsx("div",{className:`contact-note-tool-row row-${O+1}`,children:v.jsx("div",{className:"contact-note-tool-track",children:[0,1].map(H=>v.jsx("span",{className:"contact-note-tool-set",children:R.slice(0,7).map(({name:re,icon:ae})=>v.jsx("i",{title:re,children:v.jsx(ae,{})},`${re}-${H}`))},`contact-tools-${O}-${H}`))})},`contact-tools-${O}`))})]})]}),v.jsxs("footer",{children:[v.jsx("span",{children:"© 2026 XU DEJIE"}),v.jsx("span",{children:"DESIGNED BY DECOLAS"}),v.jsxs("a",{href:"#home",children:["BACK TO TOP ",v.jsx(Eo,{size:15})]})]})]})]})]}),v.jsx(Jn,{children:g&&!t&&s===null&&v.jsx(Oe.div,{className:"back-to-top-shell",initial:M?!1:{opacity:0,y:16,scale:.92},animate:{opacity:1,y:0,scale:1},exit:M?void 0:{opacity:0,y:12,scale:.94},transition:{duration:M?0:.34,ease:[.16,1,.3,1]},children:v.jsx("button",{className:"back-to-top","data-magnetic":!0,type:"button",onClick:()=>X("home"),"aria-label":"回到页面顶部",children:v.jsx(FT,{"aria-hidden":"true"})})})}),v.jsx(Jn,{children:V&&s!==null&&v.jsx(Oe.div,{className:"profile-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:M?0:.3},onMouseDown:R=>{R.target===R.currentTarget&&$()},children:v.jsxs(Oe.section,{className:"profile-modal-panel",role:"dialog","aria-modal":"true","aria-labelledby":`profile-modal-title-${s}`,initial:M?!1:{opacity:0,y:28,scale:.988},animate:{opacity:1,y:0,scale:1},exit:M?void 0:{opacity:0,y:18,scale:.994},transition:{duration:M?0:.42,ease:[.16,1,.3,1]},children:[v.jsxs(Oe.header,{className:"profile-modal-header",initial:M?!1:{opacity:0,y:-18},animate:{opacity:1,y:0},transition:{delay:M?0:.1,duration:.5,ease:[.22,1,.36,1]},children:[v.jsxs("div",{className:"profile-modal-index",children:[v.jsx("span",{children:String(s+1).padStart(2,"0")}),v.jsx("i",{}),v.jsx("span",{children:String(Lr.length).padStart(2,"0")})]}),v.jsxs("span",{children:[V.label," · PROFILE DETAILS"]}),v.jsx("button",{ref:S,className:"profile-modal-close","data-magnetic":!0,type:"button",onClick:$,"aria-label":"关闭详情弹窗",children:v.jsx(mA,{size:22})})]}),v.jsxs("div",{className:"profile-modal-scroll","data-lenis-prevent":!0,children:[v.jsxs(Oe.div,{className:"profile-modal-hero",initial:M?!1:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{delay:M?0:.08,duration:.46,ease:[.16,1,.3,1]},children:[v.jsxs(Oe.div,{className:"profile-modal-eyebrow",initial:M?!1:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:M?0:.2,duration:.5},children:[v.jsx("span",{}),V.modal.kicker]}),v.jsx(Oe.h2,{id:`profile-modal-title-${s}`,initial:M?!1:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:M?0:.13,duration:.45,ease:[.16,1,.3,1]},children:V.title}),v.jsx(Oe.p,{initial:M?!1:{opacity:0,y:28},animate:{opacity:1,y:0},transition:{delay:M?0:.34,duration:.62,ease:[.22,1,.36,1]},children:V.modal.lead})]}),v.jsx("div",{className:"profile-modal-stats",children:V.modal.stats.map((R,O)=>v.jsxs(Oe.div,{className:"profile-modal-stat",initial:M?!1:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:M?0:.16+O*.035,duration:.4,ease:[.16,1,.3,1]},children:[v.jsx("strong",{children:R.value}),v.jsx("span",{children:R.label})]},`${R.value}-${R.label}`))}),v.jsx("div",{className:"profile-modal-sections",children:V.modal.sections.map((R,O)=>v.jsxs(Oe.article,{className:`profile-modal-section${R.title==="职业方向"?" is-wide":""}${"image"in R&&R.image?" has-media is-wide":""}`,initial:M?!1:{opacity:0,y:22},animate:{opacity:1,y:0},transition:{delay:M?0:.2+O*.035,duration:.42,ease:[.16,1,.3,1]},children:[v.jsxs("div",{className:"profile-modal-section-content",children:[v.jsx("span",{children:String(O+1).padStart(2,"0")}),v.jsx("h3",{children:R.title}),"body"in R&&R.body&&v.jsx("p",{children:R.body}),"items"in R&&R.items&&v.jsx("ul",{children:R.items.map(H=>v.jsx("li",{children:H},H))}),"note"in R&&R.note&&v.jsx("small",{className:"profile-modal-note",children:R.note})]}),"image"in R&&R.image&&v.jsx("figure",{className:"profile-modal-section-media",children:v.jsx("img",{src:R.image.src,alt:R.image.alt,loading:"lazy",decoding:"async"})})]},R.title))})]})]},s)})})]})}export{qA as default};
