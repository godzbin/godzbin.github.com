/*
 * 我的资料
 * 
 */ 

function UserCenter(parentNode){
	Page.call(this, Configes.page.userCenter);
	this._parentNode = parentNode;
	this.run = function(){
		if(true !== this.exist){
			this.exist = true;
			this.initView();
			this.loadData();
		}

		this.mainPanelShow();
	};

	this.initView = function(){
		var 
			mainPanel,

			infoPanel,
			enterEdition,
			leaveEdition,

			classifyPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				defaults: {
					border: 0
				}
			}),

			_this = this,

			win = Ext.create('Ext.Window',{
				width:400,
				height:200,
				closable:true,
				top: 100,
				layout:'fit',//布局方式
				closeAction:'hide',
				title: '修改密码',
				cls: 'modifyPassword',
				constrainHeader:true,//设置窗口的顶部不会超出浏览器边界
				defaultButton:0,//默认选中的按钮
				resizable:true,//控制窗口是否可以通过拖拽改变大小
				resizeHandles:'se',//控制拖拽方式,必须是在设置了resizable的情况下,
				modal:true,//弹出窗口后立刻屏蔽掉其他的组件,只有关闭窗口后才能操作其他组件,
				plain:true,//对窗口内部内容惊醒美化,可以看到整齐的边框
				animateTarget:'target',//可以使窗口展示弹并缩回效果的动画
				items:[{
					layout:'form',
					defaultType:'textfield',
					defaults:{
						width:200,
						inputType:'password'
					},
					style:{
						marginTop:10,
						marginLeft:10
					},
					labelWidth:120,
					labelAlign:'right',
					items:[{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword1',
						labelStyle:'margin-Top:10px',
						fieldLabel:'旧密码'
					},{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword2',
						labelStyle:'margin-Top:10px',
						fieldLabel:'新密码'
					},{
						style:{
							marginTop:10,
							marginLeft:10
						},
						id: 'modifyPassword3',
						labelStyle:'margin-Top:10px',
						fieldLabel:'重复新密码'
					}]
				}],
				buttons:[{
					text:'保存',
					handler:function(){
						_this.modifyPassword(
							Ext.getCmp('modifyPassword1').getValue(),
							Ext.getCmp('modifyPassword2').getValue(),
							Ext.getCmp('modifyPassword3').getValue()
						)
					}
				}],
				buttonAlign: 'center'
			}),

			formPanel = Ext.create('Ext.form.Panel',{
				minWidth : 850,
				height: 400,
				autoHeight : true,
				frame : true,
				layout : "form", // 整个大的表单是form布局
				labelWidth : 65,
				labelAlign : "right",
				style: 'background: transparent;margin: 0 0 0 auto;min-width:850px;',
				border: 0,
				defaults: {
					style: 'background: transparent;',
					border: 0
				},
				items : [{ // 行1
					title: '账户信息',
					layout : "column", // 从左往右的布局
					id: 'userCenterPassword',
					items : [{
						columnWidth : .3, // 该列有整行中所占百分比
						layout : "form", // 从上往下的布局
						disabled: true,
						items : [{
							xtype : "textfield",
							fieldLabel : "账户名",
							width : 120,
							name: 'account'
						}]
					}, {
						columnWidth : .3,
						layout : "form",
						disabled: true,
						items : [{
							xtype : "textfield",
							fieldLabel : "密码",
							inputType: 'password',
							width : 120,
							name: 'password'
						}]
					}, {
						columnWidth : .3,
						layout : "form",
						items : [{
							xtype : "button",
							text: '修改密码',
							width : 120,
							handler: function(){
								win.show();
								Ext.getCmp('modifyPassword1').setValue('');
								Ext.getCmp('modifyPassword2').setValue('');
								Ext.getCmp('modifyPassword3').setValue('');
							}

						}]
					}]
				}, {
					title: '个人信息',
					layout: 'column',
					id: 'layoutInfo',
					disabled: true,
					defaults: {
						border: 0,
						width: 100
					},
					items: [{
						columnWidth: 0.31,
						title: '基本信息',
						layout: 'form',
						style: 'margin-right: 10px;',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '真实姓名',
							name: 'realName'
						}, {
							fieldLabel: '姓名',
							name: 'nickName'
						}, {
							fieldLabel: '年龄',
							name: 'age'
						}]
					}, {
						columnWidth: 0.31,
						title: '企业信息',
						layout: 'form',
						style: 'margin-right: 10px;',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '所属省份',
							name: 'province'
						}, {
							fieldLabel: '所属公司',
							name: 'company',
							xtype: 'combobox',
							displayField: 'name',
							valueField: 'value',
							store: new Ext.data.Store({
								fields: ['name','value'],
								data: [
									{name: '中国移动(深圳)有限公司',value:'深圳'},
									{name: '甘肃移动有限公司',value:'甘肃'},
									{name: '广东移动有限公司',value:'广东'},
									{name: '贵州移动有限公司',value:'贵州'},
								]
							}),
						}, {
							fieldLabel: '部门',
							name: 'department'
						}, {
							fieldLabel: '职位',
							name: 'position'
						}]
					}, {
						columnWidth: 0.31,
						title: '联系方式',
						layout: 'form',
						defaults: {xtype: 'textfield'},
						items: [{
							fieldLabel: '手机号码',
							name: 'number'
						}, {
							fieldLabel: '邮箱',
							name: 'email'
						}, {
							fieldLabel: 'QQ',
							name: 'qqAccount'
						}]
					}]
				}, {
					layout: 'column',
					cls: 'editInfo',
					width: 120,
					id: 'enterEdition',
					border: 0,
					items: [{
						columnWidth: .93,
						xtype: 'button',
						text: '修改个人信息',
						handler: function(){
							infoPanel.enable();
							enterEdition.hide();
							leaveEdition.show();
						}
					}]
				}, {
					layout: 'column',
					cls: 'editInfo',
					width: 150,
					hidden: true,
					id: 'leaveEdition',
					border: 0,
					items: [{
						columnWidth: 0.47,
						xtype: 'button',
						text: '确认',
						handler: function(){
							_this.modifyInfo();
							infoPanel.disable();
							enterEdition.show();
							leaveEdition.hide();
						}
					}, {
						columnWidth: 0.47,
						xtype: 'button',
						text: '关闭',
						margin: '0 0 0 5',
						handler: function(){
							_this.setData();
							infoPanel.disable();
							enterEdition.show();
							leaveEdition.hide();
						}
					}]
				}]
			});

		return function(){
			this.classifyPanel = classifyPanel;
			this.formPanel = formPanel;
			this.win = win;
			infoPanel = Ext.getCmp('layoutInfo');
			enterEdition = Ext.getCmp('enterEdition');
			leaveEdition = Ext.getCmp('leaveEdition');
			mainPanel = this.getMainPanel();

			mainPanel.add(this.classifyPanel);
			this.classifyPanel.add(this.formPanel);
		}
	}.bind(this)();

	this.loadData = function(){
		tools.getData(Configes.url.view_getSelfInfo, null, this.setData.bind(this), null);
	};

	this.setData = function(){
		var testData = {
			account: '小明',
			password: '123456',
			realName: '小明',
			nickName: 'kk',
			age: '39',
			province: 'shandong',
			company: '深圳',
			department: 'business',
			position: 'cleankeeper',
			number: '13566660099',
			email: 'xiaoming@hotmail.cc',
			qqAccount: '2231456234'
		},
			formPanel,
			_account,
			_password,
			_realName,
			_nickName,
			_age,
			_province,
			_company,
			_department,
			_position,
			_number,
			_email,
			_qqAccount,

			_data;

		return function(data, scope){
			void 0 !== data && (this.userInfo = data);
			this.userInfo = testData;
			_data = this.userInfo;

			if(void 0 === formPanel){
				formPanel   = this.formPanel.getForm();
				_account     = formPanel.findField('account');
				_password   = formPanel.findField('password');
				_realName   = formPanel.findField('realName');
				_nickName   = formPanel.findField('nickName');
				_age        = formPanel.findField('age');
				_province   = formPanel.findField('province');
				_company    = formPanel.findField('company');
				_department = formPanel.findField('department');
				_position   = formPanel.findField('position');
				_number     = formPanel.findField('number');
				_email      = formPanel.findField('email');
				_qqAccount   = formPanel.findField('qqAccount');
			}

			void 0 !== _data['account']  && _account.setValue(_data['account']);
			void 0 !== _data['password'] && _password.setValue(_data['password']);
			_realName.setValue(_data['realName']);
			_nickName.setValue(_data['nickName']);
			_age.setValue(_data['age']);
			_province.setValue(_data['province']);
			_company.setValue(_data['company']);
			_department.setValue(_data['department']);
			_position.setValue(_data['position']);
			_number.setValue(_data['number']);
			_email.setValue(_data['email']);
			_qqAccount.setValue(_data['qqAccount']);
		};
	}.bind(this)();

	this.modifyInfo = function(){ // submit event
		var info = this.formPanel.getForm().getValues();
		var _this = this;

		Ext.Msg.wait('资料保存中..');
		Ext.Ajax.request({
			url: 'http://www.baidu.com',
			params: info,
			method: 'post',
			success: function(res){
				Ext.Msg.alert('消息', '保存成功!');
				_this.setData(info);
			},
			failure: function(){
				_this.setData();
				Ext.Msg.alert('消息', '保存失败..');
			}
		});
		console.log(info);
	}

	this.modifyPassword = function(){
		var _this = this;
		if(arguments.length !== 3)return;

		if(arguments[1] !== arguments[2])return Ext.Msg.alert('消息','新密码输入有误，请重新输入');
		if(arguments[1].length < 6)return Ext.Msg.alert('消息', '密码长度过短, 请输入6位新密码');

		var params = {
			originalPW: arguments[0],
			newPW: arguments[1],
			repeatPW: arguments[2]
		};

		Ext.Msg.wait('密码重置中..');
		Ext.Ajax.request({
			url: 'http://www.baidu.com',
			params: params,
			method: 'post',
			success: function(res){
				Ext.Msg.alert('消息', '密码修改成功!');
			},
			failure: function(){
				Ext.Msg.alert('消息', '密码修改失败..');
				_this.win.hide();
			}
		});
	}

}