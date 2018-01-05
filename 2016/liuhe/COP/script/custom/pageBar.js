/**
 *
 *	create godz 
 *	2016 08 26
 *
 *
 * 	自定义Ext  分页控件
 */
Ext.onReady(function() {

	Ext.define("custom.PageBar", {
		extend: "Ext.panel.Panel",
		initComponent: function() {
			var me = this;
			me.currentPage = 1;
			me.total = 0;
			me.count = me.count || 10;
			me.items = me.createPageBar();
			me.callParent();
		},
		createPageBar: function() {
			this.totalLabel = Ext.create("Ext.form.Label", {
				text: "共 " + this.total + " 条",
			});
			this.firstButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: "<<",
				tooltip: "首页",
				handler: Ext.bind(this.changePageTofirst, this)
			});
			this.upButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: "<",
				tooltip: "上一页",
				handler: Ext.bind(this.changePageToUp, this)
			});
			var pages = this.getPages();
			this.currentPageLabel = Ext.create("Ext.form.Label", {
				text: " " + this.currentPage,
				tooltip: "当前页",
			});
			this.spritLabel = Ext.create("Ext.form.Label", {
				text: " /   " + pages,
				tooltip: "总页数",
			});

			this.downButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: ">",
				tooltip: "下一页",
				handler: Ext.bind(this.changePageToDown, this)
			});
			this.lastButton = Ext.create("Ext.button.Button", {
				baseCls: "x-btn base-btn",
				text: ">>",
				tooltip: "尾页",
				handler: Ext.bind(this.changePageToLast, this)
			});
			this.countLabel = Ext.create("Ext.form.Label", {
				text: "每页 " + this.count + " 行"
			});
			var items = [this.totalLabel, this.firstButton, this.upButton, this.currentPageLabel, this.spritLabel, this.downButton, this.lastButton, this.countLabel];
			return items;
		},
		getPages: function() {
			return Math.ceil(this.total / this.count);
		},
		changePageTofirst: function() {
			this.currentPage = 1;
			this.refresh();
		},
		changePageToUp: function() {

			if (this.currentPage > 1) {
				this.currentPage = this.currentPage - 1;
				this.refresh();
			}
		},
		changePageToDown: function() {
			var pages = this.getPages();
			if (this.currentPage < pages) {
				this.currentPage = this.currentPage + 1;
				this.refresh();
			}
		},
		changePageToLast: function() {
			var pages = this.getPages();
			if (this.currentPage != pages) {
				this.currentPage = pages;
				this.refresh();
			}
		},
		refresh: function() {
			this.refreshPanel();
			this.fireEvent("paging", this.currentPage, this.count, this);
		},
		getCount: function() {
			return this.count;
		},
		getTotal: function() {
			return this.total;
		},
		getCurrentPage: function() {
			return this.currentPage;
		},
		getStart: function() {
			return (this.currentPage - 1) * this.count;
		},
		setCount: function(count) {
			count = parseInt(count) || 0;
			this.count = count;
			this.countLabel.setText();
			this.refreshPanel();
		},
		setCurrentPage: function(value){
			this.currentPage = value || 1;
			this.refreshPanel();
		},
		setTotal: function(total) {
			total = parseInt(total) || 0;
			this.total = total;
			this.refreshPanel();
		},
		refreshPanel: function() {
			var pages = this.getPages();
			this.totalLabel.setText("共 " + this.total + " 条");
			this.currentPageLabel.setText(this.currentPage);
			this.spritLabel.setText(" /  " + pages);
		},
	});

});