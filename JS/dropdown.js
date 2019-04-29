;(function($){
	function DropDown($elem,options){
		// console.log($elem)//jQuery对象
		//1.罗列属性
		this.$elem = $elem;
		this.options = options;
		this.$layer = $elem.find('.dropdown-layer');
		this.activeClass = $elem.data('active')+'-active';
		this.timer = 0;
		//2.初始化
		this.init()
	}
	DropDown.prototype = {
		constructor:DropDown,
		init:function(){
			//1.初始化显示隐藏插件
			this.$layer.showHide(this.options)
			//2.监听显示隐藏插件
			this.$layer.on('show shown hide hidden',function(ev){
				this.$layer.trigger('dropdown-' + ev.type)
			}.bind(this))
			//3.绑定事件
			if (this.options.eventName == 'click') {
				this.$elem.on('click',function(ev){
					//阻止事件冒泡到document而触发隐藏
					this.show();
					ev.stopPropagation()
					
				}.bind(this))
				//点击页面其他部分隐藏
				$(document).on('click',$.proxy(this.show,this))
			}else {
				this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this))
			}			
		},
		show:function(){
			//处理快速划过
			if (this.options.delay) {
				this.timer = setTimeout(function(){
					this.$layer.showHide('show');
					this.$elem.addClass(this.activeClass);					
				}.bind(this),this.options.delay)
			}else {
				this.$layer.showHide('show');
				this.$elem.addClass(this.activeClass);
			}

		},
		hide:function(){
			clearTimeout(this.timer)
			this.$layer.showHide('hide')
			this.$elem.removeClass(this.activeClass)
		}
	}
	DropDown.DEFAULTS = {
		js:true,
		mode:'slideDownUp',
		delay:200,
		eventName:''
	}
	$.fn.extend({
		dropdown:function(options){
			// console.log(this)
			return this.each(function(){
				var $elem = $(this);
				var dropdown = $elem.data('dropdown')
				if (!dropdown) {
					options = $.extend({},DropDown.DEFAULTS,options)
					dropdown = new DropDown($elem,options)	
					$elem.data('dropdown',dropdown)				
				}
				if (typeof dropdown[options] == 'function') {
					dropdown[options]()
				}
			})
		}
	})
})(jQuery)