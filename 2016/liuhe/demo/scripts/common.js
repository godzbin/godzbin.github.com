Ext.BLANK_IMAGE_URL = "resources/blank.gif";

String.prototype.ellipse = function(maxLength) {
	if (this.length > maxLength) {
		return this.substring(0, maxLength - 3) + '...';
	}
	return this;
};

var Point = function(x, y) {
	this.constructor(x, y);
};
Point.prototype = {
	constructor : function(x, y) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	},

	clone : function() {
		return new Point(this.x, this.y);
	},

	getDiff : function(p) {
		return new Point(this.x - p.x, this.y - p.y);
	},

	subtract : function(x, y) {
		var p;
		if (x instanceof Point) {
			p = x;
			x = p.x;
			y = p.y;
		}
		this.x -= x;
		this.y -= y;
	},

	getSum : function(p) {
		return new Point(this.x + p.x, this.y + p.y);
	},

	sum : function(x, y) {
		var p;
		if (x instanceof Point) {
			p = x;
			x = p.x;
			y = p.y;
		}
		this.x += x;
		this.y += y;
	},

	toString : function() {
		return this.x + "," + this.y;
	},

	equals : function(p) {
		if (p instanceof Point) {
			return this.x == p.x && this.y == p.y;
		}
		return false;
	},

	zoomOut : function(rate) {
		this.x /= rate;
		this.y /= rate;
	},

	zoomIn : function(rate) {
		if (rate == 1) {
			return;
		}
		this.x *= rate;
		this.y *= rate;
	},

	reset : function(x, y) {
		if (x instanceof Point) {
			var p = x;
			x = p.x;
			y = p.y;
		}
		this.x = x;
		this.y = y;
	},

	getTransposed : function() {
		return this.clone().transpose();
	},

	transpose : function() {
		var tmp = this.x;
		this.x = this.y;
		this.y = tmp;
		return this;
	}
};
Point.slope = function(p1, p2) {
	return Point.slope2(p1.x, p1.y, p2.x, p2.y);
};
Point.slope2 = function(x, y, x2, y2) {
	return (y2 - y) / (x2 - x);
};
Point.wrap = function(o) {
	if (o instanceof Array) {
		return new Point(o[0], o[1]);
	}
	return new Point(o.x, o.y);
};
Point.distance = function(p1, p2) {
	return this.distance2(p1.x, p1.y, p2.x, p2.y);
};
Point.distance2 = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
Point.center = function(p1, p2) {
	return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
};
Point.empty = function() {
	if (!this.em) {
		var d = new Point(0, 0);
		for (var n in d) {
			if (d[n] instanceof Function) {
				d[n] = null;
			}
		}
		this.em = d;
	}
	return this.em;
};

var Dimension = function(width, height) {
	this.constructor(width, height);
};
Dimension.prototype = {
	constructor : function(width, height) {
		this.width = width ? width : 0;
		this.height = height ? height : 0;
	},

	clone : function() {
		return new Dimension(this.width, this.height);
	},

	getDiff : function(dim) {
		return new Dimension(this.width - dim.width, this.height - dim.height);
	},

	subtract : function(w, h) {
		var dim;
		if (w instanceof Dimension) {
			dim = w;
			w = dim.width;
			h = dim.height;
		}
		this.width -= w;
		this.height -= h;
	},

	getSum : function(dim) {
		return new Dimension(this.width + dim.width, this.height + dim.height);
	},

	sum : function(w, h) {
		var dim;
		if (w instanceof Dimension) {
			dim = w;
			w = dim.width;
			h = dim.height;
		}
		this.width += w;
		this.height += h;
	},

	equals : function(dim) {
		if (dim instanceof Dimension) {
			return this.width == dim.width && this.height == dim.height;
		}
		return false;
	},

	toString : function() {
		return this.width + "," + this.height;
	},

	zoomOut : function(rate) {
		this.width /= rate;
		this.height /= rate;
	},

	zoomIn : function(rate) {
		if (rate == 1) {
			return;
		}
		this.width *= rate;
		this.height *= rate;
	},

	reset : function(w, h) {
		if (w instanceof Dimension) {
			var d = w;
			w = d.width;
			h = d.height;
		}
		this.width = w;
		this.height = h;
	},

	getTransposed : function() {
		return this.clone().transpose();
	},

	transpose : function() {
		var tmp = this.width;
		this.width = this.height;
		this.height = tmp;
		return this;
	}
};
Dimension.wrap = function(o) {
	return new Dimension(o.width, o.height);
};
Dimension.empty = function() {
	if (!this.em) {
		var d = new Dimension(0, 0);
		for (var n in d) {
			if (d[n] instanceof Function) {
				d[n] = null;
			}
		}
		this.em = d;
	}
	return this.em;
};

var Rectangle = function(x, y, w, h) {
	this.constructor(x, y, w, h);
};
Rectangle.prototype = {
	constructor : function(x, y, w, h) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
		this.width = w ? w : 0;
		this.height = h ? h : 0;
	},

	contains : function(x, y) {
		if (this.x <= x && this.getRightX() >= x && this.y <= y
				&& this.getBottomY() >= y) {
			return true;
		}
		return false;
	},

	getSize : function() {
		return new Dimension(this.width, this.height);
	},

	getLocation : function() {
		return new Point(this.x, this.y);
	},

	containsRect : function(rect) {
		var rb = rect.getRightBottom();
		return this.contains(rect.x, rect.y) && this.contains(rb.x, rb.y);
	},

	cut : function(hgap, vgap) {
		return new Rectangle(this.x + hgap, this.y + vgap, this.width - 2
						* hgap, this.height - 2 * vgap);
	},

	getCenter : function() {
		return new Point(this.getCenterX(), this.getCenterY());
	},

	getRightX : function() {
		return this.width + this.x;
	},

	getCenterX : function() {
		return this.x + this.width / 2;
	},

	getBottomY : function() {
		return this.height + this.y;
	},

	getCenterY : function() {
		return this.y + this.height / 2;
	},

	getLeftTop : function() {
		return new Point(this.x, this.y);
	},

	getRightTop : function() {
		return new Point(this.getRightX(), this.y);
	},

	getLeft : function() {
		return new Point(this.x, this.getCenterY());
	},

	getTop : function() {
		return new Point(this.getCenterX(), this.y);
	},

	getRight : function() {
		return new Point(this.getRightX(), this.getCenterY());
	},

	getBottom : function() {
		return new Point(this.getCenterX(), this.getBottomY());
	},

	getLeftBottom : function() {
		return new Point(this.x, this.getBottomY());
	},

	getRightBottom : function() {
		return new Point(this.getRightX(), this.getBottomY());
	},

	getDimension : function() {
		return new Dimension(this.width, this.height);
	},

	clone : function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	},

	toString : function() {
		return this.x + "," + this.y + "," + this.width + "," + this.height;
	},

	isIntersect : function(r) {
		var tw = this.width;
		var th = this.height;
		var rw = r.width;
		var rh = r.height;
		if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
			return false;
		}
		var tx = this.x;
		var ty = this.y;
		var rx = r.x;
		var ry = r.y;
		rw += rx;
		rh += ry;
		tw += tx;
		th += ty;
		// overflow || intersect
		return ((rw < rx || rw > tx) && (rh < ry || rh > ty)
				&& (tw < tx || tw > rx) && (th < ty || th > ry));
	},

	zoomOut : function(rate) {
		this.x /= rate;
		this.y /= rate;
		this.width /= rate;
		this.height /= rate;
	},

	zoomIn : function(rate) {
		if (rate == 1) {
			return;
		}
		this.x *= rate;
		this.y *= rate;
		this.width *= rate;
		this.height *= rate;
	},

	union : function(r) {
		return Rectangle.union(this, r);
	},

	union2Self : function(r) {
		var newR = Rectangle.union(this, r);
		this.reset(newR);
	},

	sum : function(r) {
		if (r instanceof Point || r instanceof Rectangle) {
			this.x += r.x;
			this.y += r.y;
		}
		if (r instanceof Dimension || r instanceof Rectangle) {
			this.width += r.width;
			this.height += r.height;
		}
	},

	subtract : function(r) {
		if (r instanceof Point || r instanceof Rectangle) {
			this.x -= r.x;
			this.y -= r.y;
		}
		if (r instanceof Dimension || r instanceof Rectangle) {
			this.width -= r.width;
			this.height -= r.height;
		}
	},

	equals : function(r) {
		if (r instanceof Rectangle) {
			return this.x == r.x && this.y == r.y && this.width == r.width
					&& this.height == r.height;
		}
		return false;
	},

	reset : function(r) {
		this.x = r.x;
		this.y = r.y;
		this.width = r.width;
		this.height = r.height;
	},

	clear : function() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	},

	setLocation : function(x, y) {
		if (x instanceof Point) {
			var p = x;
			x = p.x;
			y = p.y;
		}
		this.x = x;
		this.y = y;
	},

	setSize : function(w, h) {
		if (w instanceof Dimension) {
			var d = w;
			w = d.width;
			h = d.height;
		}
		this.width = w;
		this.height = h;
	},

	crop : function(insets) {
		this.x += insets.left;
		this.y += insets.top;
		this.width -= insets.left + insets.right;
		this.height -= insets.top + insets.bottom;
	},

	getTransposed : function() {
		return this.clone().transpose();
	},

	transpose : function() {
		var tmp = this.x;
		this.x = this.y;
		this.y = tmp;
		tmp = this.width;
		this.width = this.height;
		this.height = tmp;
		return this;
	}
};
Rectangle.create = function(cfg) {
	return new Rectangle(cfg.x, cfg.y, cfg.width, cfg.height);
};
Rectangle.create2 = function(p, dim) {
	return new Rectangle(p.x, p.y, dim.width, dim.height);
};
Rectangle.union = function(r, r2) {
	var x = Math.min(r.x, r2.x);
	var y = Math.min(r.y, r2.y);
	var w = Math.max(r.getRightX(), r2.getRightX()) - x;
	var h = Math.max(r.getBottomY(), r2.getBottomY()) - y;
	return new Rectangle(x, y, w, h);
};
Rectangle.getIntersectPoint = function(bounds, x, y) {
	if (x instanceof Point) {
		var p = x;
		x = p.x;
		y = p.y;
	}
	var cx = bounds.getCenterX();
	var cy = bounds.getCenterY();
	var dx = x - cx;
	var dy = y - cy;
	if (dx == 0 && dy == 0) {
		return new Point(cx, cy);
	}
	var scale = 0.5
			/ Math.max(Math.abs(dx) / bounds.width, Math.abs(dy)
							/ bounds.height);
	dx *= scale;
	dy *= scale;
	return new Point(Math.round(cx + dx), Math.round(cy + dy));
};
Rectangle.empty = function() {
	if (!this.em) {
		var d = new Rectangle(0, 0, 0, 0);
		for (var n in d) {
			if (d[n] instanceof Function) {
				d[n] = null;
			}
		}
		this.em = d;
	}
	return this.em;
};

var Circle = function(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
};
Circle.prototype = {
	getCenter : function() {
		return new Point(this.x, this.y);
	},

	contains : function(x, y) {
		return Point.distance2(this.x, this.y, x, y) <= this.r;
	},

	toString : function() {
		return this.x + "," + this.y + "," + this.r;
	}
};

var Insets = function(t, r, b, l) {
	this.constructor(t, r, b, l);
};
Insets.prototype = {
	constructor : function(t, r, b, l) {
		this.top = t ? t : 0;
		this.right = r ? r : 0;
		this.bottom = b ? b : 0;
		this.left = l ? l : 0;
	},

	clone : function() {
		return new Insets(this.top, this.right, this.bottom, this.left);
	},

	getWidth : function() {
		return this.left + this.right;
	},

	getHeight : function() {
		return this.top + this.bottom;
	},

	getTransposed : function() {
		return this.clone().transpose();
	},

	transpose : function() {
		var tmp = this.top;
		this.top = this.left;
		this.left = tmp;
		tmp = this.right;
		this.right = this.bottom;
		this.bottom = tmp;
		return this;
	},

	toString : function() {
		return "[" + this.top + "," + this.right + "," + this.bottom + ","
				+ this.left + "]";
	}
};

var Transposer = function(enabled) {
	this.constructor(enabled);
};
Transposer.prototype = {
	constructor : function(enabled) {
		this.enabled = enabled;
	},

	enable : function() {
		this.enabled = true;
	},

	disable : function() {
		this.enabled = false;
	},

	isEnabled : function() {
		return this.enabled;
	},

	setEnabled : function(v) {
		if (v) {
			this.enable();
		} else {
			this.disable();
		}
	},

	t : function(o) {
		if (this.isEnabled()) {
			return o.getTransposed();
		}
		return o;
	}
};

var GuiUtil = function() {
	var msgCt;

	function createBox(t, s) {
		return [
				'<div class="msg">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('');
	}
	return {
		msg : function(title, format) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.append(document.body, {
							id : 'msg-div',
							style : {
								position : "absolute",
								width : 300
							}
						}, true);
			}
			msgCt.alignTo(document, 't-t');
			var s = String.format.apply(String, Array.prototype.slice.call(
							arguments, 1));
			var m = Ext.DomHelper.append(msgCt, {
						html : createBox(title, s)
					}, true);
			m.slideIn('t').pause(1).ghost("t", {
						remove : true
					});
		},

		setBtnsEnable : function(btns, enabled) {
			for (var i = 0, len = btns.length; i < len; ++i) {
				btns[i].setDisabled(!enabled);
			}
		},

		createWin : function(config) {
			var size = Ext.get(document.body).getSize();
			if (config) {
				if (config.offsetWidth && !config.width) {
					config.width = size.width - config.offsetWidth;
				}
				if (config.offsetHeight && !config.height) {
					config.height = size.height - config.offsetHeight;
				}
			} else {
				config = {};
			}
			return new Ext.Window(Ext.apply({
						modal : true,
						border : false,
						height : 380,
						width : 700,
						layout : 'fit',
						closable : false,
						constrain : true,
						constrainHeader : true,
						resizable : false
					}, config));
		},

		createForm : function(config) {
			if (!config) {
				config = {};
			}
			return new Ext.form.FormPanel(Ext.apply({
						defaultType : "textfield",
						labelAlign : "right",
						labelWidth : 100,
						monitorValid : true,
						layout : "form",
						defaults : {
							width : 500,
							msgTarget : "side"
						},
						bodyStyle : {
							padding : "15 0 20 0",
							cursor : "default"
						}
					}, config));
		},

		createComboBox : function(config, clazz) {
			if (!config) {
				config = {};
			}
			if (!clazz) {
				clazz = Ext.form.ComboBox;
			}
			return new clazz(Ext.apply({
						editable : false,
						valueField : 'value',
						displayField : 'name',
						mode : 'local',
						triggerAction : 'all'
					}, config));
		},

		multiLineRender : function(cls, value, editable, attrStr) {
			var s = [];
			s.push("<textarea ");
			if (!editable) {
				s.push("readonly");
			}
			s.push(" class='grid-ml ");
			if (cls) {
				s.push(cls);
			}
			s.push("' ");
			if (attrStr) {
				s.push(attrStr);
			}
			s.push(">");
			s.push(value);
			s.push("</textarea>");
			return s.join("");
		},

		clearForm : function(keys) {
			for (var n in keys) {
				var cmp = Ext.getCmp(n);
				if (cmp) {
					cmp.setValue("");
				}
			}
		},

		init : function() {
			var lb = Ext.get('lib-bar');
			if (lb) {
				lb.show();
			}
		},

		contains : function(o, x, y) {
			var os = o;
			if (!(o instanceof Array)) {
				os = [o];
			}
			for (var i = 0, len = os.length; i < len; ++i) {
				if (Rectangle.create(os[i].getBox()).contains(x, y)) {
					return true;
				}
			}
			return false;
		},

		createProgressBar : function(width, text, value) {
			var s = [];
			var barWidth = width - 2;
			var valueWidth = Math.round(value * barWidth / 100);
			var h = 18;
			s
					.push("<div class='x-progress-wrap' style='width: " + width
							+ "'>");
			s.push("<div class='x-progress-inner'>");

			s.push("<div class='x-progress-bar' style='width: " + valueWidth
					+ "px; height: " + h + "px'>");
			s.push("<div class='x-progress-text' style='z-index: 99; width: "
					+ valueWidth + "px'>");
			s.push("<div style='width: " + barWidth + "px; height: " + h
					+ "px'>" + text + "</div>");
			s.push("</div>");
			s.push("</div>");

			s.push("<div class='x-progress-text x-progress-text-back'>");
			s.push("<div style='width:  " + barWidth + "px; height: " + h
					+ "px'>" + text + "</div>");
			s.push("</div>");

			s.push("</div>");
			s.push("</div>");
			return s.join("");
		},

		createRoundRect : function(html) {
			var dh = Ext.DomHelper;
			var div = document.createElement("div");
			dh.append(div, {
						tag : "div",
						cls : "x-box-tl",
						children : [{
									tag : "div",
									cls : "x-box-tr",
									children : [{
												tag : "div",
												cls : "x-box-tc"
											}]
								}]
					});
			dh.append(div, {
						tag : "div",
						cls : "x-box-ml",
						children : [{
									tag : "div",
									cls : "x-box-mr",
									children : [{
												id : "roundRectContent",
												tag : "div",
												cls : "x-box-mc",
												html : html
											}]
								}]
					});
			dh.append(div, {
						tag : "div",
						cls : "x-box-bl",
						children : [{
									tag : "div",
									cls : "x-box-br",
									children : [{
												tag : "div",
												cls : "x-box-bc"
											}]
								}]
					});
			return div;
		},

		computeTextHeight : function(text, width, style) {
			var box = Ext.getDom("textComputer");
			if (!box) {
				box = Ext.DomHelper.append(document.body, {
							tag : "textarea",
							style : "display:none"
						});
			}
			var ss = style || {};
			box.style.width = width;
			for (var n in ss) {
				box.style[n] = ss[n];
			}
			var rng = box.createTextRange();
			return rng.boundingHeight;
		},

		setCenter : function(cmp) {
			var size = Ext.get(document.body).getSize();
			var cmpSize = cmp.getSize();
			var x = (size.width - cmpSize.width) / 2;
			var y = (size.height - cmpSize.height) / 2;
			cmp.setPosition(x, y);
		},

		createDraggablePanel : function(config) {
			var config = config || {};
			var style = {
				position : "absolute"
			};
			if (config.otherStyle) {
				var style = Ext.apply(style, config.otherStyle || {});
				delete config.otherStyle;
			}
			return new Ext.Panel(Ext.apply({
						style : style,
						renderTo : document.body,
						draggable : {
							insertProxy : false,
							onDrag : function(e) {
								var pel = this.proxy.getEl();
								this.x = pel.getLeft(true);
								this.y = pel.getTop(true);
								var s = this.panel.getEl().shadow;
								if (s) {
									s.realign(this.x, this.y, pel.getWidth(),
											pel.getHeight());
								}
							},
							endDrag : function(e) {
								this.panel.setPosition(this.x, this.y);
							}
						}
					}, config));
		}
	};
}();
Ext.onReady(GuiUtil.init, GuiUtil);

var ObjectMap = function() {
	this.constructor();
};
ObjectMap.prototype = {
	constructor : function() {
		this.ks = [];
		this.vs = [];
	},

	clone : function() {
		var map = new ObjectMap();
		map.ks = this.ks.slice(0, this.ks.length);
		map.vs = this.vs.slice(0, this.vs.length);
		return map;
	},

	convertKey : function(k) {
		if (!(k instanceof Object)) {
			k = "" + k;
		}
		return k;
	},

	put : function(k, v) {
		k = this.convertKey(k);
		var index = this.ks.indexOf(k);
		if (index == -1) {
			this.ks.push(k);
			this.vs.push(v);
			return null;
		} else {
			var old = this.vs[index];
			this.vs[index] = v;
			return old;
		}
	},

	get : function(k) {
		k = this.convertKey(k);
		var index = this.ks.indexOf(k);
		if (index == -1) {
			return null;
		}
		return this.vs[index];
	},

	remove : function(k) {
		k = this.convertKey(k);
		var index = this.ks.indexOf(k);
		if (index > -1) {
			this.ks.splice(index, 1);
			return this.vs.splice(index, 1)[0];
		}
		return null;
	},

	length : function() {
		return this.ks.length;
	},

	isEmpty : function() {
		return this.length() == 0;
	},

	getKey : function(index) {
		if (index >= 0 && index < this.length()) {
			return this.ks[index];
		}
		return null;
	},

	getValue : function(index) {
		if (index >= 0 && index < this.length()) {
			return this.vs[index];
		}
		return null;
	},

	clear : function() {
		this.ks.splice(0, this.ks.length);
		this.vs.splice(0, this.vs.length);
	},

	values : function() {
		return this.vs.slice(0, this.length());
	},

	keys : function() {
		return this.ks.slice(0, this.length());
	},

	containsKey : function(k) {
		return this.ks.indexOf(k) > -1;
	},

	containsValue : function(v) {
		return this.vs.indexOf(v) > -1;
	}
};

var ObjectSet = function() {
	this.constructor();
};
ObjectSet.prototype = {
	constructor : function() {
		this.os = [];
	},

	clear : function() {
		this.os.splice(0, this.length());
	},

	length : function() {
		return this.os.length;
	},

	add : function(o) {
		if (this.os.indexOf(o) == -1) {
			this.os.push(o);
		}
	},

	addAll : function(os) {
		for (var i = 0, len = os.length; i < len; ++i) {
			this.add(os[i]);
		}
	},

	removeAll : function(os) {
		for (var i = 0, len = os.length; i < len; ++i) {
			this.remove(os[i]);
		}
	},

	contains : function(o) {
		return this.os.indexOf(o) > -1;
	},

	remove : function(o) {
		var index = this.os.indexOf(o);
		if (index > -1) {
			return this.os.splice(index, 1)[0];
		}
		return null;
	},

	removeAt : function(index) {
		if (index > -1 && index < this.os.length) {
			return this.remove(this.os[index]);
		}
		return null;
	},

	values : function() {
		return this.os.slice(0, this.length());
	},

	get : function(index) {
		if (index > -1 && index < this.length()) {
			return this.os[index];
		}
		return null;
	}
};

var Validation = function() {
};
Validation.prototype = {
	constructor : function(config) {
		if (config) {
			Ext.apply(this, config);
		}
	},

	getType : function() {
		return null;
	},

	validate : function(o) {
		var rs = [];
		var s, cs;
		for (var n in o) {
			cs = o[n];
			if (!(cs instanceof Array)) {
				cs = [cs];
			}
			for (var i = 0, len = cs.length; i < len; ++i) {
				s = this.doValidate(n, cs[i]);
				if (s) {
					rs.push(s);
				}
			}
		}
		if (rs.length > 0) {
			return rs.join("\n");
		}
		return null;
	},

	doValidate : function(n, c) {
		return null;
	}
};

var TypeValidation = Ext.extend(Validation, {
			constructor : function(config) {
				TypeValidation.superclass.constructor.call(this, config);
			},

			getType : function() {
				return "type";
			},

			doValidate : function(n, c) {
				switch (n) {
					case "int" :
						return this.validateInt(c.value, c.msg);
					case "float" :
						return this.validateFloat(c.value, c.msg);
				}
				return null;
			},

			validateInt : function(value, msg) {
				var ok = true;
				if (isNaN(parseInt(value)) || (value + "").indexOf(".") > -1) {
					ok = false;
				} else {
					var oLen = ("" + value).length;
					var len = ("" + parseInt(value)).length;
					if (oLen != len) {
						ok = false;
					}
				}
				if (!ok) {
					if (!msg) {
						msg = "";
					}
					return msg + Resources.isNotInt;
				}
				return null;
			},

			validateFloat : function(value, msg) {
				var ok = true;
				if (isNaN(parseFloat(value))) {
					ok = false;
				} else {
					var oLen = ("" + value).length;
					var len = ("" + parseFloat(value)).length;
					if (oLen != len) {
						ok = false;
					}
				}
				if (!ok) {
					if (!msg) {
						msg = "";
					}
					return msg + Resources.isNotFloat;
				}
				return null;
			}
		});

var CompareValidation = Ext.extend(Validation, {
			constructor : function(config) {
				CompareValidation.superclass.constructor.call(this, config);
			},

			getType : function() {
				return "compare";
			},

			doValidate : function(n, c) {
				if (c.value != null && c.value2 != null) {
					switch (n) {
						case "eq" :
							return this.validateEQ(c.value, c.value2, c.msg);
						case "neq" :
							return this.validateNEQ(c.value, c.value2, c.msg);
						case "lt" :
							return this.validateLT(c.value, c.value2, c.msg);
						case "le" :
							return this.validateLE(c.value, c.value2, c.msg);
						case "gt" :
							return this.validateGT(c.value, c.value2, c.msg);
						case "ge" :
							return this.validateGE(c.value, c.value2, c.msg);
					}
				}
				return null;
			},

			validateEQ : function(v1, v2, msg) {
				if (v1 != v2) {
					if (!msg) {
						msg = v1 + " != " + v2;
					}
					return msg;
				}
				return null;
			},

			validateNEQ : function(v1, v2, msg) {
				if (v1 == v2) {
					if (!msg) {
						msg = v1 + " == " + v2;
					}
					return msg;
				}
				return null;
			},

			validateLT : function(v1, v2, msg) {
				if (v1 >= v2) {
					if (!msg) {
						msg = v1 + " >= " + v2;
					}
					return msg;
				}
				return null;
			},

			validateLE : function(v1, v2, msg) {
				if (v1 > v2) {
					if (!msg) {
						msg = v1 + " > " + v2;
					}
					return msg;
				}
				return null;
			},

			validateGT : function(v1, v2, msg) {
				if (v1 <= v2) {
					if (!msg) {
						msg = v1 + " <= " + v2;
					}
					return msg;
				}
				return null;
			},

			validateGE : function(v1, v2, msg) {
				if (v1 < v2) {
					if (!msg) {
						msg = v1 + " < " + v2;
					}
					return msg;
				}
				return null;
			}
		});

var NullValidation = Ext.extend(Validation, {
			constructor : function(config) {
				NullValidation.superclass.constructor.call(this, config);
			},

			getType : function() {
				return "none";
			},

			doValidate : function(n, c) {
				switch (n) {
					case "o" :
						return this.validateObj(c.value, c.msg);
					case "os" :
						return this.validateList(c.value, c.msg);
				}
				return null;
			},

			validateObj : function(o, msg) {
				if (o == null) {
					if (!msg) {
						msg = "";
					}
					return msg + " " + Resources.isNull2;
				}
				return null;
			},

			validateList : function(os, msg) {
				validateObj(os, Resources.list);
				for (var i = 0, len = os.length; i < len; ++i) {
					if (!msg) {
						msg = Resources.list + "[" + i + "]";
					}
					validateObj(os[i], msg);
				}
			}
		});

var LengthValidation = Ext.extend(Validation, {
			constructor : function(config) {
				LengthValidation.superclass.constructor.call(this, config);
			},

			getType : function() {
				return "length";
			},

			doValidate : function(n, c) {
				switch (n) {
					case "min" :
						return this.validateMin(c.value, c.min, c.msg);
					case "max" :
						return this.validateMax(c.value, c.max, c.msg);
					case "range" :
						return this.validateRange(c.value, c.min, c.max, c.msg);
				}
				return null;
			},

			getLength : function(s) {
				if (s) {
					return s.length || 0;
				}
				return 0;
			},

			validateMin : function(s, min, msg) {
				var len = this.getLength(s);
				if (len < min) {
					if (!msg) {
						msg = "";
					}
					return msg + Resources.length + " < " + min;
				}
				return null;
			},

			validateMax : function(s, max, msg) {
				var len = this.getLength(s);
				if (len > max) {
					if (!msg) {
						msg = "";
					}
					return msg + Resources.length + " > " + max;
				}
				return null;
			},

			validateRange : function(s, min, max, msg) {
				var rs = [];
				var r = this.validateMin(s, min, msg);
				if (r) {
					rs.push(r);
				}
				r = this.validateMax(s, max, msg);
				if (r) {
					rs.push(r);
				}
				if (rs.length > 0) {
					return rs.join("\n");
				}
				return null;
			}
		});

var ValidationMgr = new function() {
	this.map = new ObjectMap();

	this.reg = function(validation) {
		this.map.put(validation.getType(), validation);
	};

	this.unreg = function(type) {
		this.map.remove(type);
	};

	this.get = function(type) {
		return this.map.get(type);
	},

	this.validate = function(o) {
		var rs = [];
		var s, c, validation;
		for (n in o) {
			c = o[n];
			validation = this.get(n);
			if (validation) {
				s = validation.validate(c);
				if (s) {
					rs.push(s);
				}
			}
		}
		if (rs.length > 0) {
			return rs.join("\n");
		}
		return null;
	}

	this.reg(new LengthValidation());
	this.reg(new NullValidation());
	this.reg(new CompareValidation());
	this.reg(new TypeValidation());
};

var ScreenLock = new function() {
	this.nullObj = {};
	this.lockMap = new ObjectMap();
	this.zIndex = 1000;
	this.step = 5;
	this.ajaxMaskVisible = true;
	this.ajaxLock = null;

	this.createMask = function(cls, zIndex, html) {
		var mask = Ext.get(document.body).createChild({
					tag : "div",
					cls : cls,
					style : "z-index:" + zIndex,
					html : html || ""
				});
		return mask;
	};

	this.lockScreen = function(zIndex) {
		if (zIndex == null) {
			zIndex = 99999;
		}
		if (!this.screenMask) {
			this.screenMask = this.createMask("mask", zIndex);
		}
	};

	this.unlockScreen = function() {
		if (this.screenMask) {
			Ext.get(this.screenMask).remove();
		}
		this.screenMask = null;
	};

	this.isLocked = function(cmp) {
		if (cmp == null) {
			cmp = this.nullObj;
		}
		return this.lockMap.containsKey(cmp);
	};

	this.lock = function(cmp) {
		if (this.isLocked(cmp)) {
			return false;
		}
		var mask = this.createMask("mask", this.zIndex);
		var index = -1;
		if (cmp) {
			var dom = cmp.getEl().dom;
			index = dom.style.zIndex;
			dom.style.zIndex = this.zIndex + 1;
		} else {
			cmp = this.nullObj;
		}
		var o = {
			index : index,
			mask : mask
		};
		this.lockMap.put(cmp, o);
		this.zIndex += this.step;
	};

	this.unlock = function(cmp) {
		if (!this.isLocked(cmp)) {
			return false;
		}
		var oCmp = cmp;
		if (cmp == null) {
			cmp = this.nullObj;
		}
		var o = this.lockMap.remove(cmp);
		if (o) {
			if (oCmp) {
				oCmp.getEl().dom.style.zIndex = o.index;
			}
			o.mask.remove();
			for (var n in o) {
				delete o[n];
			}
		}
	};

	this.lockAjax = function() {
		if (!this.ajaxMask) {
			this.ajaxMask = this.createMask("mask", 9999999, "");
			this.ajaxMask.appendChild(this.createMask("loadingMask", 1,
					"Loading...").dom);
			this.ajaxMask.hide();
			Ext.Ajax.on('beforerequest', function(conn, options) {
						var o = options.others;
						if (o == null || !o.unLock) {
							if (this.ajaxMaskVisible) {
								this.ajaxMask.show();
							}
						}
					}, this);

			var f = function(conn, res, options) {
				var o = options.others;
				if (o == null || !o.unLock) {
					if (this.ajaxMaskVisible) {
						this.ajaxMask.hide();
					}
				}
			};
			Ext.Ajax.on('requestcomplete', f, this);
			Ext.Ajax.on('requestexception', f, this);
		}
	};

	this.setAjaxMaskVisible = function(v) {
		this.ajaxMaskVisible = v;
	};
};

var LoadingMgr = new function() {
	this.mask = null;
	this.inited = false;

	this.getMask = function() {
		if (!this.mask) {
			this.mask = document.createElement("div");
			this.mask.innerText = "Loading...";
			Ext.get(this.mask).addClass("loadingMask");
			document.body.appendChild(this.mask);
		}
		return this.mask;
	};

	this.show = function() {
		Ext.get(this.getMask()).show();
	};

	this.hide = function() {
		Ext.get(this.getMask()).hide();
	};

	this.init = function() {
		if (this.inited) {
			return;
		}
		Ext.Ajax.on('beforerequest', function() {
					this.show();
				}, this);
		Ext.Ajax.on('requestcomplete', function() {
					this.hide();
				}, this);
		Ext.Ajax.on('requestexception', function() {
					this.hide();
				}, this);
		this.inited = true;
	}
};

var HtmlUtils = new function() {
};

HtmlUtils.parseClipboardHTML = function() {
	var id = Ext.id();
	var dom = Ext.getDom(id);
	if (!dom) {
		dom = Ext.DomHelper.append(document.body, {
					id : id,
					tag : "div",
					style : "position:absolute;top:-1000px;left:-1000px;"
				});
	}
	dom.innerHTML = "";
	var range = document.body.createTextRange();
	range.moveToElementText(dom);
	range.execCommand("Paste");

	var html = dom.innerHTML;
	dom.innerHTML = HtmlUtils.convertHTML(html);
	var rows = [];
	var rowDom, colDoms, row;
	var rowDoms = XmlUtils.ns(dom, "tr");
	for (var i = 0, len = rowDoms.length; i < len; ++i) {
		row = [];
		rowDom = rowDoms[i];
		colDoms = XmlUtils.ns(rowDom, "td");
		for (var j = 0, jlen = colDoms.length; j < jlen; ++j) {
			row.push(HtmlUtils.html2Text(colDoms[j]));
		}
		rows.push(row);
	}
	dom.innerHTML = "";
	return rows;
};

HtmlUtils.html2Text = function(dom) {
	var s = [];
	var cns = dom.childNodes;
	var cn, pcn;
	for (var i = 0, len = cns.length; i < len; ++i) {
		cn = cns[i];
		if (cn.tagName == null) {
			s.push(cn.nodeValue);
		} else {
			if (i > 0) {
				pcn = cns[i - 1];
				if (pcn.tagName != null && pcn.tagName.toLowerCase() == "div") {
					s.push("\n");
				}
			}
			s.push(HtmlUtils.html2Text(cn));
		}
	}
	return s.join("");
};

HtmlUtils.convertHTML = function(html) {
	// Remove all SPAN tags
	html = html.replace(/<\/?SPAN[^>]*>/gi, "");
	// Remove Class attributes
	html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
	// Remove Style attributes
	html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3");
	// Remove Lang attributes
	html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
	// Remove XML elements and declarations
	html = html.replace(/<\\?\?xml[^>]*>/gi, "");
	// Remove Tags with XML namespace declarations: <o:p></o:p>
	html = html.replace(/<\/?\w+:[^>]*>/gi, "");
	// Replace the &nbsp;
	html = html.replace(/&nbsp;/gi, " ");
	// Transform <P> to <DIV>
	var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)", "gi");// Different because of
	// a IE 5.0 error
	html = html.replace(re, "<div$2</div>");
	return html;
};

HtmlUtils.isFromWord = function(html) {
	if (!this.wordReg) {
		this.wordReg = /<\w[^>]* class="?MsoNormal"?/gi;
	}
	return this.wordReg.test(html);
};

HtmlUtils.isFromExcel = function(html) {
	if (!this.excelReg) {
		this.excelReg = /<\w[^>]* class="?xl"?/gi;
	}
	return this.excelReg.test(html);
};

var Utils = new function() {
};

Utils.addInstanceFunc = function(clazz) {
	clazz.getInstance = function() {
		if (!this.instance) {
			this.instance = new clazz();
		}
		return this.instance;
	};
};

Utils.updateProgress = function(finishValue, totalValue, progressBar) {
	var rate, text;
	if (finishValue == 0 || totalValue == 0) {
		rate = 0;
		text = "0%";
	} else {
		rate = finishValue / totalValue;
		text = Utils.round(rate * 100, 2) + "%";
	}
	progressBar.updateProgress(rate, text);
};

Utils.removeNode = function(dom) {
	if (dom) {
		while (dom.firstChild) {
			var el = Ext.get(dom.firstChild);
			if (el) {
				el.remove();
			} else {
				dom.removeChild(dom.firstChild);
			}
		}
		Ext.get(dom).remove(true);
	}
};

Utils.recordToJSON = function(record, fs) {
	var o = {};
	var f;
	for (var i = 0, len = fs.length; i < len; ++i) {
		f = fs[i];
		o[f] = record.get(f);
	}
	return o;
};

Utils.createRecordClass = function(fs) {
	var os = [];
	for (var i = 0, len = fs.length; i < len; ++i) {
		os.push({
					name : fs[i]
				});
	}
	return Ext.data.Record.create(os);
};

Utils.newRecord = function(recordClass, data, fs, fn, scope) {
	var rs = this.createRecords(recordClass, [data], fs, fn, scope);
	if (rs.length > 0) {
		return rs[0];
	}
	return null;
};

Utils.populateRecord = function(record, data, fs, fn, scope) {
	var f;
	for (var i = 0, len = fs.length; i < len; ++i) {
		f = fs[i];
		if (fn) {
			record.set(f, fn.call(scope, data, f));
		} else {
			record.set(f, data[f]);
		}
	}
};

Utils.createRecords = function(recordClass, dataList, fs, fn, scope) {
	var rs = [];
	var record, data;
	for (var i = 0, len = dataList.length; i < len; ++i) {
		data = dataList[i];
		record = new recordClass();
		for (var j = 0, jlen = fs.length; j < jlen; ++j) {
			if (fn) {
				record.set(fs[j], fn.call(scope, data, fs[j]));
			} else {
				record.set(fs[j], data[fs[j]]);
			}
		}
		rs.push(record);
	}
	return rs;
};

Utils.isBlank = function(s) {
	if (s == null || ("" + s).length == 0) {
		return true;
	}
	return false;
};

Utils.createSubmitFrame = function(frameId, config) {
	if (frameId == null) {
		frameId = "submitFrame" + Utils.getId();
	}
	if (!Ext.getDom(frameId)) {
		Ext.DomHelper.append(document.body, Ext.apply({
							tag : "iframe",
							id : frameId,
							name : frameId,
							style : "display:none;position:absolute;"
						}, config || {}));
	}
	return frameId;
};

Utils.date2Str = function(o, fs, dateFormat) {
	var f, v;
	for (var i = 0, len = fs.length; i < len; ++i) {
		f = fs[i];
		v = o[f];
		o[f] = v.format(dateFormat);
	}
};

Utils.str2Date = function(o, fs, dateFormat) {
	var f, v;
	for (var i = 0, len = fs.length; i < len; ++i) {
		f = fs[i];
		v = o[f];
		o[f] = Date.parseDate(v, dateFormat);
	}
};

Utils.selectText = function(d, start, end) {
	var v = d.value;
	var doFocus = false;
	if (v.length > 0) {
		start = start === undefined ? 0 : start;
		end = end === undefined ? v.length : end;
		if (d.setSelectionRange) {
			d.setSelectionRange(start, end);
		} else if (d.createTextRange) {
			var range = d.createTextRange();
			range.moveStart('character', start);
			range.moveEnd('character', end - v.length);
			range.select();
		}
		doFocus = Ext.isGecko || Ext.isOpera;
	} else {
		doFocus = true;
	}
	if (doFocus) {
		d.focus();
	}
};

Utils.getFilterFn = function(text, fs) {
	return function(record) {
		if (text && Utils.trim(text).length > 0) {
			if (!fs || fs.length == 0) {
				fs = [];
				for (var i = 0, len = record.fields.getCount(); i < len; ++i) {
					fs.push(record.fields.get(i).name);
				}
			}
			var value;
			for (var i = 0, len = fs.length; i < len; ++i) {
				value = record.get(fs[i]);
				if (value != null && ("" + value).indexOf(text) > -1) {
					return true;
				}
			}
			return false;
		}
		return true;
	}
};

Utils.encodeHTML = function(s) {
	if (s) {
		return s.replace(/\</g, "&lt;");
	}
	return s;
};

Utils.encode = function(str) {
	if (typeof str != 'string') {
		return str;
	}
	var s = str.replace(/\%/g, "%25");
	s = s.replace(/&/g, "%26");
	// s = s.replace(/£/g, "%A3");
	// s = s.replace(/€/g, "%E2%82%AC");
	s = s.replace(/¥/g, "%A5");
	// s = s.replace(/¢/g, "%A2");
	// s = s.replace(/₣/g, "%E2%82%A3");
	s = s.replace(/\+/g, "%2B");
	s = s.replace(/#/g, "%23");
	s = s.replace(/\</g, "%26lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/'/g, "%26apos;");
	s = s.replace(/"/g, "%26quot;");
	s = s.replace(/\?/g, "%3F");
	return s;
};

Utils.disableContextMenu = function(e) {
	Ext.get(document.body).on("contextmenu", function(e, t, o) {
				e.stopEvent();
			});
};

Utils.disableSystemKeys = function(e) {
	var keyConfigs = [{
				keyCode : 114
			}];
	var c;
	for (var i = 0, len = keyConfigs.length; i < len; ++i) {
		c = keyConfigs[i];
		if (!c.ctrlKey) {
			c.ctrlKey = false;
		}
		if (!c.shiftKey) {
			c.shiftKey = false;
		}
		if (!c.altKey) {
			c.altKey = false;
		}
		if (e.ctrlKey == c.ctrlKey && e.shiftKey == c.shiftKey
				&& e.altKey == c.altKey && e.keyCode == c.keyCode) {
			try {
				e.preventDefault();
				e.browserEvent.keyCode = 0;
			} catch (error) {
			}
			break;
		}
	}
};

Utils.getCaret = function(textBox) {
	var start, end;
	if (typeof(textBox.selectionStart) == "number") {
		start = textBox.selectionStart;
		end = textBox.selectionEnd;
	} else if (document.selection) {
		var range = document.selection.createRange();
		if (range.parentElement().id == textBox.id) {
			var range_all = document.body.createTextRange();
			range_all.moveToElementText(textBox);
			for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++) {
				range_all.moveStart('character', 1);
			}
			for (var i = 0; i <= start; i++) {
				if (textBox.value.charAt(i) == '\n') {
					start++;
				}
			}
			var range_all = document.body.createTextRange();
			range_all.moveToElementText(textBox);
			for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++) {
				range_all.moveStart('character', 1);
			}
			for (var i = 0; i <= end; i++) {
				if (textBox.value.charAt(i) == '\n') {
					end++;
				}
			}
		}
	}
	return {
		start : start,
		end : end
	};
};

Utils.unselectable = function(dom, omitions) {
	if (!omitions) {
		omitions = ["input", "textarea", "select"];
	}
	Ext.fly(dom).on("selectstart", function(e, t, o) {
				var target = e.target;
				var tagName = target.tagName.toLowerCase();
				if (omitions.indexOf(tagName) == -1) {
					e.preventDefault();
				}
			});
};

Utils.disableBackspace = function() {
	Ext.get(document.body).on("keydown", function(e, t, o) {
		if (e.keyCode == 8) {
			var tagName = t.tagName.toLowerCase();
			if ((tagName != "input" && tagName != "textarea") || t.readOnly
					|| t.disabled) {
				e.stopEvent();
			}
		}
	});
};

Utils.clone = function(o) {
	if (o == null) {
		return null;
	}
	if (o instanceof Object) {
		if (o instanceof Array) {
			var rs = [];
			for (var i = 0, len = o.length; i < len; ++i) {
				rs.push(Utils.clone(o[i]));
			}
			return rs;
		} else {
			if (o.clone instanceof Function) {
				return o.clone();
			} else if (o instanceof Function) {
				return o;
			}
			var rs = {};
			for (var n in o) {
				rs[n] = Utils.clone(o[n]);
			}
			return rs;
		}
	}
	return o;
};

Utils.round = function(v, r) {
	var rate = Math.pow(10, r);
	var nv = Math.round(v * rate);
	return nv / rate;
};

Utils.isUndefined = function(v) {
	return typeof v == "undefined";
};

Utils.toArray = function(o) {
	if (o instanceof Array) {
		return o;
	}
	return [o];
};

Utils.sort = function(ns, fn, scope) {
	var len = ns.length;
	for (var i = 1; i < len; ++i) {
		for (var j = 0; j < len - 1; ++j) {
			var c = fn.call(scope, ns[j], ns[j + 1]);
			if (c > 0) {
				var tmp = ns[j];
				ns[j] = ns[j + 1];
				ns[j + 1] = tmp;
			}
		}
	}
}

Utils.createRecord = function(p, fields, fn, scope) {
	var o = [];
	for (var j = 0, jlen = fields.length; j < jlen; ++j) {
		if (fn) {
			o[j] = fn.call(scope, p, fields[j]);
		} else {
			o[j] = p[fields[j]];
		}
	}
	return o;
};

Utils.resetComboBox = function(cmp, valueField) {
	var store = cmp.getStore();
	if (store.getCount() > 0) {
		var v = store.getAt(0).get(valueField || "value");
		cmp.setValue(v);
	}
};

Utils.getValueFromGui = function(obj, keys, values, valueFunc, scope) {
	for (var n in keys) {
		var id = keys[n];
		var key = values[id];
		var v = Ext.getCmp(id).getValue();
		if (valueFunc) {
			v = valueFunc.call(scope, v);
		}
		obj[key] = v;
	}
};

Utils.setValueToGui = function(obj, keys, values, valueFunc, scope) {
	for (var n in keys) {
		var id = keys[n];
		var key = values[id];
		var v = obj[key];
		if (valueFunc) {
			v = valueFunc.call(scope, v);
		}
		Ext.getCmp(id).setValue(v);
	}
};

Utils.appendArray = function(as, as2, unique) {
	var rs = [];
	if (as && !as2) {
		rs = as;
	} else if (!as && as2) {
		rs = as2;
	} else {
		rs = rs.concat(as);
		rs = rs.concat(as2);
	}
	if (unique) {
		return Utils.unique(rs);
	}
	return rs;
};

Utils.test = function(name, obj) {
	var s = [];
	var pt = obj.prototype;
	for (var i in pt) {
		s.push(name + ".prototype." + i + " = " + pt[i]);
	}
	Utils.log(obj);
	Utils.log(s.join("; \n") + ";", true);
};

Utils.findParent = function(node, attr, value) {
	if (!node.isLeaf() && node.attributes[attr] == value) {
		return node;
	}
	var cns = node.childNodes;
	var result;
	for (var i = 0, length = cns.length; i < length; ++i) {
		result = this.findParent(cns[i], attr, value);
		if (result) {
			return result;
		}
	}
	return null;
};

Utils.getNodeSearchPath = function(node) {
	var path = [];
	if (!node) {
		return path;
	}
	while (node) {
		path.unshift(node.attributes.nodeId);
		node = node.parentNode;
	}
	if (path.length > 1) {
		path.shift();
	}
	path.push(-1);
	return path;
};

Utils.getValue = function() {
	for (var i = 0, length = arguments.length; i < length; ++i) {
		if (arguments[i] != undefined) {
			return arguments[i];
		}
	}
	return null;
};

Utils.prompt = function(title, msg, fn, scope, multiline, value) {
	Ext.Msg.show({
				title : title,
				msg : msg,
				buttons : {
					ok : Resources.ok,
					cancel : Resources.cancel
				},
				fn : fn,
				minWidth : 250,
				scope : scope,
				prompt : true,
				multiline : multiline,
				value : (value != null ? value : "")
			});
};

Utils.confirm = function(title, msg, fn, scope) {
	Ext.Msg.show({
				title : title,
				msg : msg,
				buttons : {
					yes : Resources.yes,
					no : Resources.no
				},
				fn : fn,
				scope : scope,
				icon : Ext.Msg.QUESTION,
				minWidth : 265
			});
};

Utils.info = function(title, msg, options) {
	alert(title);
	return;
	var defaultOptions = {
		icon : Ext.Msg.INFO
	};
	if (options) {
		Ext.apply(defaultOptions, options);
	}
	Utils.alert(title, msg, defaultOptions);
};

Utils.error = function(title, rich) {
	if (rich && title.indexOf("\n") > -1) {
		if (!this.errWin) {
			this.errText = new Ext.form.TextArea({
						readOnly : true,
						cls : "red"
					});
			this.errWin = GuiUtil.createWin({
						title : Resources.error,
						width : 435,
						height : 270,
						resizable : true,
						items : [this.errText],
						buttons : [{
									text : Resources.close,
									handler : function() {
										this.errWin.hide();
									},
									scope : this
								}]
					});
		}
		this.errWin.show();
		this.errWin.center();
		this.errText.setValue(title);
	} else {
		alert(title);
	}
};

Utils.alert = function(title, msg, options) {
	var config = {
		title : title,
		msg : msg,
		buttons : {
			ok : Resources.ok
		},
		minWidth : 265,
		fn : function() {
			ScreenLock.unlock(this.msgBox.getDialog());
		},
		scope : this
	};
	if (options) {
		Ext.apply(config, options);
	}
	this.msgBox = Ext.Msg.show(config);
	ScreenLock.lock(this.msgBox.getDialog());
};

Utils.getId = function() {
	if (!this.id) {
		this.id = new Date().getTime();
	}
	return ++this.id;
};

Utils.checkResponse = function(xml) {
	var result = XmlUtils.n(xml, "result");
	var state = XmlUtils.v(result, "state");
	var flag = true;
	if (state == 0) {
		flag = false;
	}
	var message = XmlUtils.v(result, "message");
	if (message) {
		if (flag) {
			Utils.info(Resources.info, message);
		} else {
			Utils.error(Resources.error, message);
		}
	}
	return flag;
};

Utils.copyProperties = function(obj1, obj2) {
	for (var i in obj2) {
		if (typeof obj2[i] != "function") {
			obj1[i] = obj2[i];
		}
	}
};

Utils.parseBoolean = function(s) {
	if (s == "true") {
		return true;
	}
	return false;
};

Utils.numberKeyListener = function(e) {
	var kc = e.keyCode;
	if (kc != 8 && kc != 9 && (kc < 48 || kc > 57)) {
		e.stopEvent();
	}
};

Utils.unique = function(as) {
	var result = [];
	for (var i = 0, length = as.length; i < length; ++i) {
		if (result.indexOf(as[i]) == -1) {
			result.push(as[i]);
		}
	}
	return result;
};

Utils.formatData = function(data) {
	var reg = new RegExp("\"", "g");
	return data.replace(reg, "'");
};

Utils.trim = function(str) {
	var strTrim = str.replace(/(^\s*)|(\s*$)/g, "");
	strTrim = strTrim.replace(/^[\s　\t]+|[\s　\t]+$/, "");
	return strTrim;
};

Utils.getUrlParams = function(url) {
	var params = {};
	var pos = url.indexOf("?");
	if (pos == -1) {
		return params;
	}
	var queryString = url.substring(pos + 1);
	return Ext.urlDecode(queryString);
};

Utils.createForm = function(config) {
	var fields = config.fields || [];
	config.fields = null;
	delete config.fields;
	var parentNode = config.parentNode || document.body;
	config.parentNode = null;
	delete config.parentNode;

	var form = Ext.getDom(config.id);
	if (!form) {
		form = Ext.DomHelper.append(parentNode, Ext.apply({
							tag : "form"
						}, config));
	}
	fields.push({
				id : id + "FormField",
				name : ds.Common.FORM,
				value : 1
			});
	var input, field;
	for (var i = 0, length = fields.length; i < length; ++i) {
		field = fields[i];
		input = Ext.getDom(field.id);
		if (!input) {
			input = Ext.DomHelper.append(form, {
						tag : "input",
						type : "hidden",
						id : field.id,
						name : field.name
					});
		}
		input.value = field.value;
	}
	return form;
};

Utils.handleFail = function(msg) {
	this.error(Resources.error, msg);
};

Utils.log = function(msg, append, x, y) {
	if (isNaN(x)) {
		x = 10;
	}
	if (isNaN(y)) {
		y = 10;
	}
	if (!Ext.getDom("log")) {
		Ext.get(document.body).createChild({
			tag : "textarea",
			id : "log",
			style : "position:absolute;left:" + x + "px;top:" + y
					+ "px;width:300px;height:200px;z-index:9999999"
		});
	}
	var dom = Ext.getDom("log");
	if (append) {
		var value = dom.value;
		if (value) {
			msg = value + msg;
		}
	}
	dom.value = msg;
};

Utils.linkTo = function(page, refresh) {
	if (refresh) {
		if (page.indexOf("?") == -1) {
			page += "?";
		} else {
			page += "&";
		}
		page += "timestamp=" + this.getId();
	}
	window.location.href = page;
};

var XmlUtils = new function() {
};

XmlUtils.parse = function(xml) {
	var dom;
	try {
		dom = new ActiveXObject("Microsoft.XMLDOM");
		dom.async = false;
		dom.loadXML(xml);
	} catch (error) {
		try {
			var parser = new DOMParser();
			dom = parser.parseFromString(xml, "text/xml");
			delete parser;
		} catch (error2) {
			if (debug)
				alert("XML parsing is not supported.");
		}
	}
	return dom;
};

XmlUtils.serialize = function(dom) {
	var xml = dom.xml;
	if (xml == undefined) {
		try {
			var serializer = new xmlserializer();
			xml = serializer.serializetostring(dom);
			delete serializer;
		} catch (error) {
			if (debug)
				alert("dom serialization is not supported.");
		}
	}
	return xml;
};

XmlUtils.serializeChildNodes = function(data) {
	var xml = XmlUtils.xml(data);
	var cns = xml.childNodes;
	var s = [];
	for (var i = 0, length = cns.length; i < length; ++i) {
		s.push(XmlUtils.serialize(cns[i]));
	}
	return s.join("");
};

XmlUtils.xml = function(data) {
	if (typeof data == "string") {
		return this.parse(data).firstChild;
	}
	return data;
};

XmlUtils.a = function(xml, attrName) {
	return xml.getAttribute(attrName);
};

XmlUtils.ns = function(xml, tagName) {
	return xml.getElementsByTagName(tagName);
};

XmlUtils.n = function(xml, tagName) {
	return this.ns(xml, tagName)[0];
};

XmlUtils.v = function(xml, tagName) {
	try {
		return this.n(xml, tagName).firstChild.nodeValue;
	} catch (error) {
		return "";
	}
};

XmlUtils.nv = function(node) {
	var child = node.firstChild;
	if (child) {
		return child.nodeValue;
	}
	return null;
};
