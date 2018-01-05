Ext.ns("utils");

utils.Renderer = function() {
};
utils.Renderer.render = function(tag, cls, v, others) {
	var s = [];
	s.push("<");
	s.push(tag);
	if (cls) {
		s.push(" class='");
		s.push(cls);
		s.push("'");
	}
	if (others) {
		s.push(" ");
		s.push(others);
	}
	s.push(">");
	s.push(v);
	s.push("</");
	s.push(tag);
	s.push(">");
	return s.join("");
};
utils.Renderer.renderLabel = function(cls, v, others) {
	return utils.Renderer.render("label", cls, v, others);
};
utils.Renderer.renderIconValue = function(cls, v, others) {
	if (!cls) {
		cls = "iconText";
	} else {
		cls += " iconText";
	}
	return utils.Renderer.render("div", cls, v, others);
};

utils.ExpandHelper = new function() {
};
utils.ExpandHelper.create1RowTable = function(ns) {
	var n, v, cls;
	var s = [];
	s.push("<div class='reportCatalog'>");
	s.push("<table cellSpacing=1' cellPadding='0'>");
	s.push("<tr>");
	for (var i = 0, len = ns.length;i < len; ++i) {
		n = ns[i];
		s.push("<td class='table-header'>");
		if (n.labelCls) {
			s.push("<pre class='");
			s.push(n.labelCls);
			s.push("'>");
		} else {
			s.push("<pre>");
		}
		s.push(ns[i].label);
		s.push("</pre>");
		s.push("</td>");
	}
	s.push("</tr>");
	s.push("<tr>");
	for (var i = 0, len = ns.length;i < len; ++i) {
		n = ns[i];
		cls = n.cls;
		if (cls == null) {
			cls = "fieldList-value";
		}
		v = n.value;
		if (v != null) {
			v = v.replace(/\n/g, "<br/>");
		}
		s.push("<td class='table-td'>");
		s.push("<div class='");
		s.push(cls);
		s.push("'>");
		s.push(v);
		s.push("</div>");
		s.push("</td>");
	}
	s.push("</tr>");
	s.push("</table>");
	s.push("</div>");
	return s.join("");
};

utils.ExpandHelper.createExpandContent = function(o, res, rows, config) {
	var rowSep = null;
	if (config) {
		rowSep = config.rowSep;
	}
	var ns = [];
	var row, keys, key, cls, newLine, r;
	for (var i = 0, len = rows.length;i < len; ++i) {
		if (i > 0 && rowSep != null) {
			ns.push(rowSep);
		}
		row = rows[i];
		keys = row[ds.RowItem.KEYS];
		cls = row[ds.RowItem.CLS];
		newLine = row[ds.RowItem.NEW_LINE];
		if (!cls) {
			cls = "general-value";
		}
		r = [];
		for (var j = 0, jlen = keys.length;j < jlen; ++j) {
			key = keys[j];
			r.push( {
				label : res[key],
				value : o[key],
				cls : cls,
				newLine : newLine
			});
		}
		ns.push(r);
	}
	return this.createRows(ns);
};

utils.ExpandHelper.createRows = function(ns) {
	if (ns.length == 0) {
		return "";
	}
	var n, v, cls;
	var s = [];
	s.push("<div class='expandArea'>");
	for (var i = 0, len = ns.length;i < len; ++i) {
		n = ns[i];
		if (n.rowSep) {
			s.push("<div class='");
			s.push(n.cls);
			s.push("'>");
			s.push("</div>");
		} else {
			s.push("<div class='general-row'>");
			if (n instanceof Array) {
				for (var j = 0, jlen = n.length;j < jlen; ++j) {
					if (j > 0) {
						s.push("<label class='general-gap'></label>");
					}
					s.push(this.createColumn(n[j]));
				}
			} else {
				s.push(this.createColumn(n));
			}
			s.push("</div>");
		}
	}
	s.push("</div>");
	return s.join("");
};
utils.ExpandHelper.createColumn = function(n) {
	var s = [];
	var labelCls = n.labelCls;
	if (!labelCls) {
		labelCls = "general-label";
	}
	s.push("<label class='");
	s.push(labelCls);
	s.push("'>");
	n.labelTip = true;
	if (n.label != null) {
		if (!n.noTip) {
			s.push("<span class='tip-star'>* </span>");
		}
		s.push(n.label);
		s.push(": ");
	}
	s.push("</label>");

	cls = n.cls;
	if (!cls) {
		cls = "fieldList-value";
	}
	v = n.value;
	if (v != null) {
		v += "";
	}
	if (n.newLine || (v != null && v.indexOf("\n") > -1)) {
		cls += " tip-star-gap";
		s.push(GuiUtil.multiLineRender(cls, v));
	} else {
		s.push("<label class='row-value ");
		s.push(cls);
		s.push("'>");
		s.push(v);
		s.push("</label>");
	}
	return s.join("");
};

utils.TableHelper = new function() {
};
utils.TableHelper.renderContent = function(rows, config) {
	config = Ext.apply( {
		showRowNum : false,
		tag : "pre"
	}, config || {});
	var showRowNum = config.showRowNum;
	var startRow = config.startRow;
	var startNum = config.startNum;
	var colFn = config.colFn;
	var scope = config.scope;
	var tag = config.tag;

	var containerDom = document.createElement("div");
	Ext.get(containerDom).addClass("reportCatalog");
	var tableDom = document.createElement("table");
	tableDom.cellSpacing = 1;
	tableDom.cellPadding = 0;
	containerDom.appendChild(tableDom);
	var tbodyDom = document.createElement("tbody");
	tableDom.appendChild(tbodyDom);

	var rowDom, colDom, label, el;
	var row, col;
	var content, span;
	for (var i = 0, len = rows.length;i < len; ++i) {
		row = rows[i];
		rowDom = document.createElement("tr");
		tbodyDom.appendChild(rowDom);
		if (showRowNum) {
			colDom = document.createElement("td");
			if (i > 0) {
				Ext.get(colDom).addClass("table-rowNum");
				if (i >= startRow) {
					colDom.innerHTML = "" + startNum;
					++startNum;
				} else {
					colDom.innerHTML = "&nbsp;"
				}
			} else {
				Ext.get(colDom).addClass("table-rowNum-head");
				colDom.innerHTML = "&nbsp;";
			}
			rowDom.appendChild(colDom);
		}
		for (var j = 0, jlen = row.length;j < jlen; ++j) {
			col = row[j];
			colDom = document.createElement("td");
			span = col[ds.CellItem.ROW_SPAN];
			if (span != null) {
				colDom.rowSpan = span;
			}
			span = col[ds.CellItem.COL_SPAN];
			if (span != null) {
				colDom.colSpan = span;
			}
			rowDom.appendChild(colDom);
			content = this.formatContent(col[ds.CellItem.CONTENT]);
			if (col[ds.CellItem.KEYWORD]) {
				label = document.createElement("label");
				label.innerHTML = content;
				colDom.appendChild(label);
				el = Ext.get(label);
				el.addClass("keyword");
				el.addClassOnOver("keywordHover");
			} else {
				Ext.DomHelper.append(colDom, {
					tag : tag,
					html : content
				});
			}
			if (colFn) {
				colFn.call(scope, content, colDom, rowDom, col, row, j, i);
			}
			this.formatCell(colDom, col);
		}
	}
	return containerDom;
};
utils.TableHelper.formatContent = function(content) {
	if (content == null) {
		content = "";
	}
	if (content.length == 0) {
		content = "&nbsp;";
	}
	return content;
};
utils.TableHelper.formatCell = function(cell, o) {
	var el = Ext.get(cell);
	var tmp = o[ds.CellItem.WIDTH];
	if (tmp) {
		el.setStyle("width", tmp);
	}
	tmp = o[ds.CellItem.HEADER];
	if (tmp) {
		el.addClass("table-header");
	} else {
		el.addClass("table-td");
	}
	if (o[ds.CellItem.BOLD]) {
		el.setStyle("font-weight", "bold");
	}
	if (o[ds.CellItem.ITALIC]) {
		el.setStyle("font-style", "italic");
	}
	tmp = o[ds.CellItem.ALIGN];
	if (tmp != null) {
		el.setStyle("text-align", tmp);
	}
	tmp = o[ds.CellItem.VALIGN];
	if (tmp != null) {
		el.setStyle("vertical-align", tmp);
	}
	tmp = o[ds.CellItem.BG_COLOR];
	if (tmp != null) {
		el.setStyle("background-color", tmp);
	}
	tmp = o[ds.CellItem.FONT_SIZE];
	if (tmp != null) {
		el.setStyle("font-size", tmp + "pt");
	}
	if (o[ds.CellItem.WRAP]) {
		el.setStyle("word-wrap", "break-word");
	}
	tmp = o[ds.CellItem.INDENT];
	if (tmp != null) {
		el.setStyle("text-indent", tmp + "px");
	}
	tmp = o[ds.CellItem.FONT_FAMILY];
	if (!tmp) {
		tmp = "Arial";
	}
	Ext.get(el.dom.firstChild).setStyle("font-family", tmp);
	if (o[ds.CellItem.UNDERLINE]) {
		el.setStyle("text-decoration", "underline");
	}
	tmp = o[ds.CellItem.COLOR];
	if (tmp) {
		el.setStyle("color", tmp);
	}
};