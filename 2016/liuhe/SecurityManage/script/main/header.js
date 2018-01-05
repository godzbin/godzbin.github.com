/**
 * create 20160801
 * godz
 *
 * 页面头
 */

function Logo(parentObj) {
	this.parentObj = parentObj;
	this.panelId = "logo";
	this.setMainPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			id: this.panelId,
			columnWidth: 1 / 4,
			height: 100,
			items: [{
				xtype: "label",
				text: "用户管理系统",
				margin: 30,
				style: {
					color: "#fff",
					fontSize: "30px",
					lineHeight: "50px"
				}
			}]
		});
	};
	this.setMainPanel();
}

function UserInfoBtn(parentObj) {
	this.parentObj = parentObj;
	this.panelId = "userInfoBtn";
	this.setMainPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			id: this.panelId,
			columnWidth: 3 / 4,
			layout: "border",
			height: 50,
			items: this.setUserInfoBtn()
		});
	};
	this.setUserInfoBtn = function() {
		this.UserInfoBtn = Ext.create("Ext.button.Button", {
			width: 120,
			region: 'east',
			text: main.user.userInfo._NICK_NAME || "系统管理员",
			margin: 10,
			height: 30,
			iconCls: "",
			focusCls: "",
			menuActiveCls: "menuActive",
			menu: this.mainMenuChild(),
			style: {
				color: "#ccc",
				float: "right",
				'box-shadow': "none"
			}
		});
		return this.UserInfoBtn;
	};
	this.mainMenuChild = function() {
		var that = this;
		this.menu = Ext.create("Ext.menu.Menu", {
			plain: true,
			width: 120,
			border: 0,
			focusCls: "none",
			cls: "menuClass",
			shadow: false,
			defaults: {
				padding: 5,
				cls: "childMenu",
			},
			items: [{
				text: "更改个人信息",
				handler: function() {
					that.openEditSelfInfo();
				}
			}, {
				text: "更改密码",
				handler: function() {
					that.openModifyPwdWin();
				}
			}, {
				text: "退出登录",
				handler: function() {
					that.logout();
				}
			}]
		});
		return this.menu;
	};
	this.openEditSelfInfo = function() {
		if (!this.selfInfoWin) {
			this.createSelfInfoWin();
		}
		this.selfInfoWin.show();
		this.getSelfInfo();
	};
	this.openModifyPwdWin = function() {
		if (!this.modifyPwdWin) {
			this.createModifyPwdWin();
		}
		this.modifyPwdWin.show();
	};
	this.logout = function() {
		tools.getData(configes.url.view_logout, null, this.logoutReturn, this);
	};
	this.getSelfInfo = function() {
		tools.getData(configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		var form = that.selfInfoWin.getComponent(0).getForm();
		form.setValues(data);

		that.setUserInfoBtnText(data["_NICK_NAME"]);
	};
	this.setUserInfoBtnText = function(text) {
		var text = text || "暂未取名"
		if (this.UserInfoBtn) {
			this.UserInfoBtn.setText(text);
		}
	};
	this.updateSelfInfo = function(data) {
		tools.getData(configes.url.view_updateSelfInfo, data, this.updateSelfInfoReturn, this);
	};
	this.updateSelfInfoReturn = function(data, that) {
		that.selfInfoWinHide();
		that.setUserInfoBtnText(data["_NICK_NAME"]);
	};
	this.logoutReturn = function() {
		window.location.href = "login.html";
	};
	this.modifyPwd = function(code, that) {
		var values = that.modifyPwdWin.getComponent(0).getForm().getValues()
		var password = values["_PWD"];
		var new_password = values["NEW_PWD"];
		var username = main.user.userInfo["_NAME"];

		var nec_PWD = tools.passwordNec(new_password, username, code);
		var ENCRYPT_STR = hex_md5(hex_md5(username + hex_md5(password)) + code.toUpperCase());
		var params = {
			ENCRYPT_STR: ENCRYPT_STR,
			_PWD: nec_PWD,
			CODE: code
		}
		tools.getData(configes.url.view_modifyPwd, params, that.modifyPwdReturn, that);
	};
	this.modifyPwdReturn = function(data, that) {
		tools.toast("修改成功");
		window.location.href = "login.html";
	};
	this.genCode = function(data) {
		if (!data["_PWD"]) {
			tools.toast("密码不能为空");
			return;
		}
		if (!data["NEW_PWD"]) {
			tools.toast("新密码不能为空");
			return;
		}
		if(data["NEW_PWD"] !== data["RE_NEW_PWD"]){
			tools.toast("两次密码输入不一致");
			return;
		}
		tools.getData(configes.url.view_genCode, data, this.modifyPwd, this);
	};
	this.createModifyPwdWin = function() {
		var that = this;
		this.modifyPwdWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "修改密码",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 100,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					fieldLabel: "原密码",
					name: "_PWD",
					inputType: "password"
				}, {
					fieldLabel: "新密码",
					name: "NEW_PWD",
					inputType: "password"
				},{
					fieldLabel: "确认新密码",
					name: "RE_NEW_PWD",
					inputType: "password"
				}]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.modifyPwdWin.getComponent(0).getForm().getValues();
					that.genCode(data);
				}
			}, {
				text: "取消",
				handler: function() {
					that.modifyPwdWinHide();
				}
			}]
		});
	};
	this.modifyPwdWinHide = function() {
		this.modifyPwdWin.hide();
	};
	this.createSelfInfoWin = function() {
		var that = this;
		this.selfInfoWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "编辑个人信息",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					// 域RDN
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					xtype: "hiddenfield",
					name: "_NAME"
				},{
					fieldLabel: "姓名",
					name: "_NICK_NAME"
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],
						data: [{
							name: "男",
							value: 0
						}, {
							name: "女",
							value: 1
						}]
					}),
					fieldLabel: "性别",
					name: "_GENDER",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, {
					fieldLabel: "电话",
					name: "_PHONE"
				}, {
					fieldLabel: "电子邮箱",
					name: "_EMAIL",
					vtype: "email"
				}, {
					fieldLabel: "地址",
					name: "_ADDRESS"
				}]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.selfInfoWin.getComponent(0).getForm().getValues();
					that.updateSelfInfo(data);
				}
			}, {
				text: "取消",
				handler: function() {
					that.selfInfoWinHide();
				}
			}]
		});
	};
	this.selfInfoWinHide = function() {
		this.selfInfoWin.getComponent(0).getForm().reset();
		this.selfInfoWin.hide();
	}
	this.setMainPanel();
}