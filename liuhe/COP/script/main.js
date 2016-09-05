// Ext.ns("main");
Ext.onReady(function() {
	window.main = new Main();
	main.run();
	var logo = new Logo(main);
	var topMenu = new TopMenu(main);
	var footer = new Footer(main);
	main.regTop(logo);
	main.regTop(topMenu);
	main.regFooter(footer);
	main.regContent(new IndexPage2(main));
	main.regContent(new IndexPage(main));
	main.regContent(new MyOrder(main));
	main.regContent(new ServiceDirectory(main));
	main.regContent(new MyTask(main));
	main.regContent(new ServiceMade(main));
	main.regContent(new ServiceDirectoryManage(main));
	main.regContent(new MonitorHomePage(main));
	main.regContent(new UserCenter(main));
	main.regContent(new SceneMode(main));
	main.regContent(new SecurityManage(main));
	main.init();
	Ext.QuickTips.init();
	var loading = document.getElementById("loading");
	loading.style.display = "none";
});

var Main = function() {
	this._name = "main";
	this.msg = new function() {
		this.topId = "top";
		this.viewportId = "main";
		this.contentId = "content";
		this.footerId = "footer";
	};
	this._mainContents = [];
	this._mainTops = [];
	this._mainFooters = [];
	this.run = function() {
		this.viewport();
	};
	this.init = function() {
		this.hideContents();
		// 获取用户信息，判断用户身份，显示首页
		this.getUserInfo();
	};
	this.getUserInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setUserInfo.bind(this));
	};
	this.setUserInfo = function(data) {
		this.userInfo = data;
		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province === "深圳中心") {
				this.openContent(Configes.page.indexPage);
			} else {
				this.openContent(Configes.page.indexPage2);
			}
		}
	};
	this.getProvince = function() {
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		return province
	};
	//  content ctrl
	//  将页面加入主体
	this.regContent = function(obj) {
		if (!this.isHasContent(obj)) {
			this._mainContents.push(obj);
		}
		this.setContent();
	};
	// 检查页面是否存在
	this.isHasContent = function(obj) {
		var contents = this._mainContents;
		for (var i = 0, l = contents.length; i < l; i++) {
			if (contents[i] === obj) {
				return true;
			}
		}
		return false;
	};
	// 获得主框架中心的容器
	this.getMainContentPanel = function() {
		var panel = Ext.getCmp(this.msg.contentId);
		return panel;
	};
	// 获得页面对象
	this.getContentObj = function(contentId) {
		var contents = this._mainContents;
		for (var i = 0, l = contents.length; i < l; i++) {
			if (contents[i].panelId === contentId) {
				return contents[i];
			}
		}
		return null;
	};
	// 将页面写入主框架中心
	this.setContent = function() {
		var contents = this._mainContents;
		var mainContentPanel = this.getMainContentPanel();
		for (var i = 0, l = contents.length; i < l; i++) {
			var panelId = contents[i].panelId;
			if (!Ext.get(panelId)) {
				mainContentPanel.add(contents[i].mainPanel());
			}
		}
	};
	// 隐藏所有页面
	this.hideContents = function() {
		var contents = this._mainContents;
		for (var i = 0, l = contents.length; i < l; i++) {
			contents[i].mainPanelHide();
		}
	};

	// 显示指定页面
	this.showContent = function(panelId) {
		var contents = this._mainContents;
		for (var i = 0, l = contents.length; i < l; i++) {
			if (contents[i].panelId == panelId) {
				contents[i].mainPanelShow();
			}
		}
	};
	//  打开指定页面并运行页面
	this.openContent = function(panelId, params) {
		this.hideContents();
		var panel = Ext.getCmp(panelId);
		if (panel) {
			this.showContent(panelId);
		}
		var page = this.getContentObj(panelId);
		if (page) {
			page.run(params);
		} else {
			tools.toast("该服务未开放");
		}
		this._mainTops[1].menuChildShow(panelId);
	};

	// top ctrl
	// 
	// 写入框架上部
	this.regTop = function(obj) {
		if (!this.isHasTop(obj)) {
			this._mainTops.push(obj);
		}
		this.setTop();
	};
	// 获取框架上部主容器
	this.getMainTopPanel = function() {
		var topPanel = Ext.getCmp(this.msg.topId);
		return topPanel;
	};
	//  上部组件是否存在
	this.isHasTop = function(obj) {
		var tops = this._mainTops;
		for (var i = 0, l = tops.length; i < l; i++) {
			if (tops[i] === obj) {
				return true;
			}
		}
		return false;
	};
	//  将上部组件加入框架上部
	this.setTop = function() {
		var tops = this._mainTops;
		var mainTopPanel = this.getMainTopPanel();
		for (var i = 0, l = tops.length; i < l; i++) {
			var panelId = tops[i].panelId;
			if (!Ext.get(panelId)) {
				mainTopPanel.add(tops[i].mainPanel);
			}
		}
	};



	//  footer ctrl
	//  
	// 写入框架下部组件对象
	this.regFooter = function(obj) {
		if (!this.isHasFooter(obj)) {
			this._mainFooters.push(obj);
		}
		this.setFooter();
	};
	//  获取框架下部主容器
	this.getMainFooterPanel = function() {
		var panel = Ext.getCmp(this.msg.footerId);
		return panel;
	};
	//  是否存在组件
	this.isHasFooter = function(obj) {
		var footers = this._mainFooters;
		for (var i = 0, l = footers.length; i < l; i++) {
			if (footers[i] === obj) {
				return true;
			}
		}
		return false;
	};
	// 写入下部框架组件
	this.setFooter = function() {
		var footers = this._mainFooters;
		var mainFooterPnael = this.getMainFooterPanel();
		for (var i = 0, l = footers.length; i < l; i++) {
			var panelId = footers[i].panelId;
			if (!Ext.get(panelId)) {
				mainFooterPnael.add(footers[i].mainPanel());
			}
		}
	};

	// view
	this.viewport = function() {
		Ext.create("Ext.container.Viewport", {
			border: 0,
			id: this.msg.viewportId,
			cls: "viewport",
			width: "100%",
			autoScroll: "true",
			style: {
				position: 'relative',
			},
			defaults: {
				border: 0,
			},
			items: [this.top(), this.content(), this.footer()]
		}).show();
	};
	this.top = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			id: this.msg.topId,
			width: "100%",
			height: Configes.constant.topHeight,
			layout: "border",
			cls: "viewport-top",
			style: {
				position: 'fixed',
				top: 0,
				'z-index': "9999"
			},
			defaults: {
				border: 0,
			},
		});
		return panel;
	};
	this.content = function() {
		var cf = Configes.constant;
		var panel = Ext.create("Ext.panel.Panel", {
			id: this.msg.contentId,
			renderTo: Ext.getBody(),
			margin: cf.topHeight + " auto " + cf.footerHeight + " auto",
			padding: "5 20"
		});
		return panel;
	};
	this.footer = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			id: this.msg.footerId,
			height: Configes.constant.footerHeight,
			padding: "10 20 0 20",
			style: {
				background: "none",
				position: 'absolute',
				bottom: "0px",
			},
			width: '100%',
			items: [],
		});
		return panel;
	};
}