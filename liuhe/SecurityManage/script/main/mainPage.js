/**
 * create 20160801
 * godz
 *
 * 主要页面
 */

function MainPage() {

	// 控制
	// 
	// 页头
	this.regHeader = function(obj) {
		var isHasHeader = this.isHasHeader(obj);
		if (!isHasHeader) {
			this._headers.push(obj);
		}
		this.setHeaderPanelChild();
	};
	this.isHasHeader = function(obj) {
		var headers = this._headers;
		var l = headers.length;
		for (var i = 0; i < l; i++) {
			if (headers[i] == obj) {
				return true;
			}
		}
		return false;
	};
	this.setHeaderPanelChild = function() {
		var arr = this._headers;
		var panel = this.headerPanel;
		for (var i = 0, l = arr.length; i < l; i++) {
			var panelId = arr[i].panelId;
			if (!Ext.get(panelId)) {
				panel.add(arr[i].mainPanel);
			}
		}
	};
	//  页面主体
	this.regCentent = function(obj) {
		var isHasCentent = this.isHasCentent(obj);
		if (!isHasCentent) {
			this._contents.push(obj);
		}
		this.setCententPanelChild();
	};
	this.isHasCentent = function(obj) {
		var _contents = this._contents;
		var l = _contents.length;
		for (var i = 0; i < l; i++) {
			if (_contents[i] == obj) {
				return true;
			}
		}
		return false;
	};
	this.setCententPanelChild = function() {
		var arr = this._contents;
		var panel = this.contentPanel;
		for (var i = 0, l = arr.length; i < l; i++) {
			var panelId = arr[i].panelId;
			if (!Ext.get(panelId)) {
				panel.add(arr[i].mainPanel);
			}
		}
	};
	// 主视图
	this._headers = [];
	this._contents = [];
	this.initView = function() {
		this.setHeaderPanel();
		this.setContent();
		this.setFooter();
		this.createMainPanel();
	};
	this.createMainPanel = function() {
		this.mainPanel = Ext.create("Ext.container.Viewport", {
			border: 0,
			cls: "viewport",
			width: "100%",
			autoScroll: "true",
			style: {
				position: 'relative',
			},
			defaults: {
				border: 0,
			},
			items: [this.headerPanel, this.contentPanel, this.footerPanel]
		}).show();
	};
	this.setHeaderPanel = function() {
		this.headerPanel = Ext.create("Ext.panel.Panel", {
			width: "100%",
			height: configes.constant.headerHeight,
			layout: "column",
			cls: "viewport-top",
			style: {
				position: 'fixed',
				top: 0,
				'z-index': "9999"
			},
			defaults: {
				border: 0,
			}
		});
	};
	this.setContent = function() {
		var cf = configes.constant;
		this.contentPanel = Ext.create("Ext.panel.Panel", {
			id: "centent",
			renderTo: Ext.getBody(),
			margin: cf.headerHeight + " auto " + cf.footerHeight + " auto",
			padding: 15
		});
	};
	this.setFooter = function() {
		this.footerPanel = Ext.create("Ext.panel.Panel", {
			height: configes.constant.footerHeight,
			padding: "10 20 0 20",
			style: {
				background: "none",
				position: 'absolute',
				bottom: "0px",
			},
			width: '100%'
		});
	};
	this.initView();
}