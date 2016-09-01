// logo 容器
var Logo = function(parentNode) {
	this.parentNode = parentNode;
	this.panelId = "topLogo";
	this.mainPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			id: this.panelId,
			width: 200,
			padding: 0,
			margin: "5 20",
			region: "west",
			height: Configes.constant.logoHeight,
			html: "<div class='logo' style=''>COP</div>",
			listeners: {
				click: Ext.bind(this.openIndex, this)
			}
		});
		return panel;
	};
	this.openIndex = function() {
		this.parentNode.openContent(Configes.page.indexPage);
	}
};

// 菜单
var TopMenu = function(parentNode) {
	this.parentNode = parentNode;
	this.panelId = "topMenu";
	this.msg = new function() {
		this.orderMenuId = "orderMenu";
		this.mainMenuId = "mainMenu";
	};
	this.userInfo = {};
	// model
	// 
	this.getUserInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setUserInfo, this);
	};
	this.setUserInfo = function(data, that) {
		that.userInfo = data;
		if (that.mainMenuPanel) {
			that.mainMenuPanel.setText(data["_NAME"]);
		}

		that.initMenu();



	};

	this.initMenu = function() {

		var mainMenuPanel = this.mainMenuChildPanel;
		var userMenu = mainMenuPanel.getComponent(2);
		var serviceMenuPanel = this.serviceDirectoryMenuPanel;
		var serviceMade = serviceMenuPanel.getComponent(2);
		var serviceManagementMenu = serviceMenuPanel.getComponent(1);
		
		
		userMenu.hide();
		serviceManagementMenu.hide();
		serviceMade.hide();

		if (this.userInfo["_CONTENT"]) {
			var province = this.getProvince();
			if (province === "深圳中心") {
				userMenu.show();
				serviceManagementMenu.show();
				serviceMade.hide();
			} else {
				userMenu.hide();
				serviceManagementMenu.hide();
				serviceMade.show();
			}
		}

	};
	this.getProvince = function() {
		var contentStr = this.userInfo["_CONTENT"];
		var content = JSON.parse(contentStr);
		var province = content["PROVINCE"];
		return province
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

	// view
	this.mainPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			cls: "top",
			id: this.panelId,
			// columnWidth: 2 / 3,
			region: "center",
			padding: 0,
			margin: "10 10 0 10",
			height: 71,
			layout: "vbox",
			items: [
				this.createMenuPanel()
			]
		});

		this.getUserInfo();
		return panel;
	};
	// 
	this.createMenuPanel = function() {
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
				this.orderMenu(), this.line(), this.mainMenu()
			]
		});
		return this.menuPanel;
	};
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
	this.comboBox = function() {
		this.areaPanel = Ext.create("Ext.form.ComboBox", {
			store: Ext.create("Ext.data.Store", {
				fields: ["name", "value"]
			}),
			queryMode: 'local',
			editable: false,
			autoSelect: true,
			displayField: "name",
			valueField: "value",
			margin: 15,
			triggerBaseCls: "topTrigger",
			fieldStyle: {
				background: "none",
				fontWeight: "400",
				color: "#ccc",
				'border-radius': '5px'
			},
			fieldLabel: "选择省份",
			labelWidth: 80,
			labelAlign: "right",
			labelStyle: "color: #ccc;font-size: 12px;line-height: 20px;",
			height: 20,
			width: 200
		});
		return this.areaPanel;
	};
	this.orderMenu = function() {
		this.orderMenuPanel = Ext.create("Ext.button.Button", {
			width: 100,
			text: "个人中心",
			icon: "resources/images/user.png",
			margin: "0 10",
			height: 30,
			iconCls: "",
			btnId: "userCenter",
			menuActiveCls: "",
			menu: this.orderMenuChild(),
			style: {
				color: "#ccc",
				'box-shadow': "none"
			}
		});
		return this.orderMenuPanel;
	};

	this.userCenterMenuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 31,
		width: "100%",
		margin: "10 0 0 0",
		style: "border-bottom: 1px #ddd solid",
		height: 31,
		defaults: {
			xtype: "button",
			margin: "0 20",
			baseCls: "x-btn base-btn",
			cls: "menuBtn",
			handler: Ext.bind(this.menuChildChange, this)
		},
		items: [{
			text: "我的订单",
			pageId: Configes.page.myOrder,
		}, {
			text: "我的任务",
			pageId: Configes.page.myTask,
		}, {
			text: "我的资料",
			pageId: Configes.page.userCenter,
		}]
	});
	this.serviceDirectoryMenuPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		margin: "10 0 0 0",
		height: 31,
		width: "100%",
		style: "border-bottom: 1px #ddd solid",
		defaults: {
			xtype: "button",
			margin: "0 20",
			baseCls: "x-btn base-btn",
			cls: "menuBtn",
			handler: Ext.bind(this.menuChildChange, this)
		},
		items: [{
			text: "服务目录",
			pageId: Configes.page.serviceDirectory,
		}, {
			text: "服务目录管理",

			pageId: Configes.page.serviceDirectoryManage,
		}, {
			text: "服务定制",
			pageId: Configes.page.serviceMade,
		}]
	});
	this.mainMenu = function() {
		this.mainMenuPanel = Ext.create("Ext.button.Button", {
			width: 100,
			text: this.userInfo._NAME || "",
			icon: "resources/images/config.png",
			margin: "0 10",
			height: 30,
			iconCls: "",
			focusCls: "none",
			menuActiveCls: "menuActive",
			menu: this.mainMenuChild(),
			style: {
				color: "#ccc",
				'box-shadow': "none"
			}
		});
		return this.mainMenuPanel;
	};
	this.orderMenuChild = function() {
		var that = this;
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
				iconCls: "more",
				pageId: Configes.page.userCenter,
				handler: function() {
					that.menuChange(this);
				}
			}, {
				text: "我的订单",
				icon: "resources/images/myOrder.png",
				iconCls: "more",
				pageId: Configes.page.myOrder,
				handler: function() {
					that.menuChange(this);
				}
			}, {
				text: "我的任务",
				icon: "resources/images/myTask.png",
				iconCls: "more",
				pageId: Configes.page.myTask,
				handler: function() {
					that.menuChange(this);
				}
			}]
		});
		return this.orderMenuChildPanel;
	};
	this.mainMenuChild = function() {
		var that = this;
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
				text: "首页",
				menuId: "homePage",
				icon: "resources/images/monitorIndex.png",
				iconCls: "more",
				pageId: Configes.page.indexPage,
				handler: function() {
					that.menuChange(this)
				}
			}, {
				text: "监控场景",
				menuId: "scenePage",
				iconCls: "more",
				pageId: Configes.page.sceneMode,
				handler: function() {
					that.menuChange(this)
				}
			}, {
				text: "监控首页",
				menuId: "viewHomePage",
				iconCls: "more",
				icon: "resources/images/sceneMonitor.png",
				pageId: Configes.page.MonitorHomePage,
				handler: function() {
					that.menuChange(this)
				}
			}, {
				text: "用户管理",
				menuId: "userManagement",
				iconCls: "more",
				icon: "resources/images/userManage.png",
				pageId: Configes.page.securityManage,
				handler: function() {
					that.menuChange(this);
				}
			}, {
				text: "服务目录",
				menuId: "MonitorHomePage",
				iconCls: "more",
				icon: "resources/images/serviceManage.png",
				pageId: Configes.page.serviceDirectory,
				handler: function() {
					that.menuChange(this);
				}
			}, {
				text: "退出登录",
				iconCls: "more",
				icon: "resources/images/logout.png",
				handler: function() {
					that.logout();
				}
			}]
		});
		return this.mainMenuChildPanel;
	};
	this.getOrderMenuPanel = function() {
		return Ext.getCmp(this.msg.orderMenuId);
	};
	this.getMainMenuPanel = function() {
		return Ext.getCmp(this.msg.mainMenuId);
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
			// if (!this.userCenterMenuPanel) {
			// this.createUserCenterMenuPanel();
			Ext.getCmp(this.panelId).add(this.userCenterMenuPanel);
			// }
			menuPanel = this.userCenterMenuPanel;
		}
		if (pageId == p.serviceDirectory || pageId == p.serviceDirectoryManage || pageId == p.serviceMade) {
			// if (!this.serviceDirectoryMenuPanel) {
			// this.createServiceDirectoryMenuPanel();
			Ext.getCmp(this.panelId).add(this.serviceDirectoryMenuPanel);
			// }
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


	// 退出登录
	this.logout = function() {
		tools.getData(Configes.url.view_logout, null, this.logoutReturn, this);
	};
	this.logoutReturn = function(data, that) {
		window.location.href = "login.html";
	};

}