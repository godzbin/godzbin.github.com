/**
 * Created by GodzBin on 2016/3/18.
 */
var tools = {
  getData: function(url, params, callback, callbackParams) {
    Ext.Ajax.timeout = 60000;
    var dataProcess = "../../dataProcess";
    params = {
      FUNC: url,
      FUNC_PARAMS: JSON.stringify(params)
    }
    Ext.Ajax.request({
      url: dataProcess,
      params: params,
      method: "POST",
      success: function(response, e, e2) {
        var data = JSON.parse(response.responseText);
        // process server response here
        if (data["STATE"] == 1) {
          callback(data["CONTENT"], callbackParams);
        } else {
          main.view.toast(data["ERR_MSG"]);
        }
      },
      failure: function() {
        Ext.Msg.alert("ERR_MSG", "HTTP ERROR");
      }
    });
  },
  dateZerofill: function(time) {
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    var timeArray = [year, month, date, hours, minutes, seconds];
    for (var i = 0, l = timeArray.length; i < l; i++) {
      if ((timeArray[i] + "").length < 2) {
        timeArray[i] = "0" + timeArray[i];
      }
    }
    var timeStr = timeArray[0] + "-" + timeArray[1] + "-" + timeArray[2] + " " + timeArray[3] + ":" + timeArray[4] + ":" + timeArray[5];
    return timeStr;
  },
  Trim: function(string) {
    return string.replace(/(^\s*)|(\s*$)/g, '');
  },
  isObjectEqual: function(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },
  setRaphael: function(dom, NODES, RELATIONS) {
    //用来存储节点的顺序
    var connections = [];


    //定义元素坐标高宽
    var $nodeList = $(".item"); //节点集合jquery对象
    var _x, _y, _w, _h, shapeLen, shapeLen = $nodeList.length; //节点数量
    _x = 190;
    _y = 20;
    _h = 60;
    _w = 40;
    _l = 0;


    // 获取节点的树
    var tree = this.getTree(NODES, RELATIONS);
    var max_l = this.getMaxLength(tree);
    var item_w = $(".item").width();
    var item_h = $(".item").height();
    var dom_w = (item_w + _x) * tree.length;
    var dom_h = (item_h + _y) * max_l;
    $(dom).width(dom_w);
    $(dom).height(dom_h);


    // var SchGraphTab = Ext.getCmp("SchGraphTab");
    var SchGraphTab = main.Schedule.SchGraph.getSchGraphTab();
    SchGraphTab.setHeight(dom_h);
    SchGraphTab.setWidth(dom_w);
    //创建绘图对象
    var r = Raphael("holder", $(dom).width(), $(dom).height());

    var shapes = new Object(); //节点集合


    for (var j = 0, t_l = tree.length; j < t_l; j++) {
      for (var z = 0, n_l = tree[j].length; z < n_l; z++) {
        var nodeId = tree[j][z];
        var itemId = nodeId.split("=")[1];
        _w = $("#item" + itemId).width(); //元素的宽
        _h = $("#item" + itemId).height(); //元素的高
        var r_x = (_w + 100) * j + 20;
        _y = ((dom_h / n_l) - item_h) / 2;
        var r_y = _y * (z + 1) + _h * z;
        shapes[nodeId] = r.rect(r_x, r_y, _w, _h, 4);
        $("#item" + itemId).css({
            top: r_y,
            left: r_x,
          })
          //为节点添加样式和事件，并且绘制节点之间的箭头
        shapes[nodeId].attr({
          // fill: color,
          stroke: "#fff",
          "fill-opacity": 0,
          "stroke-width": 2
        });
      }
    }


    for (var i = 0, l = RELATIONS.length; i < l; i++) {
      connections.push(r.drawArr({
        obj1: shapes[RELATIONS[i]["_SOURCE"]],
        obj2: shapes[RELATIONS[i]["_TARGET"]]
      }));
    }

    // //存储节点间的顺序
    // $nodeList.each(function(i, item) {
    //   //节点json数据
    //   // var data_item = $.parseJSON($(item).attr("data-item"));
    //   var data_item = RELATIONS[]
    //   if (data_item.nextNode) {
    //     connections.push(r.drawArr({
    //       obj1: shapes[data_item.nodeId],
    //       obj2: shapes[data_item.nextNode]
    //     }));
    //   }
    // });
  },
};
tools.getMaxLength = function(tree) {
  var max_l = 0;
  for (var i = 0, t_l = tree.length; i < t_l; i++) {
    if (tree[i].length > max_l) {
      max_l = tree[i].length;
    }
  }
  return max_l;
};
tools.getTree = function(NODES, RELATIONS) {
  var tree = [];
  var rootNode = this.getRootNode(NODES, RELATIONS);
  tools.childNodes = [];
  this.getChildNode(rootNode, RELATIONS);
  tree.push(rootNode);
  for (var i = 0, l = this.childNodes.length; i < l; i++) {
    tree.push(this.childNodes[i]);
  }
  return tree;
};
tools.getRootNode = function(NODES, RELATIONS) {
  var rootNode = [];
  for (var i = 0, l = NODES.length; i < l; i++) {
    var hasNodes = 0;
    for (var j = 0, r_l = RELATIONS.length; j < r_l; j++) {
      if (NODES[i]["RDN"] == RELATIONS[j]["_TARGET"]) {
        hasNodes++;
      }
    }
    if (hasNodes == 0) {
      rootNode.push(NODES[i]["RDN"]);
    }
  }
  return rootNode;
};
tools.childNodes = [];
tools.getChildNode = function(NODES, RELATIONS) {
  var childNode = [];
  for (var i = 0, l = NODES.length; i < l; i++) {
    for (var j = 0, r_l = RELATIONS.length; j < r_l; j++) {
      if (NODES[i] == RELATIONS[j]["_SOURCE"]) {
        childNode.push(RELATIONS[j]["_TARGET"]);
      }
    }
  }
  if (childNode.length) {
    this.childNodes.push(childNode);
    this.getChildNode(childNode, RELATIONS);
  } else {
    return;
  }
};
//随着节点位置的改变动态改变箭头
Raphael.fn.drawArr = function(obj) {
  // var point = getStartEnd(obj.obj1, obj.obj2);
  // var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y, 8);
  // if (obj.arrPath) {
  //   obj.arrPath.attr({
  //     path: path1
  //   });
  // } else {
  //   obj.arrPath = this.path(path1);
  // }
  // return obj;
  // 
  var obj1 = obj.obj1;
  var obj2 = obj.obj2;
  var line = "#999";
  var bg = "";
  if (obj1.line && obj1.from && obj1.to) {
    line = obj1;
    obj1 = line.from;
    obj2 = line.to;
  }
  var bb1 = obj1.getBBox(),
    bb2 = obj2.getBBox(),
    p = [{
      x: bb1.x + bb1.width / 2,
      y: bb1.y - 1
    }, {
      x: bb1.x + bb1.width / 2,
      y: bb1.y + bb1.height + 1
    }, {
      x: bb1.x - 1,
      y: bb1.y + bb1.height / 2
    }, {
      x: bb1.x + bb1.width + 1,
      y: bb1.y + bb1.height / 2
    }, {
      x: bb2.x + bb2.width / 2,
      y: bb2.y - 1
    }, {
      x: bb2.x + bb2.width / 2,
      y: bb2.y + bb2.height + 1
    }, {
      x: bb2.x - 1,
      y: bb2.y + bb2.height / 2
    }, {
      x: bb2.x + bb2.width + 1,
      y: bb2.y + bb2.height / 2
    }],
    d = {},
    dis = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 4; j < 8; j++) {
      var dx = Math.abs(p[i].x - p[j].x),
        dy = Math.abs(p[i].y - p[j].y);
      if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [i, j];
      }
    }
  }
  if (dis.length == 0) {
    var res = [0, 4];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  var x1 = p[res[0]].x,
    y1 = p[res[0]].y,
    x4 = p[res[1]].x,
    y4 = p[res[1]].y;
  dx = Math.max(Math.abs(x1 - x4) / 2, 10);
  dy = Math.max(Math.abs(y1 - y4) / 2, 10);
  var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
    y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
    x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
    y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

  // 箭头
  var size = 8;
  // var angle = Raphael.angle(0, 0, 1, 0); //得到两点之间的角度
  var a45 = Raphael.rad(180 - 45); //角度转换成弧度
  var a45m = Raphael.rad(180 + 45);
  var x2a = parseInt(x4.toFixed(3)) + Math.cos(a45) * size;
  var y2a = parseInt(y4.toFixed(3)) + Math.sin(a45) * size;
  var x2b = parseInt(x4.toFixed(3)) + Math.cos(a45m) * size;
  var y2b = parseInt(y4.toFixed(3)) + Math.sin(a45m) * size;

  var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3), "M", x4.toFixed(3), y4.toFixed(3), "L", x2a.toFixed(3), y2a.toFixed(3), "M", x4.toFixed(3), y4.toFixed(3), "L", x2b.toFixed(3), y2b.toFixed(3)].join(",");
  if (line && line.line) {
    line.bg && line.bg.attr({
      path: path
    });
    line.line.attr({
      path: path
    });
  } else {
    var color = typeof line == "string" ? line : "#000";
    return {
      bg: bg && bg.split && this.path(path).attr({
        stroke: bg.split("|")[0],
        fill: "none",
        "stroke-width": bg.split("|")[1] || 3
      }),
      line: this.path(path).attr({
        stroke: color,
        fill: "none"
      }),
      from: obj1,
      to: obj2
    };
  }
};



function getStartEnd(obj1, obj2) {
  var bb1 = obj1.getBBox(),
    bb2 = obj2.getBBox();
  var p = [{
    x: bb1.x + bb1.width / 2,
    y: bb1.y - 1
  }, {
    x: bb1.x + bb1.width / 2,
    y: bb1.y + bb1.height + 1
  }, {
    x: bb1.x - 1,
    y: bb1.y + bb1.height / 2
  }, {
    x: bb1.x + bb1.width + 1,
    y: bb1.y + bb1.height / 2
  }, {
    x: bb2.x + bb2.width / 2,
    y: bb2.y - 1
  }, {
    x: bb2.x + bb2.width / 2,
    y: bb2.y + bb2.height + 1
  }, {
    x: bb2.x - 1,
    y: bb2.y + bb2.height / 2
  }, {
    x: bb2.x + bb2.width + 1,
    y: bb2.y + bb2.height / 2
  }];
  var d = {},
    dis = [];
  for (var i = 0; i < 4; i++) {
    for (var j = 4; j < 8; j++) {
      var dx = Math.abs(p[i].x - p[j].x),
        dy = Math.abs(p[i].y - p[j].y);
      if (
        (i == j - 4) ||
        (((i != 3 && j != 6) || p[i].x < p[j].x) &&
          ((i != 2 && j != 7) || p[i].x > p[j].x) &&
          ((i != 0 && j != 5) || p[i].y > p[j].y) &&
          ((i != 1 && j != 4) || p[i].y < p[j].y))
      ) {
        dis.push(dx + dy);
        d[dis[dis.length - 1]] = [i, j];
      }
    }
  }
  if (dis.length == 0) {
    var res = [0, 4];
  } else {
    res = d[Math.min.apply(Math, dis)];
  }
  var result = {};
  result.start = {};
  result.end = {};
  result.start.x = p[res[0]].x;
  result.start.y = p[res[0]].y;
  result.end.x = p[res[1]].x;
  result.end.y = p[res[1]].y;
  return result;
}


//获取组成箭头的三条线段的路径
function getArr(x1, y1, x2, y2, size) {
  var angle = Raphael.angle(x1, y1, x2, y2); //得到两点之间的角度
  var a45 = Raphael.rad(angle - 45); //角度转换成弧度
  var a45m = Raphael.rad(angle + 45);
  var x2a = x2 + Math.cos(a45) * size;
  var y2a = y2 + Math.sin(a45) * size;
  var x2b = x2 + Math.cos(a45m) * size;
  var y2b = y2 + Math.sin(a45m) * size;
  var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
  return result;
}