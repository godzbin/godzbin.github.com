vz2.extend('applicationStatistics',function(){
	'use strict';
	/* define pointer & storage */ 

	var 
		selector = 0,
		statLibrary;

	/* create Ext storage */ 

	var 

		periodStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: ''},
				{name: '近1小时',value: ''},
				{name: '近1天',value: ''},
				{name: '近1月',value: ''},
				{name: '自定义',value: ''},
			]
		}),

		vz_multiStatisticsStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'comType',       type: 'string'},
				{name: 'count',         type: 'float' },
				{name: 'successRate',   type: 'float' },
				{name: 'responseTime',  type: 'float' },
				{name: 'responseRate',  type: 'float' }
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			width: '100%',
			id: 'vz_multiStatistics',
			defaults: {
				border: 'none'
			},
			listeners: {
				afterrender: function(){
					reload();
				}
			},
			tbar: {
				items: [
					{
						xtype: 'combobox',
						labelAlign: 'left',
						fieldLabel: '时间',
						labelWidth: 50,
						margin: '0 20 0 0',
						store: periodStore,
						editable: false,
						displayField: "name",
						valueField: "value",
						queryMode: "local",
						listeners: {
							select: function(){
								var initial = false,
									cmp1,cmp2,cmp3;
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(1);
										cmp2 = itemList.get(2);
										cmp3 = itemList.get(3);
										initial = true;
									};

									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.lastMutatedValue === '自定义'?item.show():item.hide();
									});
								};
							}()
						}
					},
					vz2.createDateTimePicker(150,null,true),
					{
						text: '—',
						xtype:'label',
						style: {
							lineHeight: '24px',
							textAlign: 'center',
						},
						columnWidth: 1/46,
						hidden: true,
					},
					vz2.createDateTimePicker(150,null,true),
					{
						xtype: 'button',
						cls: 'vz_search_btn',
						columnWidth: 1/25,
						margin: '0 0 0 20',
						handler: function(){
							var 
								initial = false,
								itemList = [];

							return function(){
								if(false === initial){
									var _o1 = mainPanel.query('combobox'),
										_o2 = mainPanel.query('splitbutton');
									itemList.push(_o1[0],_o2[0],_o2[1]);
									initial = true;
								};
								var params = {time: itemList[0].lastMutatedValue};
								if(params.time === '自定义'){
									params.startTime = itemList[1].text;
									params.endTime   = itemList[2].text;
								};
								console.log(params);
								reload(params);
							}
						}()
					}
				]
			},
			items: [{
				xtype: 'radiogroup',
				layout: 'column',
				margin: '10 0',
				defaults: {
					padding: '0 20 0 0',
					xtype: 'radio',
					labelWidth: 80,
					boxLabelAlign: 'after',
					listeners: {
						dirtychange: function(){
							if(arguments[0].lastValue === false)return;
							selector = arguments[0].inputValue;
							void 0 !== statLibrary && vz_multiStatisticsStore.loadData(statLibrary[selector]);
						}
					}
				},
				items: [
					{
						boxLabel: '交易类型',
						inputValue: 0,
						checked: true
					},{
						boxLabel: '地市',
						inputValue: 1,
					},{
						boxLabel: '子渠道',
						inputValue: 2,
					},{
						boxLabel: '业务状态',
						inputValue: 3,
					},{
						boxLabel: '交易返回码',
						inputValue: 4,
					},{
						boxLabel: '服务器IP',
						inputValue: 5,
					},{
						boxLabel: '客户端IP',
						inputValue: 6,
					}
				]
			},{
				store: vz_multiStatisticsStore,
				padding: '20 40',
				height: 400,
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						menuDisabled: true,
						draggable: false,
						sortable: true,
						align: 'center',
						width: 160,
					},
					items: [
						{
							sortable: false,
							text: "序号",
							width: 80,
							xtype : 'rownumberer',
						}, {
							align: 'left',
							dataIndex: 'comType',
							forceFit: true,
							sortable: false,
							text: "交易类型",
							width: 400,
						}, {
							dataIndex: 'count',
							text: "交易笔数",
						}, {
							dataIndex: 'successRate',
							text: "成功率%",
						}, {
							dataIndex: 'responseTime',
							text: "响应时间ms",
						}, {
							dataIndex: 'responseRate',
							text: "响应率%",
						}
					]
				},
				viewConfig : {
					forceFit : false, 
					autoFill : false 
				},
				layout: 'fit',
			}]
		});

	var reload = function(params){
		vz2.ajax({
			url: 'applicationStatistics',
			params: params,
			success: function(res,eOpts){
				statLibrary = res;
				vz_multiStatisticsStore.loadData(statLibrary[selector]);
			},
			failure: function(result){

			}
		});
	};

	return mainPanel;
});