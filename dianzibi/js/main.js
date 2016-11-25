document.addEventListener("DOMContentLoaded", function() {

	var allPay = new App.AllPay().page;
	var dianzibi = new App.dianzibi_app().page;
	var wechatPay = new App.wechatPay().page;
	dianzibi.init();
	wechatPay.init();
}, false);