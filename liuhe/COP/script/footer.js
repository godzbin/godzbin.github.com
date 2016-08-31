

var Footer = function(parentNode) { 
	this.parentNode = parentNode;
	this.panelId = "footerPanel";
	this.mainPanel = function() {
		var panel = Ext.create("Ext.panel.Panel", {
			border: 0,
			height: 80,
			style: {
				textAlign: "center"
			},
			items: [this.line(), this.label()]
		});
		return panel;
	};
	this.line = function() {
		var line = Ext.create("Ext.panel.Panel", {
			width: "100%",
			columnWidth: 1,
			border: 0,
			padding: 0,
			cls: "line",
			// html:"<hr/>",
			height: 1
		});
		return line;
	};
	this.label = function() {
		var label = Ext.create("Ext.form.Label", {
			style: {
				color: "#fff",
				'line-height': "30px"
			},
			text: "关于我们 | 联系我们 "
		});
		return label;
	};
}