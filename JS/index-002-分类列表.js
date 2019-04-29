;(function($){

	//只加载一次html函数
	function loadedOnceHtml($elem,cb){
		var loadUrl = $elem.data('load');
		if(!loadUrl) return;
		var isLoaded = $elem.data('isLoaded');
		if(isLoaded) return;
		var $layer = $elem.find('.dropdown-layer');
		$.getJSON(loadUrl,function(data){
			typeof cb == 'function' && cb($elem,data)
		})
	}

	//顶部下拉菜单
	var $menuDropdown = $('.nav-side .dropdown');
	
	$menuDropdown.dropdown({
		delay:200,
	});
	
	$menuDropdown.on('dropdown-show',function($elem,data){
		loadedOnceHtml($(this),buildMenuHtml)
	});
	function buildMenuHtml($elem,data){
		var html = '';
		for(var i = 0;i<data.length;i++){
			html += '<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>'
		}
		//模拟网络延时
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
			$elem.data('isLoaded',true);
		},1000);
	}
	$menuDropdown.dropdown({
		delay:200,
	});
	//搜索框下拉层
	var $search = $('.header .search')
	$search.on('getData',function(ev,data){
		// console.log(this)
		var html = getSearchLayerHtml(data,1)
		for(var i = 0;i<data.result.length;i++){
			html +='<li class="search-item">'+data.result[i][0]+'</li>'
		}
		$search.search('appendHtml',html)
		if (html == '') {
			$search.search('hideLayer')
		}else {
			$search.search('showLayer')
		}
	});
	$search.on('getNoData',function(ev,data){
			$search.search('appendHtml','')
			$search.search('hideLayer')
	});

	function getSearchLayerHtml(data,maxNum){
		var html = '';
		for(var i = 0;i<data.result.length;i++){
			if (i >= maxNum) break;
			html +='<li class="search-item">'+data.result[i][0]+'</li>'
		}
		return html
	}
	$search.search()

	//分类列表
	var $categoryDropdown = $('.category .dropdown') 
	$categoryDropdown.on('dropdown-show',function(ev){
		loadedOnceHtml($(this),buildCategoryHtml)
	});
	function buildCategoryHtml($elem,data){
		var html = '';
		for(var i = 0;i<data.length;i++){
			html +='<dl class="category-details"><dt class="category-details-title fl"><a href="#" class="category-details-title-link">'+data[i].title+'</a></dt><dd class="category-details-item fl">'
			for(var j =0;j<data[i].items.length;j++){
				html += '<a href="#" class="link">'+data[i].items[j]+'</a>'
			}
			html +='</dd></dl>'
		}
		//模拟网络延时
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
			$elem.data('isLoaded',true);
		},1000);	
	}
	$categoryDropdown.dropdown({
		delay:200,
		js:true,
		mode:"fadeSlideLeftRight"
	});

})(jQuery)