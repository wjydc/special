import './public.less';


$.extend(window, {
	getRandomColor: function(){
		return '#' + (function(h) {
			return new Array(7 - h.length).join("0") + h
		})((Math.random() * 0x1000000 << 0).toString(16))
	},
	scrollY: function(){
        return document.body.scrollTop || document.documentElement.scrollTop;
    },
	css: function(obj,attr){
      return parseFloat( obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr] ) || 0;
    },
	goBottom: function() {
      window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight); 
	},
	goTop: function() {
		$('html, body').animate({scrollTop:0}, 'slow'); 
	},
	getOffsetWidth: function(){
		return document.body.clientWidth || document.documentElement.clientWidth;
	}
})

	


