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
	// apply()
	// Content.apply(this,Array("page1"));
	this.run = function() {
		if (!this.loading) {
			this.initView();
		}
		this.loading = true;
		this.mainPanelShow();
	};
	this._modules = [];
	this.moduleTablePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [],
		layout: "column",
		margin: "50",
		defaults: {
			columnWidth: 1 / 3
		}
	});
	this.initView = function() {
		var mainPanel = this.getMainPanel();
		var moduleTablePanel = this.moduleTablePanel;
		mainPanel.add(moduleTablePanel);
		this.getModules();
	};
	this.getModules = function() {
		var that = this;

		var data = [{
			icon: "",
			title: "端到端监控",
			desc: "xxxxxxxxxxxxxxxxxxxxx",
			data: [],
		}, {
			icon: "",
			title: "客户感知监控",
			desc: "xxxxxxxxxxxxxxxxxxxxx",
			data: [],
		}, {
			icon: "",
			title: "客户感知监控",
			desc: "xxxxxxxxxxxxxxxxxxxxx",
			data: [],
		}, {
			icon: "",
			title: "客户感知监控",
			desc: "xxxxxxxxxxxxxxxxxxxxx",
			data: [],
		}, {
			icon: "",
			title: "客户感知监控",
			desc: "xxxxxxxxxxxxxxxxxxxxx",
			data: [],
		}];
		this.setModules(data, that);
	};
	this.setModules = function(data, that) {
		that.moduleTablePanel.removeAll();
		for (var i = 0, l = data.length; i < l; i++) {
			var module = new Module(data[i], that);
			that._modules.push(module);
			that.setModuleOnModuleTable(module);
		}
	};
	this.setModuleOnModuleTable = function(module) {
		module.createMainPanel();
		this.moduleTablePanel.add(module.mainPanel);
	};
	// view
}
IndexPage.prototype = new Page(Configes.page.indexPage);
// 首页模块
function Module(moduleData, parentNode) {
	this.parentNode = parentNode;

	/**
	 * [moduleData description]
	 * @type {
	 * icon 图标
	 * title 标题
	 * desc 描述
	 * data 数据
	 * }
	 */
	this.moduleData = moduleData || {};
	// view
	this.createMainPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			border: 0,
			items: [this.topPanel(), this.bottomPanel()],
			height: 170,
			margin: 10,
			padding: 10,
			cls: "indexPage-module",
		});
	}

	this.topPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 0,
			items: [this.iconPanel(), this.titlePanel()],
			height: 100,
			layout: "column"
		});
		return panel;
	};
	this.bottomPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 50,
			items: [this.dataPanel()],
		});
		return panel;
	};
	this.iconPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 1,
			items: [],
			columnWidth: 1 / 3,
			margin: 10,
			height: 80,
		});
		return panel;
	};
	this.titlePanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 0,
			defaults: {
				xtype: "panel",
				border: 0,
			},
			margin: 10,
			height: 80,
			items: [{
				items: [{
					text: this.moduleData.title || "",
					style: {
						fontSize: "20px",
						color: "#fff",
					},
					xtype: "label",
				}],
				height: 25,
			}, {
				items: [{
					xtype: "label",
					text: this.moduleData.desc || "",
					style: {
						fontSize: "12px",
						color: "#fff",
					},

				}],
				height: 55,
			}],
			columnWidth: 2 / 3,
		});
		return panel;
	};
	this.dataPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 1,
			items: [],
			height: 30,
			margin: 10,
		});
		return panel;
	};
}