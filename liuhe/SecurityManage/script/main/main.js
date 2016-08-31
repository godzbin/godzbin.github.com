/**
 * create 20160801
 * godz
 *
 * 主要运行文件
 */
Ext.onReady(function() {
	main.init();
});
var main = {
	init: function() {
		this.user = new User();
		this.user.getUserInfo();
		this.mainPage = new MainPage();
		this.userSelfBtn = new UserInfoBtn(this.mainPage)
		this.mainPage.regHeader(new Logo(this.mainPage));
		this.mainPage.regHeader(this.userSelfBtn);
		this.securityManage = new SecurityManage(this.mainPage)
		this.mainPage.regCentent(this.securityManage);
	}
}