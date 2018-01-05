vz2.extend('warningCenter',function(){
	'use strict';

	var 
		contentStore = [],

		warningListStore = Ext.create('Ext.data.Store',{
			fields: [
				'province','channel','type',
				'warningType','level','threshold',
				'dispatchThreshold','state','lasting',
				'operation','data'
			]
		});

	/* define panel */ 

	var 
		mainPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			id: 'vz_warningCenter',
		}),

		filterPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			items: [
				{
					width: 200,
					style: "margin: 0 auto;",
					layout: 'column',
					defaults: {columnWidth: 0.5},
					items: [
						{xtype: 'label',    text: '告警中心',style: 'color: #fff;line-height: 24px;font-size: 24px;'}, 
						{xtype: 'combobox', editable: false,value: '甘肃省'}
					]
				}, {
					border: 0,
					style: {
						borderTop: '1px #ccc solid',
						marginTop: '10px',
						paddingTop: '15px',
					},
					items: [
						{
							border: 0,
							layout: 'column',
							defaults: {
								displayField: 'name',
								editable: false,
								labelWidth: 60,
								style: "margin-right: 15px;",
								valueField: 'value',
								width: 160,
								xtype: 'combobox',
							},
							margin: '0 0 15 0',
							items: [
								{fieldLabel: '交易渠道',},
								{fieldLabel: '交易类型',},
								{fieldLabel: '告警类型',},
							]
						},{
							border: 0,
							layout: 'column',
							defaults: {
								displayField: 'name',
								editable: false,
								labelWidth: 60,
								style: "margin-right: 15px;",
								valueField: 'value',
								width: 160,
								xtype: 'combobox',
							},
							margin: '0 0 10 0',
							padding: '0 0 10 0',
							style: "border-bottom: 1px #ccc solid;",
							items: [
								{fieldLabel: '告警级别'},
								{fieldLabel: '告警状态'},
								{
									xtype: 'label',
									text: '时间',
									width: 35,
									style: "color: #ccc;line-height: 24px",
								},
								vz2.createDateTimePicker(140,null,false,{
									background: 'transparent',
									border: '1px #fff solid'
								}),
								{
									xtype: 'label',
									text: '—',
									width: 15,
									style: {
										color: '#ccc',
										lineHeight: '24px',
										margin: '0 5px',
									},
								},
								vz2.createDateTimePicker(140,null,false,{
									background: 'transparent',
									border: '1px #fff solid'
								}),
								{
									xtype: 'button',
									width: 29,
									cls: 'vz_search_btn',
									style: {
										borderRadius: '5px',
										backgroundColor: 'rgba(0,0,0,0.4)',
										marginLeft: '15px',
									}
								}
							]
						}
					]
				}
			]
		}),

		contentPanel = Ext.create('Ext.grid.Panel',{
			border: 0,
			minHeight: 350,
			store: warningListStore,
			id: 'innerGrid',
			pageSize: 2,
			layout: 'fit',
			padding: '0 20',
			forceFit: true,
			style: {
				background: 'rgba(0,0,0,0.2)',
				borderRadius: '5px',
			},
			plugins: {
				ptype: 'rowexpander',
				brforeBody: true,
				columnWidth: 150,
				headerWidth: 0,
				rowBodyTpl: '<div class="innerGridExpander"></div>',
			},
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false,
					align: 'center',
					width: 100,
					style: "border: none;color: #fff;",
				},
				items: [
					{dataIndex: 'province',         text: "省份"},
					{dataIndex: 'channel',          text: "交易渠道"},
					{dataIndex: 'type',             text: "交易类型"},
					{dataIndex: 'warningType',      text: "告警类型"},
					{dataIndex: 'level',            text: "告警级别"},
					{dataIndex: 'warningTime',      text: "告警时间",width: 160,}, 
					{dataIndex: 'threshold',        text: "最低触发阀值",},
					{dataIndex: 'dispatchThreshold',text: "设置阀值"},
					{dataIndex: 'state',            text: "告警状态"},
					{dataIndex: 'lasting',          text: "连续时间"},
					{
						text:"操作",
						width:130,
						align:"center",
						renderer:function(value,cellmeta){
							var returnStr = "<INPUT type='button' value='查看'>";
							return returnStr;
						}	
  					},
				]
			},
			listeners: {
				afterrender: function(){
					contentPanel.view.on('expandbody',function(){
						var index = arguments[1].data.index;
						if(void 0 !== contentStore[index])return;
						var container = arguments[2].getElementsByClassName('innerGridExpander')[0];
						var data = arguments[1].data.data;
						var grid = Ext.create('Ext.grid.Panel',{
							border: 0,
							store: new Ext.data.Store({
								fields: [
									'type','channel','application',
									'count','responseRate','successRate',
									'responseTime','warning','threshold',
									'lasting',
								],
								data: data
							}),
							columns: {
								defaults: {
									menuDisabled: true,
									draggable: false,
									sortable: false,
									align: 'center',
									width: 110,
									style: {
										border: 'none',
										color: '#fff',
									},
								},
								items: [
									{dataIndex: 'type',        text: "交易类型"}, 
									{dataIndex: 'channel',     text: "交易渠道"}, 
									{dataIndex: 'application', text: "中间件",width: 145}, 
									{dataIndex: 'count',       text: "交易量"}, 
									{dataIndex: 'responseRate',text: "响应率"}, 
									{dataIndex: 'successRate', text: "成功率",}, 
									{dataIndex: 'responseTime',text: "响应时长"}, 
									{dataIndex: 'warning',     text: "是否告警"}, 
									{dataIndex: 'threshold',   text: "设置阀值",}, 
									{dataIndex: 'lasting',     text: "持续时间",}
								]
							},
							renderTo:container,
						});
						grid.getEl().swallowEvent([  
							'mousedown', 'mouseup',   'click',  
							'mouseover', 'mouseout',  'contextmenu', 
							'dblclick',  'mousemove', 'mouseenter',
							'itemmousedown','itemmouseup',  'itemsclick',
							'itemmouseover','itemmouseout', 'itemcontextmenu',
							'itemdblclick', 'itemmousemove','itemmouseenter',
							'focus','blur'
						],true);  
						contentStore[index] = grid;
					}).on('collapsebody',function(){
						var index = arguments[1].data.index;
						if(void 0 == contentStore[index])return;
						contentStore[index].destroy();
						delete contentStore[index];
					});
				},
				rowclick: function(){
					var i = arguments[3];
					contentPanel.plugins[0].toggleRow(i,warningListStore.data.items[i]);
				},
			}
		}),

		pagingBarPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			listeners: {
				afterrender: function(){
					vz2.ajax({
						url: 'warningCenter',
						params: {
							page: 1,
							limit: 10,
						},
						success: function(res,eOpts){
							contentPanel.store.loadData(res);
							createPagingtoolbar(contentPanel,pagingBarPanel,{
								pageCount: 100
							});
						},
						failure: function(){

						}
					});

				}
			}
		});

	/* define features */ 

	var createPagingtoolbar = function(){
		var 
			currentPage,
			pageCount;

		var updatePage = function(girdPanel,pagingPanel,selected,loadData){
			true === loadData && vz2.ajax({
				url: 'warningCenter',
				params: {
					page: selected,
					limit: 10,
				},
				success: function(res,eOpts){
					girdPanel.store.loadData(res);
				},
				failure: function(){

				}
			});

			currentPage = selected;
			var label = pagingPanel.query('label');
			if(pageCount < 5){
				label[0].hide();
				label[1].hide();
			}else{
				selected > 4 ? label[0].show() : label[0].hide();
				selected < pageCount - 3 ? label[1].show():label[1].hide();
			}
			pagingPanel.hide();

			var btnList = pagingPanel.query('button');
			btnList.forEach(function(item,i){
				item.removeCls('select');
				if(i === 0 || i === 1 || i === pageCount+2 || i === pageCount+3 )return;

				if(i === 2 || i === pageCount + 1)return item.show();
				if(selected - i > 1 || i - selected > 3){
					item.hide();
				}else{
					item.show();
				}
			});

			btnList[selected + 1].addCls('select');
			pagingPanel.show();
		}

		return function(girdPanel,pagingPanel,detail){
			currentPage = 1;
			pageCount = detail.pageCount;

			var items = [];

			for(var i = 0;i < pageCount + 2;i++){
				if(i === 0 || i === pageCount + 1 && i > 2){
					items[i] = Ext.create('Ext.button.Button',{
						text: i === 0 ? 1 : pageCount,
						handler: function(){
							var _i = i === 0 ? 1 : pageCount;
							return function(){
								updatePage(girdPanel,pagingPanel,_i,true);
							};
						}(),
					});
					continue;
				}else if(i === 1 || i === pageCount || pageCount < 2){
					items[i] = Ext.create('Ext.form.Label',{
						text: '...',
						style: {color: '#fff'},
					});
					continue;
				}
				items[i] = Ext.create('Ext.button.Button',{
					text: i,
					hidden: true,
					handler: function(){
						var _i = i;
						return function(){
							updatePage(girdPanel,pagingPanel,_i,true);
						};
					}(),
				});
			}

			items.unshift(Ext.create('Ext.button.Button',{
				text: '<',
				handler: function(){
					if(currentPage === 1)return;
					currentPage--;
					updatePage(girdPanel,pagingPanel,currentPage,true);
				}
			}));

			items.unshift(Ext.create('Ext.button.Button',{
				text: '<<',
				handler: function(){
					if(currentPage === 1)return;
					updatePage(girdPanel,pagingPanel,1,true);
				}
			}));

			items.push(Ext.create('Ext.button.Button',{
				text: '>',
				handler: function(){
					if(currentPage === pageCount)return;
					currentPage++;
					updatePage(girdPanel,pagingPanel,currentPage,true);
				}
			}));

			items.push(Ext.create('Ext.button.Button',{
				text: '>>',
				handler: function(){
					if(currentPage === pageCount)return;
					updatePage(girdPanel,pagingPanel,pageCount);
				}
			}));

			var s = Ext.create('Ext.form.Panel',{
				border: 0,
				items: items,
				width: 375,
				style: {
					margin: '0 auto',
				},
			});

			pagingPanel.add(s);

			updatePage(girdPanel,pagingPanel,1,false);
		}
	}();


	mainPanel.add([filterPanel,contentPanel,pagingBarPanel]);

	return mainPanel;
});