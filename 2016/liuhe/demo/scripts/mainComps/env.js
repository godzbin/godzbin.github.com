Ext.ns("P_env");

P_main.InitGroup.reg(function() {
			P_env.pipe = new common.EventPipe();
			P_main.NavigateMgr.getInstance().reg(new P_env.EnvTreeMgr());
			var contentTabMgr = P_main.ContentTabMgr.getInstance();
			contentTabMgr.reg(P_env.EnvEditorMgr);
			contentTabMgr.reg(P_env.EnvVarEditorMgr);
			var registry = P_main.PreLoadRegistry.getInstance();
			registry.reg(new P_env.EnvVarTypesLoader());
			registry.reg(new P_env.DataSourceTypesLoader());
		});

P_env.Event = {
	ENV_ADDED : "P_env_ENV_ADDED",
	ENV_UPDATED : "P_env_ENV_UPDATED",
	ENV_REMOVED : "P_env_ENV_REMOVED",
	ENV_VAR_ADDED : "P_env_ENV_VAR_ADDED",
	ENV_VAR_UPDATED : "P_env_ENV_VAR_UPDATED",
	ENV_VAR_REMOVED : "P_env_ENV_VAR_REMOVED",
	ENV_IMPORTED : "P_env_ENV_IMPORTED"
};

P_env.Env = {
	CACHE_ENVS : "CACHE_ENVS",
	CACHE_ENV_VAR_TYPES : "CACHE_ENV_VAR_TYPES",
	CACHE_DATA_SOURCE_TYPES : "CACHE_DATA_SOURCE_TYPES",
	envIconCls : "icon-env",
	envVarFuncIconCls : "icon-env-var-func",
	envVarTextIconCls : "icon-env-var-text",
	envVarDSIconCls : "icon-env-var-ds",
	envVarPwdIconCls : "icon-env-var-pwd",
	envVarJSONIconCls : "icon-env-var-json"
};

P_env.EnvVarType = {
	TEXT : 0,
	PASSWORD : 1,
	FUNCTION : 2,
	DATA_SOURCE : 3,
	JSON : 4
};

P_env.EnvMO = Ext.apply({}, P_basic.ModelBase);

P_env.EnvVar = Ext.apply({
			TYPE : "_TYPE",
			VALUE : "_VALUE"
		}, P_basic.ModelBase);

P_env.DataSource = {
	TYPE : "TYPE",
	HOST : "HOST",
	PORT : "PORT",
	USER : "USER",
	PASSWORD : "PASSWORD",
	DBNAME : "DBNAME"
};

P_env.WebAction = {
	LIST_ENV : "view_listEnv",
	GET_ENV : "view_getEnv",
	ADD_ENV : "view_addEnv",
	UPDATE_ENV : "view_updateEnv",
	REMOVE_ENV : "view_removeEnv",
	GET_ENV_VAR_TYPES : "view_getEnvVarTypes",
	GET_DATA_SOURCE_TYPES : "view_getDataSourceTypes",
	LIST_ENV_VAR : "view_listEnvVar",
	GET_ENV_VAR : "view_getEnvVar",
	ADD_ENV_VAR : "view_addEnvVar",
	UPDATE_ENV_VAR : "view_updateEnvVar",
	REMOVE_ENV_VAR : "view_removeEnvVar",
	TEST_LINK : "view_testLink",
	DEBUG_FUNC : "view_debugFunc",
	EXPORT_ENV : "view_exportEnv",
	IMPORT_ENV : "view_importEnv",
	TERMINATE_DEBUG : "view_termianteDebugEnv"
};

P_env.Res = Ext.apply({
			nodeText : "环境",
			env : "环境",
			envRemoveConfirm : "确定要删除指定环境吗？",
			envVarRemoveConfirm : "确定要删除指定环境变量吗？",
			testLink : "测试链接",
			testLinkSuccess : "数据库链接成功",
			testLinkFail : "数据库链接失败"
		}, Resources);

P_env.afterUpload = function(msg, state, paramsStr) {
	var o = P_basic.afterUpload(msg, state, paramsStr);
	P_env.pipe.fireEvent(P_env.Event.ENV_IMPORTED, o);
};

P_env.Utils = {
	getEnvVarIconCls : function(type) {
		if (type != null) {
			switch (type) {
				case P_env.EnvVarType.TEXT :
					return P_env.Env.envVarTextIconCls;
				case P_env.EnvVarType.PASSWORD :
					return P_env.Env.envVarPwdIconCls;
				case P_env.EnvVarType.FUNCTION :
					return P_env.Env.envVarFuncIconCls;
				case P_env.EnvVarType.DATA_SOURCE :
					return P_env.Env.envVarDSIconCls;
				case P_env.EnvVarType.JSON :
					return P_env.Env.envVarJSONIconCls;
			}
		}
		return null;
	}
};

P_env.EnvVarTypesLoader = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_env.EnvVarTypesLoader.superclass.constructor.call(this);
			},

			run : function() {
				P_main.sysReq(P_env.WebAction.GET_ENV_VAR_TYPES, null,
						this.__onEnvVarTypesLoaded, this);
			},

			__onEnvVarTypesLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					P_main.LocalCache.getInstance().addToCache(
							P_env.Env.CACHE_ENV_VAR_TYPES, os);
				}
				P_main.PreLoadRegistry.getInstance().notify(this.getXType());
			},

			getXType : function() {
				return P_env.EnvVarTypesLoader.XTYPE;
			}
		});
P_env.EnvVarTypesLoader.XTYPE = "P_env.EnvVarTypesLoader";

P_env.DataSourceTypesLoader = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_env.DataSourceTypesLoader.superclass.constructor.call(this);
			},

			run : function() {
				P_main.sysReq(P_env.WebAction.GET_DATA_SOURCE_TYPES, null,
						this.__onDataSourceTypesLoaded, this);
			},

			__onDataSourceTypesLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					P_main.LocalCache.getInstance().addToCache(
							P_env.Env.CACHE_DATA_SOURCE_TYPES, os);
				}
				P_main.PreLoadRegistry.getInstance().notify(this.getXType());
			},

			getXType : function() {
				return P_env.DataSourceTypesLoader.XTYPE;
			}
		});
P_env.DataSourceTypesLoader.XTYPE = "P_env.DataSourceTypesLoader";

P_env.EnvTreeMgr = Ext.extend(P_basic.TreeMgr, {
	constructor : function() {
		P_env.EnvTreeMgr.superclass.constructor.call(this);
		P_env.pipe.reg(P_env.Event.ENV_REMOVED, this);
		P_env.pipe.on(P_env.Event.ENV_ADDED, this.__onEnvAdded, this);
		P_env.pipe.on(P_env.Event.ENV_UPDATED, this.refreshNodeText, this);
		this.envFormMgr = P_env.EnvFormMgr.getInstance();
	},

	__onEnvAdded : function(o) {
		this.addItemToTree(o);
		var RDN = P_basic.Utils.getRDN(o);
		var node = this.getNodeByRDN(RDN);
		if (node) {
			this.onNodeDblClick(node);
		}
	},

	__createContextMenu : function() {
		this.addItem = new Ext.menu.Item({
					text : P_env.Res.add,
					iconCls : "add",
					listeners : {
						click : this.__reqAddEnv,
						scope : this
					}
				});
		this.editItem = new Ext.menu.Item({
					text : P_env.Res.edit,
					iconCls : "edit",
					listeners : {
						click : this.__reqEditEnv,
						scope : this
					}
				});
		this.refreshItem = new Ext.menu.Item({
					text : P_env.Res.refresh,
					iconCls : "refresh",
					listeners : {
						click : this.refreshNode,
						scope : this
					}
				});
		this.removeItem = new Ext.menu.Item({
					text : P_env.Res.remove,
					iconCls : "delete",
					listeners : {
						click : this.__reqRemoveEnv,
						scope : this
					}
				});
		return new Ext.menu.Menu({
					items : [this.addItem, this.editItem, "-",
							this.refreshItem, "-", this.removeItem]
				});
	},

	__createNode : function(o) {
		return new Ext.tree.TreeNode({
					text : o[P_env.EnvMO.NAME],
					iconCls : P_env.Env.envIconCls,
					__RDN : P_basic.Utils.getRDN(o),
					__MGR_TYPE : this.getXType()
				});
	},

	showContextMenu : function(node, event) {
		var menu = this.getContextMenu();
		if (node.attributes.__RDN) {
			this.addItem.setDisabled(true);
			this.refreshItem.setDisabled(true);
			this.editItem.setDisabled(false);
			this.removeItem.setDisabled(false);
		} else {
			this.addItem.setDisabled(false);
			this.refreshItem.setDisabled(false);
			this.editItem.setDisabled(true);
			this.removeItem.setDisabled(true);
		}
		menu.showAt(event.getXY());
	},

	__reqAddEnv : function() {
		this.envFormMgr.reqAdd();
	},

	__reqEditEnv : function() {
		var node = this.getSelectedNode();
		if (node) {
			var data = {};
			P_basic.Utils.setRDN(data, node.attributes.__RDN);
			this.envFormMgr.setData(data);
			this.envFormMgr.reqEdit();
		}
	},

	__reqRemoveEnv : function() {
		var node = this.getSelectedNode();
		if (node) {
			P_basic.Utils.deleteConfirm(P_env.Res.envRemoveConfirm,
					node.attributes.__RDN, P_env.WebAction.REMOVE_ENV,
					this.__onEnvRemoved, this);
		}
	},

	__onEnvRemoved : function(res) {
		if (P_main.Service.parseResult(res)) {
			this.removeSelectedNode(P_env.Event.ENV_REMOVED);
		}
	},

	onNodeExpanded : function(node) {
		if (!node.attributes.__CHILDREN_LOADED) {
			this.__listEnv();
		}
	},

	__listEnv : function() {
		P_main.sysReq(P_env.WebAction.LIST_ENV, null, this.__onEnvListed, this);
	},

	__onEnvListed : function(res) {
		var os = P_main.Service.getRSContent(res);
		if (os) {
			var pn = this.getOriginalNode();
			for (var i = 0; i < os.length; ++i) {
				pn.appendChild(this.__createNode(os[i]));
			}
			pn.attributes.__CHILDREN_LOADED = true;
			P_main.LocalCache.getInstance()
					.addToCache(P_env.Env.CACHE_ENVS, os);
		}
	},

	onNodeDblClick : function(node) {
		var RDN = node.attributes.__RDN;
		if (RDN) {
			var data = {};
			data[P_env.EnvMO.NAME] = node.text;
			P_basic.Utils.setRDN(data, RDN);
			P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
					P_env.EnvEditorMgr.XTYPE, data);
		}
	},

	__getOriginalNodeText : function() {
		return P_env.Res.nodeText;
	},

	getXType : function() {
		return P_env.EnvTreeMgr.XTYPE;
	}
});
P_env.EnvTreeMgr.XTYPE = "P_env.EnvTreeMgr";

P_env.EnvFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_env.EnvFormMgr.superclass.constructor.call(this);
				P_env.pipe.reg(P_env.Event.ENV_ADDED, this);
				P_env.pipe.reg(P_env.Event.ENV_UPDATED, this);
			},

			initKeys : function() {
				var id = Utils.getId();
				var prefix = "add" + id;
				this.addKeys = {
					name : prefix + "Name"
				};

				prefix = "edit" + id;
				this.editKeys = {
					name : prefix + "Name"
				};

				this.formKeys = {}
				this.formKeys[this.addKeys.name] = P_env.EnvMO.NAME;

				this.formKeys[this.editKeys.name] = P_env.EnvMO.NAME;
			},

			getAddWinConfig : function() {
				return {
					title : P_env.Res.add + "-" + P_env.Res.env
				};
			},

			getEditWinConfig : function() {
				return {
					title : P_env.Res.edit + "-" + P_env.Res.env
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 120,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				return GuiUtil.createForm({
							labelWidth : 60,
							defaults : {},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [{
										id : this.keys.name,
										fieldLabel : P_env.Res.name,
										width : 300,
										cls : "fieldList-value"
									}]
						});
			},

			doAdd : function() {
				var o = {};
				Utils.getValueFromGui(o, this.keys, this.formKeys);
				if (!this.validate(o)) {
					return;
				}
				P_main.sysReq(P_env.WebAction.ADD_ENV, o, this.onAdded, this);
			},

			onAdded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_env.Event.ENV_ADDED, o);
					this.cancelAdd();
				}
			},

			reqEdit : function() {
				P_env.EnvFormMgr.superclass.reqEdit.call(this);
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				P_main.sysReq(P_env.WebAction.GET_ENV, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.data = o;
					Utils.setValueToGui(o, this.keys, this.formKeys);
				}
			},

			doEdit : function() {
				var o = Ext.apply({}, this.data);
				Utils.getValueFromGui(o, this.keys, this.formKeys);
				if (!this.validate(o)) {
					return;
				}
				P_main.sysReq(P_env.WebAction.UPDATE_ENV, o, this.__onUpdated,
						this);
			},

			__onUpdated : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_env.Event.ENV_UPDATED, o);
					this.cancelEdit();
				}
			},

			validate : function(o) {
				return true;
			},

			getXType : function() {
				return P_env.EnvFormMgr.XTYPE;
			}
		});
P_env.EnvFormMgr.XTYPE = "P_env.EnvFormMgr";
Utils.addInstanceFunc(P_env.EnvFormMgr);

P_env.EnvEditorMgr = Ext.extend(P_basic.EditorMgr, {
			constructor : function() {
				P_env.EnvEditorMgr.superclass.constructor.call(this);
				P_env.pipe.on(P_env.Event.ENV_UPDATED, this.__onEnvUpdated,
						this);
				P_env.pipe.on(P_env.Event.ENV_REMOVED, this.__onEnvRemoved,
						this);
				this.envVarGrid = new P_env.EnvVarGrid();
			},

			__onEnvUpdated : function(o) {
				this.data = o;
				this.__updateUI();
			},

			__onEnvRemoved : function(RDN) {
				if (P_basic.Utils.getRDN(this.data) == RDN) {
					P_main.pipe.fireEvent(P_main.Event.CLOSE_EDITOR, this);
				}
			},

			__createContent : function() {
				return this.envVarGrid.createGrid({
							title : P_env.Res.unTitled,
							iconCls : P_env.Env.envIconCls,
							closable : true
						});
			},

			__updateUI : function() {
				this.content.setTitle(this.data[P_env.EnvMO.NAME]);
			},

			postInit : function() {
				this.__updateUI();
				this.envVarGrid.setData(this.data);
				this.envVarGrid.loadData();
			},

			clear : function() {
				P_env.EnvEditorMgr.superclass.clear.call(this);
				P_env.pipe.un(P_env.Event.ENV_UPDATED, this.__onEnvUpdated,
						this);
				P_env.pipe.un(P_env.Event.ENV_REMOVED, this.__onEnvRemoved,
						this);
				this.envVarGrid.clear();
			},

			getXType : function() {
				return P_env.EnvEditorMgr.XTYPE;
			}
		});
P_env.EnvEditorMgr.XTYPE = "P_env.EnvEditorMgr";

P_env.EnvVarGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_env.EnvVarGrid.superclass.constructor.call(this);
				P_env.pipe.reg(P_env.Event.ENV_VAR_REMOVED, this);
				P_env.pipe.on(P_env.Event.ENV_VAR_ADDED, this.__onEnvVarAdded,
						this);
				P_env.pipe.on(P_env.Event.ENV_VAR_UPDATED,
						this.__onEnvVarUpdated, this);
				P_env.pipe.on(P_env.Event.ENV_IMPORTED, this.__onEnvImported,
						this);
				this.data = null;
				this.importMgr = P_env.EnvImportMgr.getInstance();
				this.filterBar = new common.FilterBar();
				this.filterBar.on(common.FilterEvent.DO_FILTER,
						this.__onDoFilter, this);
			},

			clear : function() {
				P_env.pipe
						.un(P_env.Event.ENV_ADDED, this.__onEnvVarAdded, this);
				P_env.pipe.un(P_env.Event.ENV_UPDATED, this.__onEnvVarUpdated,
						this);
				P_env.pipe.un(P_env.Event.ENV_IMPORTED, this.__onEnvImported,
						this);
			},

			__onEnvImported : function(o) {
				var f = P_basic.Utils.getRDN;
				if (o && f(o) == f(this.data)) {
					this.refresh();
				}
			},

			__onEnvVarAdded : function(o) {
				var clazz = this.__getRecordClass();
				var r = Utils.newRecord(clazz, o, this.getFields());
				this.getStore().add([r]);
				this.selectRecord(r);
			},

			__onEnvVarUpdated : function(o) {
				var store = this.getStore();
				var idx = store.find(P_env.EnvVar.RDN, P_basic.Utils.getRDN(o));
				if (idx > -1) {
					var r = store.getAt(idx);
					var fs = this.getFields();
					for (var i = 0; i < fs.length; ++i) {
						var f = fs[i];
						r.set(f, o[f]);
					}
					store.commitChanges();
				}
			},

			setData : function(data) {
				this.data = data;
			},

			__onDoFilter : function() {
				this.refresh();
			},

			refresh : function() {
				this.loadData();
			},

			createFields : function() {
				var o = P_env.EnvVar;
				var fs = [];
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							header : "&nbsp;",
							dataIndex : P_env.EnvVar.TYPE,
							width : 20,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_env.Res.name,
							dataIndex : P_env.EnvVar.NAME,
							width : 300,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_env.Res.desc,
							dataIndex : P_env.EnvVar.DESC,
							width : 300,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_env.Res.value,
							dataIndex : P_env.EnvVar.VALUE,
							width : 300,
							renderer : this.__renderer,
							scope : this
						}];
				return P_env.EnvVarGrid.superclass.createColumnModel.call(this,
						cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				switch (colIndex) {
					case 0 :
						var iconCls = P_env.Utils.getEnvVarIconCls(value);
						return utils.Renderer
								.renderIconValue(iconCls, "&nbsp;");
					case 3 :
						var type = record.get(P_env.EnvVar.TYPE);
						if (type != P_env.EnvVarType.TEXT) {
							value = "";
						}
						break;
				}
				return value;
			},

			createGrid : function(config) {
				var grid = P_env.EnvVarGrid.superclass.createGrid.call(this,
						Ext.apply({
									tbar : this.__createTBar()
								}, config || {}));
				grid.on("rowdblclick", this.__onRowDblClick, this);
				return grid;
			},

			__onRowDblClick : function() {
				this.__reqEdit();
			},

			__createTBar : function() {
				var addBtn = common.ToolItem.createAdd({
							handler : this.__reqAdd,
							scope : this
						});
				var editBtn = common.ToolItem.createEdit({
							disabled : true,
							handler : this.__reqEdit,
							scope : this
						});
				var delBtn = common.ToolItem.createDelete({
							disabled : true,
							handler : this.__reqDelete,
							scope : this
						});
				var exportBtn = common.ToolItem.createExport({
							handler : this.__reqExport,
							scope : this
						});
				var importBtn = common.ToolItem.createImport({
							handler : this.__reqImport,
							scope : this
						});
				this.addToSingleSel(editBtn);
				this.addToSingleSel(delBtn);
				return [addBtn, editBtn, delBtn, "-", exportBtn, importBtn,
						"->"].concat(this.filterBar.createItems());
			},

			__reqImport : function() {
				var data = {};
				P_basic.Utils.setRDN(data, this.data);
				this.importMgr.setData(data);
				this.importMgr.reqAdd();
			},

			__reqExport : function() {
				if (!this.downloadForm) {
					this.downloadForm = P_main.createDownloadForm();
				}
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				this.downloadForm.submit(P_env.WebAction.EXPORT_ENV, params);
			},

			__reqAdd : function() {
				var data = {};
				P_basic.Utils.setPDN(data, this.data);
				P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
						P_env.EnvVarEditorMgr.XTYPE, data);
			},

			__reqEdit : function() {
				var r = this.getSelection();
				if (r) {
					var data = {};
					P_basic.Utils.setRDN(data, r);
					P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
							P_env.EnvVarEditorMgr.XTYPE, data);
				}
			},

			__reqDelete : function() {
				var r = this.getSelection();
				if (r) {
					var RDN = P_basic.Utils.getRDN(r);
					P_basic.Utils.deleteConfirm(P_env.Res.envVarRemoveConfirm,
							RDN, P_env.WebAction.REMOVE_ENV_VAR,
							this.__onEnvVarRemoved, this);
				}
			},

			__onEnvVarRemoved : function(res) {
				if (P_main.Service.parseResult(res)) {
					var r = this.getSelection();
					this.getStore().remove(r);
					var RDN = P_basic.Utils.getRDN(r);
					this.fireEvent(P_env.Event.ENV_VAR_REMOVED, RDN);
				}
			},

			loadData : function() {
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				var content = this.filterBar.getValue();
				if (!Utils.isBlank(content)) {
					params[ds.Common.CONTENT] = content;
				}
				P_main.sysReq(P_env.WebAction.LIST_ENV_VAR, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					os.sort(this.__sortFunc);
					this.setDataList(os);
				}
			},

			__sortFunc : function(v1, v2) {
				var key = P_env.EnvVar.TYPE;
				return v1[key] - v2[key];
			},

			getXType : function() {
				return P_env.EnvVarGrid.XTYPE;
			}
		});
P_env.EnvVarGrid.XTYPE = "P_env.EnvVarGrid";

P_env.EnvVarEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_env.EnvVarEditorMgr.superclass.constructor.call(this);
		P_env.pipe.reg(P_env.Event.ENV_VAR_ADDED, this);
		P_env.pipe.reg(P_env.Event.ENV_VAR_UPDATED, this);
		P_env.pipe.on(P_env.Event.ENV_REMOVED, this.__onEnvRemoved, this);
		P_env.pipe
				.on(P_env.Event.ENV_VAR_REMOVED, this.__onEnvVarRemoved, this);
		this.mgrs = this.__createValueInputMgrs();
		for (var i = 0; i < this.mgrs.length; ++i) {
			this.mgrs[i].setOwner(this);
		}
	},

	clear : function() {
		for (var i = 0; i < this.mgrs.length; ++i) {
			this.mgrs[i].clear();
		}
		this.mgrs.splice(0, this.mgrs.length);
		P_env.pipe.un(P_env.Event.ENV_REMOVED, this.__onEnvRemoved, this);
		P_env.pipe
				.un(P_env.Event.ENV_VAR_REMOVED, this.__onEnvVarRemoved, this);
		P_env.EnvVarEditorMgr.superclass.clear.call(this);
	},

	checkClose : function() {
		return this.__getCurrMgr().checkClose();
	},

	__onEnvRemoved : function(PDN) {
		if (P_basic.Utils.getPDN(this.data) == PDN) {
			P_main.pipe.fireEvent(P_main.Event.CLOSE_EDITOR, this);
		}
	},

	__onEnvVarRemoved : function(RDN) {
		if (!this.isNew()) {
			if (P_basic.Utils.getRDN(this.data) == RDN) {
				P_main.pipe.fireEvent(P_main.Event.CLOSE_EDITOR, this);
			}
		}
	},

	save : function() {
		var o = Ext.apply({}, this.data);
		var name = this.nameInput.getValue();
		if (!Utils.isBlank(name)) {
			o[P_env.EnvVar.NAME] = name;
		}
		o[P_env.EnvVar.TYPE] = this.typeCombo.getValue();
		o[P_env.EnvVar.DESC] = this.descInput.getValue();
		o[P_env.EnvVar.VALUE] = this.__getCurrMgr().getData();
		if (!this.validate(o)) {
			return;
		}
		if (this.isNew()) {
			P_main.sysReq(P_env.WebAction.ADD_ENV_VAR, o, this.__onAdded, this);
		} else {
			P_main.sysReq(P_env.WebAction.UPDATE_ENV_VAR, o, this.__onUpdated,
					this);
		}
	},

	__onAdded : function(res) {
		this.__onSaved(res, P_env.Event.ENV_VAR_ADDED);
	},

	__onUpdated : function(res) {
		this.__onSaved(res, P_env.Event.ENV_VAR_UPDATED);
	},

	__onSaved : function(res, event) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.fireEvent(event, o);
			this.__updateUI();
		}
	},

	validate : function(o) {
		return true;
	},

	isNew : function() {
		return P_basic.Utils.getRDN(this.data) == null;
	},

	__getCurrMgr : function() {
		var type = this.typeCombo.getValue();
		for (var i = 0; i < this.mgrs.length; ++i) {
			if (this.mgrs[i].acceptType(type)) {
				return this.mgrs[i];
			}
		}
	},

	__createValueInputMgrs : function() {
		return [new P_env.EnvVarTextInputMgr(),
				new P_env.EnvVarPasswordInputMgr(),
				new P_env.EnvVarFunctionInputMgr(),
				new P_env.EnvVarDataSourceInputMgr(),
				new P_env.EnvVarJSONInputMgr()];
	},

	__createContent : function() {
		this.descInput = new Ext.form.TextArea();
		this.nameInput = new Ext.form.TextField({
					fieldLabel : P_env.Res.name
				});
		var os = P_main.LocalCache.getInstance()
				.getFromCache(P_env.Env.CACHE_ENV_VAR_TYPES);
		var data = [];
		for (var i = 0; i < os.length; ++i) {
			data.push([os[i].NAME, os[i].VALUE]);
		}
		this.typeCombo = GuiUtil.createComboBox({
					fieldLabel : P_env.Res.type,
					width : 150,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							}),
					value : data[0][1]
				});
		this.typeCombo.on("select", this.__onValueTypeChanged, this);
		var items = [this.typeCombo, this.nameInput];
		for (var i = 0; i < this.mgrs.length; ++i) {
			items = items.concat(this.mgrs[i].getItems());
		}
		var formPanel = GuiUtil.createForm({
					title : P_env.Res.general,
					labelWidth : 80,
					bodyStyle : {
						padding : "10px 0 0 0"
					},
					items : items
				});
		formPanel.on("resize", this.__onFormResized, this);
		this.__onValueTypeChanged();
		return new Ext.TabPanel({
					title : P_env.Res.unTitled,
					closable : true,
					activeTab : 0,
					items : [formPanel, {
								title : P_env.Res.desc,
								layout : "fit",
								items : [this.descInput]
							}],
					tbar : this.__createTBar()
				});
	},

	__onValueTypeChanged : function() {
		var type = this.typeCombo.getValue();
		for (var i = 0; i < this.mgrs.length; ++i) {
			var mgr = this.mgrs[i];
			if (mgr.acceptType(type)) {
				mgr.show();
			} else {
				mgr.hide();
			}
		}
	},

	__onFormResized : function(panel, w, h) {
		if (w > 0 && h > 0) {
			var width = w - 100;
			var items = panel.items;
			for (var i = 0, len = items.getCount(); i < len; ++i) {
				items.get(i).setWidth(width);
			}
			for (var i = 0; i < this.mgrs.length; ++i) {
				this.mgrs[i].resizeItems(w, h);
			}
		}
	},

	__createTBar : function() {
		var saveBtn = common.ToolItem.createSave({
					handler : this.save,
					scope : this
				});
		this.refreshBtn = common.ToolItem.createRefresh({
					disabled : true,
					handler : this.refresh,
					scope : this
				});
		var items = [saveBtn, this.refreshBtn];
		for (var i = 0; i < this.mgrs.length; ++i) {
			items = items.concat(this.mgrs[i].getToolItems());
		}
		return items;
	},

	isNew : function() {
		return P_basic.Utils.getRDN(this.data) == null;
	},

	postInit : function() {
		if (this.isNew()) {
			this.nameInput.setReadOnly(false);
		} else {
			this.__loadEnvVar();
		}
	},

	refresh : function() {
		if (!this.isNew()) {
			if (!this.isDirty() || confirm(P_env.Res.reloadConfirm)) {
				this.__loadEnvVar();
			}
		}
	},

	__loadEnvVar : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data);
		P_main.sysReq(P_env.WebAction.GET_ENV_VAR, params, this.__onEnvVarLoad,
				this);
	},

	__onEnvVarLoad : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.nameInput.setReadOnly(true);
			this.nameInput.setValue(this.data[P_env.EnvVar.NAME]);
			this.descInput.setValue(this.data[P_env.EnvVar.DESC]);
			this.typeCombo.setValue(this.data[P_env.EnvVar.TYPE]);
			this.__onValueTypeChanged();
			this.__getCurrMgr().setData(this.data[P_env.EnvVar.VALUE]);
			this.__updateUI();
		}
	},

	__updateUI : function() {
		this.content.setIconClass(this.__getIconCls());
		this.content.setTitle(P_basic.Utils.getNameText(this.data));
		this.refreshBtn.setDisabled(this.isNew());
	},

	__getIconCls : function() {
		var type = this.data[P_env.EnvVar.TYPE];
		return P_env.Utils.getEnvVarIconCls(type);
	},

	getXType : function() {
		return P_env.EnvVarEditorMgr.XTYPE;
	}
});
P_env.EnvVarEditorMgr.XTYPE = "P_env.EnvVarEditorMgr";

P_env.EnvVarValueInputMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_env.EnvVarValueInputMgr.superclass.constructor.call(this);
				this.owner = null;
			},

			checkClose : function() {
				return true;
			},

			clear : function() {
				this.purgeListeners();
				this.owner = null;
				this.data = null;
			},

			setOwner : function(owner) {
				this.owner = owner;
			},

			acceptType : function(type) {
				return false;
			},

			setData : function(data) {
			},

			getData : function() {
				return null;
			},

			resizeItems : function(w, h) {
				var items = this.getItems();
				if (items.length == 1) {
					var item = items[0];
					if (item.getXType() == "textarea") {
						item.setHeight(h - 70);
					}
				}
			},

			show : function() {
				this.setVisible(true);
			},

			hide : function() {
				this.setVisible(false);
			},

			setVisible : function(visible) {
				var items = this.getItems().concat(this.getToolItems());
				for (var j = 0; j < items.length; ++j) {
					if (visible) {
						items[j].show();
					} else {
						items[j].hide();
					}
				}
			},

			createToolItems : function() {
				return [];
			},

			getToolItems : function() {
				if (!this.toolItems) {
					this.toolItems = this.createToolItems();
				}
				return this.toolItems;
			},

			createItems : function() {
				return [];
			},

			getItems : function() {
				if (!this.items) {
					this.items = this.createItems();
				}
				return this.items;
			},

			getXType : function() {
				return P_env.EnvVarValueInputMgr.XTYPE;
			}
		});
P_env.EnvVarValueInputMgr.XTYPE = "P_env.EnvVarValueInputMgr";

P_env.EnvVarTextInputMgr = Ext.extend(P_env.EnvVarValueInputMgr, {
			constructor : function() {
				P_env.EnvVarTextInputMgr.superclass.constructor.call(this);
			},

			acceptType : function(type) {
				return type == P_env.EnvVarType.TEXT;
			},

			setData : function(data) {
				this.getItems()[0].setValue(data);
			},

			getData : function() {
				return this.getItems()[0].getValue();
			},

			createItems : function() {
				return [new Ext.form.TextArea({
							fieldLabel : P_env.Res.text + P_env.Res.value
						})];
			},

			getXType : function() {
				return P_env.EnvVarTextInputMgr.XTYPE;
			}
		});
P_env.EnvVarTextInputMgr.XTYPE = "P_env.EnvVarTextInputMgr";

P_env.EnvVarJSONInputMgr = Ext.extend(P_env.EnvVarTextInputMgr, {
			constructor : function() {
				P_env.EnvVarJSONInputMgr.superclass.constructor.call(this);
			},

			acceptType : function(type) {
				return type == P_env.EnvVarType.JSON;
			},

			getXType : function() {
				return P_env.EnvVarJSONInputMgr.XTYPE;
			}
		});
P_env.EnvVarJSONInputMgr.XTYPE = "P_env.EnvVarJSONInputMgr";

P_env.EnvVarPasswordInputMgr = Ext.extend(P_env.EnvVarValueInputMgr, {
			constructor : function() {
				P_env.EnvVarPasswordInputMgr.superclass.constructor.call(this);
			},

			acceptType : function(type) {
				return type == P_env.EnvVarType.PASSWORD;
			},

			setData : function(data) {
				this.getItems()[0].setValue(data);
			},

			getData : function() {
				return this.getItems()[0].getValue();
			},

			createItems : function() {
				return [new Ext.form.TextField({
							fieldLabel : P_env.Res.password,
							inputType : "password"
						})];
			},

			getXType : function() {
				return P_env.EnvVarPasswordInputMgr.XTYPE;
			}
		});
P_env.EnvVarPasswordInputMgr.XTYPE = "P_env.EnvVarPasswordInputMgr";

P_env.EnvVarFunctionInputMgr = Ext.extend(P_env.EnvVarValueInputMgr, {
			constructor : function() {
				P_env.EnvVarFunctionInputMgr.superclass.constructor.call(this);
				this.debugMgr = new P_basic.DebugMgr({
							terminateAction : P_env.WebAction.TERMINATE_DEBUG
						});
				this.debugMgr.setOwner(this);
			},

			clear : function() {
				P_main.pipe.fireEvent(P_main.Event.CLOSE_DEBUG, this.debugMgr
								.getDebugKey());
				P_env.EnvVarFunctionInputMgr.superclass.clear.call(this);
			},

			checkClose : function() {
				if (this.debugMgr.isDebugging()) {
					Utils.error(P_basic.Res.closeOnDebugging);
					return false;
				}
				return true;
			},

			acceptType : function(type) {
				return type == P_env.EnvVarType.FUNCTION;
			},

			show : function() {
				P_env.EnvVarFunctionInputMgr.superclass.show.call(this);
				this.owner.nameInput.setDisabled(true);
			},

			hide : function() {
				P_env.EnvVarFunctionInputMgr.superclass.hide.call(this);
				this.owner.nameInput.setDisabled(false);
			},

			setData : function(data) {
				this.getItems()[0].setValue(data);
			},

			getData : function() {
				return this.getItems()[0].getValue();
			},

			createToolItems : function() {
				return this.debugMgr.createToolItems();
			},

			createItems : function() {
				return [new Ext.form.TextArea({
							fieldLabel : P_env.Res.func
						})];
			},

			getDebugMethod : function() {
				return P_env.WebAction.DEBUG_FUNC;
			},

			getDebugParams : function() {
				var params = {};
				P_basic.Utils.setRDN(params, P_basic.Utils
								.getPDN(this.owner.data));
				params[ds.Common.CONTENT] = this.getItems()[0].getValue();
				return params;
			},

			getDebugTitle : function() {
				if (this.owner.isNew()) {
					return null;
				}
				return this.owner.getData()[P_env.EnvMO.NAME];
			},

			getXType : function() {
				return P_env.EnvVarFunctionInputMgr.XTYPE;
			}
		});
P_env.EnvVarFunctionInputMgr.XTYPE = "P_env.EnvVarFunctionInputMgr";

P_env.EnvVarDataSourceInputMgr = Ext.extend(P_env.EnvVarValueInputMgr, {
			constructor : function() {
				P_env.EnvVarDataSourceInputMgr.superclass.constructor
						.call(this);
				this.initKeys();
			},

			initKeys : function() {
				var prefix = "u" + Utils.getId();
				this.keys = {
					type : prefix + "type",
					host : prefix + "host",
					port : prefix + "port",
					user : prefix + "user",
					pwd : prefix + "pwd",
					dbName : prefix + "dbName"
				};
				this.formKeys = {};
				this.formKeys[this.keys.type] = P_env.DataSource.TYPE;
				this.formKeys[this.keys.host] = P_env.DataSource.HOST;
				this.formKeys[this.keys.port] = P_env.DataSource.PORT;
				this.formKeys[this.keys.user] = P_env.DataSource.USER;
				this.formKeys[this.keys.pwd] = P_env.DataSource.PASSWORD;
				this.formKeys[this.keys.dbName] = P_env.DataSource.DBNAME;
			},

			acceptType : function(type) {
				return type == P_env.EnvVarType.DATA_SOURCE;
			},

			setData : function(data) {
				var o = Ext.decode(data);
				Utils.setValueToGui(o, this.keys, this.formKeys);
			},

			getData : function() {
				var o = {};
				Utils.getValueFromGui(o, this.keys, this.formKeys);
				return Ext.encode(o);
			},

			createToolItems : function() {
				var testLinkBtn = new Ext.Button({
							text : P_env.Res.testLink,
							iconCls : "testLink",
							handler : this.__testLink,
							scope : this
						});
				return [testLinkBtn];
			},

			__testLink : function() {
				var params = {};
				Utils.getValueFromGui(params, this.keys, this.formKeys);
				P_main.sysReq(P_env.WebAction.TEST_LINK, params,
						this.__onTestLink, this);
			},

			__onTestLink : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					if (o.VALUE) {
						Utils.info(P_env.Res.testLinkSuccess);
					} else {
						Utils.error(P_env.Res.testLinkFail);
					}
				}
			},

			createItems : function() {
				var data = [];
				var os = P_main.LocalCache.getInstance()
						.getFromCache(P_env.Env.CACHE_DATA_SOURCE_TYPES);
				for (var i = 0; i < os.length; ++i) {
					data.push([os[i].NAME, os[i].VALUE]);
				}
				var typeCombo = GuiUtil.createComboBox({
							id : this.keys.type,
							fieldLabel : P_env.Res.dataSource + P_env.Res.type,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									}),
							value : data[0][1]
						});
				var hostInput = new Ext.form.TextField({
							id : this.keys.host,
							fieldLabel : P_env.Res.host
						});
				var portInput = new Ext.form.NumberField({
							id : this.keys.port,
							fieldLabel : P_env.Res.port,
							allowDecimals : false
						});
				var userInput = new Ext.form.TextField({
							id : this.keys.user,
							fieldLabel : P_env.Res.userName
						});
				var pwdInput = new Ext.form.TextField({
							id : this.keys.pwd,
							fieldLabel : P_env.Res.password,
							inputType : "password"
						});
				var dbNameInput = new Ext.form.TextField({
							id : this.keys.dbName,
							fieldLabel : P_env.Res.dbName
						});
				return [typeCombo, hostInput, portInput, dbNameInput,
						userInput, pwdInput];
			},

			getXType : function() {
				return P_env.EnvVarDataSourceInputMgr.XTYPE;
			}
		});
P_env.EnvVarDataSourceInputMgr.XTYPE = "P_env.EnvVarDataSourceInputMgr";

P_env.EnvImportMgr = Ext.extend(P_basic.UploadFormMgr, {
			constructor : function() {
				P_env.EnvImportMgr.superclass.constructor.call(this);
			},

			__getSubmitConfig : function() {
				var callbackParams = {};
				P_basic.Utils.setRDN(callbackParams, this.data);
				return {
					func : P_env.WebAction.IMPORT_ENV,
					params : {
						CALLBACK : "window.parent.P_env.afterUpload",
						CALLBACK_PARAMS : callbackParams
					}
				};
			},

			getXType : function() {
				return P_env.EnvImportMgr.XTYPE;
			}
		});
P_env.EnvImportMgr.XTYPE = "P_env.EnvImportMgr";
Utils.addInstanceFunc(P_env.EnvImportMgr);