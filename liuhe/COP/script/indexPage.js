/**
 * create 2016-06-20  GODZ
 * 
 */
function IndexPage(parentNode) {
	// 事件冒充
	// this.newMethod = Content;
	// this.newMethod("page1");
	// delete this.newMethod;
	// 
	// call() 
	Page.call(this, Configes.page.indexPage);
	this._parentNode = parentNode;
	this.configes = {
		mapChartsId: "mapCharts",
		pieChartsId1: "pieChartsId1",
		pieChartsId2: "pieChartsId2",
		pieChartsId3: "pieChartsId3",
	};
	// apply()
	// Content.apply(this,Array("page1"));
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
		this.initPieChart();
		this.initMapChart();
		this.statu = 1;
		this.getOrderList();
	};


	// 初始化地图
	this.initMapChart = function() {
		this.mapChartsObj = new EchartMap(this.configes.mapChartsId, this);
		this.mapChartsObj.initView();
		this.mapChartsObj.myChart.on("mapselectchanged", this.setMapselectchanged, this);
		this.getAllSceneMap();
	};
	// 初始化饼图
	this.initPieChart = function() {
		this.piecharts1 = new EchartPie(this.configes.pieChartsId1, this, "按服务类型");
		this.piecharts2 = new EchartPie(this.configes.pieChartsId2, this, "按渠道");
		this.piecharts3 = new EchartPie(this.configes.pieChartsId3, this, "按探测方式");

		this.piecharts1.initView();
		this.piecharts2.initView();
		this.piecharts3.initView();
	};
	//  当地图被选中时
	this.setMapselectchanged = function(select) {

		var name = select.name;
		var province = this.leftPanelProvince.getComponent(0);

		province.setValue(name);

	};
	//  省份变化时
	this.leftPanelProvinceChange = function(textCop) {
		var name = textCop.getValue();
		var value = 0;
		var data = this.allSceneMap;


		var myChart = this.mapChartsObj.myChart;
		var option = this.mapChartsObj.option;
		if (name == "全国") {

			option.series[0].itemStyle.normal.areaColor = "#7FC533";

		} else {
			option.series[0].itemStyle.normal.areaColor = "#323c48";
		}
		myChart.setOption(option);
		this.allSceneMap = data;


		for (var i = 0, l = data.length; i < l; i++) {
			if (data[i].name == name) {
				value = data[i].value;
			}
		}
		this.mapChartsObj.myChart.dispatchAction({
			type: "mapSelect",
			name: name
		});
		this.leftPanelMapSelectProvinceLabel.setText(name);
		this.leftPanelMapSelectValueLabel.setText(value);

		this.getClassfiyMap(name);
	};
	// 写下饼图数据
	this.setPieCharts = function(option, charts, data) {
		var legendData = [];
		for (var i = 0, l = data.length; i < l; i++) {
			legendData.push(data[i]["name"])
		}
		option.legend.data = legendData;
		option.series[0].data = data;
		charts.setOption(option);
	};


	this.statuChange = function(btn) {
		if (btn.hasCls("action")) {
			return;
		}
		this.rightPanel2TopPanelStatuPanel.items.each(function(children) {
			children.removeCls("action");
		}, this);
		this.statu = btn.statu;
		btn.addCls("action");

		this.getOrderList();
	};

	this.openOrderInfo = function(v, el, row, column, e, record) {
		// console.log(arguments);
		var _id = record.get("_id");
		this._parentNode.openContent(Configes.page.myOrder, {
			record: record
		});
	};
	this.openOrderList = function(){
		this._parentNode.openContent(Configes.page.myOrder);
	};
	/**
	 *
	 * model
	 * 
	 */

	this.getAllSceneMap = function() {
		tools.getData(Configes.url.getAllSceneMap, null, this.setAllSceneMap.bind(this));
	};

	this.setAllSceneMap = function(data) {
		var myChart = this.mapChartsObj.myChart;
		var option = this.mapChartsObj.option;
		option.series[0].data = data;
		myChart.setOption(option);
		this.allSceneMap = data;


		var panel = this.leftPanelProvince.getComponent(0);
		this.leftPanelProvinceChange(panel);

	};

	this.getClassfiyMap = function(province) {
		tools.getData(Configes.url.getClassfiyMap, province, this.setClassfiyMap.bind(this));
	};
	this.setClassfiyMap = function(data) {
		var service = data.service;
		var channel = data.channel;
		var probe = data.probe;
		var chart1 = this.piecharts1.myChart;
		var chart2 = this.piecharts2.myChart;
		var chart3 = this.piecharts3.myChart;
		this.setPieCharts(this.piecharts1.option, chart1, service);
		this.setPieCharts(this.piecharts2.option, chart2, channel);
		this.setPieCharts(this.piecharts3.option, chart3, probe);
	};


	this.getOrderList = function() {
		var values = {};
		var province = this.rightPanel2TopPanelProvincePanel.getComponent(0).getValue();
		values.statu = this.statu;
		values.province = province;
		tools.getData(Configes.url.getOrderListTo + this.statu, values, this.setOrderList.bind(this));
	};
	this.setOrderList = function(data) {
		this.orderStore.loadData(data["list"]);
	};
	/**
	 *
	 *	store
	 * 
	 */
	this.orderStore = Ext.create("Ext.data.Store", {
		fields: ["_id", "service", "scene", "channel",
			"probe", "statu", "startTime", "province", "processor"
		],
		data: [
			[1, 2, 3, 4, 5, 6, 7, 8, 9]
		]
	});


	/**
	 *
	 *	view
	 *
	 * 
	 */

	// ==========================================================

	// 服务定制概况 标题
	this.leftPanelTitle = Ext.create("Ext.panel.Panel", {
		border: 0,
		style: "border-bottom: 1px #eee solid",
		height: 35,
		// padding: 5,
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
			text: "服务定制概况",
			style: "font-size: 18px; color: #fff; line-height: 35px;"
		}, {
			xtype: "label",
			text: "(当前服务)",
			style: "font-size: 14px; color: #fff;line-height: 35px;"
		}]
	});

	this.leftPanelProvince = Ext.create("Ext.panel.Panel", {
		border: 0,
		margin: "10 0",
		items: [{
			xtype: "combobox",
			name: "province",
			width: 100,
			store: Ext.create("Ext.data.Store", {
				fields: ["name", "value"],
				data: Configes.province
			}),
			editable: false,
			queryMode: 'local',
			displayField: 'name',
			valueField: "value",
			autoSelect: true,
			value: "甘肃",
			cls: "centerFormPanelCombobox",
			listeners: {
				change: Ext.bind(this.leftPanelProvinceChange, this)
			}
		}]
	});

	this.leftPanelMapCharts = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 400,
		width: "100%",
		html: "<div id='" + this.configes.mapChartsId + "' style='width: 100%; height: 100%;'></div>",
	});
	// 区域label
	this.leftPanelMapSelectProvinceLabel = Ext.create("Ext.form.Label", {
		text: ""
	});
	// 当前服务 label
	this.leftPanelMapSelectValueLabel = Ext.create("Ext.form.Label", {
		text: ""
	});
	//  选择后显示的panel
	this.leftPanelMapSelect = Ext.create("Ext.panel.Panel", {
		border: 0,
		// height: 50,
		width: "100%",
		style: "text-align: center;",
		items: [{
			cls: "centerFormPanel",
			padding: 5,
			xtype: "panel",
			width: "80%",
			style: "margin:0 auto;",
			defaults: {
				xtype: "label",
				style: "font-size: 14px; color: #fff; line-height: 30px;"
			},
			items: [{
				text: "区域："
			}, this.leftPanelMapSelectProvinceLabel, {
				margin: "0 0 0 20",
				text: "当前定制服务数：",
			}, this.leftPanelMapSelectValueLabel]
		}]
	});


	this.leftPanelBottomPanel1 = Ext.create("Ext.panel.Panel", {
		html: "<div id='" + this.configes.pieChartsId1 + "' style='width: 100%; height: 100%;'></div>",
	});
	this.leftPanelBottomPanel2 = Ext.create("Ext.panel.Panel", {
		html: "<div id='" + this.configes.pieChartsId2 + "' style='width: 100%; height: 100%;'></div>",
	})
	this.leftPanelBottomPanel3 = Ext.create("Ext.panel.Panel", {
		html: "<div id='" + this.configes.pieChartsId3 + "' style='width: 100%; height: 100%;'></div>",
	});

	this.leftPanelBottomPanel = Ext.create("Ext.panel.Panel", {
		layout: "column",
		border: 0,
		margin: "20 0",
		defaults: {
			margin: "0 10",
			padding: 5,
			border: 0,
			height: 300,
			columnWidth: 1 / 3,
			cls: "centerFormPanel",
		},
		items: [
			this.leftPanelBottomPanel1,
			this.leftPanelBottomPanel2,
			this.leftPanelBottomPanel3
		]
	});

	// 服务定制概况
	this.leftPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 1 / 2,
		cls: "centerFormPanel",
		padding: 10,
		height: 880,
		items: [
			this.leftPanelTitle,
			this.leftPanelProvince,
			this.leftPanelMapCharts,
			this.leftPanelMapSelect,
			this.leftPanelBottomPanel
		]
	});


	this.rightPanel2Title = Ext.create("Ext.panel.Panel", {
		border: 0,
		style: "border-bottom: 1px #eee solid",
		height: 35,
		layout: "border",
		items: [{
			region: "west",
			xtype: "panel",
			border: 0,
			margin: 5,
			width: 25,
			height: 25,
			html: "<img src='resources/images/myTask-big.png'>"
		}, {
			region: "west",
			xtype: "label",
			text: "订单/任务列表",
			style: "font-size: 18px; color: #fff; line-height: 35px;"
		}, {
			region: "east",
			xtype: "button",
			baseCls: "x-btn base-btn",
			style: "background: none;",
			text: "查看更多 >>",
			handler: Ext.bind(this.openOrderList, this)
		}]
	});
	// 订单/任务列表 状态
	this.rightPanel2TopPanelStatuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		region: "west",
		layout: "hbox",
		defaults: {
			xtype: "button",
			// width: 100,
			margin: "5 5",
			height: 25,
			baseCls: "x-btn base-btn",
			cls: "statuBtn",
			handler: Ext.bind(this.statuChange, this)
		},
		items: [{
			text: "待审批",
			cls: "statuBtn action",
			statu: 1,
		}, {
			text: "待验证配置",
			statu: 4,
		}, {
			text: "待部署",
			statu: 5,
		}, {
			text: "已完成",
			statu: 0,
		}]
	});
	// 订单/任务列表 省份
	this.rightPanel2TopPanelProvincePanel = Ext.create("Ext.panel.Panel", {
		region: "east",
		border: 0,
		margin: "5 0",
		items: [{
			xtype: "combobox",
			name: "province",
			width: 100,
			store: Ext.create("Ext.data.Store", {
				fields: ["name", "value"],
				data: Configes.province
			}),
			editable: false,
			queryMode: 'local',
			displayField: 'name',
			valueField: "value",
			autoSelect: true,
			value: "甘肃",
			cls: "centerFormPanelCombobox",
			listeners: {
				change: Ext.bind(this.leftPanelProvinceChange, this)
			}
		}]
	});
	this.rightPanel2TopPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 40,
		layout: "border",
		items: [this.rightPanel2TopPanelStatuPanel, this.rightPanel2TopPanelProvincePanel]
	});

	// 订单/任务列表 
	this.rightPanel2MainPanel = Ext.create("Ext.grid.Panel", {
		border: 0,
		height: 180,
		padding: 5,
		cls: "gridPanel",
		store: this.orderStore,
		autoRender: true,
		autoShow: false,
		forceFit: true,
		autoScroll:true,
		columns: {
			defaults: {
				menuDisabled: true,
				draggable: false,
				sortable: false,
				align: "center"
			},
			items: [{
				dataIndex: "_id",
				width: 120,
				text: "订单编号",
			}, {
				dataIndex: "province",
				text: "订单来源"
			}, {
				dataIndex: "service",
				text: "订单类型"
			}, {
				dataIndex: "scene",
				text: "订单内容"
			}, {
				dataIndex: "startTime",
				text: "下单时间",
				width: 120,
			}, {
				dataIndex: "processor",
				text: "当前处理人"
			}, {
				// dataIndex: "",
				text: "操作",
				// xtype: 'actioncolumn',
				width: 100,
				// items: [{
				// 	xtype: "button",
				// 	width: 20,
				// 	baseCls: "x-btn base-btn",
				// 	text: "查看",
				// 	handler: Ext.bind(this.openOrderDetails, this)
				// }]
				renderer: function() {
					return '<button class="x-btn base-btn" style="background: none; border: 1px #eee solid; height: 20px;">查看</button>'
				},
				listeners: {
					click: Ext.bind(this.openOrderInfo, this)
				}
			}]
		}
	});
	// 订单/任务列表
	this.rightPanel2 = Ext.create("Ext.panel.Panel", {
		height: 280,
		margin: "0 0 20 0",
		padding: 10,
		cls: "centerFormPanel",
		items: [
			this.rightPanel2Title,
			this.rightPanel2TopPanel,
			this.rightPanel2MainPanel
		]
	});



	//==============================================================
	var cTools = {
		drawBG: function(ctx,opts){
			ctx.beginPath();
			ctx.moveTo(10,0);
			ctx.lineTo(255,0);
			ctx.quadraticCurveTo(265,0,265,10);
			ctx.lineTo(265,300);
			ctx.quadraticCurveTo(265,310,255,310);
			ctx.lineTo(10,310);
			ctx.quadraticCurveTo(0,310,0,300);
			ctx.lineTo(0,10);
			ctx.quadraticCurveTo(0,0,10,0);
			ctx.closePath();
			ctx.fillStyle = 'rgba(0,0,0,0.2)';
			ctx.fill();
		},
		drawStatement: function(ctx,opts){
			ctx.save();

			ctx.translate(400,340);
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
			ctx.translate(132.5,20);
			ctx.font = '100 24px/1 arial';
			ctx.lineWidth = 2;
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
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
					100,
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
		drawVerticalBarChart: function(ctx,opts){
			ctx.save();

			ctx.translate(opts.x,opts.y);
			cTools.drawBG(ctx,opts);
			cTools.drawTitle(ctx,opts.title);

			ctx.save();
			ctx.translate(40,280);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.font = '100 24px/1 arial';
			opts.items.forEach(function(item,index){
				ctx.fillStyle = item.fillStyle;
				ctx.fillRect(80*index, 0, 30, -2*item.goal);
				ctx.fillStyle = '#fff';
				ctx.fillText(item.goal, 80*index+15, -2*item.goal-10);
			});

			ctx.fillStyle = '#fff';
			ctx.fillRect(0,0,190,2);

			ctx.restore();

			ctx.restore();
		},
		drawHorizontalBarChart: function(ctx,opts){
			ctx.save();
			ctx.translate(opts.x,opts.y);
			cTools.drawBG(ctx,opts);
			cTools.drawTitle(ctx,opts.title);

			ctx.save();
			ctx.translate(30,100);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'middle';
			ctx.font = '100 24px/1 arial';
			opts.items.forEach(function(item,index){
				ctx.fillStyle = item.fillStyle;
				ctx.fillRect(0, 70*index, 0.175*item.goal, 30);
				ctx.fillStyle = '#fff';
				ctx.fillText(item.goal, 0.175*item.goal+10, 70*index+15);
			});

			ctx.fillStyle = '#fff';
			ctx.fillRect(0,0,-2,170);

			ctx.restore();

			ctx.restore();
		}
	}
	// 监控数据概况
	this.rightPanel1 = Ext.create("Ext.panel.Panel", {
		height: 280,
		margin: "0 0 20 0",
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
						// style: 'background-color: transparent;',
						width: 25
					}, {
						region: 'west',
						xtype: 'label',
						style: {
							fontSize: '18px',
							lineHeight: '34px',
							color: '#fff',
						},
						text: '监控数据概况',
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
							listeners: {
								
							}
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
				items: [
					{
						region: 'west',
						xtype: 'button',
						text: '进入监控场景',
						border: 0,
					}, {
						region: 'east',
						xtype: "combobox",
						name: "province",
						width: 100,
						store: Ext.create("Ext.data.Store", {
							fields: ["name", "value"],
							data: Configes.province
						}),
						editable: false,
						queryMode: 'local',
						displayField: 'name',
						valueField: "value",
						autoSelect: true,
						value: "甘肃",
					}
				]
			}, {
				xtype: 'panel',
				html: '<canvas class="vz_homePage_canvas" width="1120" height="380"></canvas>',
				listeners: {
					afterrender: function(){
						var ctx = this.getEl().dom.querySelector('canvas').getContext('2d');


						cTools.drawPieChart(ctx,{
							x:0,  
							y:10,
							title:'交易量/笔',
							lineChartOriginX: 132.5,
							lineChartOriginY: 190,
							items: [
								{percent: 35,fillStyle: 'rgb(162,203,32)'},
								{percent: 30,fillStyle: 'rgb(35,151,217)'},
								{percent: 35,fillStyle: 'rgb(237,135,9)'}
							],
						});
						cTools.drawVerticalBarChart(ctx,{
							x:285,  
							y:10,
							title:'成功率％',
							items: [
								{goal: 99.5,fillStyle: 'rgb(162,203,32)'},
								{goal: 65.2,fillStyle: 'rgb(35,151,217)'},
								{goal: 87.3,fillStyle: 'rgb(237,135,9)'}
							],
						});
						cTools.drawPieChart(ctx,{
							x:855,  
							y:10,
							title:'告警数/次',
							lineChartOriginX: 132.5,
							lineChartOriginY: 190,
							items: [
								{percent: 35,fillStyle: 'rgb(162,203,32)'},
								{percent: 30,fillStyle: 'rgb(35,151,217)'},
								{percent: 35,fillStyle: 'rgb(237,135,9)'}
							]
						});
						cTools.drawHorizontalBarChart(ctx,{
							x:570,
							y:10,
							title:'响应时间ms',
							items: [
								{goal: 1135.4,fillStyle: 'rgb(162,203,32)'},
								{goal: 905.2, fillStyle: 'rgb(35,151,217)'},
								{goal: 971.3, fillStyle: 'rgb(237,135,9)'}
							],
						});

						cTools.drawStatement(ctx,{
							items: [
								{text: '营业厅',fillStyle: 'rgb(162,203,32)'},
								{text: '掌厅',  fillStyle: 'rgb(35,151,217)'},
								{text: '网厅',  fillStyle: 'rgb(237,135,9)'}
							]
						})
					},
				},
			}
		]
	});



	// 告警概况
	this.rightPanel3 = Ext.create("Ext.panel.Panel", {
		height: 280,
		margin: "0",
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
					}, {
						// store: null,
						region: 'east',
						xtype: "combobox",
						name: "province",
						width: 100,
						store: Ext.create("Ext.data.Store", {
							fields: ["name", "value"],
							data: Configes.province
						}),
						editable: false,
						queryMode: 'local',
						displayField: 'name',
						valueField: "value",
						autoSelect: true,
						value: "甘肃",
					}
				]
			}, {
				xtype: 'grid',
				margin: '10 0 0 0',
				height: 200,
				padding: '5',
				forceFit: true,
				cls: 'gridPanel',
				border: 0,
				store: new Ext.create('Ext.data.Store',{
					fields: ['province','resource','scene','channel','count'],
					data: [
						{'province':'甘肃省','resource':'被动业务探测系统','scene':'故障定位监控','channel':'营业厅','count':'5'},
						{'province':'甘肃省','resource':'被动业务探测系统','scene':'故障定位监控','channel':'掌厅','count':'3'},
						{'province':'广东省','resource':'智能分析平台','scene':'收入保障监控','channel':'掌厅','count':'3'},
						{'province':'贵州省','resource':'智能分析平台','scene':'故障定位监控','channel':'网厅','count':'2'},
						{'province':'甘肃省','resource':'被动业务探测系统','scene':'故障定位监控','channel':'营业厅','count':'1'},
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
		]
	});


	// 数据展示
	this.rightPanel = Ext.create("Ext.panel.Panel", {
		columnWidth: 1 / 2,
		items: [
			this.rightPanel1,
			this.rightPanel2,
			this.rightPanel3
		]
	});

	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		padding: "10",
		defaults: {
			margin: "0 10"
		},
		items: [this.leftPanel, this.rightPanel]
	});
}
IndexPage.prototype = new Page(Configes.page.indexPage);