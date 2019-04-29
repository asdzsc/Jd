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
		//加载图片
		function loadIamge(imgUrl,success,error){
			var image = new Image()
			image.onload = function(){
				typeof success == 'function' && success(imgUrl)
			}
			image.onerror = function(){
				typeof error == 'function' && error(imgUrl)
			}
			setTimeout(function(){
				image.src = imgUrl
			},500)
			
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
		var $categoryDropdown = $('.category .dropdown') ;
		$categoryDropdown.dropdown({
			delay:200,
			js:true,
			mode:"fadeSlideLeftRight"
		});
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
		//轮播图图片懒加载
		function carouselLazyLoad($elem){
			$elem.item = {};//{0:'loaded',1:'loaded'}
			$elem.totalItemNum = $elem.find('.carousel-img').length;
			$elem.totalLoadedItemNum = 0;
			$elem.loadFn = null;
			//1.开始加载
			$elem.on('carousel-show',$elem.loadFn = function(ev,index,elem){
				console.log('carousel-show trigger....');
				if($elem.item[index] != 'loaded'){
					$elem.trigger('carousel-load',[index,elem])
				}
			});
			//2.执行加载
			$elem.on('carousel-load',function(ev,index,elem){
				console.log('will load img::',index);
				var $imgs = $(elem).find('.carousel-img');
				$imgs.each(function(){
					var $img = $(this);
					var imgUrl = $img.data('src');
					loadIamge(imgUrl,function(imgUrl){
						$img.attr('src',imgUrl);
					},function(imgUrl){
						$img.attr('src','img/fail.jpg');
					});
					$elem.item[index] = 'loaded';
					$elem.totalLoadedItemNum++;
					if($elem.totalItemNum == $elem.totalLoadedItemNum){
						$elem.trigger('carousel-loaded');
					}
				});

			});
			//3.加载结束
			$elem.on('carousel-loaded',function(){
				$elem.off('carousel-show',$elem.loadFn);
			});			
		}
		//轮播图加载
		//1.开始加载
		var $focusCarousel = $('.focus .carousel-wrap')
		carouselLazyLoad($focusCarousel)
		$focusCarousel.carousel({})
		//今日热销轮播图
		var $todayCarousel = $('.today .carousel-wrap')
		carouselLazyLoad($todayCarousel)
		$todayCarousel.carousel({})
		//楼层
		function floorLazyLoad($elem){
			$elem.item = {};//{0:'loaded',1:'loaded'}
			$elem.totalItemNum = $elem.find('.floor-img').length;
			$elem.totalLoadedItemNum = 0;
			$elem.loadFn = null;
			//1.开始加载
			$elem.on('tab-show',$elem.loadFn = function(ev,index,elem){
				console.log('tab-show trigger....');
				if($elem.item[index] != 'loaded'){
					$elem.trigger('tab-load',[index,elem])
				}
			});
			//2.执行加载
			$elem.on('tab-load',function(ev,index,elem){
				console.log('will load floor img::',index);
				var $imgs = $(elem).find('.floor-img');
				$imgs.each(function(){
					var $img = $(this);
					var imgUrl = $img.data('src');
					loadIamge(imgUrl,function(imgUrl){
						$img.attr('src',imgUrl);
					},function(imgUrl){
						$img.attr('src','img/fail.jpg');
					});
					$elem.item[index] = 'loaded';
					$elem.totalLoadedItemNum++;
					if($elem.totalItemNum == $elem.totalLoadedItemNum){
						$elem.trigger('tab-loaded');
					}
				});

			});
			//3.加载结束
			$elem.on('tab-loaded',function(){
				$elem.off('tab-show',$elem.loadFn);
			});			
		}
		var $floor = $('.floor')
			$floor.each(function(){
				floorLazyLoad($(this))
			})
		$floor.tab({})
		/*
		var $floor = $('.floor')
		$floor.on('tab-show',function(ev,index,elem){
			console.log(index,elem)
		})
		*/
		
})(jQuery)