/*
 * 监控场景
 * 
 */ 


function SceneMode(parentNode){
	Page.call(this, Configes.page.sceneMode);
	this._parentNode = parentNode;
	this.run = function(){
		if(true !== this.exist){
			this.exist = true;
			this.initView();
		}

		this.mainPanelShow();
	};

	this.initView = function(){
		var 
			_this = this,
			mainPanel;

		this.monitorPanel = Ext.create('Ext.panel.Panel',{
			border: 0,
			// width: 1200,
		});

		this.menuPanel = Ext.create('Ext.tab.Bar',{
			border: 0,
			width: '500px',
			style: {
				'left': '280px',
				'top': '25px',
				'position': 'fixed',
				'z-index': '9999'
			},
			cls: 'vz_monitorSceneMenu',
			layout: 'column',
			defaults: {
				width: 30,
				height: 30,
				border: 0,
				margin: '0 20 0 0',
				xtype: 'button',
				listeners: {
					click:function(target,e,eOpts){
						_this.menuPanel.items.each(function(cmp){
							cmp.el.dom.style.opacity = 0.4;
						});
						target.el.dom.style.opacity = 1;

						var _i = target.pageId + 1;

						_this.mainPanel.items.each(function(cmp,index){
							if(index === _i){
								cmp.items.each(function(_cmp,_index){
									_index === 0 && _cmp.show() || _cmp.hide();
								});
								cmp.show();
							}else if(index !== 0){
								cmp.hide();
							}
						});
					},
					afterrender: function(){
						_this.menuPanel.items.items[0].el.dom.style.opacity = 1;
					}
				}
			},
			items: [
				{
					tooltip: '故障定位监控',
					cls: 'vz-icon-i14 vz-icon',
					pageId: 0,
				},{
					xtype: 'box',
					cls: 'vz-icon-i15 vz-icon',
					pageId: 1,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i16 vz-icon',
					pageId: 2,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i17 vz-icon',
					pageId: 3,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i18 vz-icon',
					pageId: 4,
					disabled: true,
				},{
					xtype: 'box',
					cls: 'vz-icon-i19 vz-icon',
					pageId: 5,
					disabled: true,
				}
			]
		});

		this.mainPanel = this.getMainPanel();

		this.mainPanel.addListener({
			show: function(){
				_this.mainPanel.items.each(function(cmp,index){
					index === 0 || index === 1 && cmp.show() || cmp.hide();
				});

				_this.monitorPanel.items.each(function(cmp,index){
					index === 0 && cmp.show() || cmp.hide();
				});

				_this.menuPanel.items.each(function(cmp,index){
					cmp.el.dom.style.opacity = index === 0 ? 1 : 0.4;
				});
			}
		});

		var monitorPanel = vz2.monitorSceneInitialize();

		this.monitorPanel.add([monitorPanel[0],monitorPanel[1]]);

		this.mainPanel.add([this.menuPanel,this.monitorPanel]);
	};
}