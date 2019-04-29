;(function($){
	$('.dropdown')
	.hover(function(){
		// $(this).addClass('menu-active')
		var $this = $(this)
		var activeClass = $this.data('active')+'-active';
		$this.addClass(activeClass)
	},function(){
		var $this = $(this)
		var activeClass = $this.data('active')+'-active';
		$this.removeClass(activeClass)
	})
})(jQuery)