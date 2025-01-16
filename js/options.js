Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
var config,
	defaultConf,
	browserType;

//check browser
if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){
	browserType="fx";
}else if(navigator.userAgent.toLowerCase().indexOf("edg")!=-1){
	browserType="edg";
}else{
	browserType="cr";
}

var suo={
	CON:{
		currentOBJ:null},
	cons:{
		currentOBJ:null,
		model:"dev",
		os:"win",
		sizePos:{},
		menuPin:true,
		boxmove:{},
		sort:[[2,2],[4,2],[4,3],[4,4],[7,1],[9,1],[10,2],[12,1]]
	},
	boxShowFrom:null,
	selects:["xx"],
	begin:function(){
		window.setTimeout(function(){
			suo.init();
			suo.initMenu();
			suo.initI18n();
			var itemArray=["txtengine","imgengine"];

			var arrayFn=Object.getOwnPropertyNames(config.general.fnswitch);
			for(var i=0;i<arrayFn.length;i++){
				if(config.general.fnswitch[arrayFn[i]]){}else{
					continue;
				}
				if(arrayFn[i].substr(2)=="drg"){
					itemArray.push("tdrg");
					itemArray.push("ldrg");
					itemArray.push("idrg");
				}else{
					itemArray.push(arrayFn[i].substr(2));
				}
			}

			for(var i=0;i<itemArray.length;i++){
				suo.initListItem(itemArray[i]);
			}

			suo.initUI("mges");
			suo.initUI("drg");
			suo.initValue();
			suo.initEnd();
		},100)
	},
	init:function(){
		console.log("begin");
		suo.cons.menuPin=window.innerWidth>800?true:false;
		suo.set.set_11();
		suo.initHandle();
	},
	initHandle:function(){
		//document.addEventListener("DOMContentLoaded",this,false);
		window.addEventListener("click",this.handleEvent,false);
		window.addEventListener("mouseup",this.handleEvent,false);
		window.addEventListener("change",this.handleEvent,false);
		window.addEventListener("mousemove",this.handleEvent,false);
		window.addEventListener("mouseover",this.handleEvent,false);
		window.addEventListener("mouseout",this.handleEvent,false);
		window.addEventListener("mouseleave",this.handleEvent,false);
		window.addEventListener("resize",this.handleEvent,false);
		window.addEventListener("mousedown",this.handleEvent,false);
		window.addEventListener("keydown",this.handleEvent,false);
	},
	handleEvent:function(e){
		let getDragEle=function(ele){
			if(ele.classList.contains("item")&&ele.tagName.toLowerCase()=="li"){
				return ele;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		switch(e.type){
			case"keydown":
				console.log(e.target);
				break;
			case"mousedown":
				if(e.button==0&&(e.target.classList.contains("box_head")||e.target.classList.contains("box_title"))){
					var boxposX=e.target.classList.contains("box_head")?e.target.parentNode.offsetLeft:e.target.parentNode.parentNode.offsetLeft,
						boxposY=e.target.classList.contains("box_head")?e.target.parentNode.offsetTop:e.target.parentNode.parentNode.offsetTop;
					suo.cons.boxmove.enable=true;
					suo.cons.boxmove.posX=e.clientX-boxposX;
					suo.cons.boxmove.posY=e.clientY-boxposY;
				}
				break;
			case"click":
				var ele=e.target;
				switch(ele.id){
					case"bgrepeat":
						if(ele.checked){
							document.body.style.cssText+="background-repeat:repeat !important;background-size: initial !important;"
						}else{
							document.body.style.cssText+="background-repeat:no-repeat !important;background-size: cover !important;"
						}
						break;
					case"nav_menu":
						document.querySelector(".menupluscontent").style.display="block";
						break;
					case"nav_img":
						suo.cons.menuPin?null:suo.menuBarCreate();
						break;
					case"menu_bg":
						suo.menuBarRemove();
						break;
					case"wel_button":
						suo.domHide(document.querySelector("#welcomebox"));
						break;
					case"chk_general_settings_autosave":
						config.general.settings.autosave=e.target.checked;
						suo.saveConf2();
						break;
					case"menu_save":
						suo.saveConf2();
						break;
					case"btn_add":
						suo.itemAddBefore(e);
						break;
					case"btn_closead":
						var domAd=e.target.parentNode.parentNode;
						domAd.parentNode.removeChild(domAd);
						break
				}
				if(ele.classList.contains("box_btnkeyrst")){
					e.target.parentNode.querySelector(".box_keyvalue").value="";
				}
				if(ele.classList.contains("box_tabtitle")&&!ele.classList.contains("box_tabtitleactive")){
					suo.tabSwitch(e);
				}
				if(ele.classList.contains("menu_hide")&&!ele.classList.contains("cancel_hide")){
					document.querySelector(".menupluscontent").style.display="none";
					//e.target.parentNode.style.cssText+="display:none;";
				}
				if(ele.classList.contains("nav_menu")){
					document.querySelector(".menupluscontent").style.display="block";
				}
				if(ele.classList.contains("box_diredit")){
					suo.directEdit(e);
				}
				if(ele.classList.contains("box_btn_del")){
					suo.boxClose2(suo.getAPPboxEle(e));
					suo.itemDel(e);
				}
				if(ele.classList.contains("box_btn_next")){
					console.log("box_btn_next")
					var ckdir=suo.checkEditDirect(e);
					console.log(ckdir)
					if(ckdir){
						suo.itemEdit(ckdir[0],ckdir[1],"add",ckdir[2],suo.getDataset(ele,"actiontype","value"));
						suo.boxClose2(e);	
					}
				}
				if(ele.classList.contains("box_btn_diredit")){
					console.log("box_btn_diredit")
					var ckdir=suo.checkEditDirect(e);
					if(ckdir){
						suo.itemEdit(ckdir[0],ckdir[1],"edit",ckdir[2],suo.getDataset(suo.getAPPboxEle(e),"actiontype","value"));
						suo.boxClose2(e);	
					}
				}
				if(ele.classList.contains("box_btn_close")||e.target.classList.contains("box_btn_cancel")){
					suo.boxClose2(e,"cancel");
				}
				if(ele.classList.contains("rate")||(ele.tagName.toLowerCase()!="html"&&ele.parentNode.classList.contains("rate"))){
					chrome.tabs.create({url:suo.cons.webstoreURL})
				}
				if(ele.className&&e.target.classList.contains("menuli")){
					suo.clickMenuLI(e);
					suo.cons.menuPin?null:suo.menuBarRemove();
				}
				if(ele.classList.contains("menup")&&!e.target.classList.contains("menu-current")){
					suo.clickMenuDiv(e);
				}
				if(ele.classList.contains("item_edit")){
					console.log(e.target);
					suo.itemEditBefor(e);
				}
				if(ele.classList.contains("item_add")){
					suo.itemAddBefore(e);
					return
					var confobj=suo.getDataset(e,"confobj","value");
					var confOBJ=config;
					for(var i=0;i<confobj.split("|").length;i++){
						confOBJ=confOBJ[confobj.split("|")[i]];
					}
					var confid=confOBJ.length;
					suo.itemEdit(confobj,confid,"add");
				}
				if(ele.classList.contains("box_btn_save")){
					suo.itemSave(e);
				}
				if(ele.classList.contains("item_del")){
					suo.itemDel(e);
				}
				if(ele.classList.contains("btn_list")){
					suo.showList(e);
				}
				break;
			case"mouseup":
				suo.cons.boxmove.enable=false;
				break;
			case"resize":
				suo.fixSizePos();
				break;
			case"change":
				console.log("change");
				// show or hide chek with text/range/radio/select
				if(e.target.classList.contains("box_check")){
					if(e.target.nextSibling&&e.target.nextSibling.nextSibling){
						if(e.target.checked){
							e.target.nextSibling.nextSibling.style.cssText+="display:block;";
						}else{
							e.target.nextSibling.nextSibling.style.cssText+="display:none;";
						}
					}
				}
				// show or hide radio options
				if(e.target.classList.contains("box_radiooption")){
					var _domRadioList=e.target.parentNode.parentNode.querySelectorAll(".box_radiolist");
					for(var i=0;i<_domRadioList.length;i++){
						_domRadioList[i].style.cssText+="display:none;";
					}
					if(e.target.checked&&e.target.parentNode.querySelector(".box_radiolist")){
						e.target.parentNode.querySelector(".box_radiolist").style.cssText+="display:block;";
					}
				}
				if(e.target.classList.contains("box_select")&&e.target.name=="n_mail"){
					var _dom=suo.getAPPboxEle(e);
						_dom=_dom.querySelector(".confix");

					if(e.target.value=="s_gmailapps"){
						_dom.style.cssText+="display:inline-block;"
						_dom.classList.remove("confix-yes");
						_dom.classList.add("confix-no");
					}else{
						_dom.style.cssText+="display:none;"
						_dom.classList.remove("confix-no");
						_dom.classList.add("confix-yes");
					}
				}
				if(e.target.classList.contains("box_select")&&e.target.value=="add_from_select"){
					suo.boxClose2(e);
					var confobj=e.target.name.indexOf("engine")!=-1?"general|engine|"+e.target.name.substr(2):"general|script|"+e.target.name.substr(2);
					var confArray=confobj.split("|");
					var confOBJ=config;
					for(var i=0;i<confArray.length;i++){
						confOBJ=confOBJ[confArray[i]];
					}
					var confid=confOBJ.length;
					suo.itemEdit(confobj,confid,"add",null,e.target.name.substr(2));
				}
				if(e.target.id=="con-lang"){
					config.general.settings.lang=e.target.value;
					suo.saveConf2();
					window.setTimeout(function(){location.reload();},500)
				}
				if(e.target.classList.contains("change-checkbox")){
					var confArray=suo.getConfArray(e.target);
					var arraydrg=["chk_"+confArray[0]+"_settings_txt","chk_"+confArray[0]+"_settings_lnk","chk_"+confArray[0]+"_settings_img"];
					for(var i=0;i<arraydrg.length;i++){
						if(arraydrg[i]==e.target.id){
							var menuDom=document.querySelector("[data-id0=\'4\'][data-id1=\'i+2\']");
							if(e.target.checked){
								menuDom.style.display="block";
								menuDom.parentNode.style.height=Math.abs(menuDom.parentNode.style.height.substr(0,menuDom.parentNode.style.height.length-2))+30+"px";
							}else{
								menuDom.style.display="none";
								menuDom.parentNode.style.height=Math.abs(menuDom.parentNode.style.height.substr(0,menuDom.parentNode.style.height.length-2))-30+"px";
							}
						}
					}
					suo.changeCheckbox(e);

				}
				if(e.target.classList.contains("change")){
					if(e.target.classList.contains("change_radio")){
						suo.changeRadio(e);
					}
					if(e.target.tagName.toLowerCase()=="select"){
						suo.changeSelect(e);
					}
					if(e.target.tagName.toLowerCase()=="input"&&e.target.type=="range"){
						suo.changeRange(e);
					}
					if(e.target.tagName.toLowerCase()=="input"&&e.target.type=="color"){
						suo.changeUi(e);
					}
					if(e.target.tagName.toLowerCase()=="input"&&e.target.type=="checkbox"){
						var confOBJ=suo.getConfOBJ(e);
						console.log(confOBJ)
						confOBJ[e.target.dataset.confele]=e.target.checked;
						suo.saveConf();
					}
					//more

				}
				if(e.target.classList.contains("change-select")){
					suo.changeSelect(e);	
				}
				if(e.target.classList.contains("change-fnswitch")){
					suo.changeFnswitch(e);
				}
				if(e.target.classList.contains("change-range")){
					suo.changeRange(e);
				}
				if(e.target.classList.contains("change-ui")){
					suo.changeUi(e);
				}
				if(e.target.classList.contains("actionselect")){
					suo.actionChange2(e);
				}
				if(e.target.id=="mydes"){
					if(e.target.checked){document.querySelector(".box-content #mydesbox #mydestext").style.display="inline-block"}
					else{document.querySelector(".box-content #mydesbox #mydestext").style.display="none"}
				}
				if(e.target.classList.contains("box_desck")){
					var getele=function(ele){
						if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
							return ele;
						}else{
							return getele(ele.parentNode);
						}
					}
					var dom=getele(e.target).querySelector(".box_destext");
					if(e.target.checked){
						dom.style.display="inline-block";
					}else{
						dom.style.display="none";
					}
				}
				break;
			case"mouseover":
				if(e.target.classList.contains("menuplusimg")){
					document.querySelector(".menupluscontent").style.display="block";
				}
				break;
			case"mouseout":
				var dom=e.target;
				if(dom.classList.contains("item-list")
					||dom.classList.contains("span-del")
					||dom.classList.contains("list-parent")){
					//console.log(e.relatedTarget.classList)
					if(e.relatedTarget.classList.contains("span-del")
						||e.relatedTarget.classList.contains("item-list")
						||e.relatedTarget.classList.contains("list-parent")){
						return;
					}else{
						if(dom.parentNode.querySelector(".span-del")){
							dom.parentNode.querySelector(".span-del").remove();
						}
					}
					
				}
				//console.log(e.target)
				if(e.target.classList.contains("menupluscontent")){
					document.querySelector(".menupluscontent").style.display="none";
				}
				if(e.target.classList.contains("menu_hide")
					&&!e.relatedTarget.classList.contains("menu_hide")
					&&!e.relatedTarget.classList.contains("menupluscontent")){
					document.querySelector(".menupluscontent").style.display="none";
				}
				break;
			case"mousemove":
				if(suo.cons.boxmove.enable&&(e.target.classList.contains("box_head")||e.target.classList.contains("box_title"))){
					suo.boxMove(e);
				}
				break;
			case"mouseleave":
				break;
		}
	},
	showList:function(e){
		var btnArray=[];
		var _dom=suo.initAPPbox(btnArray,[400,230],suo.getI18n("tip_showlist"),"bg","showlist");

		var confArray=e.target.dataset.confobj.split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		console.log(confOBJ);
		var _ul=suo.domCreate2("ul",null,null,"height:"+(window.innerHeight-150)+"px;list-style:none;padding:0;margin:0;min-width:300px;");
		for(var i=0;i<confOBJ.length;i++){
			var _li=suo.domCreate2("li",null,null,"padding:2px 0;");
			var _title=suo.domCreate2("span",null,null,"padding-right:20px;min-width:120px;display:inline-block;",null,(confOBJ[i].mydes&&confOBJ[i].mydes.type&&confOBJ[i].mydes.value?confOBJ[i].mydes.value:suo.getI18n(confOBJ[i].name)));
			console.log(_title);
			_li.appendChild(_title);
			var _direct=suo.domCreate2("span",null,null,"background-color:#d0d9ff; display:inline-block; border-radius:20px;padding:4px 8px 2px 8px;");
			for(var j=0;j<confOBJ[i].direct.length;j++){
				var _img=suo.domCreate2("img",{setName:["className","src"],setValue:["item_edit",chrome.runtime.getURL("")+"image/"+"direct.png"]},null,"height:24px;"+suo.directimg(confOBJ[i].direct[j]));
				_direct.appendChild(_img);
			}
			_li.appendChild(_direct);
			_ul.appendChild(_li);
		}
		_dom.querySelector(".box_content").style.cssText+="overflow:auto;margin-bottom:8px;";
		_dom.querySelector(".box_content").appendChild(_ul);
		suo.initPos(_dom);
	},
	initI18n:function(){
		var i18nOBJ=document.querySelectorAll("[data-i18n]");

		for(var i=0;i<i18nOBJ.length;i++){
			let _str=i18nOBJ[i].dataset.i18n;
			let trans=suo.getI18n(_str);
			if(_str.indexOf("des_")==0){
				trans="*"+trans;
			}
			//var trans=suo.getI18n(i18nOBJ[i].dataset.i18n);
			if(!trans){continue;}
			if(i18nOBJ[i].tagName.toLowerCase()=="input"&&i18nOBJ[i].type=="button"){
				i18nOBJ[i].value=trans;
			}else if(i18nOBJ[i].title=="_i18n"){
				i18nOBJ[i].title=trans;
			}else{
				i18nOBJ[i].innerText=trans;
			}
			/*if(i18nOBJ[i].title=="_i18n"){
				i18nOBJ[i].title=trans;
				if(i18nOBJ[i].tagName.toLowerCase()=="input"){
					i18nOBJ[i].value="+"
				}
			}*/
		}
	},
	getI18n:function(str){
		// console.log(str)
		if(["n_stop","n_reload","n_move","n_detach","n_switchtab","n_copytab","n_copytabele_target","n_savepage","n_mail_target"].contains(str)){
			str="n_tab";
		}
		return chrome.i18n.getMessage(str)||str;
	},
	saveConf:function(str,type,mytime){
		config.general.settings.autosave?suo.saveConf2(str,type,mytime):null;
	},
	saveConf2:function(str,type,mytime){
		chrome.runtime.sendMessage({type:"saveConf",value:config});
	},
	domCreate2:function(edom,eele,einner,ecss,edata,etxt){
		var dom=document.createElement(edom);
		if(eele){
			for (var i = 0;i<eele.setName.length; i++) {
				if(eele.setName[i]=="for"){
				//if(["for","checked"].contains(eele.setName[i])){
					dom.setAttribute(eele.setName[i],eele.setValue[i]);
				}else if(eele.setName[i]=="checked"){
					eele.setValue[i]?dom.setAttribute(eele.setName[i],"checked"):null;
				}else if(eele.setName[i]=="readonly"){
					dom.setAttribute(eele.setName[i],"");
				}else{
					dom[eele.setName[i]]=eele.setValue[i];
				}
			}
		}
		if(einner){dom.innerHTML=einner}
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
	itemDel:function(e){
		var ele=e.target;
		var confArray=suo.getDataset(ele,"confobj","value").split("|");

		var confOBJ=config,
			actionType=suo.getDataset(ele,"actiontype","value");
		for(var i=0;i<(confArray.length>=3?confArray.length:confArray.length);i++){
			confOBJ=confOBJ[confArray[i]];
		}
		if(confOBJ.length<=1){suo.showMsgBox(suo.getI18n("msg_dellast"),"warning");return;}

		var delId=suo.getDataset(ele,"confid","value");
		//check if the engine in use
		if(confArray[1]=="engine"){//check in use
			//console.log("delengine")
			var theType=confArray[2];
			var OBJArray=[config.mges.actions,config.drg.tdrg,config.drg.idrg];
			for(j=0;j<OBJArray.length;j++){
				for(var i=0;i<OBJArray[j].length;i++){
					for(var ii=0;OBJArray[j][i].selects&&ii<OBJArray[j][i].selects.length;ii++){
						if(OBJArray[j][i].selects[ii].type=="n_"+theType&&OBJArray[j][i].selects[ii].value==delId){
							//console.log(OBJArray[j][i])
							suo.showMsgBox(suo.getI18n("msg_delinuse"),"warning");
							return;
						}
					}
				}
			}
		}	

		confOBJ.splice(delId,1);
		//reset engine id for action
		if(confArray[1]=="engine"){//new
			//console.log("delengine")
			var theType=confArray[2];
			var OBJArray=[config.mges.actions,config.drg.tdrg,config.drg.idrg];
			for(j=0;j<OBJArray.length;j++){
				for(var i=0;i<OBJArray[j].length;i++){
					for(var ii=0;OBJArray[j][i].selects&&ii<OBJArray[j][i].selects.length;ii++){
						if(OBJArray[j][i].selects[ii].type=="n_"+theType){
							//console.log(Math.abs(OBJArray[j][i].selects[ii].value))
							//console.log(Math.abs(delId))
							if(Math.abs(OBJArray[j][i].selects[ii].value)>Math.abs(delId)){
								OBJArray[j][i].selects[ii].value=Math.abs(OBJArray[j][i].selects[ii].value)-1;
							}
						}
					}
				}
			}
		}
		suo.saveConf();
		suo.initListItem(actionType);
	},
	showMsgBox:function(str,type,mytime,index){
		console.log("msgbox")
		var str=str?str:suo.getI18n("msg_saved");
		var type=type?type:"save";
		var mytime=(mytime&&mytime>0)?mytime:2;
		var index=index?index:1;
		var OBJ=document.querySelector("#msgbox");
		suo.posMsgBox();
		switch(type){
			case"save":
				OBJ.style.cssText+="background-color:#259b24;";
				break;
			case"error":
				OBJ.style.cssText+="background-color:red;";
				break;
			case"warning":
				OBJ.style.cssText+="background-color:yellow;color:rgba(0,0,0,.8);";
				break;
		}
		//OBJ.innerText=str;
		OBJ.textContent="";
		if(typeof str=="string"){
			OBJ.innerText=str;
		}else if(typeof str=="object"){
			for(var i=0;i<str.length;i++){
				var _div=suo.domCreate2("div",null,null,null,null,str[i]);
				OBJ.appendChild(_div);
			}
		}
		//OBJ.style.cssText+="top:70px;opacity:0;";
		window.setTimeout(function(){
			OBJ.style.cssText+="transition:all .4s ease-in-out;top:70px;opacity:1;z-index:"+index;
		},100);
		window.setTimeout(function(){
			OBJ.style.cssText+="transition:all .5s ease-in-out;top:0px;opacity:0;z-index:1";
		},mytime*1000)
	},
	posMsgBox:function(){
		var OBJ=document.querySelector("#msgbox");
		OBJ.style.left=(window.innerWidth-parseInt(window.getComputedStyle(OBJ).width.substr(0,window.getComputedStyle(OBJ).width.length-2)))/2+"px"
	},
	directimg:function(direct){
		//var myDeg={L:"180deg",R:"0deg",U:"270deg",D:"90deg"};
		var myDeg={L:"0deg",l:"45deg",U:"90deg",u:"135deg",R:"180deg",r:"225deg",D:"270deg",d:"315deg"};
		return "-webkit-transform:rotate(+"+myDeg[direct]+");";
	},
	initUi1:function(type){
		console.log(type)
		var dom=document.querySelector("#set-"+type+"ui .setcontent");
			dom.textContent="";
		var uitype=["line","direct","tip","note","allaction"]
		for(var i=0;i<uitype.length;i++){
			dom.appendChild(suo.domCreate2("input",{setName:["type","className"],setValue:["checkbox","init uicheckbox change-input change-ui uienable"]},null,null,{setName:["confele"],setValue:[uitype[i]+"|enable"]}));
			dom.appendChild(suo.domCreate2("label",null,null,null,null,suo.getI18n("ui_"+uitype[i]+"_enable")));
			dom.appendChild(suo.domCreate2("br"));
			var dompart=suo.domCreate2("div",{setName:["className"],setValue:["uibox"]},null,null,{setName:["confobj"],setValue:[type+"|ui|"+uitype[i]]});
			if(!config[type].ui[uitype[i]].enable){
				dompart.style.cssText+="display:none;"
			}
			for(var ii=0;ii<ui[uitype[i]].length;ii++){
				var _conf=config[type].ui[uitype[i]];
				dompart.appendChild(suo.domUi(ui[uitype[i]][ii],_conf));
				//dompart.appendChild(suo.domCreate2("br"));
			}
			dom.appendChild(dompart)
		}
	},
	domUi:function(obj,conf){
		//console.log(conf)
		var dom=suo.domCreate2("div");
		var domlabel=suo.domCreate2("label",{setName:["className"],setValue:["uilabel"]},null,null,null,suo.getI18n("ui_"+obj.confele));
		var dommain=suo.domCreate2(obj.dom,{setName:["type","className"],setValue:[obj.type,"change"]},null,null,{setName:["confele"],setValue:[obj.confele]});
			dommain.classList.add("init")
		if(obj.type=="range"){
			dommain.min=obj.range.min;
			dommain.max=obj.range.max;
			dommain.step=obj.range.step;
			var _rangebox=suo.domCreate2("span",{setName:["className"],setValue:["uirangebox"]});
				//_rangebox.innerText=conf[obj.confele];

			//console.log(obj)
			var box_unit=suo.domCreate2("span",{setName:["className"],setValue:["box_unit"]});
			var _unit="";
			switch(obj.confele){
				case"opacity":
					_unit="( % )";
					break;
				case"width":
					_unit="( px )";
			}
			box_unit.innerText=_unit;

			dom.appendChild(domlabel);
			dom.appendChild(dommain);
			dom.appendChild(_rangebox);
			dom.appendChild(box_unit);
		}else if(obj.type=="checkbox"){
			dom.appendChild(dommain);
			dom.appendChild(domlabel);
		}else if(obj.type=="color"){
			dommain.classList.add("uicolor")
			dom.appendChild(domlabel);
			dom.appendChild(dommain);
		}else if(obj.dom=="select"){
			for(var i=0;i<obj.select.length;i++){
				dommain.appendChild(suo.domCreate2("option",{setName:["value"],setValue:[obj.select[i]]},null,null,null,suo.getI18n(/*"s_o_"+*/obj.select[i])));
			}
			dom.appendChild(domlabel);
			dom.appendChild(dommain);
		}
		return dom;
	},
	initUI:function(uitype){
		//console.log(uitype)
		suo.initUi1(uitype);
	},
	initMenu:function(){
		var menuDom=document.querySelector("menu>#menubox");
			menuDom.textContent="";
		var /*menuP=[],menuUL=[],*/menuC=[];
		for(var i=0;i<menuModel.main.length;i++){
			menuP=suo.domCreate2("div",{setName:["className","id"],setValue:["menup","m-"+menuModel.main[i]]},null,null,{setName:["confobj"],setValue:[menuModel.main[i]]},suo.getI18n(menuModel.main[i]));
			//console.log(menuP)
			if(menuModel.main[i]=="apps"){
				menuP.style.display="none"
			}
			var menuUL=suo.domCreate2("ul",{setName:["className"],setValue:["menuul"]});

			if(i==0){
				menuP.classList.add("menu-current");
			}else{
				menuUL.style.display="none";
			}
			for(var j=0;j<menuModel[menuModel.main[i]].length;j++){
				var menuData={setName:["id0","id1"],setValue:[i,j]};
				var menuLI=suo.domCreate2("li",{setName:["className"],setValue:["menuli"]},null,null,menuData,suo.getI18n(menuModel[menuModel.main[i]][j]));
				if(i==1&&j==3&&suo.cons.os=="win"){
					continue;
					menuLI.style.cssText+="display:none;";
				}
				menuUL.appendChild(menuLI);
			}
			menuDom.appendChild(menuP);
			menuDom.appendChild(menuUL);
			//init fnswitch menu
			if(i>1&&i<menuModel.main.length/*&&config.general.fnswitch[menuModel.main[i]]*/){
				var domOBJ=document.querySelector("#m-"+menuModel.main[i]);
				if(config.general.fnswitch["fn"+menuModel.main[i]]){
					domOBJ.style.display="block";
				}else{
					domOBJ.style.display="none";
				}
			}
		}
		suo.clickMenuLI(document.querySelector(".menuul").firstChild);
	},
	clickMenuLI:function(e){
		console.log(e.target)
		//console.log(e.target.dataset.id0);
		document.querySelector("#top").style.cssText+="background-color:"+suo.randColor();
		var ele=e.target||e;
		var sets=document.querySelectorAll(".set");
		for(var i=0;i<sets.length;i++){
			sets[i].style.display="none";
			sets[i].style.opacity=0;
		}
		for(var i=0;i<document.querySelectorAll(".menuli").length;i++){
			document.querySelectorAll(".menuli")[i].classList.remove("menulicurrent");
		}
		ele.classList.add("menulicurrent");
		var setDom=document.querySelector(".set-"+ele.dataset.id0+ele.dataset.id1);
		if(setDom){
			setDom.style.cssText+="display:block;transition:all .9s ease-in-out;"
			window.setTimeout(function(){
				setDom.style.cssText+="opacity:.9;transition:all .9s ease-in-out;"
			},10)
			suo.initValue(setDom,true)
		}
		//document.querySelector("#nav_txt").innerText=ele.parentNode.previousSibling.innerText+" · "+ele.innerText;
		console.log(setDom);if(!setDom)return;
		suo.cons.currentOBJArray=setDom.dataset.confobj.split("|");
		if((ele.dataset.id0=="1"&&ele.dataset.id1=="2")
			||(ele.dataset.id0=="2"&&ele.dataset.id1=="2")
			||(ele.dataset.id0=="4"&&ele.dataset.id1=="2")
			||(ele.dataset.id0=="4"&&ele.dataset.id1=="3")
			||(ele.dataset.id0=="4"&&ele.dataset.id1=="4")
			||(ele.dataset.id0=="7"&&ele.dataset.id1=="1")
			||(ele.dataset.id0=="9"&&ele.dataset.id1=="1")
			||(ele.dataset.id0=="10"&&ele.dataset.id1=="2")
			||(ele.dataset.id0=="12"&&ele.dataset.id1=="1")){
				suo.showBtnAdd(true,setDom.dataset.confobj,setDom);
				//document.querySelector("#btn_add").style.cssText+="display:block;"
		}else{
			suo.showBtnAdd(false);
			//document.querySelector("#btn_add").style.cssText+="display:none;"
		}
	},
	clickMenuDiv:function(e){
		var ele=e.target||e;
		var menuDivDoms=document.querySelectorAll(".menup");
		var menuULDoms=document.querySelectorAll(".menuul");
		var menuLIDoms=document.querySelectorAll(".menuli");
		var theMenuUL=ele.nextSibling;
		for(var i=0;i<menuDivDoms.length;i++){
			menuDivDoms[i].classList.remove("menu-current");
		}
		ele.classList.add("menu-current");
		for(var i=0;i<menuULDoms.length;i++){
			//console.log(window.getComputedStyle(menuULDoms[i]).opacity)
			if(window.getComputedStyle(menuULDoms[i]).opacity){
				var forDom=menuULDoms[i];
				menuULDoms[i].style.cssText+="display:none;transition:all .2s ease-in-out;height:0;opacity:0;";
				window.setTimeout(function(){
					forDom.style.cssText+="display:none;"
				},300)
			}
		}
		suo.clickMenuLI(theMenuUL.firstChild)
		window.setTimeout(function(){
			theMenuUL.style.cssText+="display:block;";
			window.setTimeout(function(){
				var t=0;
				var confArray=suo.getConfArray(ele);
				if(confArray[0]=="drg"){//check menuli height
					if(!config[confArray[0]].settings.txt){t++}
					if(!config[confArray[0]].settings.lnk){t++}
					if(!config[confArray[0]].settings.img){t++}
				}
				theMenuUL.style.cssText+="transition:all .4s ease-in-out;opacity:1;height:"+((theMenuUL.childNodes.length-t)*(30+2)+1)+"px;";
			},10);
		},400)
	},
	createMoreSelect:function(type,value,confOBJ){
		let i=0;
		console.log(confOBJ);
		console.log(type)
		var valueOBJ={setName:["name","className"],setValue:[type,"box_select"]};
		var domSelect=suo.domCreate2("select",valueOBJ);
		var index=0;
		if(["n_txtengine","n_imgengine"].contains(type)){
			var type=type.substr(2);
			for(i=0;i<(config.general.engine[type].length);i++){
				domSelect.appendChild(suo.domCreate2("option",{setName:["value"],setValue:[""+i]},null,null,null,config.general.engine[type][i]["name"]));
				if(i==value){index=i;}
			}
			domSelect.appendChild(suo.domCreate2("option",{setName:["value"],setValue:["add_from_select"]},null,null,null,"Add new ..."));
		}else{
			let _obj={};
			_obj=(actionOptions.special[confOBJ.name]&&actionOptions.special[confOBJ.name][type])?actionOptions.special[confOBJ.name][type]:actionOptions.selects[type];
			console.log(_obj)
			for(i=0;i<_obj.length;i++){
				domSelect.appendChild(suo.domCreate2("option",{setName:["value"],setValue:[_obj[i]]},null,null,null,suo.getI18n(_obj[i])));
					if(value==_obj[i]){index=i;}
			}
		}
		domSelect.selectedIndex=index;
		return domSelect;
	},
	createMoreText:function(_conf){
		var conf=JSON.parse(JSON.stringify(_conf));
		if(conf.value==undefined){
			conf.value=actionOptions.texts[conf.type];
		}

		var dom=suo.domCreate2("div",{setName:["className"],setValue:["box_optionlist"]});
		var labelText=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},null,null,null,suo.getI18n(conf.type)),
			domText=suo.domCreate2("input",{setName:["name","type","value","className"],setValue:[conf.type,"text",conf.value,"box_text"]});

		dom.appendChild(labelText);
		dom.appendChild(domText);
		return dom;
	},
	createMoreCheck:function(_conf){
		var _time=parseInt((new Date().getTime())/1000)+parseInt(Math.random()*1000).toString();

		// copy all actionOptions elements to new conf
		var conf=JSON.parse(JSON.stringify(_conf));
		for(var i in actionOptions.checks[conf.type]){
			if(conf[i]==undefined){
				conf[i]=actionOptions.checks[conf.type][i];
			}
		}

		var dom=suo.domCreate2("div",{setName:["className"],setValue:["box_optionlist"]}),
			labelCheck=suo.domCreate2("label",{setName:["id","for"],setValue:[conf.type,conf.type]},null,null,null,suo.getI18n(conf.type)),
			domCheck=suo.domCreate2("input",{setName:["id","className","type","name"],setValue:[conf.type,"box_check","checkbox",conf.type]
		});
		dom.appendChild(domCheck);
		dom.appendChild(labelCheck);

		if(conf.typeCheck){
			domCheck.checked=conf.value;
			var _checkList=suo.domCreate2("div",{setName:["className"],setValue:["box_checklist"]},null,conf.value?"display:block;":"display:none;");

			switch(conf.typeCheck){
				case"default":

					break;
				case"text":
					var domText=suo.domCreate2("input",{setName:["name","type","value","className"],setValue:[conf.type,"text",conf.valueOption==undefined?actionOptions.checks[conf.type].options.valueOption:conf.valueOption,"box_checktext"]
					});
					_checkList.appendChild(domText);
					break;
				case"select":
					var domSelect=suo.domCreate2("select",{setName:["name","className"],setValue:[conf.type,"box_checkselect"]});
					for(i=0;i<conf.options.settings.length;i++){
						domSelect.appendChild(suo.domCreate2("option",{setName:["value"],setValue:[conf.options.settings[i]]},null,null,null,suo.getI18n(conf.options.settings[i])));
					}
					domSelect.selectedIndex=0;
					domSelect.value=conf.valueOption==undefined?conf.options.valueOption:conf.valueOption;
					_checkList.appendChild(domSelect);
					break;
				case"range":
					var domRangeBox=suo.domCreate2("div",{setName:["className"],setValue:["box_checkrange"]});
					var domRange=suo.domCreate2("input",{setName:["className","name","type","min","max","step","value"],setValue:["change box_range",conf.type,"range",conf.options.settings[0],conf.options.settings[1],conf.options.settings[2],conf.valueOption==undefined?conf.options.valueOption:conf.valueOption]},null,null,{setName:["typechange"],setValue:["actionedit"]}),
						domText=suo.domCreate2("span",{setName:["className"],setValue:["box_rangevalue"]},null,null,null,domRange.value);
					domRangeBox.appendChild(domRange);
					domRangeBox.appendChild(domText);

					if(conf.options.settings[3]){
						var domUnit=suo.domCreate2("span",{setName:["className"],setValue:["box_rangeunit"]},null,null,null," ( "+conf.options.settings[3]+" ) ");
						domRangeBox.appendChild(domUnit);
					}

					_checkList.appendChild(domRangeBox);
					break;
				case"radio":
					var domRadio=suo.domCreate2("div",{setName:["className"],setValue:["box_checkradio"]});
					for(var i=0;i<conf.options.settings.length;i++){
						var _dom=suo.domCreate2("div",null,null,"clear:both;"),
							_option=suo.domCreate2("input",{setName:["id","className","type","name","value"],setValue:["box_radiooption_"+i+_time,"box_radiooption","radio",conf.typeCheck,conf.options.settings[i].name]}),
							_label=suo.domCreate2("label",{setName:["className","for"],setValue:["box_radiooptionlabel","box_radiooption_"+i+_time]},null,null,null,suo.getI18n(conf.options.settings[i].name));
						_dom.appendChild(_option);
						_dom.appendChild(_label);
						domRadio.appendChild(_dom);

						// i==0?_option.checked=true:null;
						if(conf.valueOption==undefined){
							if(conf.options.valueOption==conf.options.settings[i].name){_option.checked=true;}
						}else{
							if(conf.valueOption==conf.options.settings[i].name){_option.checked=true;}
						}

						var _radioList=suo.domCreate2("div",{setName:["className"],setValue:["box_radiolist"]});
						switch(conf.options.settings[i].typeSetting){
							case"text":
								var _text=suo.domCreate2("input",{setName:["className","type","value"],setValue:["box_radiooptiontext","text",conf.valueOption==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting]});
								_radioList.appendChild(_text);
								break;
							case"select":
								var _select=suo.domCreate2("select",{setName:["className"],setValue:["box_radiooptionselect"]});
								for(var ii=0;ii<conf.options.settings[i].moreSetting.length;ii++){
									var _selectOption=suo.domCreate2("option",null,null,null,null,suo.getI18n(conf.options.settings[i].moreSetting[ii]));
									_select.appendChild(_selectOption);
								}
								_select.selectedIndex=0;
								_select.value=conf.valueOption==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting;
								_radioList.appendChild(_select);
								break;
							case"range":
								var _div=suo.domCreate2("div",{setName:["className"],setValue:["box_radiooptionrangebox"]}),
									_range=suo.domCreate2("input",{setName:["className","type","min","max","step","value"],setValue:["change box_radiooptionrange","range",conf.options.settings[i].moreSetting[0],conf.options.settings[i].moreSetting[1],conf.options.settings[i].moreSetting[2],conf.valueOption==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting]},null,null,{setName:["typechange"],setValue:["actionedit"]}),
									_text=suo.domCreate2("span",{setName:["className"],setValue:["box_radiooptionrangetext"]},null,null,null,_range.value),
									_unit=suo.domCreate2("span",{setName:["className"],setValue:["box_radiooptionrangeunit"]},null,null,null," ( "+conf.options.settings[i].moreSetting[3]+" ) ");
								_div.appendChild(_range);
								_div.appendChild(_text);
								_div.appendChild(_unit);
								_radioList.appendChild(_div);
								break;
						}

						if(_radioList.hasChildNodes()){
							_dom.appendChild(_radioList);
							if(_option.checked){
								_radioList.style.cssText+="display:block;";
							}
						}
					}
					_checkList.appendChild(domRadio);
					break;
			}
			_checkList.hasChildNodes()?dom.appendChild(_checkList):null;
		}else{
			domCheck.checked=conf.value;
		}

		return dom;
	},
	createMoreRange:function(_conf){
		console.log(_conf)
		var conf=JSON.parse(JSON.stringify(_conf));
		if(conf.value==undefined){
			for(var i in actionOptions.ranges[conf.type]){
				conf[i]=actionOptions.ranges[conf.type][i];
			}
		}
		console.log(conf);

		var dom=suo.domCreate2("div",{setName:["className"],setValue:["box_optionlist"]}),
			labelRange=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},null,null,null,suo.getI18n(conf.type));
		dom.appendChild(labelRange);

		var arrayOptions=actionOptions.ranges[conf.type].options;

		var _range=suo.domCreate2("input",{setName:["className","type","name","min","max","step","value"],setValue:["change box_range","range",conf.type,arrayOptions[0],arrayOptions[1],arrayOptions[2],conf.value]},null,null,{setName:["typechange"],setValue:["actionedit"]});
		dom.appendChild(_range);

		var _text=suo.domCreate2("span",{setName:["className"],setValue:["box_rangevalue"]},null,null,null,conf.value);
		dom.appendChild(_text);

		if(arrayOptions[3]){
			_range.style.cssText+="width:83px;";
			var _unit=suo.domCreate2("span",{setName:["className"],setValue:["box_rangeunit"]},null,null,null," ( "+arrayOptions[3]+" ) ");
			dom.appendChild(_unit);
		}

		return dom;
	},
	createMoreRadio:function(_conf){
		var _time=parseInt((new Date().getTime())/1000)+parseInt(Math.random()*1000).toString();

		// copy all actionOptions elements to new conf
		var conf=JSON.parse(JSON.stringify(_conf));
		for(var i in actionOptions.radios[conf.type]){
			if(conf[i]==undefined){
				conf[i]=actionOptions.radios[conf.type][i];
			}
		}
		console.log(conf);

		var dom=suo.domCreate2("div",{setName:["className"],setValue:["box_optionlist"]},null,null,{setName:["confobj"],setValue:[conf.type]}),
			labelRadio=suo.domCreate2("span",{setName:["className"],setValue:["box_radiolabel"]},null,null,null,suo.getI18n(conf.type)),
			domOption=suo.domCreate2("div",{setName:["className"],setValue:["box_radio"]},null,null,{setName:["confobj"],setValue:[conf.type]});
		dom.appendChild(labelRadio);
		dom.appendChild(domOption);

		// var arrayOptions=actionOptions.radios[conf.type].options;
		var arrayOptions=conf.options;
		for(var i=0;i<conf.options.settings.length;i++){
			var _dom=suo.domCreate2("div"),
				_option=suo.domCreate2("input",{setName:["id","className","type","name","value"],setValue:["box_radiooption_"+i+_time,"box_radiooption","radio",conf.type,conf.options.settings[i].name]}),
				_domLabel=suo.domCreate2("label",{setName:["className","for"],setValue:["box_radiooptionlabel","box_radiooption_"+i+_time]},null,null,null,suo.getI18n(conf.options.settings[i].name));

			_dom.appendChild(_option);
			_dom.appendChild(_domLabel);
			domOption.appendChild(_dom);

			// set checked option
			console.log(conf.value)
			// i==0?_option.checked=true:null;
			if(conf.value==undefined){
				if(conf.options.valueOption==conf.options.settings[i].name){_option.checked=true;}
			}else{
				console.log(conf.value)
				if(conf.value==conf.options.settings[i].name){_option.checked=true;}
			}

			var _radioList=suo.domCreate2("div",{setName:["className"],setValue:["box_radiolist"]});
			switch(conf.options.settings[i].typeSetting){
				case"text":
					var _text=suo.domCreate2("input",{setName:["className","type","value"],setValue:["box_radiooptiontext","text",conf.value==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting]});
					_radioList.appendChild(_text);
					break;
				case"select":
					var _select=suo.domCreate2("select",{setName:["className"],setValue:["box_radiooptionselect"]});
					for(var ii=0;ii<conf.options.settings[i].moreSetting.length;ii++){
						var _selectOption=suo.domCreate2("option",null,null,null,null,suo.getI18n(conf.options.settings[i].moreSetting[ii]));
						_select.appendChild(_selectOption);
					}

					_select.selectedIndex=0;
					_select.value=conf.value==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting;

					_radioList.appendChild(_select);
					break;
				case"range":
					var _div=suo.domCreate2("div",{setName:["className"],setValue:["box_radiooptionrangebox"]});
					var _range=suo.domCreate2("input",{setName:["className","type","min","max","step","value"],setValue:["change box_radiooptionrange","range",conf.options.settings[i].moreSetting[0],conf.options.settings[i].moreSetting[1],conf.options.settings[i].moreSetting[2],conf.value==conf.options.settings[i].name?conf.valueSetting:conf.options.settings[i].valueSetting]},null,null,{setName:["typechange"],setValue:["actionedit"]});
					var _text=suo.domCreate2("span",{setName:["className"],setValue:["box_radiooptionrangetext"]},null,null,null,_range.value);
					var _unit=suo.domCreate2("span",{setName:["className"],setValue:["box_radiooptionrangeunit"]},null,null,null," ( "+conf.options.settings[i].moreSetting[3]+" ) ");
					_div.appendChild(_range);
					_div.appendChild(_text);
					_div.appendChild(_unit);
					_radioList.appendChild(_div);
					break;
			}
			if(_radioList.hasChildNodes()){
				_dom.appendChild(_radioList);
				_option.checked?_radioList.style.cssText+="display:block;":null;
			}
		}

		return dom;
	},
	set:{
		set_11:function(){
			var domOBJ=document.querySelector(".set-00>.setcontent");
				domOBJ.textContent="";
			for(var i=1;i<menuModel.fn.length;i++){
				var check=suo.domCreate2("input",{setName:["type","className"],setValue:["checkbox","fnswitch change-checkbox change-fnswitch init"]},"","",{setName:["conf0","conf1","confele"],setValue:["normal","fnswitch","fn"+menuModel.fn[i]]});
				var label=suo.domCreate2("label",null,null,null,null,suo.getI18n(menuModel.fn[i]));
				var br=suo.domCreate2("br");
				domOBJ.appendChild(check);
				domOBJ.appendChild(label);
				domOBJ.appendChild(br);
			}
			domOBJ.appendChild(suo.domCreate2("div",{setName:["className"],setValue:["setdes"]},null,null,null,suo.getI18n("des_fnswitch")));
		}
	},
	initValue:function(delayDom,delay){
		//return
		suo.initId();
		//return;
		var doms=document.querySelectorAll(".init");
		if(delay){
			doms=delayDom.querySelectorAll(".init-delay");
		}
		for(var i=0;i<doms.length;i++){
			var confOBJ=suo.getConfOBJ(doms[i]);
			//var value//=confOBJ[doms[i].dataset.confele];
			var _confele=doms[i].dataset.confele.split("|");
			// if(!confOBJ){continue;}
			var value=confOBJ[_confele[0]];
			for(var ii=1;ii<_confele.length;ii++){
				value=value[_confele[ii]]
			}

			if(doms[i].tagName.toLowerCase()=="input"&&doms[i].type=="checkbox"){
				//console.log(doms[i].dataset.confele.replace("|", "_"));
				//console.log(value)
				doms[i].checked=value;
				var confArray=suo.getConfArray(doms[i]);
				doms[i].id="chk_"+confArray[0]+"_"+confArray[1]+"_"+doms[i].dataset.confele.replace("|", "_");
				doms[i].nextSibling.setAttribute("for",doms[i].id);
				//drg|settings
				if(["txt","lnk","img"].contains(doms[i].dataset.confele)){
					//console.log(confArray)
					for(var ii=0;ii<3;ii++){
						//break
						if(doms[i].dataset.confele==["txt","lnk","img"][ii]){
							var theDom=document.querySelector("[data-id0=\'4\'][data-id1=\'"+(ii+2)+"\']");
							//console.log(theDom)
							confOBJ[doms[i].dataset.confele]?theDom.style.display="block":theDom.style.display="none";
							theDom.parentNode.style.height="auto";
						}
					}
				}
			}
			if(doms[i].tagName.toLowerCase()=="input"&&doms[i].type=="color"){
				doms[i].value=value;
			}
			if(doms[i].tagName.toLowerCase()=="select"){
				var selectsDom=doms[i].querySelectorAll("option");
				for(var ii=0;ii<selectsDom.length;ii++){
					if(selectsDom[ii].value==value){
						doms[i].selectedIndex=ii;
					}
				}
			}
			if(doms[i].tagName.toLowerCase()=="input"&&doms[i].type=="range"){
				doms[i].value=value;
				doms[i].nextSibling.textContent=value;
			}
			if(doms[i].classList.contains("init_radio")){
				var domRadios=doms[i].querySelectorAll("input[type=radio]");
				//document.querySelector("#chk_pop_settings_front").checked="s"
				for(var ii=0;ii<domRadios.length;ii++){
					//console.log(domRadios[ii].value+"/"+value)
					if(domRadios[ii].value==value){
						console.log(domRadios[ii])
						domRadios[ii].checked="true";
						break;
					}
				}
			}
		}
	},
	initId:function(){
		var doms=document.querySelectorAll(".initid");
		for(var i=0;i<doms.length;i++){
			var confArray=suo.getConfArray(doms[i]);
			doms[i].id="chk_"+confArray[0]+"_"+confArray[1]+"_"+doms[i].dataset.confele.replace(/\|/g, "_");
			doms[i].nextSibling.setAttribute("for",doms[i].id);
		}
	},
	getConfArray:function(e){
		var ele=e.target||e;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var confArray=getdata(ele).split("|");
		return confArray;
	},
	getConfOBJ:function(e){
		var ele=e.target||e;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var confArray=getdata(ele).split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		return confOBJ;
	},
	changeUi:function(e){
		//return
		var ele=e.target;
		var confOBJ=suo.getConfOBJ(e);
		//console.log(confOBJ)
		var confArray=ele.dataset.confele.split("|");
		if(ele.tagName.toLowerCase()=="input"||
			ele.tagName.toLowerCase()=="select"){
			var eleType=ele.type;
			if(eleType=="range"&&ele.nextSibling.classList.contains("uirangebox")){
				ele.nextSibling.innerText=ele.value;
			}
			if(confArray.length==1){
				confOBJ[confArray[0]]=eleType=="checkbox"?ele.checked:ele.value;
			}else{
				confOBJ[confArray[0]][confArray[1]]=eleType=="checkbox"?ele.checked:ele.value;
				suo.uibox(e);
			}		
		}else if(false){
			confOBJ[confArray[0]]=eleType=="checkbox"?ele.checked:ele.value;
		}
		suo.saveConf()
	},
	uibox:function(e){
		var ele=e.target;
		var confArray=suo.getConfArray(e);
		var theDom=ele.parentNode.querySelector("[data-confobj='"+confArray[0]+"|"+confArray[1]+"|"+ele.dataset.confele.split("|")[0]+"']");
		ele.checked?suo.domShow(theDom):suo.domHide(theDom);
	},
	changeRadio:function(e){
		var ele=e.target||e;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var confArray=getdata(ele).split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		confOBJ[ele.parentNode.dataset.confele]=ele.value;
		suo.saveConf();
	},
	changeSelect:function(e){
		var ele=e.target||e;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var confArray=getdata(ele).split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		confOBJ[ele.dataset.confele]=ele.value;
		suo.saveConf();
		return
	},
	changeCheckbox:function(e){
		var ele=e.target||e;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var confArray=getdata(ele).split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		confOBJ[ele.dataset.confele]=ele.checked;
		suo.saveConf();
	},
	changeRange:function(e){
		// let _value="";
		// if(e.target.dataset.confele=="opacity")
		e.target.nextSibling.textContent=e.target.value;
		if(e.target.dataset&&e.target.dataset.typechange=="actionedit"){return;}
		var confOBJ=suo.getConfOBJ(e);
		confOBJ[e.target.dataset.confele]=e.target.value;
		suo.saveConf();
	},
	changeFnswitch:function(e){
		var ele=e.target||e;
		var domOBJ=document.querySelector("#m-"+ele.dataset.confele.substr(2,ele.dataset.confele.length-2));
		if(ele.checked){
			suo.domShow(domOBJ);
			if(!config[ele.dataset.confele.substr(2)]){
				config[ele.dataset.confele.substr(2)]=defaultConf[ele.dataset.confele.substr(2)];
				suo.saveConf();
			}
			if(ele.dataset.confele.substr(2)=="drg"){
				suo.initListItem("t"+ele.dataset.confele.substr(2));
				suo.initListItem("l"+ele.dataset.confele.substr(2));
				suo.initListItem("i"+ele.dataset.confele.substr(2));
			}else{
				suo.initListItem(ele.dataset.confele.substr(2));
			}
		}else{
			suo.domHide(domOBJ);
		}
	},
	initListItem:function(type){
		console.log(type)
		domOBJ=document.querySelector(".ul_"+type);
		domOBJ.textContent="";
		var confOBJ,eleOBJ,actionType;
		switch(type){
			case"mges":
				confOBJ=config[type].actions;
				eleOBJ={setName:["className","title"],setValue:["item item_edit item_more item_"+type,suo.getI18n("tip_item")]};
				actionType=type//+"actions";
				break;
			case"idrg":
			case"tdrg":
			case"ldrg":
				confOBJ=config["drg"][type];
				eleOBJ={setName:["className","title"],setValue:["item item_edit item_more item-"+type,suo.getI18n("tip_item")]};
				actionType=type;
				break;
			case"txtengine":
			case"imgengine":
				confOBJ=config["general"]["engine"][type];
				eleOBJ={setName:["className"],setValue:["item item_edit item_engine item-"+type]};
				actionType=type;
				break;
		}
		for(var i=0;i<confOBJ.length;i++){
			var liOBJ=suo.domCreate2("li",eleOBJ,"","",{setName:["confid","actiontype",],setValue:[i,actionType?actionType:type]});
				// liOBJ.draggable=true;
			var liName=suo.domCreate2("span",{setName:["className"],setValue:["item_name item_edit"]},null,"",{setName:["confid","actiontype"],setValue:[i,actionType?actionType:type]},("txtengine imgengine".indexOf(type)!=-1)?confOBJ[i].name:((confOBJ[i].mydes&&confOBJ[i].mydes.type&&confOBJ[i].mydes.value)?confOBJ[i].mydes.value:suo.getI18n(confOBJ[i].name)));
			var liDel=suo.domCreate2("span",{setName:["className","title"],setValue:["item_del",suo.getI18n("tip_del")]},null,null,null,"x");
			liOBJ.appendChild(liName);
			liOBJ.appendChild(liDel);
			if("txtengine imgengine".indexOf(type)!=-1){
				//console.log(confOBJ[i])
			}else{
				var dirOBJ="";
				var myDeg={L:"0deg",U:"90deg",R:"180deg",D:"270deg"};
				//confOBJ[i].direct="undefined"
				var lidir=suo.domCreate2("span",{setName:["className"],setValue:["item_dir item_edit"]},null,(confOBJ[i].note&&confOBJ[i].note.value?"height:18px;line-height:18px;":null));
				for(var k=0;k<confOBJ[i].direct.length;k++){
					var _domImg=suo.domCreate2("img",{setName:["className"],setValue:["item_edit"]},null,"-webkit-transform:rotate("+myDeg[confOBJ[i].direct[k]]+");"+(confOBJ[i].note&&confOBJ[i].note.value?"height:16px;":""));
					_domImg.src="../image/direct.png";
					// _domImg.draggable="false";
					lidir.appendChild(_domImg);
				}

				// lidir.draggable=false;
				liOBJ.appendChild(lidir);
			}
			if(confOBJ[i].note&&confOBJ[i].note.value){
				var _note=suo.domCreate2("span",{setName:["className"],setValue:["item_note item_edit"]},null,null,null,confOBJ[i].note.value);
				liOBJ.appendChild(_note);
			}
			domOBJ.appendChild(liOBJ);
		}
	},
	itemEdit:function(confobj,confid,type,direct,actiontype){
		console.log(direct);
		console.log(confobj,confid,type,direct,actiontype)
		var type=type?type:"edit";
		var confArray=confobj.split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		var btnArray=["",suo.getI18n("btn_cancel"),suo.getI18n("btn_save")];
		var btnArrayDel=[suo.getI18n("btn_del"),suo.getI18n("btn_cancel"),suo.getI18n("btn_save")];
		if(type=="edit"&&(["mges","tdrg","ldrg","idrg","txtengine","imgengine"].contains(actiontype))){btnArray=btnArrayDel}
		var titleOBJ={
			newaction:suo.getI18n("title_newaction"),
			newengine:suo.getI18n("title_newengine"),
			editaction:suo.getI18n("title_editaction"),
			editengine:suo.getI18n("title_editengine"),
		}

		console.log(type)
		var boxOBJ=suo.initAPPbox(btnArray,[400,230],titleOBJ.editaction,"bg",actiontype);
			boxOBJ.dataset.confobj=confobj;
			boxOBJ.dataset.confid=confid;
			boxOBJ.dataset.close="";
		var actionType=actiontype||confArray[1];
		if(type=="edit"){
			confOBJ=confOBJ[confid];
		}else{
			var newOBJ={};
			if(["txtengine","imgengine"].contains(actionType)){
				newOBJ={name:"none",content:""}
			}else{
				!editDirect?newOBJ={name:"none"}:newOBJ={name:"none",direct:editDirect};
			}

			confOBJ[confOBJ.length]=newOBJ;
			confOBJ=confOBJ[confOBJ.length-1];
			//del last id
			boxOBJ.dataset.close="dellast";
		}
		console.log(confOBJ)
		console.log(actiontype)
		var domContent=boxOBJ.querySelector(".box_content");
		direct=direct?direct:(!confOBJ.direct?"":confOBJ.direct);
		console.log(direct)
		var actionArray=["mgesactions","tdrgactions","ldrgactions","idrgactions","mges","tdrg","ldrg","idrg"]

		if(["txtengine","imgengine"].contains(actionType)){
			console.log("engines")
			//name
			domContent.appendChild(suo.domCreate2("label",{setName:["className"],setValue:["box-label"]},null,null,null,suo.getI18n("con_name")));
			domContent.appendChild(suo.domCreate2("input",{setName:["className","type","value"],setValue:["box_text","text",!confOBJ.name?"":confOBJ.name]}));
			domContent.appendChild(suo.domCreate2("br"));
			//url
			domContent.appendChild(suo.domCreate2("label",{setName:["className"],setValue:["box-label"]},null,null,null,suo.getI18n("n_content")));
			domContent.appendChild(suo.domCreate2("textarea",{setName:["className","type","value"],setValue:["box-textarea","textarea",!confOBJ.content?"":confOBJ.content]},"","width:330px;height:160px;margin-top:10px;"));
			var domDes=boxOBJ.querySelector(".box_des");
				domDes.style.cssText+="display:block;";
				domDes.querySelector("ul").appendChild(suo.domCreate2("li","",null,null,null,"content: use %s to instead of keywords/image url. you may find some search engines from: chrome://settings/searchEngines."));
		}else if(actionArray.contains(actionType)){
			var actionBox=suo.domCreate2("div",{setName:["className"],setValue:["actionbox"]});
			var actionType=actionType;
			var actionName=confOBJ.name;

			actionBox.appendChild(suo.itemAction(confOBJ,actionType));
			actionBox.appendChild(suo.itemDes(confOBJ));
			actionBox.appendChild(suo.itemMore(confOBJ,actiontype));
			domContent.appendChild(actionBox);

			var _rightbox=suo.domCreate2("div",{setName:["className"],setValue:["otherbox"]});

				console.log(confOBJ)
				var lineBox=suo.domCreate2("div",{setName:["className"],setValue:["linebox"]});
				//lineBox.appendChild(suo.itemDirect(direct,actionType));
				lineBox.appendChild(suo.itemDirect(confOBJ,actiontype,direct));
				_rightbox.appendChild(lineBox);				
			

			var noteBox=suo.domCreate2("div",{setName:["className"],setValue:["notebox"]});
			noteBox.appendChild(suo.itemNote(confOBJ,actionType));
			_rightbox.appendChild(noteBox);

			domContent.appendChild(_rightbox);
			domContent.appendChild(suo.domCreate2("div","","","clear:both;"));
			//\\
		}
		//document.body.appendChild(boxOBJ);
		suo.initPos(boxOBJ);
	},
	initPos:function(dom){
		document.body.appendChild(dom);
		var _height=window.getComputedStyle(dom).height,
			_width=window.getComputedStyle(dom).width;
			_height=parseInt(_height.substr(0,_height.length-2));
			_width=parseInt(_width.substr(0,_width.length-2));
		dom.style.cssText+="left:"+(window.innerWidth-_width)/2+"px;";
		var boxBGOBJ=document.documentElement.appendChild(suo.domCreate2("div",{setName:["className"],setValue:["box_bg"]}));
		window.setTimeout(function(){
			dom.style.cssText+="opacity:.98;top:"+(window.innerHeight-_height)/2+"px;";
			boxBGOBJ?boxBGOBJ.style.cssText+="opacity:.8;":null;
		},200)
	},
	tabSwitch:function(e){
		console.log("tabSwitch");
		let dom=suo.getAPPboxEle(e);
		let tabId=e.target.dataset.tab;
		let domTabs=dom.querySelectorAll(".box_tab>.box_tabtitle"),
			domLists=dom.querySelectorAll(".box_tabbox>.box_tablist");
		console.log(domTabs)
		for(var i=0;i<domTabs.length;i++){
			if(domTabs[i].dataset.tab==tabId){
				domTabs[i].classList.add("box_tabtitleactive");
			}else{
				domTabs[i].classList.remove("box_tabtitleactive");
			}
		}
		for(var i=0;i<domLists.length;i++){
			if(domLists[i].dataset.tab==tabId){
				domLists[i].classList.add("box_tablistactive");
			}else{
				domLists[i].classList.remove("box_tablistactive");
			}
		}
	},
	itemNote:function(confOBJ,type){
		var dom=suo.domCreate2("div");
		var notevalue=confOBJ.note?confOBJ.note.value:"";
		var notetype=confOBJ.note?confOBJ.note.type:true;
		let _span=suo.domCreate2("span",null,null,null,null,suo.getI18n("con_notename")),
			_brSpan=suo.domCreate2("br"),
			_textarea=suo.domCreate2("textarea",{setName:["className"],setValue:["box_notevalue"]},null,null,null,notevalue),
			_brTextarea=suo.domCreate2("br"),
			_check=suo.domCreate2("input",{setName:["id","type","checked"],setValue:["box_note","checkbox",notetype?true:false]}),
			_label=suo.domCreate2("label",{setName:["for"],setValue:["box_note"]},null,null,null,suo.getI18n("con_notechk"));
		dom.appendChild(_span);
		dom.appendChild(_brSpan);
		dom.appendChild(_textarea);
		dom.appendChild(_brTextarea);
		dom.appendChild(_check);
		dom.appendChild(_label);
		return dom;
	},
	itemDirect:function(confOBJ,actiontype,direct){
		console.log(confOBJ)
		var direct=direct?direct:confOBJ.direct;
		var OBJ=suo.domCreate2("div",{setName:["className"],setValue:["box_direct"]},"","",{setName:["direct"],setValue:[direct]});
		//edit icon
		var actionArray=["mgesactions","tdrgactions","ldrgactions","idrgactions","mges","tdrg","idrg","ldrg"]
		if(actionArray.contains(actiontype)){
			var editOBJ=suo.domCreate2("img",{setName:["className","title","src"],setValue:["box_diredit",suo.getI18n("tip_editdir"),"../image/edit.svg"]});
			OBJ.appendChild(editOBJ);			
		}
		//direct icon
		if(direct){
			var myDeg={L:"0deg",l:"45deg",U:"90deg",u:"135deg",R:"180deg",r:"225deg",D:"270deg",d:"315deg"};
			for(var i=0;i<direct.length;i++){
				var dirimg=suo.domCreate2("img",{setName:["className","src"],setValue:["boxdirectimg","../image/direct.png"]},"","/*background-color:#000;*/-webkit-transform:rotate(+"+myDeg[direct[i]]+")");
				if(["l","u","r","d"].contains(direct)){
					var dirbox=suo.domCreate2("div",{setName:["className"],setValue:["dirbox"]});
					dirbox.appendChild(dirimg);
					OBJ.appendChild(dirbox);
				}else{
					OBJ.appendChild(dirimg);
				}
			}
		}
		return OBJ;
	},
	//confOBJ,actionType
	itemAction:function(confOBJ,actionType){
		console.log(actions);
		console.log("actionType:"+actionType+";actionValue:"+confOBJ.name);
		var valueOBJ={setName:["name","className"],setValue:[actionType,"box_select actionselect"]};
		var domSelect=suo.domCreate2("select",valueOBJ,null,null,{setName:["actiontype"],setValue:[actionType]});//edom,eele,einner,ecss,edata,etxt
		var flag=0,index=0;
		for(var i=0;i<actions[actionType+"_group"].length;i++){
			var domOptgroup=suo.domCreate2("optgroup",{setName:["label"],setValue:[suo.getI18n(actions[actionType+"_group"][i])]});
			for(var j=0;j<actions[actionType][i].length;j++){
				var domOption=suo.domCreate2("option",{setName:["value"],setValue:[actions[actionType][i][j]["name"]]},null,null,null,suo.getI18n(actions[actionType][i][j]["name"]));
				domOptgroup.appendChild(domOption);
				if(confOBJ.name==actions[actionType][i][j]["name"]){index=flag;}
				flag+=1;
			}
			domSelect.appendChild(domOptgroup);
		}
		domSelect.selectedIndex=index;
		return domSelect;
	},
	itemAction2:function(confOBJ,actionType){
		let dom=suo.domCreate2("div",{setName:["className"],setValue:["box_action"]});

		var valueOBJ={setName:["name","className"],setValue:[actionType,"box_select actionselect"]};
		var domSelect=suo.domCreate2("select",valueOBJ,null,null,{setName:["actiontype"],setValue:[actionType]});//edom,eele,einner,ecss,edata,etxt
		var flag=0,index=0;
		for(var i=0;i<actions[actionType+"_group"].length;i++){
			var domOptgroup=suo.domCreate2("optgroup",{setName:["label"],setValue:[suo.getI18n(actions[actionType+"_group"][i])]});
			for(var j=0;j<actions[actionType][i].length;j++){
				var domOption=suo.domCreate2("option",{setName:["value"],setValue:[actions[actionType][i][j]["name"]]},null,null,null,suo.getI18n(actions[actionType][i][j]["name"]));
				domOptgroup.appendChild(domOption);
				if(confOBJ.name==actions[actionType][i][j]["name"]){index=flag;}
				flag+=1;
			}
			domSelect.appendChild(domOptgroup);
		}
		domSelect.selectedIndex=index;

		dom.appendChild(domSelect);
		return dom;
	},
	itemOption:function(confOBJ,actionType){
		// fix new added options of actions dont show and delete droped options.
		var conf=JSON.parse(JSON.stringify(confOBJ));
		for(var i=0;i<actions[actionType].length;i++){
			for(var ii=0;ii<actions[actionType][i].length;ii++){
				if(actions[actionType][i][ii].name==conf.name){
					var arrayConfType=["selects","texts","checks","ranges","radios"];
					for(var act in arrayConfType){
						if(actions[actionType][i][ii][arrayConfType[act]]){
							var _arrayConf=[],
								_arrayModel=[];
							for(var jj=0;conf[arrayConfType[act]]&&jj<conf[arrayConfType[act]].length;jj++){
								_arrayConf.push(conf[arrayConfType[act]][jj].type);
							}

							for(var jj=0;jj<actions[actionType][i][ii][arrayConfType[act]].length;jj++){
								_arrayModel.push(actions[actionType][i][ii][arrayConfType[act]][jj]);
							}

							for(var j=0;j<actions[actionType][i][ii][arrayConfType[act]].length;j++){
								if(conf[arrayConfType[act]]){
									if(!_arrayConf.contains(actions[actionType][i][ii][arrayConfType[act]][j])){
										conf[arrayConfType[act]].push({type:actions[actionType][i][ii][arrayConfType[act]][j]});
									}
								}else{
									if(!conf[arrayConfType[act]]){conf[arrayConfType[act]]=[]}
									conf[arrayConfType[act]].push({type:actions[actionType][i][ii][arrayConfType[act]][j]});
								}
							}

							for(var j=0;conf[arrayConfType[act]]&&j<conf[arrayConfType[act]].length;j++){
								if(!_arrayModel.contains(conf[arrayConfType[act]][j].type)){
									conf[arrayConfType[act]].splice(j,1);
								}
							}
						}else{
							delete conf[arrayConfType[act]];
						}
					}
					break;
				}				
			}
		}
		console.log(conf);

		var dom=suo.domCreate2("div",{setName:["className"],setValue:["box_option box_more"]});

		var domDes=suo.domCreate2("div",{setName:["className"],setValue:["box_desbox"]});
		// var spacelabel=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},"");
		// var spacelabel2=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},"");
		var checkbox=suo.domCreate2("input",{setName:["id","className","type"],setValue:["box_mydes","box_desck","checkbox"]});
			checkbox.checked=conf.mydes?conf.mydes.type:false;
		var checklabel=suo.domCreate2("label","",null,null,null,suo.getI18n("tip_actionname"));
		var destext=suo.domCreate2("input",{setName:["id","className","type","value"],setValue:["mydestext","box_destext","text",conf.mydes?conf.mydes.value:""]});
		if(!conf.mydes||!conf.mydes.type){
			destext.style.display="none";
		}
		checklabel.setAttribute("for","box_mydes");
		domDes.appendChild(checkbox);
		domDes.appendChild(checklabel);
		domDes.appendChild(suo.domCreate2("br"));
		domDes.appendChild(destext);
		dom.appendChild(domDes);

		if(conf.texts){
			for(var i=0;i<conf.texts.length;i++){
				if(conf.texts[i].type=="n_mail_domain"){
					var _css,_class;
					console.log(conf.selects[0].value)
					if(conf.selects[0].value=="s_gmailapps"){
						_css="display:inline-block;";
						_class="confix confix-no";
					}else{
						_css="display:none;";
						_class="confix confix-yes"
					}
					var domText=suo.createMoreText(conf.texts[i]);
						domText.className=_class;
						domText.style.cssText+=_css;
					dom.appendChild(domText);
					continue;
				}
				dom.appendChild(suo.createMoreText(conf.texts[i]));
			}
		}
		if(conf.selects){
			for(var i=0;i<conf.selects.length;i++){
				dom.appendChild(suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},null,null,null,suo.getI18n(conf.selects[i].type)));
				dom.appendChild(suo.createMoreSelect(conf.selects[i].type,conf.selects[i].value,conf));
				dom.appendChild(suo.domCreate2("br"));
			}
		}
		if(conf.ranges){
			console.log("range")
			for(var i=0;i<conf.ranges.length;i++){
				dom.appendChild(suo.createMoreRange(conf.ranges[i]));
			}
		}
		if(conf.checks){
			for(var i=0;i<conf.checks.length;i++){
				dom.appendChild(suo.createMoreCheck(conf.checks[i]));
			}
		}
		if(conf.radios){
			for(var i=0;i<conf.radios.length;i++){
				dom.appendChild(suo.createMoreRadio(conf.radios[i]));
			}
		}
		return dom;
	},
	itemMore:function(confOBJ,actionType){
		console.log(confOBJ)
		console.log(actionType);
		var conf=JSON.parse(JSON.stringify(confOBJ));

		// fix new added options of actions dont show and delete droped options.
		for(var i=0;i<actions[actionType].length;i++){
			for(var ii=0;ii<actions[actionType][i].length;ii++){
				if(actions[actionType][i][ii].name==conf.name){
					var arrayConfType=["selects","texts","checks","ranges","radios"];
					for(var act in arrayConfType){
						if(actions[actionType][i][ii][arrayConfType[act]]){
							var _arrayConf=[],
								_arrayModel=[];
							for(var jj=0;conf[arrayConfType[act]]&&jj<conf[arrayConfType[act]].length;jj++){
								_arrayConf.push(conf[arrayConfType[act]][jj].type);
							}

							for(var jj=0;jj<actions[actionType][i][ii][arrayConfType[act]].length;jj++){
								_arrayModel.push(actions[actionType][i][ii][arrayConfType[act]][jj]);
							}

							for(var j=0;j<actions[actionType][i][ii][arrayConfType[act]].length;j++){
								if(conf[arrayConfType[act]]){
									if(!_arrayConf.contains(actions[actionType][i][ii][arrayConfType[act]][j])){
										conf[arrayConfType[act]].push({type:actions[actionType][i][ii][arrayConfType[act]][j]});
									}
								}else{
									if(!conf[arrayConfType[act]]){conf[arrayConfType[act]]=[]}
									conf[arrayConfType[act]].push({type:actions[actionType][i][ii][arrayConfType[act]][j]});
								}
							}

							console.log(_arrayModel)
							for(var j=0;conf[arrayConfType[act]]&&j<conf[arrayConfType[act]].length;j++){
								if(!_arrayModel.contains(conf[arrayConfType[act]][j].type)){
									conf[arrayConfType[act]].splice(j,1);
								}
							}
						}else{
							delete conf[arrayConfType[act]];
						}
					}
					break;
				}				
			}
		}

		console.log(conf);

		var domMore=suo.domCreate2("div",{setName:["className"],setValue:["box_more"]});
		if(conf.texts){
			for(var i=0;i<confOBJ.texts.length;i++){
				if(confOBJ.texts[i].type=="n_mail_domain"){
					var _css,_class;
					console.log(confOBJ.selects[0].value)
					if(confOBJ.selects[0].value=="s_gmailapps"){
						_css="display:inline-block;";
						_class="confix confix-no";
					}else{
						_css="display:none;";
						_class="confix confix-yes"
					}
					var domText=suo.createMoreText(confOBJ.texts[i]);
						domText.className=_class;
						domText.style.cssText+=_css;
					domMore.appendChild(domText);
					continue;
				}
				domMore.appendChild(suo.createMoreText(confOBJ.texts[i]));
			}
		}
		if(conf.selects){
			for(var i=0;i<conf.selects.length;i++){
				domMore.appendChild(suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},null,null,null,suo.getI18n(conf.selects[i].type)));
				domMore.appendChild(suo.createMoreSelect(conf.selects[i].type,conf.selects[i].value,conf));
				domMore.appendChild(suo.domCreate2("br"));
			}
		}
		if(conf.ranges){
			console.log("range")
			console.log(conf);
			for(var i=0;i<conf.ranges.length;i++){
				domMore.appendChild(suo.createMoreRange(conf.ranges[i]));
			}
		}
		if(conf.checks){
			console.log(conf.checks);
			for(var i=0;i<conf.checks.length;i++){
				console.log("%c"+conf.checks[i].type,"color:green;font-size:16px;");
				console.log(actionOptions.checks[conf.checks[i].type])
				if(actionOptions.checks[conf.checks[i].type]!=undefined){
					console.log("%c"+conf.checks[i].type,"color:blue;font-size:16px;");
					domMore.appendChild(suo.createMoreCheck(conf.checks[i]))
				}else{
					console.log(conf.checks[i].type);
					// domMore.appendChild(suo.createMoreCheck(conf.checks[i]))
					conf.checks.splice(i,1);
				}
			}
		}
		if(conf.radios){
			for(var i=0;i<conf.radios.length;i++){
				domMore.appendChild(suo.createMoreRadio(conf.radios[i]));
			}
		}
		return domMore;
	},
	itemDes:function(confOBJ){
		//if(!confOBJ.mydes){return ""}
		var desbox=suo.domCreate2("div",{setName:["className"],setValue:["box_desbox"]});
		var spacelabel=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},"");
		var spacelabel2=suo.domCreate2("label",{setName:["className"],setValue:["boxlabel"]},"");
		var checkbox=suo.domCreate2("input",{setName:["id","className","type"],setValue:["box_mydes","box_desck","checkbox"]});
			checkbox.checked=confOBJ.mydes?confOBJ.mydes.type:false;
		var checklabel=suo.domCreate2("label","",null,null,null,suo.getI18n("tip_actionname"));
		var destext=suo.domCreate2("input",{setName:["id","className","type","value"],setValue:["mydestext","box_destext","text",confOBJ.mydes?confOBJ.mydes.value:""]});
		if(!confOBJ.mydes||!confOBJ.mydes.type){
			destext.style.display="none";
		}

		checklabel.setAttribute("for","box_mydes");
		desbox.appendChild(checkbox);
		desbox.appendChild(checklabel);
		desbox.appendChild(suo.domCreate2("br"));
		desbox.appendChild(destext);
		return desbox;		
	},
	itemSave:function(e){
		var ele=e.target;
		var dom=suo.getDataset(ele,"confobj","ele");
		var confArray=suo.getDataset(ele,"confobj","value").split("|");
		var confid=suo.getDataset(ele,"confid","value");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		confOBJ=confOBJ[confid];
		console.log(confOBJ)

		//fix blank
		var fixText=dom.querySelectorAll("input[type=text]"),
			fixTextarea=dom.querySelectorAll("textarea");
		for(var i=0;i<fixText.length;i++){
			if(!fixText[i].classList.contains("box_destext")){
				if(fixText[i].parentNode.classList.contains("confix")&&fixText[i].parentNode.classList.contains("confix-yes")){
				}else if(!fixText[i].value){
					suo.showMsgBox(suo.getI18n("msg_blank"),"warning",5,1000);
					console.log("error")
					return;
				}
			}
		}
		for(var i=0;i<fixTextarea.length;i++){
			if(!fixTextarea[i].value&&!fixTextarea[i].classList.contains("box_notevalue")){
				console.log("blank")
				suo.showMsgBox(suo.getI18n("msg_blank"),"warning",5,1000);
				return;
			}
		}
		if(confArray[1]=="engine"){
			var _name=dom.querySelectorAll(".box_content input[type=text]")[0].value;
			var _content=suo.fixURL(dom.querySelector(".box_content textarea").value);
			confOBJ.name=_name;
			confOBJ.content=_content;
		}else{
			var theAction=dom.querySelector(".box_content .actionselect").value;

			//name
			confOBJ.name=theAction;
			
			//direct
			confOBJ.direct=dom.querySelector(".box_direct")?dom.querySelector(".box_direct").dataset.direct:confOBJ.direct;
			!confOBJ.direct?(delete confOBJ.direct):null;

			//mydes
			var theDes={};
			theDes.type=dom.querySelector(".box_content .box_desck").checked;
			theDes.value=dom.querySelector(".box_content .box_destext").value;
			if(theDes.value){
				confOBJ.mydes=theDes;
			}else{
				confOBJ.mydes?(delete confOBJ.mydes):null;
			}
			//confOBJ.mydes=theDes;

			//note
			var domNote=dom.querySelector(".box_content #box_note");
			if(domNote){
				var theNote={};
				theNote.type=dom.querySelector(".box_content #box_note").checked;
				theNote.value=dom.querySelector(".box_content .box_notevalue").value;
				if(theNote.value){
					confOBJ.note=theNote;
				}else{
					confOBJ.note?(delete confOBJ.note):null;
				}
			}

			//selects
			var theSelects=[];
			var selectsOBJ=dom.querySelectorAll(".box_more select.box_select");
			for(var i=0;i<selectsOBJ.length;i++){
				var thisOBJ={};
				thisOBJ.type=selectsOBJ[i].name;
				thisOBJ.type.indexOf("search")!=-1?thisOBJ.value=selectsOBJ[i].selectedIndex:thisOBJ.value=selectsOBJ[i].value;
				theSelects.push(thisOBJ);
			}
			if(theSelects.length>0){
				confOBJ.selects=theSelects;
			}else{
				confOBJ.selects?(delete confOBJ.selects):null;
			}
			//confOBJ.selects=theSelects;

			//texts
			var theTexts=[];
			var textsOBJ=dom.querySelectorAll(".box_more input.box_text");
			for(var i=0;i<textsOBJ.length;i++){
				var thisOBJ={};
				thisOBJ.type=textsOBJ[i].name;
				if(thisOBJ.type=="n_url"){
					thisOBJ.value=suo.fixURL(textsOBJ[i].value);
				}else{
					thisOBJ.value=textsOBJ[i].value;
				}
				theTexts.push(thisOBJ);
			}
			if(theTexts.length>0){
				confOBJ.texts=theTexts;
			}else{
				confOBJ.texts?(delete confOBJ.texts):null;
			}
			//confOBJ.texts=theTexts;

			//checks
			var theChecks=[];
			var checksOBJ=dom.querySelectorAll(".box_more .box_check[type=checkbox]");
			for(var i=0;i<checksOBJ.length;i++){
				var _confobj={};
					_confobj.type=checksOBJ[i].name;
					_confobj.value=checksOBJ[i].checked;
				var _checkList=checksOBJ[i].parentNode.querySelector(".box_checklist");

				if(_confobj.value&&_checkList){
					if(_checkList.querySelector("input[type=radio]")){ // check with radio
						_confobj.typeCheck="radio";
						_confobj.valueOption=_checkList.querySelector("input[type=radio]:checked").value;
						var _radioList=_checkList.querySelector("input[type=radio]:checked").parentNode.querySelector(".box_radiolist");
						if(_radioList){
							if(_radioList.querySelector("select")){
								_confobj.valueSetting=_radioList.querySelector("select").value;
							}else{
								_confobj.valueSetting=_radioList.querySelector("input").value;
							}
						}
					}else if(_checkList.querySelector("select")){ // check with select
						_confobj.typeCheck="select";
						_confobj.valueOption=_checkList.querySelector("select").value;
					}else if(_checkList.querySelector("input")){ // check with text/range
						_confobj.typeCheck=_checkList.querySelector("input").type;
						_confobj.valueOption=_checkList.querySelector("input").value;
					}
				}
				console.log(_confobj);
				theChecks.push(_confobj);
			}
			if(theChecks.length>0){
				confOBJ.checks=theChecks;
			}else{
				confOBJ.checks?(delete confOBJ.checks):null;
			}

			//ranges
			var theRanges=[];
			var rangesOBJ=dom.querySelectorAll(".box_optionlist>input[type=range]");
			for(var i=0;i<rangesOBJ.length;i++){
				var thisOBJ={};
				thisOBJ.type=rangesOBJ[i].name;
				thisOBJ.value=rangesOBJ[i].value;
				theRanges.push(thisOBJ);
			}
			if(theRanges.length>0){
				confOBJ.ranges=theRanges;
			}else{
				confOBJ.ranges?(delete confOBJ.ranges):null;
			}
			//confOBJ.ranges=theRanges;

			var codeCtrlOBJ=dom.querySelector(".box_key #box_ctrl"),
				codeAltOBJ=dom.querySelector(".box_key #box_alt"),
				codeShiftOBJ=dom.querySelector(".box_key #box_shift");
			codeCtrlOBJ?confOBJ.ctrl=codeCtrlOBJ.checked:null;
			codeAltOBJ?confOBJ.alt=codeAltOBJ.checked:null;
			codeShiftOBJ?confOBJ.shift=codeShiftOBJ.checked:null;

			// radio
			var theRadios=[],
				radiosOBJ=dom.querySelectorAll(".box_radio");
			for(var i=0;i<radiosOBJ.length;i++){
				var _checkRadio=radiosOBJ[i].querySelector("input.box_radiooption[type=radio]:checked");
				var _confobj={};
					_confobj.type=_checkRadio.name;
					_confobj.value=_checkRadio.value;
				var _radioList=_checkRadio.parentNode.querySelector(".box_radiolist");

				if(_confobj.value&&_radioList){
					if(_radioList.querySelector("select")){ // radio with select
						_confobj.typeRadio="select";
						_confobj.valueSetting=_radioList.querySelector("select").value;
					}else if(_radioList.querySelector("input")){ // radio with text/range
						_confobj.typeRadio=_radioList.querySelector("input").type;
						_confobj.valueSetting=_radioList.querySelector("input").value;
					}
				}
				theRadios.push(_confobj);
			}
			if(theRadios.length>0){
				confOBJ.radios=theRadios;
			}else{
				confOBJ.radios?(delete confOBJ.radios):null;
			}
			console.log(confOBJ)
			// return;
		}
		suo.saveConf();
		editMode=false;
		console.log(confArray);
		var actionType=suo.getDataset(e,"actiontype","value");
		if(actionType){
			console.log(actionType)
			suo.initListItem(actionType);
			suo.boxClose2(e);
			return
		}
		if(!["tdrg","idrg","ldrg","mges"].contains(confArray[1])){
			suo.initListItem(confArray[2])
		}else{
			suo.initListItem(confArray[1])
		}
		suo.boxClose2(e);
	},
	domShow:function(ele,time){
		var time=time?time:0.4;
		ele.style.cssText+="display:block;z-index:1;opacity:0;";
		window.setTimeout(function(){
			ele.style.cssText+="transition:all "+time+"s ease-in-out;opacity:1;";
		},10)
		window.setTimeout(function(){
			ele.style.cssText+="transition:none;"
		},time*1000)
	},
	domHide:function(ele,time){
		var time=time?time:0.4;
		ele.style.cssText+="transition:all "+time+"s ease-in-out;";
		window.setTimeout(function(){
			ele.style.cssText+="opacity:0;"
		},10)
		window.setTimeout(function(){
			ele.style.cssText+="display:none;transition:none;"
		},time*1000)
	},
	boxClose2:function(e,type){
		console.log("boxClose2")
		editMode=false;
		var domBoxBG=document.querySelector(".box_bg");
		var theEle=suo.getAPPboxEle(e);
		var closeArray=theEle.dataset.close?theEle.dataset.close.split("|"):[];
		domBoxBG?domBoxBG.style.cssText+="transition:all .4s ease-in-out;opacity:0;":null;
		theEle.style.cssText+="transition:all .4s ease-in-out;top:0;opacity:0;";
		if(closeArray.contains("dellast")&&type=="cancel"){
			var confArray=theEle.dataset.confobj.split("|");
			var confOBJ=config;
			for(var i=0;i<confArray.length;i++){
				confOBJ=confOBJ[confArray[i]];
			}
			confOBJ.length=confOBJ.length-1;
		}
		if(closeArray.contains("resetdirect")){
			editDirect="";
		}
		window.setTimeout(function(){
			domBoxBG?domBoxBG.remove():null;
			theEle.remove();
		},400)
	},
	actionChange2:function(e){
		//suo.getI18n(
		var ele=e.target;
		var getdata=function(ele){
			if(ele.dataset.confobj){
				return ele.dataset.confobj;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var getele=function(ele){
			if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
				return ele;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		var boxdom=getele(ele);
		var confArray=getdata(ele).split("|");
		var confOBJ=config;
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		//console.log(confArray[confArray.length-2]);

		var theOBJ={};
			theOBJ.mydes={type:false,value:""};
			theOBJ.selects=[];
			theOBJ.texts=[];
			theOBJ.checks=[];
			theOBJ.name=e.target.options[e.target.selectedIndex].value;
		console.log(theOBJ.name);
		//var actionType=confArray[confArray.length-2];
		if(e.target.dataset.actiontype){
			actionType=e.target.dataset.actiontype;
		}else{
			var actionType=confArray[confArray.length-1];
		}
		console.log(actionType);

		for(var i=0;i<actions[actionType].length;i++){
			for(var ii=0;ii<actions[actionType][i].length;ii++){
				if(actions[actionType][i][ii].name==e.target.options[e.target.selectedIndex].value){
					if(actions[actionType][i][ii].selects){
						for(var j=0;j<actions[actionType][i][ii].selects.length;j++){
							if(!theOBJ.selects){theOBJ.selects=[]}
							theOBJ.selects.push({type:actions[actionType][i][ii].selects[j]})
						}
					}
					if(actions[actionType][i][ii].texts){
						for(var j=0;j<actions[actionType][i][ii].texts.length;j++){
							if(!theOBJ.texts){theOBJ.texts=[]}
							theOBJ.texts.push({type:actions[actionType][i][ii].texts[j]})
						}
					}
					if(actions[actionType][i][ii].checks){
						for(var j=0;j<actions[actionType][i][ii].checks.length;j++){
							if(!theOBJ.checks){theOBJ.checks=[]}
							theOBJ.checks.push({type:actions[actionType][i][ii].checks[j]/*,value:actionOptions.checks*/})
						}
					}
					if(actions[actionType][i][ii].ranges){
						for(var j=0;j<actions[actionType][i][ii].ranges.length;j++){
							if(!theOBJ.ranges){theOBJ.ranges=[]}
							theOBJ.ranges.push({type:actions[actionType][i][ii].ranges[j]})
						}
					}
					theOBJ.mydes={}
					theOBJ.mydes.type=false;
					theOBJ.mydes.value="";
					suo.itemMore(theOBJ,actionType);
					break;
				}				
			}
		}
		
		var oldBox=getele(ele).querySelectorAll(".actionbox .box_more");
		for(var i=0;i<oldBox.length;i++){
			oldBox[i].remove();
		}
		if(boxdom.querySelector(".actionbox .box_desbox")){
			boxdom.querySelector(".actionbox .box_desbox").remove();
			// boxdom.querySelector("#mydesbox #mydes").checked=false;
			// boxdom.querySelector("#mydesbox #mydestext").value="";
			// boxdom.querySelector("#mydesbox #mydestext").style.display="none";
		}
		if(getele(ele).querySelector(".actionbox")){
			getele(ele).querySelector(".actionbox").appendChild(suo.itemDes(theOBJ));
			getele(ele).querySelector(".actionbox").appendChild(suo.itemMore(theOBJ,actionType));
		}else if(getele(ele).querySelector(".box_option")){
			getele(ele).querySelector(".box_option").innerHTML="";
			getele(ele).querySelector(".box_option").appendChild(suo.itemOption(theOBJ,actionType));
		}
		return;
	},
	initEnd:function(){
		suo.fixSizePos();
		// document.querySelector("#ext_ver").innerText=chrome.runtime.getManifest().version;
		// document.querySelector("#nav_txt").innerText=suo.getI18n("ext_name");
		document.title=suo.getI18n("opt_title")+" - "+suo.getI18n("ext_name");
		
		document.querySelector("#main").style.cssText+="opacity:1;transition:all .9s ease-in-out;display:block;";

		document.querySelector("#loadingbox").style.cssText+="opacity:0;"
		window.setTimeout(function(){
			document.querySelector("#loadingbox").remove();
			suo.cons.menuPin?null:suo.menuBarCreate();
		},400)

		//init webstore url
		if(browserType=="cr"){
			if(devMode){
				suo.cons.webstoreURL="https://chrome.google.com/webstore/detail/jbfidehpoofganklkddfkcjeeaabimmb";
			}else{
				suo.cons.webstoreURL="https://chrome.google.com/webstore/detail/bgjfekefhjemchdeigphccilhncnjldn";
			}
		}else if(browserType=="fx"){
			suo.cons.webstoreURL="https://addons.mozilla.org/firefox/addon/smartup";
		}else if(browserType=="edg"){
			suo.cons.webstoreURL="https://microsoftedge.microsoft.com/addons/detail/elponhbfjjjihgeijofonnflefhcbckp";
		}

		//browsersettings
		if(browserType!="fx"){
			document.querySelector("[data-confele=mouseup]").disabled=true;
		}
		(chrome.browserSettings&&chrome.browserSettings.contextMenuShowEvent)?chrome.browserSettings.contextMenuShowEvent.get({}).then(function(result){
			console.log(result.value);
			if(result.value=="mouseup"){
				config.general.linux.cancelmenu=false;
				//suo.saveConf2();
				document.querySelector("[data-confele=cancelmenu]").disabled=true;
			}
		}):null
	},
	fixURL:function(url){
		//if()
		var fixstrs=["file:///","extension://","http://","https://","ftp://","chrome://","edge://","chrome-extension://","view-source:chrome-extension://","moz-extension://","about://","about:"];
		var theFlag=false;
		for(var i=0;i<fixstrs.length;i++){
			if(url.indexOf(fixstrs[i])==0){
				theFlag=true;
				break;
			}
		}
		if(!theFlag){
			return "http://"+url;
		}else{
			return url;
		}
	},
	menuBarRemove:function(){
		var bgOBJ=document.querySelector("#menu_bg");
		var menuOBJ=document.querySelector("menu");
		if(bgOBJ){
			bgOBJ.style.cssText+="background-color:rgba(0,0,0,0);";
			window.setTimeout(function(){
				bgOBJ.remove();
			},400)
		}
		menuOBJ.style.cssText+="left:-350px;"
		document.querySelector("menu #menu_logo").style.cssText+="margin-left:0;";
		document.querySelector("menu #menu_name").style.cssText+="display:none;opacity:0;";
		//document.querySelector("nav #nav_txt").style.cssText+="margin-left:58px;"
		suo.fixSizePos()
	},
	menuBarCreate:function(){
		if(window.getComputedStyle(document.querySelector("#menu_topbox")).display=="none"){
			document.querySelector("#menu_topbox").style.cssText+="display:block;";
		}

		document.body.appendChild(suo.domCreate2("div",{setName:["id"],setValue:["menu_bg"]},"","background-color:rgba(0,0,0,.8);"));
		document.querySelector("menu").style.cssText+="left:0;top:0;";
		document.querySelector("menu #menu_logo").style.cssText+="margin-left:180px;";
		//document.querySelector("nav #nav_txt").style.cssText+="margin-left:268px;";
		window.setTimeout(function(){
			document.querySelector("menu #menu_name").style.cssText+="display:inline;"
			document.querySelector("menu #menu_name").style.cssText+="opacity:1;";
			
		},800)
	},
	initSizePos:function(){
		var mainOBJ=document.querySelector("#main");
		suo.cons.sizePos.mainWidth=Math.max(window.innerWidth*0.7,420);
		suo.cons.sizePos.mainHeight=Math.min(Math.max(window.innerHeight-300,350),800);
		suo.cons.sizePos.mainMinHeight=(window.innerHeight-200)<200?0:450;

		if(suo.cons.menuPin){
			suo.cons.sizePos.mainPosX=(window.innerWidth+260-suo.cons.sizePos.mainWidth)/2;
		}else{
			suo.cons.sizePos.mainPosX=(window.innerWidth-suo.cons.sizePos.mainWidth)/2;	
		}
		suo.cons.sizePos.btn_add_right=(window.innerWidth-Math.abs(window.getComputedStyle(mainOBJ).width.substr(0,window.getComputedStyle(mainOBJ).width.length-2)))/2-56-20;
		suo.cons.sizePos.btn_add_right=suo.cons.menuPin?suo.cons.sizePos.btn_add_right-130:suo.cons.sizePos.btn_add_right;

		//document.querySelector("smartup.su_apps").style.cssText+="top:0;left:"+(innerWidth-400)/2+"px;"
	},
	fixSizePos:function(){
		suo.cons.menuPin=window.innerWidth>900?true:false;
		suo.initSizePos();
		if(suo.cons.menuPin){
			//document.querySelector("#pin").style.cssText+="background:#d0d9ff;border-radius:100%;opacity:.8;";
			document.querySelector("#menu_topbox").style.display="none";
		}else{
			//document.querySelector("#pin").style.cssText+="background:rgba(255,255,255,0);border-radius:0;opacity:.5;";
			document.querySelector("#menu_topbox").style.display="block";
		}
		var mainOBJ=document.querySelector("#main");
		document.querySelector("#main").style.cssText+="width:"+suo.cons.sizePos.mainWidth+"px;left:"+suo.cons.sizePos.mainPosX+"px;min-height:"+suo.cons.sizePos.mainMinHeight+"px;";
		window.setTimeout(function(){
			suo.cons.sizePos.btn_add_right=(window.innerWidth-Math.abs(window.getComputedStyle(mainOBJ).width.substr(0,window.getComputedStyle(mainOBJ).width.length-2)))/2-56-20;
			suo.cons.sizePos.btn_add_right=suo.cons.menuPin?suo.cons.sizePos.btn_add_right-130:suo.cons.sizePos.btn_add_right;
			document.querySelector("#btn_add")?document.querySelector("#btn_add").style.cssText+="right:"+(suo.cons.sizePos.btn_add_right>80?suo.cons.sizePos.btn_add_right:80)+"px;":null;
		},900)

		if(suo.cons.menuPin){
			document.querySelector("menu").style.cssText+="left: 0px;top: 64px;";
			//document.querySelector("#nav_txt").style.cssText+="margin-left:58px;";
			document.querySelector("menu #menu_logo").style.cssText+="margin-left:180px;";
			window.setTimeout(function(){document.querySelector("menu #menu_name").style.cssText+="display:inline;"
				document.querySelector("menu #menu_name").style.cssText+="opacity:1;";
			},800)
			document.querySelector("#menubox").style.height=(window.innerHeight-64-80-40+75-40)+"px";
		}else{
			document.querySelector("menu").style.cssText+="left: -260px;top: 0;";
			document.querySelector("menu #menu_logo").style.cssText+="margin-left:0;";
			document.querySelector("menu #menu_name").style.cssText+="display:none;opacity:0;";
			document.querySelector("#menubox").style.height=(window.innerHeight-64-80-40+60)+"px";
		}
	},
	randColor:function(){
		var colorStr="";
		var flag;
		for(var i=0;i<3;i++){
			//flag=parseInt(Math.random()*256).toString(16).length==1?("0"+parseInt(Math.random()*256).toString(16)):parseInt(Math.random()*256).toString(16);
			flag=parseInt(Math.random()*256).toString(16);
			if(flag.length==1){
				flag="0"+flag;
			}
			colorStr+=flag;
		}
		return "#"+colorStr;
	},
	showBtnAdd:function(type,confobj,dom){
		console.log(confobj)
		var btnOBJ=document.querySelector("#btn_add");
		if(!type){btnOBJ.style.cssText+="display:none;";return;}
		confobj?btnOBJ.setAttribute("data-confobj",confobj):null;
		// btnOBJ.style.cssText+="display:block;";

		if(!dom.querySelector("#btn_add")){
			dom.appendChild(suo.domCreate2("img",{setName:["id","src","title"],setValue:["btn_add","../image/add.svg",suo.getI18n("tip_addnew")]},null,null,{setName:["confobj","actiontype"],setValue:[confobj,confobj.split("|")[0]]}));
		};
		if(!dom.querySelector(".btn_list")&&(confobj&&(confobj.indexOf("script")==-1&&confobj.indexOf("ctm")==-1&&confobj.indexOf("pop")==-1))){
			dom.appendChild(suo.domCreate2("img",{setName:["className","src","title"],setValue:["btn_list","../image/list.svg",suo.getI18n("tip_showlist")]},null,null,{setName:["confobj"],setValue:[confobj]}));
		}
	},
	itemAddBefore:function(e){
		let ele=e.target||e;
		console.log("itemAddBefore")
		editMode=true;
		var confArray=suo.getConfArray(ele,"confobj"),
			confOBJ=config,
			actionType=confArray[0],
			confobj=suo.getDataset(ele,"confobj","value");
		if(confArray[0]=="drg"){actionType=confArray[1]};
		console.log(actionType)
		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		var confid=confOBJ.length;

		if(["engine"].contains(confArray[1])){
			suo.itemEdit(confobj,confid,"add",null,confArray[2]);
			return;
		}
		var testdes=suo.getI18n("test_"+((confArray[0]=="mges")?"mges":confArray[1]));
		var btnArray=["",suo.getI18n("btn_cancel"),suo.getI18n("btn_done")];
		let testDom=suo.domCreate2("div",{setName:["className"],setValue:["testbox"]},null,null,null,testdes);
		if(confArray[1]=="ldrg"){
			testDom.textContent="";
			testDom.appendChild(suo.domCreate2("a",{setName:["href"],setValue:["###"]},null,null,null,suo.getI18n("test_ldrg")));
		}else if(confArray[1]=="idrg"){
			testDom.appendChild(suo.domCreate2("img",{setName:["src"],setValue:["../icon.png"]}));
		}
		var addOBJ=suo.initAPPbox(btnArray,[480,320],suo.getI18n("title_newaction"),"bg");
			addOBJ.classList.add("su_app_test");
			addOBJ.dataset.confobj=confobj;
			addOBJ.dataset.confid=confid;
			addOBJ.dataset.close="resetdirect";
			addOBJ.dataset.actiontype=actionType;
			addOBJ.querySelectorAll("input[type=button]")[1].className="box_btn box_btn_next";
			addOBJ.querySelector(".box_content").appendChild(testDom);
		//when adding drag text, set the test text can be drag.
		if(confArray[1]=="tdrg"){
			addOBJ.style.cssText+="-webkit-user-select:text;-moz-user-select:text;user-select:text;";
		}
		//document.body.appendChild(addOBJ)
		suo.initPos(addOBJ);
	},
	directEdit:function(e){
		console.log("directEdit")
		var confobj=suo.getDataset(e,"confobj","value"); //e.target.dataset.confobj;
		var confid=suo.getDataset(e,"confid","value"); //confOBJ.length;
		var dataclose=suo.getDataset(e,"close","value");
		suo.boxClose2(suo.getAPPboxEle(e));
		editMode=true;
		var confArray=confobj.split("|");
		var testdes=suo.getI18n("test_"+((confArray[0]=="mges")?"mges":confArray[1]));
		var btnArray=["",suo.getI18n("btn_cancel"),suo.getI18n("btn_done")];
		var addOBJ=suo.initAPPbox(btnArray,[480,320],suo.getI18n("title_editdirect"),"bg",suo.getDataset(e,"actiontype","value"));
			addOBJ.classList.add("su_app_test");
			addOBJ.dataset.confobj=confobj;
			addOBJ.dataset.confid=confid;
			addOBJ.dataset.close=dataclose+"resetdirect";
			addOBJ.querySelectorAll("input[type=button]")[1].className="box_btn box_btn_diredit";
			// addOBJ.querySelector(".box_content").appendChild(suo.domCreate2("div",{setName:["className"],setValue:["testbox"]},null,null,null,testdes));

		let testDom=suo.domCreate2("div",{setName:["className"],setValue:["testbox"]},null,null,null,testdes);
		if(confArray[1]=="ldrg"){
			testDom.textContent="";
			testDom.appendChild(suo.domCreate2("a",{setName:["href"],setValue:["###"]},null,null,null,suo.getI18n("test_ldrg")));
		}else if(confArray[1]=="idrg"){
			testDom.appendChild(suo.domCreate2("img",{setName:["src"],setValue:["../icon.png"]}));
		}
		addOBJ.querySelector(".box_content").appendChild(testDom);

		suo.initPos(addOBJ);
	},
	initAPPbox:function(btn,size,title,bg,actiontype){
		console.log(actiontype)
		var mainWidth=size?size[0]:0,
			mainHeight=size?size[1]:0;
		var title=title?title:"";
		//var boxBGOBJ=bg?document.documentElement.appendChild(suo.domCreate2("div",{setName:["className"],setValue:["box_bg"]})):null;
		var boxOBJ=document.querySelector("smartup.su_apps").cloneNode(true);
			boxOBJ.style.cssText+="display:block;z-index:1000;opacity:0;";
		title?boxOBJ.querySelector(".box_title").innerText=title:null;
		if(actiontype){boxOBJ.dataset.actiontype=actiontype}else{boxOBJ.dataset.actiontype=""}

		var btnOBJ=boxOBJ.querySelectorAll(".box_submit input[type=button]");
		for(var i=0,i_btn=0;i<btn.length;i++){
			if(btn[i]){
				btnOBJ[i].value=btn[i];
			}else{
				i_btn++;
				btnOBJ[i].remove();
			}
		}
		if(i_btn==btn.length){
			boxOBJ.querySelector(".box_submit").remove();
		}
		return boxOBJ;
	},
	itemEditBefor:function(e){
		function getele(ele){
			ele=ele.target||ele;
			console.log(ele)
			if(!ele.dataset.actiontype){
				return arguments.callee(ele.parentNode);
			}else{
				return ele;
			}
		}
		var ele=getele(e);

		suo.itemEdit(suo.getDataset(ele,"confobj","value"),suo.getDataset(ele,"confid","value"),null,null,ele.dataset.actiontype);
	},
	getAPPboxEle:function(e){
		var ele=e.target||e;
		var getele=function(ele){
			if(ele.tagName&&ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
				return ele;
			}else{
				return getele(ele.parentNode);
			}
		}
		return getele(ele);
	},
	getDataset:function(e,type,returntype){
		console.log(e);
		console.log(type+"//"+returntype)
		var ele=e.target||e;
		var type=type?type:"confobj",
			returntype=returntype?returntype:"ele";
		var getdata=function(ele){
			if(ele.dataset[type]==""||ele.dataset[type]){
				return ele;
			}else{
				return arguments.callee(ele.parentNode);
			}
		}
		if(returntype=="value"){
			return getdata(ele).dataset[type];
		}else{
			return getdata(ele);
		}
	},
	boxMove:function(e){
		var ele=e.target||e;
		var OBJ=suo.getAPPboxEle(e);
		if(!OBJ){return false;}
		OBJ.querySelector(".box_head").style.cssText+="cursor:move;";
		OBJ.style.cssText+="transition:none;"+
			"left:"+(e.clientX-suo.cons.boxmove.posX)+"px;"+
			"top:"+(e.clientY-suo.cons.boxmove.posY)+"px;"
	},
	checkEditDirect:function(e){
		console.log(arguments.callee.name);
		var dom=suo.getAPPboxEle(e);
		var confobj=dom.dataset.confobj,
			confid=dom.dataset.confid;
		var confOBJ=config;
		var confArray=confobj.split("|");
		console.log(editDirect)
		if(!editDirect){
			let _span=suo.domCreate2("span",null,null,"font-weight:bold;font-size:16px;",null,suo.getI18n("msg_dirnone"));
			dom.querySelector(".testbox").textContent="";
			dom.querySelector(".testbox").appendChild(_span);
			dom.querySelector(".testbox").appendChild(suo.domCreate2("br"));
			dom.querySelector(".testbox").appendChild(suo.domCreate2("span",null,null,null,null,suo.getI18n("test_"+confArray[1])));
			suo.showMsgBox(suo.getI18n("msg_dirnone"),"error","",10000);
			return false;
		}

		for(var i=0;i<confArray.length;i++){
			confOBJ=confOBJ[confArray[i]];
		}
		for(var i=0;i<confOBJ.length;i++){
			if(confOBJ[i].direct==editDirect){
				suo.showMsgBox(suo.getI18n("msg_dirrepeat"),"error","",10000);
				return false;
				break;
			}
		}
		return [confobj,confid,editDirect]
	}
}
chrome.runtime.sendMessage({type:"opt_getconf"},function(response){
	console.log(response)
	defaultConf=response.defaultConf;
	config=response.config;
	suo.cons.os=response.os;
	devMode=response.devMode;
	suo.cons.reason=response.reason;
	suo.begin();
})
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	switch(message.type){
		case"confErr":
			suo.showMsgBox([suo.getI18n("msg_conferr0"),message.lastErr,suo.getI18n("msg_conferr1")],"error","5",10000);
			window.setTimeout(function(){
				location.reload();
			},6000);
			sendResponse({});
			break;
		case"confOK":
			suo.showMsgBox();
			sendResponse({});
			break;
	}
});