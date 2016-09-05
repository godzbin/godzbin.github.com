/*
 * 交易追踪
 *
 */ 

vz2.extend('transactionTracking',function(){
	'use strict';

	/* create option for combobox */ 

	var 

		clientIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',         value: '0'},
				{name: '10.252.17.203',value: '10.252.17.203'},
				{name: '10.252.17.204',value: '10.252.17.204'},
				{name: '10.252.17.205',value: '10.252.17.205'},
				{name: '10.252.17.206',value: '10.252.17.206'},
				{name: '10.252.17.207',value: '10.252.17.207'},
			]
		}),
		serverIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',         value: '0'},
				{name: '10.252.18.203',value: '10.252.18.203'},
				{name: '10.252.18.204',value: '10.252.18.204'},
				{name: '10.252.18.205',value: '10.252.18.205'},
				{name: '10.252.18.206',value: '10.252.18.206'},
				{name: '10.252.18.207',value: '10.252.18.207'},
			]
		}),
		transactionTypeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',           value: '0'},
				{name: '检查客户资源',    value: '1'},
				{name: '支付',           value: '2'},
				{name: '返回查询CUST信息',value: '3'},
				{name: '安装监测SIN密码', value: '4'},
				{name: '提交',           value: '5'},
			]
		}),
		statementStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',  value: '0'},
				{name: '排队中',value: '1'},
				{name: '处理中',value: '2'},
				{name: '成功',  value: '3'},
				{name: '失败',  value: '4'},
			]
		}),
		cityStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '广州',value: '广州'},
				{name: '东莞',value: '东莞'},
				{name: '深圳',value: '深圳'},
				{name: '珠海',value: '珠海'},
				{name: '佛山',value: '佛山'},
			]
		}),
		channelStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{value:"0", name: '全部',     },
				{value:"1", name: '广州越秀润粤服营厅',     },
				{value:"2", name: '广州越秀东湖西路服营厅',  },
				{value:"3", name: '广州中山大道西棠下营业厅',},
				{value:"4", name: '广州九佛镇营业厅',       },
				{value:"5", name: '广州良田镇营业厅',       },
			]
		}),
		codeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',value: '0'},
				{name: '100',value: '100'},
				{name: '101',value: '101'},
				{name: '200',value: '200'},
				{name: '201',value: '201'},
				{name: '202',value: '202'},
			]
		}),
		periodStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近1月',   value: '43200'},
				{name: '自定义',  value: '0'},
			]
		}),
		/* grid panel store */ 
		resultStore = Ext.create('Ext.data.Store',{
			fields: [
				{name: 'type',     type: 'string'},
				{name: 'channel',  type: 'string'},
				{name: 'city',     type: 'string'},
				{name: 'phone',    type: 'int'},
				{name: 'reqTime',  type: 'string'},
				{name: 'resTime',  type: 'string'},
				{name: 'clientIP', type: 'string'},
				{name: 'serverIP', type: 'string'},
				{name: 'code',     type: 'string'},
				{name: 'state',    type: 'string'},
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			id: 'vz_transactionTracking',
			listeners: {
				afterrender: function(){
					reload();
				}
			}
		}),

		searchPanel = Ext.create('Ext.form.Panel',{
			layout: 'form',
			width: 1200,
			items: [
				{
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						displayField: "name",
						editable: false,
						labelWidth: 70,
						labelAlign: 'right',
						queryMode: "local",
						valueField: "value",
						xtype: 'combobox',
					},
					items: [
						{
							columnWidth: 1/16,
							style: "line-height: 24px;text-align: right;padding-right: 5px;",
							text: '响应时长:',
							xtype: 'label',
						}, {
							columnWidth: 1/16,
							editable: true,
							xtype: 'textfield',
						}, {
							columnWidth: 1/46,
							style: "line-height: 24px;text-align: center;",
							text: '—',
							xtype: 'label',
						}, {
							columnWidth: 1/16,
							editable: true,
							xtype: 'textfield',
						}, {
							columnWidth: 1/46,
							style: "line-height: 24px;text-align: center;",
							text: 'ms',
							xtype: 'label',
						}, {
							fieldLabel: '客户端id',
							store: clientIPStore,
							value: '0',
						}, {
							fieldLabel: '服务端id',
							store: serverIPStore,
							value: '0',
						}, {
							fieldLabel: '交易类型',
							store: transactionTypeStore,
							value: '0',
						}
					]
				}, {
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						displayField: "name",
						editable: false,
						labelWidth: 70,
						labelAlign: 'right',
						queryMode: "local",
						valueField: "value",
						xtype: 'combobox',
						allowBlank: false,
						blankText: '该字段不能为空',
						msgTarget: 'under',
					},
					items: [
						{store: statementStore,fieldLabel: '业务状态',value: '0'},
						{store: cityStore,     fieldLabel: '地市',value: '深圳'},
						{store: channelStore,  fieldLabel: '子渠道',value: '0'},
						{store: codeStore,     fieldLabel: '返回码',value: '0'},
					]
				}, {
					layout: 'column',
					defaults: {
						columnWidth: 0.23,
						labelWidth: 70,
						labelAlign: 'right',
						xtype: 'combobox',
					},
					items: [
						{fieldLabel: '手机号码',xtype: 'textfield'}, 
						{
							fieldLabel: '时间',
							columnWidth: 1/6,
							margin: '0 20 0 0',
							store: periodStore,
							editable: false,
							value: '60',
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
											cmp1 = itemList.get(2);
											cmp2 = itemList.get(3);
											cmp3 = itemList.get(4);
											initial = true;
										};

										[cmp1,cmp2,cmp3].forEach(function(item){
											combobox.value === '0' ? item.show():item.hide();
										});
									};
								}()
							}
						},
						vz2.createDateTimePicker(null,0.125,true),
						{
							columnWidth: 1/46,
							text: '—',
							style: "line-height: 24px;text-align: center;",
							hidden: true,
							xtype:'label',
						},
						vz2.createDateTimePicker(null,0.125,true),
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
										var obj1 = searchPanel.query('textfield,combobox'),
											obj2 = searchPanel.query('splitbutton');
										itemList.push(obj1[0],obj1[1],obj1[2],obj1[3],obj1[4],obj1[5],obj1[6],obj1[7],obj1[8],obj1[9],obj1[10]);
										itemList.push(obj2[0],obj2[obj2.length>2?2:1]);
										initial = true;
									}
									var params = {
										minResponseTime: itemList[0].lastValue,
										maxResponseTime: itemList[1].lastValue,
										clientIP:        itemList[2].lastMutatedValue,
										serverIP:        itemList[3].lastMutatedValue,
										type:            itemList[4].lastMutatedValue,
										statement:       itemList[5].lastMutatedValue,
										city:            itemList[6].lastMutatedValue,
										channel:         itemList[7].lastMutatedValue,
										code:            itemList[8].lastMutatedValue,
										phone:           itemList[9].lastValue,
										time:            itemList[10].lastMutatedValue,
										startTime:       itemList[11].text,
										endTime:         itemList[12].text
									}
									// for(var key in params){
									// 	params[key] === ''
									// }
									reload(params);
								}
							}()
						}
					]
				}, {
					html: '匹配记录0笔',
					margin: '20 0 0 0',
					style: 'font-size: 20px;display: inline-block',
					xtype: 'label',
				}
			]
		}),

		resultPanel = Ext.create('Ext.grid.Panel',{
			cls: 'vz_gridPanel',
			forceFit: true,
			height: 380,
			padding: '0 20',
			store: resultStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: true,
					align: 'center',
				},
				items: [
					{width: 50, xtype : 'rownumberer',text: "序号",sortable: false,}, 
					{width: 140,dataIndex: 'type',    text: "交易类型",align: 'left',sortable: false,}, 
					{width: 70, dataIndex: 'city',    text: "地市",}, 
					{width: 200,dataIndex: 'channel', text: "子渠道",  align: 'left',}, 
					{width: 100,dataIndex: 'phone',   text: "手机号码",}, 
					{width: 125,dataIndex: 'reqTime', text: "请求时间",}, 
					{width: 125,dataIndex: 'resTime', text: "响应时间",}, 
					{width: 105,dataIndex: 'clientIP',text: "客户端IP",}, 
					{width: 105,dataIndex: 'serverIP',text: "服务端IP",}, 
					{width: 70, dataIndex: 'code',    text: "返回码",}, 
					{width: 75, dataIndex: 'state',   text: "业务状态",}
				]
			}
		});

	mainPanel.add([searchPanel,resultPanel]);

	var reload = function(params){
		vz2.ajax({
			url: 'transactionTracking',
			params: params,
			success: function(res,eOpts){
				resultStore.loadData(res);
				searchPanel.query('label')[4].setText('匹配记录'+res.length+'笔');
			},
			failure: function(){

			}
		});
	};

	return mainPanel;
});