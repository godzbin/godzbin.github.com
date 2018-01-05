Ext.ns("common");

common.Constants = {
	userIconDir : "resources/userIcons/",
	noUserIcon : "noUser2.png"
};

common.UICmp = function() {
	this.constructor();
};
common.UICmp.prototype = {
	constructor : function() {
		this.content = null;
	},

	destroy : function() {
		if (this.content) {
			this.content.destroy();
			this.content = null;
		}
	},

	getContent : function() {
		if (!this.content) {
			this.content = this.createContent();
		}
		return this.content;
	},

	createContent : function(config) {
		return null;
	},

	setVisible : function(v) {
		if (v) {
			this.getContent().show();
		} else {
			this.getContent().hide();
		}
	},

	show : function() {
		this.setVisible(true);
	},

	hide : function() {
		this.setVisible(false);
	}
};

common.PropertyPage = Ext.extend(common.UICmp, {
			constructor : function() {
				common.PropertyPage.superclass.constructor.call(this);
				this.data = null;
			},

			destroy : function() {
				this.data = null;
				common.PropertyPage.superclass.destroy.call(this);
			},

			getTitle : function() {
				return "";
			},

			getIconCls : function() {
				return null;
			},

			doSetData : function(o) {
			},

			populateData : function(o) {
			},

			setData : function(o) {
				var old = this.data;
				this.data = o;
				if (this.content && this.content.rendered) {
					if (old) {
						this.populateData(old);
					}
					this.doSetData(o);
				}
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.createContent();
					this.content.on("render", this.onRender, this);
				}
				return this.content;
			},

			onRender : function() {
				if (this.data) {
					this.setData(this.data);
				}
				this.content.un("render", this.onRender, this);
			},

			reset : function() {
			}
		});

common.PropPageMgr = Ext.extend(common.UICmp, {
			constructor : function() {
				common.PropPageMgr.superclass.constructor.call(this);
				this.tabPanel = null;
				this.contentPanel = null;
				this.pages = this.createPages();
			},

			destroy : function() {
				for (var i = 0, len = this.pages.length; i < len; ++i) {
					this.pages[i].destroy();
				}
				this.pages.splice(0, this.pages.length);
				this.pages = null;
				this.tabPanel = null;
				this.contentPanel = null;
				common.PropPageMgr.superclass.destroy.call(this);
			},

			createTabPanel : function() {
				return new Ext.ux.VerticalTabPanel(Ext.apply({
							region : "west",
							activeTab : 0,
							tabPosition : 'left',
							tabWidth : 100,
							border : false,
							width : 100,
							defaults : {
								autoScroll : true
							},
							items : this.createTabBar()
						}));
			},

			createTabBar : function() {
				var rs = [];
				for (var i = 0, len = this.pages.length; i < len; ++i) {
					var page = this.pages[i];
					rs.push({
								title : page.getTitle(),
								iconCls : page.getIconCls()
							});
				}
				return rs;
			},

			createContentPanel : function() {
				return new Ext.Panel({
							region : "center",
							border : false,
							layout : "card",
							activeItem : 0,
							items : this.getPagesContent()
						});
			},

			getPagesContent : function() {
				var rs = [];
				for (var i = 0, len = this.pages.length; i < len; ++i) {
					var item = this.pages[i].getContent();
					rs.push(item);
				}
				return rs;
			},

			createContent : function(config) {
				this.tabPanel = this.createTabPanel();
				this.tabPanel.on("tabchange", this.onTabChange, this);
				this.contentPanel = this.createContentPanel();
				return new Ext.Panel(Ext.apply({
							layout : "border",
							border : false,
							items : [this.tabPanel, this.contentPanel]
						}, config || {}));
			},

			onTabChange : function(tabPanel, panel) {
				if (this.contentPanel.rendered) {
					var index = this.tabPanel.items.indexOf(panel);
					this.activate(index);
				}
			},

			activate : function(index) {
				this.tabPanel.activate(this.tabPanel.items.get(index));
				this.contentPanel.getLayout().setActiveItem(index);
			},

			createPages : function() {
				return [];
			},

			reset : function() {
				for (var i = 0, len = this.pages.length; i < len; ++i) {
					this.pages[i].setData(null);
				}
			},

			setData : function(o) {
				for (var i = 0, len = this.pages.length; i < len; ++i) {
					this.pages[i].setData(o);
				}
			}
		});

common.PropertiesView = Ext.extend(common.UICmp, {
			constructor : function() {
				common.PropertiesView.superclass.constructor.call(this);
				this.pageMgrs = this.createPageMgrs();
				this.index = -1;
			},

			destroy : function() {
				for (var i = 0, len = this.pageMgrs.length; i < len; ++i) {
					this.pageMgrs[i].destroy();
				}
				this.pageMgrs.splice(0, this.pageMgrs.length);
				this.pageMgrs = null;
				this.index = -1;
				common.PropertiesView.superclass.destroy.call(this);
			},

			createPageMgrs : function() {
				return [];
			},

			computeIndex : function(o) {
				return -1;
			},

			activate : function(index) {
				if (this.content.rendered) {
					this.content.getLayout().setActiveItem(index);
				}
			},

			setData : function(o) {
				var index = this.computeIndex(o);
				if (this.index != index) {
					var oIndex = this.index;
					this.index = index;
					if (index > -1) {
						var mgr = this.pageMgrs[index];
						mgr.setData(o);
						mgr.activate(0);
					}
					this.activate(this.index + 1);
					if (oIndex > -1) {
						this.pageMgrs[oIndex].reset();
					}
				} else {
					if (index > -1) {
						this.pageMgrs[index].setData(o);
					}
				}
			},

			createContent : function(config) {
				return new Ext.Panel(Ext.apply({
							layout : "card",
							activeItem : 0,
							items : this.createItems()
						}, config || {}));
			},

			createItems : function() {
				var rs = [{}];
				for (var i = 0, len = this.pageMgrs.length; i < len; ++i) {
					var mgr = this.pageMgrs[i];
					rs.push(mgr.getContent());
				}
				return rs;
			}
		});

common.CheckFieldEvent = {
	DATA_CHANGE : "DATA_CHANGE"
};
common.CheckField = Ext.extend(Ext.form.TriggerField, {
			constructor : function(config) {
				this.menu = null;
				this.data = config.data || [];
				common.CheckField.superclass.constructor.call(this, config);
				this.addEvents(common.CheckFieldEvent.DATA_CHANGE);
				this.updateValue();
			},

			loadData : function(data) {
				this.data = data;
				if (this.menu) {
					this.menu.removeAll();
					for (var i = 0, len = data.length; i < len; ++i) {
						var item = new Ext.menu.CheckItem(data[i]);
						item.on("checkchange", this.itemCheckChange, this);
						this.menu.add(item);
					}
				}
				this.fireEvent(common.CheckFieldEvent.DATA_CHANGE, this);
			},

			itemCheckChange : function(item, checked) {
				var i = this.menu.items.indexOf(item);
				if (i > -1) {
					this.data[i].checked = checked;
				}
				this.updateValue();
			},

			onTriggerClick : function(evt) {
				if (!this.menu) {
					this.menu = new Ext.menu.Menu({
								renderTo : document.body,
								internalDefaults : {
									hideOnClick : false
								},
								style : {
									cursor : "default"
								}
							});
					this.loadData(this.data);
				}
				this.menu.show(this.el);
			},

			updateValue : function() {
				var data = this.getData(true);
				var s = [];
				for (var i = 0, len = data.length; i < len; ++i) {
					s.push(data[i].text);
				}
				this.setRawValue(s.join(", "));
			},

			setValue : function(v) {
				var vs = v.split(",");
				for (var i = 0, len = this.data.length; i < len; ++i) {
					if (vs.indexOf("" + this.data[i].value) > -1) {
						this.data[i].checked = true;
					}
				}
				this.updateValue();
			},

			getData : function(checked) {
				var rs = [];
				for (var i = 0, len = this.data.length; i < len; ++i) {
					if (this.data[i].checked == checked) {
						rs.push(this.data[i]);
					}
				}
				return rs;
			},

			clearSelections : function() {
				for (var i = 0, len = this.data.length; i < len; ++i) {
					this.data[i].checked = false;
				}
				if (this.menu) {
					var items = this.menu.items;
					for (var i = 0, len = items.getCount(); i < len; ++i) {
						items.get(i).setChecked(false);
					}
				}
				this.updateValue();
			},

			getSelectionValues : function() {
				var rs = [];
				for (var i = 0, len = this.data.length; i < len; ++i) {
					if (this.data[i].checked) {
						rs.push(this.data[i].value);
					}
				}
				return rs;
			},

			contains : function(x, y) {
				var flag = GuiUtil.contains(this, x, y);
				if (!flag && this.menu) {
					flag = GuiUtil.contains(this.menu, x, y);
				}
				return flag;
			}
		});

common.ToolItem = new function() {
	this.ADD = 1;
	this.EDIT = 2;
	this.DELETE = 3;
	this.BACK = 4;
	this.EXPAND_ALL = 5;
	this.COLLAPSE_ALL = 6;
	this.REFRESH = 7;
	this.COPY = 8;
	this.PASTE = 9;
	this.CUT = 10;
	this.SAVE = 11;
	this.BACKWARD = 12;
	this.FORWARD = 13;
	this.CONFIRM = 14;
	this.RESET = 15;
	this.MOVE = 16;
	this.UPWARD = 17;
	this.DOWNWARD = 18;
	this.EXPORT = 19;
	this.IMPORT = 20;
	this.TRASH = 21;
};
common.ToolItem.createAdd = function(config) {
	if (!config) {
		config = {};
	}
	return this.create(Ext.apply({
				type : this.ADD
			}, config));
};
common.ToolItem.createEdit = function(config) {
	if (!config) {
		config = {};
	}
	return this.create(Ext.apply({
				type : this.EDIT
			}, config));
};
common.ToolItem.createDelete = function(config) {
	if (!config) {
		config = {};
	}
	return this.create(Ext.apply({
				type : this.DELETE
			}, config));
};
common.ToolItem.createBack = function(config) {
	if (!config) {
		config = {};
	}
	return this.create(Ext.apply({
				type : this.BACK
			}, config));
};
common.ToolItem.createExpandAll = function(config) {
	return this.create(Ext.apply({
				type : this.EXPAND_ALL
			}, config || {}));
};
common.ToolItem.createCollapseAll = function(config) {
	return this.create(Ext.apply({
				type : this.COLLAPSE_ALL
			}, config || {}));
};
common.ToolItem.createRefresh = function(config) {
	return this.create(Ext.apply({
				type : this.REFRESH
			}, config || {}));
};
common.ToolItem.createCopy = function(config) {
	return this.create(Ext.apply({
				type : this.COPY
			}, config || {}));
};
common.ToolItem.createPaste = function(config) {
	return this.create(Ext.apply({
				type : this.PASTE
			}, config || {}));
};
common.ToolItem.createCut = function(config) {
	return this.create(Ext.apply({
				type : this.CUT
			}, config || {}));
};
common.ToolItem.createSave = function(config) {
	return this.create(Ext.apply({
				type : this.SAVE
			}, config || {}));
};
common.ToolItem.createBackward = function(config) {
	return this.create(Ext.apply({
				type : this.BACKWARD
			}, config || {}));
};
common.ToolItem.createForward = function(config) {
	return this.create(Ext.apply({
				type : this.FORWARD
			}, config || {}));
};
common.ToolItem.createConfirm = function(config) {
	return this.create(Ext.apply({
				type : this.CONFIRM
			}, config || {}));
};
common.ToolItem.createReset = function(config) {
	return this.create(Ext.apply({
				type : this.RESET
			}, config || {}));
};
common.ToolItem.createMove = function(config) {
	return this.create(Ext.apply({
				type : this.MOVE
			}, config || {}));
};
common.ToolItem.createUpward = function(config) {
	return this.create(Ext.apply({
				type : this.UPWARD
			}, config || {}));
};
common.ToolItem.createDownward = function(config) {
	return this.create(Ext.apply({
				type : this.DOWNWARD
			}, config || {}));
};
common.ToolItem.createImport = function(config) {
	return this.create(Ext.apply({
				type : this.IMPORT
			}, config || {}));
};
common.ToolItem.createExport = function(config) {
	return this.create(Ext.apply({
				type : this.EXPORT
			}, config || {}));
};
common.ToolItem.createTrash = function(config) {
	return this.create(Ext.apply({
				type : this.TRASH
			}, config || {}));
};
common.ToolItem.create = function(config) {
	switch (config.type) {
		case this.ADD :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.add,
						iconCls : "add"
					}, config));
		case this.EDIT :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.edit,
						iconCls : "edit"
					}, config));
		case this.DELETE :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.remove,
						iconCls : "delete"
					}, config));
		case this.BACK :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.back,
						iconCls : "back"
					}, config));
		case this.EXPAND_ALL :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.expandAll,
						iconCls : "expandAll"
					}, config));
		case this.COLLAPSE_ALL :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.collapseAll,
						iconCls : "collapseAll"
					}, config));
		case this.REFRESH :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.refresh,
						iconCls : "refresh"
					}, config));
		case this.COPY :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.copy,
						iconCls : "copy"
					}, config));
		case this.PASTE :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.paste,
						iconCls : "paste"
					}, config));
		case this.CUT :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.cut,
						iconCls : "cut"
					}, config));
		case this.SAVE :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.save,
						iconCls : "save"
					}, config));
		case this.BACKWARD :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.backward,
						iconCls : "backward"
					}, config));
		case this.FORWARD :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.forward,
						iconCls : "forward"
					}, config));
		case this.CONFIRM :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.ok,
						iconCls : "confirm"
					}, config));
		case this.RESET :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.reset,
						iconCls : "reset"
					}, config));
		case this.MOVE :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.move,
						iconCls : "move"
					}, config));
		case this.UPWARD :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.upward,
						iconCls : "upward"
					}, config));
		case this.DOWNWARD :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.downward,
						iconCls : "downward"
					}, config));
		case this.EXPORT :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.exportFile,
						iconCls : "export"
					}, config));
		case this.IMPORT :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.importFile,
						iconCls : "import"
					}, config));
		case this.TRASH :
			return new Ext.Toolbar.Button(Ext.apply({
						text : Resources.trash,
						iconCls : "trash"
					}, config));
	}
	return new Ext.Toolbar.Button(config);
};

common.Event = {
	SELECTION_CHANGED : "SELECTION_CHANGED"
};

common.BasicTree = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				this.tree = null;
				common.BasicTree.superclass.constructor.call(this);
			},

			createContent : function(config) {
				return this.createTree(config);
			},

			createTree : function(config) {
				if (!config) {
					config = {};
				}
				var tree = new Ext.tree.TreePanel(Ext.apply({}, config));
				tree.setRootNode(this.createRootNode());
				this.tree = tree;
				return tree;
			},

			createRootNode : function() {
				var root = new Ext.tree.TreeNode({
							expandable : true,
							expanded : true
						});
				return root;
			},

			getRootNode : function() {
				return this.tree.getRootNode();
			},

			selectNode : function(node) {
				this.tree.getSelectionModel().select(node);
			},

			getSelectedNode : function() {
				return this.tree.getSelectionModel().getSelectedNode();
			},

			getTree : function() {
				return this.tree;
			},

			clear : function() {
				this.getRootNode().removeAll(true);
			}
		});

common.BasicGrid = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				this.sm = null;
				this.grid = null;
				this.gridFields = null;
				this.selBtns = [];
				this.singleSelBtns = [];
				this.__recordClass = null;
				common.BasicGrid.superclass.constructor.call(this);
			},

			__getRecordClass : function() {
				if (!this.__recordClass) {
					this.__recordClass = Utils.createRecordClass(this
							.getFields());
				}
				return this.__recordClass;
			},

			populateRecord : function(record, o) {
				var fs = this.getFields();
				var f;
				for (var i = 0, len = fs.length; i < len; ++i) {
					f = fs[i];
					record.set(f, this.getDataValue(o, f));
				}
			},

			setDataList : function(ns) {
				if (ns == null) {
					return;
				}
				var fs = this.getFields();
				var rs = [];
				var r, n;
				for (var i = 0, len = ns.length; i < len; ++i) {
					n = ns[i];
					r = [];
					for (var j = 0, jlen = fs.length; j < jlen; ++j) {
						r.push(this.getDataValue(n, fs[j]));
					}
					rs.push(r);
				}
				this.getStore().loadData(rs);
			},

			getDataValue : function(n, name) {
				return n[name];
			},

			getDataList : function() {
				var fs = this.getFields();
				var rs = [];
				var store = this.getStore();
				var f, record;
				var dataClass = this.getDataClass();
				for (var i = 0, len = store.getCount(); i < len; ++i) {
					record = store.getAt(i);
					f = new dataClass();
					for (var j = 0, jlen = fs.length; j < jlen; ++j) {
						f[fs[j]] = record.get(fs[j]);
					}
					rs.push(f);
				}
				return rs;
			},

			getDataClass : function() {
				return null;
			},

			doFilter : function(fn, scope) {
				this.getStore().filterBy(fn, scope);
			},

			selectAll : function() {
				this.getSM().selectAll();
			},

			addToSel : function(btn) {
				this.selBtns.push(btn);
			},

			addToSingleSel : function(btn) {
				this.singleSelBtns.push(btn);
			},

			doSort : function(o, dir) {
				this.getStore().sort(o, dir);
			},

			getAllRecords : function() {
				return this.getStore().getRange();
			},

			removeSelections : function() {
				var rows = this.getSelections();
				this.getStore().remove(rows);
			},

			removeRecords : function(rs) {
				this.getStore().remove(rs);
			},

			clearSelections : function() {
				this.sm.clearSelections();
			},

			getSelections : function() {
				return this.sm.getSelections();
			},

			getSelection : function() {
				var sels = this.getSelections();
				if (sels.length > 0) {
					return sels[0];
				}
				return null;
			},

			getSelected : function() {
				return this.sm.getSelected();
			},

			clearData : function() {
				this.getStore().removeAll();
			},

			loadData : function(data) {
				this.getStore().loadData(data);
			},

			getStore : function() {
				return this.grid.getStore();
			},

			createColumnModel : function(newCols) {
				var columns = [];
				if (newCols) {
					columns = Utils.appendArray(newCols, columns);
				}
				var cm = new Ext.grid.ColumnModel({
							defaults : {
								sortable : true
							},
							columns : columns
						});
				return cm;
			},

			createFields : function() {
				return [];
			},

			getFields : function() {
				if (!this.gridFields) {
					this.gridFields = this.createFields();
				}
				return this.gridFields;
			},

			createData : function() {
				return [];
			},

			createDataStore : function(config) {
				if (!config) {
					config = {};
				}
				return new Ext.data.SimpleStore(Ext.apply({
							fields : this.getFields(),
							data : this.createData()
						}, config));
			},

			getSelectionChangeConfig : function() {
				return [{
							handler : this.handleSelectionChange,
							scope : this
						}];
			},

			getSelBtns : function() {
				return this.selBtns;
			},

			getSingleSelBtns : function() {
				return this.singleSelBtns;
			},

			handleSelectionChange : function(sm) {
				var singleSelBtns = this.getSingleSelBtns();
				var selBtns = this.getSelBtns();
				var count = sm.getCount();
				if (count == 1) {
					GuiUtil.setBtnsEnable(this.singleSelBtns, true);
					GuiUtil.setBtnsEnable(this.selBtns, true);
				} else if (count > 1) {
					GuiUtil.setBtnsEnable(this.singleSelBtns, false);
					GuiUtil.setBtnsEnable(this.selBtns, true);
				} else {
					GuiUtil.setBtnsEnable(this.singleSelBtns, false);
					GuiUtil.setBtnsEnable(this.selBtns, false);
				}
				this.fireEvent(common.Event.SELECTION_CHANGED, this);
			},

			createSM : function() {
				return new Ext.grid.RowSelectionModel({
							singleSelect : true
						});
			},

			getSM : function() {
				return this.sm;
			},

			createSelectionModel : function() {
				if (this.sm) {
					return this.sm;
				}
				var sm = this.createSM();
				var cfgs = this.getSelectionChangeConfig();
				for (var i = 0, len = cfgs.length; i < len; ++i) {
					var cfg = cfgs[i];
					sm
							.on("selectionchange", cfg.handler, cfg.scope,
									cfg.option);
				}
				return sm;
			},

			getAutoExpandCol : function() {
				return "autoExpandCol";
			},

			getGridClass : function() {
				return Ext.grid.GridPanel;
			},

			createGrid : function(config) {
				if (this.grid) {
					return this.grid;
				}
				if (!config) {
					config = {};
				}
				this.sm = this.createSelectionModel();
				var clazz = this.getGridClass();
				var grid = new clazz(Ext.apply({
							cm : this.createColumnModel(),
							store : this.createDataStore(),
							sm : this.sm,
							enableColumnMove : false,
							trackMouseOver : false,
							enableHdMenu : false,
							enableColumnMove : false,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							},
							autoExpandColumn : this.getAutoExpandCol(),
							bodyStyle : {
								cursor : "default"
							}
						}, config));
				this.grid = grid;
				return grid;
			},

			show : function() {
				if (this.grid) {
					this.grid.show();
				}
			},

			hide : function() {
				if (this.grid) {
					this.grid.hide();
				}
			},

			getGrid : function() {
				return this.grid;
			},

			getView : function() {
				return this.getGrid().getView();
			},

			getColumnModel : function() {
				return this.getGrid().getColumnModel();
			},

			selectRecord : function(record) {
				this.selectRecords([record]);
			},

			selectRecords : function(records) {
				this.grid.getSelectionModel().selectRecords(records);
			},

			selectRow : function(idx) {
				this.selectRows([idx]);
			},

			selectRows : function(idxs) {
				this.grid.getSelectionModel().selectRows(idxs);
			},

			enable : function() {
				this.grid.enable();
			},

			disable : function() {
				this.grid.disable();
			},

			focusRecord : function(record) {
				var idx = this.getStore().indexOf(record);
				if (idx > -1) {
					this.focusRow(idx);
				}
			},

			focusRow : function(row) {
				this.grid.getView().focusRow(row);
			},

			focusCell : function(row, col) {
				this.grid.getView().focusCell(row, col);
			},

			addRecord : function(record) {
				var store = this.getStore();
				store.add([record]);
				var row = store.indexOf(record);
				this.focusRow(row);
				this.selectRecord(record);
				return row;
			}
		});

common.BasicEditGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				common.BasicEditGrid.superclass.constructor.call(this);
				this.editingCell = null;
			},

			isEditable : function() {
				return true;
			},

			createGrid : function(config) {
				var grid = common.BasicEditGrid.superclass.createGrid.call(
						this, config);
				grid.on("cellclick", this.onCellClick, this);
				grid.on("render", this.onGridRender, this);
				return grid;
			},

			onGridRender : function() {
				this.grid.body.on("mousewheel", this.onMouseWheel, this);
			},

			onMouseWheel : function() {
				if (this.editingCell) {
					this.onCellBlur(null, this.editingCell, null);
				}
			},

			checkEditable : function(row, col) {
				return true;
			},

			onCellClick : function(grid, row, col, e) {
				if (this.checkEditable(row, col)) {
					this.startEditing(row, col);
				}
			},

			onKeydown : function(e, t, o) {
				if (e.keyCode == 13 && e.ctrlKey) {
					Ext.get(t).blur();
				}
			},

			onCellBlur : function(e, t, o) {
				var el = Ext.get(t);
				el.un("blur", this.onCellBlur, this);
				el.removeClass("grid-textarea");
				this.endEdit(t, t.getAttribute("row"), t.getAttribute("col"));
			},

			endEdit : function(t, row, col) {
				var store = this.getStore();
				var record = store.getAt(row);
				var fieldName = record.fields.get(this.fixCol(col)).name;
				record.set(fieldName, t.value);
				this.editingCell = null;
			},

			fixCol : function(col) {
				return col;
			},

			startEditing : function(row, col) {
				var c = this.grid.getView().getCell(row, col);
				var mgr = this;
(function		() {
					mgr.editCell(c, row, col);
				}).defer(50);
			},

			editCell : function(c, row, col) {
				if (this.editingCell == c) {
					return;
				}
				while (c != null) {
					if (c.tagName) {
						if (c.tagName.toLowerCase() != "textarea") {
							c = c.firstChild;
						} else {
							if (c.readOnly) {
								c = null;
							}
							break;
						}
					} else {
						c = null;
					}
				}
				if (c) {
					if (this.editingCell == c) {
						return;
					}
					this.editingCell = c;
					var el = Ext.get(c);
					c.setAttribute("row", row);
					c.setAttribute("col", col);
					el.un("blur", this.onCellBlur, this);
					el.on("blur", this.onCellBlur, this);
					el.un("keydown", this.onKeydown, this);
					el.on("keydown", this.onKeydown, this);
					el.addClass("grid-textarea");
					Utils.selectText(c, c.value.length);
				}
			}
		});

common.BasicEditCheckGrid = Ext.extend(common.BasicEditGrid, {
			constructor : function() {
				common.BasicEditCheckGrid.superclass.constructor.call(this);
			},

			fixCol : function(col) {
				return col - 1;
			},

			createSM : function() {
				return new Ext.grid.CheckboxSelectionModel();
			},

			createColumnModel : function(newCols) {
				var smCol = this.createSelectionModel();
				return common.BasicEditCheckGrid.superclass.createColumnModel
						.call(this, Utils.appendArray([smCol], newCols));
			}
		});

common.BasicCheckGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				common.BasicCheckGrid.superclass.constructor.call(this);
			},

			createSM : function() {
				return new Ext.grid.CheckboxSelectionModel();
			},

			createColumnModel : function(newCols) {
				var smCol = this.createSelectionModel();
				return common.BasicCheckGrid.superclass.createColumnModel.call(
						this, Utils.appendArray([smCol], newCols));
			}
		});

common.BasicGroupGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				common.BasicGroupGrid.superclass.constructor.call(this);
			},

			getSortInfo : function() {
				return {
					field : "",
					direction : "ASC"
				};
			},

			getGroupField : function() {
				return "";
			},

			createDataStore : function() {
				return new Ext.data.GroupingStore({
							reader : new Ext.data.ArrayReader({
										fields : this.getFields()
									}),
							sortInfo : this.getSortInfo(),
							groupField : this.getGroupField(),
							data : this.createData()
						});
			},

			createViewTpl : function() {
				return '{text} ({[values.rs.length]} ' + Resources.entity + ')';
			},

			createView : function(config) {
				return new Ext.grid.GroupingView(Ext.apply({
							forceFit : true,
							groupTextTpl : this.createViewTpl()
						}, config || {}));
			},

			createGrid : function(config) {
				if (!config) {
					config = {};
				}
				var c = Ext.apply({
							view : this.createView()
						}, config);
				return common.BasicGroupGrid.superclass.createGrid
						.call(this, c);
			},

			expandAll : function() {
				this.grid.getView().expandAllGroups();
			},

			collapseAll : function() {
				this.grid.getView().collapseAllGroups();
			}
		});

common.BasicExpandGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				this.expander = null;
				common.BasicExpandGrid.superclass.constructor.call(this);
			},

			createExpandTpl : function() {
				return "";
			},

			createColumnModel : function(cols) {
				if (!cols) {
					cols = [];
				}
				cols.unshift(this.expander);
				return common.BasicExpandGrid.superclass.createColumnModel
						.call(this, cols);
			},

			createExpander : function() {
				return new common.RowExpander({
							tpl : new Ext.Template(this.createExpandTpl())
						});
			},

			createGrid : function(config) {
				if (!config) {
					config = {};
				}
				this.expander = this.createExpander();
				var c = Ext.apply({
							plugins : this.expander
						}, config);
				return common.BasicExpandGrid.superclass.createGrid.call(this,
						c);
			},

			expandAt : function(index) {
				if (this.expander) {
					this.expander.expandRow(index);
				}
			},

			expand : function(record) {
				var index = this.getStore().indexOf(record);
				this.expandAt(index);
			},

			collapseAt : function(index) {
				if (this.expander) {
					this.expander.collapseRow(index);
				}
			},

			collapse : function(record) {
				var index = this.getStore().indexOf(record);
				this.collapseAt(index);
			},

			expandAll : function() {
				if (this.expander) {
					var len = this.getStore().getCount();
					for (var i = 0; i < len; ++i) {
						this.expander.expandRow(i);
					}
				}
			},

			collapseAll : function() {
				if (this.expander) {
					var len = this.getStore().getCount();
					for (var i = 0; i < len; ++i) {
						this.expander.collapseRow(i);
					}
				}
			},

			refreshRecord : function(record) {
				this.refreshRow(this.getStore().indexOf(record));
			},

			refreshRow : function(idx) {
				this.expander.refreshRow(idx);
			},

			doFilter : function(fn, scope) {
				common.BasicExpandGrid.superclass.doFilter
						.call(this, fn, scope);
				this.collapseAll();
			}
		});

common.BasicExpandGroupGrid = Ext.extend(common.BasicExpandGrid, {
			constructor : function() {
				common.BasicExpandGroupGrid.superclass.constructor.call(this);
			},

			getSortInfo : function() {
				var f = this.getSortField();
				if (f == null) {
					return null;
				}
				return {
					field : f,
					direction : "ASC"
				};
			},

			getSortField : function() {
				return null;
			},

			getGroupField : function() {
				return null;
			},

			createDataStore : function() {
				return new Ext.data.GroupingStore({
							reader : new Ext.data.ArrayReader({
										fields : this.getFields()
									}),
							sortInfo : this.getSortInfo(),
							groupField : this.getGroupField(),
							data : this.createData()
						});
			},

			createViewTpl : function() {
				return '{text} ({[values.rs.length]} ' + Resources.entity + ')';
			},

			createView : function(config) {
				return new Ext.grid.GroupingView(Ext.apply({
							forceFit : true,
							showGroupName : false,
							groupTextTpl : this.createViewTpl()
						}, config || {}));
			},

			createGrid : function(config) {
				if (!config) {
					config = {};
				}
				var c = Ext.apply({
							view : this.createView()
						}, config);
				return common.BasicExpandGroupGrid.superclass.createGrid.call(
						this, c);
			}
		});

common.FilterEvent = {
	DO_FILTER : "DO_FILTER"
};
common.FilterBar = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				common.FilterBar.superclass.constructor.call(this);
				for (var evt in common.FilterEvent) {
					this.addEvents(common.FilterEvent[evt]);
				}
				this.filterInput = null;
			},

			getValue : function() {
				if (this.filterInput) {
					return this.filterInput.getValue();
				}
				return null;
			},

			reset : function() {
				this.filterInput.setRawValue("");
			},

			createItems : function(o) {
				o = Ext.apply({
							label : true,
							button : true,
							filterInput : {
								width : 180
							}
						}, o);
				var rs = [];
				if (o.label) {
					var filterLabel = "<label class='findLabel'>"
							+ Resources.search + ": </label>";
					rs.push(filterLabel);
				}

				this.filterInput = new Ext.form.TextField(o.filterInput);
				this.filterInput.on("render", function() {
							this.filterInput.getEl().on("keydown",
									function(e, t, o) {
										if (e.keyCode == 13) {
											this.doFilter();
										}
									}, this);
						}, this);
				rs.push(this.filterInput);

				if (o.button) {
					var filterBtn = new Ext.Toolbar.Button({
								iconCls : "find",
								handler : this.doFilter,
								scope : this
							});
					rs.push(filterBtn);
				}
				return rs;
			},

			doFilter : function() {
				this.fireEvent(common.FilterEvent.DO_FILTER, this.filterInput
								.getValue());
			},

			getXType : function() {
				return common.FilterBar.XTYPE;
			}
		});
common.FilterBar.XTYPE = "common.FilterBar";

common.TimerEvent = {
	TIME_INTERVAL : "TIME_INTERVAL"
};
common.TimerBar = Ext.extend(Ext.util.Observable, {
			constructor : function(config) {
				common.TimerBar.superclass.constructor.call(this);
				this.interval = 10000;
				Ext.apply(this, config || {});
				this.timeItem = null;
				this.handler = null;
				this.startBtn = null;
				this.started = true;
				this.restTime = this.interval;
				this.pause = false;
				for (var evt in common.TimerEvent) {
					this.addEvents(common.TimerEvent[evt]);
				}
			},

			setDisabled : function(v) {
				if (v) {
					this.setStart(false);
				}
				this.startBtn.setDisabled(v);
				this.timeItem.setDisabled(v);
			},

			isStarted : function() {
				return this.started;
			},

			createItems : function() {
				this.startBtn = new Ext.Button({
							iconCls : "start",
							handler : this.startOrStop,
							scope : this,
							start : false
						});
				this.timeItem = new Ext.Toolbar.TextItem({});
				this.timeItem.setText(this.createTimeText());
				return [this.startBtn, this.timeItem];
			},

			startOrStop : function(btn) {
				var v = !btn.initialConfig.start;
				this.setStart(v);
				this.started = v;
			},

			setStart : function(v) {
				this.startBtn.initialConfig.start = v;
				if (v) {
					this.startBtn.setIconClass("stop");
					this.startAutoLoad();
				} else {
					this.startBtn.setIconClass("start");
					this.stopAutoLoad();
				}
			},

			startAutoLoad : function() {
				this.stopAutoLoad();
				var mgr = this;
				this.handler = setInterval(function() {
							mgr.checkAutoLoad();
						}, 1000);
			},

			checkAutoLoad : function() {
				if (this.pause) {
					return;
				}
				if (this.restTime == 0) {
					this.restTime = this.interval;
				} else {
					--this.restTime;
					if (this.restTime <= 0) {
						this.fireEvent(common.TimerEvent.TIME_INTERVAL);
					}
				}
				this.timeItem.setText(this.createTimeText());
			},

			stopAutoLoad : function() {
				if (this.handler) {
					clearInterval(this.handler);
					this.restTime = this.interval;
					this.timeItem.setText(this.createTimeText());
				}
			},

			suspend : function() {
				this.pause = true;
			},

			resume : function() {
				this.pause = false;
			},

			createTimeText : function() {
				var s;
				if (this.restTime < 10) {
					s = "&nbsp;&nbsp;" + this.restTime;
				} else {
					s = this.restTime;
				}
				s += " ";
				return "<label class='countText'>" + s + Resources.s
						+ "</label>";
			},

			getXType : function() {
				return common.TimerBar.XTYPE;
			}
		});
common.TimerBar.XTYPE = "common.TimerBar";

common.PageEvent = {
	PAGING : "PAGING"
};
common.PageBar = Ext.extend(Ext.util.Observable, {
			constructor : function(config) {
				this.pageCountData = [[25, 25], [50, 50], [100, 100],
						[200, 200]];
				this.pageCount = 20;
				Ext.apply(this, config || {});
				this.currPage = 1;
				this.totalPages = 0;
				this.totalCount = 0;
				for (var evt in common.PageEvent) {
					this.addEvents(common.PageEvent[evt]);
				}
				this.currPageItem = null;
				this.totalPageItem = null;
				this.totalCountItem = null;
				this.firstBtn = null;
				this.lastBtn = null;
				this.preBtn = null;
				this.nextBtn = null;
				this.refreshBtn = null;
				this.pageCountCombo = null;
			},

			createItems : function(o) {
				var config = Ext.apply({
							refresh : true,
							pageCount : true,
							first : true,
							last : true
						}, o || {});
				this.currPageItem = new Ext.form.TextField({
							width : 30,
							style : {
								margin : "2 0 0 0"
							},
							value : this.currPage,
							disabled : false
						});
				this.currPageItem.on("render", function() {
							this.currPageItem.getEl().on("keydown",
									this.onKeyPress, this);
						}, this);
				this.currPageItem.on("change", this.onPageChanged, this);
				this.totalPageItem = new Ext.Toolbar.TextItem(""
						+ this.totalPages);
				this.totalCountItem = new Ext.Toolbar.TextItem("("
						+ this.totalCount + ")");
				if (config.first) {
					this.firstBtn = new Ext.Button({
								iconCls : "x-tbar-page-first",
								tooltip : Resources.firstPage,
								disabled : true,
								handler : this.toFirstPage,
								scope : this
							});
				}
				this.preBtn = new Ext.Button({
							iconCls : "x-tbar-page-prev",
							tooltip : Resources.prePage,
							disabled : true,
							handler : this.toPrePage,
							scope : this
						});
				this.nextBtn = new Ext.Button({
							iconCls : "x-tbar-page-next",
							tooltip : Resources.nextPage,
							disabled : true,
							handler : this.toNextPage,
							scope : this
						});
				if (config.last) {
					this.lastBtn = new Ext.Button({
								iconCls : "x-tbar-page-last",
								tooltip : Resources.lastPage,
								disabled : true,
								handler : this.toLastPage,
								scope : this
							});
				}

				var rs = [];
				if (this.firstBtn) {
					rs.push(this.firstBtn);
				}
				rs.push(this.preBtn);
				rs.push("-");
				rs.push(this.currPageItem);
				rs.push(" / ");
				rs.push(this.totalPageItem);
				rs.push(this.totalCountItem);
				rs.push("-");
				rs.push(this.nextBtn);
				if (this.lastBtn) {
					rs.push(this.lastBtn);
				}

				if (config.refresh) {
					this.refreshBtn = new Ext.Button({
								iconCls : "refresh",
								tooltip : Resources.refresh,
								disabled : true,
								handler : this.refresh,
								scope : this
							});
					rs.push("-");
					rs.push(this.refreshBtn);
				}
				if (config.pageCount) {
					this.pageCountCombo = GuiUtil.createComboBox({
								width : 60,
								store : new Ext.data.SimpleStore({
											fields : ["name", "value"],
											data : this.pageCountData
										}),
								value : this.pageCount
							});
					this.pageCountCombo.on("select", this.onPageCountChanged,
							this);
					rs.push("-");
					rs.push(this.pageCountCombo);
				}
				return rs;
			},

			onPageCountChanged : function() {
				var v = this.pageCountCombo.getValue();
				if (v != this.pageCount) {
					this.pageCount = v;
					this.currPage = 1;
					this.refresh();
				}
			},

			onKeyPress : function(e, t, o) {
				if (e.keyCode == 13) {
					this.currPageItem.getEl().blur();
				}
			},

			onPageChanged : function() {
				var page = parseInt(this.currPageItem.getValue());
				if (page && page.length == 0) {
					this.currPageItem.setValue(this.currPage);
				} else {
					var errMsg = ValidationMgr.validate({
								type : {
									"int" : {
										value : page,
										msg : Resources.pageNum
									}
								},
								compare : {
									le : {
										value : page,
										value2 : this.totalPages,
										msg : Resources.exceed
												+ Resources.totalPages
									},
									gt : {
										value : page,
										value2 : 0,
										msg : Resources.pageNum
												+ Resources.must_gt + " 0"
									}
								}
							});
					if (errMsg) {
						Utils.error(errMsg);
						this.currPageItem.setValue(this.currPage);
						return;
					}
					this.setCurrPage(page);
				}
			},

			toFirstPage : function() {
				this.setCurrPage(1);
			},

			toLastPage : function() {
				this.setCurrPage(this.totalPages);
			},

			toPrePage : function() {
				if (this.currPage > 1) {
					this.setCurrPage(this.currPage - 1);
				}
			},

			toNextPage : function() {
				if (this.currPage < this.totalPages) {
					this.setCurrPage(this.currPage + 1);
				}
			},

			refresh : function() {
				this.currPageItem.setValue(this.currPage);
				this.fireEvent(common.PageEvent.PAGING, this.currPage,
						this.pageCount);
			},

			setTotalCount : function(v) {
				this.totalCount = v;
				this.totalPages = parseInt(v / this.pageCount);
				if (v % this.pageCount != 0) {
					++this.totalPages;
				}
				if (this.currPage > this.totalPages) {
					this.currPage = this.totalPages;
					if (this.currPage <= 0) {
						this.currPage = 1;
					}
				}
				this.totalCountItem.setText(" (" + this.totalCount + ")");
				this.totalPageItem.setText("" + this.totalPages);
				this.currPageItem.setValue(this.currPage);
				this.updateCmpsState();
			},

			updateCmpsState : function() {
				if (this.firstBtn) {
					this.firstBtn.setDisabled(this.currPage <= 1);
				}
				this.preBtn.setDisabled(this.currPage <= 1);
				this.nextBtn.setDisabled(this.currPage >= this.totalPages);
				if (this.lastBtn) {
					this.lastBtn.setDisabled(this.currPage >= this.totalPages);
				}
				if (this.refreshBtn) {
					this.refreshBtn.setDisabled(this.totalPages <= 0);
				}
			},

			setCurrPage : function(v, ignoreRefresh) {
				if (v > 0 && v <= this.totalPages && v != this.currPage) {
					this.currPage = v;
					this.currPageItem.setValue(v);
					this.updateCmpsState();
					if (!ignoreRefresh) {
						this.refresh();
					}
					return true;
				}
				return false;
			},

			setPageCount : function(v) {
				if (this.pageCount != v) {
					this.pageCount = v;
					this.refresh();
				}
			},

			getPageCount : function() {
				return this.pageCount;
			},

			getTotalPages : function() {
				return this.totalPages;
			},

			getCurrPage : function() {
				return this.currPage;
			},

			getStart : function() {
				var start = (this.getCurrPage() - 1) * this.pageCount;
				if (start < 0) {
					Utils.error("Error start!");
					return;
				}
				return start;
			},

			createToolbar : function() {
				return new Ext.Toolbar({
							items : this.createItems()
						});
			},

			reset : function(ignoreRefresh) {
				this.setCurrPage(1, ignoreRefresh);
				this.setTotalCount(0);
			}
		});

common.RowExpander = Ext.extend(Ext.util.Observable, {
	header : "",
	width : 20,
	sortable : false,
	fixed : true,
	dataIndex : '',
	id : 'expander',
	lazyRender : true,
	enableCaching : false,

	constructor : function(config) {
		Ext.apply(this, config);

		this.addEvents({
					beforeexpand : true,
					expand : true,
					beforecollapse : true,
					collapse : true
				});

		common.RowExpander.superclass.constructor.call(this);

		if (this.tpl) {
			if (typeof this.tpl == 'string') {
				this.tpl = new Ext.Template(this.tpl);
			}
			this.tpl.compile();
		}

		this.state = {};
		this.bodyContent = {};
	},

	getRowClass : function(record, rowIndex, p, ds) {
		p.cols = p.cols - 1;
		var content = this.bodyContent[record.id];
		if (!content && !this.lazyRender) {
			content = this.getBodyContent(record, rowIndex);
		}
		if (content) {
			p.body = content;
		}
		return this.state[record.id]
				? 'x-grid3-row-expanded'
				: 'x-grid3-row-collapsed';
	},

	init : function(grid) {
		this.grid = grid;

		var view = grid.getView();
		view.getRowClass = this.getRowClass.createDelegate(this);

		view.enableRowBody = true;

		grid.on('render', function() {
					view.mainBody.on('mousedown', this.onMouseDown, this);
				}, this);
	},

	getBodyContent : function(record, index) {
		if (!this.enableCaching) {
			return this.tpl.apply(record.data);
		}
		var content = this.bodyContent[record.id];
		if (!content) {
			content = this.tpl.apply(record.data);
			this.bodyContent[record.id] = content;
		}
		return content;
	},

	onMouseDown : function(e, t) {
		if (t.className == 'x-grid3-row-expander') {
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			this.toggleRow(row);
		}
	},

	renderer : function(v, p, record) {
		p.cellAttr = 'rowspan="2"';
		return '<div class="x-grid3-row-expander">&#160;</div>';
	},

	beforeExpand : function(record, body, rowIndex) {
		if (this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false) {
			if (this.tpl && this.lazyRender) {
				body.innerHTML = this.getBodyContent(record, rowIndex);
			}
			return true;
		} else {
			return false;
		}
	},

	refreshRow : function(rowIndex) {
		var record = this.grid.store.getAt(rowIndex);
		var row = this.grid.view.getRow(rowIndex);
		var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body',
				row);
		body.innerHTML = this.getBodyContent(record, rowIndex);
	},

	toggleRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		this[Ext.fly(row).hasClass('x-grid3-row-collapsed')
				? 'expandRow'
				: 'collapseRow'](row);
	},

	expandRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body',
				row);
		if (this.beforeExpand(record, body, row.rowIndex)) {
			this.state[record.id] = true;
			Ext.fly(row).replaceClass('x-grid3-row-collapsed',
					'x-grid3-row-expanded');
			this.fireEvent('expand', this, record, body, row.rowIndex);
		}
	},

	collapseRow : function(row) {
		if (typeof row == 'number') {
			row = this.grid.view.getRow(row);
		}
		var record = this.grid.store.getAt(row.rowIndex);
		var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
		if (this.fireEvent('beforcollapse', this, record, body, row.rowIndex) !== false) {
			this.state[record.id] = false;
			Ext.fly(row).replaceClass('x-grid3-row-expanded',
					'x-grid3-row-collapsed');
			this.fireEvent('collapse', this, record, body, row.rowIndex);
		}
	}
});

common.TextComputer = new function() {
	this.id = "textComputer" + new Date().getTime();
	this.fontSize = "9pt";
};
common.TextComputer.getTextSize = function() {
	var box = Ext.getDom(this.id);
	if (!box) {
		box = DomHelper.append(document.body, {
					id : this.id,
					tag : "input",
					type : "text",
					style : "display:none;font-size:" + this.fontSize
							+ ";line-height: 16px;"
				});
	}
	var rng = box.createTextRange();
	return {
		width : rng.boundingWidth,
		height : rng.boundingHeight
	};
};

common.FormMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				this.addKeys = null;
				this.editKeys = null;
				this.formKeys = null;
				this.addWin = null;
				this.editWin = null;
				this.keys = null;
				this.data = null;
				this.initKeys();
				common.FormMgr.superclass.constructor.call(this);
			},

			setData : function(data) {
				this.data = data;
			},

			initKeys : function() {
			},

			getAddWinConfig : function() {
				return {};
			},

			getEditWinConfig : function() {
				return {};
			},

			reqAdd : function() {
				this.keys = this.addKeys;
				if (!this.addWin) {
					this.addWin = this.createWin(Ext.apply({
								iconCls : "add",
								buttons : [{
											text : Resources.ok,
											handler : this.doAdd,
											scope : this
										}, {
											text : Resources.close,
											handler : this.cancelAdd,
											scope : this
										}]
							}, this.getAddWinConfig()));
				}
				this.addWin.show();
				this.addWin.center();
			},

			cancelAdd : function() {
				if (this.addWin) {
					this.addWin.hide();
					GuiUtil.clearForm(this.formKeys);
					this.data = null;
				}
			},

			reqEdit : function() {
				this.keys = this.editKeys;
				if (!this.editWin) {
					this.editWin = this.createWin(Ext.apply({
								iconCls : "edit",
								buttons : [{
											text : Resources.ok,
											handler : this.doEdit,
											scope : this
										}, {
											text : Resources.close,
											handler : this.cancelEdit,
											scope : this
										}]
							}, this.getEditWinConfig()));
				}
				this.editWin.show();
				this.editWin.center();
			},

			cancelEdit : function() {
				if (this.editWin) {
					this.editWin.hide();
					GuiUtil.clearForm(this.formKeys);
					this.data = null;
				}
			},

			createWin : function(config) {
				return null;
			},

			createForm : function() {
				return null;
			}
		});

common.HtmlEditor = function(config) {
	common.HtmlEditor.superclass.constructor.call(this, config);
};
Ext.extend(common.HtmlEditor, Ext.form.HtmlEditor, {
			createLinkText : '请输入链接的URL',

			buttonTips : {
				bold : {
					title : '粗体 (Ctrl+B)',
					text : "加粗选中的文本",
					cls : 'x-html-editor-tip'
				},
				italic : {
					title : '倾斜 (Ctrl+I)',
					text : "倾斜选中的文本",
					cls : 'x-html-editor-tip'
				},
				underline : {
					title : '下划线 (Ctrl+U)',
					text : '自动设置下划线',
					cls : 'x-html-editor-tip'
				},
				increasefontsize : {
					title : '放大文本',
					text : '增加字体大小',
					cls : 'x-html-editor-tip'
				},
				decreasefontsize : {
					title : '缩小文本',
					text : '减少字体大小',
					cls : 'x-html-editor-tip'
				},
				backcolor : {
					title : '突出显示',
					text : '改变选中的文本的背景色',
					cls : 'x-html-editor-tip'
				},
				forecolor : {
					title : '字体颜色',
					text : '改变选中的文本的颜色',
					cls : 'x-html-editor-tip'
				},
				justifyleft : {
					title : '左对齐',
					text : '左对齐文本',
					cls : 'x-html-editor-tip'
				},
				justifycenter : {
					title : '居中对齐',
					text : '居中对齐文本',
					cls : 'x-html-editor-tip'
				},
				justifyright : {
					title : '右对齐',
					text : '右对齐文本',
					cls : 'x-html-editor-tip'
				},
				insertunorderedlist : {
					title : '项目符号',
					text : '开始一个项目列表',
					cls : 'x-html-editor-tip'
				},
				insertorderedlist : {
					title : '编号',
					text : '开始一个编号列表',
					cls : 'x-html-editor-tip'
				},
				createlink : {
					title : '超链接',
					text : '添加超链接到选中的文本',
					cls : 'x-html-editor-tip'
				},
				sourceedit : {
					title : '编辑源代码',
					text : '切换到源代码的编辑',
					cls : 'x-html-editor-tip'
				}
			}
		});

common.WorkbenchMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				common.WorkbenchMgr.superclass.constructor.call(this);
				this.headerPanel = null;
			},

			getTitle : function() {
				return "";
			},

			createHeader : function(config) {
				this.headerPanel = new Ext.Panel(Ext.apply({
							region : "north",
							border : false,
							bodyStyle : {
								"border-bottom-width" : "0px"
							},
							height : 35
						}, config || {}));
				return this.headerPanel;
			},

			doClose : function() {
				Utils.linkTo(Pages.MAIN_PAGE);
			},

			logout : function() {
				if (confirm(Resources.confirmLogout)) {
					var params = {
						action : SecurityAction.NAME + "."
								+ SecurityAction.LOGOUT
					};
					Service.req(DataUrls.DATA_PROCESS, params, this.onLogout,
							this);
				}
			},

			onLogout : function(res) {
				if (Service.parseResult(res)) {
					Utils.linkTo(Pages.INDEX_PAGE);
				}
			},

			getHeaderConfig : function() {
				return null;
			},

			postRender : function() {
				var o = Ext.apply({
							welcome : true,
							main : true,
							logout : true
						}, this.getHeaderConfig() || {});

				var pDom = this.headerPanel.body.dom;
				var dh = Ext.DomHelper;
				var logoDom = dh.append(pDom, {
							id : "logo",
							tag : "div"
						});
				dh.append(logoDom, {
							tag : "div",
							cls : "title",
							html : this.getTitle()
						});
				var barDom = dh.append(logoDom, {
							tag : "div",
							cls : "bar"
						});
				if (o.welcome && currUser) {
					dh.append(barDom, {
								tag : "div",
								cls : "welcome",
								html : Resources.welcome + ", "
										+ currUser[ds.WebUserItem.REAL_NAME]
							});
				}
				if (o.main) {
					var dom = dh.append(barDom, {
								tag : "div",
								cls : "main",
								html : "[" + Resources.mainPage + "]"
							});
					var mainBtn = Ext.get(dom);
					mainBtn.on("click", this.doClose, this);
					mainBtn.addClassOnOver("labelOver");
				}
				if (o.logout && currUser) {
					var dom = dh.append(barDom, {
								tag : "div",
								cls : "logout",
								html : "[" + Resources.logout + "]"
							});
					var logoutBtn = Ext.get(dom);
					logoutBtn.on("click", this.logout, this);
					logoutBtn.addClassOnOver("labelOver");
				}
			}
		});

common.BasicLoginMgr = function() {
	this.constructor();
};
common.BasicLoginMgr.prototype = {
	constructor : function() {
		this.nameInput = null;
		this.pwdInput = null;
	},

	listenInput : function() {
		this.nameInput.getEl().on("keypress", this.onKeyPress, this);
		this.pwdInput.getEl().on("keypress", this.onKeyPress, this);
	},

	onKeyPress : function(e, t, o) {
		if (e.keyCode == 13) {
			this.doLogin();
		}
	},

	validate : function() {
		var errMsg = ValidationMgr.validate({
					length : {
						range : [{
									value : this.nameInput.getValue(),
									min : 1,
									max : 20,
									msg : Resources.loginName
								}, {
									value : this.pwdInput.getValue(),
									min : 1,
									max : 125,
									msg : Resources.password
								}]
					}
				});
		if (errMsg) {
			Utils.error(errMsg);
			return false;
		}
		return true;
	},

	doLogin : function() {
		if (this.validate()) {
			var params = {
				action : SecurityAction.NAME + "." + SecurityAction.LOGIN
			};
			params[ds.User.NAME] = this.nameInput.getValue();
			params[ds.User.PASSWORD] = this.pwdInput.getValue();
			Service.req(DataUrls.DATA_PROCESS, params, this.onLogin, this);
		}
	},

	onLogin : function(res) {
	}
};

common.OfflineLoginMgr = Ext.extend(common.BasicLoginMgr, {
			constructor : function() {
				common.OfflineLoginMgr.superclass.constructor.call(this);
				this.win = null;
			},

			createForm : function() {
				this.nameInput = new Ext.form.TextField({
							fieldLabel : Resources.loginName
						});
				this.pwdInput = new Ext.form.TextField({
							fieldLabel : Resources.password,
							inputType : "password"
						});
				return GuiUtil.createForm({
							defaults : {
								width : 180
							},
							labelWidth : 80,
							items : [this.nameInput, this.pwdInput]
						});
			},

			show : function() {
				var rendered = true;
				if (!this.win) {
					rendered = false;
					this.win = GuiUtil.createWin({
								title : Resources.offlineLogin,
								width : 300,
								height : 170,
								items : [this.createForm()],
								buttons : [{
											text : Resources.login,
											handler : this.doLogin,
											scope : this
										}, {
											text : Resources.cancel,
											handler : this.hide,
											scope : this
										}]
							});
				}
				this.win.show();
				this.win.center();
				if (!rendered) {
					this.listenInput();
				}
				this.nameInput.focus();
			},

			hide : function() {
				if (this.win) {
					this.win.hide();
					this.nameInput.setValue("");
					this.pwdInput.setValue("");
				}
			},

			onLogin : function(res) {
				if (Service.parseResult(res)) {
					this.hide();
				}
			}
		});

common.EventPipe = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				this.map = new ObjectMap();
				common.EventPipe.superclass.constructor.call(this);
			},

			reg : function(evt, o) {
				this.map.put(o, {
							evt : evt
						});
				o.on(evt, function() {
							var args = [];
							for (var i = 0, len = arguments.length; i < len; ++i) {
								args.push(arguments[i]);
							}
							args.unshift(evt);
							this.fireEvent.apply(this, args);
						}, this);
			},

			fireEvent : function() {
				var evt = arguments[0];
				var args = [];
				for (var i = 0, len = arguments.length; i < len; ++i) {
					args.push(arguments[i]);
				}
				args.push(evt);
				common.EventPipe.superclass.fireEvent.apply(this, args);
			}
		});

common.UserStatusPanel = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				this.content = null;
				this.detailPanel = null;
				this.detailTemplate = null;
				common.UserStatusPanel.superclass.constructor.call(this);
			},

			createContent : function(config) {
				return null;
			},

			getDetailTemplate : function() {
				if (!this.detailTemplate) {
					var s = [];
					s.push('<tpl for=".">');
					s.push("<div class='userDetailImage'>");
					s.push("<img src='{" + ds.User.ICON + "}'/>");
					s.push("</div>");
					s.push("<div class='userDetailInfo'>");

					s.push("<div class='userDetailRow'>");
					s.push("<label class='userDetailLabel'>"
							+ Resources.loginName + ": </label>");
					s.push("<span>{" + ds.User.NAME + "}</span>");
					s.push("</div>");
					s.push("<div class='userDetailSep'></div>");

					s.push("<div class='userDetailRow'>");
					s.push("<label class='userDetailLabel'>"
							+ Resources.realName + ": </label>");
					s.push("<span>{" + ds.User.REAL_NAME + "}</span>");
					s.push("</div>");
					s.push("<div class='userDetailSep'></div>");

					s.push("<div class='userDetailRow'>");
					s.push("<label class='userDetailLabel'>" + Resources.gender
							+ ": </label>");
					s.push("<span>{" + ds.User.GENDER + "}</span>");
					s.push("</div>");
					s.push("<div class='userDetailSep'></div>");

					s.push("<div class='userDetailRow'>");
					s.push("<label class='userDetailLabel'>" + Resources.valid
							+ ": </label>");
					s.push("<span>{" + ds.User.VALID + "}</span>");
					s.push("</div>");
					s.push("<div class='userDetailSep'></div>");

					s.push("</div>");
					s.push('</tpl>');
					this.detailTemplate = new Ext.XTemplate(s.join(""));
				}
				return this.detailTemplate;
			},

			postRender : function() {
				this.detailPanel = new Ext.Panel({
							renderTo : this.content.body.dom,
							border : false,
							header : false,
							width : 400,
							height : 130
						});
			},

			recordToObject : function(user) {
				var o;
				if (user instanceof Ext.data.Record) {
					o = {};
					o[ds.User.NAME] = user.get(ds.User.NAME);
					o[ds.User.REAL_NAME] = user.get(ds.User.REAL_NAME);
					o[ds.User.GENDER] = user.get(ds.User.GENDER);
					o[ds.User.VALID] = user.get(ds.User.VALID);
					o[ds.User.ICON] = user.get(ds.User.ICON);
				} else {
					o = Ext.apply({}, user);
				}
				return o;
			},

			syncDetail : function(user) {
				var detailEl = this.detailPanel.body;
				var o = {};
				var icon;
				if (user) {
					o = this.recordToObject(user);
					var gender = o[ds.User.GENDER];
					o[ds.User.GENDER] = data.GenderName[gender];
					o[ds.User.VALID] = o[ds.User.VALID]
							? Resources.yes
							: Resources.no;
					icon = o[ds.User.ICON];
				} else {
					o[ds.User.NAME] = "??";
					o[ds.User.REAL_NAME] = "??";
					o[ds.User.GENDER] = "??";
					o[ds.User.VALID] = "??";
				}
				if (!icon) {
					icon = common.Constants.noUserIcon;
				}
				o[ds.User.ICON] = common.Constants.userIconDir + icon;
				this.getDetailTemplate().overwrite(detailEl, o);
			}
		});

common.PortraitField = Ext.extend(Ext.form.TriggerField, {
			constructor : function(config) {
				this.dir = common.Constants.userIconDir;
				this.mask = null;
				this.portraitPanel = null;
				common.PortraitField.superclass.constructor.call(this, Ext
								.apply(config || {}, {
											hideTrigger : true
										}));
				this.on("render", this.initMask, this);
			},

			initMask : function() {
				if (this.rendered && !this.mask) {
					var el = this.getEl();
					var left = el.getXY()[0] - el.parent().getXY()[0];
					this.mask = Ext.DomHelper.append(el.parent().dom, {
								tag : "img",
								cls : "portraitMask",
								src : this.value,
								style : "width:" + this.width + ";height:"
										+ this.height + ";left:" + left
							});
					Ext.get(this.mask).on("click", this.onTriggerClick, this);
					this.updatePortrait();
				}
			},

			setValue : function(v) {
				common.PortraitField.superclass.setValue.call(this, v);
				this.updatePortrait();
			},

			setRawValue : function(v) {
				common.PortraitField.superclass.setRawValue.call(this, v);
				this.updatePortrait();
			},

			getValue : function() {
				var value = common.PortraitField.superclass.getValue.call(this);
				value = this.repairValue(value);
				return value;
			},

			updatePortrait : function() {
				Ext.getDom(this.mask).src = this.dir
						+ this.repairValue(this.getValue());
			},

			repairValue : function(value) {
				if (!value || value == "") {
					return common.Constants.noUserIcon;
				}
				return value;
			},

			onTriggerClick : function() {
				var inited = true;
				if (!this.portraitPanel) {
					inited = false;
					var maskEl = Ext.get(this.mask);
					var xy = maskEl.getXY();
					var size = maskEl.getSize();
					var w = 340;
					var h = 150;
					var x = xy[0] + size.width - w / 2;
					var y = xy[1] + size.height;
					this.portraitPanel = new Ext.Panel({
								renderTo : document.body,
								header : false,
								width : w,
								height : h,
								x : x,
								y : y,
								style : {
									position : "absolute",
									"overflow-y" : "auto",
									"z-index" : 100000
								},
								bodyCssClass : "portraitBg"
							});
					Ext.fly(document.body).on("mousedown",
							this.hidePortraitPanel, this);
				}
				this.portraitPanel.show();
				if (!inited) {
					this.portraitPanel.getEl().on("mousedown",
							function(e, t, o) {
								e.stopEvent();
							});
					var dh = Ext.DomHelper;
					var docFrag = document.createDocumentFragment();
					for (var i = 1; i <= 12; ++i) {
						var div = document.createElement("div");
						var el = Ext.fly(div);
						el.addClass("portraitUnit");
						el.addClassOnOver("portraitUnitOver");
						el.on("click", this.onPortraitSelected, this);
						var icon = "icon" + i + ".gif";
						dh.append(div, {
									tag : "img",
									src : this.dir + icon,
									value : icon
								});
						docFrag.appendChild(div);
					}
					this.portraitPanel.body.dom.appendChild(docFrag);
				}
			},

			onPortraitSelected : function(e, t, o) {
				this.setValue(t.value);
				this.hidePortraitPanel();
			},

			hidePortraitPanel : function() {
				if (this.portraitPanel) {
					this.portraitPanel.hide();
				}
			}
		});

Ext.override(Ext.grid.GridView, {
			sortAscText : Resources.sortAscText,
			sortDescText : Resources.sortDescText,
			columnsText : Resources.columnsText
		});