# epay-pagerizer [![spm version](http://spmjs.io/badge/epay-pagerizer)](http://spmjs.io/package/epay-pagerizer)

---

a little pagination tool

## Install

```
$ spm install epay-pagerizer --save
```

## Usage

```js
var epayPagerizer = require('epay-pagerizer');
new epayPagerizer({
		prev:'&lt;',				//default,prev icon
		next:'&gt;',				//default,next icon
		totalShowNum:5,				//default,连续出现的数字个数
		paginationCon:'',			//default,分页容器
		activateFunc:function(){},	//default,分页回调
		async:true,					//default,是否异步
		totalPageNum:0				//default,总页数
	});
	
// use epayPagerizer
```
