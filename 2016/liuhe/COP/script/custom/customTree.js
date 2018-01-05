/**
 *  godz create 20160819
 */
// 自定义树

Ext.onReady(function() {
	//Toopitp
	Ext.tip.QuickTipManager.init();
	//Model
	Ext.define('MyTreeModel', {
		extend: 'Ext.data.Model',
		fields: ['text', 'id', 'leaf', 'caitNo']
	});

	//Store
	Ext.define("MyTreeStore", {
		extend: "Ext.data.TreeStore",
		model: 'MyTreeModel'
	});

	var MyTreeStore = Ext.create("MyTreeStore");

	Ext.define("MyTreePanel", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 24,
				icon: "resources/images/more.png",
				iconCls: "more",
				tooltip: '更多操作',
				handler: function(gridView, rowIndex, colIndex, column, e, record) {
					gridView.getSelectionModel().select(record);
					me.that.menuPanelShow(e, record);
				}
			}];
			me.callParent();
		}
	});
	Ext.define("MyTreePanel2", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 50,
				items: [{
					icon: "resources/images/search.png",
					iconCls: "more",
					tooltip: '查看服务',
					margin: "5 5",
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openCenterPanel(e, record);
						// me.that.menuPanelShow(e, record);
					},
				},{
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '定制服务',
					getClass: function(v, icon, column) {

						if (me.that.userInfo["_CONTENT"]) {
							var province = me.that.getProvince();
							if (province === "深圳中心") {
								return "moreHide";
							}
						}
						return "more";
					},
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openServiceMade();
						// me.that.menuPanelShow(e, record);
					},
				}, {
					xtype: 'actioncolumn',
					width: 24,
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '管理服务',
					getClass: function() {

						if (me.that.userInfo["_CONTENT"]) {
							var province = me.that.getProvince();
							if (province !== "深圳中心") {
								return "moreHide";
							}
						}
						return "more";
					},
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openServiceDirectoryManage();
						// me.that.menuPanelShow(e, record);
					},
				}],
				renderer: function(v, record, column) {
					if (!column.data.leaf) {
						record.style = "display: none;";
					}
					return record;
				}
			}];
			me.callParent();
		}
	});
	Ext.define("MyTreePanel3", {
		extend: 'Ext.tree.Panel',
		store: MyTreeStore,
		hideHeaders: true,
		rootVisible: true,

		initComponent: function() {
			var me = this;
			//定义列
			me.columns = [{
				xtype: 'treecolumn',
				dataIndex: 'text',
				flex: 1,
			}, {
				xtype: 'actioncolumn',
				width: 24,
				items: [{
					icon: "resources/images/edit.png",
					iconCls: "more",
					tooltip: '定制服务',
					handler: function(gridView, rowIndex, colIndex, column, e, record) {
						gridView.getSelectionModel().select(record);
						me.that.sceneId = record.data.nodeData["_id"];
						me.that.openCenterPanel(e, record);
						// me.that.menuPanelShow(e, record);
					},
				}],
				renderer: function(v, record, column) {
					if (!column.data.leaf) {
						record.style = "display: none;";
					}
					return record;
				}
			}];
			me.callParent();
		}
	});
});