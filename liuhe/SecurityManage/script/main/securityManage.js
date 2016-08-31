/**
 * create 20160801
 * godz
 *
 * 用户管理页面主体
 */
function SecurityManage(parentObj) {
	this.parentObj = parentObj;
	this.panelId = "securityManage";
	this.initView = function() {
		this.createTreeStore();
		this.createTreePanel();
		this.createEdiotorPanel();
		this.setMainPanel();
	};
	this.treeType = {
		userManage: "userManage",
		groupManage: "groupManage",
		roleManage: "roleManage",
		sessionManage: "sessionManage"
	};
	this.userModel = {
		_NAME: "_NAME",
		DOMAIN: "DOMAIN",
		_ADDRESS: "_ADDRESS",
		_NICK_NAME: "_NICK_NAME",
		_EMAIL: "_EMAIL",
		_GENDER: "_GENDER",
		_ID: "_ID",
		_PHONE: "_PHONE"
	};
	this.gridModel = {
		_NAME: "_NAME",
		_LABEL: "_LABEL",
		_DESC: "_DESC",
		USERS: "USERS",
		ROLES: "ROLES"
	};
	this.roleModel = {
		RDN: "RDN",
		_ID: "_ID",
		_PDN: "_PDN",
		_NAME: "_NAME",
		_LABEL: "_LABEL",
		_DESC: "_DESC",
		PRIVILEGES: "PRIVILEGES"
	};
	this.sesstionModel = {
		USER_NAME: "USER_NAME",
		USER_RDN: "USER_RDN",
		LOGIN_TIME: "LOGIN_TIME",
		NICK_NAME: "NICK_NAME",
		LAST_ACCESS_TIME: "LAST_ACCESS_TIME",
		HOST: "HOST",
		DOMAIN: "DOMAIN",
		PORT: "PORT",
		SESSION_KEY: "SESSION_KEY"
	};
	this.init = function() {
		this.getDomain();
	};
	//  如果是系统用户 获取域
	this.getDomain = function() {
		if (main.user.userInfo.DOMAIN == "Domain=1") {
			tools.getData(configes.url.view_listDomain, null, this.setDomain, this);
		} else {
			var data = main.user.userInfo;
			data["RDN"] = data["DOMAIN"];
			this.setTreeNode(data);
		}
	};
	this.setDomain = function(data, that) {
		for (var i = 0, l = data.length; i < l; i++) {
			that.setTreeNode(data[i]);
		}
	};
	this.setTreeNode = function(data) {
		var root = this.treeStore.getRoot();
		var node = {
			nodeData: data,
			leaf: false,
			text: data["_NAME"],
			cls: "securityManageTreeType",
			children: [{
				text: "用户管理",
				leaf: true,
				cls: "securityManageTreeType",
				type: this.treeType.userManage
			}, {
				text: "组管理",
				leaf: true,
				cls: "securityManageTreeType",
				type: this.treeType.groupManage
			}, {
				text: "角色管理",
				leaf: true,
				cls: "securityManageTreeType",
				type: this.treeType.roleManage
			}, {
				text: "会话管理",
				leaf: true,
				cls: "securityManageTreeType",
				type: this.treeType.sessionManage
			}]
		};
		var newNode = root.appendChild(node);
		newNode.expand();
	};
	this.setMainPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			id: this.panelId,
			layout: "column",
			border: 0,
			defaults: {
				border: 0
			},
			items: [this.treePanel, this.ediotorPanel]
		});
	};
	// 打开编辑器
	this.openEdiotor = function(record) {
		this.editDomain = record.parentNode.data.nodeData.RDN;
		this.ediotorPanel.removeAll();
		if (record.data.type === this.treeType.userManage) {
			this.createUserGridPanel();
			this.ediotorPanel.add(this.userGridPanel);
			this.getUserList();
			this.getGroupsList(record);
		} else if (record.data.type === this.treeType.groupManage) {
			this.createGroupsGridPanel();
			this.ediotorPanel.add(this.groupsGridPanel);
			this.getGroupsList(record);
		} else if (record.data.type === this.treeType.roleManage) {
			this.createRolesGridPanel();
			this.ediotorPanel.add(this.rolesGridPanel);
			this.getRoleList(record);
			this.getListPrivilege();
		} else if (record.data.type === this.treeType.sessionManage) {
			this.createSesstionGridPanel();
			this.ediotorPanel.add(this.sesstionGridPanel);
			this.getSesstionList();
		}
	};
	this.openEditUserWin = function(record) {
		if (!this.editUserWin) {
			this.createEditUserWin();
		}
		this.passwordChange = false;
		this.getRoleList();
		this.editUserWin.show();
		var form = this.editUserWin.getComponent(0);
		var usernameInput = form.getComponent(2);
		usernameInput.setReadOnly(false);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getUserInfo(data);
			usernameInput.setReadOnly(true);
		}
	};
	this.openEditRoleWin = function(record) {
		if (!this.editRoleWin) {
			this.createEditRoleWin();
		}
		this.editRoleWin.show();
		var root = this.privilegeStore.getRoot();

		this.PrivilegeListTreeChange = false;
		var form = this.editRoleWin.getComponent(0);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getRoleInfo(data);
		}
	};
	this.openEditGroupsWin = function(record) {
		if (!this.editGroupWin) {
			this.createEditGroupWin();
		}
		this.editGroupWin.show();
		this.getUserList();
		this.getRoleList();
		var form = this.editGroupWin.getComponent(0);
		form.getForm().reset();
		if (this.editType == "update") {
			var data = record.data;
			this.getGroupInfo(data);
		}
	};

	// model-------------------------
	// 
	// 
	//获取用户列表
	this.getUserList = function(RDN) {
		Ext.getCmp("userGroupBox") && (RDN = Ext.getCmp("userGroupBox").getValue());

		if (!RDN) {
			RDN = undefined;
		}
		var params = {
			RDN: RDN,
			DOMAIN: this.editDomain
		}
		tools.getData(configes.url.view_listUserInfo, params, this.setUserList, this);
	};
	this.setUserList = function(data, that) {
		if (!that.userGridStore) {
			that.createUserGridStore();
		}
		var userList = [];
		for (var i = 0, l = data.length; i < l; i++) {
			userList.push(data[i]["DATA"]);
		}
		that.userGridStore.loadData(userList);
	};

	this.getUserInfo = function(data) {
		tools.getData(configes.url.view_getUserInfo, data, this.setUserInfo, this);
	};
	this.setUserInfo = function(data, that) {
		var form = that.editUserWin.getComponent(0).getForm();
		that.randomString = tools.randomString();
		var _CONTENT_STR = data["DATA"]["_CONTENT"] || "{}";
		var _CONTENT = JSON.parse(_CONTENT_STR);
		data["DATA"]["PROVINCE"] = _CONTENT["PROVINCE"];
		data["DATA"]["_PWD"] = that.randomString;
		data["DATA"]["GROUPS"] = data["GROUP_RDNS"];
		data["DATA"]["ROLES"] = data["ROLE_RDNS"];
		form.setValues(data["DATA"]);
	};
	this.updateUser = function(data) {
		var data = this.editUserWin.getComponent(0).getForm().getValues();
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_NICK_NAME"]) {
			tools.toast("用户名不能为空");
			return;
		}
		if (!data["_PWD"]) {
			tools.toast("密码不能为空");
			return;
		}
		if (data["_PWD"] !== this.randomString) {
			var name = data["_NAME"];
			data["_PWD"] = tools.passwordNecToAdmin(data["_PWD"]);
		} else {
			data["_PWD"] = undefined;
		}
		if (typeof data["GROUPS"] !== "string") data["GROUPS"] = data["GROUPS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		// 添加用户归属
		data["_CONTENT"] = JSON.stringify({
			PROVINCE: data["PROVINCE"]
		});
		var params = data;
		tools.getData(configes.url.view_updateUser, params, this.updateInfoReturn, this);


	};
	this.updateInfoReturn = function(data, that) {
		that.editUserWinHide();
		that.getUserList();
	};
	// 获取组列表
	this.getGroupsList = function() {
		var params = {
			RDN: this.editDomain
		};
		tools.getData(configes.url.view_listGroupInfo, params, this.setGroupsList, this);
	};
	this.setGroupsList = function(data, that) {
		var groups = [];
		for (var i = 0, l = data.length; i < l; i++) {
			data[i]["DATA"]["ROLE_RDNS"] = data[i]["ROLE_RDNS"];
			data[i]["DATA"]["USER_RDNS"] = data[i]["USER_RDNS"];
			groups.push(data[i]["DATA"]);
		}
		if (!that.groupsGridStore) {
			that.createGroupsStore();
		}
		that.groupsGridStore.loadData(groups);
	};
	// 获取组信息
	this.getGroupInfo = function(data) {
		tools.getData(configes.url.view_getGroupInfo, data, this.setGroupInfo, this);
	};
	this.setGroupInfo = function(data, that) {
		data["DATA"]["USERS"] = data["USER_RDNS"];
		data["DATA"]["ROLES"] = data["ROLE_RDNS"];
		var form = that.editGroupWin.getComponent(0).getForm();
		form.setValues(data["DATA"]);
	};
	// 修改组信息
	this.updateGroup = function(data) {

		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}

		if (typeof data["USERS"] !== "string") data["USERS"] = data["USERS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(configes.url.view_updateGroup, params, this.updateGroupReturn, this);
	};
	this.updateGroupReturn = function(data, that) {
		that.editGroupWinHide();
		that.getGroupsList();
	};

	// 添加组信息
	this.addGroup = function(data) {
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}
		data["_ID"] = undefined;
		data["_PDN"] = this.editDomain;
		if (typeof data["USERS"] !== "string") data["USERS"] = data["USERS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(configes.url.view_addGroup, params, this.addGroupReturn, this);
	};
	this.addGroupReturn = function(data, that) {
		that.editGroupWinHide();
		that.getGroupsList();
	};

	// 删除组信息
	this.deleteGroup = function(RDN) {
		var params = {
			RDN: RDN
		};
		tools.getData(configes.url.view_removeGroup, params, this.deleteGroupReturn, this);
	};
	this.deleteGroupReturn = function(data, that) {
		that.getGroupsList();
	};


	// 添加用户
	this.addUser = function(data) {
		var data = this.editUserWin.getComponent(0).getForm().getValues();
		if (!data["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!data["_NICK_NAME"]) {
			tools.toast("用户名不能为空");
			return;
		}
		if (!data["_PWD"]) {
			tools.toast("密码不能为空");
			return;
		}
		data["_ID"] = undefined;
		data["_PDN"] = this.editDomain;

		data["_PWD"] = tools.passwordNecToAdmin(data["_PWD"]);
		data["_CONTENT"] = JSON.stringify({
			PROVINCE: data["PROVINCE"]
		});
		if (typeof data["GROUPS"] !== "string") data["GROUPS"] = data["GROUPS"].join(",");
		if (typeof data["ROLES"] !== "string") data["ROLES"] = data["ROLES"].join(",");
		var params = data;
		tools.getData(configes.url.view_addUser, params, this.addUserReturn, this);
	};
	this.addUserReturn = function(data, that) {
		that.editUserWinHide();
		that.getUserList();
	};



	// 获取角色列表
	this.getRoleList = function() {

		var params = {
			RDN: this.editDomain
		}
		tools.getData(configes.url.view_listRoleInfo, params, this.setRoleList, this);
	};
	this.setRoleList = function(data, that) {
		var roleList = [];
		for (var i = 0, l = data.length; i < l; i++) {
			roleList.push(data[i]["DATA"]);
		}
		if (!that.rolesGridStore) {
			that.createRoleStore();
		}
		that.rolesGridStore.loadData(roleList);
	};
	// 获取权限列表
	this.getListPrivilege = function() {
		var params = {
			RDN: this.editDomain
		};
		tools.getData(configes.url.view_listPrivilegeAndGroup, params, this.setListPrivilege, this);
	};
	this.setListPrivilege = function(data, that) {
		if (!that.privilegeStore) {
			that.createPrivilegeList();
		}
		var root = that.privilegeStore.getRoot();
		root.removeAll();
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: false,
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = root.appendChild(node);
			that.getListPrivilegeChild(data[i], newNode);
		}
		that.getSysDomain();

	};
	this.getSysDomain = function() {
		tools.getData(configes.url.view_getSysDomain, null, this.getAdminListPrivilege, this);
	};
	this.getAdminListPrivilege = function(data, that) {
		tools.getData(configes.url.view_listPrivilegeAndGroup, data, that.setAdminListPrivilege, that);
	};
	this.setAdminListPrivilege = function(data, that) {
		var root = that.privilegeStore.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: false,
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = root.appendChild(node);
			that.getListPrivilegeChild(data[i], newNode);
		}

	};
	// 获取权限子列表
	this.getListPrivilegeChild = function(data, node) {
		var params = {
			node: node,
			that: this
		}
		tools.getData(configes.url.view_listPrivilegeAndGroup, data, this.setListPrivilegeChild, params);
	};
	this.setListPrivilegeChild = function(data, params) {
		var parentNode = params.node;
		var that = params.that;
		for (var i = 0, l = data.length; i < l; i++) {
			var node = {
				leaf: data[i]["LEAF"],
				checked: false,
				text: data[i]["_LABEL"] || data[i]["_NAME"],
				nodeData: data[i]
			};
			var newNode = parentNode.appendChild(node);
			if (data[i]["LEAF"] == false) {
				that.getListPrivilegeChild(data[i], newNode);
			}
		}
	};

	// 获取角色信息
	this.getRoleInfo = function(data) {
		tools.getData(configes.url.view_getRoleInfo, data, this.getRoleInfoReturn, this);
	};
	this.getRoleInfoReturn = function(data, that) {
		var form = that.editRoleWin.getComponent(0).getForm();
		form.setValues(data["DATA"]);
		privilege = data["PRIVILEGE_RDNS"];
		that.setRoleInfoToprivilege(privilege);
	};



	// ------------------------------------------------------------
	// 设置权限树的选择
	this.setRoleInfoToprivilege = function(privilege) {
		var root = this.privilegeStore.getRoot();
		for (var i = 0, l = privilege.length; i < l; i++) {
			this.setRoleInfoToprivilegeChild(root, privilege[i])
		}
	};
	this.setRoleInfoToprivilegeChild = function(node, RDN) {
			node.eachChild(function(Node) {
				if (Node.data.nodeData["RDN"] == RDN) {
					Node.set("checked", true);
					this.selectParentNodes(Node, true);
					node.expand();
				}
				if (!Node.isLeaf()) {
					this.setRoleInfoToprivilegeChild(Node, RDN);
				}
			}, this);
		}
		// 添加角色
	this.addRole = function(values) {
		if (!values["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!values["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}


		values["_ID"] = undefined;
		values["_PDN"] = this.editDomain;
		if (this.PrivilegeListTreeChange) {
			var root = this.privilegeStore.getRoot();
			var checkPrivileges = this.getCheckPrivileges(root);
			values["PRIVILEGES"] = checkPrivileges.join(",");
		}
		tools.getData(configes.url.view_addRole, values, this.addRoleReturn, this);
	};
	//  获取权限树的选择-------------------------------------------------
	this.getCheckPrivileges = function(node) {
		// var root = this.privilegeStore.getRoot();
		var checkPrivileges = [];

		node.eachChild(function(Node) {
			if (!Node.isLeaf()) {
				var checks = this.getCheckPrivileges(Node);
				console.log(checks);
				checkPrivileges = Ext.Array.merge(checkPrivileges, checks);
			} else if (Node.data.checked) {
				console.log(Node);
				checkPrivileges.push(Node.data.nodeData["RDN"]);
			}
		}, this);
		return checkPrivileges;
	};

	//  
	this.addRoleReturn = function(data, that) {
		that.editRoleWinHide();
		that.getRoleList();
	};


	this.updateRole = function(values) {

		if (!values["_NAME"]) {
			tools.toast("名称不能为空");
			return;
		}
		if (!values["_LABEL"]) {
			tools.toast("标签不能为空");
			return;
		}

		if (this.PrivilegeListTreeChange) {
			var root = this.privilegeStore.getRoot();
			var checkPrivileges = this.getCheckPrivileges(root);
			values["PRIVILEGES"] = checkPrivileges.join(",");
		}
		tools.getData(configes.url.view_updateRole, values, this.addRoleReturn, this);
	};
	this.updateRoleReturn = function(data, that) {
		that.editRoleWinHide();
		that.getRoleList();
	};

	this.deleteRole = function(RDN) {
		var params = {
			RDN: RDN
		}
		tools.getData(configes.url.view_removeRole, params, this.deleteRoleReturn, this);
	};
	this.deleteRoleReturn = function(data, that) {
		that.getRoleList();
	};

	// 获取会话列表
	this.getSesstionList = function() {
		var params = {
			RDN: this.editDomain
		}
		tools.getData(configes.url.view_listSession, params, this.setSelectionList, this);

	};
	this.setSelectionList = function(data, that) {
		that.sesstionGridStore.loadData(data);
	};

	this.deleteSesstion = function(KEY) {
		var params = {
			KEY: KEY
		}
		tools.getData(configes.url.view_removeSession, params, this.deleteSesstionReturn, this);
	};
	this.deleteSesstionReturn = function(data, that) {
		that.getSesstionList();
	};
	// view 
	this.createTreeStore = function() {
		this.treeStore = Ext.create("Ext.data.TreeStore", {
			root: {
				expanded: true,
				cls: "securityManageTreeRoot"
			}
		});
	};
	// 创建域的树
	this.createTreePanel = function() {
		var that = this;
		this.treePanel = Ext.create("Ext.tree.Panel", {
			store: this.treeStore,
			rootVisible: false,
			border: 0,
			cls: "securityManageTreePanel",
			columnWidth: 1 / 4,
			margin: "0 10",
			// padding: 5,
			listeners: {
				itemdblclick: function(tree, record, ele, id, e) {
					if (record.isLeaf()) {
						that.openEdiotor(record);
					}
				}
			}
		});
	};
	// 创建编辑器
	this.createEdiotorPanel = function() {
		this.ediotorPanel = Ext.create("Ext.panel.Panel", {
			columnWidth: 3 / 4,
			margin: "0 10",
			// padding: 5,
		});
	};
	//  创建用户列表
	this.createUserGridPanel = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		if (!this.userGridStore) {
			this.createUserGridStore();
		}
		this.userGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel",
			border: 0,
			// height: 450,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			// multiSelect: true,
			store: this.userGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.userModel["_NAME"],
					text: "用户名"
				}, {
					dataIndex: this.userModel["_NICK_NAME"],
					text: "姓名"
				}, {
					dataIndex: this.userModel["_ADDRESS"],
					text: "地址"
				}, {
					dataIndex: this.userModel["_EMAIL"],
					text: "邮箱"
				}, {
					dataIndex: this.userModel["_PHONE"],
					text: "电话"
				}, {
					dataIndex: this.userModel["_GENDER"],
					text: "性别",
					renderer: function(value) {
						if (value) {
							value = "女";
						} else {
							value = "男";
						}
						return value;
					}
				}]
			},
			tools: [{
				xtype: "combobox",
				id: "userGroupBox",
				store: that.groupsGridStore,
				fieldLabel: "分组",
				labelWidth: 50,
				name: "_GENDER",
				queryMode: 'local',
				displayField: '_LABEL',
				valueField: "RDN",
				autoSelect: true,
				listeners: {
					change: function() {
						var RDN = this.getValue();
						that.getUserList(RDN);
					}
				}
			}, {
				xtype: "button",
				text: "添加用户",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditUserWin();
				}
			}, {
				xtype: "button",
				text: "修改用户",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditUserWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.userGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditUserWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	// 创建组列表
	this.createGroupsGridPanel = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		this.groupsGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.groupsGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
						dataIndex: this.gridModel["_NAME"],
						text: "名称"
					}, {
						dataIndex: this.gridModel["_LABEL"],
						text: "标签"
					}, {
						dataIndex: this.gridModel["_DESC"],
						text: "描述"
					}
					// , {
					// 	dataIndex: this.gridModel["USERS"],
					// 	text: "用户"
					// }, {
					// 	dataIndex: this.gridModel["ROLES"],
					// 	text: "角色"
					// }
				]
			},
			tools: [{
				xtype: "button",
				text: "添加",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditGroupsWin();
				}
			}, {
				xtype: "button",
				text: "修改",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditGroupsWin(select[0]);
					}
				}
			}, {
				xtype: "button",
				text: "删除",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteGroupWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.groupsGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditGroupsWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	//  创建角色列表
	this.createRolesGridPanel = function() {
		var that = this;
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.rolesGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.rolesGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.roleModel["_NAME"],
					text: "名称"
				}, {
					dataIndex: this.roleModel["_LABEL"],
					text: "标签"
				}, {
					dataIndex: this.roleModel["_DESC"],
					text: "描述"
				}]
			},
			tools: [{
				xtype: "button",
				text: "添加",
				margin: "0 5",
				handler: function() {
					that.editType = "add";
					that.openEditRoleWin();
				}
			}, {
				xtype: "button",
				text: "修改",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditRoleWin(select[0]);
					}
				}
			}, {
				xtype: "button",
				text: "删除",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteRoleWin(select[0]);
					}
				}
			}],
			listeners: {
				celldblclick: function() {
					var grid = that.rolesGridPanel;
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "update";
						that.openEditRoleWin(select[0]);
					}
				}
			},
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};
	this.createSesstionGridPanel = function() {
		var that = this;
		if (!this.sesstionGridStore) {
			this.createSesstionStore();
		}
		this.sesstionGridPanel = Ext.create("Ext.grid.Panel", {
			cls: "centerFormPanel",
			border: 0,
			layout: "fit",
			width: "100%",
			autoShow: false,
			border: 0,
			store: this.sesstionGridStore,
			columns: {
				defaults: {
					menuDisabled: true,
					draggable: false,
					sortable: false
				},
				items: [{
					dataIndex: this.sesstionModel["USER_NAME"],
					text: "账号"
				}, {
					dataIndex: this.sesstionModel["NICK_NAME"],
					text: "姓名"
				}, {
					dataIndex: this.sesstionModel["LOGIN_TIME"],
					text: "登录时间",
					renderer: function(value, columns) {
						var date = new Date(value * 1000);
						var newValue = tools.dateZerofill(date);
						console.log(newValue);
						return newValue;
					}
				}, {
					dataIndex: this.sesstionModel["LAST_ACCESS_TIME"],
					text: "最后操作时间",
					renderer: function(value, columns) {
						var date = new Date(value * 1000);
						var newValue = tools.dateZerofill(date);
						console.log(newValue);
						return newValue;
					}
				}, {
					dataIndex: this.sesstionModel["HOST"],
					text: "登录地址"
				}, {
					dataIndex: this.sesstionModel["PORT"],
					text: "登录端口"
				}]
			},
			tools: [{
				xtype: "button",
				text: "删除会话",
				margin: "0 5",
				handler: function() {
					var grid = this.up("grid");
					var select = grid.getSelectionModel().getSelection();
					if (select.length > 0) {
						that.editType = "delete";
						that.deleteSesstionWin(select[0]);
					}
				}
			}],
			forceFit: true,
			renderTo: Ext.getBody(),
		});
	};

	// 删除角色警告框
	this.deleteRoleWin = function(record) {
		var RDN = record.data["RDN"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该角色吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteRole(RDN);
					return;
				} else {
					return;
				}
			}
		});
	};
	// 删除组警告框
	this.deleteGroupWin = function(record) {
		var RDN = record.data["RDN"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该组吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteGroup(RDN);
					return;
				} else {
					return;
				}
			}
		});
	};
	this.deleteSesstionWin = function(record) {
		var KEY = record.data["SESSION_KEY"];
		var that = this;
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该组吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					that.deleteSesstion(KEY);
					return;
				} else {
					return;
				}
			}
		});
	};
	//  编辑组 窗口
	this.createEditGroupWin = function() {
		var that = this;
		if (!this.userGridStore) {
			this.createUserGridStore();
		}
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.editGroupWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "新增/编辑组",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
					// 域RDN
					xtype: "hiddenfield",
					name: "_PDN"
				}, {
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					xtype: "textfield",
					name: "_NAME",
					fieldLabel: "名称"
				}, {
					xtype: "textfield",
					name: "_LABEL",
					fieldLabel: "标签"
				}, {
					xtype: "textareafield",
					height: 50,
					name: "_DESC",
					fieldLabel: "描述"
				}, Ext.create("Ext.form.field.Tag", {
					store: this.userGridStore,
					fieldLabel: "用户",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "USERS",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					valueField: "RDN",
					displayField: "_NICK_NAME",
					queryMode: 'local'
				}), Ext.create("Ext.form.field.Tag", {
					store: this.rolesGridStore,
					fieldLabel: "角色",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "ROLES",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					valueField: "RDN",
					displayField: "_LABEL",
					queryMode: 'local'
				})]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editGroupWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addGroup(data);
					} else {
						that.updateGroup(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editGroupWinHide();
				}
			}]
		});
	};
	this.editGroupWinHide = function() {
		if (this.editGroupWin) {
			this.editGroupWin.hide();
		}
	};
	// 编辑角色
	this.createEditRoleWin = function() {
		var that = this;
		if (!this.privilegeStore) {
			this.createPrivilegeList();
		}
		if (!this.privilegeListTree) {
			this.createPrivilegeListTree();
		}
		this.editRoleWin = Ext.create("Ext.window.Window", {
			width: 500,
			height: 500,
			autoScroll: true,
			modal: false,
			title: "新增/编辑角色",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			cls: "window",
			items: [Ext.create("Ext.form.Panel", {
				border: 0,
				defaults: {
					xtype: "textfield",
					labelWidth: 50,
					margin: 5,
					padding: 5,
					anchor: "95%"
				},
				items: [{
						// 域RDN
						xtype: "hiddenfield",
						name: "_PDN"
					}, {
						xtype: "hiddenfield",
						name: "_ID"
					}, {
						xtype: "textfield",
						name: "_NAME",
						fieldLabel: "名称"
					}, {
						xtype: "textfield",
						name: "_LABEL",
						fieldLabel: "标签"
					}, {
						xtype: "textareafield",
						name: "_DESC",
						fieldLabel: "描述",
						height: 50
					}, {
						xtype: "label",
						text: "权限管理"
					},
					this.privilegeListTree
				]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editRoleWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addRole(data);
					} else {
						that.updateRole(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editRoleWinHide();
				}
			}]
		});
	};
	// 编辑角色窗口隐藏
	this.editRoleWinHide = function() {
		if (this.editRoleWin) {
			this.editRoleWin.hide();
		}
		var root = this.privilegeStore.getRoot();
		this.initPrivilegeStore(root);
	};
	// 编辑用户
	this.createEditUserWin = function() {
		var that = this;
		if (!this.groupsGridStore) {
			this.createGroupsStore();
		}
		if (!this.rolesGridStore) {
			this.createRoleStore();
		}
		this.editUserWin = Ext.create("Ext.window.Window", {
			width: 500,
			modal: false,
			title: "新增/编辑用户",
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
					name: "_PDN"
				}, {
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					// 登录名
					fieldLabel: "登录名",
					name: "_NAME"
				}, {

					fieldLabel: "密码",
					name: "_PWD",
					inputType: "password",
					listeners: {
						change: function() {
							that.passwordChange = true;
						}
					}
				}, {
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
					value: 0,
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
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],

						data: [{
							name: "清除",
							value: 0
						}, {
							name: "有效",
							value: 1
						}]
					}),
					value: 1,
					fieldLabel: "状态",
					name: "_STATUS",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, {
					xtype: "combobox",
					value: false,
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "value"],
						data: [{
							name: "未锁定",
							value: false
						}, {
							name: "锁定",
							value: true
						}]
					}),
					fieldLabel: "锁定",
					name: "_LOCKED",
					editable: false,
					queryMode: 'local',
					displayField: 'name',
					valueField: "value",
					autoSelect: true
				}, Ext.create("Ext.form.field.Tag", {
					store: this.groupsGridStore,
					fieldLabel: "组",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "GROUPS",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					queryMode: 'local',
					valueField: "RDN",
					displayField: "_LABEL"
				}), Ext.create("Ext.form.field.Tag", {

					store: this.rolesGridStore,
					fieldLabel: "角色",
					labelWidth: 80,
					margin: 5,
					padding: 5,
					anchor: "95%",
					name: "ROLES",
					editable: false,
					filterPickList: false,
					renderTo: Ext.getBody(),
					queryMode: 'local',
					valueField: "RDN",
					displayField: "_NAME"
				}), {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fixeds: ["NAME", "VALUE"],
						data: [{
							NAME: "深圳中心",
							VALUE: "深圳中心"
						}, {
							NAME: "甘肃",
							VALUE: "甘肃"
						}]
					}),
					fieldLabel: "用户归属",
					// labelWidth: 80,
					name: "PROVINCE",
					queryMode: 'local',
					displayField: 'NAME',
					valueField: "VALUE",
					autoSelect: true,
					listeners: {

					}
				}]
			})],
			buttons: [{
				text: "确定",
				handler: function() {
					var data = that.editUserWin.getComponent(0).getForm().getValues();
					if (that.editType == "add") {
						that.addUser(data);
					} else {
						that.updateUser(data);
					}
				}
			}, {
				text: "取消",
				handler: function() {
					that.editUserWinHide();
				}
			}]
		});
	};
	this.editUserWinHide = function() {
		if (this.editUserWin) {
			this.editUserWin.hide();
		}
	};

	// 角色数据集
	this.createRoleStore = function() {
		this.rolesGridStore = Ext.create("Ext.data.Store", {
			fixeds: [

				this.roleModel["_NAME"],
				this.roleModel["_ID"],
				this.roleModel["_PDN"],
				this.roleModel["RDN"],
				this.roleModel["_LABEL"],
				this.roleModel["_DESC"],
				this.roleModel["PRIVILEGES"]
			],
		});
	};

	this.createSesstionStore = function() {
		this.sesstionGridStore = Ext.create("Ext.data.Store", {
			fixeds: [
				this.sesstionModel["USER_NAME"],
				this.sesstionModel["USER_RDN"],
				this.sesstionModel["LOGIN_TIME"],
				this.sesstionModel["NICK_NAME"],
				this.sesstionModel["LAST_ACCESS_TIME"],
				this.sesstionModel["HOST"],
				this.sesstionModel["DOMAIN"],
				this.sesstionModel["PORT"],
				this.sesstionModel["SESSION_KEY"]
			],
		});
	};
	// 用户集合
	this.createUserGridStore = function() {
		this.userGridStore = Ext.create("Ext.data.Store", {
			fixeds: [this.userModel["DOMAIN"],
				this.userModel["_ADDRESS"],
				this.userModel["_NICK_NAME"],
				this.userModel["_EMAIL"],
				this.userModel["_GENDER"],
				this.userModel["_ID"],
				this.userModel["_PHONE"]
			],
		});
	};
	// 组集合
	this.createGroupsStore = function() {
		this.groupsGridStore = Ext.create("Ext.data.Store", {
			fixeds: [
				this.gridModel["_NAME"],
				this.gridModel["_LABEL"],
				this.gridModel["_DESC"],
				this.gridModel["USERS"],
				this.gridModel["ROLES"]
			],
		});
	};
	// 选择子节点
	this.selectChildNodes = function(Node, checked) {
		Node.expand();
		Node.eachChild(function(node) {
			// node.data.checked = checked;
			node.set("checked", checked);
			if (node.isLeaf()) {

			} else {
				this.selectChildNodes(node, checked);
			}
		}, this);
	};
	this.selectParentNodes = function(Node, checked) {
		var parentNode = Node.parentNode;
		parentNode.set("checked", true);
		if (parentNode.parentNode) {
			this.selectParentNodes(parentNode, checked);
		}
	};
	//初始化节点 
	this.initPrivilegeStore = function(Node) {
		Node.set("checked", false);
		Node.eachChild(function(node) {
			node.set("checked", false);
			if (!node.isLeaf()) {
				this.initPrivilegeStore(node);
			}
		}, this);
		if (Node.isExpanded()) {
			Node.collapseChildren();
		}
	};
	// 权限树
	this.createPrivilegeListTree = function() {
		this.privilegeListTree = Ext.create("Ext.tree.Panel", {
			store: this.privilegeStore,
			rootVisible: false,
			border: 0,
			columnWidth: 1 / 4,
			margin: "0 10",
			listeners: {
				checkchange: {
					fn: function(node, checked) {
						this.PrivilegeListTreeChange = true;
						this.selectChildNodes(node, checked); //选定子节点  
						if (checked) {
							this.selectParentNodes(node, checked);
						}
					}
				},
				scope: this
			}
		});
	};
	// 权限集合
	this.createPrivilegeList = function() {
		this.privilegeStore = Ext.create("Ext.data.TreeStore", {
			root: {
				expanded: true
			}
		});
	};
	this.initView();
}