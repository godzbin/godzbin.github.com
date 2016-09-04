/**
 *
 *
 *	省端用户首页
 * 
 */
function IndexPage2(parentNode) {

	Page.call(this, Configes.page.indexPage2);
	this._parentNode = parentNode;
	this.msg = new function() {
		this.checkMore = "查看详情 >>";
		this.centerChild1Text = [{
			text: "故障定位监控",
			cls: "index-title",

		}];
		this.centerChild2Text = [{
			text: "端到端监控",
			cls: "index-title",
		}, {
			text: "* 端到端覆盖全应用路径",
			cls: "index-desc"
		}, {
			text: "* 关注应用交易性能",
			cls: "index-desc"
		}, {
			text: "* 追踪应用服务质量",
			cls: "index-desc"
		}, {
			text: "* 快速诊断和定位故障",
			cls: "index-desc"
		}];
		this.centerChild3Text = [{
			text: "客户感知监控",
			cls: "index-title",
		}, {
			text: "* 客户体验端到端感知视图",
			cls: "index-desc"
		}, {
			text: "* 面向业务、面向场景、面向用户",
			cls: "index-desc"
		}, {
			text: "* 实现多维度的客户感知综合分析和追溯功能",
			cls: "index-desc"
		}];
		this.centerChild4Text = [{
			text: "后端流量监测",
			cls: "index-title",
		}, {
			text: "* 配置化协议解码",
			cls: "index-desc"
		}, {
			text: "* 实时监控后端服务性能",
			cls: "index-desc"
		}, {
			text: "* KPI多维视图展现",
			cls: "index-desc"
		}];
		this.centerChild5Text = [{
			text: "收入保障监控",
			cls: "index-title",
		}, {
			text: "* 收入保障监控",
			cls: "index-desc"
		}, {
			text: "* 关注运营商的收入与支出业务流程所有环节",
			cls: "index-desc"
		}, {
			text: "* 对核心的资料进行有效稽核",
			cls: "index-desc"
		}];
		this.centerChild6Text = [{
			text: "专题监控",
			cls: "index-title",

		}, {
			text: "* 基于真实的业务交易数据",
			cls: "index-desc"
		}, {
			text: "* 建立业务分析模型",
			cls: "index-desc"
		}, {
			text: "* 提升运营效率",
			cls: "index-desc"
		}];
	};
	this.run = function() {
		if (!this.loading) {
			this.initView();
		}
		this.loading = true;
		this.mainPanelShow();
	};
	this.initView = function() {
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
	};



	/**
	 * view
	 *
	 *
	 *
	 *
	 * 
	 */
	this.openSecenInfo = function(btn) {
		var sceneId = btn.sceneId;
		this._parentNode.openContent(Configes.page.serviceDirectory, sceneId)
	};
	this.upPage = function() {
		var mainPanel = this.bottomMainPanelCenter;
		var length = mainPanel.items.length;
		var panelLast = mainPanel.getComponent(length - 1);
		var width = panelLast.getWidth();
		mainPanel.remove(panelLast, false);
		var newPanel = mainPanel.insert(0, panelLast);
	};
	this.nextPage = function() {
		var mainPanel = this.bottomMainPanelCenter;
		var panel1 = mainPanel.getComponent(0);
		mainPanel.remove(panel1, false);
		mainPanel.add(panel1);
	};



	this.bottomMainPanelUpBtn = Ext.create("Ext.panel.Panel", {
		region: "west",
		width: "5%",
		style: "text-align: center;",
		items: [{
			xtype: "button",
			text: "<",
			width: "100%",
			height: 170,
			baseCls: "x-btn base-btn",
			style: "background: none;",
			textStyle: "font-size: 20px; color: #fff ;",
			handler: Ext.bind(this.upPage, this)
		}]
	});
	this.bottomMainPanelNextBtn = Ext.create("Ext.panel.Panel", {
		region: "east",
		width: "5%",
		style: "text-align: center;",
		items: [{
			xtype: "button",
			text: ">",
			width: "100%",
			height: 170,
			baseCls: "x-btn base-btn",
			style: "background: none;",
			textStyle: "font-size: 20px; color: #fff ;",
			handler: Ext.bind(this.nextPage, this)
		}],
	});
	this.bottomMainPanelCenterChild1 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon1.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild1Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 1,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});
	this.bottomMainPanelCenterChild2 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon2.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild2Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 2,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});
	this.bottomMainPanelCenterChild3 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon3.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild3Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 3,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});
	this.bottomMainPanelCenterChild4 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon4.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild4Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 4,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});
	this.bottomMainPanelCenterChild5 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon5.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild5Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 5,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});
	this.bottomMainPanelCenterChild6 = Ext.create("Ext.panel.Panel", {
		items: [{
			layout: "hbox",
			items: [{
				xtype: "panel",
				height: 100,
				width: 100,
				html: "<img src='resources/images/index-icon6.png' style='width: 100%;height:100%'>"
			}, {
				xtype: "panel",
				width: 150,
				margin: "0 20",
				layout: "vbox",
				defaults: {
					xtype: "label",
				},
				items: this.msg.centerChild6Text
			}]
		}, {
			xtype: "button",
			height: 30,
			text: this.msg.checkMore,
			baseCls: "x-btn base-btn",
			cls: "index-checkMore",
			sceneId: 6,
			handler: Ext.bind(this.openSecenInfo, this)
		}]
	});


	this.bottomMainPanelCenter = Ext.create("Ext.panel.Panel", {
		region: "center",
		layout: "hbox",
		defaults: {
			width: "35%",
			xtype: "panel",
			// style: "margin: 0 5% 0 0;",
			height: 150,
			margin: "10",
			padding: 20,
			cls: "indexBottomMainPanelCenter",
			// 
		},
		items: [
			this.bottomMainPanelCenterChild1,
			this.bottomMainPanelCenterChild2,
			this.bottomMainPanelCenterChild3,
			this.bottomMainPanelCenterChild4,
			this.bottomMainPanelCenterChild5,
			this.bottomMainPanelCenterChild6
		]
	});
	// 场景 主panel
	this.bottomMainPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 170,
		layout: "border",
		defaults: {
			height: 170
		},
		items: [
			this.bottomMainPanelUpBtn,
			this.bottomMainPanelCenter,
			this.bottomMainPanelNextBtn
		]
	});
	this.bottomTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		style: "border-bottom: 1px #eee solid",
		height: 35,
		layout: "hbox",
		items: [{
			xtype: "panel",
			border: 0,
			margin: 5,
			width: 25,
			height: 25,
			html: "<img src='resources/images/serviceManage-big.png'>"
		}, {
			xtype: "label",
			text: "业务监控场景",
			style: "font-size: 18px; color: #fff; line-height: 35px;"
		}]
	});

	//  服务目录
	this.bottomPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "20 0 0 0",
		height: 220,
		padding: "5 10",
		cls: "centerFormPanel",
		items: [
			this.bottomTitlePanel,
			this.bottomMainPanel
		]
	});

	// ===================================================================================
	// 概况
	var cTools = {
		drawBG: function(ctx,opts){
			ctx.beginPath();
			ctx.moveTo(10,0);
			ctx.lineTo(540,0);
			ctx.quadraticCurveTo(550,0,550,10);
			ctx.lineTo(550,190);
			ctx.quadraticCurveTo(550,200,540,200);
			ctx.lineTo(10,200);
			ctx.quadraticCurveTo(0,200,0,190);
			ctx.lineTo(0,10);
			ctx.quadraticCurveTo(0,0,10,0);
			ctx.closePath();
			ctx.fillStyle = 'rgba(0,0,0,0.2)';
			ctx.fill();
		},
		drawStatement: function(ctx,opts){
			ctx.save();

			ctx.translate(420,420);
			ctx.textBaseLine = 'middle';
			opts.items.forEach(function(item,index){
				ctx.fillStyle = item.fillStyle;
				ctx.fillRect(index*120,1,18,18);
				ctx.fillStyle = '#fff';
				ctx.font = '100 20px/1 arial';
				ctx.fillText(item.text,index*120+30,18);
			});

			ctx.restore();
		},
		drawTitle: function(ctx,text){
			ctx.save();
			ctx.translate(20,20);
			ctx.font = '100 24px/1 arial';
			ctx.lineWidth = 2;
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#fff';
			ctx.fillText(text,0,0);
			ctx.restore();
		},
		drawPieChart: function(ctx,opts){
			ctx.save();

			ctx.translate(opts.x,opts.y);
			cTools.drawBG(ctx,opts);
			cTools.drawTitle(ctx,opts.title);
			var 
				startAnkle = -Math.PI / 2,
				endAnkle;

			ctx.save();

			opts.items.forEach(function(item,index){
				ctx.beginPath();

				endAnkle = startAnkle + Math.PI * item.percent / 50;
				ctx.arc(
					opts.lineChartOriginX,
					opts.lineChartOriginY,
					80,
					startAnkle,
					endAnkle,
					false
				);
				ctx.lineTo(opts.lineChartOriginX,opts.lineChartOriginY);
				ctx.fillStyle = item.fillStyle;
				ctx.fill();
				startAnkle = endAnkle;
			});
			ctx.closePath();

			ctx.restore();

			ctx.restore();
		},
		drawHorizontalBarChart: function(ctx,opts){
			ctx.save();
			ctx.translate(opts.x,opts.y);
			cTools.drawBG(ctx,opts);
			cTools.drawTitle(ctx,opts.title);

			ctx.save();
			ctx.translate(200,20);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.font = '100 24px/1 arial';
			opts.items.forEach(function(item,index){
				var goal = item.goal > 100 ? item.goal : item.goal * 10;
				ctx.fillStyle = item.fillStyle;
				ctx.fillRect(0, 65*index, 0.175*goal, 30);
				ctx.fillStyle = '#fff';
				ctx.fillText(item.goal, 0.175*goal+10, 65*index+15);
			});

			ctx.fillStyle = '#fff';
			ctx.fillRect(0,0,-2,160);

			ctx.restore();

			ctx.restore();
		}
	}
	this.topLeftPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 320,
		columnWidth: 1 / 2,
		margin: "0 20 0 0",
		cls: "centerFormPanel vz_cform",
		items: [
			{
				layout: 'border',
				style: 'border-bottom: 1px #fff solid',
				height: 35,
				items: [
					{
						xtype: 'button',
						region: 'west',
						border: 0,
						width: 25
					}, {
						region: 'west',
						xtyps: 'label',
						style: {
							fontSize: '18px',
							lineHeight: '34px',
							color: '#fff',
						},
						text: '监控数据情况',
					}, {
						xtype: 'tabbar',
						width: 250,
						region: 'east',
						cls: 'vz_monitorSceneMenu',
						defaults: {
							width: 25,
							height: 25,
							border: 0,
							margin: '0 15 0 0',
							xtype: 'button',
						},
						items: [
							{
								tooltip: '故障定位监控',
								cls: 'vz-icon-i14 vz-icon',
								pageId: 0,
								style: 'opacity: 1',
							},{
								xtype: 'box',
								cls: 'vz-icon-i15 vz-icon',
								pageId: 1,
								disabled: true,
							},{
								xtype: 'box',
								cls: 'vz-icon-i16 vz-icon',
								pageId: 2,
								disabled: true,
							},{
								xtype: 'box',
								cls: 'vz-icon-i17 vz-icon',
								pageId: 3,
								disabled: true,
							},{
								xtype: 'box',
								cls: 'vz-icon-i18 vz-icon',
								pageId: 4,
								disabled: true,
							},{
								xtype: 'box',
								cls: 'vz-icon-i19 vz-icon',
								pageId: 5,
								disabled: true,
								margin: '0',
							}
						]
					}
				]
			}, {
				layout: 'border',
				margin: '5 0',
				height: 25,
				items: {
					region: 'east',
					xtype: 'button',
					text: '进入监控场景',
					border: 0,
				}
			}, {
				xtype: 'panel',
				html: '<canvas class="vz_homePage_canvas" width="1120" height="440"></canvas>',
				listeners: {
					afterrender: function(){
						var ctx = this.getEl().dom.querySelector('canvas').getContext('2d');

						cTools.drawPieChart(ctx,{
							x:0,  
							y:0,
							title:'交易量/笔',
							lineChartOriginX: 300,
							lineChartOriginY: 100,
							items: [
								{percent: 35,fillStyle: 'rgb(162,203,32)'},
								{percent: 30,fillStyle: 'rgb(35,151,217)'},
								{percent: 35,fillStyle: 'rgb(237,135,9)'}
							],
						});
						cTools.drawHorizontalBarChart(ctx,{
							x:570,
							y:0,
							title:'成功率/%',
							items: [
								{goal: 99.5,fillStyle: 'rgb(162,203,32)'},
								{goal: 65.2,fillStyle: 'rgb(35,151,217)'},
								{goal: 87.3,fillStyle: 'rgb(237,135,9)'}
							],
						});
						cTools.drawHorizontalBarChart(ctx,{
							x:0,
							y:210,
							title:'响应时间/ms',
							items: [
								{goal: 1135.4,fillStyle: 'rgb(162,203,32)'},
								{goal: 905.2, fillStyle: 'rgb(35,151,217)'},
								{goal: 971.3, fillStyle: 'rgb(237,135,9)'}
							],
						});
						cTools.drawPieChart(ctx,{
							x:570,  
							y:210,
							title:'告警数/次',
							lineChartOriginX: 300,
							lineChartOriginY: 100,
							items: [
								{percent: 35,fillStyle: 'rgb(162,203,32)'},
								{percent: 30,fillStyle: 'rgb(35,151,217)'},
								{percent: 35,fillStyle: 'rgb(237,135,9)'}
							],
						});

						cTools.drawStatement(ctx,{
							items: [
								{text: '营业厅',fillStyle: 'rgb(162,203,32)'},
								{text: '掌厅',  fillStyle: 'rgb(35,151,217)'},
								{text: '网厅',  fillStyle: 'rgb(237,135,9)'}
							]
						});
					}
				}
			}
		]
	});
	//  告警
	this.topRightPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 320,
		columnWidth: 1 / 2,
		cls: "centerFormPanel vz_cform",
		items: [
			{
				layout: 'border',
				height: 35,
				padding: '5 0',
				style: 'border-bottom: 1px #fff solid',
				items: [
					{
						xtype: 'button',
						region: 'west',
						cls: 'vz-icon vz-icon-i1',
						width: 31,
						handler: function(){

						}
					}, {
						region: 'west',
						style: {
							color: '#fff',
							fontSize: '18px',
							lineHeight: '24px',
						},
						text: '告警概况',
						xtype: 'label',
					}, {
						region: 'west',
						style: {
							color: '#fff',
							fontSize: '14px',
							lineHeight: '28px',
						},
						text: '（未关闭）',
						xtype: 'label',
					}
				]
			}, {
				xtype: 'grid',
				margin: '10 0 0 0',
				height: 240,
				padding: '5',
				forceFit: true,
				cls: 'gridPanel',
				border: 0,
				store: new Ext.create('Ext.data.Store',{
					fields: ['province','resource','scene','channel','count'],
					data: [
						{'province':'深圳','resource':'','scene':'','channel':'','count':''}
					]
				}),
				columns: {
					defaults: {
						sortable: false,
						menuDisabled: true,
						draggable: false,
						align: 'center',
					},
					items: [
						{
							dataIndex: 'province',
							text: '省份',
						}, {
							dataIndex: 'resource',
							text: '告警来源',
						}, {
							dataIndex: 'scene',
							text: '监控场景',
						}, {
							dataIndex: 'channel',
							text: '探测渠道',
						}, {
							dataIndex: 'count',
							text: '告警条数',
						}, {
							text: '操作',
							renderer: function(){
								return '<input type="button" value="查看" style="background-color: transparent;color: #fff;border-radius: 5px;box-shadow: none;border-width: 1px;">'
							}
						}
					]
				}
			}
		],
	});

	// 概况 和 告警
	this.topPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 320,
		layout: "column",
		items: [
			this.topLeftPanel,
			this.topRightPanel
		]
	});



	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.topPanel,
			this.bottomPanel
		]
	});

}
IndexPage.prototype = new Page(Configes.page.indexPage2);