// 编辑器对象
// 
/**
 * [Editor description]
 * @param {[type]} parentNode [父节点] 
 * @param {[type]} name       [编辑器标识]
 * @param {[type]} size       [{width,height} 编辑器高和宽]
 */
function Editor(configs) {
	this.configs = configs;
	this.parentNode = configs.parentNode;
	this.name = configs.name;
	this.labelName = configs.labelName;
	this.size = configs.size || {
		width: "100%",
		height: "100%"
	};
	this.getValue = function() {

	};
	this.createPanel = function() {
		this.mainPanel = Ext.create("Ext.panel.Panel", {
			node: this,
			border: 0,
			width: "100%",
			height: 325,
			layout: "vbox",
			items: [{
				margin: "10 0",
				xtype: "label",
				width: "100%",
				text: this.labelName,
				style: "font-size: 14px; color: #fff"
			}, {
				xtype: "panel",
				border: 0,
				width: "100%",
				height: 300,
				html: '<script id="' + this.name + '" type="text/plain" class="ueditor" style="background-color: rgba(0,0,0,.3);width:100%;height:200px;"></script>'
			}]
		});

	};
	this.createPanel();
	return this.mainPanel;
}