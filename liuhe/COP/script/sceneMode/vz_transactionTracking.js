vz2.extend('transactionTracking',function(){
	'use strict';

	/* create combobox store */ 

	var 

		clientIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '10.252.17.203',value: ''},
				{name: '10.252.17.204',value: ''},
				{name: '10.252.17.205',value: ''},
				{name: '10.252.17.206',value: ''},
				{name: '10.252.17.207',value: ''},
			]
		}),
		serverIPStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '10.252.17.203',value: ''},
				{name: '10.252.17.204',value: ''},
				{name: '10.252.17.205',value: ''},
				{name: '10.252.17.206',value: ''},
				{name: '10.252.17.207',value: ''},
			]
		}),
		typeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '检查客户资源',value: ''},
				{name: '支付',value: ''},
				{name: '返回查询CUST信息',value: ''},
				{name: '安装监测SIN密码',value: ''},
				{name: '提交',value: ''},
			]
		}),
		statementStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '全部',value: ''},
				{name: '排队中',value: ''},
				{name: '处理中',value: ''},
				{name: '成功',value: ''},
				{name: '失败',value: ''},
			]
		}),
		cityStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '广州',value: ''},
				{name: '东莞',value: ''},
				{name: '深圳',value: ''},
				{name: '珠海',value: ''},
				{name: '佛山',value: ''},
			]
		}),
		channelStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '广州越秀润粤服营厅',     value: ''},
				{name: '广州越秀东湖西路服营厅',  value: ''},
				{name: '广州中山大道西棠下营业厅',value: ''},
				{name: '广州九佛镇营业厅',       value: ''},
				{name: '广州良田镇营业厅',       value: ''},
			]
		}),
		codeStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '100',value: ''},
				{name: '101',value: ''},
				{name: '200',value: ''},
				{name: '201',value: ''},
				{name: '202',value: ''},
			]
		}),
		periodStore = Ext.create('Ext.data.Store',{
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: ''},
				{name: '近1小时', value: ''},
				{name: '近1天',   value: ''},
				{name: '近1月',   value: ''},
				{name: '自定义',  value: ''},
			]
		}),

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
				{name: 'code',     type: 'int'},
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
			items: [
				{
					layout: 'column',
					defaults: {
						xtype: 'combobox',
						labelWidth: 70,
						labelAlign: 'right',
						columnWidth: 0.23,
						editable: false,
						displayField: "name",
						valueField: "value",
						queryMode: "local",
					},
					items: [
						{
							xtype: 'label',
							text: '响应时长:',
							style: {
								lineHeight: '24px',
								textAlign: 'right',
								paddingRight: '5px'
							},
							columnWidth: 1/16
						}, {
							columnWidth: 1/16,
							xtype: 'textfield',
							editable: true,
						}, {
							xtype: 'label',
							text: '—',
							style: {
								lineHeight: '24px',
								textAlign: 'center',
							},
							columnWidth: 1/46
						}, {
							columnWidth: 1/16,
							xtype: 'textfield',
							editable: true,
						}, {
							xtype: 'label',
							text: 'ms',
							style: {
								lineHeight: '24px',
								textAlign: 'center',
							},
							columnWidth: 1/46
						}, {
							fieldLabel: '客户端id',
							store: clientIPStore,
							name: "clientIPStore",
						}, {
							fieldLabel: '服务端id',
							store: serverIPStore,
							name: "serverIPStore",
						}, {
							fieldLabel: '交易类型',
							store: typeStore,
							name: "typeStore",
						}
					]
				}, {
					layout: 'column',
					defaults: {
						xtype: 'combobox',
						labelWidth: 70,
						labelAlign: 'right',
						columnWidth: 0.23,
						editable: false,
						displayField: "name",
						valueField: "value",
						queryMode: "local",
					},
					items: [
						{
							fieldLabel: '业务状态',
							store: statementStore,
							name: "statementStore",
						}, {
							fieldLabel: '地市',
							store: cityStore,
							name: "cityStore",
						}, {
							fieldLabel: '子渠道',
							store: channelStore,
							name: "channelStore",
						}, {
							fieldLabel: '返回码',
							store: codeStore,
							name: "codeStore",
						}
					]
				}, {
					layout: 'column',
					defaults: {
						xtype: 'combobox',
						labelWidth: 70,
						labelAlign: 'right',
						columnWidth: 0.23,
					},
					items: [
						{fieldLabel: '手机号码',xtype: 'textfield'}, 
						{
							fieldLabel: '时间',
							columnWidth: 1/6,
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
											cmp1 = itemList.get(2);
											cmp2 = itemList.get(3);
											cmp3 = itemList.get(4);
											initial = true;
										};

										[cmp1,cmp2,cmp3].forEach(function(item){
											combobox.lastMutatedValue === '自定义' ? item.show():item.hide();
										});
									};
								}()
							}
						},
						vz2.createDateTimePicker(null,0.125,true),
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
										var _o1 = searchPanel.query('textfield,combobox');
										itemList.push(_o1[0],_o1[1],_o1[2],_o1[3],_o1[4],_o1[5],_o1[6],_o1[7],_o1[8],_o1[9],_o1[10]);
										var _o2 = searchPanel.query('splitbutton');
										itemList.push(_o2[0],_o2[_o2.length>2?2:1]);
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
									console.log(params);
									reload(params);
								}
							}()
						}
					]
				}
			]
		}),

		resultPanel = Ext.create('Ext.grid.Panel',{
			title: '匹配记录105笔',
			store: resultStore,
			margin: '20 0 0 0',
			height: 380,
			
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: true,
					align: 'center'
				},
				items: [
					{
						text: "序号",
						sortable: false,
						xtype : 'rownumberer',
						width: 50
					}, {
						text: "交易类型",
						sortable: false,
						dataIndex: 'type',
						width: 140,
						align: 'left',
					}, {
						text: "地市",
						dataIndex: 'city',
						width: 70
					}, {
						text: "子渠道",
						dataIndex: 'channel',
						width: 200,
						align: 'left',
					}, {
						text: "手机号码",
						dataIndex: 'phone',
						width: 100
					}, {
						text: "请求时间",
						dataIndex: 'reqTime',
						width: 125
					}, {
						text: "响应时间",
						dataIndex: 'resTime',
						width: 125
					}, {
						text: "客户端IP",
						dataIndex: 'clientIP',
						width: 105
					}, {
						text: "服务端IP",
						dataIndex: 'serverIP',
						width: 105
					}, {
						text: "返回码",
						dataIndex: 'code',
						width: 60
					}, {
						text: "业务状态",
						dataIndex: 'state',
						width: 75
					}
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
				resultPanel.setTitle('匹配记录'+res.length+'笔');
			},
			failure: function(){

			}
		});
	};

	return mainPanel;
});