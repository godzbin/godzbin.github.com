// 
// create Godz 2016 06 27
// 
// 
// 监控首页
// 
function MonitorHomePage(parentNode) {
	Page.call(this, Configes.page.MonitorHomePage);
	this._parentNode = parentNode;
	this.configes = {
		mapChartsId: "mapCharts",
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

		this.setMainPanel();

		mainPanel.add(this.mainPanelbody);

		this.setMapPanel();
		this.setGridMainPanel();

		// // 	地图图标对象
		var that = this;
		setTimeout(function() {
			that.mapChartsObj = new EchartMap(that.configes.mapChartsId);
			that.mapChartsObj.initView();
		}, 100);

	};

	//  store
	this.linkStore = Ext.create("Ext.data.Store", {
		fixeds: ["NAME", "VALUE"],
		data: [{
			NAME: "监控类",
			VALUE: 0,
		}, {
			NAME: "分析类",
			VALUE: 1,
		}, {
			NAME: "展示类",
			VALUE: 2,
		}]
	});
	this.sceneStore = Ext.create("Ext.data.Store", {
		fixeds: ["NAME", "VALUE"],
		data: [{
			NAME: "端到端",
			VALUE: 0,
		}, {
			NAME: "流量",
			VALUE: 1,
		}, {
			NAME: "专题",
			VALUE: 2,
		}]
	});
	this.gridStore = Ext.create("Ext.data.Store", {
		fixeds: ["test1", "test2", "test3", "test4", "test5"]
	});
	// view 
	// 
	// 设置主容器
	this.setMainPanel = function() {
		this.mainPanelbody = Ext.create("Ext.panel.Panel", {
			border: 0,
			items: [],
			layout: "column",
			defaults: {
				columnWidth: 1 / 2
			}
		});
	};
	//  左边
	// 设置地图容器
	this.setMapPanel = function() {
		this.mapPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 500,
			padding: "0 20 0 20",
			width: "50%",
			items: []
		});
		this.mainPanelbody.add(this.mapPanel);
		this.setMapTopPanel();
		this.setMapCharts();
	};
	//  设置地图上部选择容器
	this.setMapTopPanel = function() {
		this.mapTopPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 50,
			margin: "0 0 15 0",
			width: "100%",
			layout: "border",
			style: {
				textAlign: "right",

			},
			items: [{
				region: 'east',
				xtype: "combobox",
				width: 100,
				height: 20,
				store: this.linkStore,
				queryMode: 'local',
				editable: false,
				autoSelect: true,
				displayField: "NAME",
				valueField: "VALUE",
				margin: 15,
				value: 0,
				triggerBaseCls: "topTrigger",
				fieldStyle: {
					background: "none",
					fontWeight: "400",
					color: "#ccc",
					'border-radius': '5px'
				},
				labelStyle: "color: #ccc;font-size: 12px;line-height: 20px;",
			}, {
				region: 'east',
				xtype: "combobox",
				width: 100,
				height: 20,
				store: this.sceneStore,
				queryMode: 'local',
				editable: false,
				autoSelect: true,
				displayField: "NAME",
				valueField: "VALUE",
				margin: 15,
				value: 0,
				triggerBaseCls: "topTrigger",
				fieldStyle: {
					background: "none",
					fontWeight: "400",
					color: "#ccc",
					'border-radius': '5px'
				},
				labelStyle: "color: #ccc;font-size: 12px;line-height: 20px;",
			}]
		});
		this.mapPanel.add(this.mapTopPanel);
	};

	// 设置地图图表
	this.setMapCharts = function() {
		this.mapCharts = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 450,
			style: {
				'border-top': "1px #999 solid",
			},
			width: "100%",
			html: "<div id='" + this.configes.mapChartsId + "' style='width: 100%; height: 100%;'></div>",
		});
		this.mapPanel.add(this.mapCharts);
	};

	// 右边
	this.setGridMainPanel = function() {
		this.gridMainPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 500,
			padding: "0 20 0 20",
			width: "50%",
			items: []
		});
		this.mainPanelbody.add(this.gridMainPanel);
		this.setGridTopPanel();
		this.setGridPanel();
	};
	this.setGridTopPanel = function() {
		this.gridTopPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 50,
			margin: "0 0 15 0",
			layout: "border",
			defaults: {
				style: {
					fontSize: "25px",
					color: "#fff",
					'line-height': "50px",
				},
				margin: "0 15 0 0",
			},
			items: [{
				region: 'west',
				xtype: "label",
				text: "告警概况"
			}, {
				region: "center",
				xtype: "label",
				text: "2016-01-01"
			}]
		});
		this.gridMainPanel.add(this.gridTopPanel);
	};
	this.setGridPanel = function() {
		this.gridPanel = Ext.create("Ext.grid.Panel", {
			border: 0,
			height: 450,
			width: "100%",
			autoShow: false,
			border: 0,
			multiSelect: true,
			store: this.gridStore,
			columns: [{
				text: "测试",
				dataIndex: "test1",
			}, {
				text: "测试",
				dataIndex: "test2",
			}, {
				text: "测试",
				dataIndex: "test3",
			}],
			forceFit: true,
			renderTo: Ext.getBody(),
		});
		this.gridMainPanel.add(this.gridPanel);
	}
}
MonitorHomePage.prototype = new Page(Configes.page.MonitorHomePage);
