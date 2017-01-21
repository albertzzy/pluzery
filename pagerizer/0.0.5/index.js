var $ = require('jquery');

var Pagerizer = function(options){
	var defaultConfig = {
		prev:'&lt;',
		next:'&gt;',
		totalShowNum:5,
		paginationCon:'',
		activateFunc:function(){},
		async:true,
		totalPageNum:0
	};

	options = $.extend({},defaultConfig,options);

	if(!options.totalPageNum||!options.paginationCon||$(options.paginationCon).length===0){
		throw new Error('invalid param.');
	}
	
	this.activeIndex = 1;
	this.prev = options.prev;
	this.next = options.next;
	this.totalShowNum = options.totalShowNum;
	this.paginationCon = options.paginationCon;
	this.activateFunc = options.activateFunc;
	this.async = options.async;
	this.totalPageNum = options.totalPageNum;
	
	if(!this.async){
		var searchIndex = window.location.search;
		if(searchIndex.indexOf('=')>=0){
			this.activeIndex = searchIndex.split('=')[1];
		}
	}

	this.prevLink = this.async? 'javascript:' : this.pagelink+'?page='+Math.max(this.activeIndex,1);
	this.nextLink = this.async? 'javascript:' : this.pagelink+'?page='+Math.min(this.activeIndex+1,this.totalPageNum);

	this.initialize();

};


Pagerizer.prototype.initialize = function(){
	var paginationStr = '<p class="pagination j-pagination"><a class="pagination-prev j-pagination-prev" href="'+this.prevLink+'" data-index="'+Math.max(this.activeIndex-1,1)+'">'+this.prev+'</a>';

	function genConstinousStr(initialIndex,totalShowNum,activeIndex,async,pagelink){

		for(var i=initialIndex,len=totalShowNum+initialIndex;i<len;i++){
			var hrefStr = async? 'javascript:' : pagelink+'?page='+(i+1);

			if(i === activeIndex-1){
				paginationStr += '<a href="'+hrefStr+'" data-index="'+(i+1)+'" class="pagination-active">'+(i+1)+'</a>';
			}else{
				paginationStr += '<a href="'+hrefStr+'" data-index="'+(i+1)+'">'+(i+1)+'</a>';
			}
		}
	}

	var linkStrStart = this.async?'javascript:':this.pagelink+'?page=1',
	linkStrEnd = this.async?'javascript:':this.pagelink+'?page='+this.totalPageNum;


	if(this.totalPageNum<this.totalShowNum+6){

		genConstinousStr(0,this.totalPageNum,this.activeIndex,this.async,this.pagelink);
	}else{

		if(this.activeIndex<this.totalShowNum){
			var initialIndex = 0;

			genConstinousStr(initialIndex,this.totalShowNum,this.activeIndex,this.async,this.pagelink);
			paginationStr += '...<a href="'+linkStrEnd+'" data-index="'+this.totalPageNum+'">'+this.totalPageNum+'</a>';

		}else if(this.activeIndex >= this.totalShowNum && this.activeIndex <=this.totalPageNum-this.totalShowNum){
			var initialIndex = Math.min(this.activeIndex-1,this.totalPageNum-2*this.totalShowNum);
			
			paginationStr += '<a href="'+linkStrStart+'" data-index="1">1</a>...';
			genConstinousStr(initialIndex,this.totalShowNum,this.activeIndex,this.async,this.pagelink);
			paginationStr += '...<a href="'+linkStrEnd+'" data-index="'+this.totalPageNum+'">'+this.totalPageNum+'</a>';

		}else if(this.activeIndex>this.totalPageNum-this.totalShowNum){
			var initialIndex = this.totalPageNum-this.totalShowNum;

			paginationStr += '<a href="'+linkStrStart+'" data-index="1">1</a>...';
			genConstinousStr(initialIndex,this.totalShowNum,this.activeIndex,this.async,this.pagelink);

		}
	}

	paginationStr += '<a class="pagination-next j-pagination-next" href="'+this.nextLink+'" data-index="'+Math.min(this.activeIndex+1,this.totalPageNum)+'">'+this.next+'</a></p>';
	$(this.paginationCon).html(paginationStr);

	this.bindEvent();

}

Pagerizer.prototype.bindEvent = function(){
	var self = this;
	if(self.async){
		$('.j-pagination').on('click','a',function(){
			var index = + $(this).data('index');
			self.activeIndex = index;

			self.initialize();
			self.activateFunc(index);
		});
	}

	if(self.prev && self.prev !== ''){
		$('.j-pagination-next').on('click',function(){
			self.activeIndex ++;
			if(self.activeIndex>=self.totalPageNum){
				return;
			}
			if(self.async){
				self.initialize();
			}else{
				window.location.href = self.pagelink+'?page='+self.activeIndex;
			}
			self.activateFunc(self.activeIndex);
		});
	}

	if(self.next && self.next !== ''){
		$('.j-pagination-prev').on('click',function(){
			self.activeIndex --;
			if(self.activeIndex<=1){
				return;
			}
			if(self.async){
				self.initialize();
			}else{
				window.location.href = self.pagelink+'?page='+self.activeIndex;
			}
			self.activateFunc(self.activeIndex);
		});
	}

}


module.exports = Pagerizer;
