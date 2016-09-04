/*
 * 应用层快照
 *
 */ 

vz2.extend('applicationSnapShot',function(){
	'use strict';
	
	var 
		transactionTypeStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部',     value: '0'},
				{name: '交易类型1', value: '1'},
				{name: '交易类型2', value: '2'},
				{name: '交易类型3', value: '3'},
				{name: '交易类型4', value: '4'},
				{name: '交易类型5', value: '5'}
			]
		}),
		cityStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '广州', value: '1'},
				{name: '东莞', value: '2'},
				{name: '珠海', value: '3'},
				{name: '深圳', value: '4'},
				{name: '佛山', value: '5'}
			]
		}),
		transactionChannelStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易渠道1', value: '1'},
				{name: '交易渠道2', value: '2'},
				{name: '交易渠道3', value: '3'},
				{name: '交易渠道4', value: '4'},
				{name: '交易渠道5', value: '5'}
			]
		}),
		periodStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '近10分钟',value: '10'},
				{name: '近1小时', value: '60'},
				{name: '近1天',   value: '1440'},
				{name: '近30天',  value: '43200'},
				{name: '自定义',  value: '0'}
			]
		}),

		typeRankingStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'type',       type: 'string'},
				{name: 'responTime', type: 'float' }
			]
		}),
		codeRankingStore = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'code',    type: 'string'},
				{name: 'count',   type: 'int'   },
				{name: 'percent', type: 'float' }
			]
		});

	var mainPanel = Ext.create('Ext.panel.Panel',{
		width: '100%',
		id: 'vz_appSnapShot',
		defaults: {
			border: 'none'
		},
		listeners: {
			afterrender: function(){
				reload();
			}
		},
		tbar: {
			defaults: {
				displayField: 'name',
				valueField: 'value',
				queryMode: 'local',
				labelWidth: '1px',
				editable: false,
			},
			items: [
				{
					fieldLabel: '交易类型',
					store: transactionTypeStore,
					value: '0',
					xtype: 'combobox',
				},{
					fieldLabel: '地市',
					labelWidth: 30,
					store: cityStore,
					value: '1',
					width: 150,
					xtype: 'combobox',
				},{
					fieldLabel: '子渠道',
					store: transactionChannelStore,
					value: '0',
					xtype: 'combobox',
				},{
					fieldLabel: '时间',
					margin: '0 20 0 0',
					width: 150,
					labelWidth: 30,
					store: periodStore,
					value: '60',
					xtype: 'combobox',
					listeners: {
						select: function(){
							var initial = false,
								cmp1,cmp2,cmp3;
							return function(combobox,e){
								if(false === initial){
									var itemList = mainPanel.query('splitbutton,label');
									cmp1 = itemList[0];
									cmp2 = itemList[1];
									cmp3 = itemList[2];
									initial = true;
								};

								[cmp1,cmp2,cmp3].forEach(function(item){
									combobox.lastMutatedValue === '自定义'?item.show():item.hide();
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
							customTime = false,

							params = {},
							inputItemList;

						return function(){
							if(false === initial){
								inputItemList  = mainPanel.query('combobox,splitbutton');

								initial = true;
							}
							params = {
								type:    inputItemList[0].lastMutatedValue,
								city:    inputItemList[1].lastMutatedValue,
								channel: inputItemList[2].lastMutatedValue,
								time:    inputItemList[3].lastMutatedValue,
							}
							if(true === customTime || inputItemList[6].text !== '选择日期时间' && inputItemList[7].text !== '选择日期时间'){

								params.startTime = inputItemList[6].text;
								params.endTime   = inputItemList[7].text;
								customTime = true;
							}
							console.log(params);

							reload(params);
						}
					}()
				}
			]
		},
		items: [{
			cls: 'vz_appSnapShot_count',
			layout: 'column',
			margin: '20 0 20 0',
			defaults: {
				columnWidth: 1/4,
				xtype: 'panel',
				height: 140,
				style: {
					fontSize: '30px'
				},
			},
			items: [
				{
					title: "交易量(笔)",
					margin: '0 20 0 0',
					items: {
						xtype: 'box',
						html: '11109',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "成功率(%)",
					margin: '0 10 0 0',
					items: {
						xtype: 'box',
						html: '98.86',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "响应时间(ms)",
					margin: '0 0 0 10',
					items: {
						xtype: 'box',
						html: '58.755',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				},{
					title: "响应率(%)",
					margin: '0 0 0 20',
					items: {
						xtype: 'box',
						html: '100',
						style: {
							fontSize: '70px',
							textAlign: 'center',
							lineHeight: '100px'
						},

					}
				}
			]
		}, {
			layout: 'column',
			items: [{
				columnWidth: 1 / 2,
				cls: 'vz_appSnapShot_Ranking',
				height: 400,
				margin: '0 10 0 0',
				store: typeRankingStore,
				title: '交易类型排名',
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						align: 'left',
						border: 'none',
						draggable: false,
						menuDisabled: true,
						padding: '5 0 5 0',
						sortable: false,
					},
					items: [
						{
							dataIndex: 'type',
							text: "响应类型",
							width: 300
						}, {
							dataIndex: 'responTime',
							text: "交易时长(ms)",
							width: 100
						}
					]
				},
				forceFit: true,
			}, {
				columnWidth: 1 / 2,
				cls: 'vz_appSnapShot_Ranking',
				height: 400,
				margin: '0 0 0 10',
				store: codeRankingStore,
				title: '返回码排名',
				xtype: 'grid',
				columns: {
					border: 'none',
					defaults: {
						align: 'left',
						border: 'none',
						draggable: false,
						menuDisabled: true,
						padding: '5 0 5 0',
						sortable: false,
					},
					items: [
						{
							dataIndex: 'code',
							text: "返回码"
						}, {
							dataIndex: 'count',
							text: "交易量(笔)"
						}, {
							dataIndex: 'percent',
							text: "百分比(%)"
						}
					]
				},
				forceFit: true,
			}]
		}]
	});

	var 
		reload = function(){
			var 
				initial = false,
				outputItemList = [];

			return function(params){
				if(false === initial){
					var o = mainPanel.items.get(0).query('box');
					outputItemList.push(
						document.getElementById(o[3].id),
						document.getElementById(o[7].id),
						document.getElementById(o[11].id),
						document.getElementById(o[15].id)
					);
					initial = true;
				}

				vz2.ajax({
					url: 'applicationSnapShot',
					params: params,
					success: function(res,eOpts){
						outputItemList[0].innerHTML = res.total.transactionCount;
						outputItemList[1].innerHTML = res.total.successRate;
						outputItemList[2].innerHTML = res.total.responseTime;
						outputItemList[3].innerHTML = res.total.responseRate;

						typeRankingStore.loadData(res.typeRanking);
						codeRankingStore.loadData(res.codeRanking);
					},
					failure: function(){

					}
				});

			}
		}();

	return mainPanel;
});