var view = {
	init: function() {
		this.Container.createWin();
	},
	Container: {
		createWin: function() {
			Ext.create('Ext.container.Viewport', {
				id: configs.STRUCTURE.MAIN_VIEW,
				layout: "border",
				padding: 0,
				margin: 0,

				style: {
					backgroundColor: "#D6EAE9",
				},
				items: [view.Top.createTop()]
			}).show();
		},
	},
	Top: {
		createTop: function() {
			return Ext.create("Ext.container.Container", {
				id: configs.TOP_VIEW,
				region: "north",
				layout: 'hbox',
				height: 100,
				border: 0,
				padding: 0,
				style: {
					backgroundColor: "#fff",
				},
				items: [this.createLogo(),this.createTab()]
			});
		},
		createLogo: function() {
			return Ext.create("Ext.container.Container", {
				width: 200,
				height: 100,
				border: 0,
				padding: 0,
				// html: configs.PAGE_NAME,
				style: {
					backgroundColor: "#ff0",
					margin: 0,
					color: "#0ff",
					fontSize: "2em",
				}
			});
		},
		createTab: function() {
			return Ext.create("Ext.tab.Panel", {
				height: 80,
				border: 0,
				padding: 0,
				style: {
					backgroundColor: "#000",
					color: "#0ff",
					fontSize: "2em",
				},
				items: configs.MAIN_NAV
			});
		}
	},
	Bottom: {

		left: function(){

		}
	}
}