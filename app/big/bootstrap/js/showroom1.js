var screenPort = sessionStorage.getItem('screenPort');
var baseUrl = 'http://' + screenPort;//ajax服务器地址
var socketUrl='ws://' + screenPort;//socket服务器地址
var marqueeMinutes=5;//滚动的每条公告在初次展示几分钟后消失
var marqueeScrollamount=50; //滚动速度每秒多少像素 (px/sec)
var marqueecircular=true;//是否无缝滚动
var flipTime=5;//默认翻页速度（可动态设置）
var pageSize=15;//默认每页多少条（可动态设置）
var stopPage=false;//初始状态是否不翻页（可设置）
var titlevalue="";//没有标题时的默认标题（可动态设置）
var operAfterBgColor="#98FB98";//术后的数据行背景色（可设置）
var operAfterColor="#ffffff";//术后的数据行文字颜色（可设置）
var titleId = "";

var Sys = (function(ua){ 
	var s = {}; 
	s.IE = ua.match(/msie ([\d.]+)/)?true:false; 
	s.Firefox = ua.match(/firefox\/([\d.]+)/)?true:false; 
	s.Chrome = ua.match(/chrome\/([\d.]+)/)?true:false; 
	s.IE6 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6))?true:false; 
	s.IE7 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7))?true:false; 
	s.IE8 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8))?true:false; 
	s.IE9 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 9))?true:false; 
	s.IE10 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 10))?true:false; 
	s.IE11 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 11))?true:false; 
	s.IE12 = (s.IE&&([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 12))?true:false; 
	return s; 
})(navigator.userAgent.toLowerCase());

//function $(Id){ 
//	return document.getElementById(Id); 
//}; 
 
function addListener(element,e,fn){ 
	element.addEventListener?element.addEventListener(e,fn,false):element.attachEvent("on" + e,fn); 
}; 
function removeListener(element,e,fn){ 
	element.removeEventListener?element.removeEventListener(e,fn,false):element.detachEvent("on" + e,fn); 
}; 

var Css = function(e,o){ 
	if(typeof o=="string") 
	{ 
		e.style.cssText=o; 
		return; 
	} 
	for(var i in o){ 
		e.style[i] = o[i]; 
	}
}; 

var getLastStyle=function(id,newcss){
		var oldstyle=document.getElementById(id).getAttribute("style");
		var newStyle="";
		if(!oldstyle){
			newStyle = newcss;
		}else{
			oldstyle=oldstyle.replace(/ /g,'');
			oldstyle=oldstyle.replace(/:/g,' ');
			oldstyle=oldstyle.replace('font-size','fontSize');
			oldstyle=oldstyle.replace('font-family','fontFamily');
			oldstyle=oldstyle.replace('font-weight','fontWeight');
			oldstyle=oldstyle.replace('background-color','backgroundColor');
			
			var newkey=newcss.split(' ')[0];
			if(oldstyle.indexOf(newkey)>-1){
				var oldArray = oldstyle.split(';');
				for(var i=0;i<oldArray.length;i++){
					if(oldArray[i].indexOf(newkey)>-1){
						oldArray[i] = newcss;
					}
				}
				newStyle = oldArray.join(';');
			}else{
				newStyle = oldstyle+newcss;;
			}
		}
			return newStyle;			
	};

var setCssByStr = function(cssstr,eventDom){
	if(!cssstr)return;
	var cssArray=cssstr.split(';');
	for(var i=0;i<cssArray.length;i++){
		var dateedit=cssArray[i];
	    var csskey=dateedit.split(' ')[0];
		var cssvalue=dateedit.split(' ')[1];
		if(csskey==="fontFamily" ){			
			var cssobj={"fontFamily":cssvalue};
			Css(eventDom,cssobj); 
		}else if( csskey==="fontSize"){
			var cssobj={"fontSize":cssvalue};
			Css(eventDom,cssobj); 
		}else if( csskey==="fontWeight"){
			var cssobj={"fontWeight":cssvalue};
			Css(eventDom,cssobj); 						
		}else if( csskey==="color"){
			var cssobj={"color":cssvalue};
			Css(eventDom,cssobj); 
		}else if( csskey==="backgroundColor"){
			var cssobj={"backgroundColor":cssvalue};
			Css(eventDom,cssobj); 
		}else if( csskey==="width"){
			var cssobj={"width":cssvalue};
			Css(eventDom,cssobj); 
		}
	}
}

var setFullscreen = function(){
		 var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
}

var setcancelFullScreen = function(){
	if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
}

var Bind = function(object, fun) { 
	var args = Array.prototype.slice.call(arguments).slice(2); 
	return function() { 
		return fun.apply(object, args); 
	}; 
}; 

var BindAsEventListener = function(object, fun) { 
	var args = Array.prototype.slice.call(arguments).slice(2); 
	return function(event) { 
		return fun.apply(object, [event || window.event].concat(args)); 
	}; 
}; 

var Extend = function(destination, source){ 
	for (var property in source) { 
		destination[property] = source[property]; 
	}; 
}; 

var Class = function(properties){ 
	var _class = function(){
		return (arguments[0] !== null && this.initialize && typeof(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
	}; 
	_class.prototype = properties; 
	return _class; 
}; 

var Table = new Class({ 
	initialize : function(tab){ 
		this.table = tab; 
		this.title = document.getElementById("divTitle");
		this.thead = tab.getElementsByTagName('thead')[0]; //常用的dom元素做成索引 
		this.theadtds = this.thead.getElementsByTagName('td'); // 
		this.rows = []; //里面tbodys记录所有tr的引用 这里用数组记录是因为数组有reverse方法,可以用来正序,反序 
		this.clos = {}; //里面记录所有列元素的引用 
		this.edits = {}; //编辑表格的规则和提示 
		this.sortCol = null; //记录哪列正在排序中 
		this.inputtd = null; //记录哪个input被编辑了 
		this.closarg ={ 
			tdnum : null, 
			totdnum : null, 
			closmove : BindAsEventListener(this,this.closmove), 
			closup : BindAsEventListener(this,this.closup) 
		};//关于列拖拽的一些属性方法 
		this.widtharg ={ 
			td : null, 
			nexttd : null, 
			x : 0, 
			tdwidth : 0, 
			nexttdwidth : 0, 
			widthmove : BindAsEventListener(this,this.widthmove), 
			widthup : BindAsEventListener(this,this.widthup) 
		}; //拖拽列宽的一些属性方法 
		var i=0,j=0,d=document,rows =tab.tBodies[0].rows,tds1 = tab.tBodies[0].getElementsByTagName('td'),edit=[]; 
		var divs = this.thead.getElementsByTagName('div'); 
		this.toolbar=document.getElementById("btn-toolbar");
		this.abtn = this.toolbar.getElementsByTagName('a'); 
		this.input = d.createElement('input'); //编辑用的input 
		this.input.type = "text"; 
		this.input.className = 'edit'; 
		this.img = d.body.appendChild(d.createElement('div')); 
		this.img.className ="cc" ; 
		this.line = d.body.appendChild(d.createElement('div')); 
		this.line.className = 'line'; 
		this.line.style.top = tab.offsetTop +"px"; 
		
		
		
		// for(var l=set.length;i<l;i++){ 
		// 	addListener(this.theadtds[set[i].id],'click',Bind(this,this.sortTable,this.theadtds[set[i].id],set[i].id,set[i].type)); 
		// 	set[i].edit&&(this.edits[set[i].id]={rule:set[i].edit.rule,message:set[i].edit.message}); 
		// }; 
		for(l=rows.length;j<l;j++) {
			this.rows[j]=rows[j]; 
			addListener(this.rows[j],'mousedown',BindAsEventListener(this,this.trmousedown)); 
		}
		for(var k=0,l=this.theadtds.length;k<l;k++){ 
			this.clos[k]=[]; 
			this.theadtds[k].setAttribute('clos',k) 
			addListener(this.theadtds[k],'mousedown',BindAsEventListener(this,this.closdrag)); 
		} 
		for(var n=0;n<this.abtn.length;n++){ 			
	 	    if(!!this.abtn[n].getAttribute('data-edit')){ 
				addListener(this.abtn[n],'click',BindAsEventListener(this,this.abtnclick)); 
			}
		} 
		// for(var i=0,l=tds1.length;i<l;i++){ 
		// 	var p = i<this.theadtds.length-1?i:i%this.theadtds.length; 
		// 	this.clos[p][this.clos[p].length] = tds1[i]; 
		// 	this.edits[p]&&tds1[i].setAttribute('edit',p); 
		// } 
		for(var i=0,l=divs.length;i<l;i++){ 
			addListener(divs[i],'mousedown',BindAsEventListener(this,this.widthdrag)); 
		} 
		
		/*---------------------------------------------*/ 
		/*---------------------------------------------*/ 
		addListener(this.thead,'mouseover',BindAsEventListener(this,this.theadhover)); 
		addListener(this.title,'mousedown',BindAsEventListener(this,this.titlemousedown)); 
		//addListener(tab.tBodies[0],'dblclick',BindAsEventListener(this,this.edit)); 
		//addListener(this.input,'blur',Bind(this,this.save,this.input)); 
		addListener(this.title,'dblclick',BindAsEventListener(this,this.edit)); 
		addListener(this.input,'blur',Bind(this,this.save,this.input)); 
		
		addListener(document,'click',BindAsEventListener(this,this.hidetoolbar)); 
		
		// data-edit
	}, 
	hidetoolbar : function(e){
		e = e || window.event; 
		var obj = e.srcElement ||e.target; 
		var pobj = obj.parentNode;
		var nname=obj.nodeName.toLowerCase() ;
		if(nname !='a' && nname !='li'  && nname !='i' && nname !='b' && nname !='label' && nname !='input') {
			Css(this.toolbar,{display:"none"});
		}
	},
	theadhover : function(e){ 
		e = e || window.event; 
		var obj = e.srcElement ||e.target; 
		if(obj.nodeName.toLowerCase() =='td') 
			this.closarg.totdnum = (obj).getAttribute('clos'); 
		else if(obj.nodeName.toLowerCase() =='div') 
			obj.style.cursor="col-resize"; 
	}, 
	widthdrag : function(e){ 
		if(Sys.IE){e.cancelBubble=true}else{e.stopPropagation()} 
		this.widtharg.x = e.clientX; 
		this.widtharg.td = (e.srcElement ||e.target).parentNode; 
		//if(Sys.IE){ 
		this.widtharg.nexttd = this.widtharg.td.nextSibling; 
		//}else{ 
		//this.widtharg.nexttd = this.widtharg.td.nextSibling.nextSibling; 
		//} 
		this.widtharg.tdwidth = this.widtharg.td.offsetWidth; 
		this.widtharg.nexttdwidth = this.widtharg.nexttd.offsetWidth; 
		this.line.style.height = this.table.offsetHeight +"px"; 
		addListener(document,'mousemove',this.widtharg.widthmove); 
		addListener(document,'mouseup',this.widtharg.widthup); 
	}, 
	widthmove : function(e){ 
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
		var x = e.clientX - this.widtharg.x,left = e.clientX,clientx=e.clientX ; 
		if(clientx<this.widtharg.x){ 
			if(this.widtharg.x - clientx>this.widtharg.tdwidth-35) 
			left = this.widtharg.x - this.widtharg.tdwidth+35; 
		} 
		if(clientx>this.widtharg.x) 
		{ 
			if(clientx - this.widtharg.x>this.widtharg.nexttdwidth-35) 
			left = this.widtharg.x + this.widtharg.nexttdwidth-35; 
		} 
		Css(this.line,{display:"block",left:left+"px"}); 
	}, 
	widthup : function(e){ 
		this.line.style.display = "none"; 
		var x= parseInt(this.line.style.left) - this.widtharg.x; 
		this.widtharg.nexttd.style.width = this.widtharg.nexttdwidth -x +'px'; 
		this.widtharg.td.style.width = this.widtharg.tdwidth + x +'px'; 
		removeListener(document,'mousemove',this.widtharg.widthmove); 
		removeListener(document,'mouseup',this.widtharg.widthup); 
		
		var data1={};
		data1.id=parseInt(this.widtharg.td.id.split('_')[1]);
		data1.style="width "+this.widtharg.td.style.width;
		var data2={};
		data2.id=parseInt(this.widtharg.nexttd.id.split('_')[1]);
		data2.style="width "+this.widtharg.nexttd.style.width;
		var dataArray=[data1,data2];
		
			$.ajax({ 
				   url:baseUrl+"/basedata/changeColumnSort", 
				   data:JSON.stringify(dataArray), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						//alert(res.resultMessage);
						location.reload(true);   
					}
				 }); 
	},
	trmousedown : function(e){ 
		e = e || window.event; 
		
		 if(e.button ==2){
            //点了右键弹出编辑框			
			Css(this.toolbar,{display:"block",left:e.clientX+9+"px",top:e.clientY+20+"px"}); 
		
			var obj = e.srcElement ||e.target; 
			var id="";
			if(obj.nodeName.toLowerCase() =='tr') {
				id=obj.id;
			}else if(obj.nodeName.toLowerCase() =='td'){
				id=obj.parentNode.id; 
			}
		
			this.toolbar.setAttribute('editby',id); 
			stopPage=true;
         }
	},
	titlemousedown : function(e){
		e = e || window.event; 
		 if(e.button ==2){
            //点了右键弹出编辑框			
			Css(this.toolbar,{display:"block",left:e.clientX+9+"px",top:e.clientY+20+"px"}); 		
			this.toolbar.setAttribute('editby',"divTitle"); 
			stopPage=true;
         }
	},
	abtnclick : function(e){
		var o = e.srcElement || e.target; 
		if(o.nodeName.toLowerCase() =='i'){
			o= o.parentNode;
		}
		var dateedit=o.getAttribute('data-edit');
	 	if(!dateedit)return; 
		
		var eventid =this.toolbar.getAttribute('editby');		
		var eventDom = document.getElementById(eventid);		
		var data={};
		data.id=titleId;
		var csskey=dateedit.split(' ')[0];
		var cssvalue=dateedit.split(' ')[1];
		if(csskey=="pagesize"){
			pageSize=parseInt(cssvalue);
			data.pageSize=cssvalue;
			$.ajax({ 
				   url:baseUrl+"/basedata/saveTitleStyle", 
				   data:JSON.stringify(data), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						//alert(res.resultMessage);
						location.reload(true);   
					}
				 }); 
		}else if(csskey=="pagetime"){
			flipTime=parseInt(cssvalue);
			data.flipTime=flipTime;
			$.ajax({ 
				   url:baseUrl+"/basedata/saveTitleStyle", 
				   data:JSON.stringify(data), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						//alert(res.resultMessage);
						location.reload(true);   
					}
				 }); 
		}else if(csskey=="fullscreen"){
			if(cssvalue==="1"){
					o.setAttribute('data-edit','fullScreen 0');
					setFullscreen();
					data.fullScreen="1";
				}else{
					o.setAttribute('data-edit','fullScreen 1');
					setcancelFullScreen();
					data.fullScreen="0";
				}	
				
			/*$.ajax({ 
				   url:baseUrl+"/basedata/saveTitleStyle", 
				   data:JSON.stringify(data), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						setFullscreen();
						
					}else{
						alert(res.resultMessage);
					}
				 }); */
		}else{
			if( csskey==="fontWeight"){			
				if(eventDom.style.fontWeight &&　eventDom.style.fontWeight==="bold"){
					cssvalue="normal";					
					o.setAttribute('data-edit','fontWeight bold');
				}else{
					cssvalue="bold";					
					o.setAttribute('data-edit','fontWeight normal');
				}						
			}
			dateedit=csskey+" "+cssvalue;			
			setCssByStr(dateedit,eventDom);
			
			if(eventid=="divTitle" || eventid=="tr0" ){
				
				
				if(eventid=="divTitle"){
					data.style=getLastStyle(eventid,dateedit);
				}else{
					data.columnStyle=getLastStyle(eventid,dateedit);
				}
				
				$.ajax({ 
				   url:baseUrl+"/basedata/saveTitleStyle", 
				   data:JSON.stringify(data), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						//alert(res.resultMessage);
						location.reload(true);   
					}
				 }); 
				
			}else{
				//修改内容行样式
				var data1={};
				data1.type="2";
				var rid=parseInt(eventid.split('_')[1]);
				if(pageSize>=rid){
					data1.rowNum= rid; 
				}else{
					data1.rowNum=rid%pageSize;
				}
				data1.style=getLastStyle(eventid,dateedit);
				$.ajax({ 
				   url:baseUrl+"/basedata/saveRowStyle", 
				   data:JSON.stringify(data1), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   error: function(){
						location.reload(true);  
					},
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						location.reload(true);   
						//alert(res.resultMessage);
					}
				 }); 
			}
		}
		
	},
	
	closdrag : function(e){ 
		e = e || window.event; 
		 if(e.button ==2){
            //点了右键弹出编辑框			
			Css(this.toolbar,{display:"block",left:e.clientX+9+"px",top:e.clientY+20+"px"}); 
			this.toolbar.setAttribute('editby',"tr0"); 
			stopPage=true;
         }else if(e.button ==0){
            //点下左键拖拽移动列
			var obj = e.srcElement ||e.target; 
			if(obj.nodeName.toLowerCase()=="span")obj =obj.parentNode; 
			this.closarg.tdnum = obj.getAttribute('clos');; 
			addListener(document,'mousemove',this.closarg.closmove); 
			addListener(document,'mouseup',this.closarg.closup); 
		}
	}, 
	closmove : function(e){ 
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
		Css(this.img,{display:"block",left:e.clientX+9+"px",top:e.clientY+20+"px"}); 
	}, 
	closup : function(){ 
		this.img.style.display = "none"; 
		removeListener(document,'mousemove',this.closarg.closmove); 
		removeListener(document,'mouseup',this.closarg.closup); 
		if(this.closarg.totdnum==this.closarg.tdnum)return; 
		var rows =this.table.getElementsByTagName('tr'),tds,n,o; 
		if((parseInt(this.closarg.tdnum)+1)==parseInt(this.closarg.totdnum)) 
		{ 
			o = this.closarg.tdnum; 
			n = this.closarg.totdnum; 
		} 
		else 
		{ 
			n = this.closarg.tdnum; 
			o = this.closarg.totdnum; 
		} 
		for(var i=0,l=rows.length;i<l;i++) 
		{ 
			tds = rows[i].getElementsByTagName('td'); 
			try{ 
			rows[i].insertBefore(tds[n],tds[o]); 
			} 
			catch(err){ 
			return; 
			} 
		} 
		for(var i=0,l=this.theadtds.length;i<l;i++) {
			this.theadtds[i].setAttribute('clos',i); 
		}
		
		//将结果保存到数据库
		
		var dataArray=[];
		
		var tr=document.getElementById('tr0');	
	var columnLength = tr.cells.length;
	//先删除
    for (var i = 0; i <columnLength; i++) {
       dataArray.push({id:tr.cells[i].id.split('_')[1],sort:i+1});
    }
		
			$.ajax({ 
				   url:baseUrl+"/basedata/changeColumnSort", 
				   data:JSON.stringify(dataArray), 
				   type:'post', 
				   dataType:'json', 
				   headers:{ 
					Accept:"application/json","Content-Type":"application/json"
				   }, 
				   processData:false, 
				   cache:false
				 }).done(function (data) { 
					if(data.resultCode=="1"){
						stopPage=false;
						location.reload(true);   
					}else{
						location.reload(true);   
					}
				 }); 
			
	}, 
	edit: function(e){ 
	 	var o = e.srcElement || e.target; 
	 	if(!o.getAttribute('edit'))return; 		
	 	this.inputtd = o; 
	 	var v = o.innerText || titlevalue; 
	 	o.innerHTML = ""; 
	 	o.appendChild(this.input); 
	 	this.input.value=v; 
	 	this.input.focus(); 
		stopPage=true;
	 }, 
	save : function(o){ 
	  	var edit={rule:/^([A-Z]|[a-z]|[ ]|[-]|[0-9]|[\u4e00-\u9fa5]){2,}$/i,message:"请输入2位以上的汉字,或者是字母"};
	 	if(edit.rule.test(this.input.value)){ 
	 		this.inputtd.innerHTML = this.input.value; 
	 		this.inputtd=null;  
			/*$.post(baseUrl+"/basedata/saveTitleStyle",{id:1,title:"'"+this.input.value+"'"},function(res){
				if(res.resultCode!="1"){
					alert(res.resultMessage);
				}
			});*/
			var data = {}; 
			data.id=titleId;
			data.title=this.input.value;
			
			$.ajax({ 
			   url:baseUrl+"/basedata/saveTitleStyle", 
			   data:JSON.stringify(data), 
			   type:'post', 
			   dataType:'json', 
			   headers:{ 
			 	Accept:"application/json","Content-Type":"application/json"
			   }, 
			   processData:false, 
			   cache:false
			 }).done(function (data) { 
			 	if(data.resultCode=="1"){
					stopPage=false;
					location.reload(true);   
				}else{
					location.reload(true);   
				}
		     }); 
			
			
	 	}else{ 
	 		alert(edit.message); 
	 	} 
	 },
	compare :function(n,type){ 
		return function (a1,a2){ 
			var convert ={ 
				int : function(v){return parseInt(v)}, 
				float : function(v){return parseFloat(v)}, 
				date : function(v){return v.toString()}, 
				string : function(v){return v.toString()} 
			}; 
			!convert[type]&&(convert[type]=function(v){return v.toString()}); 
			a1 =convert[type](a1.cells[n].innerHTML); 
			a2 =convert[type](a2.cells[n].innerHTML); 
			if(a1==a2)return 0; 
			return a1<a2?-1:1; 
		}; 
	} 
}); 

function addRow(res){ 
	var tbody1=document.getElementById("tbody1");
	//先删除全部
	for(var i=0;i<tbody1.rows.length;i++){
		tbody1.deleteRow(0);
	}
	
	var rowLength=res.resultList.length;
	var rowArray=[];
	var tdArray=[];
	flipTime = res.titleStyle[0].flipTime;
	pageSize = res.titleStyle[0].pageSize || 10;
	for(var i=0;i<rowLength;i++){
		rowArray[i] = tbody1.insertRow(i); 
		rowArray[i].id="r_"+(i+1);
		if(i<pageSize){
			rowArray[i].style.display="table-row";			
			for(var j=0;j<res.rowStyle.length;j++){
				if((i+1)==res.rowStyle[j].rowNum){
					//var trstyle=getLastStyle(eventid,dateedit);
					setCssByStr(res.rowStyle[j].style,rowArray[i]);
				}
			}		    
		}else{
			rowArray[i].style.display="none";
		}
		for(var j=0;j<res.columnStyle.length;j++){
			tdArray[j]=rowArray[i].insertCell(); 
			tdArray[j].innerHTML = res.resultList[i][res.columnStyle[j].column];
			tdArray[j].style.width="auto";
			tdArray[j].id="r_"+i+"-t_"+res.columnStyle[j].id
			if(res.columnStyle[j].displayState=="0"){
				tdArray[j].style.display="none";
			}
		}

		if(res.resultList[i].state==="术后"){
			setCssByStr("color "+operAfterColor+";backgroundColor "+operAfterBgColor,rowArray[i]);
		}
	}
	var pageCount =Math.ceil( rowLength/pageSize);
	var PageCurrent=1;
	document.getElementById("page_count").innerHTML="共"+pageCount+"页";
	
	document.getElementById("page_currentpage").innerHTML="第"+PageCurrent+"页";
	var showPage= function(){
		if(stopPage) return;
		PageCurrent++;
		if(pageCount>=PageCurrent){
			document.getElementById("page_currentpage").innerHTML="第"+PageCurrent+"页";
		}
		var currRow=PageCurrent*pageSize-pageSize;
		var endRow=PageCurrent*pageSize-1;
		var rownum=1;
		for(var i=0;i<rowLength;i++){
			if(i>=currRow && i<=endRow){
				rowArray[i].style.display="table-row";
				for(var j=0;j<res.rowStyle.length;j++){
					if(rownum==res.rowStyle[j].rowNum){
						setCssByStr(res.rowStyle[j].style,rowArray[i]);
					}
				}
				rownum++;
			}else{
				rowArray[i].style.display="none";
			}
			if(res.resultList[i].state==="术后"){
				setCssByStr("color "+operAfterColor+";backgroundColor "+operAfterBgColor,rowArray[i]);
			}
		}
	}
	
	for(var k=1;k<pageCount+1;k++){
		setTimeout(showPage,flipTime*1000*k);
	}
	if(pageCount>0){
		setTimeout(loadData,flipTime*1000*pageCount+1);
	}else{
		setTimeout(loadData,flipTime*1000);
	}
} 

var checkboxclick = function(e){
	e = e || window.event; 
	var obj = e.srcElement ||e.target; 		
	var check=document.getElementById(obj.id);
	if(check.checked){
		hiddenTd(obj.id,false);
	}else{
		hiddenTd(obj.id,true);
	}

	var data={};
	data.id=parseInt(obj.id.split('-')[1]);
	data.displayState=check.checked?"1":"0";
	$.ajax({
		url:baseUrl+"/basedata/saveColumnStyle",
		data:JSON.stringify(data),
		type:'post',
		dataType:'json',
		headers:{
			Accept:"application/json","Content-Type":"application/json"
		}, 
		processData:false, 
		cache:false
	}).done(function (data) {
		if(data.resultCode=="1"){
			stopPage=false;
			location.reload(true);
		}else{
			location.reload(true);
		}
	});
}

var hiddenTd=function(tid,ishidden){
	var display=ishidden?"none":"table-cell";
	var id=tid.replace('-','_');
	document.getElementById(id).style.display=display;
	var tbody1=document.getElementById("tbody1");	
	for(var i=0;i<tbody1.rows.length;i++){
		var td=document.getElementById('r_'+i+'-'+id);
		if(td){
			td.style.display=display;
		}
	}
}

function addTh(thdate,style){
	var thlen= thdate.length;
	var tr=document.getElementById('tr0');
	var ul=document.getElementById('hiddenCells');
	
	ul.innerHTML="";
	
	var columnLength = tr.cells.length;
	//先删除
    for (var i = 0; i <columnLength; i++) {
       tr.deleteCell(0);
    }
			
	setCssByStr(style,tr);
	var tdArray=[];
	for(var i=0;i<thlen;i++){
		tdArray[i]=tr.insertCell(); 
		tdArray[i].innerHTML='<span>'+thdate[i].columnName+'</span><div class="ww">&nbsp;</div>';
		
		var li=document.createElement("li");
	    var label=document.createElement("label");
		var checkbox = document.createElement('input');  
		checkbox.type = "checkbox"; 
		checkbox.id = 't-'+thdate[i].id;
		if(thdate[i].displayState=="1"){
			checkbox.checked="checked";
		}
		var newtext=document.createTextNode(thdate[i].columnName);		
		label.appendChild(checkbox);
		label.appendChild(newtext);
		li.appendChild(label);
		ul.appendChild(li);
		addListener(checkbox,'click',BindAsEventListener(this,this.checkboxclick)); 
		
		if(thdate[i].displayState=="0"){
			tdArray[i].style.display="none";
		}
		if(!!thdate[i].style){
			var css=thdate[i].style;
			if(css.split(' ')[0]=="width"){
				tdArray[i].style.width=css.split(' ')[1];
			}
		}else{
			tdArray[i].style.width=(document.documentElement.clientWidth-2)/thlen+"px";
		}
		tdArray[i].className="tc";
		tdArray[i].id="t_"+thdate[i].id;
		tdArray[i].setAttribute('clos',thdate[i].sort); 
	}	
	
}



var loadData = function(){
	if(stopPage) return;
	var surl = baseUrl+"/basedata/getOperateInfoByOutsideScreen";
	$.ajax({
		url: surl,
		type: 'POST',
		data:"",
		dataType: 'json',
		timeout: 5000,
		error: function(){
			 setTimeout(loadData,8000);
		},
		success: function(res){
			if(res.resultCode=="1"){
				//添加标题
				var divtitle=document.getElementById("divTitle");
				divtitle.innerHTML=res.titleStyle[0].title;
				titlevalue=res.titleStyle[0].title;
				titleId = res.titleStyle[0].id;

				setCssByStr(res.titleStyle[0].style,divtitle);
				var divhead=document.getElementById("divHead");
				setCssByStr(res.titleStyle[0].style,divhead);
				var time=document.getElementById("time");
				setCssByStr(res.titleStyle[0].style,time);
				var page_currentpage=document.getElementById("page_currentpage");
				setCssByStr(res.titleStyle[0].style,page_currentpage);
				var page_count=document.getElementById("page_count");
				setCssByStr(res.titleStyle[0].style,page_count);
				//绘制表格
				var tabel=document.getElementById("tab");
				if(res.resultList.length===0){
					return;
				}
				//添加表头
				addTh(res.columnStyle,res.titleStyle[0].columnStyle);
				//添加表格行
				addRow(res);
				//表格的事件等初始化
				new Table(tabel); 
			}else{
				console.log(res.resultMessage);
			}
		}
	});
}

var stoppageClick = function(){
	document.getElementById("stoppage").style.display="none";
	document.getElementById("playpage").style.display="block";
	stopPage=true;
	return false;
}
var playpageClick = function(){
	document.getElementById("stoppage").style.display="block";
	document.getElementById("playpage").style.display="none";
	stopPage=false;
	location.reload(true);   
}

var	startTime=function() {
	var today=new Date();
	var yyyy=today.getFullYear();
	var mm=today.getMonth()+1;
	var dd=today.getDate();
	
	var hh=today.getHours();
	var mi=today.getMinutes();
	var ss=today.getSeconds();
	// add a zero in front of numbers<10
	mm=checkTime(mm);
	dd=checkTime(dd);
	hh=checkTime(hh);
	mi=checkTime(mi);
	ss=checkTime(ss);
	document.getElementById('time').innerHTML=yyyy+"年"+mm+'月'+dd+'日 '+hh+":"+mi+":"+ss;
	setTimeout('startTime()',500);
}
	
function checkTime(i) {
	if (i<10) 
	{i="0" + i}
	return i
}

function isString(str) { 
	return (typeof str=='string')&&str.constructor==String; 
}

var delOldLi=function() {
	var ul = $('#ul_gonggao');
	var lis=ul.find("li");
	var nowMin = new Date().getMinutes();
	for(var i=0;i<lis.length;i++){
		var minutes= parseInt(0+$(lis[i]).attr("minutes"));
		if(nowMin < minutes){
			nowMin=nowMin+60;
		} 
		if(Math.abs(nowMin-minutes)>marqueeMinutes){
			 $(lis[i]).remove();
		}
	}
	setTimeout('delOldLi()',30000);
}

var socketData = function(){
    var socket;
    if(!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if(window.WebSocket) {
		console.log('开始连接websocket');
		socket = new WebSocket(socketUrl+"/websocket/msg1");
		socket.onmessage = function(event) {  
			console.log(event.data);             
			getMsgHtml(event.data); 
		};
		socket.onopen = function(event) {
			//if(socket.readyState == WebSocket.OPEN){
			setInterval( function(){keepalive(socket)}, 10000 );
			//}
		};
		socket.onclose = function(event) {
			//var ta = document.getElementById('responseText');
			// ta.value = ta.value + '\n' + "连接被关闭";
			console.log("连接被关闭");
			//location.reload(true);  
		};
	} else {
		console.log("浏览器不支持webSocket，无法收到通知。");
	}
     
	function getMsgHtml(msg) {
		delOldLi();
		var nowMin = new Date().getMinutes();
		if( msg.substr(0,1)!="{"){
			$('#ul_gonggao>div').prepend("<li minutes='"+nowMin+"'>"+msg+"</li>");
		}
	}
	function send(message) {
		if (!window.WebSocket) {
			return;
		}
		if (socket.readyState == WebSocket.OPEN) {
			socket.send(JSON.stringify(message));
			console.log("WebSocket发送msg成功");
		} else {
			//alert("连接没有开启.");
			console.log("连接没有开启");
		}
	}
	function keepalive(ws){
		if (!window.WebSocket) {
			return;
		}
		if (socket.readyState == WebSocket.OPEN) {
			socket.send(JSON.stringify({
			msgType: "hello_"+new Date().getTime()
			}));
			console.log("WebSocket发送成功");
		} else {
			console.log("WebSocket连接没有开启");
			//console.log('开始连接websocket');
			//socket = new WebSocket(socketUrl+"/websocket/msg1");
			//socketData();
			location.reload(true); 
		}
	}
	//检查连接
	function check(){
		socket.send({
		msgType : "init",
		regOptId : "201512041211460227"
		});
	}
	//关闭连接
	function closeConnection() {
		socket.close();
	}

	$("#div_gonggao").width(document.documentElement.clientWidth-2);          
	$('#ul_gonggao').liMarquee({scrollamount:marqueeScrollamount,circular: marqueecircular});
       
}

window.onload = function(){ 
	loadData();
	var stoppagebtn = document.getElementById("stoppage");
	var playpagebtn = document.getElementById("playpage");
	addListener(stoppagebtn,'click',BindAsEventListener(this,stoppageClick)); 
	addListener(playpagebtn,'click',BindAsEventListener(this,playpageClick)); 
	
    startTime();
	//去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
    	e.preventDefault();
    };
	socketData();
} 