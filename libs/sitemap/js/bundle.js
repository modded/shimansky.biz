/*!
 * modified for babel ToProgress v0.1.1
 * http://github.com/djyde/ToProgress
 * gist.github.com/englishextra/6a8c79c9efbf1f2f50523d46a918b785
 * jsfiddle.net/englishextra/z5xhjde8/
 * arguments.callee changed to TP, a local wrapper function,
 * so that public function name is now customizable;
 * wrapped in curly brackets:
 * else{document.body.appendChild(this.progressBar);};
 * removed AMD, CommonJS support
 * added window object existence check
 * passes jshint
 */
var ToProgress=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var TP=function(){function t(){var s=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(var j in i){if(i.hasOwnProperty(j)){if(void 0!==s.style[j]){return i[j];}}}}function s(t,a){if(this.progress=0,this.options={id:"top-progress-bar",color:"#F44336",height:"2px",duration:0.2},t&&"object"==typeof t){for(var i in t){if(t.hasOwnProperty(i)){this.options[i]=t[i];}}}if(this.options.opacityDuration=3*this.options.duration,this.progressBar=document.createElement("div"),this.progressBar.id=this.options.id,this.progressBar.setCSS=function(t){for(var a in t){if(t.hasOwnProperty(a)){this.style[a]=t[a];}}},this.progressBar.setCSS({position:a?"relative":"fixed",top:"0",left:"0",right:"0","background-color":this.options.color,height:this.options.height,width:"0%",transition:"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-moz-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s","-webkit-transition":"width "+this.options.duration+"s, opacity "+this.options.opacityDuration+"s"}),a){var o=document.querySelector(a);if(o){if(o.hasChildNodes()){o.insertBefore(this.progressBar,o.firstChild);}else{o.appendChild(this.progressBar);}}}else{document.body.appendChild(this.progressBar);}}var i=t();return s.prototype.transit=function(){this.progressBar.style.width=this.progress+"%";},s.prototype.getProgress=function(){return this.progress;},s.prototype.setProgress=function(t,s){this.show();this.progress=t>100?100:0>t?0:t;this.transit();if(s){s();}},s.prototype.increase=function(t,s){this.show();this.setProgress(this.progress+t,s);},s.prototype.decrease=function(t,s){this.show();this.setProgress(this.progress-t,s);},s.prototype.finish=function(t){var s=this;this.setProgress(100,t);this.hide();if(i){this.progressBar.addEventListener(i,function(t){s.reset();s.progressBar.removeEventListener(t.type,TP);});}},s.prototype.reset=function(t){this.progress=0;this.transit();if(t){t();}},s.prototype.hide=function(){this.progressBar.style.opacity="0";},s.prototype.show=function(){this.progressBar.style.opacity="1";},s;};return TP();}());
/*!
 * modified for babel Zenscroll - v3.2.2
 * github.com/zengabor/zenscroll
 * Copyright 2015-2016 Gabor Lenard
 * removed AMD, CommonJS support
 * fixed IIFE enforcing
 * added brackets in if / for
 * source: github.com/zengabor/zenscroll/blob/dist/zenscroll.js
 * passes jshint
 */
var zenscroll=(function(){"use strict";if(typeof window==="undefined"||!("document"in window)){return{};}var createScroller=function(scrollContainer,defaultDuration,edgeOffset){defaultDuration=defaultDuration||999;if(!edgeOffset&&edgeOffset!==0){edgeOffset=9;}var scrollTimeoutId;var setScrollTimeoutId=function(newValue){scrollTimeoutId=newValue;};var docElem=document.documentElement;var nativeSmoothScrollEnabled=function(){return("getComputedStyle"in window)&&window.getComputedStyle(scrollContainer?scrollContainer:document.body)["scroll-behavior"]==="smooth";};var getScrollTop=function(){if(scrollContainer){return scrollContainer.scrollTop;}else{return window.scrollY||docElem.scrollTop;}};var getViewHeight=function(){if(scrollContainer){return Math.min(scrollContainer.offsetHeight,window.innerHeight);}else{return window.innerHeight||docElem.clientHeight;}};var getRelativeTopOf=function(elem){if(scrollContainer){return elem.offsetTop;}else{return elem.getBoundingClientRect().top+getScrollTop()-docElem.offsetTop;}};var stopScroll=function(){clearTimeout(scrollTimeoutId);setScrollTimeoutId(0);};var scrollToY=function(endY,duration,onDone){stopScroll();if(nativeSmoothScrollEnabled()){(scrollContainer||window).scrollTo(0,endY);if(onDone){onDone();}}else{var startY=getScrollTop();var distance=Math.max(endY,0)-startY;duration=duration||Math.min(Math.abs(distance),defaultDuration);var startTime=new Date().getTime();(function loopScroll(){setScrollTimeoutId(setTimeout(function(){var p=Math.min((new Date().getTime()-startTime)/duration,1);var y=Math.max(Math.floor(startY+distance*(p<0.5?2*p*p:p*(4-p*2)-1)),0);if(scrollContainer){scrollContainer.scrollTop=y;}else{window.scrollTo(0,y);}if(p<1&&(getViewHeight()+y)<(scrollContainer||docElem).scrollHeight){loopScroll();}else{setTimeout(stopScroll,99);if(onDone){onDone();}}},9));})();}};var scrollToElem=function(elem,duration,onDone){scrollToY(getRelativeTopOf(elem)-edgeOffset,duration,onDone);};var scrollIntoView=function(elem,duration,onDone){var elemHeight=elem.getBoundingClientRect().height;var elemTop=getRelativeTopOf(elem);var elemBottom=elemTop+elemHeight;var containerHeight=getViewHeight();var containerTop=getScrollTop();var containerBottom=containerTop+containerHeight;if((elemTop-edgeOffset)<containerTop||(elemHeight+edgeOffset)>containerHeight){scrollToElem(elem,duration,onDone);}else if((elemBottom+edgeOffset)>containerBottom){scrollToY(elemBottom-containerHeight+edgeOffset,duration,onDone);}else if(onDone){onDone();}};var scrollToCenterOf=function(elem,duration,offset,onDone){scrollToY(Math.max(getRelativeTopOf(elem)-getViewHeight()/2+(offset||elem.getBoundingClientRect().height/2),0),duration,onDone);};var setup=function(newDefaultDuration,newEdgeOffset){if(newDefaultDuration){defaultDuration=newDefaultDuration;}if(newEdgeOffset===0||newEdgeOffset){edgeOffset=newEdgeOffset;}};return{setup:setup,to:scrollToElem,toY:scrollToY,intoView:scrollIntoView,center:scrollToCenterOf,stop:stopScroll,moving:function(){return!!scrollTimeoutId;}};};var defaultScroller=createScroller();if("addEventListener"in window&&document.body.style.scrollBehavior!=="smooth"&&!window.noZensmooth){var replaceUrl=function(hash){try{history.replaceState({},"",window.location.href.split("#")[0]+hash);}catch(e){}};window.addEventListener("click",function(event){var anchor=event.target;while(anchor&&anchor.tagName!=="A"){anchor=anchor.parentNode;}if(!anchor||event.which!==1||event.shiftKey||event.metaKey||event.ctrlKey||event.altKey){return;}var href=anchor.getAttribute("href")||"";if(href.indexOf("#")===0){if(href==="#"){event.preventDefault();defaultScroller.toY(0);replaceUrl("");}else{var targetId=anchor.hash.substring(1);var targetElem=document.getElementById(targetId);if(targetElem){event.preventDefault();defaultScroller.to(targetElem);replaceUrl("#"+targetId);}}}},false);}return{createScroller:createScroller,setup:defaultScroller.setup,to:defaultScroller.to,toY:defaultScroller.toY,intoView:defaultScroller.intoView,center:defaultScroller.stop,moving:defaultScroller.moving};}());
/*!
 * A function for elements selection - v0.1.9
 * github.com/finom/bala
 * @param {String} a id, class or tag string
 * @param {String|Object} [b] context tag string or HTML Element object
 * a=BALA("sometag/#someid/.someclass"[,someParent]);
 * a=BALA.one("sometag/#someid/.someclass"[,someParent]);
 * global $ becomes var g
 * renamed function $ to g
 * added window object existence check
 * source: github.com/finom/bala/blob/master/bala.js
 * passes jshint
 */
var BALA=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var g=(function(document,s_addEventListener,s_querySelectorAll){function g(s,context,bala){bala=Object.create(g.fn);if(s){bala.push.apply(bala,s[s_addEventListener]?[s]:""+s===s?/</.test(s)?((context=document.createElement(context||s_addEventListener)).innerHTML=s,context.children):context?((context=g(context)[0])?context[s_querySelectorAll](s):bala):document[s_querySelectorAll](s):typeof s=='function'?document.readyState[7]?s():document[s_addEventListener]('DOMContentLoaded',s):s);}return bala;}g.fn=[];g.one=function(s,context){return g(s,context)[0]||null;};return g;})(document,'addEventListener','querySelectorAll');return g;}());
/*!
 * modified for babel crel - a small, simple, and fast DOM creation utility
 * github.com/KoryNunn/crel
 * crel(tagName/dom element[,attributes,child1,child2,childN...])
 * var element=crel('div',crel('h1','Crello World!'),
 * crel('p','This is crel'),crel('input',{type:'number'}));
 * removed AMD, CommonJS support
 * fixed Use '===' to compare with 'null'.
 * fixed The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.
 * fixed Expected an assignment or function call and instead saw an expression.
 * added window object existence check
 * source: github.com/KoryNunn/crel/blob/master/crel.js
 * passes jshint
 */
var crel=(function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var fn="function",obj="object",nodeType="nodeType",textContent="textContent",setAttribute="setAttribute",attrMapString="attrMap",isNodeString="isNode",isElementString="isElement",d=typeof document===obj?document:{},isType=function(a,type){return typeof a===type;},isNode=typeof Node===fn?function(object){return object instanceof Node;}:function(object){return object&&isType(object,obj)&&(nodeType in object)&&isType(object.ownerDocument,obj);},isElement=function(object){return _c[isNodeString](object)&&object[nodeType]===1;},isArray=function(a){return a instanceof Array;},appendChild=function(element,child){if(!_c[isNodeString](child)){child=d.createTextNode(child);}element.appendChild(child);};function _c(){var args=arguments,element=args[0],child,settings=args[1],childIndex=2,argumentsLength=args.length,attributeMap=_c[attrMapString];element=_c[isElementString](element)?element:d.createElement(element);if(argumentsLength===1){return element;}if(!isType(settings,obj)||_c[isNodeString](settings)||isArray(settings)){--childIndex;settings=null;}if((argumentsLength-childIndex)===1&&isType(args[childIndex],"string")&&element[textContent]!==undefined){element[textContent]=args[childIndex];}else{for(;childIndex<argumentsLength;++childIndex){child=args[childIndex];if(child===null){continue;}if(isArray(child)){for(var i=0;i<child.length;++i){appendChild(element,child[i]);}}else{appendChild(element,child);}}}for(var key in settings){if(settings.hasOwnProperty(key)){if(!attributeMap[key]){element[setAttribute](key,settings[key]);}else{var attr=attributeMap[key];if(typeof attr===fn){attr(element,settings[key]);}else{element[setAttribute](attr,settings[key]);}}}}return element;}_c[attrMapString]={};_c[isElementString]=isElement;_c[isNodeString]=isNode;if("undefined"!==typeof Proxy){_c.proxy=new Proxy(_c,{get:function(target,key){if(!(key in _c)){_c[key]=_c.bind(null,key);}return _c[key];}});}return _c;})();
/*!
 * safe way to handle console.log():
 * sitepoint.com/safe-console-log/
 */
/* jshint ignore:start */
if ("undefined" === typeof console) {
	console = {};
	console.log = function () {
		return;
	};
}
/* jshint ignore:end */
/*!
 * detect Node.js
 * github.com/lyrictenor/node-is-nwjs/blob/master/is-nodejs.js
 * @returns {Boolean} true or false
 */
var isNodejs = "undefined" !== typeof process && "undefined" !== typeof require || "";
/*!
 * detect Electron
 * @returns {Boolean} true or false
 */
var isElectron = "undefined" !== typeof window && window.process && "renderer" === window.process.type || "";
/*!
 * detect NW.js
 * github.com/lyrictenor/node-is-nwjs/blob/master/index.js
 * @returns {Boolean} true or false
 */
var isNwjs = function () {
	if ("undefined" !== typeof isNodejs && isNodejs) {
		try {
			if ("undefined" !== typeof require("nw.gui")) {
				return !0;
			}
		} catch (e) {
			return !1;
		}
	}
	return !1;
}
();
/*!
 * modified MediaHack - (c) 2013 Pomke Nohkan MIT LICENCED.
 * gist.github.com/englishextra/ff8c9dde94abe32a9d7c4a65e0f2ccac
 * jsfiddle.net/englishextra/xg7ce8kc/
 * removed className fallback and additionally
 * returns earlyDeviceOrientation,earlyDeviceSize
 * Add media query classes to DOM nodes
 * github.com/pomke/mediahack/blob/master/mediahack.js
 */
var earlyDeviceOrientation="",earlyDeviceSize="";(function(w,e){var f=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.add(a);}}},g=function(a){var b=a.split(" ");if(e){for(var c=0;c<b.length;c++){a=b[c];e.remove(a);}}},h={landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)"},k={small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"},d,mM="matchMedia",m="matches",o=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceOrientation=b;}else{g(b);}};c(a);a.addListener(c);},s=function(a,b){var c=function(a){if(a[m]){f(b);earlyDeviceSize=b;}else{g(b);}};c(a);a.addListener(c);};for(d in h){if(h.hasOwnProperty(d)){o(w[mM](h[d]),d);}}for(d in k){if(k.hasOwnProperty(d)){s(w[mM](k[d]),d);}}})(window,document.documentElement.classList||"");
/*!
 * add mobile or desktop class
 * using Detect Mobile Browsers | Open source mobile phone detection
 * Regex updated: 1 August 2014
 * detectmobilebrowsers.com
 * github.com/heikojansen/plack-middleware-detectmobilebrowsers
 */
var earlyDeviceType="";(function(d,h,k,n){var c=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(n)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(n.substr(0,4))?h:k;if(d&&c){d.classList.add(c);earlyDeviceType=c;}}(document.documentElement||"","mobile","desktop",navigator.userAgent||navigator.vendor||window.opera));
/*!
 * add svg support class
 */
var earlySvgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")?s:"no-"+s;(earlySvgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svg"));
/*!
 * add svgasimg support class
 */
var earlySvgasimgSupport="";(function(d,s){var c=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1")?s:"no-"+s;(earlySvgasimgSupport=c);if(d&&c){d.classList.add(c);}}(document.documentElement||"","svgasimg"));
/*!
 * add touch support class
 * gist.github.com/englishextra/3cb22aab31a52b6760b5921e4fe8db95
 * jsfiddle.net/englishextra/z5xhjde8/
 */
var earlyHasTouch="";(function(d,s){if(d){var c="ontouchstart"in d?s:"no-"+s;earlyHasTouch=c;d.classList.add(c);}}(document.documentElement||"","touch"));
/*!
 * return date in YYYY-MM-DD format
 */
var earlyFnGetYyyymmdd=function(){"use strict";var a=(new Date()),b=a.getDate(),d=a.getFullYear(),c=a.getMonth();(c+=1);if(10>b){b="0"+b;}if(10>c){c="0"+c;}return d+"-"+c+"-"+b;}();
/*!
 * append details to title
 */
var initialDocumentTitle = document.title || "",
userBrowsingDetails = " [" + (earlyFnGetYyyymmdd ? earlyFnGetYyyymmdd : "") + (earlyDeviceType ? " " + earlyDeviceType : "") + (earlyDeviceSize ? " " + earlyDeviceSize : "") + (earlyDeviceOrientation ? " " + earlyDeviceOrientation : "") + (earlySvgSupport ? " " + earlySvgSupport : "") + (earlySvgasimgSupport ? " " + earlySvgasimgSupport : "") + (earlyHasTouch ? " " + earlyHasTouch : "") + "]";
if (document.title) {
	document.title = document.title + userBrowsingDetails;
}
/*!
 * modified JavaScript Sync/Async forEach - v0.1.2 - 1/10/2012
 * github.com/cowboy/javascript-sync-async-foreach
 * Copyright (c) 2012 "Cowboy" Ben Alman; Licensed MIT
 * removed Node.js / browser support wrapper function
 * @param {Object} a Any object to walk through
 * @param {Object} b The sync callback function
 * @param {Object} [c] The async callback function
 * forEach(a,function(e){console.log("eachCallback: "+e);},!1});
 * forEach(a,function(e){console.log("eachCallback: "+e);},function(){console.log("doneCallback");});
 * passes jshint
 */
/*jslint bitwise: true */
var forEach=(function(){return function(a,b,c){var d=-1,e=a.length>>>0;(function f(g){var h,j=false===g;do++d;while(!(d in a)&&d!==e);if(j||d===e){if(c){c(!j,a);}return;}g=b.call({async:function(){return h=!0,f;}},a[d],d,a);if(!h){f(g);}})();};}());
/*jslint bitwise: false */
/*!
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * modified gist.github.com/joelambert/1002116
 * the fallback function requestAnimFrame is incorporated
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Object} fn The callback function
 * @param {Int} delay The delay in milliseconds
 * requestInterval(fn, delay);
 */
var requestInterval=function(fn,delay){var requestAnimFrame=(function(){return window.requestAnimationFrame||function(callback,element){window.setTimeout(callback,1000/60);};})(),start=new Date().getTime(),handle={};function loop(){handle.value=requestAnimFrame(loop);var current=new Date().getTime(),delta=current-start;if(delta>=delay){fn.call();start=new Date().getTime();}}handle.value=requestAnimFrame(loop);return handle;};
/*!
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Int|Object} handle function handle, or function
 * clearRequestInterval(handle);
 */
var clearRequestInterval=function(handle){if(window.cancelAnimationFrame){window.cancelAnimationFrame(handle.value);}else{window.clearInterval(handle);}};
/*!
 * Plain javascript replacement for jQuery's .ready()
 * so code can be scheduled to run when the document is ready
 * github.com/jfriend00/docReady
 * gist.github.com/englishextra/7c22a9a9cae3320318e9c9eab6777c84
 * added window object existence check
 * docReady(function(){});
 * source: github.com/jfriend00/docReady/blob/master/docready.js
 * passes jshint
 */
var docReady=(function(){"use strict";if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var readyList=[];var readyFired=false;var readyEventHandlersInstalled=false;function ready(){if(!readyFired){readyFired=true;for(var i=0;i<readyList.length;i++){readyList[i].fn.call(window,readyList[i].ctx);}readyList=[];}}function readyStateChange(){if(document.readyState==="complete"){ready();}}return function(callback,context){if(readyFired){setTimeout(function(){callback(context);},1);return;}else{readyList.push({fn:callback,ctx:context});}if(document.readyState==="complete"||(!document.attachEvent&&document.readyState==="interactive")){setTimeout(ready,1);}else if(!readyEventHandlersInstalled){if(document.addEventListener){document.addEventListener("DOMContentLoaded",ready,false);window.addEventListener("load",ready,false);}else{document.attachEvent("onreadystatechange",readyStateChange);window.attachEvent("onload",ready);}readyEventHandlersInstalled=true;}};})();
/*!
 * modified for babel Evento - v1.0.0
 * by Erik Royall <erikroyalL@hotmail.com> (http://erikroyall.github.io)
 * Dual licensed under MIT and GPL
 * identifier needs binding if its function has arguments
 * var fn=function(a){a=a||"";if(a){return a;}};
 * evento.add(window,"load",fn.bind(null,some_value));
 * removed Array.prototype.indexOf shim
 * removed Helio stuff which seems to be added
 * for some other library, and works without Helio
 * jsbin.com/jilevi/edit?html,js,output
 * jsfiddle.net/englishextra/hLxyvmcm/
 * exposed as window property
 * added window object existence check
 * source: gist.github.com/erikroyall/6618740
 * source: gist.github.com/englishextra/3a959e4da0fcc268b140
 * passes jshint
 */
var evento=(function(){return function(){if("undefined"==typeof window||!("document"in window)){return console.log("window is undefined or document is not in window"),!1;}var win=window,doc=win.document,_handlers={},addEvent,removeEvent,triggerEvent;addEvent=(function(){if(typeof doc.addEventListener==="function"){return function(el,evt,fn){el.addEventListener(evt,fn,false);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else if(typeof doc.attachEvent==="function"){return function(el,evt,fn){el.attachEvent(evt,fn);_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}else{return function(el,evt,fn){el["on"+evt]=fn;_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];_handlers[el][evt].push(fn);};}}());removeEvent=(function(){if(typeof doc.removeEventListener==="function"){return function(el,evt,fn){el.removeEventListener(evt,fn,false);};}else if(typeof doc.detachEvent==="function"){return function(el,evt,fn){el.detachEvent(evt,fn);};}else{return function(el,evt,fn){el["on"+evt]=undefined;};}}());triggerEvent=function(el,evt){_handlers[el]=_handlers[el]||{};_handlers[el][evt]=_handlers[el][evt]||[];for(var _i=0,_l=_handlers[el][evt].length;_i<_l;_i+=1){_handlers[el][evt][_i]();}};return{add:addEvent,remove:removeEvent,trigger:triggerEvent,_handlers:_handlers};}();}());
/*!
 * Promise based script loader for the browser using script tags
 * github.com/MiguelCastillo/load-js
 * type: defaults to text/javascript
 * async: defaults to false
 * charset: defaults to utf-8
 * id: no default value
 * url: required if no text is provided
 * text: required if no url is provided
 * promiseLoadJS(["https://code.jquery.com/jquery-2.2.1.js",
 * "https://unpkg.com/react@15.3.1/dist/react.min.js"])
 * .then(function(){console.log("jQuery and react are loaded");});
 * promiseLoadJS([{async:true,url:"https://code.jquery.com/jquery-2.2.1.js"},
 * {async:true,url:"https://unpkg.com/react@15.3.1/dist/react.min.js"}])
 * .then(()=>{console.log("all done!");});
 * source: gist.github.com/pranksinatra/a4e57e586249dc3833e4
 * passes jshint
 */
;(function(){function exec(options){if("string"===typeof options){options={url:options};}if(!options.url&&!options.text){throw new Error("must provide a url or text to load");}var head=document.getElementsByTagName("head")[0]||document.documentElement;var script=document.createElement("script");script.charset=options.charset||"utf-8";script.type=options.type||"text/javascript";script.async=!!options.async;if(options.hasOwnProperty("id")){script.id=options.id;}if(options.url){script.src=options.url;return loadScript(head,script);}else{script.text=options.text;return runScript(head,script);}}function runScript(head,script){head.appendChild(script);return Promise.resolve(script);}function loadScript(head,script){return new Promise(function(resolve){var done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){done=true;script.onload=script.onreadystatechange=null;if(head&&script.parentNode){head.removeChild(script);}resolve(script);}};head.appendChild(script);});}var promiseLoadJS=function(items){return items instanceof Array?Promise.all(items.map(exec)):exec(items);};("undefined"!==typeof window?window:this).promiseLoadJS=promiseLoadJS;}());
/*!
 * How can I check if a JS file has been included already?
 * gist.github.com/englishextra/403a0ca44fc5f495400ed0e20bc51d47
 * stackoverflow.com/questions/18155347/how-can-i-check-if-a-js-file-has-been-included-already
 * @param {String} s path string
 * scriptIsLoaded(s)
 */
var scriptIsLoaded=function(s){for(var b=document.getElementsByTagName("script")||"",a=0;a<b.length;a++)if(b[a].getAttribute("src")==s)return!0;return!1;};
/*!
 * Load and execute JS via AJAX
 * gist.github.com/englishextra/8dc9fe7b6ff8bdf5f9b483bf772b9e1c
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 * gist.github.com/Xeoncross/7663273
 * modified callback(x.responseText,x); to callback(eval(x.responseText),x);
 * stackoverflow.com/questions/3728798/running-javascript-downloaded-with-xmlhttprequest
 * @param {String} u path string
 * @param {Object} [f] callback function
 * @param {Object} [e] on error callback function
 * ajaxLoadTriggerJS(u,f,e)
 */
;(function(){;(function(){var ajaxLoadTriggerJS=function(u,f,e){var w=window,x=w.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");x.overrideMimeType("application/javascript;charset=utf-8");x.open("GET",u,!0);x.withCredentials=!1;x.onreadystatechange=function(){if(x.status=="404"){if(e&&"function"===typeof e){e();}console.log("Error XMLHttpRequest-ing file",x.status);return!1;}else if(x.readyState==4&&x.status==200&&x.responseText){try{var Fn=Function;new Fn(""+x.responseText).call("undefined"===typeof window?"undefined"===typeof self?"undefined"===typeof global?this:global:self:window);}catch(m){throw new Error("Error evaluating file. "+m);}if(f&&"function"===typeof f){f(x.responseText);}}};x.send(null);};("undefined"!==typeof window?window:this).ajaxLoadTriggerJS=ajaxLoadTriggerJS;}());("undefined"!==typeof window?window:this).ajaxLoadTriggerJS=ajaxLoadTriggerJS;}());
/*!
 * append node into other with fragment
 * gist.github.com/englishextra/0ff3204d5fb285ef058d72f31e3af766
 * @param {String|object} e an HTML Element to append
 * @param {Object} a target HTML Element
 * appendFragment(e,a)
 */
var appendFragment=function(e,a){"use strict";var d=document;a=a||d.getElementsByTagNames("body")[0]||"";return function(){if(e){var d=document,df=d.createDocumentFragment()||"",aC="appendChild";if("string"===typeof e){e=d.createTextNode(e);}df[aC](e);a[aC](df);}}();};
/*!
 * set style opacity of an element
 * @param {Object} a an HTML Element
 * @param {Number} n any positive decimal number 0.00-1.00
 * setStyleOpacity(a,n)
 */
var setStyleOpacity=function(a,n){n=n||1;return function(){if(a){a.style.opacity=n;}}();};
/*!
 * set style visibility visible of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityVisible(a)
 */
var setStyleVisibilityVisible=function(a){return function(){if(a){a.style.visibility="visible";}}();};
/*!
 * set style visibility hidden of an element
 * @param {Object} a an HTML Element
 * setStyleVisibilityHidden(a)
 */
var setStyleVisibilityHidden=function(a){return function(){if(a){a.style.visibility="hidden";}}();};
/*!
 * modified for babel Unified URL parsing API in the browser and node
 * github.com/wooorm/parse-link
 * removed AMD, CommonJS support
 * gist.github.com/englishextra/4e9a0498772f05fa5d45cfcc0d8be5dd
 * gist.github.com/englishextra/2a7fdabd0b23a8433d5fc148fb788455
 * jsfiddle.net/englishextra/fcdds4v6/
 * @param {String} url URL string
 * @param {Boolean} [true|false] if true, returns protocol:, :port, /pathname, ?search, ?query, #hash
 * if set to  false, returns protocol, port, pathname, search, query, hash
 * alert(parseLink("http://localhost/search?s=t&v=z#dev").href|
 * origin|host|port|hash|hostname|pathname|protocol|search|query|isAbsolute|isRelative|isCrossDomain);
 */
/*jslint bitwise: true */
var parseLink=function(url,full){full=full||!1;return function(){var _r=function(s){return s.replace(/^(#|\?)/,"").replace(/\:$/,"");},l=location||"",_p=function(protocol){switch(protocol){case"http:":return full?":"+80:80;case"https:":return full?":"+443:443;default:return full?":"+l.port:l.port;}},_s=(0===url.indexOf("//")||!!~url.indexOf("://")),w=window.location||"",_o=function(){var o=w.protocol+"//"+w.hostname+(w.port?":"+w.port:"");return o||"";},_c=function(){var c=document.createElement("a");c.href=url;var v=c.protocol+"//"+c.hostname+(c.port?":"+c.port:"");return v!==_o();},a=document.createElement("a");a.href=url;return{href:a.href,origin:_o(),host:a.host||l.host,port:("0"===a.port||""===a.port)?_p(a.protocol):(full?a.port:_r(a.port)),hash:full?a.hash:_r(a.hash),hostname:a.hostname||l.hostname,pathname:a.pathname.charAt(0)!="/"?(full?"/"+a.pathname:a.pathname):(full?a.pathname:a.pathname.slice(1)),protocol:!a.protocol||":"==a.protocol?(full?l.protocol:_r(l.protocol)):(full?a.protocol:_r(a.protocol)),search:full?a.search:_r(a.search),query:full?a.search:_r(a.search),isAbsolute:_s,isRelative:!_s,isCrossDomain:_c(),hasHTTP:/^(http|https):\/\//i.test(url)?!0:!1};}();};
/*jslint bitwise: false */
/*!
 * get current protocol - "http" or "https", else return ""
 * @param {Boolean} [a] When set to "true", and the result is empty,
 * the function will return "http"
 * getHTTP(a)
 */
var getHTTP=function(a){return function(f){return"http:"===a?"http":"https:"===a?"https":f?"http":"";};}(window.location.protocol||"");
/*!
 * init ToProgress and extend methods
 */
var progressBar = new ToProgress({
		id : "top-progress-bar",
		color : "#FE5F55",
		height : "3px",
		duration : 0.2
	});
/*!
 * @memberof progressBar
 * @param {Int} [n] a whole positive number
 * progressBar.init(n)
 */
progressBar.init = function (n) {
	n = n || 20;
	return this.increase(n);
};
/*!
 * @memberof progressBar
 * progressBar.complete()
 */
progressBar.complete = function () {
	return this.finish(),
	this.hide();
};
progressBar.init();
/*!
 * Open external links in default browser out of Electron / nwjs
 * gist.github.com/englishextra/b9a8140e1c1b8aa01772375aeacbf49b
 * stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser
 * github.com/nwjs/nw.js/wiki/shell
 * electron - file: | nwjs - chrome-extension: | http: Intel XDK
 * @param {String} a URL/path string
 * openDeviceBrowser(a)
 */
var openDeviceBrowser = function (a) {
	"use strict";
	var w = window,
	g = function () {
		var es = "undefined" !== typeof isElectron && isElectron ? require("electron").shell : "";
		return es ? es.openExternal(a) : "";
	},
	k = function () {
		var ns = "undefined" !== typeof isNwjs && isNwjs ? require("nw.gui").Shell : "";
		return ns ? ns.openExternal(a) : "";
	},
	q = function () {
		/*!
		 * wont do in electron and nw,
		 * so manageExternalLinks will set target blank to links
		 */
		/* var win = w.open(a, "_blank");
		win.focus(); */
		return !0;
	},
	v = function () {
		return w.open(a, "_system", "scrollbars=1,location=no");
	};
	console.log("triggered function: openDeviceBrowser");
	if ("undefined" !== typeof isElectron && isElectron) {
		g();
	} else if ("undefined" !== typeof isNwjs && isNwjs) {
		k();
	} else {
		if ("undefined" !== typeof getHTTP && getHTTP()) {
			q();
		} else {
			v();
		}
	}
};
/*!
 * set click event on external links,
 * so that they open in new browser tab
 * @param {Object} [ctx] context HTML Element
 */
var manageExternalLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "",
		h_e = function (ev) {
			ev.stopPropagation();
			ev.preventDefault();
			openDeviceBrowser(p);
		};
		if (p && parseLink(p).isCrossDomain && parseLink(p).hasHTTP) {
			e.title = "" + (parseLink(p).hostname || "") + " откроется в новой вкладке";
			if ("undefined" !== typeof getHTTP && getHTTP()) {
				e.target = "_blank";
			} else {
				/* evento.add(e, "click", h_e); */
				e.onclick = h_e;
			}
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageExternalLinks");
		k();
	}
};
evento.add(window, "load", manageExternalLinks.bind(null, ""));
/*!
 * set title on local links,
 * so that they inform that they open in currnet tab
 * @param {Object} [ctx] context HTML Element
 */
var manageLocalLinks = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "a",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	g = function (e) {
		var p = e.getAttribute("href") || "";
		if (p && parseLink(p).isRelative && !e.getAttribute("title")) {
			e.title = "Откроется здесь же";
		}
	},
	k = function () {
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	};
	if (a) {
		console.log("triggered function: manageLocalLinks");
		k();
	}
};
evento.add(window, "load", manageLocalLinks.bind(null, ""));
/*!
 * replace img src with data-src
 * @param {Object} [ctx] context HTML Element
 */
var manageDataSrcImg = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = "img[data-src]",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	ds = "dataset",
	pN = "parentNode",
	g = function (e) {
		var p = e[ds].src || "";
		if (p) {
			if (parseLink(p).isAbsolute && !parseLink(p).hasHTTP) {
				e[ds].src = p.replace(/^/, getHTTP(!0) + ":");
			}
			if (w.lzld) {
				lzld(e);
			} else {
				e.src = e[ds].src;
			}
			setStyleVisibilityVisible(e[pN]);
			setStyleOpacity(e[pN], 1);
		}
	};
	if (a) {
		console.log("triggered function: manageDataSrcImg");
		a = ctx ? BALA(cls, ctx) || "" : BALA(cls) || "";
		if (w._) {
			_.each(a, g);
		} else if (w.forEach) {
			forEach(a, g, !1);
		} else {
			for (var i = 0, l = a.length; i < l; i += 1) {
				g(a[i]);
			}
		}
	}
},
loadManageDataSrcImg = function () {
	"use strict";
	var w = window,
	js = "./cdn/lazyload/3.2.2/js/lazyload.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(manageDataSrcImg.bind(null, ""));
		} else {
			ajaxLoadTriggerJS(js, manageDataSrcImg.bind(null, ""));
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, manageDataSrcImg.bind(null, ""));
		}
	}
};
/* evento.add(window, "load", loadManageDataSrcImg); */
/*!
 * init masonry
 */
var initMasonry = function (ctx) {
	"use strict";
	ctx = ctx || "";
	var w = window,
	cls = ".masonry-grid",
	h = ".masonry-grid-item",
	k = ".masonry-grid-sizer",
	a = ctx ? BALA.one(cls, ctx) || "" : BALA.one(cls) || "",
	c = ctx ? BALA.one(h, ctx) || "" : BALA.one(h) || "",
	cls1 = ".holder-filter-buttons",
	holder_btns = ctx ? BALA.one(cls1, ctx) || "" : BALA.one(cls1) || "",
	cls2 = ".holder-filter-buttons button[data-filter]",
	btn = ctx ? BALA.one(cls2, ctx) || "" : BALA.one(cls2) || "",
	btns = ctx ? BALA(cls2, ctx) || "" : BALA(cls2) || "",
	cls3 = ".holder-filter-select",
	holder_sel = ctx ? BALA.one(cls3, ctx) || "" : BALA.one(cls3) || "",
	cls4 = ".filter-select",
	sel = ctx ? BALA.one(cls4, ctx) || "" : BALA.one(cls4) || "",
	cls5 = ".holder-filter-controls",
	holder_controls = ctx ? BALA.one(cls5, ctx) || "" : BALA.one(cls5) || "",
	g = function () {
		clearTimeout(st);
		var imgLoad;
		if (w.Masonry && w.Isotope) {
			var iso = new Isotope(a, {
					itemSelector: h,
					layoutMode: "masonry",
					masonry: {
						columnWidth: k,
						gutter: 0
					},
					percentPosition: !0,
				});
			console.log("function initMasonry => initialised iso");
			if (w.imagesLoaded) {
				imgLoad = imagesLoaded(a);
				imgLoad.on("progress", function (instance) {
					iso.layout();
					console.log("function initMasonry => reinitialised iso");
				});
			}
			var h_btns = function (e) {
				iso.arrange({
					filter: e.dataset.filter
				});
				for (var i = 0, l = btns.length; i < l; i += 1) {
					btns[i].classList.remove("is-active");
				}
				e.classList.add("is-active");
				for (var j = 0, m = sel.options.length; j < m; j += 1) {
					if (sel.options[j].value === e.dataset.filter) {
						sel.selectedIndex = j;
						break;
					}
				}
			};
			if (btn) {
				for (var i = 0, l = btns.length; i < l; i += 1) {
					btns[i].onclick = h_btns.bind(null, btns[i]);
				}
			}
			var h_sel = function (e) {
				iso.arrange({
					filter: e.options[e.selectedIndex].value
				});
				for (var i = 0, l = btns.length; i < l; i += 1) {
					btns[i].classList.remove("is-active");
				}
				for (var j = 0, m = btns.length; j < m; j += 1) {
					if (btns[j].dataset.filter === e.options[e.selectedIndex].value) {
						btns[j].classList.add("is-active");
						break;
					}
				}
			};
			if (sel) {
				sel.onchange = h_sel.bind(null, sel);
			}
			if (holder_controls) {
				holder_controls.classList.add("visible");
			}
		} else if (w.Masonry) {
			var msnry = new Masonry(a, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonry => initialised msnry");
			if (w.imagesLoaded) {
				imgLoad = imagesLoaded(a);
				imgLoad.on("progress", function (instance) {
					msnry.layout();
					console.log("function initMasonry => reinitialised msnry");
				});
			}
			if (holder_controls) {
				holder_controls.classList.remove("visible");
			}
		} else if (w.Packery) {
			var pckry = new Packery(a, {
					itemSelector: h,
					columnWidth: k,
					gutter: 0,
					percentPosition: !0
				});
			console.log("function initMasonry => initialised pckry");
			if (w.imagesLoaded) {
				imgLoad = imagesLoaded(a);
				imgLoad.on("progress", function (instance) {
					pckry.layout();
					console.log("function initMasonry => reinitialised pckry");
				});
			}
			if (c) {
				c = ctx ? BALA(h, ctx) || "" : BALA(h) || "";
				if (w.Draggabilly) {
					var draggie,
					f = function (e) {
						var draggableElem = e;
						draggie = new Draggabilly(draggableElem, {});
						draggies.push(draggie);
						console.log("function initMasonry => initialised draggie");
					},
					draggies = [];
					if (w._) {
						_.each(c, f);
					} else if (w.forEach) {
						forEach(c, f, !1);
					} else {
						for (var j = 0, m = c.length; j < m; j += 1) {
							f(c[j]);
						}
					}
					if (pckry && draggie) {
						pckry.bindDraggabillyEvents(draggie);
						console.log("function initMasonry => binded draggie to pckry");
					}
				}
			}
			if (holder_controls) {
				holder_controls.classList.remove("visible");
			}
		} else {
			console.log("function initMasonry => no lib included");
		}
	};
	var st = setTimeout(g, 100);
},
loadInitMasonry = function () {
	"use strict";
	var w = window,
	/* js = "./cdn/masonry/4.1.1/js/masonry.imagesloaded.pkgd.fixed.min.js"; */
	/* js = "./cdn/packery/2.1.1/js/packery.imagesloaded.pkgd.fixed.min.js"; */
	/* js = "./cdn/packery/2.1.1/js/packery.imagesloaded.draggabilly.pkgd.fixed.min.js"; */
	js = "./cdn/isotope/3.0.1/js/isotope.imagesloaded.pkgd.fixed.min.js";
	if (w.XMLHttpRequest || w.ActiveXObject) {
		if (w.Promise) {
			promiseLoadJS(js).then(initMasonry.bind(null, ""));
		} else {
			ajaxLoadTriggerJS(js, initMasonry.bind(null, ""));
		}
	} else {
		if (!scriptIsLoaded(js)) {
			loadJS(js, initMasonry.bind(null, ""));
		}
	}
};
evento.add(window, "load", loadInitMasonry);
/*!
 * init ui-totop
 */
var initUiTotop = function () {
	"use strict";
	var w = window,
	b = BALA.one("body") || "",
	h = BALA.one("html") || "",
	u = "ui-totop",
	v = "ui-totop-hover",
	g = function (f) {
		var z = function (n) {
			var o = w.pageYOffset,
			i = 0,
			x = function (o, l) {
					return function () {
						l -= o * n;
						w.scrollTo(0, l);
						i += 1;
						if (150 < i || 0 > l) {
							clearInterval(si);
						}
					};
				},
			si = setInterval(x.bind(null, n, o--), 50);
		},
		t = "Наверх",
		a = crel("a"),
		s = crel("span"),
		h_a = function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (w.zenscroll) {
				zenscroll.toY(0);
			} else {
				z(50);
			}
		};
		a.id = u;
		/* jshint -W107 */
		a.href = "javascript:void(0);";
		/* jshint +W107 */
		a.title = t;
		evento.add(a, "click", h_a);
		/* a.onclick = h_a; */
		setStyleOpacity(a, 0);
		s.id = v;
		appendFragment(crel(a, s, "" + t), b);
		if (f && "function" === typeof f) {
			f();
		}
	},
	k = function (_this) {
		var a = _this.pageYOffset || h.scrollTop || b.scrollTop || "",
		c = _this.innerHeight || h.clientHeight || b.clientHeight || "",
		e = BALA.one("#" + u) || "";
		if (a && c && e) {
			if (a > c) {
				setStyleVisibilityVisible(e);
				setStyleOpacity(e, 1);
			} else {
				setStyleVisibilityHidden(e);
				setStyleOpacity(e, 0);
			}
		}
	},
	q = function () {
		evento.add(w, "scroll", k.bind(null, w));
		/* w.onscroll = k.bind(null, w); */
	};
	if (b) {
		console.log("triggered function: initUiTotop");
		g(q);
	}
};
docReady(initUiTotop);
/*!
 * show page, finish ToProgress
 */
var showPageFinishProgress = function () {
	"use strict";
	var a = BALA.one("#container") || "",
	g = function () {
		setStyleOpacity(a, 1);
		progressBar.complete();
	},
	k = function () {
		var si = requestInterval(function () {
				console.log("function showPageFinishProgress => started Interval");
				if (imagesPreloaded) {
					clearRequestInterval(si);
					console.log("function showPageFinishProgress => si=" + si + "; imagesPreloaded=" + imagesPreloaded);
					g();
				}
			}, 100);
	};
	if (a) {
		console.log("triggered function: showPageFinishProgress");
		if ("undefined" !== typeof imagesPreloaded) {
			k();
		} else {
			g();
		}
	}
};
evento.add(window, "load", showPageFinishProgress);