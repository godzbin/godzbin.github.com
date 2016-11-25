var App = App || {};
App.AllPay = function(){
	function AllPay() {
		var dom = document;
		var touch = "touchstart";
		this.tabEl = dom.getElementsByClassName("tab")[0];
		this.tabEl.addEventListener(touch, this.showTabBox.bind(this));
	}
	AllPay.prototype = {
		showTabBox: function(e) {
			e.preventDefault();
			var target = e.target;
			var childrens = this.tabEl.children;
			childrens[0].className = childrens[0].className.replace("active", "");
			childrens[1].className = childrens[1].className.replace("active", "");
			target.className += " active";
			this.hideAllTabBox();
			var app_box_id = target.getAttribute("bindId");
			var box = document.getElementById(app_box_id);
			box.style.display = "block";
		},
		hideAllTabBox: function() {
			var boxs = document.getElementsByClassName("app-box");
			for (var i = 0; i < boxs.length; i++) {
				boxs[i].style.display = "none";
			}
		}
	}
	this.page = new AllPay();
}