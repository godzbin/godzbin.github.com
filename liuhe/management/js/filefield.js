var common = common || {};
common.filefieldMsg = {
	selectFile: "选择文件",
	'delete': "删除",
	cancelDelete: "还原",
};
common.filefield = Ext.define("common.page.Filefield", {
	mixins: {
		observable: 'Ext.util.Observable'
	},
	constructor: function(config) {
		this.name = config.name || "";
		this.fieldLabel = config.fieldLabel || "";
		this.mixins.observable.constructor.call(this, config);
		Ext.apply(this, config || {});
		this.createFileField();
	},
	createFileField: function(o) {
		var config = Ext.apply({

		}, o || {});

		var cmp = Ext.create("Ext.form.FieldContainer", {
			border: 0,
			layout: "hbox",
			obj: this,
			defaults: {
				margin: 5
			}
		});
		var that = this;
		this.filefield = Ext.create("Ext.form.field.File", {
			// xtype: 'filefield',
			name: this.name,
			fieldLabel: this.fieldLabel,
			labelAlign: "right",
			labelWidth: 100,
			width: 400,
			buttonText: '选择文件',
			isDelete: false,
			listeners: {
				change: function() {
					that.filefieldChange(that);
				}
			}
		});
		this.downBtn = Ext.create("Ext.button.Button", {
			text: "下载",
			disabled: true,
			data: {},
			handler: function() {
				that.downFile(that);
			}
		});
		this.boxOff = Ext.create("Ext.form.Label", {
			padding: 5,
			text: "|",
		});
		this.deleteBtn = Ext.create("Ext.button.Button", {
			text: "删除",
			handler: function() {
				that.deleteFilefield(that);
			},
			disabled: true,
		});

		this.cancelDeleteBtn = Ext.create("Ext.button.Button", {
			text: common.filefieldMsg.cancelDelete,
			handler: function() {
				that.cancelDeleteFilefield(that)
			},
			disabled: true,
		});
		cmp.add(this.filefield);
		cmp.add(this.downBtn);
		cmp.add(this.boxOff);
		cmp.add(this.deleteBtn);
		cmp.add(this.cancelDeleteBtn);
		return cmp;
	},
	downFile: function() {
		console.log(this.data);
		console.log(this.ModelData);
		var RDN = this.data["RDN"] || "";
		var ATTR_RDN = this.ModelData["RDN"] || "";

		var FUNC_PARAMS = JSON.stringify({
			RDN: RDN,
			ATTR_RDN: ATTR_RDN
		});
		var form = Ext.create("Ext.form.Panel", {
			method: "POST",
			// standardSubmit: true,
			items: [{
				xtype: "hiddenfield",
				name: "FUNC"
			}, {
				xtype: "hiddenfield",
				name: "FUNC_PARAMS"
			}, {
				xtype: "filefield"
			}],
		}).hide().getForm();
		if (form.isValid()) {
			form.setValues({
				FUNC: "view_getAttachment",
				FUNC_PARAMS: FUNC_PARAMS
			});
			form.submit({
				url: "../../dataProcess",
				success: function(form, action) {
					console.log("success");
				},
				failure: function(form, action) {
					// var result = action.result;
					// var data = result.CONTENT;
					// var STATE = result.STATE;
					// var ERR_MSG = result.ERR_MSG;
					var response = action.response.responseText;
					console.log(response);
					main.view.toast(response);
				}
			});
		}
	},
	cancelDeleteFilefield: function() {
		var RDN = this.ModelData.RDN;
		this.filefield.setRawValue(this.initName);
		main.Tree.Model.cancelDeleteFilefield(RDN);
		this.cancelDeleteBtn.disable();
		this.downBtn.enable();
		this.deleteBtn.enable();
	},
	deleteFilefield: function() {
		var RDN = this.ModelData.RDN;
		main.Tree.Model.deleteFilefield(RDN);
		this.filefield.setRawValue("");
		this.filefield.fileInputEl.dom.value = ""
		this.cancelDeleteBtn.enable();
		this.downBtn.disable();
		this.deleteBtn.disable();
	},
	filefieldChange: function() {
		if (this.filefield.getValue()) {
			this.downBtn.enable();
			this.deleteBtn.enable();
			this.cancelDeleteBtn.disable();
		} else {
			this.cancelDeleteBtn.enable();
			this.downBtn.disable();
			this.deleteBtn.disable();
		}
	},
	setFileData: function(data) {
		this.data = data;
		var jsonStr = data[this.name] || '{"NAME": ""}';
		var fileJson = JSON.parse(jsonStr);
		this.filefield.setRawValue(fileJson["NAME"]);
		this.initName = fileJson["NAME"];
		this.filefieldChange(this);
	}
});

function a(fun) {
	this.x = "name";
	// 这是call 大概经历的过程，因为call是由事件冒充衍生而来的
	// -----------------------
	this.a_fun = fun;
	this.a_fun(this.x);
	delete this.a_fun;
	// -----------------------
}
var b = new a(function(x) {
	console.log(x);
})