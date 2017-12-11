(function(){/*
 http://pcjs.org/modules/devices/device.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/input.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/led.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/rom.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/time.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/ledctrl.js (C) Jeff Parsons 2012-2017
 http://pcjs.org/modules/devices/machine.js (C) Jeff Parsons 2012-2017
*/
var f="function"==typeof Object.defineProperties?Object.defineProperty:function(a,c,b){if(b.get||b.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[c]=b.value)},k="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;
function l(a,c){if(c){var b=k;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];e in b||(b[e]={});b=b[e]}a=a[a.length-1];d=b[a];c=c(d);c!=d&&null!=c&&f(b,a,{configurable:!0,writable:!0,value:c})}}l("Math.trunc",function(a){return a?a:function(c){c=Number(c);if(isNaN(c)||Infinity===c||-Infinity===c||!c)return c;var b=Math.floor(Math.abs(c));return 0>c?-b:b}});
l("Array.prototype.fill",function(a){return a?a:function(c,b,a){var d=this.length||0;0>b&&(b=Math.max(0,d+b));if(null==a||a>d)a=d;a=Number(a);0>a&&(a=Math.max(0,d+a));for(b=Number(b||0);b<a;b++)this[b]=c;return this}});l("Math.log2",function(a){return a?a:function(a){return Math.log(a)/Math.LN2}});
l("String.prototype.startsWith",function(a){return a?a:function(a,b){var c;if(null==this)throw new TypeError("The 'this' value for String.prototype.startsWith must not be null or undefined");if(a instanceof RegExp)throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");c=this+"";a+="";var e=c.length,h=a.length;b=Math.max(0,Math.min(b|0,c.length));for(var g=0;g<h&&b<e;)if(c[b++]!=a[g++])return!1;return g>=h}});})()