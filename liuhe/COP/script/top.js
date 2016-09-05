// logo 容器
var Logo = function(parentNode) {
	this.parentNode = parentNode;
	this.panelId = "topLogo";
	this.openIndex = function() {

		this.parentNode.init(Configes.page.indexPage);
	}
	this.mainPanel = Ext.create("Ext.panel.Panel", {
		id: this.panelId,
		width: 200,
		padding: 0,
		margin: "5 20",
		region: "west",
		layout: "hbox",

		height: Configes.constant.logoHeight,
		// html: "<div class='logo' style=''>COP</div>",
		items: [{
			xtype: "button",
			width: 70,
			height: 70,
			baseCls: "x-btn base-btn",
			cls: "logo",
			handler: Ext.bind(this.openIndex, this)
		}, {
			xtype: "button",
			width: 120,
			height: 70,
			baseCls: "x-btn base-btn",
			cls: "logoText",
			text: "COP",
			handler: Ext.bind(this.openIndex, this)
		}],

	});

};

// 菜单
var TopMenu = function(parentNode) {
	this.parentNode = parentNode;
	this.panelId = "topMenu";
	this.msg = new function() {
		this.orderMenuId = "orderMenu";
		this.mainMenuId = "mainMenu";
	};

	this.menuId = {
		indexPage: "top-menu-main-indexPage",
		indexPage2: "top-menu-main-indexPage2",
		scenePage: "top-menu-main-scenePage",
		userManagement: "top-menu-main-userManagement",
		serviceDirectoryManage: "top-menu-main-serviceDirectoryManage",
		serviceMade: "top-menu-main-serviceMade",
		MonitorHomePage: "top-menu-main-MonitorHomePage",
		userCenter: "top-menu-main-userCenter",
		myOrder: "top-menu-main-myOrder",
		myTask: "top-menu-main-myTask",
		//  子菜单
		child_myOrder: "top-menu-child-myOrder",
		child_myTask: "top-menu-child-myTask",
		child_userCenter: "top-menu-child-userCenter",
		child_serviceDirectory: "top-menu-child-serviceDirectory",
		child_serviceDirectoryManage: "top-menu-child-serviceDirectoryManage",
		child_serviceMade: "top-menu-child-serviceMade",
	};

	this.initMenu = function() {
		var menuId = this.menuId;
		var mainPanel = this.mainMenuChildPanel;
		var chidlMenuPanel = this.serviceDirectoryMenuPanel;
		// 主菜单
		var indexPage = mainPanel.getComponent(menuId.indexPage);
		var indexPage2 = mainPanel.getComponent(menuId.indexPage2);
		var userManagement = mainPanel.getComponent(menuId.userManagement);
		var serviceMade =  mainPanel.getComponent(menuId.serviceMade);
		var serviceDirectoryManage =  mainPanel.getComponent(menuId.serviceDirectoryManage);
		// 子菜单
	
		var child_serviceMade = chidlMenuPanel.getComponent(menuId.child_serviceMade);
		var child_serviceDirectoryManage = chidlMenuPanel.getComponent(menuId.child_serviceDirectoryManage);

		indexPage && indexPage.hide();
		indexPage2 && indexPage2.hide();
		userManagement && userManagement.hide();
		serviceMade && serviceMade.hide();
		serviceDirectoryManage && serviceDirectoryManage.hide();
		child_serviceMade && child_serviceMade.hide();
		child_serviceDirectoryManage && child_serviceDirectoryManage.hide();

		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province === "深圳中心") {
				indexPage.show();
				userManagement.show();
				serviceDirectoryManage.show();
				child_serviceDirectoryManage.show();
			} else {
				indexPage2.show();
				serviceMade.show();
				child_serviceMade.show();
			}
		}
	};



	this.menuChildChange = function(cmp) {
		var pageId = cmp.pageId;
		var parentPanel = cmp.up("panel");
		parentPanel.items.each(function(btn) {
			btn.removeCls("action");
		});
		cmp.addCls("action");
		this.parentNode.openContent(pageId);
	};


	this.getProvince = function() {
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		return province
	};
	this.menuChange = function(cmp) {
		var pageId = cmp.pageId;
		this.menuChildShow(pageId);
		// 打开页面
		this.parentNode.openContent(pageId);
	};
	this.menuChildShow = function(pageId) {
		this.userCenterMenuPanel && this.userCenterMenuPanel.hide();
		this.serviceDirectoryMenuPanel && this.serviceDirectoryMenuPanel.hide();
		var p = Configes.page;
		var menuPanel;
		if (pageId == p.userCenter || pageId == p.myOrder || pageId == p.myTask) {
			Ext.getCmp(this.panelId).add(this.userCenterMenuPanel);
			menuPanel = this.userCenterMenuPanel;
		}
		if (pageId == p.serviceDirectory || pageId == p.serviceDirectoryManage || pageId == p.serviceMade) {
			Ext.getCmp(this.panelId).add(this.serviceDirectoryMenuPanel);
			menuPanel = this.serviceDirectoryMenuPanel;
		}
		menuPanel && menuPanel.show();
		this.setActiveTabToMenu(menuPanel, pageId);
	};
	this.setActiveTabToMenu = function(parentPanel, pageId) {
		var panel;
		parentPanel && parentPanel.items.each(function(btn) {
			btn.removeCls("action");
			if (btn.pageId == pageId) {
				btn.addCls("action");
			}
		}, this);
	};

	/**
	 * 
	 * model
	 * 
	 */
	this.userInfo = {};
	// model
	// 
	this.getUserInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setUserInfo.bind(this));
	};
	this.setUserInfo = function(data) {
		this.userInfo = data;
		if (this.mainMenuPanel) {
			this.mainMenuPanel.setText(data["_NAME"]);
			this.mainMenuPanel.setTooltip(data["_NAME"]);
		}
		this.initMenu();
	};


	// 退出登录
	this.logout = function() {
		tools.getData(Configes.url.view_logout, null, this.logoutReturn, this);
	};
	this.logoutReturn = function(data, that) {
		window.location.href = "login.html";
	};


	/**
	 *
	 *
	 * view
	 * 
	 * 
	 */

	this.line = function() {
		var line = Ext.create("Ext.form.Label", {
			text: "|",
			width: 1,
			// margin: "10 0 10 0",
			height: 30,
			style: {
				color: "#fff",
				'line-height': "30px",
				float: "right",
				fontSize: "15px",
				textAlign: "center"
			}
		});
		return line;
	};

	this.userCenterMenuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		margin: "5 0 0 0",
		style: "border-bottom: 1px #ddd solid",
		height: 36,
		defaults: {
			xtype: "button",
			margin: "0 20",
			baseCls: "x-btn base-btn",
			cls: "menuBtn",
			handler: Ext.bind(this.menuChildChange, this)
		},
		items: [{
			text: "我的订单",
			itemId: this.menuId.child_myOrder,
			pageId: Configes.page.myOrder,
		}, {
			text: "我的任务",
			itemId: this.menuId.child_myTask,
			pageId: Configes.page.myTask,
		}, {
			text: "我的资料",
			itemId: this.menuId.child_userCenter,
			pageId: Configes.page.userCenter,
		}]
	});
	this.serviceDirectoryMenuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		margin: "5 0 0 0",
		height: 36,
		width: "100%",
		style: "border-bottom: 1px #ddd solid",
		defaults: {
			xtype: "button",
			margin: "0 20",
			baseCls: "x-btn base-btn",
			cls: "menuBtn",
			height: "100%",
			handler: Ext.bind(this.menuChildChange, this)
		},
		items: [{
			text: "服务目录",
			itemId: this.menuId.child_serviceDirectory,
			pageId: Configes.page.serviceDirectory,
		}, {
			itemId: this.menuId.child_serviceDirectoryManage,
			text: "服务目录管理",
			pageId: Configes.page.serviceDirectoryManage,
		}, {
			itemId: this.menuId.child_serviceMade,
			text: "服务定制",
			pageId: Configes.page.serviceMade,
		}]
	});


	this.mainMenuChildPanel = Ext.create("Ext.menu.Menu", {
		plain: true,
		width: 100,
		cls: "menuClass",
		shadow: false,
		border: 0,
		defaults: {
			padding: 5,
			cls: "childMenu",
		},
		items: [{
			text: "用户首页",
			itemId: this.menuId.indexPage,
			icon: "resources/images/monitorIndex.png",
			iconCls: "more",
			pageId: Configes.page.indexPage,
			handler: Ext.bind(this.menuChange, this)

		}, {
			// 省端用户
			text: "用户首页",
			itemId: this.menuId.indexPage2,
			icon: "resources/images/monitorIndex.png",
			iconCls: "more",
			pageId: Configes.page.indexPage2,
			handler: Ext.bind(this.menuChange, this)

		}, {
			text: "监控场景",
			itemId: this.menuId.scenePage,
			iconCls: "more",
			icon: "resources/images/sceneMonitor.png",

			pageId: Configes.page.sceneMode,
			handler: Ext.bind(this.menuChange, this)

		}, {
			text: "用户管理",
			itemId: this.menuId.userManagement,
			iconCls: "more",
			icon: "resources/images/userManage.png",
			pageId: Configes.page.securityManage,
			handler: Ext.bind(this.menuChange, this)

		}, {
			text: "服务目录",
			itemId: this.menuId.MonitorHomePage,
			iconCls: "more",
			icon: "resources/images/serviceMade.png",
			pageId: Configes.page.serviceDirectory,
			handler: Ext.bind(this.menuChange, this)
		}, {
			text: "服务定制",
			itemId: this.menuId.serviceMade,
			iconCls: "more",
			icon: "resources/images/service.png",
			pageId: Configes.page.serviceMade,
			handler: Ext.bind(this.menuChange, this)
		}, {
			text: "服务目录管理",
			itemId: this.menuId.serviceDirectoryManage,
			iconCls: "more",
			icon: "resources/images/serviceManage.png",
			pageId: Configes.page.serviceDirectoryManage,
			handler: Ext.bind(this.menuChange, this)
		}, {
			text: "退出登录",
			iconCls: "more",
			icon: "resources/images/logout.png",
			handler: Ext.bind(this.logout, this)
		}]
	});



	this.orderMenuChildPanel = Ext.create("Ext.menu.Menu", {
		plain: true,
		width: 100,
		border: 0,
		focusCls: "none",
		cls: "menuClass",
		shadow: false,
		defaults: {
			padding: 5,
			cls: "childMenu",
		},
		items: [{
			text: "我的资料",
			icon: "resources/images/user.png",
			itemId: this.menuId.userCenter,
			iconCls: "more",
			pageId: Configes.page.userCenter,
			handler: Ext.bind(this.menuChange, this)
		}, {
			text: "我的订单",
			icon: "resources/images/myOrder.png",
			iconCls: "more",
			itemId: this.menuId.myOrder,
			pageId: Configes.page.myOrder,
			handler: Ext.bind(this.menuChange, this)
		}, {
			text: "我的任务",
			icon: "resources/images/myTask.png",
			iconCls: "more",
			itemId: this.menuId.myTask,
			pageId: Configes.page.myTask,
			handler: Ext.bind(this.menuChange, this)
		}]
	});



	this.mainMenuPanel = Ext.create("Ext.button.Button", {
		width: 100,
		text: this.userInfo._NAME || "",
		icon: "resources/images/config.png",
		margin: "0 10",
		height: 30,
		iconCls: "",
		focusCls: "none",
		menuActiveCls: "menuActive",
		menu: this.mainMenuChildPanel,
		style: {
			color: "#ccc",
			'box-shadow': "none"
		}
	});

	this.orderMenuPanel = Ext.create("Ext.button.Button", {
		width: 100,
		text: "个人中心",
		icon: "resources/images/user.png",
		margin: "0 10",
		height: 30,
		iconCls: "",
		btnId: "userCenter",
		menuActiveCls: "",
		menu: this.orderMenuChildPanel,
		style: {
			color: "#ccc",
			'box-shadow': "none"
		}
	});
	// 主菜单
	this.menuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 30,
		width: "100%",
		// region: "center",
		
		layout: "border",
		defaults: {
			region: 'east',
			style: {
				color: "#fff",
			}
		},
		items: [
			this.orderMenuPanel, this.line(), this.mainMenuPanel
		]
	});
	// 
	this.mainPanel = Ext.create("Ext.panel.Panel", {
		cls: "top",
		id: this.panelId,
		// columnWidth: 2 / 3,
		region: "center",
		padding: 0,
		margin: "5 10 0 10",
		height: 71,
		layout: "vbox",
		items: [
			this.menuPanel
		]
	});


	// this.comboBox = function() {
	// 	this.areaPanel = Ext.create("Ext.form.ComboBox", {
	// 		store: Ext.create("Ext.data.Store", {
	// 			fields: ["name", "value"]
	// 		}),
	// 		queryMode: 'local',
	// 		editable: false,
	// 		autoSelect: true,
	// 		displayField: "name",
	// 		valueField: "value",
	// 		margin: 15,
	// 		triggerBaseCls: "topTrigger",
	// 		fieldStyle: {
	// 			background: "none",
	// 			fontWeight: "400",
	// 			color: "#ccc",
	// 			'border-radius': '5px'
	// 		},
	// 		fieldLabel: "选择省份",
	// 		labelWidth: 80,
	// 		labelAlign: "right",
	// 		labelStyle: "color: #ccc;font-size: 12px;line-height: 20px;",
	// 		height: 20,
	// 		width: 200
	// 	});
	// 	return this.areaPanel;
	// };
	// 



	this.getUserInfo();
}