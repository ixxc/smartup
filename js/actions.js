// modelMore actionModel
console.log("actions")
let i=0,ii=0,iii=0;
let actions={
	mges_group:["ag_none","ag_nav","ag_tab","ag_window"],
	mges:[
		[//group none
			{name:"none"}
		],
		[//group nav
			{name:"back"},
			{name:"forward"},
			{name:"scroll",selects:["n_scroll"],checks:["n_effect"]},
			{name:"reload",selects:["n_tab"],checks:["n_reload_clear"]},
			{name:"pretab"}
		],
		[//group tab
			{name:"close",selects:["n_tab","n_close_sel"],checks:["n_close_keep","n_closePin","n_closeConfirm"]},
			{name:"newtab",selects:["n_optype","n_position"],checks:["n_pin"]},
			{name:"open",texts:["n_url"],selects:["n_optype","n_position"],checks:["n_pin"]},
			{name:"switchtab",selects:["n_tab_lrhl"]},
			{name:"move",selects:["n_position_lrhl"]},
			{name:"detach",selects:["n_tab"]},//movetowin
			{name:"pin",selects:["n_tab"]},
			{name:"duplicate",selects:["n_tab"],checks:["n_duplicatetype"]},
			{name:"reopenincognito",selects:["n_optype"],checks:["n_reopenkeep"]}
		],
		[//group window
			{name:"newwin",selects:["n_wintype"],checks:["n_winincog"]},
			{name:"closewin",selects:["n_win"]},
			{name:"max"},
			{name:"min"},
			{name:"full"}
		]
	],
	tdrg_group:["ag_none","ag_others"],
	tdrg:[
		[//group none
			{name:"none"}
		],
		[
			{name:"txtsearch",selects:["n_txtengine","n_encoding","n_optype","n_position"],checks:["n_pin"]}
		]
	],
	ldrg_group:["ag_none","ag_others"],
	ldrg:[
		[//group none
			{name:"none"}
		],
		[
			{name:"openlnk",selects:["n_optype","n_position"],checks:["n_pin"]}
		]
	],
	idrg_group:["ag_none","ag_others"],
	idrg:[
		[//group none
			{name:"none"}
		],
		[
			{name:"openimg",selects:["n_optype","n_position"],checks:["n_pin"]},
			{name:"imgsearch",selects:["n_imgengine","n_encoding","n_optype","n_position"],checks:["n_pin"]}
		]
	]
}
actions.popactions=actions.mgesactions=actions.mges;
actions.popactions_group=actions.mgesactions_group=actions.mges_group;

actions.mgesactions=actions.mges;

let actionOptions={
	special:{
		reopenincognito:{
			n_optype:["s_incog","s_incogback"]
		}
	},
	selects:{
		n_tab:["s_current","s_others","s_all","s_head","s_last","s_left","s_right","s_lefts","s_rights"],
		n_tab_single:["s_current","s_left","s_right","s_head","s_last"],
		n_tab_lrhl:["s_left","s_right","s_head","s_last"],

		n_optype:["s_new","s_back","s_current","s_win","s_winback","s_incog"],

		n_position:["s_default","s_left","s_right","s_head","s_last"],
		n_position_lrhl:["s_left","s_right","s_head","s_last"],

		n_win:["s_current","s_all","s_others"],
		n_wintype:["s_normal","s_popup","s_panel"],
		n_winincog:["s_no","s_yes"],
		n_winstate:["s_normal","s_minimized","s_maximized","s_fullscreen"],

		n_reload_clear:["s_no","s_yes"],
		n_close_sel:["s_default","s_left","s_right","s_head","s_last"],
		n_pin:["s_unpin","s_pinned"],
		n_effect:["s_on","s_off"],
		n_jq:["s_yes","s_no"],
		n_dlbar:["s_yes","s_no"],
		n_encoding:["s_none","s_unicode","s_uri","s_uric","s_uricgbk"],
		n_scroll:["s_up","s_down","s_left","s_right","s_top","s_bottom","s_leftmost","s_rightmost"],
		n_gender:["s_female","s_male"],
		effect:["on","off"],
		n_notif:["s_yes","s_no"],
		n_engine:[],
		n_snap:["s_left","s_right"]
	},
	texts:{
		t_test:"test",
		n_npkey_n:"next,pnnext,next ›,›,>",
		n_npkey_p:"previous,pnprev,‹ prev,‹,<",
		n_num:"5",
		n_mail_prefix:"Interesting Page:"
	},
	ranges:{
		rg_test:{
			value:1,
			options:[0.1,2,0.1,"%"]/*min,max,step,unit*/
		},
		n_pitch:{
			value:1,
			options:[0.1,2,0.1]
		},
		n_volume:{
			value:1,
			options:[0.1,2,0.1]
		},
		n_rate:{
			value:1,
			options:[0.1,2,0.1]
		}
	},
	checks:{
		n_close_keep:false,

		n_dlbar:true,
		n_notif:true,
		n_closetab:false,

		n_winincog:false,
		n_reload_clear:false,
		n_jq:true,

		n_pin:false,
		n_effect:true,

		n_closePin:false,
		n_closeConfirm:true,
		n_dialog:false,
		n_duplicatetype:false,
		n_effect:true,
		n_reopenkeep:false,
		c_factor:{
			value:false,
			typeCheck:"radio",
			options:{
				valueOption:"cl_factorcustom",
				settings:[
					{
						name:"cl_factorcustom",
						typeSetting:"text",
						valueSetting:"100"
					},
					{
						name:"cl_factorloaded",
						typeSetting:"default"						
					}
				]
			}
		},
		c_testdefault:{
			value:true,
			typeCheck:"default",
			options:{}
		},
		c_testtext:{
			value:false,
			typeCheck:"text",
			options:{
				valueOption:"100"
			}
		},
		c_testselect:{
			value:true,
			typeCheck:"select",
			options:{
				valueOption:"select_test1",
				settings:["select_test0","select_test1"]
			}
		},
		c_testrange:{
			value:true,
			typeCheck:"range",
			options:{
				valueOption:7,
				settings:[1,10,1,"%"]/*min,max,step,unit*/
			}
		},
		c_testradio:{
			value:true,
			typeCheck:"radio",
			options:{
				valueOption:"cr_testselect",
				settings:[
					{
						name:"cr_testdefault",
						typeSetting:"default"						
					},
					{
						name:"cr_testtext",
						typeSetting:"text",
						valueSetting:"100"
					},
					{
						name:"cr_testselect",
						typeSetting:"select",
						valueSetting:"select_test1",
						moreSetting:["select_test0","select_test1"]						
					},
					{
						name:"cr_testrange",
						typeSetting:"range",
						valueSetting:5,
						moreSetting:[1,10,1,"%"]/*min,max,step,unit*/						
					}
				]
			}
		}
	},
	radios:{
		rd_test:{
			options:{
				valueOption:"radio_testtext",
				settings:[
					{
						name:"radio_testdefault",
						typeSetting:"default"						
					},
					{
						name:"radio_testtext",
						typeSetting:"text",
						valueSetting:"100"
					},
					{
						name:"radio_testselect",
						typeSetting:"select",
						valueSetting:"select_test1",
						moreSetting:["select_test0","select_test1"]						
					},
					{
						name:"radio_testrange",
						typeSetting:"range",
						valueSetting:5,
						moreSetting:[1,10,1,"%"]/*min,max,step,unit*/						
					}
				]
			}
		}
	}
}

let actionRemove=function(actionName){
	for(i=0;i<Object.keys(actions).length;i++){
		for(ii=0;ii<actions[Object.keys(actions)[i]].length;ii++){
			for(iii=0;actions[Object.keys(actions)[i]][ii].length&&iii<actions[Object.keys(actions)[i]][ii].length;iii++){
				if(actionName.contains(actions[Object.keys(actions)[i]][ii][iii].name)){
					actions[Object.keys(actions)[i]][ii].splice(iii,1);
				}				
			}
		}
	}
};

(browserType!="fx")?actionRemove(["new_bk","new_search","readermode"]):null;