//view
//
/**
 * Created by GodzBin on 2016/3/15.
 */
Ext.onReady(function() {
	main.init();
});

var main = main || {};
main.view = {
	structure: {
		win: {},
		tree: {},
		menu: {},
		main_tab: {},
		debug_tab: {},
		store: {},
		toast: null
	},
	initValue: {
		dblclick_tree_nodeId: null,
		dblclick_tree_node: null,
		right_click_node: null
	},
	toast: function(text) {
		var toast = Ext.toast({
			html: text,
			title: "",
			width: 300,
			align: "t",
			border: false,
			// closable: true,
		});
		setTimeout(function() {
			toast.close(100);
		}, 1000);
	},
	createInterface: function() {
		this.initQuickTipManager();
		this.createMenu();
		this.createDebugTab();
		this.createMainTab();
		this.createStore();
		this.createTree();
		this.createWin();
		this.createRightClickMenu();
		this.initOncontextmenu();
	},
	initOncontextmenu: function() {
		//重写右键方法
		var tree = document.getElementsByClassName("x-tree-view")[0];
		tree.oncontextmenu = function(e) {
			e.preventDefault();
		};
	},
	initQuickTipManager: function() {
		//初始化菜单
		Ext.tip.QuickTipManager.init();
	},
	createMenu: function() {
		this.structure.menu = Ext.create("Ext.toolbar.Toolbar", {
			region: "north",
			plain: true,
			height: 30,
			floating: false,
			layout: 'hbox',
			border: 0,
			padding: 0,
			style: "background:#3892D4;color:#fff",
			items: [{
				text: configs.TOP_TOOL.FILE,
				style: "background:#3892D4;color:#fff",
				border: 0,
			}, {
				text: configs.TOP_TOOL.EDIT,
				style: "background:#3892D4;color:#fff",
				border: 0,

			}]
		});
	},
	createDebugTab: function() {
		this.structure.debug_tab = Ext.create("Ext.tab.Panel", {
			id: "debug_tab",
			region: "south",
			cls: "ui-tab-bar",
			height: 250,
			layout: 'fit',
			renderTo: document.body,
			border: 0,
			items: [],
			split: true
		});
	},
	createMainTab: function() {
		this.structure.main_tab = Ext.create('Ext.tab.Panel', {
			tabBar: {
				width: 100
			},
			id: "main_tab",
			region: "center",
			cls: "ui-tab-bar",
			height: 500,
			border: 0,
			// items: [],
			layout: 'fit',
		});
	},
	createStore: function() {
		this.structure.store = Ext.create("Ext.data.TreeStore", {
			storeId: "EnvTree",
			root: {
				expanded: true,
				id: 0,

				// children: [{
				// 		text: configs.TREE_TEXT.Package,
				// 		id: "Package",
				// 		CLASS: configs.TREE_CLASS.Package,
				// 		iconCls: "i_env",
				// 		leaf: false,
				// 		children: []
				// 	}
					// , {
					// 	text: configs.TREE_TEXT.ENV,
					// 	CLASS: configs.TREE_CLASS.ENV,
					// 	iconCls: "i_env",
					// 	leaf: false,
					// 	children: []
					// }, {
					// 	text: configs.TREE_TEXT.Schedule,
					// 	CLASS: configs.TREE_CLASS.Schedule,
					// 	iconCls: "i_schdule",
					// 	leaf: true,
					// 	_NAME: configs.TREE_TEXT.Schedule,
					// }
				// ]
			}
		});
	},
	createTree: function() {
		this.structure.tree = Ext.create("Ext.tree.Panel", {
			region: "west",
			width: 200,
			border: 0,
			store: this.structure.store,
			rootVisible: false,
			split: true,
			listeners: {
				contextmenu: {
					element: "body",
					fn: main.Tree.right_click_menu_show
				},
				dblclick: {
					element: "body",
					fn: main.Tree.dblclick_tree
				},
				itemexpand: main.Tree.treeExpand
			}
		});
	},
	createWin: function() {
		this.structure.win = Ext.create('Ext.container.Viewport', {
			layout: "border",
			items: [
				// this.structure.menu,
				this.structure.tree,
				this.structure.main_tab,
				this.structure.debug_tab
			]
		}).show();
	},
	createRightClickMenu: function() {
		this.structure.right_click_menu = Ext.create("Ext.menu.Menu", {
			plain: true,
			width: 100,
			renderTo: Ext.getBody(),
			items: [{
				text: configs.RIGHT_CLICK_MENU.ADD_PACKAGE,
				iconCls: "a_add",
				handler: main.Tree.addPackageWinShow
			}, {
				text: configs.RIGHT_CLICK_MENU.ADD_MODEL,
				iconCls: "a_add",
				handler: main.Tree.Model.addModel
			}, {
				text: configs.RIGHT_CLICK_MENU.ADD,
				iconCls: 'a_add',
				handler: main.Tree.addTreeNodeWinShow
			}, {
				text: configs.RIGHT_CLICK_MENU.EDIT,
				iconCls: "a_update",
				handler: main.Tree.updateTreeNodeWinShow
			}, {
				text: configs.RIGHT_CLICK_MENU.DELETE,
				iconCls: "a_delete",
				handler: main.Tree.deleteTreeNode
			}, {
				text: configs.RIGHT_CLICK_MENU.ADD_FIELD,
				type: "ADD_FIELD",
				iconCls: "a_add",
				handler: main.Tree.editFieldWinShow
			}, {
				text: configs.RIGHT_CLICK_MENU.UPDATE_FIELD,
				type: "UPDATE_FIELD",
				iconCls: "a_update",
				handler: main.Tree.editFieldWinShow
			}, {
				text: configs.RIGHT_CLICK_MENU.REFRESH,
				iconCls: "a_refresh",
				handler: main.Tree.reFreshTree
			}, {
				text: configs.RIGHT_CLICK_MENU.DELETE,
				type: "REMOVER_FIELD",
				iconCls: "a_delete",
				handler: main.Tree.removerFieldWinShow
			}]
		});
	},
};
// 树--------------------------------------
main.view.Tree = {
	//右键菜单显示
	addTreeWin: null,
	updateTreeWin: null,
	addTreeNodeText: "addTreeNodeText",
	updateTreeNodeText: "updateTreeNodeText",
	createAddTreeNodeWin: function() {
		this.addTreeWin = Ext.create("Ext.window.Window", {
			width: 300,
			// height: 150,
			modal: false,
			title: "新增环境",
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			items: [new Ext.form.Panel({
				items: [{
					xtype: "textfield",
					fieldLabel: "名称",
					labelAlign: "right",
					labelWidth: 50,
					margin: 5,
					id: this.addTreeNodeText,
					name: this.addTreeNodeText,
					width: 150,
					anchor: "100%"
				}]
			})],
			buttons: [{
				text: "确定",
				handler: main.Tree.addTreeNode
			}, {
				text: "取消",
				handler: main.Tree.addTreeNodeWinHide
			}]
		});
	},
	createUpdateTreeNodeWin: function() {
		this.updateTreeWin = Ext.create("Ext.window.Window", {
			width: 300,
			// height: 150,
			title: "请修改节点名称",
			modal: false,
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false, //是否可以调整大小
			items: [{
				xtype: "fieldset",
				collapsible: false,
				defaults: {
					anchor: '100%'
				},
				layout: 'fit',
				border: 0,
				items: [{
					xtype: "textfield",
					id: this.updateTreeNodeText,
					name: this.updateTreeNodeText,
					fieldLabel: "节点名称",
					labelWidth: 80,
					margin: 5
				}]
			}],
			buttons: [{
				text: "确定",
				handler: main.Tree.updateTreeNode
			}, {
				text: "取消",
				handler: main.Tree.updateTreeNodeWinHide
			}]
		});
	},
	createAddPackageWin: function() {
		Ext.create("Ext.window.Window", {
			id: configs.WIN_NAME.ADD_PACKAGE_WIN,
			title: configs.WIN_TITLE.ADD_PACKAGE,
			closable: true,
			closeAction: "hide",
			modal: false,
			width: 400,
			draggable: true,
			resizable: false, //是否可以调整大小
			items: new Ext.form.Panel({
				id: configs.FORM_NAME.ADD_PACKAGE_FORM,
				items: [{
					fieldLabel: configs.PACKAGE_TEXT._NAME,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._NAME,
					anchor: "100%",
					margin: 5,
				}, {
					fieldLabel: configs.PACKAGE_TEXT._LABEL,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._LABEL,
					anchor: "100%",
					margin: 5,
				}]
			}),
			listeners: {
				close: main.Tree.addPackageWinHide
			},
			buttons: [{
				text: configs.BUTTON_TEXT.OK,
				handler: main.Tree.addPackage
			}, {
				text: configs.BUTTON_TEXT.UNDO,
				handler: main.Tree.addPackageWinHide
			}]
		});
	},
	createUpdatePackageWin: function() {
		Ext.create("Ext.window.Window", {
			id: configs.WIN_NAME.UPDATE_PACKAGE_WIN,
			title: configs.WIN_TITLE.UPDATE_PACKAGE,
			closable: true,
			closeAction: "hide",
			modal: false,
			width: 400,
			draggable: true,
			resizable: false, //是否可以调整大小
			items: new Ext.form.Panel({
				id: configs.FORM_NAME.UPDATE_PACKAGE_FORM,
				items: [{
					fieldLabel: configs.PACKAGE_TEXT._NAME,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._NAME,
					anchor: "100%",
					margin: 5,
				}, {
					fieldLabel: configs.PACKAGE_TEXT._LABEL,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._LABEL,
					anchor: "100%",
					margin: 5,
				}]
			}),
			listeners: {
				close: main.Tree.addPackageWinHide
			},
			buttons: [{
				text: configs.BUTTON_TEXT.OK,
				handler: main.Tree.updatePackage
			}, {
				text: configs.BUTTON_TEXT.UNDO,
				handler: main.Tree.updatePackageWinHide
			}]
		});
	},
	createDeletePackageWin: function() {
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该节点吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					main.Tree.deletePackage();
					return;
				} else {
					return;
				}
			}
		});
	},
	createDeleteFieldWin: function() {
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要删除该域吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					main.Tree.removerField();
					return;
				} else {
					return;
				}
			}
		});
	},
	createEditFieldWin: function() {
		Ext.create("Ext.window.Window", {
			id: configs.WIN_NAME.EDIT_FIELD_WIN,
			title: configs.WIN_TITLE.EDIT_FIELD,
			closable: true,
			closeAction: "hide",
			modal: false,
			width: 400,
			draggable: true,
			resizable: false, //是否可以调整大小
			items: [new Ext.form.Panel({
				id: configs.FORM_NAME.EDIT_FIELD_FORM,
				items: [{
					xtype: "hiddenfield",
					name: "_ID"
				}, {
					xtype: "hiddenfield",
					name: "RDN"
				}, {
					fieldLabel: configs.PACKAGE_TEXT._NAME,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._NAME,
					anchor: "100%",
					margin: 5,
				}, {
					fieldLabel: configs.PACKAGE_TEXT._LABEL,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.PACKAGE_TREE._LABEL,
					anchor: "100%",
					margin: 5,
				}]
			})],
			listeners: {
				close: main.Tree.addPackageWinHide
			},
			buttons: [{
				text: configs.BUTTON_TEXT.OK,
				handler: main.Tree.editField
			}, {
				text: configs.BUTTON_TEXT.UNDO,
				handler: main.Tree.editFieldWinHide
			}]
		});
	},
	//  建模--------------------------------------------------
	Model: {
		modelDataPageBars: {},
		createAddModelPanel: function(edi) {
			var tabPanel = Ext.create("Ext.tab.Panel", {
				border: 0,
				layout: "fit",
				style: {
					borderStyle: "none"
				},
				cls: "ui-tab-bar",
				items: [this.TabByModelToData(edi),
					this.TabByModelToAttr(edi),
					this.TabByModelToDesc(edi)
				]
			});
			main.Editor.setEditorContent(tabPanel);
			tabPanel.setActiveTab(edi.id + "Attr");
			tabPanel.setActiveTab(edi.id + "Data");
			tabPanel.setActiveTab(edi.id + "Desc");
			if (edi["CLASS"] == configs.TREE_CLASS.ADD_MODEL) {
				tabPanel.setActiveTab(edi.id + "Attr");
			} else {
				tabPanel.setActiveTab(edi.id + "Data");
			}
		},
		createAttrTypeStore: function() {
			Ext.create("Ext.data.Store", {
				storeId: configs.STORE_NAME.ATTR_TYPE_STORE,
				fields: ['NAME', 'VLAUE', '_EXTENSION'],
			});
		},
		TabByModelToData: function(edi) {
			var tab = {
				id: edi.id + "Data",
				border: 0,
				title: "数据",
				layout: 'fit',
				items: [this.TabByModelToDataGrid(edi)]
			};
			return tab;
		},
		TabByModelToDataGrid: function(edi) {
			this.modelDataPageBars[edi.id + "dataGridPageBar"] = Ext.create("common.page.PageBar", {
				id: edi.id + "dataGridPageBar",
				listeners: {
					PAGING: main.Tree.Model.modelDataPageChange
				}
			});

			var grid = Ext.create("Ext.grid.Panel", {
				id: edi.id + "dataGrid",
				border: 0,

				multiSelect: true,
				store: Ext.create("Ext.data.Store", {
					id: edi.id + "dataStore",
					field: []
				}),
				tbar: [{
					iconCls: "a_add",
					handler: main.Tree.Model.addModeData
				}, {
					iconCls: "a_delete",
					handler: main.Tree.Model.deleteModeData
				}, {
					iconCls: "a_update",
					handler: main.Tree.Model.updateModelData
				}, {
					iconCls: "a_refresh",
					handler: main.Tree.Model.refreshModeData
				}, {
					iconCls: "i_schdule",
					text: "调度设置",
					handler: main.Tree.Model.addSchduleToJobClick
				}, "->", {
					xtype: "textfield",
					id: edi.id + "dataGridSearch",
					name: "search",
					listeners: {
						specialKey: function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) { //响应回车  
								main.Tree.Model.searchModeData();
							}
						}
					}
				}, {
					iconCls: "a_search",
					text: "搜索",
					handler: main.Tree.Model.searchModeData
				}, this.modelDataPageBars[edi.id + "dataGridPageBar"].createToolbar()],
				columns: [],
				forceFit: true,
				renderTo: Ext.getBody(),
			});
			return grid;
		},
		// 调度设置窗口
		addSchduleToJobWin: function(list) {
			Ext.create("Ext.window.Window", {
				id: "addSchduleToJob",
				title: "调度设置",
				closable: true,
				closeAction: "destroy",
				draggable: true,
				resizable: false, //是否可以调整大小
				defaults: {
					labelAlign: "right",
					anchor: "100%",
					labelWidth: 80,
					margin: 10,
					width: 400,
				},
				items: [{
					xtype: "hiddenfield",
					id: "addSchduleToJob_RDN",
					value: list,
				}, {
					xtype: "datefield",
					fieldLabel: '初始时间',
					name: '_SCH_TIME',
					id: "addSchduleToJob_SCH_TIME",
					format: 'Y-m-d H:i:s',
					value: new Date(),
					listeners: {
						change: main.Tree.Model.getSCH_TIME_USER
					}
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["NAME", "VALUE"]
					}),
					editable: false,
					queryMode: 'local',
					displayField: 'NAME',
					valueField: "VALUE",
					id: "addSchduleToJob_JOB",
					fieldLabel: "作业",
					autoSelect: true,
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["NAME", "VALUE"]
					}),
					editable: false,
					queryMode: 'local',
					displayField: 'NAME',
					valueField: "VALUE",
					id: "addSchduleToJob_SCH",
					fieldLabel: "调度",
					autoSelect: true,
					listeners: {
						change: main.Tree.Model.getSCH_TIME_USER
					}
				}, {
					xtype: "combobox",
					store: Ext.create("Ext.data.Store", {
						fields: ["NAME", "VALUE"]
					}),
					editable: false,
					queryMode: 'local',
					displayField: 'NAME',
					valueField: "VALUE",
					id: "addSchduleToJob_SCH_TIME_USER",
					fieldLabel: "有效时间",
					autoSelect: true,
				}],
				buttons: [{
					text: "确定",
					handler: main.Tree.Model.addSchduleToJobSub
				}]
			}).show();
			main.Tree.Model.getJob();

			
		},
		TabByModelToAttr: function(edi) {
			var tab = {
				id: edi.id + "Attr",
				title: "模型",
				layout: 'anchor',
				border: 0,
				items: [this.TabByModelToModelForm(edi), this.TabByModelToModelGrid(edi)],
			};
			return tab;
		},
		TabByModelToModelForm: function(edi) {
			var form = Ext.create("Ext.form.Panel", {
				id: edi.id + "TypeForm",
				border: 0,
				height: 30,
				// anchor: "100% 20%",
				layout: "hbox",
				items: [{
					fieldLabel: configs.MODEL_TEXT._NAME,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.MODEL._NAME,
					anchor: "30%",
					margin: 5,
				}, {
					fieldLabel: configs.MODEL_TEXT._LABEL,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.MODEL._LABEL,
					anchor: "30%",
					margin: 5,
				}, {
					fieldLabel: configs.MODEL_TEXT.FULL_CLASS,
					xtype: "textfield",
					labelAlign: "right",
					labelWidth: 50,
					name: configs.MODEL.FULL_CLASS,
					anchor: "40%",
					margin: 5,
					readOnly: true,
				}]
			});
			return form;
		},
		TabByModelToModelGrid: function(edi) {
			var ATTR_LIST = configs.ATTR_LIST;
			var ATTR_LIST_TEXT = configs.ATTR_LIST_TEXT;
			var attrTypeStore = Ext.StoreMgr.get(configs.STORE_NAME.ATTR_TYPE_STORE);

			var grid = Ext.create("Ext.grid.Panel", {

				id: edi.id + "AttrGrid",
				border: 0,
				store: Ext.create("Ext.data.Store", {
					id: edi.id + "AttrStore",
					field: [ATTR_LIST._NAME,
						ATTR_LIST._LABEL,
						ATTR_LIST._TYPE,
						ATTR_LIST._NULLABLE,
						ATTR_LIST._DEFAULT_VALUE,
						ATTR_LIST._MIN_VALUE,
						ATTR_LIST._MAX_VALUE,
						ATTR_LIST._EXTENSION
					]
				}),
				tbar: [{
					iconCls: "a_add",
					handler: main.Tree.Model.addModelAttr
				}, {
					iconCls: "a_delete",
					handler: main.Tree.Model.deleteModelAttr
				}, {
					iconCls: "a_up",
					handler: main.Tree.Model.upModelAttr
				}, {
					iconCls: "a_down",
					handler: main.Tree.Model.downModelAttr
				}],
				selType: 'cellmodel',
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],

				columns: [{
					text: ATTR_LIST_TEXT._NAME,
					dataIndex: ATTR_LIST._NAME,
					editor: {
						xtype: 'textfield',
						// allowBlank: false
					}
				}, {
					text: ATTR_LIST_TEXT._LABEL,
					dataIndex: ATTR_LIST._LABEL,
					editor: {
						xtype: 'textfield',
						// allowBlank: false
					}
				}, {
					text: ATTR_LIST_TEXT._TYPE,
					dataIndex: ATTR_LIST._TYPE,
					editor: Ext.create("Ext.form.ComboBox", {
						store: attrTypeStore,
						editable: false,
						name: ATTR_LIST._TYPE,
						queryMode: 'local',
						displayField: 'NAME',
						valueField: "VALUE",
						triggerAction: "all",
						emptyText: "请选择..",
						allowBlank: false,
						blankText: "请选择类型",
						anchor: "100%",
						autoSelect: true,
						listeners: {
							change: function() {
								var value = this.getValue();
								var selects = grid.getSelection()
								if (selects.length) {
									var rec = selects[0];
									console.log(rec);
									if (value == 0) {
										rec.set("_MAX_VALUE", "1000");
									} else {
										rec.set("_MAX_VALUE", null);
									}
								}
							}
						}
					}),
					renderer: function(value, columns) {
						var rec = columns.record;
						rec.set("_TYPE", value);
						attrTypeStore.each(function(record) {
							if (record.get("VALUE") == value) {
								value = record.get("NAME");
							}
						});
						return value;
					}
				}, {
					text: ATTR_LIST_TEXT._NULLABLE,
					dataIndex: ATTR_LIST._NULLABLE,
					width: 50,
					renderer: function(value, record) {
						if (value) {
							record.tdStyle = "background: url('resources/images/check.png') no-repeat center;";
						} else {
							record.tdStyle = "background: url('resources/images/unchecked.png') no-repeat center;";
						}
						return;
					},
					listeners: {
						click: function(grid, el, rowIndex, colIndex) {
							var rec = grid.getStore().getAt(rowIndex);
							var _NULLABLE = rec.get("_NULLABLE");
							if (_NULLABLE) {
								rec.set("_NULLABLE", false);
							} else {
								rec.set("_NULLABLE", true);
							}
						}
					}
				}, {
					text: ATTR_LIST_TEXT._DEFAULT_VALUE,
					dataIndex: ATTR_LIST._DEFAULT_VALUE,
					editor: {
						xtype: 'textfield',
					}
				}, {
					text: ATTR_LIST_TEXT._MIN_VALUE,
					dataIndex: ATTR_LIST._MIN_VALUE,
					editor: {
						xtype: 'textfield',
					}
				}, {
					text: ATTR_LIST_TEXT._MAX_VALUE,
					dataIndex: ATTR_LIST._MAX_VALUE,
					editor: {
						xtype: 'textfield',
					}
				}],
				forceFit: true,
				renderTo: Ext.getBody(),
			});
			var panel = Ext.create('Ext.panel.Panel', {
				border: 0,
				anchor: "100% -30",
				layout: 'fit',
				items: [grid]
			});
			return panel;
		},
		TabByModelToDesc: function(edi) {
			var tab = {
				title: "描述",
				id: edi.id + "Desc",
				layout: "fit",
				border: 0,
				items: [this.TabByModelToDescForm(edi)]
			};
			return tab;
		},
		TabByModelToDescForm: function(edi) {
			var form = Ext.create("Ext.form.Panel", {
				id: edi.id + "DescForm",
				layout: "fit",
				border: 0,
				items: [{
					// fieldLabel: configs.MODEL_TEXT._DESC,
					xtype: "textareafield",
					labelAlign: "right",
					labelWidth: 50,
					height: 200,
					name: configs.MODEL._DESC,
					anchor: "100%",
					margin: 5,
				}]
			});
			return form;
		},
		removeModel: function(node) {
			Ext.Msg.show({
				title: "警告",
				modal: false,
				msg: "要删除该模型吗？",
				buttonText: {
					yes: "确定",
					no: "取消"
				},
				fn: function(btn) {
					if (btn === "yes") {
						main.Tree.removeModel(node);
						return;
					} else {
						return;
					}
				}
			});
			return false;
		},
		refreshModel: function(e) {
			Ext.Msg.show({
				title: "警告",
				modal: false,
				msg: "刷新将重置数据，是否继续",
				buttonText: {
					yes: "确定",
					no: "取消"
				},
				fn: function(btn) {
					if (btn === "yes") {
						main.Tree.Model.refreshModel();
						return;
					} else {
						return;
					}
				}
			});
			return false;
		},
		createAddModelDataPanel: function(edi) {
			var tabPanel = Ext.create("Ext.tab.Panel", {
				border: 0,
				layout: "fit",
				style: {
					borderStyle: "none"
				},
				cls: "ui-tab-bar",
				items: [this.TabByModelDataToType(edi),
					this.TabByModelDataToTypeJob(edi)
				]
			});
			main.Editor.setEditorContent(tabPanel);
		},
		TabByModelDataToType: function(edi) {
			var tab = {
				id: edi.id + "DataType",
				layout: "fit",
				border: 0,
				title: "属性",
				items: [this.TabByModelDataToTypeForm(edi)]
			};
			return tab;
		},
		TabByModelDataToTypeForm: function(edi) {
			var form = Ext.create("Ext.form.Panel", {
				id: edi.id + "ModelDataTypeForm",
				autoScroll: true,
				border: 0,
				items: []
			});
			main.Tree.Model.getTabByModelDataToTypeForm(edi);
			return form;
		},
		setTabByModelDataToTypeBaseForm: function(edi) {
			var form = Ext.getCmp(edi.id + "ModelDataTypeForm");
			var formItems = [{
				xtype: 'hiddenfield',
				name: 'FUNC',
			}, {
				xtype: 'hiddenfield',
				name: 'FUNC_PARAMS',
			}, {
				xtype: "hiddenfield",
				name: "REMOVE_ATTACHMENTS",
			}, {
				fieldLabel: "classPath",
				xtype: "textfield",
				labelAlign: "right",
				readOnly: true,
				labelWidth: 100,
				name: configs.MODEL_DATA.CLASS,
				anchor: "50%",
				margin: 5,
			}, {
				fieldLabel: configs.MODEL_DATA.UUID,
				xtype: "textfield",
				labelAlign: "right",
				labelWidth: 100,
				name: configs.MODEL_DATA.UUID,
				anchor: "50%",
				margin: 5,
			}, this.TabByModelDataToEnv()]
			form.add(formItems);
			console.log(edi);
			var params = {
				RDN: edi.data.data._PDN
			}
			main.model.Env.getModelDataToEnv(params);
		},
		setTabByModelDataToTypeForm: function(data, edi) {
			var form = Ext.getCmp(edi.id + "ModelDataTypeForm");
			// var store = Ext.StoreMgr.get(edi.data.id + "AttrStore");
			var storeItems = data;
			var formItems = [];
			for (var i = 0, l = storeItems.length; i < l; i++) {
				var ModelData = storeItems[i];
				var ModelDataType = ModelData["_TYPE"];
				var fieldLabel = ModelData["_LABEL"] || ModelData["_NAME"];
				var _EXTENSION = ModelData["_EXTENSION"];
				var formItme = null;
				if (ModelDataType === 1) {
					formItme = {
						fieldLabel: fieldLabel,
						xtype: "numberfield",
						dataType: ModelDataType,
						labelAlign: "right",
						labelWidth: 100,
						name: ModelData["_NAME"],
						anchor: "50%",
						allowDecimals: false,
						decimalPrecision: 0,
						margin: 5,
					};
					// formItems.push(formItme);
				} else if (ModelDataType === 2) {
					formItme = {
						fieldLabel: fieldLabel,
						xtype: "numberfield",
						dataType: ModelDataType,
						labelAlign: "right",
						labelWidth: 100,
						name: ModelData["_NAME"],
						anchor: "50%",
						margin: 5,
					};
					// formItems.push(formItme);
				} else if (ModelDataType === 3) {
					formItme = Ext.create("Ext.form.ComboBox", {
						fieldLabel: fieldLabel,
						autoSelect: true,
						queryMode: 'local',
						labelWidth: 100,
						name: ModelData["_NAME"],
						displayField: 'NAME',
						valueField: "VALUE",
						margin: 5,
						labelAlign: "right",
						anchor: "50%",
						value: true,
						dataType: ModelDataType,
						store: Ext.create("Ext.data.Store", {
							fields: ["VALUE", "NAME"],

							data: [{
								NAME: "true",
								VLAUE: true
							}, {
								NAME: "false",
								VALUE: false
							}]
						}),

					});
					// formItems.push(formItme);
				} else if (ModelDataType === 0 && _EXTENSION !== "JOB") {
					formItme = {
						fieldLabel: fieldLabel,
						xtype: "textareafield",
						labelAlign: "right",
						labelWidth: 100,
						name: ModelData["_NAME"],
						anchor: "50%",
						margin: 5,
						dataType: ModelDataType,
					};
				} else if (ModelDataType === 8) {
					formItme = new common.page.Filefield({
						fieldLabel: fieldLabel,
						name: ModelData["_NAME"],
						ModelData: ModelData,
					}).createFileField()
				}
				if (formItme) {
					formItems.push(formItme);
				}
			}
			form.add(formItems);
			main.view.Tree.Model.setTabByModelDataToTypeJobTab(data, edi);
		},
		TabByModelDataToEnvStore: function() {
			Ext.create("Ext.data.Store", {
				storeId: configs.STORE_NAME.ModelDataToEnv,
				fields: ["_ID", "_NAME"]
			});
			// main.model.Env.getModelDataToEnv();
		},
		TabByModelDataToEnv: function() {
			var store = Ext.StoreMgr.get(configs.STORE_NAME.ModelDataToEnv)
			var combobox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "ENV",
				autoSelect: true,
				store: store,
				name: configs.MODEL_DATA.ENV,
				queryMode: 'local',
				labelWidth: 100,
				displayField: '_NAME',
				valueField: "_NAME",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				margin: "5 5 10 5",
				labelAlign: "right",
				anchor: "50%",
			});
			return combobox;
		},
		TabByModelDataToTypeJob: function(edi) {
			var tab = Ext.create("Ext.tab.Panel", {
				id: edi.id + "DataJob",
				border: 0,
				cls: "ui-tab-bar",
				title: "作业",
				tabPosition: "bottom",
				items: []
			});
			// this.setTabByModelDataToTypeJobTab(edi);
			return tab;
		},
		setTabByModelDataToTypeJobTab: function(data, edi) {
			var mainTab = Ext.getCmp(edi.id + "DataJob");
			var storeItems = data;
			for (var i = 0, l = storeItems.length; i < l; i++) {
				var ModelData = storeItems[i];
				var ModelDataType = ModelData["_TYPE"];
				var ModelDataName = ModelData["_NAME"];
				var title = ModelData["_LABEL"] || ModelData["_NAME"];
				var _EXTENSION = ModelData["_EXTENSION"];
				if (ModelDataType == 0 && _EXTENSION == "JOB") {
					var tab = {
						border: 0,
						cls: "ui-tab-bar",
						layout: "fit",
						border: 0,
						title: title,
						items: [Ext.create("Ext.form.field.TextArea", {
							id: edi.id + ModelDataName,
							name: ModelDataName
						})],
						tbar: [{
							iconCls: "a_running",
							text: "调试",
							id: edi.id + ModelDataName + "debug",
							handler: function() {
								var panelId = edi.id + ModelDataName

								var time = Ext.getCmp(panelId + "jobTime").getRawValue();
								var SLAVE_RDN = Ext.getCmp(panelId + "jobSlave").getValue();
								var JOB_VALUE = Ext.getCmp(panelId).getValue();
								main.Tree.Model.debugToJob(time, SLAVE_RDN, JOB_VALUE, panelId);
							},
						}, {
							iconCls: "a_stop",
							text: "停止",
							disabled: true,
							id: edi.id + ModelDataName + "stopDebug",
							handler: function() {
								var panelId = edi.id + ModelDataName
								this.disable();
								var debug = Ext.getCmp(panelId + "debug");
								debug.enable();
								var tabId = panelId + "debugTab";
								main.debugTab.Debug.stopDebug(tabId, panelId);
							},
						}, {
							xtype: "datefield",
							fieldLabel: '时间',
							id: edi.id + ModelDataName + "jobTime",
							name: '_SCH_TIME_USER',
							format: 'Y-m-d H:i:s',
							labelAlign: "right",
							value: new Date(),
							labelWidth: 50,
						}, {
							xtype: "combobox",
							fieldLabel: "运行容器",
							id: edi.id + ModelDataName + "jobSlave",
							editable: false,
							autoSelect: true,
							store: Ext.StoreMgr.get(configs.STORE_NAME.SLAVE_STORE),
							queryMode: 'local',
							labelWidth: 80,
							displayField: 'NAME',
							valueField: "RDN",
							labelAlign: "right",
						}]
					};
					mainTab.add(tab);
				}
			}
			var tabs = mainTab.items.items;
			if (tabs.length > 0) {
				var a = mainTab.setActiveTab(tabs[0]);
			}
		},
		deleteModeData: function(params) {
			Ext.Msg.show({
				title: "警告",
				modal: false,
				msg: "确定要删除选中的数据吗？",
				buttonText: {
					yes: "确定",
					no: "取消"
				},
				fn: function(btn) {
					if (btn === "yes") {
						main.Tree.Model.removeModelDataSub(params);
						return;
					} else {
						return;
					}
				}
			});
		}
	}
};
// 编辑器-----------------------------------
main.view.Editor = {
	createEditor: function(edi, editorsIndex, index) {
		var layout, tbar;
		if (edi.CLASS === configs.TREE_CLASS.Schedule) {
			layout = "border";
		} else {
			layout = "fit";
		}
		if (edi.CLASS === configs.TREE_CLASS.ADD_MODEL || edi.CLASS === configs.TREE_CLASS.UPDATE_MODEL) {
			tbar = [{
				text: configs.TOOLS.ADD,
				handler: main.Tree.Model.updateModelSub
			}, {
				text: configs.TOOLS.REFRESH,
				handler: main.view.Tree.Model.refreshModel
			}]
		}
		if (edi.CLASS === configs.TREE_CLASS.ADD_MODEL_DATA || edi.CLASS === configs.TREE_CLASS.UPDATE_MODEL_DATA) {
			tbar = [{
				text: configs.TOOLS.ADD,
				handler: main.Tree.Model.updateModelDataSub
			}];
		}
		var editor = {
			id: "editor" + editorsIndex,
			closable: true,
			closeAction: "destroy",
			border: 0,
			title: edi["_NAME"],

			layout: layout,
			node: edi,
			index: editorsIndex,
			items: [],
			listeners: {
				beforeclose: main.view.Editor.beforeclose
			},
			tbar: tbar,
		};
		return editor;
	},

	beforeclose: function(e) {
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要关闭该窗口吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					main.Editor.closeEditor(e);
					return;
				} else {
					return;
				}
			}
		});
		return false;
	},
};
// 环境-------------------------------------
main.view.Env = {
	EnvGrid: null,
	searchId: "search",
	/**
	 * [setEnvList description]
	 * @param {array} data  EnvList
	 * @param {object} edi  setListToEdi
	 */
	setEnvList: function(data, edi) {
		var ediGridStore = Ext.create("Ext.data.Store", {
			storeId: "store" + edi["RDN"],
			fields: ["_NAME", "_TYPE", "_DESC", "_VALUE", "_RT_VALUE"],
			data: data
		});
		var handler = function() {
			var value = Ext.getCmp("search" + edi["RDN"]).getValue();
			ediGridStore.clearFilter();
			main.model.Env.refreshEnvList(edi["RDN"], ediGridStore);
			ediGridStore.filterBy(function(record, id) {
				value = value.toLowerCase();
				for (i in record["data"]) {
					if (record["data"][i] && ((record["data"][i]) + "").toLowerCase().indexOf(value) != -1) {
						return true;
					}
				}
				return false;
			});
			// Ext.getCmp("grid" + edi["RDN"]);
		}
		Ext.tip.QuickTipManager.init();
		var EnvGrid = Ext.create('Ext.grid.Panel', {
			id: "grid" + edi["RDN"],
			border: 0,
			store: Ext.data.StoreManager.lookup("store" + edi["RDN"]),
			columns: [{
				text: configs.ENV_NAME.TYPE,
				dataIndex: '_TYPE',
				align: "center",
				maxWidth: 100,
				renderer: main.Env.setEnvListRenderer,
			}, {
				text: configs.ENV_NAME.NAME,
				dataIndex: '_NAME',
			}, {
				text: configs.ENV_NAME.DESC,
				dataIndex: '_DESC',
			}, {
				text: configs.ENV_NAME.VALUE,
				dataIndex: '_VALUE',
				renderer: main.Env.setEnvListRenderer
			}, {
				text: configs.ENV_NAME._RT_VALUE,
				dataIndex: '_RT_VALUE'
			}],
			listeners: {
				dblclick: {
					element: "el",
					fn: main.Env.createUpdateEnvEdi
				}
			},
			tbar: [{
					text: '新增',
					iconCls: 'a_add',
					handler: main.Env.createAddEnvEdi
				}, {
					text: '删除',
					iconCls: 'a_delete',
					handler: main.Env.deleteAddEnvEdi
				}, {
					text: '刷新',
					iconCls: 'a_refresh',
					handler: main.Env.refreshGrid
				},
				"->", {
					xtype: "textfield",
					name: "search",
					id: "search" + edi["RDN"],
					listeners: {
						specialKey: function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) { //响应回车  
								handler();
							}
						}
					}
				}, {
					iconCls: "a_search",
					text: "搜索",
					handler: handler
				}
			],
			forceFit: true,
			renderTo: Ext.getBody()
		});
		main.Editor.setEditorContent(EnvGrid);
	},
	createForm: function(type, RDN, edi) {
		var mainTab = main.view.structure.main_tab;
		var parentEdi = mainTab.getActiveTab();
		var height = parentEdi.getHeight();
		var combobox = this.createCombobox();
		var form = Ext.create("Ext.form.Panel", {
			id: type + "form" + RDN,
			autoScroll: true,
			items: [combobox, {
					fieldLabel: configs.ENV_NAME.NAME,
					labelAlign: "right",
					labelWidth: 50,
					xtype: "textfield",
					name: "envName",
					anchor: "50%",
					margin: 5,
				}, {
					fieldLabel: configs.ENV_NAME.DESC,
					xtype: "textareafield",
					labelAlign: "right",
					labelWidth: 50,
					height: 50,
					name: "envDesc",
					anchor: "100%",
					margin: 5,
				},
				this.createAddEnvTab(type, RDN, edi)
			],
			dockedItems: {
				xtype: 'toolbar',
				dock: 'top',
				items: [{
					text: "保存",
					iconCls: "a_update",
					handler: function() {
						var form = this.up("form").getForm();
						var formValue = form.getValues();
						var testValue = Ext.getCmp(type + "EnvValue" + RDN).getValue();
						var _RT_VALUE = Ext.getCmp(type + "EnvRunTimeValue" + RDN).getValue();
						formValue["envRTValue"] = _RT_VALUE;
						formValue["envValue"] = testValue;
						main.Env.updateEnv(formValue, edi);
					}
				}, {
					text: "刷新",
					iconCls: "a_refresh",
					handler: main.view.Env.refreshForm
				}],
			}
		});
		return form;
	},
	createSlaveStore: function() {
		var Slave = configs.Slave;
		this.SlaveStore = Ext.create("Ext.data.Store", {
			storeId: "EnvDebugSlave",
			fields: [Slave._LABEL,
				Slave.RDN,
				Slave._HOST,
				Slave._PORT,
				Slave._STATUS,
				Slave._NAME, {
					name: "NAME",
					convert: function(value, record) {
						var value;
						var _LABEL = record.get(Slave._LABEL)
						var _NAME = record.get(Slave._NAME)
						if (_LABEL) {
							value = _LABEL + "(" + _NAME + ")";
						} else {
							value = _NAME;
						}
						return value;
					}
				}
			],
			data: []
		});
	},
	createAddEnvTab: function(type, RDN, edi) {
		var EnvValueSlave = Ext.create("Ext.form.ComboBox", {
			// xtype: "combobox",
			// id: RDN + "EnvValue" + "Slave",
			fieldLabel: "运行容器",
			editable: false,
			autoSelect: true,
			store: Ext.StoreMgr.get("EnvDebugSlave"),
			queryMode: 'local',
			labelWidth: 80,
			displayField: 'NAME',
			valueField: "RDN",
			value: 0,
			labelAlign: "right",
		});
		var EnvRunTimeValueSlave = Ext.create("Ext.form.ComboBox", {
			// xtype: "combobox",
			fieldLabel: "运行容器",
			// id: "EnvRunTimeValue" + RDN + "Slave",
			editable: false,
			autoSelect: true,
			store: Ext.StoreMgr.get("EnvDebugSlave"),
			queryMode: 'local',
			labelWidth: 80,
			displayField: 'NAME',
			valueField: "RDN",
			value: 0,
			labelAlign: "right",
		});
		var tab = Ext.create("Ext.tab.Panel", {
			border: 0,
			margin: "0 5 0 5",
			plain: true,
			items: [{
				border: 0,
				cls: "ui-tab-bar",
				layout: "fit",
				border: 0,
				title: "测试值",
				items: [Ext.create("Ext.form.field.TextArea", {
					// name: configs.ENV_NAME.VALUE,
					id: type + "EnvValue" + RDN,
					labelAlign: "right",
					labelWidth: 50,
					name: "envValue",
					height: 200,
					// allowBlank: false,
					anchor: "100%",

				})],
				//  调试 与 停止调试
				tbar: [{
					text: "调试",
					iconCls: "a_running",
					id: RDN + "EnvValue" + "debug",
					handler: function() {
						var valueType = "EnvValue"

						var text = Ext.getCmp(type + valueType + RDN);
						var value = text.getValue();

						var slave = EnvValueSlave;
						var slaveValue = slave.getValue();


						var debugId = RDN + valueType;
						main.Env.debuging(value, valueType, edi, debugId, slaveValue);
					}
				}, {
					text: "停止",
					iconCls: "a_stop",
					id: RDN + "EnvValue" + "stopDebug",
					disabled: true,
					handler: function() {
						this.disable();
						var valueType = "EnvValue";
						var debug = Ext.getCmp(RDN + valueType + "debug");
						debug.enable();

						var debugId = RDN + valueType;
						var tabId = "debuging" + edi.RDN + type;
						main.debugTab.Debug.stopDebug(tabId, debugId);
					}
				}, EnvValueSlave]
			}, {
				border: 0,
				cls: "ui-tab-bar",
				layout: "fit",
				border: 0,
				title: "运行时值",
				items: [Ext.create("Ext.form.field.TextArea", {
					// name: configs.ENV_NAME._RT_VALUE,
					id: type + "EnvRunTimeValue" + RDN,
					labelAlign: "right",
					labelWidth: 50,
					name: "EnvRunTimeValue",
					height: 200,
					// allowBlank: false,
					anchor: "100%",

				})],
				tbar: [{
					text: "调试",
					iconCls: "a_running",
					id: RDN + "EnvRunTimeValue" + "debug",
					handler: function() {
						var textType = "EnvRunTimeValue";
						this.disable();
						var stop = Ext.getCmp(RDN + textType + "stopDebug");
						stop.enable();
						var text = Ext.getCmp(type + textType + RDN);
						var value = text.getValue();

						var slave = EnvRunTimeValueSlave;
						var slaveValue = slave.getValue();


						var debugId = RDN + textType;
						main.Env.debuging(value, textType, edi, debugId, slaveValue);
					}
				}, {
					text: "停止",
					iconCls: "a_stop",
					id: RDN + "EnvRunTimeValue" + "stopDebug",
					disabled: true,
					handler: function() {

						var textType = "EnvRunTimeValue";
						this.disable();
						var debug = Ext.getCmp(RDN + textType + "debug");
						debug.enable();
						var debugId = RDN + textType;
						var tabId = "debuging" + edi.RDN + type;
						main.debugTab.Debug.stopDebug(tabId, debugId);
					}
				}, EnvRunTimeValueSlave]
			}]
		});
		return tab;
	},
	createCombobox: function() {
		var combostore = Ext.create("Ext.data.Store", {
			fields: ['NAME', 'VLAUE'],
			data: main.model.Dimension.type
		});
		var combobox = Ext.create("Ext.form.ComboBox", {
			fieldLabel: configs.ENV_NAME.TYPE,
			editable: false,
			autoSelect: true,
			store: combostore,
			name: "envType",
			queryMode: 'local',
			labelWidth: 50,
			displayField: 'NAME',
			valueField: "VALUE",
			triggerAction: "all",
			emptyText: "请选择..",
			allowBlank: false,
			blankText: "请选择类型",
			listeners: {
				change: main.Env.envTypeChange
			},
			margin: 5,
			labelAlign: "right",
		});
		return combobox;
	},
	refreshForm: function() {
		var mainTab = main.view.structure.main_tab;
		var tab = mainTab.getActiveTab();
		var form = this.up("form");
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "你确定要刷新吗？（将会清空文本）",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					if (tab.node["TYPE"] == "updateEnv") {
						main.model.Env.getEnv(tab.node["RDN"], form);
					} else {
						var data = {
							"_PDN": "",
							"_ID": "",
							"_NAME": "",
							"_VALUE": "",
							"_LABEL": null,
							"CLASS": "",
							"_TYPE": 0,
							"_DESC": "",
							"RDN": ""
						}
						main.view.Env.setUpdateEnvContent(data, form);
					}
				}
			}
		});
	},
};
// 调度------------------------------------
main.view.Schedule = {
	ScheduleStore: null,
	SchQueueStore: null,
	ScheduleTree: null,
	ScheduleContent: null,
	ScheduleNodeGrid: null,
	ScheduleNodeStore: null,
	ScheduleNodePageBar: null,
	ScheduleNodeTab: null,
	right_click_menu: null,
	right_click_node: null,
	addScheduleWin: null,
	addSchQueueWin: null,
	isAddSchQueue: null,
	index: 0,
	initOncontextmenu: function() {
		//重写右键方法
		var tree = document.getElementsByClassName("x-tree-view")[1];
		tree.oncontextmenu = function(e) {
			e.preventDefault();
		};
	},
	// createTreeToScheduleStore: function() {
	// 	main.view.Schedule.ScheduleStore = 
	// },
	createTreeToSchedule: function() {
		var panel = Ext.create("Ext.tree.Panel", {
			region: "west",
			width: 200,
			store: Ext.create("Ext.data.TreeStore", {
				root: {
					expanded: true,
					children: []
				}
			}),
			rootVisible: false,
			split: true,
			listeners: {
				contextmenu: {
					element: "el",
					fn: main.Schedule.right_click_menu_show
				},
				dblclick: {
					element: "body",
					fn: main.Schedule.dblclick_tree
				},
				itemexpand: main.Schedule.treeToScheduleExpand
			},
			tbar: [{
				xtype: "button",
				text: "添加",
				iconCls: "a_add",
				handler: main.Schedule.addSchedule
			}, {
				xtype: "button",
				text: "刷新",
				iconCls: "a_refresh",
				handler: main.model.Schedule.getScheduleList
			}]
		});
		main.Editor.setEditorContent(panel);
	},
	createRightClickMenu: function() {
		this.right_click_menu = Ext.create("Ext.menu.Menu", {
			plain: true,
			width: 100,
			renderTo: Ext.getBody(),
			items: [{
				text: configs.RIGHT_CLICK_MENU.CHECK,
				iconCls: "a_search",
				handler: main.Schedule.getScheduleNode
			}, {
				text: configs.RIGHT_CLICK_MENU.ADDQueue,
				iconCls: 'a_add',
				handler: main.Schedule.addSchQueue
			}, {
				text: configs.RIGHT_CLICK_MENU.EDIT,
				iconCls: 'a_update',
				handler: main.Schedule.updateSchQueue
			}, {
				text: configs.RIGHT_CLICK_MENU.REFRESH,
				iconCls: "a_refresh",
				handler: main.Schedule.refreshScheduleTreeNode
			}, {
				text: configs.RIGHT_CLICK_MENU.DELETE,
				iconCls: "a_delete",
				handler: main.Schedule.deleteScheduleTreeNode
			}, {
				text: configs.RIGHT_CLICK_MENU.RUNNING,
				iconCls: "a_running",
				handler: main.Schedule.startupSchedule
			}, {
				text: configs.RIGHT_CLICK_MENU.STOP,
				iconCls: "a_stop",
				handler: main.Schedule.shutdownSchedule
			}, {
				text: configs.RIGHT_CLICK_MENU.OPEN_SCH_GRAPH,
				iconCls: "a_graph",
				handler: main.Schedule.SchGraph.openSchGraphTab
			}, {
				text: configs.RIGHT_CLICK_MENU.IMPROT,
				iconCls: "a_import",
				handler: main.Schedule.importFile,
			}, {
				text: configs.RIGHT_CLICK_MENU.EXPROT,
				iconCls: "a_export",
				handler: main.Schedule.exportFile,
			}]
		});
	},
	createScheduleContent: function() {
		var panel = Ext.create("Ext.tab.Panel", {
			region: "center",
			layout: 'fit',
			style: "background:#fff"
		});
		main.Editor.setEditorContent(panel);
	},
	createAddScheduleWin: function() {
		var form = this.createAddScheduleForm();
		this.addScheduleWin = Ext.create("Ext.window.Window", {
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			title: "新建调度",
			closable: true,
			closeAction: "hide",
			modal: false,
			width: 800,
			draggable: true,
			resizable: false, //是否可以调整大小
			items: [form, this.createSchTestsTimesGrid()],
			listeners: {
				close: main.Schedule.addScheduleWinHide
			},
			buttons: [{
				text: "合法时间列表",
				handler: main.Schedule.getSchTestTimes
			}, {
				text: configs.BUTTON_TEXT.OK,
				handler: main.Schedule.addScheduleSub
			}, {
				text: configs.BUTTON_TEXT.UNDO,
				handler: main.Schedule.addScheduleWinHide
			}]
		});
	},
	createAddScheduleForm: function() {
		var form;
		if (Ext.getCmp("AddScheduleForm")) {
			form = Ext.getCmp("AddScheduleForm");
		} else {
			form = Ext.create("Ext.form.Panel", {
				region: "west",
				id: "AddScheduleForm",
				width: 400,
				border: 0,
				items: [{
					xtype: "textfield",
					fieldLabel: "名称",
					labelAlign: "right",
					labelWidth: 50,
					name: "_NAME",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "label",
					text: '调度时间设置(","可选择不同值, "~"表示一个跨度, "-"倒数回去的量)',
					align: "top",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "年",
					labelAlign: "right",
					labelWidth: 50,
					name: "YEAR",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "月",
					labelAlign: "right",
					labelWidth: 50,
					name: "MONTH",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "日",
					labelAlign: "right",
					labelWidth: 50,
					name: "DAY",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "周",
					labelAlign: "right",
					labelWidth: 50,
					name: "WEEKDAY",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "小时",
					labelAlign: "right",
					labelWidth: 50,
					name: "HOUR",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "分",
					labelAlign: "right",
					labelWidth: 50,
					name: "MINUTE",
					anchor: "100%",
					margin: 15
				}, {
					xtype: "textfield",
					fieldLabel: "秒",
					labelAlign: "right",
					labelWidth: 50,
					name: "SECOND",
					anchor: "100%",
					margin: 15
				}],
			});
		}
		return form;
	},
	createSchTestsTimesGrid: function() {
		var store = Ext.create("Ext.data.Store", {
			storeId: configs.STORE_NAME.SCH_TESTS_TIMES_STORE,
			field: ["index", "schTestsTimes"]
		});
		var grid = Ext.create("Ext.grid.Panel", {
			region: "east",
			id: configs.GRID_NAME.SCH_TESTS_TIMES_GRID,
			border: 0,
			width: 390,
			height: 300,
			store: Ext.data.StoreManager.lookup(store),
			columns: [{
				text: "序号",
				dataIndex: "index",
				width: 30,
			}, {
				text: "合法时间",
				dataIndex: "schTestsTimes"
			}],
			forceFit: true,
			renderTo: Ext.getBody()
		});
		return grid;
	},
	createAddSchQueueWin: function() {
		var form = this.createAddSchQueueForm();
		this.addSchQueueWin = Ext.create("Ext.window.Window", {
			title: "编辑队列",
			width: 500,
			modal: false,
			closable: true,
			closeAction: "hide",
			draggable: true,
			resizable: false,
			items: form,
			listeners: {
				close: main.Schedule.addSchQueueWinHide
			},
			buttons: [{
				text: "确定",
				id: "schQueue",
				handler: main.Schedule.addSchQueueSub
			}, {
				text: "取消",
				handler: main.Schedule.addSchQueueWinHide
			}]
		});
	},
	createAddSchQueueForm: function() {
		var form;
		if (Ext.getCmp("AddSchQueueForm")) {
			form = Ext.getCmp("AddSchQueueForm");
		} else {
			var DEFAULT = this.createDEFAULTComboBox();
			var ENABLED = this.createENABLEDComboBox();
			form = Ext.create("Ext.form.Panel", {
				id: "AddSchQueueForm",
				border: 0,
				items: [{
					xtype: "textfield",
					fieldLabel: "名称",
					labelAlign: "right",
					labelWidth: 80,
					name: "_NAME",
					anchor: "100%",
					margin: 15,
				}, {
					xtype: "numberfield",
					fieldLabel: "队列大小",
					minValue: 0,
					keyNavEnabled: false,
					labelAlign: "right",
					labelWidth: 80,
					name: "_SIZE",
					anchor: "100%",
					margin: 15
				}, ENABLED]
			});
		}
		return form;
	},
	createDEFAULTComboBox: function() {
		var combostore = Ext.create("Ext.data.Store", {
			fields: ['NAME', 'VLAUE'],
			data: [{
				VALUE: true,
				NAME: "是",
			}, {
				VALUE: false,
				NAME: "否",
			}],
		});
		var combobox = Ext.create("Ext.form.ComboBox", {
			fieldLabel: "是否默认",
			store: combostore,
			name: "_DEFAULT",
			queryMode: 'local',
			labelWidth: 80,
			displayField: 'NAME',
			valueField: "VALUE",
			triggerAction: "all",
			emptyText: "请选择..",
			allowBlank: false,
			blankText: "请选择类型",
			margin: 15,
			labelAlign: "right",
		});
		return combobox;
	},
	createENABLEDComboBox: function() {
		var combostore = Ext.create("Ext.data.Store", {
			fields: ['NAME', 'VLAUE'],
			data: [{
				VALUE: true,
				NAME: "是",
			}, {
				VALUE: false,
				NAME: "否",
			}],
		});
		var combobox = Ext.create("Ext.form.ComboBox", {
			fieldLabel: "是否可用",
			store: combostore,
			editable: false,
			name: "_ENABLED",
			queryMode: 'local',
			labelWidth: 80,
			displayField: 'NAME',
			valueField: "VALUE",
			triggerAction: "all",
			emptyText: "请选择..",
			allowBlank: false,
			blankText: "请选择类型",
			margin: 15,
			anchor: "100%",
			labelAlign: "right",
		});
		return combobox;
	},
	createScheduleNodeStore: function() {
		var SN = configs.ScheduleNode;
		// main.view.Schedule.ScheduleNodeStore = 
		var store = Ext.create("Ext.data.Store", {
			storeId: "schQueueStore",
			fields: [SN.NAME, SN._SCH_TIME, SN._CONTAINER, SN._PRIORITY, SN._SUSPEND, SN._STATUS],
			data: []
		});
		return store;
	},
	createSchQueueGrid: function() {
		// main.view.Schedule.ScheduleNodeGrid =
		var grid = Ext.create("Ext.grid.Panel", {
			// id: "ScheduleNodeGrid",
			border: 0,
			store: Ext.data.StoreManager.lookup(main.view.Schedule.createScheduleNodeStore()),
			multiSelect: true,
			columns: [{
				text: configs.SCHEDULE_NODE_TEXT.NAME,
				dataIndex: configs.ScheduleNode.NAME
			}, {
				text: configs.SCHEDULE_NODE_TEXT._SCH_TIME,
				dataIndex: configs.ScheduleNode._SCH_TIME,
			}, {
				text: configs.SCHEDULE_NODE_TEXT._CONTAINER,
				dataIndex: configs.ScheduleNode._CONTAINER
			}, {
				text: configs.SCHEDULE_NODE_TEXT._PRIORITY,
				dataIndex: configs.ScheduleNode._PRIORITY,
				width: 50,
			}, {
				text: configs.SCHEDULE_NODE_TEXT._SUSPEND,
				dataIndex: configs.ScheduleNode._SUSPEND,
				width: 50,
				renderer: function(e1, e2) {
					if (e1) {
						return configs.ScheduleNode_SUSPEND.HANG
					} else {
						return configs.ScheduleNode_SUSPEND.NON_HANG
					}
				}
			}, {
				text: configs.SCHEDULE_NODE_TEXT._STATUS,
				dataIndex: configs.ScheduleNode._STATUS,
				width: 50,
				renderer: function(value, cellmeta) {
					cellmeta.style = "color:" + configs.ScheduleNode_STATUS_COLOR[value];
					return configs.ScheduleNode_STATUS[value];
				},
			}],
			forceFit: true,
			renderTo: Ext.getBody(),
			listeners: {
				dblclick: {
					element: "el",
					fn: main.debugTab.openHistoryOfNodeTab
				}
			}
		});
		return grid;
	},
	createScheduleNodeTab: function(edi) {
		var grid = this.createSchQueueGrid();
		// this.createPageBar();
		var tool = this.createPageBar();
		var tab = {
			CLASS: "ScheduleNodeTab",
			closable: true,
			closeAction: "hide",
			data: edi,
			pageBar: tool,
			layout: "fit",
			items: [grid],
			listeners: {
				beforeclose: main.view.Schedule.tabBeforeclose
			},
			tbar: [{
				text: configs.MENE_TEXT.OPEN_SCH_GRAPH,
				// iconCls: "a_graph",
				handler: main.Schedule.SchGraph.openSchGraphTab
			}, {
				text: configs.MENE_TEXT.SET_SLAVE,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openSetSlave
			}, {
				text: configs.MENE_TEXT.RESET_SCHNODES,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openResetSchNodesWin
			}, {
				text: configs.MENE_TEXT.TERNIBATE_SCHNODES,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.terminateSchNodesShow
			}, {
				text: configs.MENE_TEXT.SET_SCH_PRIORITY,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openSetSchPriorityWin
			}, {
				text: configs.MENE_TEXT.SET_SCHQUEUE,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openSetSchQueueWin
			}, {
				text: configs.MENE_TEXT.SET_SCHTIME,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openSetSchTimeWin
			}, {
				text: configs.MENE_TEXT.SET_NODESUSPEND,
				// iconCls:"a_"
				handler: main.Schedule.ScheduleNode.openSetNodeSuspendWin
			}],
			fbar: tool.createToolbar()
		};
		return tab;
		// main.view.Schedule.ScheduleNodeTab = main.view.Schedule.ScheduleContent.add(tab);
	},
	tabBeforeclose: function(e) {
		Ext.Msg.show({
			title: "警告",
			modal: false,
			msg: "要关闭该窗口吗？",
			buttonText: {
				yes: "确定",
				no: "取消"
			},
			fn: function(btn) {
				if (btn === "yes") {
					main.Schedule.closeEditor(e);
					return;
				} else {
					return;
				}
			}
		});
		return false;
	},
	createPageBar: function() {
		// if (!main.view.Schedule.ScheduleNodePageBar) {
		var tool = Ext.create("common.page.PageBar", {
			// id: "ScheduleNodePageBar",
			listeners: {
				PAGING: main.Schedule.ScheduleNodePageChange
			}
		});
		return tool;
		// main.view.Schedule.ScheduleNodePageBar = tool;
		// }
	},
	ScheduleNode: {
		createSetSlaveWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.SET_SLAVE_WIN,
				title: configs.WIN_TITLE.SET_SLAVE,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideSetSlave
				},
				items: this.createSetSlaveForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.setSlave,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideSetSlave,
				}]
			});
		},
		createSetSlaveForm: function() {
			var comboBox = this.createSetSlaveComboBox();
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.SET_SLAVE_FORM,
				border: 0,
				items: comboBox,

			});
			return form;
		},
		createSetSlaveComboBox: function() {
			var store = new Ext.data.Store({
				storeId: configs.STORE_NAME.SET_SLAVE_STORE,
				fields: ["NAME", "VALUE"],
				data: []
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: configs.Slave_TEXT._NAME,
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: configs.Slave.RDN,
				queryMode: 'local',
				labelWidth: 50,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择类型",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		},
		createResetSchNodesWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.RESET_SCHNODES_WIN,
				title: configs.WIN_TITLE.RESET_SCHNODES,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideResetSchNodes
				},
				items: this.createResetSchNodesForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.resetSchNodes,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideResetSchNodes
				}]
			});
		},
		createResetSchNodesForm: function() {
			var RECURSION_comboBox = this.createResetSchNodesCombobox_RECURSION();
			var FORCE_comboBox = this.createResetSchNodesCombobox_FORCE();
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.RESET_SCHNODES_FORM,
				border: 0,
				items: [RECURSION_comboBox, FORCE_comboBox],
			});
			return form;
		},
		createResetSchNodesCombobox_RECURSION: function() {
			var store = new Ext.data.Store({
				fields: ["NAME", "VALUE"],
				data: [{
					NAME: "是",
					VALUE: "true"
				}, {
					NAME: "否",
					VALUE: "false"
				}]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "是否重置后续子孙节点:",
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: "RECURSION",
				queryMode: 'local',
				labelWidth: 150,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择类型",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		},
		createResetSchNodesCombobox_FORCE: function() {
			var store = new Ext.data.Store({
				fields: ["NAME", "VALUE"],
				data: [{
					NAME: "是",
					VALUE: "true"
				}, {
					NAME: "否",
					VALUE: "false"
				}]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "是否强制执行",
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: "FORCE",
				queryMode: 'local',
				labelWidth: 150,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择类型",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		},
		createSetSchPriorityWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.SET_SCH_PRIORITY_WIN,
				title: configs.WIN_TITLE.SET_SCH_PRIORITY,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideSetSchPriorityWin
				},
				items: this.createSetSchPriorityForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.setSchPriority,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideSetSchPriorityWin,
				}]
			});
		},
		createSetSchPriorityForm: function() {
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.SET_SCH_PRIORITY_FORM,
				border: 0,
				items: [{
					xtype: "numberfield",
					fieldLabel: "优先级",
					minValue: 0,
					maxValue: 100,
					keyNavEnabled: false,
					labelAlign: "right",
					labelWidth: 80,
					name: "_PRIORITY",
					anchor: "100%",
					margin: 15
				}]
			});
			return form;
		},
		createSetSchQueueWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.SET_SCHQUEUE_WIN,
				title: configs.WIN_TITLE.SET_SCHQUEUE,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideSetSchQueueWin
				},
				items: this.createSetSchQueueForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.setSchQueue,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideSetSchQueueWin
				}]
			});
		},
		createSetSchQueueForm: function() {
			var comboBox = this.createSetSchQueueCombobox();
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.SET_SCHQUEUE_FORM,
				border: 0,
				items: comboBox,
			});
			return form;
		},
		createSetSchQueueCombobox: function() {
			var store = new Ext.data.Store({
				storeId: configs.STORE_NAME.SET_SCHQUEUE_STORE,
				fields: ["NAME", "VALUE"],
				data: []
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "队列名称",
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: configs.SchQueue.RDN,
				queryMode: 'local',
				labelWidth: 100,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择类型",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		},

		createSetSchTimeWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.SET_SCHTIME_WIN,
				title: configs.WIN_TITLE.SET_SCHTIME,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideSetSchTimeWin
				},
				items: this.createSetSchTimeForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.setSchTime,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideSetSchTimeWin
				}]
			});
		},
		createSetSchTimeForm: function() {
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.SET_SCHTIME_FORM,
				border: 0,
				items: [{
					xtype: 'datefield',
					margin: 15,
					anchor: '100%',
					fieldLabel: '调度时间',
					name: '_SCH_TIME_USER',
					format: 'Y-m-d H:i:s',
					labelAlign: "right",
				}, this.createSetSchTimeCombobox()]
			});
			return form;
		},
		createSetSchTimeCombobox: function() {
			var store = new Ext.data.Store({
				storeId: configs.STORE_NAME.SET_SCHTIME_STORE,
				fields: ["NAME", "VALUE"],
				data: []
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "选择合法时间:",
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: "_SCH_TIME",
				queryMode: 'local',
				labelWidth: 100,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		},
		createSetNodeSuspendWin: function() {
			Ext.create("Ext.window.Window", {
				id: configs.WIN_NAME.SET_NODESUSPEND_WIN,
				title: configs.WIN_TITLE.SET_NODESUSPEND,
				width: 400,
				closable: true,
				closeAction: "hide",
				modal: false,
				draggable: true,
				resizable: false,
				listeners: {
					hide: main.Schedule.ScheduleNode.hideSetNodeSuspendWin
				},
				items: this.createSetNodeSuspendForm(),
				buttons: [{
					text: configs.BUTTON_TEXT.OK,
					handler: main.Schedule.ScheduleNode.setNodeSuspend,
				}, {
					text: configs.BUTTON_TEXT.UNDO,
					handler: main.Schedule.ScheduleNode.hideSetNodeSuspendWin
				}]
			});
		},
		createSetNodeSuspendForm: function() {
			var comboBox = this.createSetNodeSuspendCombobox();
			var form = Ext.create("Ext.form.Panel", {
				id: configs.FORM_NAME.SET_NODESUSPEND_FORM,
				border: 0,
				items: comboBox,
			});
			return form;
		},
		createSetNodeSuspendCombobox: function() {
			var store = new Ext.data.Store({
				fields: ["NAME", "VALUE"],
				data: [{
					NAME: "是",
					VALUE: true
				}, {
					NAME: "否",
					VALUE: false
				}]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				fieldLabel: "是否挂起:",
				editable: false,
				autoSelect: true,
				value: 0,
				store: store,
				name: "_SUSPEND",
				queryMode: 'local',
				labelWidth: 100,
				displayField: "NAME",
				valueField: "VALUE",
				triggerAction: "all",
				emptyText: "请选择..",
				allowBlank: false,
				blankText: "请选择类型",
				margin: 15,
				labelAlign: "right",
				anchor: "100%",
			});
			return comboBox;
		}
	},
	SchGraph: {
		SchGraphTab: null,
		createSchGraphTab: function(edi) {
			var tab = {
				// id: "SchGraphTab",
				CLASS: "SchGraphTab",
				closable: true,
				closeAction: "hide",
				// data: edi,
				html: "<div id='schGraph'></div>",
				// item: {id: "schGraph"},
				// layout: "fit",
				tbar: this.setExplain(),
				autoScroll: "auto",
				listeners: {
					beforeclose: main.view.Schedule.tabBeforeclose
				}
			};
			return tab;
			// main.view.Schedule.SchGraph.SchGraphTab = main.view.Schedule.ScheduleContent.add(tab);
		},
		createSchGraphContent: function(data) {
			var NODES = data["NODES"];
			var RELATIONS = data["RELATIONS"];
			var schGraph = this.setschGraph();
			var contents = [];


			var content = "<div id='holder'></div>";
			var div = "<div id='item{{RDN}}' class='item'" +
				" style='background: -webkit-linear-gradient(bottom, {{_STATUS}} ,#eee);' data-item='"
			div += '{"nodeId":"{{RDN}}"}'
			div += "' >";
			div += "<p>{{NAME}}</p>";
			div += "<p>{{_SCH_TIME}}</p>";
			div += "</div>";
			contents.push(content);
			for (var i = 0, l = NODES.length; i < l; i++) {
				content = div.replace(/{{NAME}}/g, NODES[i]["NAME"])
					.replace(/{{_SCH_TIME}}/g, NODES[i]["_SCH_TIME"])
					.replace(/{{RDN}}/g, NODES[i]["RDN"].split("=")[1])
					.replace(/{{_STATUS}}/g, configs.ScheduleNode_STATUS_COLOR[NODES[i]["_STATUS"]]);
				contents.push(content);
			}
			schGraph.innerHTML = contents.join("");
			tools.setRaphael(schGraph, NODES, RELATIONS);
			this.setExplain();
		},
		setExplain: function() {
			var explains = [];
			for (j in configs.ScheduleNode_STATUS) {
				var explain = {
					xtype: "label",
					width: 80,
					text: configs.ScheduleNode_STATUS[j],
					style: {
						padding: "5px",
						marginLeft: "5px",
						color: "#fff",
						background: configs.ScheduleNode_STATUS_COLOR[j]
					}
				}
				explains.push(explain);
			}
			return explains;
		},
		setschGraph: function() {
			var tab = this.getSchGraphTab();
			var height = tab.getHeight();
			var width = tab.getWidth();
			var schGraph = Ext.getDom('schGraph');
			schGraph.style.width = width + "px";
			schGraph.style.height = height + "px";
			return schGraph;
		},
		getSchGraphTab: function() {
			var main_tab = main.Schedule.getActiveTab();
			var schedule_tab = main_tab.getComponent(2);
			var children_tabs = schedule_tab.items.items;
			var l = children_tabs.length;
			if (l > 0) {
				for (var i = 0; i < l; i++) {
					console.log(children_tabs[i]);
					if (children_tabs[i]["CLASS"] === "SchGraphTab") {
						return children_tabs[i];
					}
				}
			}
			return null;
		}
	}
};
// 调试------------------------------------
main.view.debugTab = {
	Editor: [],
	HistoryOfNode: {
		HistoryOfNodeTabTitle: null,
		HistoryOfNodeTab: null,
		HistoryOfNode_Right_click_menu: null,
		HistoryOfNodeInfoWin: null,
		HistoryOfNodeTabPageBar: null,
		HistoryOfNodeStore: null,
		HistoryOfNodeGrid: null,
		HistoryOfNodeInfoWinToTab: null,
		createHistoryOfNodeTab: function(edi) {
			this.createHistoryOfNodeTabStore();
			this.createHistoryOfNodeTabGrid();
			this.createPageBar();
			this.createHistoryOfNodeTabTitle();
			var editor = {
				id: "historyOfNodeTab",
				closable: false,
				title: "节点历史",
				data: edi,
				layout: "fit",
				listeners: {},
				tbar: [
					this.HistoryOfNodeTabTitle, "->", {
						xtype: "textfield",
						name: "searchHistoryOfNode",
						id: "searchHistoryOfNode",
						listeners: {
							specialKey: function(field, e) {
								if (e.getKey() == Ext.EventObject.ENTER) { //响应回车
									main.debugTab.searchHistoryOfNode();
								}
							}
						}
					}, {
						iconCls: "a_search",
						text: "搜索",
						handler: main.debugTab.searchHistoryOfNode
					},
					main.view.debugTab.HistoryOfNode.HistoryOfNodeTabPageBar.createToolbar()
				]
			}
			this.HistoryOfNodeTab = main.view.structure.debug_tab.add(editor);
			main.view.debugTab.HistoryOfNode.HistoryOfNodeTab.add(
				main.view.debugTab.HistoryOfNode.HistoryOfNodeGrid);
		},
		createHistoryOfNodeTabTitle: function() {
			this.HistoryOfNodeTabTitle = new Ext.form.Label({
				id: "HistoryOfNodeTabTitle",
				text: "节点历史"
			});
		},
		createHistoryOfNode_Right_click_menu: function() {
			this.HistoryOfNode_Right_click_menu = Ext.create("Ext.menu.Menu", {
				plain: true,
				width: 100,
				renderTo: Ext.getBody(),
				items: [{
					text: configs.RIGHT_CLICK_MENU.OPEN_TRACE,
					iconCls: 'a_search',
					handler: main.debugTab.openTrace
				}, {
					text: configs.RIGHT_CLICK_MENU.OPEN_ERR_MSG,
					iconCls: 'a_error',
					handler: main.debugTab.openErrMsg
				}]
			});
		},
		beforeclose: function(e) {
			Ext.Msg.show({
				title: "警告",
				modal: false,
				msg: "要关闭该窗口吗？",
				buttonText: {
					yes: "确定",
					no: "取消"
				},
				fn: function(btn) {
					if (btn === "yes") {
						main.debugTab.closeEditor(e);
						return;
					} else {
						return;
					}
				}
			});
			return false;
		},
		createHistoryOfNodeTabStore: function() {
			if (!main.view.debugTab.HistoryOfNode.HistoryOfNodeStore) {
				var SN = configs.HistoryOfNode;
				main.view.debugTab.HistoryOfNode.HistoryOfNodeStore = Ext.create("Ext.data.Store", {
					storeId: "HistoryOfNodeStore",
					fields: [SN._SCH_TIME,
						SN._STATUS,
						SN._START_TIME,
						SN._END_TIME,
						SN._TRACE,
						SN._ERR_MSG
					],
					data: []
				});
			};
		},
		createHistoryOfNodeTabGrid: function() {
			main.view.debugTab.HistoryOfNode.HistoryOfNodeGrid = Ext.create("Ext.grid.Panel", {
				id: "HistoryOfNodeGrid",
				border: 0,
				store: Ext.data.StoreManager.lookup(main.view.debugTab.HistoryOfNode.HistoryOfNodeStore),
				selModel: {
					selType: 'rowmodel',
					mode: 'SIMPLE'
				},
				columns: [{
					text: configs.HistoryOfNode_TEXT._SCH_TIME,
					dataIndex: configs.HistoryOfNode._SCH_TIME
				}, {
					text: configs.HistoryOfNode_TEXT._STATUS,
					dataIndex: configs.HistoryOfNode._STATUS,
					renderer: function(value, cellmeta) {
						cellmeta.style = "color:" + configs.ScheduleNode_STATUS_COLOR[value];
						return configs.ScheduleNode_STATUS[value];
					}
				}, {
					text: configs.HistoryOfNode_TEXT._START_TIME,
					dataIndex: configs.HistoryOfNode._START_TIME
				}, {
					text: configs.HistoryOfNode_TEXT._END_TIME,
					dataIndex: configs.HistoryOfNode._END_TIME
				}, {
					text: configs.HistoryOfNode_TEXT._TRACE,
					dataIndex: configs.HistoryOfNode._TRACE,
					renderer: function(value, e2) {
						e2["_CLASS"] = "_TRACE";
						return value;
					}
				}, {
					text: configs.HistoryOfNode_TEXT._ERR_MSG,
					dataIndex: configs.HistoryOfNode._ERR_MSG,
					renderer: function(value, e2) {
						e2["_CLASS"] = "_ERR_MSG";
						return value;
					}

				}],
				forceFit: true,
				renderTo: Ext.getBody(),
				listeners: {
					contextmenu: {
						element: "el",
						fn: main.debugTab.historyOfNode_Right_click_menuShow
					}
				}
			});
		},
		createPageBar: function() {
			if (!main.view.debugTab.HistoryOfNode.ScheduleNodePageBar) {
				var tool = Ext.create("common.page.PageBar", {
					id: "HistoryOfNodeTabPageBar",
					listeners: {
						PAGING: main.debugTab.HistoryOfNodeTabPageChange
					}
				});
				main.view.debugTab.HistoryOfNode.HistoryOfNodeTabPageBar = tool;
			}
		},
		createHistoryOfNodeInfoWin: function() {
			this.createHistoryOfNodeInfoWinToTab();
			this.HistoryOfNodeInfoWin = Ext.create("Ext.window.Window", {
				id: "HistoryOfNodeInfoWin",
				title: "节点信息",
				closable: true,
				closeAction: "destroy",
				modal: false,
				width: 800,
				draggable: true,
				resizable: false, //是否可以调整大小
				items: this.HistoryOfNodeInfoWinToTab,
				listeners: {
					close: main.debugTab.closeHistoryOfNodeInfoWin
				},
				buttons: [{
					text: "关闭",
					handler: main.debugTab.closeHistoryOfNodeInfoWin,
				}]
			});
		},
		createHistoryOfNodeInfoWinToTab: function() {
			this.HistoryOfNodeInfoWinToTab = Ext.create("Ext.tab.Panel", {
				region: "center",
				height: 500,
				border: 0,
				autoScroll: true,
				items: [{
					id: "HistoryOfNodeTrace",
					autoScroll: true,
					title: "调试信息",
					listeners: {
						show: main.debugTab.getSchNodeHistoryTrace
					},
					layout: 'fit',
				}, {
					id: "HistoryOfNodeErrMsg",
					autoScroll: true,
					title: "错误信息",
					listeners: {
						show: main.debugTab.getSchNodeHistoryErrMsg
					},
					layout: 'fit',
				}],
				layout: 'fit',
			});
		},
	},
	consoleTab: {
		createConsoleTab: function(id) {
			var editor = {
				id: "debugingConsole" + id,
				closable: false,
				title: "控制台",
				border: 0,
				layout: "fit",
				listeners: {
					// beforeclose: main.view.debugTab.beforeclose
				}
			};
			return editor;
		},
		createDebugingConsoleTab: function(tabId, KEY) {
			var editor = {
				id: tabId,
				key: KEY,
				closable: false,
				title: "控制台",
				border: 0,
				autoScroll: true,
			};
			return editor;
		}
	},
	Slave: {
		SlaveStore: null,
		SlaveTab: null,
		createSlaveTab: function() {
			this.createSlaveStore();
			this.createSlaveGrid();
			var Tab = {
				id: "slaveTab",
				closable: false,
				title: "运行容器",
				layout: "fit",
				border: 0,
				listeners: {
					// beforeclose: main.view.debugTab.Slave.beforeclose
				},
				tbar: [{
					text: "新增容器",
					iconCls: "a_add",
					handler: main.debugTab.Slave.addSlaveWinShow
				}, {
					text: "修改容器",
					iconCls: "a_update",
					handler: main.debugTab.Slave.updateSlaveWinShow
				}, {
					text: "删除容器",
					iconCls: "a_delete",
					handler: main.debugTab.Slave.deleteSlaveWinShow
				}]
			};
			this.SlaveTab = main.view.structure.debug_tab.add(Tab);
			this.SlaveTab.add(this.SlaveGrid);
		},
		createSlaveStore: function() {
			var Slave = configs.Slave;
			this.SlaveStore = Ext.create("Ext.data.Store", {
				storeId: configs.STORE_NAME.SLAVE_STORE,
				fields: [Slave._LABEL,
					Slave.RDN,
					Slave._HOST,
					Slave._PORT,
					Slave._STATUS,
					Slave._NAME, {
						name: "NAME",
						convert: function(value, record) {
							var value;
							var _LABEL = record.get(Slave._LABEL)
							var _NAME = record.get(Slave._NAME)
							if (_LABEL) {
								value = _LABEL + "(" + _NAME + ")";
							} else {
								value = _NAME;
							}
							return value;
						}
					}
				],
				data: []
			});
		},
		createSlaveGrid: function() {
			var Slave = configs.Slave,
				SlaveText = configs.Slave_TEXT;
			this.SlaveGrid = Ext.create("Ext.grid.Panel", {
				id: "SlaveGrid",
				border: 0,
				store: Ext.data.StoreManager.lookup(this.SlaveStore),
				columns: [{
					text: SlaveText._NAME,
					dataIndex: Slave._NAME
				}, {
					text: SlaveText._LABEL,
					dataIndex: Slave._LABEL
				}, {
					text: SlaveText._HOST,
					dataIndex: Slave._HOST
				}, {
					text: SlaveText._PORT,
					dataIndex: Slave._PORT
				}, {
					text: SlaveText._STATUS,
					dataIndex: Slave._STATUS,
					renderer: function(value, cellmeta) {
						cellmeta.style = "color:" + configs.Slave_STATUS_COLOR[value];
						return configs.Slave_STATUS[value];
					}
				}],
				forceFit: true,
				renderTo: Ext.getBody(),
			});
		},
		createAddSlaveWin: function() {
			var form = main.view.debugTab.Slave.createSlaveForm();
			main.view.debugTab.Slave.addSlaveWin = Ext.create("Ext.window.Window", {
				title: "编辑容器",
				width: 500,
				modal: false,
				closable: true,
				closeAction: "hide",
				draggable: true,
				resizable: false,
				items: [form],
				listeners: {
					close: main.debugTab.Slave.addSlaveWinHide
				},
				buttons: [{
					text: "确定",
					handler: main.debugTab.Slave.addSlaveSub
				}, {
					text: "取消",
					handler: main.debugTab.Slave.addSlaveWinHide
				}]
			});
		},
		createSlaveForm: function() {
			var form = Ext.create("Ext.form.Panel", {
				id: "SlaveForm",
				border: 0,
				items: [{
					xtype: "textfield",
					fieldLabel: "标签",
					labelAlign: "right",
					labelWidth: 80,
					name: "_LABEL",
					anchor: "100%",
					margin: 15,
				}, {
					xtype: "textfield",
					fieldLabel: "主机",
					labelAlign: "right",
					labelWidth: 80,
					name: "_HOST",
					anchor: "100%",
					margin: 15,
				}, {
					xtype: "textfield",
					fieldLabel: "端口",
					labelAlign: "right",
					labelWidth: 80,
					name: "_PORT",
					anchor: "100%",
					margin: 15,
				}]
			});
			return form;
		},
		createDeleteSlave: function() {
			Ext.Msg.show({
				title: "警告",
				modal: false,
				msg: "确定要删除该容器吗？",
				buttonText: {
					yes: "确定",
					no: "取消"
				},
				fn: function(btn) {
					if (btn === "yes") {
						main.debugTab.Slave.deleteSlaveNode();
						return;
					} else {
						return;
					}
				}
			});
		},
	}
};