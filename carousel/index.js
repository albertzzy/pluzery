// var $ = require('zepto');
var $ = require('jquery');
require('./carousel.less');


function epayCarousel(container,imgArr,linkArr,showDot,anim,animDelay){
	this.container = container;
	this.imgArr = imgArr || [];
	this.sliderNum = imgArr.length;
	this.sliderLen = this.sliderNum === 2?this.sliderNum+2:this.sliderNum;
	this.showDot = showDot===undefined? true:showDot;
	this.anim = anim === undefined? true:anim;
	this.animDelay = animDelay === undefined?2000:animDelay;
	this.linkArr = linkArr || [];

	this.timeid = null;
	this.endPos = 0;
	this.index = 1;
	// !!! attation on this fuck,don't forget to compat ipad
	this.cw  = 18.75*parseFloat($('html').css('font-size'));
}

epayCarousel.prototype.init = function(){
	var sliderNum = this.sliderNum,
	imgArr = this.imgArr,
	container = this.container,
	sliderLen = this.sliderLen,
	linkArr = this.linkArr,
	anim = this.anim,
	showDot = this.showDot;

	var left;

	if(!sliderNum){
		throw new Error('slider Array should not be empty.');
	}

	var htmlstr = '<ul class="epay-slider j-epay-slider" style="width:'+sliderLen*18.75+'rem">';

	if(sliderNum === 1){
		htmlstr+='<li class="epay-card j-epay-card" style="left:0"><a href="'+linkArr[0]+'" class="epay-slider-link"><img src="'+imgArr[0]+'" style="width:100%;height:100%;display:block;"/></a></li>';

	}else{
		for(var i=0;i<sliderLen;i++){
			if(i >= sliderLen-1){
				left = -18.75;
			}else{
				left = i*18.75;
			}
			if(sliderNum === 2 && i>=2){
				htmlstr+='<li class="epay-card j-epay-card" style="left:'+left+'rem"><a href="'+linkArr[i%2]+'" class="epay-slider-link"><img src="'+imgArr[i%2]+'" style="width:100%;height:100%;display:block;"/></a></li>';
			}else{
				htmlstr+='<li class="epay-card j-epay-card" style="left:'+left+'rem"><a href="'+linkArr[i]+'" class="epay-slider-link"><img src="'+imgArr[i]+'" style="width:100%;height:100%;display:block;"/></a></li>';
			}
		}
	}

	htmlstr += '</ul>';

	$(container).html(htmlstr);
	
	if(sliderNum === 1){
		return;
	}

	if(showDot){
		htmlstr += '<ul class="epay-slider-dot">';
		for(var j=0;j<sliderNum;j++){
			htmlstr += '<li class="epay-dot '+(j===0?'active':'')+' j-epay-dot"></li>';
		}
		htmlstr+='</ul>';
	}

	$(container).html(htmlstr);
	
	this.bindEvent();

	if(anim){
		this.doAnim();
	}

}

epayCarousel.prototype.bindEvent = function(){
	var initX,lenX;
	var index = this.index;

	var sliderNum = this.sliderNum,
	sliderLen = this.sliderLen,
	cw = this.cw;

	var threshold = cw/3;
	var self = this;

	$(document).on('touchstart','.j-epay-slider',function(e){
		clearTimeout(self.timeid);
		initX = e.originalEvent.changedTouches[0].clientX;
	});

	$(document).on('touchmove','.j-epay-slider',function(e){
		// !!!! attention on this
		e.preventDefault();
		var posX = e.originalEvent.changedTouches[0].clientX;
		lenX = posX - initX;

		// attention on the endpos,it gotta be the latest value
		$(this).css({
			'-webkit-transform':'translate3d('+(lenX+self.endPos)+'px,0,0)',
			'transform':'translate3d('+(lenX+self.endPos)+'px,0,0)',
			'-webkit-transition':'',
			'transition':''
		});		
	});

	$(document).on('touchend','.j-epay-slider',function(e){
		var endX = e.originalEvent.changedTouches[0].clientX;
		var endLen = Math.abs(endX - initX);

		if(endLen >= threshold){
			if(endX - initX<0){
				self.endPos -= cw;
				self.index++;

				$('.j-epay-card').eq(self.index%sliderLen).css('left',cw*self.index+'px');
			}else{
				self.endPos += cw;
				self.index--;

				$('.j-epay-card').eq((sliderLen-1+self.index%sliderLen)%sliderLen-1).css('left',cw*(self.index-2)+'px');
			}

			// dot active
			$('.j-epay-dot').removeClass('active');
			$('.j-epay-dot').eq((self.index-1)%sliderNum).addClass('active');
		}
		$(this).css({
			'-webkit-transform':'translate3d('+self.endPos+'px,0,0)',
			'transform':'translate3d('+self.endPos+'px,0,0)',
			'-webkit-transition':'all 500ms ease 0s',
			'transition':'all 500ms ease 0s'
		});
	});

	// tranistionend

	$(document).on('webkitTransitionEnd transitionend','.j-epay-slider',function(){
		clearTimeout(self.timeid);
		self.doAnim();
	});

}


epayCarousel.prototype.doAnim = function(){
	var animDelay = this.animDelay,
	sliderLen = this.sliderLen,
	endPos = this.endPos,
	cw = this.cw,
	sliderNum = this.sliderNum;

	var self = this;

	if(self.timeid){
		clearTimeout(self.timeid);
	}

	self.timeid = setInterval(function(){
		self.index ++;
		
		$('.j-epay-card').eq(self.index%sliderLen).css('left',cw*self.index+'px');

		$('.j-epay-dot').removeClass('active');
		$('.j-epay-dot').eq((self.index-1)%sliderNum).addClass('active');


		endPos -= cw;
		self.endPos = endPos;


		$('.j-epay-slider').css({
			'-webkit-transform':'translate3d('+endPos+'px,0,0)',
			'transform':'translate3d('+endPos+'px,0,0)',
			'-webkit-transition':'all 500ms ease 0s',
			'transition':'all 500ms ease 0s'
		});

	},animDelay);

}

module.exports = epayCarousel;
