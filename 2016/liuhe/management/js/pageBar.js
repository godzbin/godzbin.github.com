var common = common || {};
common.PageEvent = {
	PAGING: "PAGING"
};
Resources = {
	firstPage: "首页",
	lastPage: "最后一页",
	refresh: "刷新"
};
common.PageBar = Ext.define("common.page.PageBar", {
	mixins: {
		observable: 'Ext.util.Observable'
	},
	constructor: function(config) {
		this.pageCountData = [{
			name: "20",
			value: 20
		}, {
			name: "50",
			value: 50
		}, {
			name: "100",
			value: 100
		},{
			name: "200",
			value: 200
		},{
			name: "500",
			value: 500
		}];
		this.pageCount = 20;
		this.mixins.observable.constructor.call(this, config);
		Ext.apply(this, config || {});
		this.currPage = 1;
		this.totalPages = 0;
		this.totalCount = 0;
		// for (var evt in common.PageEvent) {
		// 	this.setListeners(common.PageEvent[evt]);
		// }
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

	createItems: function(o) {
		var config = Ext.apply({
			refresh: false,
			pageCount: true,
			first: true,
			last: true
		}, o || {});
		this.currPageItem = new Ext.form.TextField({
			width: 40,
			style: {
				'text-align':'center',
				margin: "2 0 0 0"
			},
			value: this.currPage,
			disabled: false
		});
		this.currPageItem.on("render", function() {
			this.currPageItem.getEl().on("keydown",
				this.onKeyPress, this);
		}, this);
		this.currPageItem.on("change", this.onPageChanged, this);
		this.totalPageItem = new Ext.Toolbar.TextItem({
			id: this.id + "totalPages",
			text: "" + this.totalPages
		});
		this.totalCountItem = new Ext.Toolbar.TextItem({
			id: this.id + "totalCount",
			text: "(" + this.totalCount + ")"
		});
		if (config.first) {
			this.firstBtn = new Ext.Button({
				iconCls: "x-tbar-page-first",
				tooltip: Resources.firstPage,
				disabled: true,
				handler: this.toFirstPage,
				scope: this
			});
		}
		this.preBtn = new Ext.Button({
			iconCls: "x-tbar-page-prev",
			tooltip: Resources.prePage,
			disabled: true,
			handler: this.toPrePage,
			scope: this
		});
		this.nextBtn = new Ext.Button({
			iconCls: "x-tbar-page-next",
			tooltip: Resources.nextPage,
			disabled: true,
			handler: this.toNextPage,
			scope: this
		});
		if (config.last) {
			this.lastBtn = new Ext.Button({
				iconCls: "x-tbar-page-last",
				tooltip: Resources.lastPage,
				disabled: true,
				handler: this.toLastPage,
				scope: this
			});
		}

		var rs = [];
		rs.push("->");
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
				iconCls: "a_refresh",
				tooltip: Resources.refresh,
				disabled: true,
				handler: this.refresh,
				scope: this
			});
			rs.push("-");
			rs.push(this.refreshBtn);
		}
		if (config.pageCount) {
			this.pageCountCombo = Ext.create("Ext.form.ComboBox", {
				width: 80,
				editable: false,
				store: Ext.create("Ext.data.Store", {
					fields: ["name", "value"],
					data: this.pageCountData
				}),
				value: this.pageCount,
				displayField: 'value',
				valueField: 'name',
			});
			this.pageCountCombo.on("select", this.onPageCountChanged,
				this);
			rs.push("-");
			rs.push(this.pageCountCombo);
		}
		return rs;
	},

	onPageCountChanged: function() {
		var v = this.pageCountCombo.getValue();
		if (v != this.pageCount) {
			this.pageCount = v;
			this.currPage = 1;
			this.refresh();
			this.setTotalCount(this.totalCount);
		}
	},

	onKeyPress: function(e, t, o) {
		if (e.keyCode == 13) {
			this.currPageItem.getEl().blur();
		}
	},

	onPageChanged: function() {
		var page = parseInt(this.currPageItem.getValue());
		if (page && page.length == 0) {
			this.currPageItem.setValue(this.currPage);
		} else {
			this.setCurrPage(page);
		}
	},

	toFirstPage: function() {
		this.setCurrPage(1);
	},

	toLastPage: function() {
		this.setCurrPage(this.totalPages);
	},

	toPrePage: function() {
		if (this.currPage > 1) {
			this.setCurrPage(this.currPage - 1);
		}
	},

	toNextPage: function() {
		if (this.currPage < this.totalPages) {
			this.setCurrPage(this.currPage + 1);
		}
	},

	refresh: function() {
		this.currPageItem.setValue(this.currPage);
		this.fireEvent(common.PageEvent.PAGING, this.currPage, this.pageCount, this);
	},
	setTotalCount: function(v) {
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

	updateCmpsState: function() {
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

	setCurrPage: function(v, ignoreRefresh) {
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

	setPageCount: function(v) {
		if (this.pageCount != v) {
			this.pageCount = v;
			this.refresh();
		}
	},

	getPageCount: function() {
		return this.pageCount;
	},

	getTotalPages: function() {
		return this.totalPages;
	},

	getCurrPage: function() {
		return this.currPage;
	},

	getStart: function() {
		var start = (this.getCurrPage() - 1) * this.pageCount;
		if (start < 0) {
			Utils.error("Error start!");
			return;
		}
		return start;
	},

	createToolbar: function() {
		return new Ext.Toolbar({
			border: 0,
			items: this.createItems()
		});
	},

	reset: function(ignoreRefresh) {
		this.setCurrPage(1, ignoreRefresh);
		this.setTotalCount(0);
	}
});