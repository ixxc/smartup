Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
var editMode,editDirect,browserType;
var config={};
let devMode,
	extID;

if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){
	browserType="fx";
}else if(navigator.userAgent.toLowerCase().indexOf("edge")!=-1){
	browserType="msg";
}else{
	browserType="cr";
}
if(browserType!="cr"){
	chrome=browser;
}

extID=chrome.runtime.id;

var sue={
	cons:{
		fix_linux_value:false,
		fix_linux_timer:null,
		os:"win",
		drginbox:true
	},
	apps:{
		enable:false,
	},
	init:function(){
		!devMode && (console.log = () => {});

		sue.initHandle();
		sue.uistyle={};
		sue.uistyle.mges=[];
		var _uimges=["direct","tip","note"];
		for(var i=0;i<_uimges.length;i++){
			if(config.mges.ui[_uimges[i]].enable){
				sue.uistyle.mges.push(config.mges.ui[_uimges[i]].style);
			}else{
				sue.uistyle.mges.push("none");
			}
		}
	},
	initHandle:function(){
		if(config.general.fnswitch.fnmges){
			console.log("initHandle")
			document.addEventListener("mousedown",this.handleEvent,false);
			document.addEventListener("mouseup",this.handleEvent,false);
			document.addEventListener("mousemove",this.handleEvent,false);
			document.addEventListener("mouseover",this.handleEvent,false);
			document.addEventListener("contextmenu",this.handleEvent,false);
		}
		if(config.general.fnswitch.fndrg){
			window.addEventListener("dragstart",this.handleEvent,false);
			window.addEventListener("drag", this.handleEvent,false);
			window.addEventListener("dragover",this.handleEvent,false);
			window.addEventListener("dragend",this.handleEvent,false);
		}
	},
	initHandle2:function(){
		sue.document.addEventListener("mousemove",this.handleEvent,false);
		sue.document.addEventListener("mouseover",this.handleEvent,false);
		sue.document.addEventListener("contextmenu",this.handleEvent,false);
	},
	handleEvent:function(e){
		switch(e.type){
			case"wheel":
				break;
			case"click":
				if(sue.inDrg&&config.drg.settings.clickcancel){console.log("cancel");sue.break=true;sue.stopMges(e);}
				break;
			case"mousedown":
				if(config.general.fnswitch.fnmges
					&&e.buttons==config.mges.settings.model
					&&!e[config.mges.settings.holdkey+"Key"]){
						sue.lineDrawReady(e,"mges");
				}
				break;
			case"mouseup":
				if((e.button==1&&config.mges.settings.model==4)
					||(e.button==2&&e.button==config.mges.settings.model&&(config.general.linux.cancelmenu&&sue.cons.os!="win"))){
					if(sue._dirArray&&sue.drawing){
						sue.stopMges(e);
					}
					sue.clearUI();
					sue.drawing=false;
					sue._lastX=e.clientX;
					sue._lastY=e.clientY;
				}
				break;
			case"contextmenu":
				if(config.general.linux.cancelmenu
					&&sue.cons.os!="win"){
						//fix mges
						if(config.general.fnswitch.fnmges&&!sue.cons.fix_linux_value&&config.mges.settings.model==2){
							e.preventDefault();
						}

						sue.cons.fix_linux_value=true;
						window.clearTimeout(sue.cons.fix_linux_timer);
						sue.cons.fix_linux_timer=window.setTimeout(function(){sue.cons.fix_linux_value=false;},500)
						break;
				}else{//all for win
					if(sue._dirArray&&sue.drawing){
						sue.stopMges(e);
					}
					if(sue.drawing&&config.mges.settings.model==2){
						//e.preventDefault();
						sue.clearUI();
						sue.drawing=false;
						sue._lastX=e.clientX;
						sue._lastY=e.clientY;					
					}
					//e.preventDefault();
				}
				//none popup menu by timeout
				if(config.general.settings.timeout_nomenu&&sue.timeout_nomenu){
					sue.timeout_nomenu=false;
					e.preventDefault();
				}
				// fix context menu selected elements
				sue.selEle={};
				sue.selEle.txt=window.getSelection().toString();
				sue.selEle.lnk=document.activeElement.href;
				sue.selEle.img=document.activeElement.src;
				sue.selEle.str=document.activeElement.text;
				// sue.startEle=e.target;
				
				break;
			case"mousemove":
				if(sue.drawing&&e.buttons==config.mges.settings.model){
					sue.lineDraw(e);
				}
				break;
			case"dragstart":
				if(config.general.fnswitch.fndrg&&!e[config.drg.settings.holdkey+"Key"]){
					sue.lineDrawReady(e,"drg");
					
					sue.inDrg=true;
				}
				break;
			case"dragover":
				if(sue.drawing){
					sue.lineDraw(e,sue.drawType[0]);
					if(sue.drawType[0]=="drg"&&config[sue.drawType[0]].ui.tip.type=="follow"){
						sue.uiPos(e);
					}
					if(config[sue.drawType[0]].settings.drgcursor){
						e.dataTransfer.effectAllowed="move"
						e.dataTransfer.dropEffect="move";
						e.preventDefault();						
					}
					//drag to text box, cancel
					if(!sue.cons.drginbox&&config[sue.drawType[0]].settings.drgtobox&&e.target&&e.target.type&&(e.target.type=="textarea"||e.target.type=="text")){
						sue.break=true;
						sue.stopMges(e);
					}
				}
				break;
			case"dragend":
				if(sue._dirArray&&sue.drawing){
					sue.stopMges(e);
				}
				sue.drawing=false;
				sue._lastX=e.clientX;
				sue._lastY=e.clientY;
				sue.inDrg=false;
				break;
		}
	},
	domCreate:function(edom,eele,einner,ecss,edata,etxt){
		var dom=document.createElement(edom);
		if(eele){
			for (var i = 0;i<eele.setName.length; i++) {
				if(eele.setName[i]=="for"){
					dom.setAttribute(eele.setName[i],eele.setValue[i]);
				}else if(eele.setName[i]=="checked"){
					eele.setValue[i]?dom.setAttribute(eele.setName[i],"checked"):null;
				}else{
					dom[eele.setName[i]]=eele.setValue[i];
				}
			}
		}
		if(einner){}
		if(ecss){
			dom.style.cssText+=ecss;
		}
		if(edata){
			for (var i = 0;i<edata.setName.length; i++) {
				dom.dataset[edata.setName[i]]=edata.setValue[i];
			}
		}
		if(etxt){
			dom.innerText=etxt;
		}
		return dom;
	},
	regURL:function(txt){
		var reg=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i; 
		return reg.test(txt.trim());
	},
	lineDrawReady:function(e,type){
		console.log("lineDrawReady");
		console.log(e.target)
		//disable drag ,when draggable=true
		if(config[type].settings.draggable&&e.target.getAttribute&&(e.target.getAttribute("draggable")=="true")){return;}
		sue._lastX=e.clientX;
		sue._lastY=e.clientY;
		sue._startX=e.clientX;
		sue._startY=e.clientY;
		sue._dirArray="";
		sue.drawing=true;
		sue.cons.drginbox=false;//drag to box

		//timeout
		if(config.general.settings.timeout){
			if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
			sue.timeout=window.setTimeout(function(){
				sue.break=true;
				sue.clearUI();
			},config.general.settings.timeoutvalue)
		}

		sue.selEle={};
		if(type=="drg"){
			switch(e.target.nodeType){
				case 3:
					sue.drawType=[type,"t"+type];
					break;
				case 1:
					if(e.target.src){
						sue.drawType=[type,"i"+type];
						sue.selEle.img=e.target.src;
					}else if(e.target.href){
						if(config[type].settings.drgimg&&e.target.firstElementChild&&e.target.firstElementChild.nodeType==1&&e.target.firstElementChild.src){
							sue.drawType=[type,"i"+type];
							sue.selEle.img=e.target.firstElementChild.src;
						}else{
							sue.drawType=[type,"l"+type];
						}
					}else{
						sue.drawType=[type,"t"+type];
					}
					break;
			}
			//enable drag in text box
			if(!config[type].settings.drgbox){
				if(e.button==0&&e.target.tagName&&((e.target.tagName.toLowerCase()=="input"&&e.target.type=="text")||e.target.tagName.toLowerCase()=="textarea")){
					sue.drawing=false;
				}
			}else{
				if(e.button==0&&e.target.tagName&&((e.target.tagName.toLowerCase()=="input"&&e.target.type=="text")||e.target.tagName.toLowerCase()=="textarea")){
					sue.cons.drginbox=true;
				}
			}
		}else if(type=="mges"){
			sue.drawType=["mges","actions"];
		}

		//sue.selEle={};
		sue.selEle.txt=window.getSelection().toString();
		// fix firefox get selection frome textbox
		if(browserType=="fx"){
			if(e.target&&e.target.tagName&&(e.target.tagName.toLowerCase()=="textarea"||(e.target.tagName.toLowerCase()=="input"&&e.target.type.toLowerCase()=="text"))){
				sue.selEle.txt=e.target.value.substring(e.target.selectionStart,e.target.selectionEnd);
			}
		}
		console.log(e.target);
		sue.selEle.lnk=e.href||e.target.href;
		sue.selEle.img=sue.selEle.img?sue.selEle.img:e.target.src;
		sue.selEle.str=e.target.innerText;
		sue.startEle=e.target;

		// get link obj
		const link = e?.target?.closest?.('a');
		link && (sue.selEle.objLnk = {href: link.href, innerText: link.innerText});

		//txt to url for mges
		if(type=="mges"&&config.mges.settings.txttourl&&sue.regURL(sue.selEle.txt)){
			sue.selEle.lnk=sue.selEle.txt;
		}

		//txt to url for drag
		if(type!="mges"&&(config.general.fnswitch.fndrg&&config.drg.settings.drgurl)){
			if(sue.regURL(sue.selEle.txt)){
				sue.drawType=[type,"l"+type];
				sue.selEle.lnk=sue.selEle.txt;
			}
		}

		var ele=e.target;
		var getParent=function(win){
			console.log(win);
			if(win.parent&&win.parent!=win){
				return arguments.callee(win.parent);
			}else{
				return win
			}
		}
		sue.window=window;
		sue.document=document.documentElement;
		sue.initHandle2();

		//drag fn switch
		if(sue.drawType[1]==("t"+type)&&!config[type].settings.txt){
			sue.drawing=false;
		}
		if(sue.drawType[1]==("l"+type)&&!config[type].settings.lnk){
			sue.drawing=false;
		}
		if(sue.drawType[1]==("i"+type)&&!config[type].settings.img){
			sue.drawing=false;
		}

		//sue.clearUI();
		var _uiarray=["direct","tip","note","allaction"];
		var _uiset=[];
		for(var i=0;i<_uiarray.length;i++){
			if(config[sue.drawType[0]].ui&&config[sue.drawType[0]].ui[_uiarray[i]].enable){
				sue.UI(config[sue.drawType[0]].ui[_uiarray[i]].style);
			}
		}
		return
	},
	lineDraw:function(e,type){
		var x=e.clientX;
		var y=e.clientY;
		var dx=Math.abs(x-sue._lastX);
		var dy=Math.abs(y-sue._lastY);
		var dz=Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if(dz<1){return}
		sue.uiPos(e);
		(config[sue.drawType[0]].ui.line.enable||editMode)?sue.ui_line(e):null;
		if(dx<config.general.settings.minlength
			&&dy<config.general.settings.minlength){
			return;
		}

		var dir;
			dir=dx>dy?(x<sue._lastX?"L":"R"):(y<sue._lastY?"U":"D");

		var lastDir=sue._dirArray.substr(sue._dirArray.length-1,1);
		if(dir!=lastDir){
			sue._dirArray+=dir;
			//show direct
			config[sue.drawType[0]].ui.direct.enable?sue.ui_direct(e):null;
			//get tip
			(config[sue.drawType[0]].ui.tip.enable||config[sue.drawType[0]].ui.note.enable)?sue.sendDir(sue._dirArray,"gettip",e):null;
		}
		//timeout
		if(config.general.settings.timeout){
			if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
			sue.timeout=window.setTimeout(function(){
				sue.break=true;
				sue.clearUI();
				sue.timeout_nomenu=true;
			},config.general.settings.timeoutvalue)
		}
		sue._lastX=e.clientX;
		sue._lastY=e.clientY;
	},
	UI:function(style){
		console.log(style)
		var domui=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+style+"]");
		if(!domui){
			domui=document.createElement("div");
			domui.dataset.suui="uibox";
			domui.dataset.sustyle=style;
			domui.style.cssText+=
				"position:fixed;text-align:right;"
				+"z-index:"+parseInt((new Date())/1000);
			let objStyle={
				"leftbottom":"left:0;bottom:0px;",
				"lefttop":"left:0;top:0px;",
				"righttop":"right:0;top:0px;",
				"hover":"right:0px;bottom:0;",
				"top":"top:0;",
				"ui_bottom":"bottom:0"
			}
			domui.style.cssText+=objStyle[style];
			sue.document.appendChild(domui)
		}
	},
	ui_line:function(e){
		if(!sue.document.querySelector("div[data-suui=line]")){
			var svgdiv=this.svgdiv= document.createElement("div");
				svgdiv.dataset.suui="line";
				svgdiv.style.cssText+="position:fixed;left:0;top:0;display:block;background:transparent;border:none;"+
					"width:"+sue.window.innerWidth+"px;"+
					"height:"+sue.window.innerHeight+"px;"+
					"z-index:"+parseInt((new Date().getTime())/1000);
			var SVG = 'http://www.w3.org/2000/svg';
			var svgtag= sue.svgtag= document.createElementNS(SVG, "svg");
				svgtag.style.cssText+="width:"+sue.window.innerWidth+"px;"+"height:"+sue.window.innerHeight+"px;";
			var polyline = document.createElementNS(SVG, 'polyline');
				polyline.style.stroke=config[sue.drawType[0]].ui.line.color;
				polyline.style.strokeOpacity=config[sue.drawType[0]].ui.line.opacity/100;
				polyline.style.strokeWidth=config[sue.drawType[0]].ui.line.width;
				polyline.style.fill="none";
				this.polyline = polyline;
				
			svgtag.appendChild(polyline);
			svgdiv.appendChild(svgtag);
			sue.document.appendChild(svgdiv);
		}
		e=e.targetTouches?e.targetTouches[0]:e;
		this.startX = e.clientX;
		this.startY = e.clientY;
		if(sue.svgtag){
			var p =sue.svgtag.createSVGPoint();
			p.x = this.startX;
			p.y = this.startY;
			this.polyline.points.appendItem(p);
		}else{
			return
		}
	},
	ui_direct:function(e){
		if(!config[sue.drawType[0]].ui.direct.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.direct.style+"]");
		var ui_dir=uidom.querySelector("div[data-suui=dir]");
		if(ui_dir){
			var _img=document.createElement("img");
				_img.src=chrome.runtime.getURL("")+"image/"+"direct.png";
				_img.style.cssText+="float:left;"
					+"height:"+config[sue.drawType[0]].ui.direct.width+"px;"
					+"transform:rotate(+"+sue.directimg(sue._dirArray[sue._dirArray.length-1])+");";
			ui_dir.appendChild(_img);
		}else{
			ui_dir=document.createElement("div");
			ui_dir.dataset.suui="dir";
			ui_dir.style.cssText+=
				"display:inline-block;text-align:center;border-radius:2px;padding:0 5px;"+
				"background-color:"+config[sue.drawType[0]].ui.direct.color+" !important;"+
				"opacity:"+config[sue.drawType[0]].ui.direct.opacity/100;
			ui_dir.appendChild(sue.domDir2(sue._dirArray[sue._dirArray.length-1]));
			uidom.appendChild(ui_dir);

			var _br=document.createElement("br");
				_br.style.cssText+="/*display:none;*/";
			uidom.appendChild(_br);
		}
	},
	ui_tip:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.tip.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.tip.style+"]");
		if(!uidom){return}
		var _dom=uidom?uidom.querySelector("div[data-suui=tip]"):null;
		if(!_dom){
			var _dom=document.createElement("div");
				_dom.dataset.suui="tip";
				_dom.style.cssText+="display:inline-block;padding:2px 5px 2px 5px;border-radius: 3px;font-family: arial,sans-serif !important;"
					+"background-color:"+config[sue.drawType[0]].ui.tip.bgcolor+";"
					+"color:"+config[sue.drawType[0]].ui.tip.color+";"
					+"font-size:"+config[sue.drawType[0]].ui.tip.width+"px;"
					+"opacity:"+config[sue.drawType[0]].ui.tip.opacity/100+";"
			uidom.appendChild(_dom);
			var _br=document.createElement("br");
				_br.style.cssText+="/*display:none;*/";
			uidom.appendChild(_br);
		}
		_dom.textContent="";
		if(confOBJ.tip){
			if(config[sue.drawType[0]].ui.tip.withdir){
				var _dir="";
				for(var i=0;i<sue._dirArray.length;i++){
					var _dir=sue.domCreate("img",{setName:["src"],setValue:[chrome.runtime.getURL("")+"image/direct.png"]},null,"vertical-align: text-top;transform:rotate(+"+sue.directimg(sue._dirArray[i])+");height: "+config[sue.drawType[0]].ui.tip.width+"px;");
					_dom.appendChild(_dir);
				}
			}
			var _spanTip=sue.domCreate("span",null,null,null,null,confOBJ.tip);
			_dom.appendChild(_spanTip);
			_dom.style.cssText+="display:inline-block;";
		}else{
			_dom.style.cssText+="display:none;";
		}
	},
	ui_note:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.note.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.note.style+"]");
		var _dom=uidom.querySelector("div[data-suui=note]");
		if(!_dom){
		    _dom=document.createElement("div");
			_dom.dataset.suui="note";
			_dom.style.cssText+="font-family: arial,sans-serif !important;font-style: italic;/*position:fixed;*/"+
			"color:"+config[sue.drawType[0]].ui.note.color+";"+
			"font-size:"+config[sue.drawType[0]].ui.note.width+"px;"+
			"opacity:"+config[sue.drawType[0]].ui.note.opacity/100+";"
			uidom.appendChild(_dom);
			var _br=document.createElement("br");
			uidom.appendChild(_br);
		}
		if(confOBJ.note&&confOBJ.note.type&&confOBJ.note.value){
			_dom.style.cssText+="display:inline-block;";
			_dom.innerText=confOBJ.note.value;
		}else{
			_dom.style.cssText+="display:none;";
			_dom.innerText="";
			return;
		}
	},
	ui_allaction:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.allaction.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.allaction.style+"]");
			
		var _dom=uidom.querySelector("div[data-suui=allaction]");
		if(!_dom){
		    _dom=document.createElement("div");
			_dom.dataset.suui="allaction";
			_dom.style.cssText+="font-family: arial,sans-serif !important;text-align:left;padding: 5px 20px;border-radius: 2px;"
				+"color:"+config[sue.drawType[0]].ui.allaction.color+";"
				+"background-color:"+config[sue.drawType[0]].ui.allaction.bgcolor+";"
				+"font-size:"+config[sue.drawType[0]].ui.allaction.width+"px;"
				+"opacity:"+config[sue.drawType[0]].ui.allaction.opacity/100+";"
			uidom.appendChild(_dom);
		}
		_dom.textContent="";
		if(confOBJ.allaction&&confOBJ.allaction.length>0){
			for(var i=0;i<confOBJ.allaction.length;i++){
				var _allAction=sue.domCreate("div");
				for(var ii=0;ii<confOBJ.allaction[i].direct.length;ii++){
					var _img=sue.domCreate("img",{setName:["src"],setValue:[chrome.runtime.getURL("")+"image/direct.png"]},null,"vertical-align: text-top;height:"+config[sue.drawType[0]].ui.allaction.width+"px;transform:rotate("+sue.directimg(confOBJ.allaction[i].direct[ii])+");");
					_allAction.appendChild(_img);
				}
				_allAction.appendChild(sue.domCreate("span",null,null,null,null,"  "+confOBJ.allaction[i].tip));
				_dom.appendChild(_allAction);
			}
			_dom.style.cssText+="display:inline-block;";
		}else{
			_dom.style.cssText+="display:none;";
		}
	},
	directimg:function(direct){
		var myDeg={L:"0deg",U:"90deg",R:"180deg",D:"270deg"};
		return myDeg[direct];
	},
	domDir2:function(img){
		var domimg=document.createElement("img");
			domimg.src=chrome.runtime.getURL("")+"image/"+"direct.png";
			domimg.style.cssText+="float:left;"
				+"height:"+config[sue.drawType[0]].ui.direct.width+"px;"
				+"vertical-align: text-top;"
				+"transform:rotate(+"+sue.directimg(img)+");";
		return domimg;
	},
	domDir:function(value){
		if(config[sue.drawType[0]].ui.tip.withdir){
			var domdir="";
			for(var i=0;i<sue._dirArray.length;i++){
				domdir+="<img src='"+chrome.runtime.getURL("")+"image/"+"direct.png"+"' style='/*float:left;display:block;margin-top:5px;*/"
					+"vertical-align: text-top;"
					+"transform:rotate(+"+sue.directimg(sue._dirArray[i])+");"
					+"height: "+config[sue.drawType[0]].ui.tip.width+"px;"
					+"'>"
			}
			return domdir;		
		}else{
			return "";
		}
	},
	uiPos:function(e){
		let domUIs=sue.document.querySelectorAll("div[data-suui=uibox]"),
			i=0,domWidth,domHeight;
		e=e.targetTouches?e.targetTouches[0]:e;
		for(i=0;i<domUIs.length;i++){
			if(["center","top","ui_bottom","left","right"].contains(domUIs[i].dataset.sustyle)){
				domWidth=window.getComputedStyle(domUIs[i]).width;
				domWidth=domWidth.substr(0,domWidth.length-2);
				domWidth=(window.innerWidth-domWidth)/2;
				domHeight=window.getComputedStyle(domUIs[i]).height;
				domHeight=domHeight.substr(0,domHeight.length-2);
				domHeight=(window.innerHeight-domHeight)/2;
			}
			switch(domUIs[i].dataset.sustyle){
				case"follow":
					domUIs[i].style.cssText+="left:"+(e.clientX+10)+"px;"
						+"top:"+(e.clientY+30)+"px"
					break;
				case"center":
					console.log("center")
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"top:"+domHeight+"px;";
					break;
				case"top":
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"top:0";
					break;
				case"ui_bottom":
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"bottom:-1px;";
					break;
				case"left":
					domUIs[i].style.cssText+="left:0px;"
						+"top:"+domHeight+"px;";
					break;
				case"right":
					domUIs[i].style.cssText+="right:0px;"
						+"top:"+domHeight+"px;";
					break;
			}
		}
	},
	clearUI:function(){
		if(!sue.document){return;}
		sue.document.querySelector("div[data-suui=line]")?sue.document.querySelector("div[data-suui=line]").remove():null;
		var doms=sue.document.querySelectorAll("div[data-suui=uibox]");
		for(var i=0;i<doms.length;i++){
			if(doms[i]){doms[i].remove()}
		}
		sue.drawing=false;
	},
	stopMges:function(e){
		console.log("stop")
		if(sue.break){
			sue.clearUI();
			sue.break=false;
			return;
		}
		sue.clearUI();
		if(editMode){
			editDirect=sue._dirArray;
			var getele=function(ele){
				if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
					return ele;
				}else{
					return getele(ele.parentNode);
				}
			}
			var boxOBJ=getele(document.querySelector(".su_app_test"));
			boxOBJ.querySelector(".testbox").innerText=sue._dirArray;
		}else{
			sue.sendDir(sue._dirArray,"action",e);
		}
		
		if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
		e.preventDefault();
		sue._dirArray="";
		sue.drawing=false;
	},
	sendDir:function(dir,dirType,e){
		var returnValue;
		chrome.runtime.sendMessage(extID,{type:dirType,direct:dir,drawType:sue.drawType,selEle:sue.selEle},function(response){
  			returnValue=response;
  			sue.getedConf=returnValue;
  			if(!response){return false;}
  			switch(response.type){
  				case"tip":
  					sue.ui_tip(response,e);
  					sue.ui_note(response,e);
  					sue.ui_allaction(response,e);
  					sue.uiPos(e);
  					break;
  				case"action":
  					break;
  			}
		});
	}
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	console.log(message)
	if(message.type=="set_confirm"){
		if(confirm(chrome.i18n.getMessage("tip_closemulticonfirm"))){
			sendResponse({type:message.type,message:true});
		}
	}
	if(message.type=="status"){
		sendResponse({type:message.type,message:true})
	}
	if(message.type=="setapptype"){
		sue.appType[message.apptype]=true;
		sendResponse({});
	}
});
chrome.runtime.sendMessage(extID,{type:"evt_getconf"},function(response){
	if(response){
		config=response.config;
		devMode=response.devMode;
		sue.cons.os=response.os;
		sue.init();
	}
});
