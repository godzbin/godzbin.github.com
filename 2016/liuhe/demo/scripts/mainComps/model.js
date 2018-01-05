Ext.ns("P_model")

P_main.InitGroup.reg(function() {
			P_model.pipe = new common.EventPipe();
			P_main.NavigateMgr.getInstance().reg(new P_model.ModelTreeMgr());
			var contentTabMgr = P_main.ContentTabMgr.getInstance();
			contentTabMgr.reg(P_model.ModelEditorMgr);
			contentTabMgr.reg(P_model.DataEditorMgr);
			P_model.DataExchanger.init();
		});

P_model.DataExchanger = {
	init : function() {
		P_main.pipe
				.on(P_main.Event.DATA_EXCHANGE, this.__onDataExchanged, this);
	},

	__onDataExchanged : function(data) {
		if (data.TYPE == P_basic.DataExchangeType.METADATA) {
			var RDN = P_basic.Utils.getRDN(data);
			if (RDN) {
				var params = {};
				P_basic.Utils.setRDN(params, RDN);
				P_main.sysReq(P_model.WebAction.GET_METADATA, params,
						this.__onDataLoaded, this);
			}
		}
	},

	__onDataLoaded : function(res, opts) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			var data = {
				MODEL_RDN : o[P_model.MetaData.MODEL_RDN]
			};
			P_basic.Utils.setRDN(data, o);
			P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
					P_model.DataEditorMgr.XTYPE, data);
		}
	}
};

P_model.Event = {
	PACKAGE_ADDED : "P_model_PACKAGE_ADDED",
	PACKAGE_UPDATED : "P_model_PACKAGE_UPDATED",
	PACKAGE_REMOVED : "P_model_PACKAGE_REMOVED",
	MODEL_ADDED : "P_model_MODEL_ADDED",
	MODEL_UPDATED : "P_model_MODEL_UPDATED",
	MODEL_REMOVED : "P_model_MODEL_REMOVED",
	METADATA_ADDED : "P_model_METADATA_ADDED",
	METADATA_UPDATED : "P_model_METADATA_UPDATED",
	METADATA_REMOVED : "P_model_METADATA_REMOVED",
	METADATA_IMPORTED : "P_model_METADATA_IMPORTED"
};

P_model.Env = {
	PACKAGE_CLASS : "Package",
	MODEL_CLASS : "Model",
	CACHE_ENVS : "CACHE_ENVS",
	SEP : ",",
	packageIconCls : "icon-package",
	modelIconCls : "icon-model",
	dataIconCls : "icon-data"
};

P_model.WebAction = {
	GET_CHILDREN_OF_PACKAGE : "view_getChildrenOfPackage",
	GET_PACKAGE : "view_getPackage",
	ADD_PACKAGE : "view_addPackage",
	UPDATE_PACKAGE : "view_updatePackage",
	GET_MODEL : "view_getModel",
	ADD_MODEL : "view_addModel",
	UPDATE_MODEL : "view_updateModel",
	REMOVE_PACKAGE : "view_removePackage",
	REMOVE_MODEL : "view_removeModel",
	LIST_METADATA : "view_listMetaData",
	GET_METADATA : "view_getMetaData",
	ADD_METADATA : "view_addMetaData",
	UPDATE_METADATA : "view_updateMetaData",
	REMOVE_METADATA : "view_removeMetaData",
	EXPORT_METADATA : "view_exportMetaData",
	IMPORT_METADATA : "view_importMetaData",
	DEBUG_JOB : "view_debugJob",
	TERMINATE_DEBUG : "view_terminateDebugJob"
};

P_model.Res = Ext.apply({
			nodeText : "模型管理",
			pkg : "包",
			model : "模型",
			pkgRemoveConfirm : "确定要删除指定包吗？",
			modelRemoveConfirm : "确定要删除指定模型吗？",
			dataRemoveConfirm : "确定要删除指定数据吗？",
			nullable : "可否为null",
			defaultValue : "默认值",
			minValue : "最小值",
			maxValue : "最大值",
			path : "路径",
			env : "环境",
			uuid : "uuid",
			attr : "属性",
			classPath : "模型路径",
			stringName : "STRING",
			intName : "INT",
			floatName : "FLOAT",
			booleanName : "BOOL",
			pwdName : "密码",
			jobName : "JOB",
			job : "作业"
		}, Resources);

P_model.afterUpload = function(msg, state, paramsStr) {
	var o = P_basic.afterUpload(msg, state, paramsStr);
	P_model.pipe.fireEvent(P_model.Event.METADATA_IMPORTED, o);
};

P_model.getEnvName = function(value) {
	var envs = P_main.LocalCache.getInstance()
			.getFromCache(P_model.Env.CACHE_ENVS);
	for (var i = 0; i < envs.length; ++i) {
		var env = envs[i];
		if (P_basic.Utils.getRDN(env) == value) {
			return env[P_basic.ModelBase.NAME];
		}
	}
	return null;
};

P_model.Package = Ext.apply({}, P_basic.ModelBase);

P_model.Model = Ext.apply({
			FULL_CLASS : "FULL_CLASS"
		}, P_basic.ModelBase);

P_model.Attribute = Ext.apply({
			TYPE : "_TYPE",
			NULLABLE : "_NULLABLE",
			DEFAULT_VALUE : "_DEFAULT_VALUE",
			MAX_VALUE : "_MAX_VALUE",
			MIN_VALUE : "_MIN_VALUE",
			EXTENSION : "_EXTENSION",
			USER_TYPE : "USER_TYPE"
		}, P_basic.ModelBase);

P_model.MetaData = {
	ID : "_ID",
	RDN : "RDN",
	MODEL_RDN : "MODEL_RDN",
	UUID : "_UUID",
	ENV : "_ENV"
};

P_model.AttrType = {
	STRING : 0,
	INT : 1,
	FLOAT : 2,
	BOOLEAN : 3,
	PASSWORD : 6,
	JOB : "JOB"
};
P_model.AttrType.isBasicAttr = function(attr) {
	var userType = attr[P_model.Attribute.USER_TYPE];
	var vs = [this.STRING, this.INT, this.FLOAT, this.BOOLEAN, this.PASSWORD];
	return vs.indexOf(userType) > -1;
};
P_model.AttrType.isJobAttr = function(attr) {
	return attr[P_model.Attribute.USER_TYPE] == this.JOB;
};
P_model.AttrType.setUserType = function(attrList) {
	for (var i = 0; i < attrList.length; ++i) {
		var attr = attrList[i];
		var extension = attr[P_model.Attribute.EXTENSION];
		var type = attr[P_model.Attribute.TYPE];
		if (type == this.STRING) {
			if (extension == this.JOB) {
				attr[P_model.Attribute.USER_TYPE] = this.JOB;
			}
		}
		if (attr[P_model.Attribute.USER_TYPE] == null) {
			attr[P_model.Attribute.USER_TYPE] = type;
		}
		attr[P_model.Attribute.EXTENSION] = null;
	}
};
P_model.AttrType.setType = function(attrList) {
	for (var i = 0; i < attrList.length; ++i) {
		var attr = attrList[i];
		var userType = attr[P_model.Attribute.USER_TYPE];
		if (userType == this.JOB) {
			attr[P_model.Attribute.TYPE] = this.STRING;
			attr[P_model.Attribute.EXTENSION] = this.JOB;
		}
		if (attr[P_model.Attribute.TYPE] == null) {
			attr[P_model.Attribute.TYPE] = userType;
			attr[P_model.Attribute.EXTENSION] = null;
		}
	}
};
P_model.AttrType.getTypeArray = function() {
	return [{
				VALUE : this.STRING,
				NAME : P_model.Res.stringName
			}, {
				VALUE : this.INT,
				NAME : P_model.Res.intName
			}, {
				VALUE : this.FLOAT,
				NAME : P_model.Res.floatName
			}, {
				VALUE : this.BOOLEAN,
				NAME : P_model.Res.booleanName
			}, {
				VALUE : this.PASSWORD,
				NAME : P_model.Res.pwdName
			}, {
				VALUE : this.JOB,
				NAME : P_model.Res.jobName
			}];
};

P_model.ModelTreeMgr = Ext.extend(P_basic.TreeMgr, {
			constructor : function() {
				P_model.ModelTreeMgr.superclass.constructor.call(this);
				P_model.pipe.reg(P_model.Event.PACKAGE_REMOVED, this);
				P_model.pipe.reg(P_model.Event.MODEL_REMOVED, this);
				P_model.pipe.on(P_model.Event.PACKAGE_ADDED,
						this.addItemToTree, this);
				P_model.pipe.on(P_model.Event.PACKAGE_UPDATED,
						this.refreshNodeText, this);
				P_model.pipe.on(P_model.Event.MODEL_ADDED, this.__onModelAdded,
						this);
				P_model.pipe.on(P_model.Event.MODEL_UPDATED,
						this.__onModelUpdated, this);
				this.packageFormMgr = P_model.PackageFormMgr.getInstance();
			},

			__onModelAdded : function(data) {
				var model = data.MODEL;
				var PDN = this.__getRDNOfPDN(model[P_model.Model.PDN]);
				var pn = this.getNodeByRDN(PDN);
				if (pn) {
					if (pn.attributes.__CHILDREN_LOADED) {
						pn.appendChild(this.__createNode(model));
					}
					this.getTree().expandPath(pn.getPath());
				}
			},

			__onModelUpdated : function(data) {
				var model = data.MODEL;
				var node = this.getNodeByRDN(P_basic.Utils.getRDN(model));
				if (node) {
					node.setText(P_basic.Utils.getNameText(model));
				}
			},

			__getRDNOfPDN : function(PDN) {
				var idx = PDN.indexOf(";");
				if (idx > -1) {
					return PDN.substring(idx + 1);
				}
				return PDN;
			},

			__createNode : function(o) {
				var expandable = false;
				var iconCls = null;
				var clazz = o[P_basic.ModelBase.CLASS];
				switch (clazz) {
					case P_model.Env.PACKAGE_CLASS :
						expandable = true;
						iconCls = P_model.Env.packageIconCls;
						break;
					case P_model.Env.MODEL_CLASS :
						expandable = false;
						iconCls = P_model.Env.modelIconCls;
						break;
					default :
						throw Error("Invalid class: " + clazz);
				}
				return new Ext.tree.TreeNode({
							text : P_basic.Utils.getNameText(o),
							expandable : expandable,
							iconCls : iconCls,
							__CLASS : o[P_basic.ModelBase.CLASS],
							__RDN : P_basic.Utils.getRDN(o),
							__MGR_TYPE : this.getXType()
						});
			},

			__reqAddPackage : function() {
				var node = this.getSelectedNode();
				if (!node) {
					return;
				}
				var data = {};
				data[P_model.Package.PDN] = node.attributes.__RDN;
				this.packageFormMgr.setData(data);
				this.packageFormMgr.reqAdd();
			},

			__reqEditPackage : function() {
				var node = this.getSelectedNode();
				if (!node) {
					return;
				}
				var data = {};
				P_basic.Utils.setRDN(data, node.attributes.__RDN);
				this.packageFormMgr.setData(data);
				this.packageFormMgr.reqEdit();
			},

			__reqRemovePackage : function() {
				var node = this.getSelectedNode();
				if (node) {
					P_basic.Utils.deleteConfirm(P_model.Res.pkgRemoveConfirm,
							node.attributes.__RDN,
							P_model.WebAction.REMOVE_PACKAGE,
							this.__onPackageRemoved, this);
				}
			},

			__onPackageRemoved : function(res) {
				if (P_main.Service.parseResult(res)) {
					var node = this.getSelectedNode();
					if (node) {
						node.remove(true);
						this.fireEvent(P_model.Event.PACKAGE_REMOVED);
					}
				}
			},

			__reqAddModel : function() {
				var node = this.getSelectedNode();
				if (node) {
					var data = {
						MODEL : {}
					};
					data.MODEL[P_model.Model.PDN] = node.attributes.__RDN;
					P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
							P_model.ModelEditorMgr.XTYPE, data);
				}
			},

			__reqEditModel : function() {
				var node = this.getSelectedNode();
				if (node && node.attributes.__CLASS == P_model.Env.MODEL_CLASS) {
					var data = {
						MODEL : {}
					};
					P_basic.Utils.setRDN(data.MODEL, node.attributes.__RDN);
					P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
							P_model.ModelEditorMgr.XTYPE, data);
				}
			},

			__reqRemoveModel : function() {
				var node = this.getSelectedNode();
				if (node) {
					P_basic.Utils.deleteConfirm(P_model.Res.modelRemoveConfirm,
							node.attributes.__RDN,
							P_model.WebAction.REMOVE_MODEL,
							this.__onModelRemoved, this);
				}
			},

			__onModelRemoved : function(res) {
				if (P_main.Service.parseResult(res)) {
					this.removeSelectedNode(P_model.Event.MODEL_REMOVED);
				}
			},

			__reqEdit : function() {
				var node = this.getSelectedNode();
				if (node) {
					var className = node.attributes.__CLASS;
					if (className == P_model.Env.PACKAGE_CLASS) {
						this.__reqEditPackage();
					} else if (className == P_model.Env.MODEL_CLASS) {
						this.__reqEditModel();
					}
				}
			},

			__reqRemove : function() {
				var node = this.getSelectedNode();
				if (node) {
					var className = node.attributes.__CLASS;
					if (className == P_model.Env.PACKAGE_CLASS) {
						this.__reqRemovePackage();
					} else if (className == P_model.Env.MODEL_CLASS) {
						this.__reqRemoveModel();
					}
				}
			},

			__createContextMenu : function() {
				this.addModelItem = new Ext.menu.Item({
							text : P_model.Res.model,
							iconCls : P_model.Env.modelIconCls,
							listeners : {
								click : this.__reqAddModel,
								scope : this
							}
						});
				this.addItem = new Ext.menu.Item({
							text : P_model.Res.add,
							iconCls : "add",
							menu : {
								items : [{
											text : P_model.Res.pkg,
											iconCls : P_model.Env.packageIconCls,
											listeners : {
												click : this.__reqAddPackage,
												scope : this
											}
										}, this.addModelItem]
							}
						});
				this.editItem = new Ext.menu.Item({
							text : P_model.Res.edit,
							iconCls : "edit",
							listeners : {
								click : this.__reqEdit,
								scope : this
							}
						});
				this.removeItem = new Ext.menu.Item({
							text : P_model.Res.remove,
							iconCls : "delete",
							listeners : {
								click : this.__reqRemove,
								scope : this
							}
						});
				this.refreshItem = new Ext.menu.Item({
							text : P_model.Res.refresh,
							iconCls : "refresh",
							listeners : {
								click : this.refreshNode,
								scope : this
							}
						});
				return new Ext.menu.Menu({
							items : [this.addItem, this.editItem, "-",
									this.refreshItem, "-", this.removeItem]
						});
			},

			showContextMenu : function(node, event) {
				var menu = this.getContextMenu();
				var enableItems = null;
				var disableItems = null;
				switch (node.attributes.__CLASS) {
					case P_model.Env.PACKAGE_CLASS :
						enableItems = [this.addItem, this.editItem,
								this.refreshItem, this.removeItem,
								this.addModelItem];
						disableItems = [];
						break;
					case P_model.Env.MODEL_CLASS :
						enableItems = [this.editItem, this.removeItem];
						disableItems = [this.addItem, this.refreshItem,
								this.addModelItem];
						break;
					default :
						enableItems = [this.addItem, this.refreshItem];
						disableItems = [this.editItem, this.removeItem,
								this.addModelItem];
						break;
				}
				for (var i = 0; i < enableItems.length; ++i) {
					enableItems[i].setDisabled(false);
				}
				for (var i = 0; i < disableItems.length; ++i) {
					disableItems[i].setDisabled(true);
				}
				menu.showAt(event.getXY());
			},

			onNodeExpanded : function(node) {
				if (!node.attributes.__CHILDREN_LOADED) {
					this.__getChildrenOfPackage(node.attributes.__RDN, node);
				}
			},

			onNodeDblClick : function(node) {
				if (node.attributes.__CLASS == P_model.Env.MODEL_CLASS) {
					this.__reqEditModel();
				}
			},

			__getChildrenOfPackage : function(RDN, node) {
				var params = {};
				if (RDN) {
					P_basic.Utils.setRDN(params, RDN);
				}
				P_main.sysReq(P_model.WebAction.GET_CHILDREN_OF_PACKAGE,
						params, this.__onChildrenOfPackageLoaded, this, {
							node : node
						});
			},

			__onChildrenOfPackageLoaded : function(res, options) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					var pn = options.others.node;
					for (var i = 0; i < os.length; ++i) {
						pn.appendChild(this.__createNode(os[i]));
					}
					pn.attributes.__CHILDREN_LOADED = true;
				}
			},

			__getOriginalNodeText : function() {
				return P_model.Res.nodeText;
			},

			getXType : function() {
				return P_model.ModelTreeMgr.XTYPE;
			}
		});
P_model.ModelTreeMgr.XTYPE = "P_model.ModelTreeMgr";

P_model.PackageFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_model.PackageFormMgr.superclass.constructor.call(this);
				P_model.pipe.reg(P_model.Event.PACKAGE_ADDED, this);
				P_model.pipe.reg(P_model.Event.PACKAGE_UPDATED, this);
			},

			initKeys : function() {
				var id = Utils.getId();
				var prefix = "add" + id;
				this.addKeys = {
					name : prefix + "Name",
					label : prefix + "Label"
				};

				prefix = "edit" + id;
				this.editKeys = {
					name : prefix + "Name",
					label : prefix + "Label"
				};

				this.formKeys = {}
				this.formKeys[this.addKeys.name] = P_model.Package.NAME;
				this.formKeys[this.addKeys.label] = P_model.Package.LABEL;

				this.formKeys[this.editKeys.name] = P_model.Package.NAME;
				this.formKeys[this.editKeys.label] = P_model.Package.LABEL;
			},

			getAddWinConfig : function() {
				return {
					title : P_model.Res.add + "-" + P_model.Res.pkg
				};
			},

			getEditWinConfig : function() {
				return {
					title : P_model.Res.edit + "-" + P_model.Res.pkg
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 150,
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
										fieldLabel : P_model.Res.name,
										width : 300,
										cls : "fieldList-value"
									}, {
										id : this.keys.label,
										fieldLabel : P_model.Res.label,
										width : 300,
										cls : "fieldList-value"
									}]
						});
			},

			doAdd : function() {
				var o = {};
				Utils.getValueFromGui(o, this.keys, this.formKeys);
				o[P_model.Package.PDN] = this.data[P_model.Package.PDN];
				if (!this.validate(o)) {
					return;
				}
				P_main.sysReq(P_model.WebAction.ADD_PACKAGE, o, this.onAdded,
						this);
			},

			onAdded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_model.Event.PACKAGE_ADDED, o);
					this.cancelAdd();
				}
			},

			reqEdit : function() {
				P_model.PackageFormMgr.superclass.reqEdit.call(this);
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				P_main.sysReq(P_model.WebAction.GET_PACKAGE, params,
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
				P_main.sysReq(P_model.WebAction.UPDATE_PACKAGE, o,
						this.__onUpdated, this);
			},

			__onUpdated : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_model.Event.PACKAGE_UPDATED, o);
					this.cancelEdit();
				}
			},

			validate : function(o) {
				return true;
			},

			getXType : function() {
				return P_model.PackageFormMgr.XTYPE;
			}
		});
P_model.PackageFormMgr.XTYPE = "P_model.PackageFormMgr";
Utils.addInstanceFunc(P_model.PackageFormMgr);

P_model.ModelEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_model.ModelEditorMgr.superclass.constructor.call(this);
		P_model.pipe.reg(P_model.Event.MODEL_ADDED, this);
		P_model.pipe.reg(P_model.Event.MODEL_UPDATED, this);
		P_model.pipe.on(P_model.Event.MODEL_REMOVED, this.__onModelRemoved,
				this);
		this.attrGrid = new P_model.AttrGrid();
		this.dataGrid = new P_model.DataGrid();
	},

	clear : function() {
		this.attrGrid.clear();
		this.dataGrid.clear();
		P_model.pipe.un(P_model.Event.MODEL_REMOVED, this.__onModelRemoved,
				this);
		P_model.ModelEditorMgr.superclass.clear.call(this);
	},

	__onModelRemoved : function(RDN) {
		if (!this.isNew()) {
			if (P_basic.Utils.getRDN(this.data.MODEL) == RDN) {
				P_main.pipe.fireEvent(P_main.Event.CLOSE_EDITOR, this);
			}
		}
	},

	__createContent : function() {
		return new Ext.TabPanel({
					title : P_model.Res.unTitled,
					iconCls : P_model.Env.modelIconCls,
					closable : true,
					activeTab : 0,
					items : [this.__createDataPanel(),
							this.__createModelPanel()]
				});
	},

	__createDataPanel : function() {
		return this.dataGrid.createGrid({
					title : P_model.Res.data
				});
	},

	__createModelPanel : function() {
		this.nameInput = new Ext.form.TextField({
					width : 120,
					style : {
						"margin-right" : "20px"
					}
				});
		this.labelInput = new Ext.form.TextField({
					width : 180,
					style : {
						"margin-right" : "20px"
					}
				});
		this.pathInput = new Ext.form.TextField({
					readOnly : true,
					width : 250
				});
		return new Ext.Panel({
			title : P_model.Res.model,
			layout : "fit",
			items : [{
				border : false,
				layout : "border",
				style : {
					"padding" : "5px"
				},
				items : [{
					region : "north",
					height : 28,
					border : false,
					layout : "table",
					layoutConfig : {
						columns : 6
					},
					items : [
							P_basic.Utils.createLabelItem(P_model.Res.name, 40),
							this.nameInput,
							P_basic.Utils
									.createLabelItem(P_model.Res.label, 50),
							this.labelInput,
							P_basic.Utils.createLabelItem(P_model.Res.path, 40),
							this.pathInput]
				}, this.attrGrid.createGrid({
							region : "center"
						})]
			}],
			tbar : this.__createTBar()
		});
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
		return [saveBtn, this.refreshBtn];
	},

	__createModel : function() {
		var o = Ext.apply({}, this.data.MODEL);
		o[P_model.Model.NAME] = this.nameInput.getValue();
		o[P_model.Model.LABEL] = this.labelInput.getValue();
		return o;
	},

	save : function() {
		var model = this.__createModel();
		if (!this.validate(model)) {
			return;
		}
		var attrList = this.attrGrid.getAttrList();
		for (var i = 0; i < attrList.length; ++i) {
			if (!this.attrGrid.validate(attrList[i])) {
				return;
			}
		}
		var params = {
			MODEL : model,
			ATTR_LIST : attrList
		};
		if (this.isNew()) {
			P_main.sysReq(P_model.WebAction.ADD_MODEL, params,
					this.__onModelAdded, this);
		} else {
			P_main.sysReq(P_model.WebAction.UPDATE_MODEL, params,
					this.__onModelUpdated, this);
		}
	},

	__onModelAdded : function(res) {
		this.__onModelSaved(res, P_model.Event.MODEL_ADDED);
	},

	__onModelUpdated : function(res) {
		this.__onModelSaved(res, P_model.Event.MODEL_UPDATED);
	},

	__onModelSaved : function(res, event) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.fireEvent(event, o);
			this.__updateUI();
			P_model.AttrType.setUserType(o.ATTR_LIST);
			this.dataGrid.reInitGrid(o);
		}
	},

	validate : function(o) {
		return true;
	},

	isNew : function() {
		return P_basic.Utils.getRDN(this.data.MODEL) == null;
	},

	isDataOwner : function(data) {
		var RDN = P_basic.Utils.getRDN(this.data.MODEL);
		return RDN && RDN == P_basic.Utils.getRDN(data.MODEL);
	},

	postInit : function() {
		if (this.isNew()) {
			this.content.setActiveTab(1);
		} else {
			this.content.setActiveTab(0);
			this.__loadModel();
		}
	},

	refresh : function() {
		if (!this.isNew()) {
			if (!this.isDirty() || confirm(P_model.Res.reloadConfirm)) {
				this.__loadModel();
			}
		}
	},

	__loadModel : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data.MODEL);
		P_main.sysReq(P_model.WebAction.GET_MODEL, params,
				this.__onModelLoaded, this);
	},

	__onModelLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			var model = o.MODEL;
			this.nameInput.setValue(model[P_model.Model.NAME]);
			this.labelInput.setValue(model[P_model.Model.LABEL] || "");
			P_model.AttrType.setUserType(o.ATTR_LIST);
			this.attrGrid.setAttrList(o.ATTR_LIST);
			this.__updateUI();
			this.dataGrid.reInitGrid(o);
		}
	},

	__updateUI : function() {
		var model = this.data.MODEL;
		this.getContent().setTitle(P_basic.Utils.getNameText(model));
		this.pathInput.setValue(model[P_model.Model.FULL_CLASS]);
		this.refreshBtn.setDisabled(this.isNew());
	},

	getXType : function() {
		return P_model.ModelEditorMgr.XTYPE;
	}
});
P_model.ModelEditorMgr.XTYPE = "P_model.ModelEditorMgr";

P_model.AttrGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_model.AttrGrid.superclass.constructor.call(this);
			},

			clear : function() {
				this.clearData();
			},

			getGridClass : function() {
				return Ext.grid.EditorGridPanel;
			},

			createFields : function() {
				var fs = [];
				var o = P_model.Attribute;
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			__getAttrTypes : function() {
				return P_model.AttrType.getTypeArray();
			},

			createColumnModel : function() {
				var attrTypes = this.__getAttrTypes();
				var data = [];
				for (var i = 0; i < attrTypes.length; ++i) {
					var attrType = attrTypes[i];
					data.push([attrType.NAME, attrType.VALUE]);
				}
				var typeCombo = GuiUtil.createComboBox({
							lazyRender : true,
							listClass : 'x-combo-list-small',
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"],
										data : data
									})
						});
				var cols = [{
							header : P_model.Res.name,
							dataIndex : P_model.Attribute.NAME,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextField({
										allowBlank : false
									}),
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.label,
							dataIndex : P_model.Attribute.LABEL,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextField(),
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.desc,
							dataIndex : P_model.Attribute.DESC,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextArea(),
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.type,
							dataIndex : P_model.Attribute.USER_TYPE,
							width : 60,
							sortable : false,
							editor : typeCombo,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.nullable,
							dataIndex : P_model.Attribute.NULLABLE,
							width : 60,
							sortable : false,
							xtype : "checkcolumn",
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.defaultValue,
							dataIndex : P_model.Attribute.DEFAULT_VALUE,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextField(),
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.minValue,
							dataIndex : P_model.Attribute.MIN_VALUE,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextField(),
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_model.Res.maxValue,
							dataIndex : P_model.Attribute.MAX_VALUE,
							width : 60,
							sortable : false,
							editor : new Ext.form.TextField(),
							renderer : this.__renderer,
							scope : this
						}];
				return P_model.AttrGrid.superclass.createColumnModel.call(this,
						cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				switch (colIndex) {
					case 3 :
						var attrTypes = this.__getAttrTypes();
						for (var i = 0; i < attrTypes.length; ++i) {
							var attrType = attrTypes[i];
							if (attrType.VALUE == value) {
								return attrType.NAME;
							}
						}
						break;
					case 4 :
						var cls = "uncheck";
						if (value) {
							cls = "checked";
						}
						return utils.Renderer.renderIconValue(cls, "&nbsp;");
				}
				return value;
			},

			createGrid : function(config) {
				return P_model.AttrGrid.superclass.createGrid.call(this, Ext
								.apply({
											clicksToEdit : 1,
											columnLines : true,
											tbar : this.__createTBar()
										}, config || {}));
			},

			__createTBar : function() {
				var addBtn = common.ToolItem.createAdd({
							handler : this.__addAttr,
							scope : this
						});
				var delBtn = common.ToolItem.createDelete({
							disabled : true,
							handler : this.__delAttr,
							scope : this
						});
				var upwardBtn = common.ToolItem.createUpward({
							disabled : true,
							handler : this.__upwardAttr,
							scope : this
						});
				var downwardBtn = common.ToolItem.createDownward({
							disabled : true,
							handler : this.__downwardAttr,
							scope : this
						});
				this.addToSingleSel(delBtn);
				this.addToSingleSel(upwardBtn);
				this.addToSingleSel(downwardBtn);
				return [addBtn, delBtn, "-", upwardBtn, downwardBtn];
			},

			__newAttrName : function() {
				var store = this.getStore();
				var nameSet = [];
				for (var i = 0, len = store.getCount(); i < len; ++i) {
					var r = store.getAt(i);
					nameSet.push(r.get(P_model.Attribute.NAME));
				}
				var prefix = "newAttr";
				var count = 0;
				while (true) {
					var name = prefix + count;
					if (nameSet.indexOf(name) == -1) {
						return name;
					}
					++count;
				}
			},

			__addAttr : function() {
				var clazz = this.__getRecordClass();
				var o = {};
				o[P_model.Attribute.NAME] = this.__newAttrName();
				o[P_model.Attribute.USER_TYPE] = this.__getAttrTypes()[0].VALUE;
				o[P_model.Attribute.NULLABLE] = true;
				var r = Utils.newRecord(clazz, o, this.getFields());
				this.getStore().add(r);
				this.selectRecord(r);
				this.focusRecord(r);
			},

			__delAttr : function() {
				var r = this.getSelection();
				if (r) {
					var store = this.getStore();
					var idx = store.indexOf(r);
					if (idx > -1) {
						if (idx == store.getCount() - 1) {
							--idx;
						}
						store.remove(r);
						if (idx > -1) {
							this.selectRow(idx);
							this.focusRow(idx);
						}
					}
				}
			},

			__upwardAttr : function() {

			},

			__downwardAttr : function() {

			},

			setAttrList : function(attrList) {
				this.setDataList(attrList);
			},

			getAttrList : function() {
				var os = [];
				var store = this.getStore();
				var fs = this.getFields();
				for (var i = 0, len = store.getCount(); i < len; ++i) {
					var r = store.getAt(i);
					var o = {};
					for (var j = 0; j < fs.length; ++j) {
						var key = fs[j];
						var v = r.get(key);
						if (v != null) {
							o[key] = v;
						}
					}
					os.push(o);
				}
				P_model.AttrType.setType(os);
				return os;
			},

			validate : function(o) {
				return true;
			},

			getXType : function() {
				return P_model.AttrGrid.XTYPE;
			}
		});
P_model.AttrGrid.XTYPE = "P_model.AttrGrid";

P_model.DataGrid = Ext.extend(common.BasicGrid, {
	constructor : function() {
		P_model.DataGrid.superclass.constructor.call(this);
		P_model.pipe.on(P_model.Event.METADATA_IMPORTED, this.__onImported,
				this);
		this.data = null;
		this.importMgr = P_model.DataImportMgr.getInstance();
		this.pageBar = new common.PageBar({
					pageCountData : [[10, 10], [20, 20], [50, 50], [200, 200],
							[500, 500], [1000, 1000]],
					pageCount : 20
				});
		this.filterBar = new common.FilterBar();
		this.pageBar.on(common.PageEvent.PAGING, this.__onPaging, this);
		this.filterBar
				.on(common.FilterEvent.DO_FILTER, this.__onDoFilter, this);
	},

	clear : function() {
		this.clearData();
		P_model.pipe.un(P_model.Event.METADATA_IMPORTED, this.__onImported,
				this);
	},

	__onImported : function(o) {
		var f = P_basic.Utils.getRDN;
		if (o && f(o) == f(this.data.MODEL)) {
			this.refresh();
		}
	},

	reInitGrid : function(data) {
		this.data = data;
		var attrList = data.ATTR_LIST;
		var keys = [P_model.MetaData.UUID, P_model.MetaData.ENV];
		var nameMap = {};
		nameMap[P_model.MetaData.UUID] = P_model.Res.uuid;
		nameMap[P_model.MetaData.ENV] = P_model.Res.env;
		for (var i = 0; i < attrList.length; ++i) {
			var attr = attrList[i];
			if (P_model.AttrType.isBasicAttr(attr)) {
				var key = attr[P_model.Attribute.NAME];
				nameMap[key] = P_basic.Utils.getNameText(attr);
				keys.push(key);
			}
		}
		var cols = [];
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			cols.push({
						header : nameMap[key],
						dataIndex : key,
						sortable : false,
						renderer : this.__renderer,
						scope : this
					});
		}
		this.gridFields = keys;
		this.gridFields.push(P_model.MetaData.ID);
		this.gridFields.push(P_model.MetaData.RDN);
		var cm = P_model.DataGrid.superclass.createColumnModel.call(this, cols);
		var store = this.createDataStore();
		this.grid.reconfigure(store, cm);
		this.filterBar.reset();
		this.__updateUI();
		this.refresh();
	},

	__updateUI : function() {
		var disabled = (this.data == null);
		this.addBtn.setDisabled(disabled);
		this.importBtn.setDisabled(disabled);
		this.exportBtn.setDisabled(disabled);
	},

	createSM : function() {
		return new Ext.grid.RowSelectionModel({
					singleSelect : false
				});
	},

	__renderer : function(value, metaData, record, rowIndex, colIndex, store) {
		switch (colIndex) {
			case 1 :
				return P_model.getEnvName(value);
		}
		return value;
	},

	__onPaging : function() {
		this.loadData();
	},

	__onDoFilter : function() {
		this.refresh();
	},

	refresh : function() {
		this.pageBar.reset(true);
		this.loadData();
	},

	createColumnModel : function() {
		var cols = [];
		return P_model.DataGrid.superclass.createColumnModel.call(this, cols);
	},

	createGrid : function(config) {
		var grid = P_model.DataGrid.superclass.createGrid.call(this, Ext.apply(
						{
							columnLines : true,
							tbar : this.__createTBar(),
							bbar : this.__createBBar()
						}, config || {}));
		grid.on("rowdblclick", this.__onRowDblClick, this);
		this.__updateUI();
		return grid;
	},

	__onRowDblClick : function() {
		this.__reqEditData();
	},

	__createTBar : function() {
		this.addBtn = common.ToolItem.createAdd({
					handler : this.__reqAddData,
					scope : this
				});
		var editBtn = common.ToolItem.createEdit({
					disabled : true,
					handler : this.__reqEditData,
					scope : this
				});
		var delBtn = common.ToolItem.createDelete({
					disabled : true,
					handler : this.__reqDeleteData,
					scope : this
				});
		this.importBtn = common.ToolItem.createImport({
					handler : this.__reqImport,
					scope : this
				});
		this.exportBtn = common.ToolItem.createExport({
					handler : this.__reqExport,
					scope : this
				});
		this.addToSingleSel(editBtn);
		this.addToSel(delBtn);
		return [this.addBtn, editBtn, delBtn, "-", this.exportBtn,
				this.importBtn, "->"].concat(this.filterBar.createItems());
	},

	__createBBar : function() {
		var items = this.pageBar.createItems({
					refresh : false
				});
		items.unshift("->");
		return items;
	},

	loadData : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data.MODEL);
		params[ds.Common.START] = this.pageBar.getStart();
		params[ds.Common.COUNT] = this.pageBar.getPageCount();
		params[ds.Common.CONTENT] = this.filterBar.getValue();
		P_main.sysReq(P_model.WebAction.LIST_METADATA, params,
				this.__onDataLoaded, this);
	},

	__onDataLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.setDataList(o[ds.Common.DATA_LIST]);
			this.pageBar.setTotalCount(o[ds.Common.TOTAL_COUNT]);
		} else {
			this.clearData();
			this.pageBar.setTotalCount(0);
		}
	},

	__reqAddData : function() {
		var data = {
			MODEL_RDN : P_basic.Utils.getRDN(this.data.MODEL)
		};
		P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
				P_model.DataEditorMgr.XTYPE, data);
	},

	__reqEditData : function() {
		var r = this.getSelection();
		if (r) {
			var data = {
				MODEL_RDN : P_basic.Utils.getRDN(this.data.MODEL)
			};
			P_basic.Utils.setRDN(data, r);
			P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
					P_model.DataEditorMgr.XTYPE, data);
		}
	},

	__reqDeleteData : function() {
		var rs = this.getSelections();
		var RDNList = [];
		for (var i = 0; i < rs.length; ++i) {
			RDNList.push(P_basic.Utils.getRDN(rs[i]));
		}
		if (RDNList.length > 0) {
			P_basic.Utils.deleteConfirm(P_model.Res.dataRemoveConfirm, RDNList
							.join(P_model.Env.SEP),
					P_model.WebAction.REMOVE_METADATA, this.__onDataRemoved,
					this);
		}
	},

	__onDataRemoved : function(res) {
		if (P_main.Service.parseResult(res)) {
			this.refresh();
		}
	},

	__reqExport : function() {
		if (!this.downloadForm) {
			this.downloadForm = P_main.createDownloadForm();
		}
		var params = {};
		P_basic.Utils.setRDN(params, this.data.MODEL);
		this.downloadForm.submit(P_model.WebAction.EXPORT_METADATA, params);
	},

	__reqImport : function() {
		var data = {};
		P_basic.Utils.setRDN(data, this.data.MODEL);
		this.importMgr.setData(data);
		this.importMgr.reqAdd();
	},

	getXType : function() {
		return P_model.DataGrid.XTYPE;
	}
});
P_model.DataGrid.XTYPE = "P_model.DataGrid";

P_model.DataImportMgr = Ext.extend(P_basic.UploadFormMgr, {
			constructor : function() {
				P_model.DataImportMgr.superclass.constructor.call(this);
			},

			__getSubmitConfig : function() {
				var callbackParams = {};
				P_basic.Utils.setRDN(callbackParams, this.data);
				return {
					func : P_model.WebAction.IMPORT_METADATA,
					params : {
						CALLBACK : "window.parent.P_model.afterUpload",
						CALLBACK_PARAMS : callbackParams
					}
				};
			},

			getXType : function() {
				return P_model.DataImportMgr.XTYPE;
			}
		});
P_model.DataImportMgr.XTYPE = "P_model.DataImportMgr";
Utils.addInstanceFunc(P_model.DataImportMgr);

P_model.DataEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_model.DataEditorMgr.superclass.constructor.call(this);
		P_model.pipe.reg(P_model.Event.METADATA_ADDED, this);
		P_model.pipe.reg(P_model.Event.METADATA_UPDATED, this);
		this.metaData = null;
		this.mgrs = this.__createMgrs();
	},

	clear : function() {
		for (var i = 0; i < this.mgrs.length; ++i) {
			this.mgrs[i].clear();
		}
		this.mgrs.splice(0, this.mgrs.length);
	},

	checkClose : function() {
		for (var i = 0; i < this.mgrs.length; ++i) {
			if (!this.mgrs[i].checkClose()) {
				return false;
			}
		}
		return true;
	},

	__createMgrs : function() {
		var mgrs = [new P_model.DataAttrInputMgr(), new P_model.DataJobTabMgr()];
		for (var i = 0; i < mgrs.length; ++i) {
			mgrs[i].setOwner(this);
		}
		return mgrs;
	},

	__createContent : function() {
		return new Ext.TabPanel({
					title : P_model.Res.unTitled,
					iconCls : P_model.Env.dataIconCls,
					closable : true,
					tbar : this.__createTBar()
				});
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
		return [saveBtn, this.refreshBtn];
	},

	__updateUI : function() {
		this.content.setTitle(this.data[P_model.MetaData.UUID]);
		this.refreshBtn.setDisabled(this.isNew());
		for (var i = 0; i < this.mgrs.length; ++i) {
			this.mgrs[i].setData(this.data);
		}
	},

	createData : function() {
		var o = Ext.apply({}, this.data);
		for (var i = 0; i < this.mgrs.length; ++i) {
			this.mgrs[i].populateData(o);
		}
		return o;
	},

	save : function() {
		var params = this.createData();
		if (!this.validate(params)) {
			return;
		}
		if (this.isNew()) {
			P_main.sysReq(P_model.WebAction.ADD_METADATA, params,
					this.__onDataAdded, this);
		} else {
			P_main.sysReq(P_model.WebAction.UPDATE_METADATA, params,
					this.__onDataUpdated, this);
		}
	},

	__onDataAdded : function(res) {
		this.__onDataSaved(res, P_model.Event.METADATA_ADDED);
	},

	__onDataUpdated : function(res) {
		this.__onDataSaved(res, P_model.Event.METADATA_UPDATED);
	},

	__onDataSaved : function(res, evt) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.__updateUI();
			this.fireEvent(evt, o);
		}
	},

	validate : function(o) {
		return true;
	},

	refresh : function() {
		this.__loadData();
	},

	getMetaData : function() {
		return this.metaData;
	},

	isNew : function() {
		return P_basic.Utils.getRDN(this.data) == null;
	},

	postInit : function() {
		this.__loadMetaData();
	},

	__loadMetaData : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data.MODEL_RDN);
		P_main.sysReq(P_model.WebAction.GET_MODEL, params,
				this.__onMetaDataLoaded, this);
	},

	__onMetaDataLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			P_model.AttrType.setUserType(o.ATTR_LIST);
			this.metaData = o;
			var items = [];
			for (var i = 0; i < this.mgrs.length; ++i) {
				items.push(this.mgrs[i].getContent());
				this.mgrs[i].postInit();
			}
			this.content.add(items);
			this.content.activate(items[0]);
			if (!this.isNew()) {
				this.__loadData();
			}
		}
	},

	__loadData : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data);
		P_main.sysReq(P_model.WebAction.GET_METADATA, params,
				this.__onDataLoaded, this);
	},

	__onDataLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.__updateUI();
		}
	},

	getXType : function() {
		return P_model.DataEditorMgr.XTYPE;
	}
});
P_model.DataEditorMgr.XTYPE = "P_model.DataEditorMgr";

P_model.InputMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_model.InputMgr.superclass.constructor.call(this);
				this.owner = null;
			},

			checkClose : function() {
				return true;
			},

			clear : function() {
			},

			populateData : function(data) {
			},

			postInit : function() {
			},

			setOwner : function(owner) {
				this.owner = owner;
			},

			getMetaData : function() {
				return this.owner.getMetaData();
			},

			setData : function(data) {
			},

			getData : function() {
				return null;
			},

			__createContent : function() {
				return null;
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.__createContent();
				}
				return this.content;
			},

			getXType : function() {
				return P_model.InputMgr.XTYPE;
			}
		});
P_model.InputMgr.XTYPE = "P_model.InputMgr";

P_model.DataAttrInputMgr = Ext.extend(P_model.InputMgr, {
	constructor : function() {
		P_model.DataAttrInputMgr.superclass.constructor.call(this);
		this.labelWidth = 120;
	},

	populateData : function(data) {
		Utils.getValueFromGui(data, this.keys, this.formKeys);
	},

	setData : function(data) {
		Utils.setValueToGui(data, this.keys, this.formKeys);
		var envName = P_model.getEnvName(this.envCombo.getValue())
		if (!envName) {
			this.envCombo.setValue(null);
		}
	},

	__createComps : function() {
		var prefix = "data" + Utils.getId();
		this.keys = {
			uuid : prefix + "uuid",
			env : prefix + "env"
		};

		this.formKeys = {};
		this.formKeys[this.keys.uuid] = P_model.MetaData.UUID;
		this.formKeys[this.keys.env] = P_model.MetaData.ENV;

		var metaData = this.getMetaData();
		var data = [];
		var envs = P_main.LocalCache.getInstance()
				.getFromCache(P_model.Env.CACHE_ENVS);
		for (var i = 0; i < envs.length; ++i) {
			var env = envs[i];
			data.push([env[P_basic.ModelBase.NAME], P_basic.Utils.getRDN(env)]);
		}
		this.envCombo = GuiUtil.createComboBox({
					id : this.keys.env,
					fieldLabel : P_model.Res.env,
					store : new Ext.data.SimpleStore({
								fields : ["name", "value"],
								data : data
							})
				});
		var items = [{
					fieldLabel : P_model.Res.classPath,
					readOnly : true,
					value : metaData.MODEL[P_model.Model.FULL_CLASS]
				}, {
					id : this.keys.uuid,
					fieldLabel : P_model.Res.uuid
				}, this.envCombo];

		var attrList = metaData.ATTR_LIST;
		for (var i = 0; i < attrList.length; ++i) {
			var attr = attrList[i];
			var userType = attr[P_model.Attribute.USER_TYPE];
			if (P_model.AttrType.isBasicAttr(attr)) {
				var name = attr[P_model.Attribute.NAME];
				var key = prefix + name;
				this.keys[name] = key;
				this.formKeys[key] = name;
				items.push(this.__createComp(userType, key, P_basic.Utils
								.getNameText(attr)));
			}
		}
		return items;
	},

	__createComp : function(userType, id, label) {
		var o = P_model.AttrType;
		switch (userType) {
			case o.INT :
				return new Ext.form.NumberField({
							id : id,
							fieldLabel : label,
							allowDecimals : false
						});
			case o.FLOAT :
				return new Ext.form.NumberField({
							id : id,
							fieldLabel : label
						});
			case o.BOOLEAN :
				return new Ext.form.Checkbox({
							id : id,
							fieldLabel : label
						});
			case o.PASSWORD :
				return new Ext.form.TextField({
							id : id,
							fieldLabel : label,
							inputType : "password"
						});
			case o.STRING :
				return new Ext.form.TextField({
							id : id,
							fieldLabel : label
						});
			default :
				throw new Error("Unsupport type: " + userType);
		}
	},

	__createContent : function() {
		var content = GuiUtil.createForm({
					title : P_model.Res.attr,
					labelWidth : this.labelWidth,
					defaults : {},
					autoScroll : true,
					bodyStyle : {
						padding : "10px 0"
					},
					items : this.__createComps()
				});
		content.on("resize", this.__onResize, this);
		return content;
	},

	__onResize : function(p, w, h) {
		if (w > 0 && h > 0) {
			var items = this.content.items;
			var width = w - this.labelWidth - 50;
			for (var i = 0, len = items.getCount(); i < len; ++i) {
				items.get(i).setWidth(width);
			}
		}
	},

	getXType : function() {
		return P_model.DataAttrInputMgr.XTYPE;
	}
});
P_model.DataAttrInputMgr.XTYPE = "P_model.DataAttrInputMgr";

P_model.DataJobTabMgr = Ext.extend(P_model.InputMgr, {
			constructor : function() {
				P_model.DataJobTabMgr.superclass.constructor.call(this);
				this.mgrs = [];
			},

			checkClose : function() {
				for (var i = 0; i < this.mgrs.length; ++i) {
					if (!this.mgrs[i].checkClose()) {
						return false;
					}
				}
				return true;
			},

			clear : function() {
				for (var i = 0; i < this.mgrs.length; ++i) {
					this.mgrs[i].clear();
				}
				this.mgrs.splice(0, this.mgrs.length);
			},

			populateData : function(data) {
				Utils.getValueFromGui(data, this.keys, this.formKeys);
			},

			setData : function(data) {
				Utils.setValueToGui(data, this.keys, this.formKeys);
			},

			__createContent : function() {
				var prefix = Utils.getId()
				var attrList = this.getMetaData().ATTR_LIST;
				var items = [];
				this.keys = {};
				this.formKeys = {};
				for (var i = 0; i < attrList.length; ++i) {
					var attr = attrList[i];
					if (P_model.AttrType.isJobAttr(attr)) {
						var name = attr[P_model.Attribute.NAME];
						var key = prefix + name;
						this.keys[name] = key;
						this.formKeys[key] = name;
						var mgr = new P_model.DataJobInputMgr();
						this.mgrs.push(mgr);
						mgr.setOwner(this.owner);
						items.push(mgr.createContent(P_basic.Utils
										.getNameText(attr), key, name));
					}
				}
				return new Ext.TabPanel({
							title : P_model.Res.job,
							activeTab : 0,
							items : items
						});
			},

			getXType : function() {
				return P_model.DataJobTabMgr.XTYPE;
			}
		});
P_model.DataJobTabMgr.XTYPE = "P_model.DataJobTabMgr";

P_model.DataJobInputMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_model.DataJobInputMgr.superclass.constructor.call(this);
				this.debugMgr = new P_basic.DebugMgr({
							terminateAction : P_model.WebAction.TERMINATE_DEBUG
						});
				this.debugMgr.setOwner(this);
				this.owner = null;
			},

			checkClose : function() {
				if (this.debugMgr.isDebugging()) {
					Utils.error(P_basic.Res.closeOnDebugging);
					return false;
				}
				return true;
			},

			clear : function() {
				P_main.pipe.fireEvent(P_main.Event.CLOSE_DEBUG, this.debugMgr
								.getDebugKey());
			},

			setOwner : function(owner) {
				this.owner = owner;
			},

			getDebugMethod : function() {
				return P_model.WebAction.DEBUG_JOB;
			},

			getDebugParams : function() {
				var params = {
					KEY : this.attrName
				};
				var o = this.owner.createData();
				params[ds.Common.CONTENT] = Ext.encode(o);
				return params;
			},

			getDebugTitle : function() {
				return this.title;
			},

			createContent : function(title, id, attrName) {
				this.title = title;
				this.attrName = attrName
				return new Ext.Panel({
							title : title,
							layout : "fit",
							items : [{
										id : id,
										xtype : "textarea"
									}],
							tbar : this.debugMgr.createToolItems()
						});
			},

			getXType : function() {
				return P_model.DataJobInputMgr.XTYPE;
			}
		});
P_model.DataJobInputMgr.XTYPE = "P_model.DataJobInputMgr";