

function Page(pageId) {
	this.panelId = pageId;
	this.loading = false;
	this.mainPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			id: this.panelId,
			border: 0,
			items: []
		});
		return panel;
	};
	this.getMainPanel = function() {
		var panel = Ext.getCmp(this.panelId);
		return panel;
	};
	this.mainPanelHide = function() {
		var panel = this.getMainPanel();
		if (panel) {
			panel.hide();
		}
	};
	this.mainPanelShow = function() {
		var panel = this.getMainPanel();
		if (panel) {
			panel.show();
		}
	};
}
Page.prototype = {
	
}