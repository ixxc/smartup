Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}

var devMode=false;
var	config,
	defaultConf,
	browserType;

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

// 默认配置数据，建议关闭【显示操作名称】和【显示操作备注】，因为在event.js中会频繁触发事件sendDir与后台通信gettip，非常影响性能
var getDefault={
	i18n:function(str){
		var _i18n=chrome.i18n.getMessage(str);
		return _i18n?_i18n:str;
	},
	value:function(){
		var	config={
				version:46,
				plus:{},
				general:{
					settings:{
						timeout:true,
						timeoutvalue:2000,
						timeout_nomenu:true,
						minlength:10,
						autosave:true,
						icon:true,
						notif:false,
						esc:true
					},
					fnswitch:{
						fnmges:true,
						fndrg:true
					},
					engine:{
						txtengine:[
							{name:"Google",content:"https://www.google.com/search?q=%s"},
							{name:"Bing",content:"https://www.bing.com/search?q=%s"}
						],
						imgengine:[
							{name:"Google Images",content:"https://lens.google.com/uploadbyurl?url=%s"},
							{name:"Bing Images",content:"https://www.bing.com/images/search?q=imgurl:%s"}
						]
					},
					linux:{
						cancelmenu:true
					},
					sync:{
						autosync:false
					}
				},
				mges:{
					settings:{
						model:2,
						holdkey:"none",
						txttourl:true,
						lnktoimg:false
					},
					ui:{
						line:{
							enable:true,
							color:"#3369E8",
							width:5,
							opacity:90
						},
						direct:{
							enable:false,
							color:"#8e9bd5",
							width:32,
							opacity:80,
							style:"center"
						},
						tip:{
							enable:false,
							color:"#ffffff",
							bgcolor:"#5677fc",
							width:18,
							opacity:80,
							style:"follow",
							withdir:false
						},
						note:{
							enable:false,
							color:"#f75620",
							opacity:90,
							width:12,
							style:"hover"
						},
						allaction:{
							enable:false,
							color:"#ffffff",
							bgcolor:"#576f71",
							width:24,
							opacity:70,
							style:"ui_bottom"
						}
					},
					actions:[
						{
							direct:"L",
							name:"back"
						},
						{
							direct:"R",
							name:"forward"
						},
						{
							direct:"U",
							name:"scroll",
							mydes:{type:true,value:getDefault.i18n("init_scroll_up")},
							selects:[{type:"n_scroll",value:"s_up"}],
							checks:[{type:"n_effect",value:true}]
						},
						{
							direct:"D",
							name:"scroll",
							mydes:{type:true,value:getDefault.i18n("init_scroll_down")},
							selects:[{type:"n_scroll",value:"s_down"}],
							checks:[{type:"n_effect",value:true}]
						},
						{
							direct:"DU",
							name:"scroll",
							mydes:{type:true,value:getDefault.i18n("init_scroll_top")},
							selects:[{type:"n_scroll",value:"s_top"}],
							checks:[{type:"n_effect",value:true}]
						},
						{
							direct:"UD",
							name:"scroll",
							mydes:{type:true,value:getDefault.i18n("init_scroll_bottom")},
							selects:[{type:"n_scroll",value:"s_bottom"}],
							checks:[{type:"n_effect",value:true}]
						},
						{
							direct:"DR",
							name:"close",
							mydes:{type:true,value:getDefault.i18n("init_close_current")},
							selects:[
								{type:"n_tab",value:"s_current"},
								{type:"n_close_sel",value:"s_default"}
							],
							checks:[
								{type:"n_close_keep",value:false},
								{type:"n_closePin",value:false},
								{type:"n_closeConfirm",value:true}
							]
						},
						{
							direct:"UL",
							name:"switchtab",
							mydes:{type:true,value:getDefault.i18n("init_switch_left")},
							selects:[
								{type:"n_tab_lrhl",value:"s_left"}
							]
						},
						{
							direct:"UR",
							name:"switchtab",
							mydes:{type:true,value:getDefault.i18n("init_switch_right")},
							selects:[
								{type:"n_tab_lrhl",value:"s_right"}
							]
						}
					]
				},
				drg:{
					settings:{
						holdkey:"ctrl",
						holdimgkey:"alt",
						drgbox:false,
						drgtobox:true,
						drgurl:true,
						drgimg:true,
						txt:true,
						lnk:true,
						img:true,
						draggable:true
					},
					ui:{
						line:{
							enable:false,
							color:"#008080",
							width:3,
							opacity:90
						},
						direct:{
							enable:false,
							color:"#8e9bd5",
							width:32,
							opacity:80,
							style:"center"
						},
						tip:{
							enable:false,
							color:"#000000",
							bgcolor:"#cbc8f9",
							width:18,
							opacity:80,
							style:"follow",
							withdir:true
						},
						note:{
							enable:false,
							color:"#f75620",
							opacity:90,
							width:12,
							style:"hover"
						},
						allaction:{
							enable:false,
							color:"#ffffff",
							bgcolor:"#576f71",
							width:24,
							opacity:70,
							style:"ui_bottom"
						}
					},
					tdrg:[
						{
							direct:"L",
							name:"txtsearch",
							mydes:{type:true,value:getDefault.i18n("init_searchtxt_bg")},
							selects:[
								{type:"n_txtengine",value:"0"},
								{type:"n_encoding",value:"s_uri"},
								{type:"n_optype",value:"s_back"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						},
						{
							direct:"R",
							name:"txtsearch",
							selects:[
								{type:"n_txtengine",value:"0"},
								{type:"n_encoding",value:"s_uri"},
								{type:"n_optype",value:"s_new"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						}
					],
					ldrg:[
						{
							direct:"L",
							name:"openlnk",
							mydes:{type:true,value:getDefault.i18n("init_openlnk_bg")},
							selects:[
								{type:"n_optype",value:"s_back"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						},
						{
							direct:"R",
							name:"openlnk",
							selects:[
								{type:"n_optype",value:"s_new"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						}
					],
					idrg:[
						{
							direct:"L",
							name:"imgsearch",
							mydes:{type:true,value:getDefault.i18n("init_searchimg_bg")},
							selects:[
								{type:"n_imgengine",value:"0"},
								{type:"n_encoding",value:"s_uri"},
								{type:"n_optype",value:"s_back"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						},
						{
							direct:"U",
							name:"imgsearch",
							selects:[
								{type:"n_imgengine",value:"0"},
								{type:"n_encoding",value:"s_uri"},
								{type:"n_optype",value:"s_new"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						},
						{
							direct:"R",
							name:"openimg",
							selects:[
								{type:"n_optype",value:"s_new"},
								{type:"n_position",value:"s_default"}
							],
							checks:[{type:"n_pin",value:false}]
						}
					]
				}
			}
		switch(navigator.language.toLowerCase()){
			case"zh-cn":
				var OBJ={};
				OBJ.name="\u767e\u5ea6";
				OBJ.content="https://www.baidu.com/s?wd=%s";
				config.general.engine.txtengine.push(OBJ);
				var imgobj={};
				imgobj.name="\u767e\u5ea6";
				imgobj.content="https://image.baidu.com/pcdutu?queryImageUrl=%s";
				config.general.engine.imgengine.push(imgobj);
				break;
			case"ru":
				var OBJ={};
				OBJ.name="\u042f\u043d\u0434\u0435\u043a\u0441";
				OBJ.content="https://www.yandex.com/yandsearch?text=%s";
				config.general.engine.txtengine.push(OBJ);
				break;
		}
		return config
	}
}
defaultConf=getDefault.value();
let loadConfig=function(noInit,type){
	function needInit(){
		sub.init();
		return;
		if(noInit){

		}else{
			sub.init();
		}
	}
	chrome.storage.local.get(function(items){
		if(!items.general){
			config=getDefault.value();
			chrome.storage.local.set(config,function(){});
		}else{
			config=items;
		}
		needInit();
	});
}

var sub={
	cons:{
		pretab:[],
		fullstate:null,
		per_write:false,
		scroll:{},
		crversion:(navigator.userAgent.substr(navigator.userAgent.indexOf("Chrome")+7,100).substr(0,navigator.userAgent.substr(navigator.userAgent.indexOf("Chrome")+7,100).indexOf(" "))),
		os:"win"
	},
	extID:chrome.runtime.id,
	init:function(){
		sub.initEvent();
	},
	initEvent:function(){
		for(let i=0;config.mges&&config.mges.actions&&i<config.mges.actions.length;i++){
			if(config.mges.actions[i].name=="pretab"&&!chrome.tabs.onActivated.hasListeners()){
				chrome.tabs.onActivated.addListener(sub.handleEvent.onTabsActivated);
				break;
			}
		}
	},
	handleEvent:{
		onTabsActivated:function(info){
			console.log("s")
			sub.cons.pretab.unshift(info);
		}
	},
	getConfValue:function(type,value){
		var _value="";
		for(var i=0;i<(sub.theConf[type]?sub.theConf[type].length:0);i++){
			if(sub.theConf[type][i].type==value){
				_value=sub.theConf[type][i].value;
				break;
			}
		}
		return _value;
	},
	getId:function(value){
		var theId=[];
		switch(value){
			case"s_default":
				theId.push(value)
				break;
			case"s_current":
				theId.push(sub.curTab.id);
				break;
			case"s_head":
				theId.push(sub.curWin.tabs[0].id);
				break;
			case"s_last":
				theId.push(sub.curWin.tabs[sub.curWin.tabs.length-1].id);
				break;
			case"s_left":
				if(sub.curTab.index==0){
					theId.push(sub.curWin.tabs[sub.curWin.tabs.length-1].id);
					break;
				}
				for(var i=0;i<sub.curWin.tabs.length&&sub.curWin.tabs.length>1;i++){
					if(sub.curWin.tabs[i].index==sub.curTab.index-1){
						theId.push(sub.curWin.tabs[i].id);
						break;
					}
				}
				break;
			case"s_right":
				if(sub.curTab.index==sub.curWin.tabs.length-1){
					theId.push(sub.curWin.tabs[0].id);
					break;
				}
				for(var i=0;i<sub.curWin.tabs.length&&sub.curWin.tabs.length>1;i++){
					if(sub.curWin.tabs[i].index==sub.curTab.index+1){
						theId.push(sub.curWin.tabs[i].id);
						break;
					}
				}
				break;
			case"s_lefts":
				if(sub.curTab.index==0){
					break;
				}
				for(var i=0;i<sub.curWin.tabs.length&&sub.curWin.tabs.length>1;i++){
					if(sub.curWin.tabs[i].index<sub.curTab.index){
						theId.push(sub.curWin.tabs[i].id);
					}
				}
				break;
			case"s_rights":
				if(sub.curTab.index==sub.curWin.tabs.length-1){
					break;
				}
				for(var i=0;i<sub.curWin.tabs.length&&sub.curWin.tabs.length>1;i++){
					if(sub.curWin.tabs[i].index>sub.curTab.index){
						theId.push(sub.curWin.tabs[i].id);
					}
				}
				break;
			case"s_others":
				if(sub.curWin.tabs.length==1){
					theId=[];
					break;
				}
				for(var i=0;i<sub.curWin.tabs.length&&sub.curWin.tabs.length>1;i++){
					if(sub.curWin.tabs[i].index!=sub.curTab.index){
						theId.push(sub.curWin.tabs[i].id);
					}
				}
				break;
			case"s_all":
				for(var i=0;i<sub.curWin.tabs.length;i++){
					theId.push(sub.curWin.tabs[i].id);
				}
				break;
		}
		return theId;
	},
	getIndex:function(value,type){
		var _new=(type=="new"?true:false);
		var theIndex=[];
		switch(value){
			case"s_current":
				theIndex.push(sub.curTab.index);
				break;
			case"s_default":
				theIndex.push(false);
				break;
			case"s_head":
				theIndex.push(0);
				break;
			case"s_last":			
				if(_new){
					theIndex.push(sub.curWin.tabs.length);
				}else{
					theIndex.push(sub.curWin.tabs.length-1);
				}
				break;
			case"s_left":
				if(_new){
					theIndex.push(sub.curTab.index==0?0:sub.curTab.index);
					break;
				}
				theIndex.push(sub.curTab.index==0?sub.curWin.tabs.length-1:sub.curTab.index-1);
				break;
			case"s_right":
				if(_new){
					theIndex.push(sub.curTab.index==sub.curWin.tabs.length-1?sub.curWin.tabs.length:sub.curTab.index+1);
					break;
				}
				theIndex.push(sub.curTab.index==sub.curWin.tabs.length-1?0:sub.curTab.index+1);
				break;
		}
		return theIndex;
	},
	date:{
		date:new Date(),
		get:function(){
			var _newDate=this.date.getFullYear().toString()+((this.date.getMonth()+1)<10?("0"+(this.date.getMonth()+1)):(this.date.getMonth()+1).toString())+(this.date.getDate()<10?("0"+this.date.getDate()):this.date.getDate().toString());
			return Number(_newDate);
		},
		getTime:function(){
			return this.date.getTime();
		}
	},
	showNotif:function(type,title,txt){
		var notif={
	        	iconUrl:"icon.png",
				type:type,
				title:title,
				message:txt
			};
		chrome.notifications.create("",notif,function(){});
	},
	setIcon:function(status,tabId,changeInfo,tab){
		switch(status){
			case"normal":
				break;
			case"warning":
				chrome.action.setIcon({tabId:tab.id,path:"../image/icon_warning.png"});
				chrome.action.setTitle({tabId:tab.id,title:sub.getI18n("icon_tip")});
				break;
		}
	},
	getI18n:function(str){
		return chrome.i18n.getMessage(str)||str;
	},
	initCurrent:function(sender,theConf){
		chrome.windows.getCurrent({populate:true},function(window){
			sub.curWin=window;
			chrome.tabs.query({active:true,currentWindow:true},function(tabs){
				sub.curTab=tabs[0];
				if(sub.action[sub.theConf.name]){
					sub.action[sub.theConf.name](sub.theConf);
				}
			})
		})
	},
	action:{  // 具体操作函数，对应action.js中的操作名称
		none:function(){
			return;
		},
		//group nav
		back:function(){//chk
			chrome.tabs.query({active:true,currentWindow:true},function(tabs){
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: function () {
						window.history.go(-1);
					}
				});
			});
		},
		forward:function(){//chk
			chrome.tabs.query({active:true,currentWindow:true},function(tabs){
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: function () {
						window.history.go(+1);
					}
				});
			});
		},
		scroll:function(){
			var _effect=sub.getConfValue("checks","n_effect"),
				_scroll=sub.getConfValue("selects","n_scroll").substr(2);
			sub.cons.scroll.effect=_effect;
			sub.cons.scroll.type=_scroll;
			chrome.tabs.query({active:true,currentWindow:true},function(tabs){
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					files: ["js/inject/scroll.js"]
				});
			});
		},
		reload:function(){//chk
			var ids=sub.getId(sub.getConfValue("selects","n_tab"));
			var clear=sub.getConfValue("checks","n_reload_clear");
			//fix edge
			if(!chrome.tabs.reload){
				for(var i=0;ids&&i<ids.length;i++){
					chrome.scripting.executeScript({
						target: { tabId: ids[i] },
						func: function () {
							location.reload();
						}
					});
				}
			}
			for(var i=0;ids&&i<ids.length;i++){
				chrome.tabs.reload(ids[i],{bypassCache:clear});
			}
		},
		pretab:function(){
			var ids=[],
				curTabId=sub.curTab.id;
			for(var i=0;i<sub.curWin.tabs.length;i++){
				ids.push(sub.curWin.tabs[i].id);
			}
			for(var i=1;i<sub.cons.pretab.length;i++){
				if(sub.cons.pretab[i].tabId!=curTabId&&ids.contains(sub.cons.pretab[i].tabId)){
					console.log(sub.cons.pretab[i].tabId)
					chrome.tabs.update(sub.cons.pretab[i].tabId,{active:true},function(){
					});
					break;
				}
			}
		},
		close:function(){
			var ids=sub.getId(sub.getConfValue("selects","n_tab"),arguments.callee.name),
				selid=sub.getId(sub.getConfValue("selects","n_close_sel"))[0],
				selvalue=sub.getConfValue("selects","n_close_sel"),
				_closeKeep=sub.getConfValue("checks","n_close_keep");
			let value_closePin=sub.getConfValue("checks","n_closePin");
			let funClose=function(){
				let _funClose=function(){
					if(sub.curWin.tabs.length==ids.length&&!sub.curWin.incognito&&_closeKeep){
						chrome.tabs.create({},function(){
							chrome.tabs.remove(ids,function(){
								(selvalue!="s_default")?chrome.tabs.update(selid,{active:true}):null;
							});
						})
					}else{
						chrome.tabs.remove(ids,function(){
							(selvalue!="s_default")?chrome.tabs.update(selid,{active:true}):null;
						});
					}					
				}
				if(ids.length>1&&sub.getConfValue("checks","n_closeConfirm")){
					chrome.tabs.sendMessage(sub.curTab.id,{type:"set_confirm"},function(response){
						if(response.message){
							_funClose();
						}
					});
				}else{
					_funClose();
				}			
			}
			if(value_closePin){
				let ids_pinned,i=0,ii=0;
				chrome.tabs.query({pinned:true},function(tabs){
					for(i=0;i<tabs.length;i++){
						for(ii=0;ii<ids.length;ii++){
							if(tabs[i].id==ids[ii]){
								ids.splice(ii,1);
								continue;
							}
						}
					}
					funClose();
				})
			}else{
				funClose();
			}
		},
		newtab:function(){//chk
			var theTarget=sub.getConfValue("selects","n_optype"),
				theIndex=sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0],
				thePin=sub.getConfValue("checks","n_pin");
			var theURL="";

			sub.open(theURL,theTarget,theIndex,thePin,"newtab");
		},
		reopenincognito:function(){
			chrome.windows.create({url:sub.curTab.url,incognito:true,state:sub.getConfValue("selects","n_optype")=="s_incog"?"normal":"minimized"},function(window){
				if(!sub.getConfValue("checks","n_reopenkeep")){
					chrome.tabs.remove(sub.curTab.id);
				}
			})
		},
		open:function(){//chk
			sub.open(sub.getConfValue("texts","n_url"),sub.getConfValue("selects","n_optype"),sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0],sub.getConfValue("checks","n_pin"));
		},
		switchtab:function(){
			var id=sub.getId(sub.getConfValue("selects","n_tab_lrhl"))[0];
				chrome.tabs.update(id,{active:true});
		},
		move:function(){
			var index=sub.getIndex(sub.getConfValue("selects","n_position_lrhl"))[0];
			chrome.tabs.move(sub.curTab.id,{index:index});
		},
		detach:function(){
			if(sub.curWin.tabs.length==1){return;}
			var _target=sub.getConfValue("selects","n_tab"),
				ids=sub.getId(_target);
			if(ids==false||_target=="s_all"){return;}
			chrome.windows.create({tabId:ids[0]},function(window){
				if(ids.length>1){
					ids.splice(0,1);
					chrome.tabs.move(ids,{windowId:window.id,index:-1})
				}
			})
			return;
		},
		pin:function(){
			var ids=sub.getId(sub.getConfValue("selects","n_tab"));
			if(ids.length==1){
				chrome.tabs.get(ids[0],function(tab){
					var _pin=tab.pinned?false:true;
					chrome.tabs.update(ids[0],{pinned:_pin});
				})
			}else{
				chrome.windows.getCurrent({populate:true},function(window){
					for(var i=0;i<window.tabs.length;i++){
						if(!ids.contains(window.tabs[i].id)){continue;}
						_pin=window.tabs[i].pinned?false:true;
						chrome.tabs.update(window.tabs[i].id,{pinned:_pin});
					}
				})
			}
		},
		duplicate:function(){
			var _target=sub.getConfValue("selects","n_tab"),
				ids=sub.getId(_target);
			for(var i=0;i<ids.length;i++){
				chrome.tabs.duplicate(ids[i],function(tab){
					if(sub.getConfValue("checks","n_duplicatetype")){
						chrome.tabs.update(sub.curTab.id,{highlighted:true});
					}
				});
			}
		},
		newwin:function(){//chk
			var theType=sub.getConfValue("selects","n_wintype").substr(2),
				theIncog=sub.getConfValue("checks","n_winincog");
			chrome.windows.create({type:theType,incognito:theIncog,url:(browserType=="fx"?undefined:"chrome://newtab")});
		},
		closewin:function(){
			var theWin=sub.getConfValue("selects","n_win");
			if(theWin=="s_current"){
				chrome.windows.remove(sub.curWin.id)
			}else{
				chrome.windows.getAll({populate:true},function(windows){
					for(var i=0;i<windows.length;i++){
						if(theWin=="s_others"){
							if(windows[i].id!=sub.curWin.id){
								chrome.windows.remove(windows[i].id);
							}
						}else{
							chrome.windows.remove(windows[i].id);
						}
					}
				})
			}
		},
		max:function(){
			chrome.windows.update(sub.curWin.id,{state:(sub.curWin.state=="normal"?"maximized":"normal")},function(window){
				sub.curWin.state=window.state;
			})
		},
		min:function(){
			chrome.windows.update(sub.curWin.id,{state:"minimized"})			
		},
		full:function(){
			var t;
			if(sub.curWin.state!="fullscreen"){
				sub.cons.winstate=sub.curWin.state;
				t="fullscreen";
			}else{
				t=sub.cons.winstate;
			}
			chrome.windows.update(sub.curWin.id,{state:t},function(window){})
		},
		//txt
		txtsearch:function(){//chk
			if(!sub.message.selEle.txt){return;}
			var engine,theURL,enTxt;
			var theEngine=sub.getConfValue("selects","n_txtengine"),
				theTarget=sub.getConfValue("selects","n_optype"),
				theCode=sub.getConfValue("selects","n_encoding"),
				theIndex=sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0],
				thePin=sub.getConfValue("checks","n_pin");
			switch(theCode){
				case"s_unicode":
					enTxt=escape(sub.message.selEle.txt);
					break;
				case"s_uri":
					enTxt=encodeURI(sub.message.selEle.txt);
					break;
				case"s_uric":
					enTxt=encodeURIComponent(sub.message.selEle.txt);
					break;
				case"s_uricgbk":
					enTxt=GBK.URI.encodeURI(sub.message.selEle.txt);
					break;
				default:
					enTxt=sub.message.selEle.txt;
					break;
			}
			var _engine=config.general.engine.txtengine[theEngine].content;
			theURL=_engine.replace(/%s/g,enTxt);

			sub.open(theURL,theTarget,theIndex,thePin);
		},
		//link
		openlnk:function(){//lnk
			console.log(sub.message.selEle)
			console.log(sub.message.selEle.objLnk)
			if(!sub.message.selEle.lnk&&!sub.message.selEle.objLnk){return;}
			var _optype=sub.getConfValue("selects","n_optype"),
				_url=sub.message.selEle.lnk||sub.message.selEle.objLnk.href,
				_position=sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0],
				_pin=sub.getConfValue("checks","n_pin");
			sub.open(_url,_optype,_position,_pin);
		},
		//img
		openimg:function(){//chk
			if(!sub.message.selEle.img){return;}
			var _optype=sub.getConfValue("selects","n_optype"),
				_position=sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0] ,
				_pin=sub.getConfValue("checks","n_pin"),
				_url=sub.message.selEle.img;
			sub.open(_url,_optype,_position,_pin);
		},
		imgsearch:function(){
			if(!sub.message.selEle.img){return;}
			var engine,theURL,enCoding,enURL;
			var _optype=sub.getConfValue("selects","n_optype"),
				_position=sub.getIndex(sub.getConfValue("selects","n_position"),"new")[0] ,
				_pin=sub.getConfValue("checks","n_pin"),
				_code=sub.getConfValue("selects","n_encoding"),
				_url=sub.getConfValue("selects","n_imgengine");

			switch(_code){
				case"s_unicode":
					enURL=escape(sub.message.selEle.img);
					break;
				case"s_uri":
					enURL=encodeURI(sub.message.selEle.img);
					break;
				case"s_uric":
					enURL=encodeURIComponent(sub.message.selEle.img);
					break;
				case"s_uricgbk":
					enURL=GBK.URI.encodeURI(sub.message.selEle.img);
					break;
				default:
					enURL=sub.message.selEle.img;
					break;
			}
			_url=config.general.engine.imgengine[_url].content;
			_url=_url.replace(/%s/g,enURL);
			sub.open(_url,_optype,_position,_pin);
		}
	},
	open:function(url,target,position,pin,flag){
		chrome.windows.getAll(function(windows){console.log(windows.length)})
		console.log("url:"+url+"\ntarget:"+target+"\nindex:"+position+"\npin:"+pin+"\nflag:"+flag);
		var fixURL=function(url){
			//if()
			var fixstrs=["http://","https://","ftp://","chrome://","extension://","chrome-extension://","view-source:chrome-extension://","view-source:","moz-extension://","ms-browser-extension://","about:","file:///"];
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
		}
		if(!url){
			if(flag=="newtab"){}else{return;}
		}else{
			url=fixURL(url)
		}
		if(!url){url=browserType=="fx"?undefined:"chrome://newtab"}
		var theTarget=target,
			theURL=url,
			thePos=position,
			thePin=pin;
		if(theTarget=="s_current"){
			chrome.tabs.update({url:theURL,pinned:thePin});
			return;
		}else if(theTarget=="s_currentwin"){
			chrome.tabs.remove(sub.curTab.id);
			chrome.tabs.create({url:theURL,index:sub.curTab.index});
			return;
		}else if(theTarget=="s_win"){
			//fix fx unsupport focused
			var _obj=browserType=="fx"?{url:theURL}:{url:theURL,focused:true};
			chrome.windows.create(_obj,function(window){
				console.log(thePin)
				chrome.tabs.update(window.tabs[0].id,{pinned:thePin});
			})
			return
		}else if(theTarget=="s_winback"){
			//fix fx unsupport focused
			var _obj=browserType=="fx"?{url:theURL}:{url:theURL,focused:true};
			chrome.windows.create(_obj,function(window){
				chrome.tabs.update(window.tabs[0].id,{pinned:thePin});
			})
			return
		}else if(theTarget=="s_incog"){
			chrome.windows.getAll(function(windows){
				var _flag=false;
				for(var i=0;i<windows.length;i++){
					console.log(windows)
					if(windows[i].incognito){
						_flag=windows[i].id;
						break;
					}
				}
				console.log(_flag)
				if(_flag===0||_flag){
					chrome.windows.update(_flag,{focused:true});
					chrome.tabs.create({windowId:_flag,url:theURL,active:theTarget=="s_back"?false:true,index:thePos,pinned:thePin})
				}else{
					chrome.windows.create({url:theURL||flag=="newtab"?theURL:"",incognito:true},function(window){
						if(!window){return;}
						chrome.tabs.update(window.tabs[0].id,{pinned:thePin});
					})
				}
			})
			return;
		}
		let createProperties={};
			createProperties={
				active:theTarget=="s_back"?false:true,
				pinned:thePin,
				index:thePos,
				url:theURL
			}
		if(!theURL){delete createProperties.url}
		if(!(thePos||thePos===0)){delete createProperties.index}
		console.log(createProperties)
		chrome.tabs.create(createProperties);
	},
	saveConf:function(noInit,sendResponse){
		console.log("save");
		console.log(config);
		chrome.storage.local.clear(function(){
			chrome.storage.local.set(config,function(){
				if(chrome.runtime.lastError){
					sub.showNotif("basic",sub.getI18n("notif_title_conferr"),sub.getI18n("msg_conferr0")+"\n"+chrome.runtime.lastError.message+"\n"+sub.getI18n("msg_conferr1"));
					sub.cons.lastErr=chrome.runtime.lastError.message;
					chrome.storage.local.set(sub.cons.lastConf,function(){
						loadConfig();
						chrome.runtime.sendMessage({type:"confErr",lastErr:sub.cons.lastErr})
					});
				}else{
					loadConfig();
					chrome.runtime.sendMessage({type:"confOK"});
				}
			})
		})
	},
	funOnMessage:function(message,sender,sendResponse){
		console.log(message);
		console.log(sender);
		console.log(sendResponse);
		sub.message=message;
		let getConf=function(){
			let drawType=message.drawType,
				confType=config[drawType[0]][drawType[1]],
				direct=message.direct,
				theName="",
				theConf="";
			for(var i=0;i<confType.length;i++){
				if(confType[i].direct==direct){
					theName=confType[i].name;
					theConf=confType[i];
					break;
				}
				if(i==confType.length-1){
					theConf={name:null}
				}
			}
			return theConf;			
		}
		switch(message.type){
			case"evt_getconf":
			case"opt_getconf":
				let _conf={
					type:message.type,
					defaultConf:defaultConf,
					config:config,
					devMode:devMode,
					os:sub.cons.os,
					reason:sub.cons.reason
				}
				message.type==="opt_getconf"?sub.cons.reason="update":null;
				sendResponse(_conf);
				break;
			case"getappconf":
				sendResponse(sub.cons[message.apptype]);
				break;
			case"apps_getvalue":
				sendResponse({type:message.apptype,config:config.apps[message.apptype],value:sub.cons[message.apptype]})
				break;
			case"reloadconf":
				config=message.value;
				loadConfig();
				sendResponse({});
				break;
			case"saveConf":
				sub.cons.lastConf=config;
				config=message.value;
				sub.saveConf(true,sendResponse);
				sendResponse({});
				break;
			case"scroll":
				sendResponse({type:sub.cons.scroll.type,effect:sub.cons.scroll.effect});
				break;
			case"gettip":
				sub.theConf=getConf();
				let _sendConf={};
					_sendConf.config=sub.theConf;
					_sendConf.type="tip";
					_sendConf.tip=sub.theConf.name?(sub.theConf.mydes&&sub.theConf.mydes.type&&sub.theConf.mydes.value?sub.theConf.mydes.value:sub.getI18n(sub.theConf.name)):null;
					_sendConf.note=sub.theConf.note;
					_sendConf.allaction=[];
				//get all actions
				let _confType=config[message.drawType[0]][message.drawType[1]];
				if(config[sub.message.drawType[0]].ui.allaction.enable){
					for(let i=0;i<_confType.length;i++){
						if(_confType[i].direct.indexOf(message.direct)==0
							&&_confType[i].direct.length>message.direct.length){
							let _action={
								direct:_confType[i].direct,
								tip:(_confType[i].mydes&&_confType[i].mydes.type&&_confType[i].mydes.value)?_confType[i].mydes.value:sub.getI18n(_confType[i].name)
							}
							_sendConf.allaction.push(_action);
						}
						if(i==_confType.length-1&&_sendConf.allaction.length==0){
							_sendConf.allaction=null;
						}
					}
				}
				console.log(_sendConf)
				sendResponse(_sendConf);
				break;
			case"action":
				sub.theConf=getConf();
				sub.theConf.type="action";
				console.log("s");
				sendResponse(sub.theConf);
				sub.initCurrent(sender,sub.theConf);
				break;
		}
	}
}

if(!chrome.runtime.getPlatformInfo){}
else{
	chrome.runtime.getPlatformInfo(function(info){
		sub.cons.os=info.os;
	})
}

if(!chrome.runtime.onInstalled){}
else{
	chrome.runtime.onInstalled.addListener(function(details){
		console.log(details.reason);
		sub.cons.reason=details.reason;
		switch(details.reason){
			case"install":
				chrome.tabs.create({url:"../html/options.html"});
				break;
		}
	})
}

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	sub.funOnMessage(message,sender,sendResponse);
});
loadConfig();

console.log("end");

setInterval(() => {
	chrome.action.setBadgeText({});
}, 10000);
chrome.runtime.onStartup.addListener(()=>{});
