/*
 * 多维统计
 *
 */ 

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
				{name: '自定义',  value: '0'},
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近1月',   value: '43200'},
			]
		}),

		multiStatisticsStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'transactionType', type: 'string'},
				{name: 'transactionCount',type: 'int'   },
				{name: 'successRate',     type: 'float' },
				{name: 'responseTime',    type: 'float' },
				{name: 'responseRate',    type: 'float' }
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
						displayField: "name",
						editable: false,
						fieldLabel: '时间',
						labelAlign: 'left',
						labelWidth: 50,
						margin: '0 20 0 0',
						queryMode: "local",
						store: periodStore,
						valueField: "value",
						value: '60',
						xtype: 'combobox',
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
										combobox.value === '0'?item.show():item.hide();
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
						cls: 'vz_search_btn',
						columnWidth: 1/25,
						margin: '0 0 0 20',
						xtype: 'button',
						handler: function(){
							var 
								initial = false,
								itemList = [];

							return function(){
								if(false === initial){
									var obj1 = mainPanel.query('combobox'),
										obj2 = mainPanel.query('splitbutton');
									itemList.push(obj1[0],obj2[0],obj2[1]);
									initial = true;
								};
								
								var params = {time: itemList[0].value};
								if(params.time === '0'){
									params.startTime = itemList[1].text;
									params.endTime   = itemList[2].text;
								};
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
					boxLabelAlign: 'after',
					labelWidth: 80,
					padding: '0 20 0 0',
					xtype: 'radio',
					listeners: {
						dirtychange: function(){
							if(arguments[0].lastValue === false)return;
							selector = arguments[0].inputValue;
							void 0 !== statLibrary && multiStatisticsStore.loadData(statLibrary[selector]);
						}
					}
				},
				items: [
					{inputValue: 0,boxLabel: '交易类型',checked: true},
					{inputValue: 1,boxLabel: '地市'},
					{inputValue: 2,boxLabel: '子渠道'},
					{inputValue: 3,boxLabel: '业务状态'},
					{inputValue: 4,boxLabel: '交易返回码'},
					{inputValue: 5,boxLabel: '服务器IP'},
					{inputValue: 6,boxLabel: '客户端IP'}
				]
			},{
				store: multiStatisticsStore,
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
							dataIndex: 'transactionType',
							forceFit: true,
							sortable: false,
							text: "交易类型",
							width: 400,
						}, {
							dataIndex: 'transactionCount',
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
				forceFit : true, 
			}]
		});

	var reload = function(params){
		vz2.ajax({
			url: 'applicationStatistics',
			params: params,
			success: function(res,eOpts){
				statLibrary = res;
				multiStatisticsStore.loadData(statLibrary[selector]);
			},
			failure: function(result){

			}
		});
	};

	return mainPanel;
});