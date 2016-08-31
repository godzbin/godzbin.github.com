Ext.ns("P_main");

Ext.onReady(function() {
			P_main.pipe = new common.EventPipe();
			P_main.LogMgr = new P_main.LogMgrClass();
			P_main.Service = new P_main.ServiceClass();
			P_main.InitGroup.run();
			var postInitFunc = function() {
				new P_main.GuiMgr().render();
			}
			P_main.PreLoadRegistry.getInstance().run(postInitFunc);
		});

P_main.Event = {
	CONSOLE_LOG : "P_main_CONSOLE_LOG",
	DEBUG_LOG : "P_main_DEBUG_LOG",
	CLOSE_DEBUG : "P_main_CLOSE_DEBUG",
	OPEN_EDITOR : "P_main_OPEN_EDITOR",
	CLOSE_EDITOR : "P_main_CLOSE_EDITOR",
	DATA_EXCHANGE : "P_main_DATA_EXCHANGE"
};

P_main.PreLoadRegistry = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.PreLoadRegistry.superclass.constructor.call(this);
				this.mgrMap = {};
			},

			reg : function(mgr) {
				this.mgrMap[mgr.getXType()] = mgr;
			},

			run : function(postRunner) {
				for (var k in this.mgrMap) {
					this.mgrMap[k].run();
				}
				var ref = this;
				this.handle = setInterval(function() {
							ref.checkFinished();
						}, 300);
				this.postRunner = postRunner;
			},

			notify : function(xtype) {
				this.mgrMap[xtype] = null;
			},

			checkFinished : function() {
				var inited = true;
				for (var k in this.mgrMap) {
					if (this.mgrMap[k]) {
						inited = false;
						break;
					}
				}
				if (inited) {
					clearInterval(this.handle);
					if (this.postRunner) {
						this.postRunner();
					}
				}
			},

			getXType : function() {
				return P_main.PreLoadRegistry.XTYPE;
			}
		});
P_main.PreLoadRegistry.XTYPE = "P_main.PreLoadRegistry";
Utils.addInstanceFunc(P_main.PreLoadRegistry);

P_main.LocalCache = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.LocalCache.superclass.constructor.call(this);
				this.__map = {};
			},

			addToCache : function(key, value) {
				this.__map[key] = value;
			},

			getFromCache : function(key) {
				return this.__map[key];
			},

			getXType : function() {
				return P_main.LocalCache.XTYPE;
			}
		});
P_main.LocalCache.XTYPE = "P_main.LocalCache";
Utils.addInstanceFunc(P_main.LocalCache);

P_main.LogType = {
	END : -1,
	INFO : 1,
	WARNING : 2,
	ERROR : 3
};

P_main.LogMgrClass = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.LogMgrClass.superclass.constructor.call(this);
				P_main.pipe.reg(P_main.Event.CONSOLE_LOG, this);
			},

			__checkType : function(type) {
				switch (type) {
					case P_main.LogType.END :
					case P_main.LogType.INFO :
					case P_main.LogType.WARNING :
					case P_main.LogType.ERROR :
						break;
					default :
						throw new Error("Invalid log type: " + type);
				}
			},

			debug : function(config, type, msg) {
				this.__checkType(type);
				P_main.pipe
						.fireEvent(P_main.Event.DEBUG_LOG, config, type, msg);
			},

			trace : function(type, msg) {
				this.__checkType(type);
				P_main.pipe.fireEvent(P_main.Event.CONSOLE_LOG, type, msg);
			},

			info : function(msg) {
				this.trace(P_main.LogType.INFO, msg);
			},

			debugInfo : function(config, msg) {
				this.debug(config, P_main.LogType.INFO, msg);
			},

			warning : function(msg) {
				this.trace(P_main.LogType.WARNING, msg);
			},

			debugWarning : function(config, msg) {
				this.debug(config, P_main.LogType.WARNING, msg);
			},

			error : function(msg) {
				this.trace(P_main.LogType.ERROR, msg);
			},

			debugError : function(config, msg) {
				this.debug(config, P_main.LogType.ERROR, msg);
			},

			getXType : function() {
				return P_main.LogMgrClass.XTYPE;
			}
		});
P_main.LogMgrClass.XTYPE = "P_main.LogMgrClass";

P_main.Env = {
	ID_SEP : ",",
	DATE_FORMAT : "Y-m-d h:i:s",
	boderStyle : "1px solid #D0D0D0"
};

P_main.sysReq = function(funcName, funcParams, callback, scope, others) {
	var params = {
		FUNC : funcName,
		FUNC_PARAMS : funcParams ? Ext.encode(funcParams) : null
	};
	P_main.Service.req(DataUrls.DATA_PROCESS, params, callback, scope, others);
};

P_main.envReq = function(envName, funcName, funcParams, callback, scope, others) {
	var params = {
		FUNC : EnvAction.INVOKE_FUNC,
		FUNC_PARAMS : Ext.encode({
					ENV : envName,
					FUNC : funcName,
					FUNC_PARAMS : funcParams ? Ext.encode(funcParams) : null
				})
	};
	P_main.Service.req(DataUrls.DATA_PROCESS, params, callback, scope, others);
};

P_main.onNotify = function(msg, state) {
	if (state == ws.ResultState.ERROR) {
		P_main.LogMgr.error(msg);
	} else if (msg) {
		P_main.LogMgr.info(msg);
	}
};

P_main.lockUpload = function() {
	Ext.MessageBox.wait(P_sch.Res.attachUploading, P_sch.Res.pleaseWait);
	ScreenLock.lockScreen();
};

P_main.unlockUpload = function() {
	ScreenLock.unlockScreen();
	Ext.MessageBox.hide();
};

P_main.createDownloadForm = function(formId, action, otherFields) {
	var funcFieldId = "func" + Utils.getId();
	var paramsFieldId = "params" + Utils.getId();
	var fields = [{
				id : funcFieldId,
				name : "FUNC"
			}, {
				id : paramsFieldId,
				name : "FUNC_PARAMS"
			}];
	if (otherFields) {
		for (var i = 0; i < otherFields.length; ++i) {
			fields.push(otherFields[i]);
		}
	}
	var form = Utils.createForm({
				id : formId || "form" + Utils.getId(),
				method : "post",
				action : action || DataUrls.DATA_PROCESS,
				target : Utils.createSubmitFrame(),
				style : "display:none;position:absolute;",
				fields : fields
			});
	return {
		funcField : Ext.getDom(funcFieldId),
		paramsField : Ext.getDom(paramsFieldId),
		form : form,
		submit : function(func, params) {
			this.funcField.value = func;
			if (!params) {
				params = {};
			}
			if (!params.CALLBACK) {
				params.CALLBACK = "window.parent.P_main.onNotify";
			}
			this.paramsField.value = Ext.encode(params);
			this.form.submit();
		}
	};
};

P_main.Res = Ext.apply({
			others : "其他"
		}, Resources);

P_main.InitGroup = {
	funcs : [],

	reg : function(func) {
		this.funcs.push(func)
	},

	run : function() {
		for (var i = 0; i < this.funcs.length; ++i) {
			this.funcs[i].call();
		}
	}
};

P_main.ServiceClass = Ext.extend(ws.ServiceClass, {
			constructor : function() {
				P_main.ServiceClass.superclass.constructor.call(this);
			},

			logInfo : function(msg) {
				P_main.LogMgr.info(msg);
			},

			logError : function(msg) {
				P_main.LogMgr.error(msg);
			},

			getXType : function() {
				return P_main.ServiceClass;
			}
		});
P_main.ServiceClass.XTYPE = "P_main.ServiceClass";

P_main.NavigateMgr = Ext.extend(common.BasicTree, {
			constructor : function() {
				P_main.NavigateMgr.superclass.constructor.call(this);
				this.mgrs = [];
			},

			reg : function(mgr) {
				if (this.mgrs.indexOf(mgr) == -1) {
					this.mgrs.push(mgr);
				}
			},

			createTree : function(config) {
				var content = P_main.NavigateMgr.superclass.createTree.call(
						this, Ext.apply({
									animate : false,
									trackMouseOver : false,
									rootVisible : false
								}, config || {}));
				content.on("contextmenu", this.__onContextMenu, this);
				content.on("dblclick", this.__onDblClick, this);
				content.on("expandnode", this.__onExpandNode, this);
				content.on("afterrender", this.__onAfterRender, this);
				return content;
			},

			__notifyMgr : function(funcName, node) {
				if (node) {
					node.select();
				}
				var args = [];
				for (var i = 1; i < arguments.length; ++i) {
					args.push(arguments[i]);
				}
				for (var i = 0; i < this.mgrs.length; ++i) {
					var mgr = this.mgrs[i];
					if (node) {
						if (mgr.isNodeOwner(node)) {
							mgr[funcName].apply(mgr, args);
							return;
						}
					} else {
						mgr[funcName].apply(mgr, args);
					}
				}
			},

			__onContextMenu : function(node, event) {
				this.__notifyMgr("showContextMenu", node, event);
			},

			__onDblClick : function(node, event) {
				this.__notifyMgr("onNodeDblClick", node, event);
			},

			__onExpandNode : function(node) {
				this.__notifyMgr("onNodeExpanded", node);
			},

			__onAfterRender : function() {
				this.__notifyMgr("onAfterRender", null);
			},

			createRootNode : function() {
				var rootNode = P_main.NavigateMgr.superclass.createRootNode
						.call(this);
				for (var i = 0; i < this.mgrs.length; ++i) {
					var mgr = this.mgrs[i];
					rootNode.appendChild(mgr.getOriginalNode());
				}
				return rootNode;
			},

			getXType : function() {
				return P_main.NavigateMgr.XTYPE;
			}
		});
P_main.NavigateMgr.XTYPE = "P_main.NavigateMgr";
Utils.addInstanceFunc(P_main.NavigateMgr);

P_main.ContentTabMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.ContentTabMgr.superclass.constructor.call(this);
				P_main.pipe.on(P_main.Event.OPEN_EDITOR, this.__onEditorOpened,
						this);
				P_main.pipe.on(P_main.Event.CLOSE_EDITOR,
						this.__onEditorClosed, this);
				this.tab2MgrMap = new ObjectMap();
				this.mgrClassMap = {};
				this.mgrs = [];
				this.currMgr = null;
			},

			reg : function(mgrClass) {
				this.mgrClassMap[mgrClass.XTYPE] = mgrClass;
			},

			__onEditorClosed : function(mgr) {
				this.__removeMgr(mgr);
			},

			__onEditorOpened : function(mgrType, data) {
				for (var i = 0; i < this.mgrs.length; ++i) {
					var mgr = this.mgrs[i];
					if (mgr.getXType() == mgrType && mgr.isDataOwner(data)) {
						this.content.activate(mgr.getContent());
						mgr.resetData(data);
						return;
					}
				}
				var mgrClass = this.mgrClassMap[mgrType];
				if (!mgrClass) {
					throw new Error("No mgr class found by type: " + mgrType);
				}
				this.__addMgr(mgrClass, data);
			},

			__addMgr : function(mgrClass, data) {
				var mgr = new mgrClass();
				this.mgrs.push(mgr);
				mgr.setData(data);
				mgr.preInit();
				var item = mgr.getContent();
				this.tab2MgrMap.put(item, mgr);
				item.on("beforeclose", this.__onBeforeTabClose, this);
				this.content.add(item);
				mgr.postInit();
				this.content.activate(item);
			},

			__removeMgr : function(mgr) {
				var idx = this.mgrs.indexOf(mgr);
				if (idx == -1) {
					return;
				}
				this.mgrs.splice(idx, 1);
				mgr.clear();
				this.tab2MgrMap.remove(mgr);
				this.content.remove(mgr.getContent(), true);
			},

			__onBeforeTabClose : function(p) {
				var mgr = this.tab2MgrMap.get(p);
				if (mgr.checkClose()) {
					this.__removeMgr(mgr);
				}
				return false;
			},

			createContent : function(config) {
				this.content = new Ext.TabPanel(Ext.apply({
							activeTab : 0
						}, config || {}));
				this.content.on("tabchange", this.__onTabChanged, this);
				this.content.on("contextmenu", this.__onContextMenu, this);
				return this.content;
			},

			__onTabChanged : function(tabPanel, tab) {
				var idx = tabPanel.items.indexOf(tab);
				var newMgr = null;
				if (idx > -1) {
					newMgr = this.mgrs[idx];
				}
				if (newMgr == this.currMgr) {
					return;
				}
				if (this.currMgr) {
					this.currMgr.setActivate(false);
				}
				this.currMgr = newMgr;
				if (this.currMgr) {
					this.currMgr.setActivate(true);
				}
			},

			__getContextMenu : function() {
				this.closeItem = new Ext.menu.Item({
							text : P_main.Res.close,
							handler : this.__closeSelf,
							scope : this
						});
				this.closeOthersItem = new Ext.menu.Item({
							text : P_main.Res.close + P_main.Res.others,
							handler : this.__closeOthers,
							scope : this
						});
				this.closeAllItem = new Ext.menu.Item({
							text : P_main.Res.close + P_main.Res.all,
							handler : this.__closeAll,
							scope : this
						});
				if (!this.contextMenu) {
					this.contextMenu = new Ext.menu.Menu({
								items : [this.closeItem, this.closeOthersItem,
										this.closeAllItem]
							});
				}
				return this.contextMenu;
			},

			__closeSelf : function() {
				var tab = this.content.getActiveTab();
				this.__closeItems([tab]);
			},

			__closeOthers : function() {
				var tab = this.content.getActiveTab();
				var items = this.content.items;
				var tabs = [];
				for (var i = 0; i < items.length; ++i) {
					var item = items.get(i);
					if (item != tab) {
						tabs.push(item);
					}
				}
				this.__closeItems(tabs);
			},

			__closeAll : function() {
				var items = this.content.items;
				var tabs = [];
				for (var i = 0; i < items.length; ++i) {
					tabs.push(items.get(i));
				}
				this.__closeItems(tabs);
			},

			__closeItems : function(items) {
				for (var i = 0; i < items.length; ++i) {
					var item = items[i];
					var idx = this.content.items.indexOf(item);
					if (idx > -1) {
						var mgr = this.mgrs[idx];
						if (mgr) {
							this.__onEditorClosed(mgr);
						}
					}
				}
			},

			__onContextMenu : function(tabPanel, tab, event) {
				this.content.activate(tab);
				this.__getContextMenu().showAt(event.getXY());
			},

			getXType : function() {
				return ContentTabMgr.XTYPE;
			}
		});
P_main.ContentTabMgr.XTYPE = "P_main.ContentTabMgr";
Utils.addInstanceFunc(P_main.ContentTabMgr);

P_main.ConsoleTabMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_main.ConsoleTabMgr.superclass.constructor.call(this);
				this.mgrs = [];
			},

			reg : function(mgr) {
				if (this.mgrs.indexOf(mgr) == -1) {
					this.mgrs.push(mgr);
				}
				if (this.content) {
					var item = mgr.getContent();
					this.content.add(item);
					this.content.activate(item);
				}
			},

			unreg : function(mgr) {
				var idx = this.mgrs.indexOf(mgr);
				if (idx == -1) {
					return;
				}
				if (this.content) {
					var item = mgr.getContent();
					this.content.remove(item, true);
					this.mgrs.splice(idx, 1);
					var items = this.content.items;
					if (items.getCount() > 0) {
						this.content.activate(items.get(0));
					}
				}
			},

			activate : function(item) {
				this.content.activate(item);
			},

			createContent : function(config) {
				var items = [];
				for (var i = 0; i < this.mgrs.length; ++i) {
					items.push(this.mgrs[i].getContent());
				}
				this.content = new Ext.TabPanel(Ext.apply({
							activeTab : 0,
							items : items
						}, config || {}));
				return this.content;
			},

			getXType : function() {
				return P_main.ConsoleTabMgr.XTYPE;
			}
		});
P_main.ConsoleTabMgr.XTYPE = "P_main.ConsoleTabMgr";
Utils.addInstanceFunc(P_main.ConsoleTabMgr);

P_main.GuiMgr = Ext.extend(Ext.util.Observable, {
	constructor : function() {
		P_main.GuiMgr.superclass.constructor.call(this);
	},

	createContent : function() {
		return new Ext.Panel({
					layout : "border",
					items : [
							P_main.NavigateMgr.getInstance().createContent({
										header : false,
										region : "west",
										border : false,
										width : 230
									}),
							P_main.ContentTabMgr.getInstance().createContent({
										region : "center",
										border : false,
										style : {
											"border-left" : P_main.Env.boderStyle
										}
									}),
							P_main.ConsoleTabMgr.getInstance().createContent({
										region : "south",
										border : false,
										height : 200,
										style : {
											"border-top" : P_main.Env.boderStyle
										}
									})],
					tbar : this.createTBar(),
					bbar : this.createBBar()
				});
	},

	createTBar : function() {
		return [{
					text : Resources.file
				}, {
					text : Resources.edit2
				}, {
					text : Resources.view
				}, {
					text : Resources.help
				}]
	},

	createBBar : function() {
		return ["->", "progress infomation..."]
	},

	render : function() {
		Utils.disableBackspace();
		ScreenLock.lockAjax();
		new Ext.Viewport({
					layout : "fit",
					items : [this.createContent()]
				});
	},

	getXType : function() {
		return P_main.GuiMgr;
	}
})
P_main.GuiMgr.XTYPE = "P_main.GuiMgr";