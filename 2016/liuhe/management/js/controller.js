var main = main || {};
//controller

/**
 * [main description]
 * @type {Object}
 *
 *  树的逻辑, 建模的逻辑
 *  环境逻辑
 *  编辑器的逻辑
 *  调度
 *  调试，运行容器，调度历史
 *
 *
 *
 * update 2385 
 */
main = {
    init: function() {
        main.initInterface();
        main.Tree.initTree();
        main.model.Dimension.getType();
        main.model.Tree.Model.getListAttrType();
        main.getSlaveStore();
    },
    getSlaveStore: function() {
        main.view.Env.createSlaveStore();
        main.model.Env.getSlaveStore();
    },
    setSlaveStroe: function(data) {
        var data = data || [];
        data.unshift({
            _LABEL: "",
            _NAME: "本地",
            RDN: 0
        });
        Ext.StoreMgr.get("EnvDebugSlave").loadData(data);
    },
    initInterface: function() {
        main.view.createInterface();
        main.debugTab.Slave.openSlaveTab();
        main.view.Tree.Model.TabByModelDataToEnvStore();
    },
    // 树的逻辑, 建模的逻辑--------------
    Tree: {

        addTreeNodeText: "addTreeNodeText",
        updateTreeNodeText: "updateTreeNodeText",
        right_node: null,
        right_click_menu_show: function(node, e) {
            if (!node.item) {
                return;
            }
            var menu = main.view.structure.right_click_menu;
            var nodeData = node.record.data;
            var _add = menu.getComponent(2).hide();
            var _update = menu.getComponent(3).hide();
            var _delete = menu.getComponent(4).hide();
            var _refresh = menu.getComponent(7).hide();
            var _addPackage = menu.getComponent(0).hide();
            var _addModel = menu.getComponent(1).hide();
            var _addField = menu.getComponent(5).hide();
            var _updateField = menu.getComponent(6).hide();
            var _removerField = menu.getComponent(8).hide();
            if (nodeData["CLASS"] == configs.TREE_CLASS.Schedule || (nodeData["CLASS"] == configs.TREE_CLASS.ENV && !nodeData.leaf)) {
                _add.show();
                _refresh.show();
            } else if (nodeData["CLASS"] == configs.TREE_CLASS.Package && nodeData["RDN"]) {
                _update.show();
                _delete.show();
                _addPackage.show();
                _addModel.show();
            } else if (nodeData["CLASS"] == configs.TREE_CLASS.Model) {
                _update.show();
                _delete.show();
            } else if (nodeData["CLASS"] == configs.TREE_CLASS.Package) {
                
            } else if (nodeData["CLASS"] == configs.TREE_CLASS.DOMAIN) {
                _addField.show();
                _refresh.show();
                _updateField.show();
                _addPackage.show();
                _removerField.show();
            } else {
                _update.show();
                _delete.show();
            }
            var nodeData = node.record.data;
            main.view.initValue.right_click_node = nodeData;
            var x = node.pageX;
            var y = node.pageY;
            main.view.structure.right_click_menu.setPagePosition(x, y);
            main.view.structure.right_click_menu.show();
        },
        initTree: function() {
            this.getFieldList();
        },

        treeExpand: function(node) {
            if (node.data["CLASS"] == configs.TREE_CLASS.Package && node.data["RDN"] && !node.data["isLoad"]) {
                var RDN = node.data["RDN"];
                main.Tree.getChildrenOfPackage(RDN, node);
            }
            if (node.data["CLASS"] == "Domain" && node.data["RDN"] && !node.data["isLoad"]) {
                var RDN = node.data["RDN"];
                main.Tree.getChildrenOfDomain(RDN, node);
            }
            if (node.data["CLASS"] == configs.TREE_CLASS.ENV && !node.data["isLoad"]) {
                main.Tree.getEnvTree(node);
            }
        },


        //双击选择树节点
        dblclick_tree: function(node, e) {
            if (node.record) {
                var nodeData = node.record.data;
                if (nodeData.CLASS === configs.TREE_CLASS.Schedule) {
                    main.Editor.openEditor(nodeData);
                    return;
                }
                if (nodeData.leaf && nodeData.CLASS == configs.TREE_CLASS.ENV) {
                    main.view.initValue.dblclick_tree_node = nodeData;
                    main.Editor.openEditor(nodeData);
                    return;
                }
                if (nodeData.CLASS == configs.TREE_CLASS.Model) {
                    main.Tree.Model.updateModel(nodeData);
                    return;
                }
            }
        },
        //初始化树-环境节点
        getEnvTree: function(node) {
            var params = {
                RDN: node.data["_PDN"]
            };
            main.model.Tree.getListEnv(params, node);
        },
        setListEnv: function(data, node) {
            // var root = main.view.structure.store.getRoot();
            node.data.isLoad = true;
            for (var i = 0, l = data.length; i < l; i++) {
                data[i]["text"] = data[i]["_NAME"];
                data[i]["leaf"] = true;
                node.appendChild(data[i]);
            }
        },
        addTreeNodeWinShow: function() {
            var nodeData = main.view.initValue.right_click_node;
            main.Tree.right_node = main.view.initValue.right_click_node;
            if (nodeData["CLASS"] == configs.TREE_CLASS.ENV) {
                if (nodeData.leaf) {
                    return;
                }
                if (!main.view.Tree.addTreeWin) {
                    main.view.Tree.createAddTreeNodeWin();
                }
                main.view.Tree.addTreeWin.show();
            } else if (nodeData["CLASS"] == configs.TREE_CLASS.Package || nodeData["RDN"]) {

            } else {
                main.Schedule.addSchedule();
            }
        },
        addTreeNodeWinHide: function() {
            var $this = main.Tree;
            var addTreeNodeTextInput = Ext.getCmp($this.addTreeNodeText);
            addTreeNodeTextInput.setValue("");
            main.view.Tree.addTreeWin.hide();
        },
        addTreeNode: function() {
            var $this = main.view.Tree;
            var addTreeNodeTextInput = Ext.getCmp($this.addTreeNodeText);
            var addTreeNodeText = addTreeNodeTextInput.getValue();
            if (!addTreeNodeText || tools.Trim(addTreeNodeText) === "") {
                main.view.toast("名字不能为空");
                return;
            }
            var parentNode = main.view.initValue.right_click_node;
            var _PDN = main.Tree.right_node["_PDN"];

            if (parentNode.CLASS === configs.TREE_CLASS.ENV) {
                main.model.Tree.addTreeNodeByEnv(addTreeNodeText, _PDN);
            }
            // else if (parentNode.CLASS === configs.TREE_CLASS.DPC) {
            //     main.model.Tree.addTreeNodeByDPC(addTreeNodeText,_PDN);
            // }
        },
        addTreeNodeReturn: function(data) {
            var id = main.Tree.right_node["id"];
            var node = main.view.structure.store.getNodeById(id);
            data["text"] = data["_NAME"];
            data["leaf"] = true;
            node.appendChild(data);
            main.Tree.addTreeNodeWinHide();
        },
        updateTreeNodeWinShow: function() {
            var nodeData = main.view.initValue.right_click_node;
            main.Tree.right_node = main.view.initValue.right_click_node;
            if (nodeData[configs.PACKAGE_TREE.CLASS] == configs.TREE_CLASS.Package) {
                main.Tree.updatePackageWinShow();
                return;
            }
            if (!nodeData.leaf) {
                return;
            }
            if (!this.updateTreeWin) {
                main.view.Tree.createUpdateTreeNodeWin();
            }
            main.view.Tree.updateTreeWin.show();
            var $this = main.Tree;
            var updateTreeNodeTextInput = Ext.getCmp($this.updateTreeNodeText);
            updateTreeNodeTextInput.setValue(nodeData["_NAME"]);
        },
        updateTreeNodeWinHide: function() {
            var $this = main.Tree;
            var updateTreeNodeTextInput = Ext.getCmp($this.updateTreeNodeText);
            updateTreeNodeTextInput.setValue("");
            main.view.Tree.updateTreeWin.hide();
        },
        updateTreeNode: function() {
            var $this = main.Tree;
            var updateTreeNodeTextInput = Ext.getCmp($this.updateTreeNodeText);
            var updateTreeNodeText = updateTreeNodeTextInput.getValue();
            if (!updateTreeNodeText || tools.Trim(updateTreeNodeText) === "") {
                main.view.toast("名字不能为空");
                return;
            }
            var parentNode = main.view.initValue.right_click_node;
            if (!parentNode["_ID"]) {
                return;
            }
            if (parentNode.CLASS === configs.TREE_CLASS.Model) {
                main.Tree.Model.updateModel(node);
                return;
            }
            parentNode["_NAME"] = updateTreeNodeText;
            parentNode["_PDN"] = main.Tree.right_node["_PDN"];
            if (parentNode.CLASS === configs.TREE_CLASS.ENV) {
                main.model.Tree.updateTreeNodeByEnv(parentNode);
            }
            //  else if (parentNode.CLASS === configs.TREE_CLASS.DPC) {
            //     main.model.Tree.updateTreeNodeByDPC(parentNode);
            // }
        },
        updateTreeNodeReturn: function(data) {
            // var node = main.view.initValue.right_click_node;
            // var root = main.view.structure.store.getRoot();
            var id = main.Tree.right_node["id"];
            var node = main.view.structure.store.getNodeById(id);
            var ParentNode = main.Tree.getParentNode(node);
            data["text"] = data["_NAME"];
            data["leaf"] = true;
            ParentNode.replaceChild(data, node);
            main.Tree.updateTreeNodeWinHide();
        },
        deleteTreeNode: function() {
            var node = main.view.initValue.right_click_node;
            main.Tree.right_node = main.view.initValue.right_click_node;
            if (node[configs.PACKAGE_TREE.CLASS] == configs.TREE_CLASS.Package) {
                main.view.Tree.createDeletePackageWin();
                return;
            }
            if (!node.leaf) {
                return;
            }
            if (node.CLASS === configs.TREE_CLASS.Model) {
                main.view.Tree.Model.removeModel(node);
                return;
            }
            Ext.Msg.show({
                title: "警告",
                modal: false,
                msg: "你确定要删除该节点吗？",
                buttonText: {
                    yes: "确定",
                    no: "取消"
                },
                fn: function(btn) {
                    if (btn === "yes") {
                        if (node["CLASS"] === configs.TREE_CLASS.ENV) {
                            main.model.Tree.deleteTreeNodeByEnv(node["RDN"]);
                        } else if (node["CLASS"] === configs.TREE_CLASS.DPC) {
                            main.model.Tree.deleteTreeNodeByDPC(node["RDN"]);
                        }
                    }
                }
            });
        },
        deleteTreeNodeReturn: function(data) {
            var id = main.Tree.right_node["id"];
            var node = main.view.structure.store.getNodeById(id);
            var parentNode = main.Tree.getParentNode(node);
            parentNode.removeChild(node);
        },
        reFreshTree: function() {
            var node = main.view.initValue.right_click_node;
            // var root = main.view.structure.store.getRoot();
            var rNode;
            rNode = main.view.structure.store.getNodeById(node["id"]);
            rNode.removeAll();
            if (node["CLASS"] === configs.TREE_CLASS.ENV) {
                main.Tree.getEnvTree(rNode);
            } else if (node["CLASS"] === configs.TREE_CLASS.Package) {
                if (node["RDN"] && node["id"] === configs.TREE_CLASS.Package) {
                    main.Tree.getChildrenOfPackage(node.data["RDN"], node);
                } else {
                    main.Tree.getFieldList();
                }
            }
        },
        getFieldList: function() {
            main.model.Tree.getFieldList();
        },
        setFieldList: function(data) {
            var root = main.view.structure.store.getRoot();
            root.removeAll();
            for (var i = 0, l = data.length; i < l; i++) {
                data[i]["text"] = data[i]["_NAME"] || data[i]["_LABEL"];
                data[i]["leaf"] = false;
                data[i]["isLoad"] = false;
                data[i]["iconCls"] = "a_domain";
                root.appendChild(data[i]);
            }
        },
        getChildrenOfPackage: function(RDN, node) {
            if (RDN) {
                main.model.Tree.getChildrenOfPackage({
                    RDN: RDN
                }, node);
            } else {
                main.model.Tree.getChildrenOfPackage({}, node);
            }
        },
        setChildrenOfPackage: function(data, node) {
            var root = main.view.structure.store.getRoot().getChildAt(configs.TREE_ROOT.Package);
            if (node) {
                root = node;
                if (node.data.isLoad == false) {
                    node.data.isLoad = true;
                }
            }
            root.removeAll();
            for (var i = 0, l = data.length; i < l; i++) {
                data[i]["text"] = data[i]["_NAME"] || data[i]["_LABEL"];
                if (data[i]["CLASS"] == configs.TREE_CLASS.Package) {
                    data[i]["leaf"] = false;
                } else if (data[i]["CLASS"] == configs.TREE_CLASS.Model) {
                    data[i]["leaf"] = true;
                }
                data[i]["isLoad"] = false;

                root.appendChild(data[i]);
            }
        },
        getChildrenOfDomain: function(RDN, node) {
            main.model.Tree.getChildrenOfDomain({
                RDN: RDN
            }, node);
        },
        setChildrenOfDomain: function(data, node) {
            var root = main.view.structure.store.getRoot().getChildAt(configs.TREE_ROOT.Package);
            if (node) {
                root = node;
                if (node.data.isLoad == false) {
                    node.data.isLoad = true;
                }
            }
            root.removeAll();
            for (var i = 0, l = data.length; i < l; i++) {
                data[i]["text"] = data[i]["_NAME"] || data[i]["_LABEL"];
                if (data[i]["CLASS"] == configs.TREE_CLASS.Package) {
                    data[i]["leaf"] = false;
                } else if (data[i]["CLASS"] == configs.TREE_CLASS.Model) {
                    data[i]["leaf"] = true;
                }
                data[i]["isLoad"] = false;


                root.appendChild(data[i]);
            }
            root.appendChild({
                text: configs.TREE_TEXT.ENV,
                CLASS: configs.TREE_CLASS.ENV,
                iconCls: "i_env",
                _PDN: node.data["RDN"],
                leaf: false,
                isLoad: false,
                children: []
            });
            root.appendChild({
                text: configs.TREE_TEXT.Schedule,
                CLASS: configs.TREE_CLASS.Schedule,
                iconCls: "i_schdule",
                _PDN: node.data["RDN"],
                leaf: true,
                _NAME: configs.TREE_TEXT.Schedule,
            })
        },
        addPackageWinShow: function() {
            main.Tree.right_node = main.view.initValue.right_click_node;
            if (!Ext.getCmp(configs.WIN_NAME.ADD_PACKAGE_WIN)) {
                main.view.Tree.createAddPackageWin();
            }
            Ext.getCmp(configs.WIN_NAME.ADD_PACKAGE_WIN).show();
        },
        addPackage: function() {
            var form = Ext.getCmp(configs.FORM_NAME.ADD_PACKAGE_FORM);
            var value = form.getValues();
            if (!value[configs.PACKAGE_TREE._NAME]) {
                main.view.toast(configs.PACKAGE_TREE._NAME + configs.NO_NULL);
                return;
            }
            console.log(main.Tree.right_node);
            var params = {
                _NAME: value[configs.PACKAGE_TREE._NAME],
                _LABEL: value[configs.PACKAGE_TREE._LABEL],
                _PDN: main.Tree.right_node["RDN"]
            }
            main.model.Tree.addPackage(params);
        },
        addPackageReturn: function(data) {
            var CLASS = configs.PACKAGE_TREE.CLASS;
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            var id = main.Tree.right_node["id"];
            var node = main.view.structure.store.getNodeById(id);
            data["text"] = data[LABEL] || data[NAME];
            if (data[CLASS] == configs.TREE_CLASS.Package) {
                data["leaf"] = false;
            } else if (data[CLASS] == configs.TREE_CLASS.Model) {
                data["leaf"] = true;
            }
            data["isLoad"] = false;
            node.appendChild(data);
            main.Tree.addPackageWinHide();
        },
        addPackageWinHide: function() {
            var form = Ext.getCmp(configs.FORM_NAME.ADD_PACKAGE_FORM);
            form.getForm().reset();
            Ext.getCmp(configs.WIN_NAME.ADD_PACKAGE_WIN).hide();
        },
        updatePackageWinShow: function() {
            main.Tree.right_node = main.view.initValue.right_click_node;
            if (!Ext.getCmp(configs.WIN_NAME.UPDATE_PACKAGE_WIN)) {
                main.view.Tree.createUpdatePackageWin();
            }
            Ext.getCmp(configs.WIN_NAME.UPDATE_PACKAGE_WIN).show();
            main.Tree.getPackage();
        },
        getPackage: function() {
            var node = main.Tree.right_node;
            var params = {
                RDN: node["RDN"]
            }
            main.model.Tree.getPackage(params);
        },
        setPackage: function(data) {
            var form = Ext.getCmp(configs.FORM_NAME.UPDATE_PACKAGE_FORM);
            var _NAME = form.getComponent(0);
            var _LABEL = form.getComponent(1);
            _NAME.setValue(data[configs.PACKAGE_TREE._NAME]);
            _LABEL.setValue(data[configs.PACKAGE_TREE._LABEL]);
        },
        updatePackage: function() {
            var form = Ext.getCmp(configs.FORM_NAME.UPDATE_PACKAGE_FORM);
            var value = form.getValues();
            if (!value[configs.PACKAGE_TREE._NAME]) {
                main.view.toast(configs.PACKAGE_TREE._NAME + configs.NO_NULL);
                return;
            }
            var node = main.Tree.right_node;
            node[configs.PACKAGE_TREE._NAME] = value[configs.PACKAGE_TREE._NAME];
            node[configs.PACKAGE_TREE._LABEL] = value[configs.PACKAGE_TREE._LABEL];

            main.model.Tree.updatePackage(node);
        },
        updatePackageReturn: function(data) {
            var node = main.Tree.right_node;
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            var path = findNode.getPath();
            var tree = path.split("/");
            var root = main.view.structure.store.getNodeById(tree[tree.length - 2]);
            var CLASS = configs.PACKAGE_TREE.CLASS;
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            data["text"] = data[NAME] || data[LABEL];
            if (data[CLASS] == configs.TREE_CLASS.Package) {
                data["leaf"] = false;
            } else if (data[CLASS] == configs.TREE_CLASS.Model) {
                data["leaf"] = true;
            }
            data["isLoad"] = false;
            root.replaceChild(data, findNode);
            main.Tree.updatePackageWinHide();
        },
        updatePackageWinHide: function() {
            var form = Ext.getCmp(configs.FORM_NAME.UPDATE_PACKAGE_FORM);
            form.getForm().reset();
            Ext.getCmp(configs.WIN_NAME.UPDATE_PACKAGE_WIN).hide();
        },
        deletePackage: function() {
            var node = main.view.initValue.right_click_node;
            main.model.Tree.deletePackage(node);
        },
        deletePackageReturn: function(data) {
            var node = main.view.initValue.right_click_node;
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            var path = findNode.getPath();
            var tree = path.split("/");
            var root = main.view.structure.store.getNodeById(tree[tree.length - 2]);
            root.removeChild(findNode);
        },
        addModel: function(data, nodeId) {
            var findNode = main.view.structure.store.getNodeById(nodeId);
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            data["text"] = data[NAME] || data[LABEL];
            data["leaf"] = true;
            findNode.appendChild(data);
        },
        removeModel: function(params) {
            main.model.Tree.Model.removeModel(params);
        },
        removeModelReturn: function(data, node) {
            var root = main.Tree.getParentNode(node);
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            root.removeChild(findNode);
        },
        getParentNode: function(node) {
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            var path = findNode.getPath();
            var tree = path.split("/");
            var root = main.view.structure.store.getNodeById(tree[tree.length - 2]);
            return root;
        },
        updateModel: function(data, nodeId) {
            var findNode = main.view.structure.store.getNodeById(nodeId);
            var path = findNode.getPath();
            var tree = path.split("/");
            var root = main.view.structure.store.getNodeById(tree[tree.length - 2]);
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            data["text"] = data[NAME] || data[LABEL];
            data["leaf"] = true;
            root.replaceChild(data, findNode);
        },

        //  ----------域---------------
        editFieldWinShow: function(e) {
            main.Tree.right_node = main.view.initValue.right_click_node;
            var that = main.Tree;
            if (!that.getEditFieldWin()) {
                main.view.Tree.createEditFieldWin();
            }
            var form = that.getEditFieldForm().getForm().reset();
            var win = that.getEditFieldWin().show();
            var nodeData = main.view.initValue.right_click_node;
            if (e.type === "UPDATE_FIELD") {
                var data = nodeData;
                console.log(nodeData);
                main.model.Tree.getFieldForm(data);
            }
        },
        editFieldWinHide: function() {
            var that = main.Tree;
            that.getEditFieldWin() && that.getEditFieldWin().hide();
        },
        setEditFieldForm: function(data) {
            var that = main.Tree;
            var form = that.getEditFieldForm();
            form.getForm().setValues(data);
        },
        getEditFieldForm: function() {
            var form_id = configs.FORM_NAME.EDIT_FIELD_FORM;
            return Ext.getCmp(form_id);
        },
        getEditFieldWin: function() {
            var win_id = configs.WIN_NAME.EDIT_FIELD_WIN;
            return Ext.getCmp(win_id);
        },
        editField: function() {
            var that = main.Tree;
            var form = that.getEditFieldForm().getForm();
            var data = form.getValues();

            if (data["RDN"]) {
                main.model.Tree.updateField(data);
            } else {
                data["_ID"] = undefined;
                main.model.Tree.addField(data);
            }
        },
        updateFieldReturn: function(data) {
            var node = main.Tree.right_node;
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            var root = main.view.structure.store.getRoot();
            data["text"] = data[NAME] || data[LABEL];
            data["leaf"] = false;
            data["isLoad"] = false;
            data["iconCls"] = "a_domain";
            root.replaceChild(data, findNode);
            main.Tree.editFieldWinHide();
        },
        addFieldReturn: function(data) {
            var NAME = configs.PACKAGE_TREE._NAME;
            var LABEL = configs.PACKAGE_TREE._LABEL;
            var root = main.view.structure.store.getRoot();
            data["text"] = data[LABEL] || data[NAME];
            data["leaf"] = false;
            data["isLoad"] = false;
            data["iconCls"] = "a_domain";
            root.appendChild(data);
            main.Tree.editFieldWinHide();
        },
        removerFieldWinShow: function() {
            main.Tree.right_node = main.view.initValue.right_click_node;
            main.view.Tree.createDeleteFieldWin();
        },
        removerField: function() {
            var data = main.Tree.right_node;
            main.model.Tree.removerField(data);
        },
        removerFieldReturn: function() {
            var node = main.Tree.right_node;
            var findNode = main.view.structure.store.getNodeById(node["id"]);
            var root = main.view.structure.store.getRoot();
            root.removeChild(findNode);
        },
        // 建模的逻辑 ------------------------------------------------------------
        Model: {
            index: 0,
            // 添加模型 - 编辑器属性
            addModel: function() {
                var node = main.view.initValue.right_click_node;
                var $this = main.Tree.Model;
                var edi = {
                    id: "MODEL" + $this.index,
                    CLASS: configs.TREE_CLASS.ADD_MODEL,
                    data: node,
                    _NAME: node[configs.PACKAGE_TREE._NAME],
                };
                $this.index++;
                main.Editor.openEditor(edi);
            },
            // 更新模型- 编辑器属性
            updateModel: function(node) {
                var $this = main.Tree.Model;
                if ($this.hasUpdateModel(node)) {
                    return;
                };
                var parentNode = main.Tree.getParentNode(node);
                var node = node || main.view.initValue.right_click_node;

                var edi = {
                    id: "MODEL" + $this.index,
                    CLASS: configs.TREE_CLASS.UPDATE_MODEL,
                    data: parentNode.data,
                    node: node,
                    _NAME: node[configs.PACKAGE_TREE._NAME],
                };
                $this.index++;
                main.Editor.openEditor(edi);
            },
            // 创建一个模型编辑器， 如果是更新模型，则获取数据
            createAddModelPanel: function(edi) {
                main.view.Tree.Model.createAddModelPanel(edi);
                if (edi["CLASS"] === configs.TREE_CLASS.UPDATE_MODEL) {
                    main.Tree.Model.getModel(edi.node);
                }
            },

            setListAttrType: function(data) {
                if (!Ext.StoreMgr.get(configs.STORE_NAME.ATTR_TYPE_STORE)) {
                    main.view.Tree.Model.createAttrTypeStore();
                }
                var store = Ext.StoreMgr.get(configs.STORE_NAME.ATTR_TYPE_STORE);
                for (var i = 0, l = data.length; i < l; i++) {
                    if (data[i]["EXTENSION"]) {
                        data[i]["VALUE"] = 100;
                    }
                }
                store.loadData(data);
            },
            addModelAttr: function(e) {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var grid = Ext.getCmp(tab.node["id"] + "AttrGrid");
                var store = grid.getStore();
                var length = store.getCount();
                if (!$this.editIsNull(grid)) {
                    return;
                }
                var record = {
                    _NAME: "",
                    _LABEL: "",
                    _TYPE: 1,
                    _DEFAULT_VALUE: "",
                    _MIN_VALUE: "",
                    _MAX_VALUE: "",
                    _EXTENSION: "",
                    _NULLABLE: false,
                };
                // grid.stopEditing();

                store.insert(length, record);
                grid.getPlugin().startEdit(length, 0);
                // grid.plugins.startEdit(0, 0);
            },

            deleteModelAttr: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var grid = Ext.getCmp(tab.node["id"] + "AttrGrid");
                var store = grid.getStore();
                var selectClu = grid.getSelection();
                var index = store.findBy(function(record) {
                    if (record == selectClu[0]) {
                        return true;
                    }
                });
                if (selectClu.length == 1) {
                    store.remove(selectClu);
                    if (index > 0) {
                        grid.getPlugin().startEdit(index - 1, 0);
                        grid.getSelectionModel().select(index - 1);
                    } else {
                        grid.getPlugin().startEdit(index + 1, 0);
                        grid.getSelectionModel().select(index + 1);
                    }

                }
            },
            // 上移 建模属性
            upModelAttr: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var grid = Ext.getCmp(tab.node["id"] + "AttrGrid");
                var store = grid.getStore();
                var selectClu = grid.getSelection();
                if (!selectClu.length == 1) {
                    return;
                }
                var index = store.findBy(function(record) {
                    if (record == selectClu[0]) {
                        return true;
                    }
                });
                if (index > 0) {
                    store.remove(selectClu[0]);
                    store.insert(index - 1, selectClu[0]);
                }
                grid.getSelectionModel().select(selectClu[0]);
            },
            // 下移 建模属性
            downModelAttr: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var grid = Ext.getCmp(tab.node["id"] + "AttrGrid");
                var store = grid.getStore();
                var selectClu = grid.getSelection();
                var length = store.getCount();
                if (!selectClu.length == 1) {
                    return;
                }
                var index = store.findBy(function(record) {
                    if (record == selectClu[0]) {
                        return true;
                    }
                });
                if (index != length - 1) {
                    store.remove(selectClu[0]);
                    store.insert(index + 1, selectClu[0]);
                }
                grid.getSelectionModel().select(selectClu[0]);
            },
            editIsNull: function(grid) {
                var store = grid.getStore();
                var isNull = true;
                store.each(function(record) {
                    if (record.get("_NAME") === "") {
                        main.view.toast(configs.ATTR_LIST_TEXT._NAME + configs.NO_NULL);
                        grid.getSelectionModel().select(record);
                        grid.getPlugin().startEdit(record, 0);
                        isNull = false;
                    }
                    if (record.get("_TYPE") === "") {
                        main.view.toast(configs.ATTR_LIST_TEXT._TYPE + configs.NO_NULL);
                        grid.getSelectionModel().select(record);
                        grid.getPlugin().startEdit(record, 2);
                        isNull = false;
                    }
                });
                return isNull;
            },
            hasUpdateModel: function(node) {
                var mainTab = main.view.structure.main_tab;
                var openTab;
                var tabs = mainTab.items.items;
                for (var i = 0, l = tabs.length; i < l; i++) {
                    if (tabs[i]["node"]["node"] == node && tabs[i]["node"]["CLASS"] == configs.TREE_CLASS.UPDATE_MODEL) {
                        openTab = mainTab.getComponent(tabs[i]["id"]);
                        mainTab.setActiveTab(openTab);
                        return true;
                    }
                }
                return false;
            },
            getTab: function() {
                var mainTab = main.view.structure.main_tab;
                var tab = mainTab.getActiveTab();
                return tab;
            },
            // 更新建模提交
            updateModelSub: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var TypeForm = Ext.getCmp(id + "TypeForm");
                var AttrGrid = Ext.getCmp(id + "AttrGrid");
                var descForm = Ext.getCmp(id + "DescForm");
                var TypeFormValue = TypeForm.getValues();
                var descForm = descForm.getValues();
                var attrData = AttrGrid.getStore();
                var _ATTRS_SEQ = [];
                var ATTR_LIST = [];
                var modelId;

                if (!$this.editIsNull(AttrGrid)) {
                    return;
                }

                attrData.each(function(record) {
                    _ATTRS_SEQ.push(record.get("_NAME"));
                    if (record.get("_TYPE") === 100) {
                        var data = record.data;
                        data["_TYPE"] = 0;
                        data["_EXTENSION"] = "JOB";
                        ATTR_LIST.push(data);
                    } else {
                        ATTR_LIST.push(record.data);
                    }
                });

                var paramMap = {
                    MODEL: {
                        _NAME: TypeFormValue._NAME,
                        _LABEL: TypeFormValue._LABEL,
                        _DESC: descForm._DESC,
                        _ATTRS_SEQ: _ATTRS_SEQ
                    },
                    ATTR_LIST: ATTR_LIST
                }
                if (tab.node.CLASS === configs.TREE_CLASS.UPDATE_MODEL) {
                    paramMap.MODEL._PDN = tab.node.node._PDN;
                    paramMap.MODEL._ID = tab.node.node._ID;
                    main.model.Tree.Model.updateModel(paramMap);
                } else {
                    paramMap.MODEL._PDN = tab.node.data.RDN;
                    main.model.Tree.Model.addModel(paramMap);
                }
            },
            // 添加或更新
            addModelReturn: function(data) {
                main.view.toast("保存成功");
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                tab.node["CLASS"] = configs.TREE_CLASS.UPDATE_MODEL;
                tab.node["node"] = data["MODEL"];
                tab.setTitle(data["MODEL"]["_NAME"]);
                $this.setModel(data);
                main.Tree.addModel(data["MODEL"], tab.node.data.id);
            },
            updateModelReturn: function(data) {
                main.view.toast("保存成功");
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                tab.node["node"] = data["MODEL"];
                $this.setModel(data);

                // main.Tree.updateModel(data["MODEL"], tab.node.node.id);
            },


            getModel: function(params) {
                main.model.Tree.Model.getModel(params);
            },
            setModel: function(data) {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var TypeForm = Ext.getCmp(id + "TypeForm");
                var AttrGrid = Ext.getCmp(id + "AttrGrid");
                var descForm = Ext.getCmp(id + "DescForm");
                var attrData = AttrGrid.getStore();

                var name = TypeForm.getComponent(0);
                var label = TypeForm.getComponent(1);
                var path = TypeForm.getComponent(2);
                var desc = descForm.getComponent(0);
                var MODEL = configs.MODEL;

                desc.setValue(data["MODEL"][MODEL._DESC]);
                name.setValue(data["MODEL"][MODEL._NAME]);
                label.setValue(data["MODEL"][MODEL._LABEL]);
                path.setValue(data["MODEL"][MODEL.FULL_CLASS]);

                var storeData = [];
                var ATTR_LIST_obj = {};
                var _ATTRS_SEQ = data["MODEL"]["_ATTRS_SEQ"];
                for (var i = 0, l = data["ATTR_LIST"].length; i < l; i++) {
                    ATTR_LIST_obj[data["ATTR_LIST"][i]["_NAME"]] = data["ATTR_LIST"][i];
                }
                for (var j = 0, s_l = _ATTRS_SEQ.length; j < s_l; j++) {
                    var ATTR_LIST_obj_name = _ATTRS_SEQ[j];
                    if (ATTR_LIST_obj[ATTR_LIST_obj_name]["_EXTENSION"]) {
                        ATTR_LIST_obj[ATTR_LIST_obj_name]["_TYPE"] = 100;
                    }
                    storeData.push(ATTR_LIST_obj[ATTR_LIST_obj_name]);
                }
                attrData.loadData(storeData);
                $this.setModelDataStore(storeData);
            },
            setModelDataStore: function(storeData) {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var dataGrid = Ext.getCmp(id + "dataGrid");
                var fields = [];
                // fields.push("_UUID");
                fields.push({
                    text: "_UUID",
                    dataIndex: "_UUID"
                });
                // fields.push("_ENV");
                fields.push({
                    text: "_ENV",
                    dataIndex: "_ENV"
                });
                for (var i = 0, l = storeData.length; i < l; i++) {
                    var _TYPE = storeData[i]["_TYPE"]
                    if (_TYPE !== 100 && _TYPE !== 8) {
                        fields.push({
                            text: storeData[i]["_LABEL"] || storeData[i]["_NAME"],
                            dataIndex: storeData[i]["_NAME"]
                        });
                    }
                }
                var store = Ext.create("Ext.data.Store", {
                    id: id + "dataStore",
                    field: fields
                });
                var column = $this.getModelDataGridColumn(fields);
                dataGrid.reconfigure(store, column);
                $this.getModelDataList();
            },
            getModelDataGridColumn: function(fields) {
                var column = [];
                for (var i = 0, l = fields.length; i < l; i++) {
                    column.push({
                        text: fields[i]["text"],
                        dataIndex: fields[i]["dataIndex"]
                    });
                }
                return column;
            },
            refreshModel: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                $this.getModel(tab.node.node);
            },
            getModelDataList: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var RDN = tab.node.node.RDN;
                var pageBar = main.view.Tree.Model.modelDataPageBars[id + "dataGridPageBar"];
                var start = pageBar.getStart();
                var count = pageBar.getPageCount();
                var searchText = $this.getSearchModeDataText();
                var params = {
                    RDN: RDN,
                    START: start,
                    COUNT: count
                };
                if (searchText) {
                    params["FILTER"] = JSON.stringify({
                        CONTENT: searchText
                    });
                }
                main.model.Tree.Model.getlistMetaData(params);
            },
            searchModeData: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var pageBar = main.view.Tree.Model.modelDataPageBars[id + "dataGridPageBar"];
                pageBar.setCurrPage(1);
                $this.getModelDataList();
            },
            setModelDataList: function(data) {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var store = Ext.StoreMgr.get(id + "dataStore");
                var pageBar = main.view.Tree.Model.modelDataPageBars[id + "dataGridPageBar"];
                store.loadData(data["DATA_LIST"]);
                pageBar.setTotalCount(data["TOTAL_COUNT"]);
            },

            // model data
            addModeData: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var node = tab.node.node;
                console.log(node);
                var edi = {
                    id: "ModelData" + $this.index,
                    CLASS: configs.TREE_CLASS.ADD_MODEL_DATA,
                    data: tab.node,
                    _NAME: node[configs.MODEL._NAME] + "数据配置",
                };
                $this.index++;
                main.Editor.openEditor(edi);
            },
            getTabByModelDataToTypeForm: function(edi) {
                console.log(edi);
                main.model.Tree.Model.getModelToAddModelForm(edi.data.node, edi);
            },
            // 建模数据 - 缓存
            orderData: {},

            setModelToAddModelForm: function(data, edi) {
                var that = main.Tree.Model;
                var list_obj = {};
                var _ATTRS_SEQ = data.MODEL._ATTRS_SEQ;
                var ATTR_LIST = data.ATTR_LIST;
                var orderData = [];
                for (var i = 0, l = ATTR_LIST.length; i < l; i++) {
                    var name = ATTR_LIST[i]["_NAME"];
                    list_obj[name] = ATTR_LIST[i];
                }
                for (var j = 0, l_a = _ATTRS_SEQ.length; j < l_a; j++) {
                    var name = _ATTRS_SEQ[j];
                    orderData.push(list_obj[name]);
                }
                main.view.Tree.Model.setTabByModelDataToTypeBaseForm(edi);
                main.view.Tree.Model.setTabByModelDataToTypeForm(orderData, edi);
            },
            getModelDataGridSelect: function(gridId) {
                var grid = Ext.getCmp(gridId);
                var selects = grid.getSelectionModel().getSelection();
                return selects;
            },
            updateModelData: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var selects = $this.getModelDataGridSelect(tab.node.id + "dataGrid");
                if (selects.length != 1) {
                    return;
                }
                var node = tab.node.node;
                if ($this.hasUpdateModelData(selects[0].data)) {
                    return;
                };
                var edi = {
                    id: "ModelData" + $this.index,
                    CLASS: configs.TREE_CLASS.UPDATE_MODEL_DATA,
                    data: tab.node,
                    node: selects[0].data,
                    _NAME: node[configs.MODEL._NAME] + "数据配置",
                };
                $this.index++;
                main.Editor.openEditor(edi);
            },
            hasUpdateModelData: function(node) {
                var mainTab = main.view.structure.main_tab;
                var openTab;
                var tabs = mainTab.items.items;
                for (var i = 0, l = tabs.length; i < l; i++) {
                    if (tabs[i]["node"]["node"] == node && tabs[i]["node"]["CLASS"] == configs.TREE_CLASS.UPDATE_MODEL_DATA) {
                        openTab = mainTab.getComponent(tabs[i]["id"]);
                        mainTab.setActiveTab(openTab);
                        return true;
                    }
                }
                return false;
            },
            deleteModeData: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var selects = $this.getModelDataGridSelect(tab.node.id + "dataGrid");
                var RDNS = [];
                if (selects.length > 0) {
                    for (var i = 0, l = selects.length; i < l; i++) {
                        var RDN = selects[i]["data"]["RDN"];
                        RDNS.push(RDN);
                    }
                    main.view.Tree.Model.deleteModeData(RDNS);
                }
            },
            closeEditorToModelData: function(RDN) {
                var mainTab = main.view.structure.main_tab;
                var tabs = mainTab.items.items;
                for (var i = 0, l = tabs.length; i < l; i++) {
                    if (tabs[i]["node"]["node"]["RDN"] == RDN && tabs[i]["node"]["CLASS"] == configs.TREE_CLASS.UPDATE_MODEL_DATA) {
                        openTab = mainTab.getComponent(tabs[i]["id"]);
                        mainTab.remove(openTab);
                    }
                }
            },
            // 删除建模数据
            removeModelDataSub: function(RDNS) {
                var $this = main.Tree.Model;
                for (var i = 0, l = RDNS.length; i < l; i++) {
                    $this.closeEditorToModelData(RDNS[i]);
                }
                var params = {
                    IDS: RDNS.join(",")
                };
                main.model.Tree.Model.removeModelData(params);
            },
            removeModelDataReturn: function(data) {
                main.Tree.Model.getModelDataList();
            },
            //  删除建模数据 end 
            //  刷新建模-数据
            refreshModeData: function() {
                main.Tree.Model.getModelDataList();
            },

            modelDataPageChange: function() {
                main.Tree.Model.getModelDataList();
            },
            getSearchModeDataText: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var id = tab.node.id;
                var searchText = Ext.getCmp(id + "dataGridSearch").getValue();
                return searchText;
            },
            createAddModelDataPanel: function(edi) {
                main.view.Tree.Model.createAddModelDataPanel(edi);
                if (edi["CLASS"] === configs.TREE_CLASS.UPDATE_MODEL_DATA) {
                    main.Tree.Model.getModelData(edi.node);
                }
            },
            setModelDataToEnv: function(data) {
                var store = Ext.StoreMgr.get(configs.STORE_NAME.ModelDataToEnv);
                store.loadData(data);
            },
            // 保存 建模-数据
            updateModelDataSub: function() {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var parentNode = tab.node.data;
                var RDN = parentNode.node["RDN"];
                var parentNodeId = parentNode["id"];
                var node = tab.node;
                var CLASS = tab.node.CLASS;
                var nodeId = tab.node.id;
                var dataRDN = node.data.node["RDN"];
                var DataTypeVlaues = $this.getDataTypeFormValue(nodeId + "ModelDataTypeForm");
                var form = Ext.getCmp(nodeId + "ModelDataTypeForm").getForm();
                var JobValues = $this.getJobTabValue(nodeId + "DataJob");
                for (i in JobValues) {
                    DataTypeVlaues[i] = JobValues[i];
                }
                var deleteFilefields = $this.deleteFilefields
                if (deleteFilefields[dataRDN]) {
                    form.setValues({
                        REMOVE_ATTACHMENTS: deleteFilefields[dataRDN].join(",")
                    });
                    DataTypeVlaues["REMOVE_ATTACHMENTS"] = deleteFilefields[dataRDN].join(",");
                }

                DataTypeVlaues["MODEL_RDN"] = RDN;
                var url, callback;
                if (CLASS === configs.TREE_CLASS.ADD_MODEL_DATA) {
                    url = configs.url.view_addMetaData;
                    callback = $this.addModelDataReturn;
                } else {
                    url = configs.url.view_updateMetaData;
                    callback = $this.updateModelDataReturn;
                    DataTypeVlaues["_ID"] = node.node["_ID"];
                }
                if (form.isValid()) {
                    form.setValues({
                        FUNC: url,
                        FUNC_PARAMS: JSON.stringify(DataTypeVlaues)
                    });
                    form.submit({
                        url: "../../dataProcess",
                        success: function(form, action) {
                            var result = action.result;
                            var data = result.CONTENT;
                            var STATE = result.STATE;
                            var ERR_MSG = result.ERR_MSG;
                            if (STATE != 1) {
                                main.view.toast(ERR_MSG);
                            } else {
                                callback(data)
                            }
                        },
                        failure: function(form, action) {
                            console.log(action);
                            var result = action.result;
                            var data = result.CONTENT;
                            var STATE = result.STATE;
                            var ERR_MSG = result.ERR_MSG;
                            if (STATE != 1) {
                                main.view.toast(ERR_MSG);
                            } else {
                                deleteFilefields[dataRDN] = [];
                                callback(data);
                            }
                        }
                    });
                }
            },

            addModelDataReturn: function(data) {
                main.view.toast("保存成功");
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                tab.node["CLASS"] = configs.TREE_CLASS.UPDATE_MODEL_DATA;
                tab.node["node"] = data;
                $this.setModelData(data);
                var parentNodeId = tab.node["data"]["id"];
                $this.updateModelDataGrid(parentNodeId, data);
            },
            updateModelDataReturn: function(data) {
                main.view.toast("保存成功");
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                tab.node["CLASS"] = configs.TREE_CLASS.UPDATE_MODEL_DATA;
                tab.node["node"] = data;
                $this.setModelData(data);
                var parentNodeId = tab.node["data"]["id"];
                $this.updateModelDataGrid(parentNodeId, data);
            },
            updateModelDataGrid: function(id, data) {
                var grid = Ext.getCmp(id + "dataGrid");
                if (grid) {
                    var store = grid.getStore();
                    var index = store.find("_ID", data["_ID"]);
                    if (index === -1) {
                        store.add(data);
                    } else {
                        var rec = store.getAt(index);
                        rec.set(data);
                    }
                }
            },
            getModelData: function(params) {
                main.model.Tree.Model.getModelData(params);
            },
            setModelData: function(data) {
                var $this = main.Tree.Model;
                var tab = $this.getTab();
                var nodeId = tab.node.id;
                $this.setDataTypeFormValue(nodeId + "ModelDataTypeForm", data);
                $this.setJobTabValue(nodeId + "DataJob", data);
            },
            setDataTypeFormValue: function(id, data) {
                var DataTypeForm = Ext.getCmp(id);
                var texts = DataTypeForm.items.items;
                DataTypeForm.getForm().reset();
                for (var i = 0, l = texts.length; i < l; i++) {
                    if (texts[i].getName) {
                        var name = texts[i].getName();
                        texts[i].setValue(data[name]);
                    } else {
                        console.log(texts[i]);
                        var file = texts[i];
                        var filefield = file.obj;
                        filefield.setFileData(data);
                    }
                }
            },
            // 删除附件
            deleteFilefields: {},
            deleteFilefield: function(RDN) {
                var tab = this.getTab();
                var mainRDN = tab.node.node.RDN;
                if (!this.deleteFilefields[mainRDN]) {
                    this.deleteFilefields[mainRDN] = [];
                };
                for (var i = 0, l = this.deleteFilefields[mainRDN].length; i < l; i++) {
                    if (this.deleteFilefields[mainRDN][i] == RDN) {
                        return;
                    }
                }
                this.deleteFilefields[mainRDN].push(RDN);
            },
            cancelDeleteFilefield: function(RDN) {
                var tab = this.getTab();
                var mainRDN = tab.node.node.RDN;
                if (!this.deleteFilefields[mainRDN]) {
                    return;
                };
                for (var i = 0, l = this.deleteFilefields[mainRDN].length; i < l; i++) {
                    if (this.deleteFilefields[mainRDN][i] == RDN) {
                        Ext.Array.remove(this.deleteFilefields[mainRDN], RDN);
                    }
                }
            },
            addSchduleToJobClick: function(e) {
                // uuId = [] 作业字段？ 调度？ 初始时间？ 
                var grid = this.up("grid");
                var selects = grid.getSelectionModel().getSelection();
                var list = [];
                var len = selects.length;
                if (len == 0) {
                    return;
                }

                for (var i = 0, l = len; i < l; i++) {
                    var data = selects[i].data;
                    if (data.RDN) {
                        list.push(data.RDN);
                    }
                }
                if (!Ext.getCmp("addSchduleToJob")) {
                    main.view.Tree.Model.addSchduleToJobWin(list.join(","));
                }

                main.Tree.Model.getScheduleList();
            },
            getActiveTab: function() {
                var mainTab = Ext.getCmp("main_tab");
                var activeTab = mainTab.getActiveTab();
                return activeTab;
            },
            getJob: function() {
                var tab = this.getActiveTab();
                var params = tab.node.node;
                // model_RDN = tab node node RDN
                main.model.Tree.Model.getJob(params);
            },
            setJob: function(data) {
                var data = data || {
                    ATTR_LIST: [],
                    MODEL: []
                };
                var ATTR_LIST = data["ATTR_LIST"];
                // ATTR_LIST :  CLASS,RDN,_DEFAULT_VALUE,_DESC,
                // _EXTENSION,_ID,_LABEL,_MAX_VALUE,_MIN_VALUE,_NAME
                // _NULLABLE, _PDN,_TYPE
                var jobList = [];
                for (var i = 0, l = ATTR_LIST.length; i < l; i++) {
                    var attr = ATTR_LIST[i];
                    if (attr["_TYPE"] == 0 && attr["_EXTENSION"] == "JOB") {
                        if (attr["_LABEL"]) {
                            jobList.push({
                                NAME: attr["_LABEL"] + "(" + attr["_NAME"] + ")",
                                VALUE: attr["RDN"],
                            });
                        } else {
                            jobList.push({
                                NAME: attr["_NAME"],
                                VALUE: attr["RDN"],
                            });
                        }

                    }
                }

                var combobox = Ext.getCmp("addSchduleToJob_JOB");
                var store = combobox.getStore();
                store.loadData(jobList);
                if (jobList.length > 0) {
                    combobox.setValue(jobList[0]["VALUE"]);
                }
            },
            getScheduleList: function() {
                var tab =  main.Tree.Model.getActiveTab();
                var params  = {
                    RDN: tab.node.data._PDN
                }
                main.model.Tree.Model.getScheduleList(params);
            },
            setScheduleList: function(data) {
                // schedule : CLASS, RDN, _ID, _NAME, _PDN,_STATUS,_TIME_CONFIG
                var data = data || [];
                var list = [];
                for (var i = 0, l = data.length; i < l; i++) {
                    list.push({
                        NAME: data[i]["_NAME"],
                        VALUE: data[i]["RDN"]
                    });
                }
                var combobox = Ext.getCmp("addSchduleToJob_SCH");
                var store = combobox.getStore();
                store.loadData(list);
                if (list.length > 0) {
                    combobox.setValue(list[0]["VALUE"]);
                }
            },
            // 获取有效的调度时间
            getSCH_TIME_USER: function() {
                var schedule = Ext.getCmp("addSchduleToJob_SCH").getValue();
                var SCH_TIME = Ext.getCmp("addSchduleToJob_SCH_TIME").getRawValue();
                var params = {
                    _SCH_TIME: SCH_TIME,
                    RDN: schedule
                };
                main.model.Tree.Model.getSCH_TIME_USER(params);
            },
            setSCH_TIME_USER: function(data) {
                var data = data || [];
                var list = [];
                for (var i = 0, l = data.length; i < l; i++) {
                    list.push({
                        NAME: data[i],
                        VALUE: data[i]
                    });
                }
                var combobox = Ext.getCmp("addSchduleToJob_SCH_TIME_USER");
                var store = combobox.getStore();
                store.loadData(list);
                if (list.length > 0) {
                    combobox.setValue(list[0]["VALUE"]);
                }
            },
            addSchduleToJobSub: function() {
                var selectList = Ext.getCmp("addSchduleToJob_RDN").getValue();
                var SCH_TIME = Ext.getCmp("addSchduleToJob_SCH_TIME_USER").getValue();
                var job = Ext.getCmp("addSchduleToJob_JOB").getValue();
                var schedule = Ext.getCmp("addSchduleToJob_SCH").getValue();
                var params = {
                    RDN: schedule,
                    RDNS: selectList,
                    _JOB_ATTR: job,
                    _SCH_TIME: SCH_TIME
                };
                main.model.Tree.Model.addSchduleToJob(params);
            },
            addSchduleToJobReturn: function(data) {
                main.view.toast("设置成功");
                main.Tree.Model.closeAddSchduleToJobWin();
            },
            closeAddSchduleToJobWin: function() {
                if (Ext.getCmp("addSchduleToJob")) {
                    Ext.getCmp("addSchduleToJob").destroy();
                }
            },
            //  setModelJob------------------------------------------------
            setJobTabValue: function(id, data) {
                var JobTab = Ext.getCmp(id);
                var tabs = JobTab.items.items;
                var values = {};
                for (var i = 0, l = tabs.length; i < l; i++) {
                    var panel = tabs[i];
                    var name = panel.getComponent(0).getName();
                    if (data[name]) {
                        tabs[i].getComponent(0).setValue(data[name]);
                    }
                }
            },
            getDataTypeFormValue: function(id) {
                var DataTypeForm = Ext.getCmp(id);
                var texts = DataTypeForm.items.items;
                var values = {};
                for (var i = 0, l = texts.length; i < l; i++) {
                    if (texts[i].getName) {
                        var name = texts[i].getName();
                        var value = texts[i].getValue();
                        var type = texts[i]["dataType"];
                        if (type && type === 1) {
                            value = parseInt(value);
                        }
                        values[name] = value;
                    }

                }
                return values;
            },
            getJobTabValue: function(id) {
                var JobTab = Ext.getCmp(id);
                var tabs = JobTab.items.items;
                var values = {};
                for (var i = 0, l = tabs.length; i < l; i++) {
                    var panel = tabs[i];
                    var name = panel.getComponent(0).getName();
                    var value = panel.getComponent(0).getValue();
                    values[name] = value;
                }
                return values;
            },
            //  调试 作业
            debugToJob: function(time, SLAVE_RDN, JOB_VALUE, panelId) {
                //  MODEL_RDN： 模型的RDN
                // _SCH_TIME：调度时间字符串
                // _CONTAINER: 运行容器的RDN
                // CONTENT：作业的内容
                // DATA_MAP：当前数据的属性名值对，类型为字典
                var tab = this.getTab();
                var node = tab.node.node;
                var MODEL_RDN = node["MODEL_RDN"];
                var nodeId = tab.node.id;
                var form = Ext.getCmp(nodeId + "ModelDataTypeForm").getForm();
                var DATA_MAP = form.getValues();

                var params = {
                    MODEL_RDN: MODEL_RDN,
                    _SCH_TIME: time,
                    _CONTAINER: SLAVE_RDN,
                    CONTENT: JOB_VALUE,
                    DATA_MAP: DATA_MAP
                };
                main.model.Tree.Model.debugToJob(params, panelId);
            },
            debugToJobReturn: function(data, panelId) {
                // 禁用调试按钮 启用停止按钮
                var debug = Ext.getCmp(panelId + "debug");
                var stopDebug = Ext.getCmp(panelId + "stopDebug");
                debug.disable();
                stopDebug.enable();


                var tabId = panelId + "debugTab";
                main.debugTab.Debug.initDebugTab(paramsMap.tabId);
                if (Ext.getCmp(tabId)) {
                    Ext.getCmp(tabId).show();
                } else {
                    var tab = main.view.debugTab.consoleTab.createDebugingConsoleTab(tabId, data.KEY);
                    Ext.getCmp("debug_tab").add(tab).show();
                }
                if (data.KEY) {
                    var params = {
                        KEY: data.KEY
                    }
                    main.model.Debug.getTrace(params, {
                        tabId: tabId,
                        debugId: panelId,
                        params: params,
                        KEY: data.KEY
                    });
                } else {
                    main.view.toast("KEY is null");
                }
            },
        },
        // 建模的逻辑结束---------------------------------------------------------
        // 

    },
    // 树的逻辑结束----------------------



    //  环境逻辑-------------------------
    Env: {
        refreshGrid: function(e) {
            var store = this.up("grid").getStore();
            var mainTab = main.view.structure.main_tab;
            var activeTab = mainTab.getActiveTab();
            store.clearFilter();
            main.model.Env.refreshEnvList(activeTab.node["RDN"], store);
        },
        refreshEnvListReture: function(data, store) {
            store.loadData(data);
        },
        setEnvListRenderer: function(value, metaData, record, e, e2) {
            if (e2 == 0) {
                var typeList = main.model.Dimension.type;
                for (var j = 0, tl = typeList.length; j < tl; j++) {
                    if (typeList[j]["VALUE"] == value) {
                        value = typeList[j]["NAME"];
                    }
                }
                return value;
            } else if (e2 == 3) {
                if (record.get("_TYPE") === 2 || record.get("_TYPE") === 5) {
                    value = "...";
                }
                return value;
            }
        },
        createUpdateEnvEdi: function(e) {
            var mainTab = main.view.structure.main_tab;
            var parentEdi = mainTab.getActiveTab();
            if (!e["record"]) {
                return;
            }
            var column = e.record.data;
            var edi = {};
            edi["CLASS"] = configs.TREE_CLASS.ENV;
            edi["_ID"] = column["_ID"];
            edi["RDN"] = column["RDN"];
            edi["_PDN"] = parentEdi.node["_PDN"];
            edi["UP_RDN"] = parentEdi.node["RDN"];
            edi["_NAME"] = "修改" + column["_NAME"];
            edi["upIndex"] = parentEdi;
            edi["TYPE"] = "updateEnv";
            main.Editor.openEditor(edi);
        },
        createAddEnvEdi: function() {
            var mainTab = main.view.structure.main_tab;
            var parentEdi = mainTab.getActiveTab();
            var edi = {};
            edi["CLASS"] = parentEdi.node["CLASS"];
            edi["_ID"] = parentEdi.node["_ID"];
            edi["RDN"] = parentEdi.node["RDN"];
            edi["_PDN"] = parentEdi.node["_PDN"];
            edi["UP_RDN"] = parentEdi.node["RDN"];
            edi["_NAME"] = "新增" + parentEdi.node["_NAME"];
            edi["upIndex"] = parentEdi;
            edi["TYPE"] = "addEnv";
            main.Editor.openEditor(edi);

        },
        getAddEnvContent: function(RDN, edi) {
            var form;
            if (edi["TYPE"] == "addEnv") {
                form = main.view.Env.createForm("addEnv", RDN, edi);
            } else if (edi["TYPE"] == "updateEnv") {
                form = main.view.Env.createForm("updateEnv", edi["_ID"], edi);
                main.model.Env.getEnv(edi["RDN"], {
                    form: form,
                    type: "updateEnv",
                    RDN: edi["_ID"]
                });
            }
            main.Editor.setEditorContent(form);
        },
        setUpdateEnvContent: function(data, params) {
            var form = params.form;
            var EdiType = params.type;
            var RDN = params.RDN;
            var type = form.getComponent(0);
            var name = form.getComponent(1);
            var desc = form.getComponent(2);
            // var tab = form.getComponent(3);
            var testValue = Ext.getCmp(EdiType + "EnvValue" + RDN);
            var _RT_VALUE = Ext.getCmp(EdiType + "EnvRunTimeValue" + RDN);
            // var _RT_VALUE = form.getComponent(4);
            type.setValue(data["_TYPE"]);
            name.setValue(data["_NAME"]);
            desc.setValue(data["_DESC"]);
            testValue.setValue(data["_VALUE"]);
            _RT_VALUE.setValue(data["_RT_VALUE"]);
        },
        envTypeChange: function() {
            var that = main.Env;
            var type = this.getValue();
            var mainTab = Ext.getCmp("main_tab");
            var activeTab = mainTab.getActiveTab();
            if (activeTab.node && activeTab.node._ID) {
                var _ID = activeTab.node._ID;
                that.debugingBtnStatus(type, _ID);
            }

        },
        // 调试按钮的状态，当不是函数时隐藏
        debugingBtnStatus: function(TYPE, _ID) {
            var EnvValue = "EnvValue",
                EnvRunTimeValue = "EnvRunTimeValue",
                debug = "debug",
                stopDebug = "stopDebug",
                Slave = "Slave";
            var EnvValueBtn = Ext.getCmp(_ID + EnvValue + debug);
            var stopEnvValueBtn = Ext.getCmp(_ID + EnvValue + stopDebug);
            var EnvValueSlave = Ext.getCmp(EnvValue + _ID + Slave);
            var EnvRunTimeValueBtn = Ext.getCmp(_ID + EnvRunTimeValue + debug);
            var stopEnvRunTimeValueBtn = Ext.getCmp(_ID + EnvRunTimeValue + stopDebug);
            var EnvRunTimeValueSlave = Ext.getCmp(EnvRunTimeValue + _ID + Slave);
            if (TYPE == 2) {
                EnvValueBtn && EnvValueBtn.show();
                stopEnvValueBtn && stopEnvValueBtn.show();
                EnvRunTimeValueBtn && EnvRunTimeValueBtn.show();
                stopEnvRunTimeValueBtn && stopEnvRunTimeValueBtn.show();
                EnvValueSlave && EnvValueSlave.show();
                EnvRunTimeValueSlave && EnvRunTimeValueSlave.show();
            } else {
                EnvValueBtn && EnvValueBtn.hide();
                stopEnvValueBtn && stopEnvValueBtn.hide();
                EnvRunTimeValueBtn && EnvRunTimeValueBtn.hide();
                stopEnvRunTimeValueBtn && stopEnvRunTimeValueBtn.hide();
                EnvValueSlave && EnvValueSlave.hide();
                EnvRunTimeValueSlave && EnvRunTimeValueSlave.hide();
            }
        },
        updateEnv: function(formValue, edi) {
            var envType = formValue["envType"];
            var envName = formValue["envName"];
            var envDesc = formValue["envDesc"];
            var envRTValue = formValue["envRTValue"];
            var envValue = formValue["envValue"];
            if (envType === "") {
                main.view.toast("请选择类型");
                return;
            }
            if (envValue === "") {
                main.view.toast("值不能为空");
                return;
            }
            if (edi["TYPE"] == "addEnv") {
                main.model.Env.addEnv(edi["RDN"], envType, envName, envDesc, envValue, envRTValue);
            } else if (edi["TYPE"] == "updateEnv") {
                main.model.Env.updateEnv(edi["_ID"], envType, envName, envDesc, envValue, envRTValue);
            }
        },
        updateEnvReture: function(data) {
            var mainTab = main.view.structure.main_tab;
            var tab = mainTab.getActiveTab();
            var grid = Ext.getCmp("grid" + tab.node["UP_RDN"]);
            var store = grid.getStore();
            if (tab.node["TYPE"] == "addEnv") {
                store.add(data);
                if (tab.node["upIndex"]) {
                    // tab.close();
                    main.Editor.closeEditor(tab);
                    mainTab.setActiveTab(tab.node["upIndex"]);
                }
            } else if (tab.node["TYPE"] == "updateEnv") {
                store.clearFilter();
                var line = store.findBy(function(record) {
                    if (record.get("RDN") == data["RDN"]) {

                        var rowStore = store.getById(record.id);
                        rowStore.set(data);
                        return true;
                    }
                });
            }
            main.view.toast("保存成功！");

        },
        deleteAddEnvEdi: function(e) {
            var deleteLine = this.up("grid").getSelectionModel().getSelection()[0].data;
            Ext.Msg.show({
                title: "警告",
                modal: false,
                msg: "你确定要删除该行吗？",
                buttonText: {
                    yes: "确定",
                    no: "取消"
                },
                fn: function(btn) {

                    if (btn === "yes") {
                        main.model.Env.deleteEnv(deleteLine["RDN"], deleteLine);
                    }
                }
            });
        },
        deleteEnvReturn: function(data, deleteLine) {
            main.view.toast("删除成功");
            var mainTab = main.view.structure.main_tab;
            var tab = mainTab.getActiveTab();
            var grid = Ext.getCmp("grid" + tab.node["RDN"]);
            var store = grid.getStore();
            store.clearFilter();
            var line = store.findBy(function(record, id) {
                if (record.get("RDN") == deleteLine["RDN"]) {
                    return true;
                }
            });
            store.removeAt(line);
        },


        debuging: function(value, type, edi, debugId, slaveValue) {
            var params = {
                RDN: edi.UP_RDN,
                CONTENT: value
            };
            var tabId = "debuging" + edi.RDN + type;
            main.model.Env.debugingKEY(params, {
                tabId: tabId,
                debugId: debugId,
                _CONTAINER: slaveValue || null,
            });
        },
        // 调试返回
        debugingReturn: function(data, paramsMap) {
            var debug = Ext.getCmp(paramsMap.debugId + "debug");
            debug.disable();
            var stop = Ext.getCmp(paramsMap.debugId + "stopDebug");
            stop.enable();

            main.debugTab.Debug.initDebugTab(paramsMap.tabId);
            if (Ext.getCmp(paramsMap.tabId)) {
                Ext.getCmp(paramsMap.tabId).show();
            } else {
                var tab = main.view.debugTab.consoleTab.createDebugingConsoleTab(paramsMap.tabId, data.KEY);
                Ext.getCmp("debug_tab").add(tab).show();
            }
            if (data.KEY) {
                var params = {
                    KEY: data.KEY
                }

                main.model.Debug.getTrace(params, {
                    tabId: paramsMap.tabId,
                    debugId: paramsMap.debugId,
                    params: params,
                    KEY: data.KEY
                });
            } else {
                main.view.toast("KEY is null");
            }
        },


    },
    //  环境逻辑结束---------------------


    // 编辑器的逻辑----------------------
    Editor: {
        editors: [],
        editorsIndex: 0,
        openEditor: function(edi) {
            var index = this.findEditor(edi);
            if (typeof index === "undefined") {
                this.editors.push(edi);
                index = this.findEditor(edi);
                this.editorsIndex++;
                this.addEditor(edi, this.editorsIndex, index);
            }
            var mainTab = main.view.structure.main_tab;
            mainTab.setActiveTab(index);
        },
        addEditor: function(edi, editorsIndex, index) {
            var editor = main.view.Editor.createEditor(edi, editorsIndex, index);
            var mainTab = main.view.structure.main_tab;
            mainTab.add(editor);
            mainTab.setActiveTab(index);
            this.getEditorContent(edi);
        },
        getEditorContent: function(edi) {
            if (edi["CLASS"] === configs.TREE_CLASS.ENV) {
                if (edi["TYPE"]) {
                    if (edi["TYPE"] === "addEnv") {
                        main.Env.getAddEnvContent(edi["RDN"], edi);
                    } else if (edi["TYPE"] === "updateEnv") {
                        main.Env.getAddEnvContent(edi["RDN"], edi);
                    }
                } else {
                    main.model.Env.getEnvList(edi["RDN"], edi);
                }
            } else if (edi["CLASS"] === configs.TREE_CLASS.Schedule) {
                main.Editor.getScheduleContent();
            } else if (edi["CLASS"] === configs.TREE_CLASS.ADD_MODEL || edi["CLASS"] === configs.TREE_CLASS.UPDATE_MODEL) {
                main.Editor.getAddModelContent(edi);
            } else if (edi["CLASS"] === configs.TREE_CLASS.ADD_MODEL_DATA || edi["CLASS"] === configs.TREE_CLASS.UPDATE_MODEL_DATA) {
                main.Editor.getAddModelDataContent(edi);
            }
        },
        setEditorContent: function(content) {
            var mainTab = main.view.structure.main_tab;
            var activeTab = mainTab.getActiveTab();
            activeTab.add(content);
        },
        findEditor: function(edi) {
            for (var i = 0, l = this.editors.length; i < l; i++) {
                if (tools.isObjectEqual(edi, this.editors[i])) {
                    return i;
                }
            }
            return;
        },
        closeEditor: function(e) {
            var that = main.Editor;
            if (e.node) {
                if (e.node.CLASS && e.node.CLASS == configs.TREE_CLASS.ENV) {
                    if (e.node.TYPE == "updateEnv" || e.node.type == "addEnv") {
                        var RDN = e.node.RDN;
                        that.closeDebugTab(RDN);
                    }
                }
            }
            main.view.structure.main_tab.remove(e);
            Ext.Array.remove(main.Editor.editors, e.node);
            main.Schedule.interval = window.clearInterval(main.Schedule.interval);
            main.Tree.Model.closeAddSchduleToJobWin();
        },
        closeDebugTab: function(RDN) {
            if (Ext.getCmp("debuging" + RDN + "EnvValue")) {
                main.Env.stopDebug("EnvValue", {
                    RDN: RDN
                }, RDN + "EnvValue");
                Ext.getCmp("debuging" + RDN + "EnvValue").close();
            }
            if (Ext.getCmp("debuging" + RDN + "EnvRunTimeValue")) {
                main.Env.stopDebug("EnvRunTimeValue", {
                    RDN: RDN
                }, RDN + "EnvRunTimeValue");
                Ext.getCmp("debuging" + RDN + "EnvRunTimeValue").close();
            }
        },
        getScheduleContent: function() {
            main.Schedule.createSchedule();
        },
        getAddModelContent: function(edi) {
            main.Tree.Model.createAddModelPanel(edi);
        },
        getAddModelDataContent: function(edi) {
            main.Tree.Model.createAddModelDataPanel(edi);
        }
    },
    // 编辑器的逻辑结束----------------------

    //  调度------------------------------------------------------------------
    Schedule: {
        interval: null,
        openScheduleNode: null,
        init: function() {
            // main.view.Schedule["ScheduleStore"] = null;
            // main.view.Schedule["SchQueueStore"] = null;
            // main.view.Schedule["ScheduleTree"] = null;
            // main.view.Schedule["ScheduleContent"] = null;
            // main.view.Schedule["ScheduleNodeGrid"] = null;
            // main.view.Schedule["ScheduleNodeStore"] = null;
            // main.view.Schedule["ScheduleNodeTab"] = null;
            // main.view.Schedule["right_click_menu"] = null;
            // main.view.Schedule["right_click_node"] = null;
            // main.view.Schedule["addScheduleWin"] = null;
            // main.view.Schedule["addSchQueueWin"] = null;
            // main.view.Schedule["isAddSchQueue"] = null;
        },
        // 获取当前编辑器
        getActiveTab: function() {
            var main_tab = main.view.structure.main_tab;
            var tab = main_tab.getActiveTab();
            return tab;
        },
        createSchedule: function() {
            main.Schedule.init();
            // main.view.Schedule.createTreeToScheduleStore();
            main.view.Schedule.createTreeToSchedule();
            main.view.Schedule.initOncontextmenu();
            main.view.Schedule.createScheduleContent();
            main.view.Schedule.createRightClickMenu();
            main.Schedule.getScheduleList();
            // main.model.Schedule.getScheduleList();
            // main.Schedule.interval = setInterval(main.model.Schedule.getScheduleList, configs.setIntervalTime);
        },
        // 获取调度列表
        getScheduleList: function() {
            var tab = main.Schedule.getActiveTab();
            var _PDN = tab.node["_PDN"];
            var params = {
                RDN: _PDN
            };
            main.model.Schedule.getScheduleList(params);
        },
        getTree: function() {
            var tab = main.Schedule.getActiveTab();
            var tree = tab.getComponent(0);
            return tree;
        },
        setStoreData: function(data) {
            var l = data.length;
            var tree = main.Schedule.getTree();
            var root = tree.getStore().getRoot();
            root.removeAll();
            for (var i = 0; i < l; i++) {
                var node = {};
                if (data[i]["_STATUS"] == 0) {
                    node["iconCls"] = "a_stop";
                } else {
                    node["iconCls"] = "a_running";
                }
                node["data"] = data[i];
                node["loaded"] = false;
                node["text"] = data[i]["_NAME"];
                root.appendChild(node);
            }
            // main.view.Schedule.getScheduleQueue();
        },
        treeToScheduleExpand: function(node) {
            if (node.data.data["CLASS"] == configs.TREE_CLASS.Schedule) {
                if (!node.data["loaded"]) {
                    main.model.Schedule.getScheduleQueueList(node.data.data, node);
                }
            }
        },
        dblclick_tree: function(node) {
            var nodeData = node.record.data;
            if (nodeData.data["CLASS"] == configs.TREE_CLASS.SchQueue) {
                main.Schedule.getScheduleNode(node.record, "db");
            }
        },
        right_click_menu_show: function(node) {
            if (!node.item) {
                return;
            }
            var menu = main.view.Schedule.right_click_menu;
            var nodeData = node.record.data.data;
            var _add = menu.getComponent(1);
            var _update = menu.getComponent(2);
            var _refresh = menu.getComponent(3);
            var _delete = menu.getComponent(4);
            var _running = menu.getComponent(5);
            var _stop = menu.getComponent(6);
            var _import = menu.getComponent(8);
            var _export = menu.getComponent(9);
            console.log(_export);
            if (nodeData["CLASS"] == configs.TREE_CLASS.Schedule) {
                _running.show();
                _stop.show();
                _add.show();
                _update.hide();
                _refresh.show();
                _delete.show();
                _import.show();
                _export.show();
            } else {
                _add.hide();
                _update.show();
                _refresh.hide();
                _delete.show();
                _running.hide();
                _stop.hide();
                _import.hide();
                _export.hide();
            }
            var x = node.pageX;
            var y = node.pageY;
            main.view.Schedule.right_click_node = node.record;
            main.view.Schedule.right_click_menu.setPagePosition(x, y);
            main.view.Schedule.right_click_menu.show();
        },
        addScheduleWinHide: function() {
            var form = Ext.getCmp("AddScheduleForm");
            form.getForm().reset();
            main.view.Schedule.addScheduleWin.hide();
        },
        addSchQueueWinHide: function() {
            var form = Ext.getCmp("AddSchQueueForm");
            form.getForm().reset();
            main.view.Schedule.addSchQueueWin.hide();
        },
        addSchedule: function() {
            if (!main.view.Schedule.addScheduleWin) {
                main.view.Schedule.createAddScheduleWin();
            }
            main.view.Schedule.addScheduleWin.show();
        },
        getSchTestTimes: function() {
            var form = Ext.getCmp("AddScheduleForm");
            var data = form.getValues();
            for (i in data) {
                if (i == "_NAME") {

                } else {
                    if (!/^[0-9]*$/.test(data[i]) && data[i].indexOf(",") == -1 && data[i].indexOf("~") == -1 && data[i].indexOf("-") == -1 && data[i] !== "") {
                        main.view.toast("字段不符合规则");
                        return;
                    }
                    if (data[i] == "") {
                        data[i] = undefined;
                    }
                }
            }

            var date = new Date();
            var time = tools.dateZerofill(date);
            var SETTING = {
                TYPE: 2,
                CONTENT: data
            };
            var params = {
                _SCH_TIME: time,
                SETTING: JSON.stringify(SETTING),
                COUNT: 10
            };

            main.model.Schedule.getSchTestTimes(params, time);
        },
        getSchTestTimesReturn: function(data, time) {
            var store = Ext.StoreMgr.get(configs.STORE_NAME.SCH_TESTS_TIMES_STORE);
            var storeData = [];
            var index = 1;
            if (data["FLOOR"]) {
                for (var j = 0, f_l = data["FLOOR"].length; j < f_l; j++) {
                    storeData.push({
                        index: index++,
                        schTestsTimes: data["FLOOR"][j]
                    });
                }
            }
            storeData.push({
                index: index++,
                schTestsTimes: "当前时间:" + time
            });

            if (data["CEIL"]) {
                for (var i = 0, l = data["CEIL"].length; i < l; i++) {
                    storeData.push({
                        index: index++,
                        schTestsTimes: data["CEIL"][i]
                    });
                }
            }
            store.loadData(storeData);
        },

        addScheduleSub: function() {
            var tab = main.Schedule.getActiveTab();
            var _PDN = tab.node["_PDN"];
            var form = Ext.getCmp("AddScheduleForm");
            var data = form.getValues();
            for (i in data) {
                if (i == "_NAME") {
                    if (data[i] == "") {
                        main.view.toast("名称不能为空");
                        return;
                    }
                } else {
                    if (!/^[0-9]*$/.test(data[i]) && data[i].indexOf(",") == -1 && data[i].indexOf("~") == -1 && data[i].indexOf("-") == -1 && data[i] !== "") {
                        main.view.toast("字段不符合规则");
                        return;
                    }
                    if (data[i] == "") {
                        data[i] = undefined;
                    }
                }
            }
            var _TIME_CONFIG = {
                SETTING: {
                    TYPE: 2,
                    CONTENT: data
                }
            };
            var params = {
                _PDN: _PDN,
                _NAME: data["_NAME"],
                _TIME_CONFIG: JSON.stringify(_TIME_CONFIG)
            };

            main.model.Schedule.addSchedule(params);
        },
        addScheduleReturn: function(data) {
            var node = {},
                root;
            node["data"] = data;
            node["text"] = data["_NAME"];
            if (data["_STATUS"] == 0) {
                node["iconCls"] = "a_stop";
            } else {
                node["iconCls"] = "a_running";
            }

            // if (main.view.Schedule.ScheduleStore) {
            var tree = main.Schedule.getTree();
            var root = tree.getStore().getRoot();
            // root = main.view.Schedule.ScheduleStore.getRoot();
            root.appendChild(node);
            root.findChildBy(function(record) {
                if (record.data.data == data) {
                    main.model.Schedule.getScheduleQueueList(data, record);
                }
            });
            // }
            main.Schedule.addScheduleWinHide();
        },
        updateSchQueue: function() {
            var node = main.view.Schedule.right_click_node;
            var nodeData = node.data.data;
            if (nodeData["CLASS"] == configs.TREE_CLASS.SchQueue) {
                if (!main.view.Schedule.addSchQueueWin) {
                    main.view.Schedule.createAddSchQueueWin();
                }
                main.view.Schedule.isAddSchQueue = false;
                main.view.Schedule.addSchQueueWin.show();
                main.model.Schedule.getSchQueue(node.data.data);
            }
        },
        setSchQueue: function(data) {
            var form = Ext.getCmp("AddSchQueueForm");
            var _NAME = form.getComponent(0);
            var _SIZE = form.getComponent(1);
            var _ENABLED = form.getComponent(2);
            _NAME.setValue(data["_NAME"]);
            _SIZE.setValue(data["_SIZE"]);
            _ENABLED.setValue(data["_ENABLED"]);
        },
        deleteScheduleTreeNode: function(e) {
            var node = main.view.Schedule.right_click_node;
            Ext.Msg.show({
                title: "警告",
                modal: false,
                msg: "你确定要删除该节点吗？",
                buttonText: {
                    yes: "确定",
                    no: "取消"
                },
                fn: function(btn) {
                    if (btn === "yes") {
                        if (node.data.data["CLASS"] == configs.TREE_CLASS.Schedule) {
                            main.model.Schedule.deleteSchedule(node.data.data);
                        } else if (node.data.data["CLASS"] == configs.TREE_CLASS.SchQueue) {
                            main.model.Schedule.deleteSchQueue(node.data.data);
                        }
                    }
                }
            });
        },
        deleteScheduleReturn: function(data) {
            main.view.toast("删除成功");
            var node = main.view.Schedule.right_click_node,
                root,
                rootChild;
            if (node.data.data["CLASS"] == configs.TREE_CLASS.Schedule) {
                root = node.parentNode;
                root.removeChild(node);
            } else if (node.data.data["CLASS"] == configs.TREE_CLASS.SchQueue) {
                root = node.parentNode;
                root.removeChild(node);
            }
        },
        setScheduleQueueList: function(data, rootNode) {
            rootNode.removeAll();
            rootNode.data["loaded"] = true;
            for (var i = 0, l = data.length; i < l; i++) {
                var node = {};
                node["data"] = data[i];
                node["text"] = data[i]["_NAME"];
                node["leaf"] = true;
                if (data[i]["_DEFAULT"]) {
                    node["iconCls"] = "a_default";
                } else {
                    node["iconCls"] = "a_undefault";
                }
                rootNode.appendChild(node);
            }
        },
        addSchQueue: function() {
            var node = main.view.Schedule.right_click_node;
            if (!node.data.leaf) {
                if (!main.view.Schedule.addSchQueueWin) {
                    main.view.Schedule.createAddSchQueueWin();
                }
                main.view.Schedule.isAddSchQueue = true;
                var form = Ext.getCmp("AddSchQueueForm");
                var _NAME = form.getComponent(0);
                var _SIZE = form.getComponent(1);
                var _ENABLED = form.getComponent(2);
                _SIZE.setValue(20);
                _ENABLED.setValue(true);
                main.view.Schedule.addSchQueueWin.show();
            }
        },
        addSchQueueSub: function() {
            var form = Ext.getCmp("AddSchQueueForm");
            var data = form.getValues();
            var node = main.view.Schedule.right_click_node;
            data["_SIZE"] = parseInt(data["_SIZE"]);
            if (!/^[0-9]*$/.test(data["_SIZE"])) {
                main.view.toast("队列大小不是数字");
                return;
            }
            if (data["_SIZE"] <= 0) {
                main.view.toast("队列大小必须大于0");
                return;
            }
            if (data["_NAME"] === "") {
                main.view.toast("名称不能为空");
                return;
            }
            if (data["_ENABLED"] === "") {
                main.view.toast("请选择是否可用");
                return;
            }
            if (data["_DEFAULT"] === "") {
                main.view.toast("请选择是否默认");
                return;
            }

            if (main.view.Schedule.isAddSchQueue) {
                data["_PDN"] = node.data.data["RDN"];
                main.model.Schedule.addSchQueue(data);
            } else {
                var rootNode = node.parentNode;
                data["_PDN"] = rootNode.data.data["RDN"];
                data["RDN"] = node.data.data["RDN"];
                data["_ID"] = node.data.data["_ID"];
                main.model.Schedule.updateSchQueue(data);
            }
        },
        updateSchQueueReuturn: function(data) {
            var node = main.view.Schedule.right_click_node;
            var newNode = node;
            newNode.data["text"] = data["_NAME"];
            newNode.data.data = data;
            var rootNode = node.parentNode;
            rootNode.replaceChild(newNode, node);
            main.Schedule.addSchQueueWinHide();
        },
        addSchQueueReturn: function(data) {
            var rootNode = main.view.Schedule.right_click_node;
            var node = {
                data: data,
                text: data["_NAME"],
                iconCls: "a_undefault",
                leaf: true
            }
            rootNode.appendChild(node);
            main.Schedule.addSchQueueWinHide();
        },
        startupSchedule: function() {
            var node = main.view.Schedule.right_click_node;
            if (node.data.data["CLASS"] == configs.TREE_CLASS.Schedule) {
                main.model.Schedule.startupSchedule(node.data.data, node);
            } else {
                main.view.toast("选择并非调度");
            }
        },
        startupScheduleReturn: function(data, node) {
            main.model.Schedule.getSchedule(node.data.data, node);
        },
        shutdownSchedule: function() {
            var node = main.view.Schedule.right_click_node;
            if (node.data.data["CLASS"] == configs.TREE_CLASS.Schedule) {
                main.model.Schedule.shutdownSchedule(node.data.data, node);
            } else {
                main.view.toast("选择并非调度");
            }
        },
        shutdownScheduleReturn: function(data, node) {
            main.model.Schedule.getSchedule(node.data.data, node);
        },
        setSchedule: function(data, node) {
            var tree = main.Schedule.getTree();
            var root = tree.getStore().getRoot();
            // var root = main.view.Schedule.ScheduleStore.getRoot();
            var newNode = node;
            newNode.data.data = data;
            if (data["_STATUS"] == 1) {
                newNode.data["iconCls"] = "a_running";
            } else if (data["_STATUS"] == 2) {
                newNode.data["iconCls"] = "a_stopIn";
            } else {
                newNode.data["iconCls"] = "a_stop";
            }
            root.replaceChild(newNode, node);
        },
        refreshScheduleTreeNode: function() {
            var node = main.view.Schedule.right_click_node;
            if (!node.data.leaf) {
                main.model.Schedule.getScheduleQueueList(node.data.data, node);
            }
        },
        // db ：是否为双击
        getScheduleNode: function(e, db) {
            var node;
            if (db && db == "db") {
                node = e;
            } else {
                node = main.view.Schedule.right_click_node;
            }
            main.Schedule.openScheduleNode = node;
            main.Schedule.setScheduleNodeInfo();
        },
        getScheduleNodeTab: function() {
            var main_tab = main.Schedule.getActiveTab();
            var schedule_tab = main_tab.getComponent(2);
            var children_tabs = schedule_tab.items.items;
            var l = children_tabs.length;
            if (l > 0) {
                for (var i = 0; i < l; i++) {
                    console.log(children_tabs[i]);
                    if (children_tabs[i]["CLASS"] === "ScheduleNodeTab") {
                        return children_tabs[i];
                    }
                }
            }
            return null;
        },
        getContentTab: function() {
            var main_tab = main.Schedule.getActiveTab();
            var schedule_tab = main_tab.getComponent(2);
            return schedule_tab;
        },
        setScheduleNodeInfo: function() {
            var node = main.Schedule.openScheduleNode;
            var contentTab = main.Schedule.getContentTab();
            if (!main.Schedule.getScheduleNodeTab()) {
                var tab_data = main.view.Schedule.createScheduleNodeTab(node);
                contentTab.add(tab_data);
            }
            var tab = main.Schedule.getScheduleNodeTab();
            var pageBar = tab.pageBar;
            tab.config.data = node.data.data;
            contentTab.setActiveTab(tab);
            tab.setTitle(node.data.data["_NAME"] + "——队列节点");
            pageBar.setCurrPage(1);
            main.Schedule.getScheduleNodeList();
        },
        // 获取队列列表
        getScheduleNodeList: function() {
            var node = main.Schedule.openScheduleNode;
            var tab = main.Schedule.getScheduleNodeTab();
            var pageBar = tab.pageBar;
            var start = pageBar.getStart();
            var count = pageBar.getPageCount();
            var params = {
                RDN: node.data.data["RDN"],
                START: start,
                COUNT: count
            }
            main.model.Schedule.getScheduleNode(params);
        },
        setScheduleNode: function(data) {
            var tab = main.Schedule.getScheduleNodeTab();
            var grid = tab.getComponent(0);
            var pageBar = tab.pageBar;
            var store = grid.getStore();
            pageBar.setTotalCount(parseInt(data["TOTAL_COUNT"]));
            store.loadData(data["DATA_LIST"]);
        },
        ScheduleNodePageChange: function(currPage, pageCount) {
            var tab = main.Schedule.getScheduleNodeTab();
            var pageBar = tab.pageBar;
            var data = tab.config.data;
            var start = pageBar.getStart();
            var count = pageBar.getPageCount();
            var params = {
                RDN: data["RDN"],
                START: start,
                COUNT: count
            };
            main.model.Schedule.getScheduleNode(params);
        },
        closeEditor: function(e) {
            main.Schedule.getContentTab().remove(e);
        },
        //   调度导入导出------------------------------------------------------------------------
        importFile: function() {
            if (Ext.getCmp("importFileToSchedule")) {
                return;
            }
            var node = main.view.Schedule.right_click_node;
            var form = Ext.create("Ext.form.Panel", {
                method: "POST",
                items: [{
                    xtype: "hiddenfield",
                    name: "FUNC",
                    value: "",
                }, {
                    xtype: "hiddenfield",
                    name: "FUNC_PARAMS",
                    value: JSON.stringify(node.data.data),
                }, {
                    xtype: "filefield",
                    name: "",
                    fieldLabel: "文件",
                    labelAlign: "right",
                    labelWidth: 50,
                    anchor: "100%",
                    buttonText: '选择文件',
                    isDelete: false,
                    margin: 10,
                }],
            });
            var win = Ext.create("Ext.window.Window", {
                id: "importFileToSchedule",
                width: 400,
                modal: false,
                title: "导入调度",
                closable: true,
                closeAction: "destroy",
                draggable: true,
                resizable: false, //是否可以调整大小
                items: [form],
                buttons: [{
                    text: "上传",
                    handler: function() {
                        if (form.isValid()) {
                            form.submit({
                                url: "../../dataProcess",
                                success: function(form, action) {
                                    console.log("success");
                                },
                                failure: function(form, action) {
                                    var response = action.response.responseText;
                                    console.log(response);
                                    main.view.toast(response);
                                }
                            });
                        }
                    }
                }]
            }).show();
        },
        exportFile: function() {
            var node = main.view.Schedule.right_click_node;
            var FUNC_PARAMS = {

            };
            var form = Ext.create("Ext.form.Panel", {
                method: "POST",
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
                        var response = action.response.responseText;
                        console.log(response);
                        main.view.toast(response);
                    }
                });
            }
        },
        ScheduleNode: {
            selectNodes: [],
            openSetSlave: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.SET_SLAVE_WIN)) {
                        main.view.Schedule.ScheduleNode.createSetSlaveWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.SET_SLAVE_WIN).show();
                    $this.getSetSlaveList();
                }

            },
            setSelectNodes: function(nodes) {
                var selectNodes = [];
                var $this = main.Schedule.ScheduleNode;
                for (var i = 0, l = nodes.length; i < l; i++) {
                    selectNodes.push(nodes[i].data.RDN)
                }
                $this.selectNodes = selectNodes;
            },
            getSetSlaveList: function() {
                main.model.Schedule.getSetSlaveList();
            },
            setSetSlaveList: function(data) {
                var combobox_data = [];
                if (data.length > 0) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        combobox_data.push({
                            NAME: data[i][configs.Slave._LABEL] + "(名称：" + data[i][configs.Slave._NAME] + ",端口：" + data[i][configs.Slave._PORT] + ")",
                            VALUE: data[i][configs.Slave.RDN]
                        });
                    }
                }
                var store = Ext.StoreMgr.get(configs.STORE_NAME.SET_SLAVE_STORE);
                store.loadData(combobox_data);
                var form = Ext.getCmp(configs.FORM_NAME.SET_SLAVE_FORM);
                form.getComponent(0).setValue(combobox_data[0]["VALUE"]);
            },
            setSlave: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_SLAVE_FORM);
                var value = form.getValues();
                if (!value["RDN"]) {
                    main.view.toast("请选择运行容器");
                    return;
                }
                var params = {
                    RDN: value["RDN"],
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.setSchContainer(params);
            },
            setSlaveReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideSetSlave();
            },
            hideSetSlave: function() {
                Ext.getCmp(configs.WIN_NAME.SET_SLAVE_WIN).hide();
                var form = Ext.getCmp(configs.FORM_NAME.SET_SLAVE_FORM);
                form.getForm().reset();
            },

            // ResetSchNodes
            openResetSchNodesWin: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.RESET_SCHNODES_WIN)) {
                        main.view.Schedule.ScheduleNode.createResetSchNodesWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.RESET_SCHNODES_WIN).show();
                    var form = Ext.getCmp(configs.FORM_NAME.RESET_SCHNODES_FORM);
                    form.getComponent(0).setValue(false);
                    form.getComponent(1).setValue(false);
                }
            },
            resetSchNodes: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.RESET_SCHNODES_FORM);
                var value = form.getValues();
                if (value.FORCE === "") {
                    main.view.toast("请选择");
                    return;
                }
                if (value.RECURSION === "") {
                    main.view.toast("请选择");
                    return;
                }
                var params = {
                    FORCE: value.FORCE,
                    RECURSION: value.RECURSION,
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.resetSchNodes(params);
            },
            resetSchNodesReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideResetSchNodes();
            },
            hideResetSchNodes: function() {
                Ext.getCmp(configs.WIN_NAME.RESET_SCHNODES_WIN).hide();
                var form = Ext.getCmp(configs.FORM_NAME.RESET_SCHNODES_FORM);
                form.getForm().reset();
            },
            terminateSchNodesShow: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    Ext.Msg.show({
                        title: "警告",
                        modal: false,
                        msg: "你确定要终止选中节点运行吗？",
                        buttonText: {
                            yes: "确定",
                            no: "取消"
                        },
                        fn: function(btn) {
                            if (btn === "yes") {
                                $this.terminateSchNodes();
                            }
                        }
                    });
                }
            },
            terminateSchNodes: function() {
                var $this = main.Schedule.ScheduleNode;
                var params = {
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.terminateSchNodes(params);
            },
            terminateSchNodesReturn: function(data) {
                main.Schedule.getScheduleNodeList();
            },
            openSetSchPriorityWin: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.SET_SCH_PRIORITY_WIN)) {
                        main.view.Schedule.ScheduleNode.createSetSchPriorityWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.SET_SCH_PRIORITY_WIN).show();
                    var form = Ext.getCmp(configs.FORM_NAME.SET_SCH_PRIORITY_FORM);
                    form.getComponent(0).setValue(50);
                }
            },
            setSchPriority: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCH_PRIORITY_FORM);
                var value = form.getValues();
                var _PRIORITY = parseInt(value._PRIORITY);
                if (typeof _PRIORITY !== "number" || _PRIORITY > 100 || _PRIORITY < 0) {
                    main.view.toast("请填写正确的优先级(0~100)");
                    return;
                }
                var params = {
                    _PRIORITY: _PRIORITY,
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.setSchPriority(params);
            },
            setSchPriorityReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideSetSchPriorityWin();
            },
            hideSetSchPriorityWin: function() {
                Ext.getCmp(configs.WIN_NAME.SET_SCH_PRIORITY_WIN).hide();
            },
            openSetSchQueueWin: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.SET_SCHQUEUE_WIN)) {
                        main.view.Schedule.ScheduleNode.createSetSchQueueWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.SET_SCHQUEUE_WIN).show();
                    $this.getSetSchQueueList();
                }
            },
            getSetSchQueueList: function() {
                var $this = main.Schedule;
                var node = $this.openScheduleNode.data.data
                var klass = node.CLASS;
                var scheduleRDN = "";
                if (klass == "SchQueue") {
                    scheduleRDN = node._PDN.split(";")[1];

                } else {
                    scheduleRDN = node.RDN
                }
                var params = {
                    RDN: scheduleRDN,
                }
                main.model.Schedule.getSetSchQueueList(params);
            },

            setSetSchQueueList: function(data) {
                var combobox_data = [];
                if (data.length > 0) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        combobox_data.push({
                            NAME: data[i][configs.SchQueue._NAME],
                            VALUE: data[i][configs.SchQueue.RDN]
                        });
                    }
                }
                var store = Ext.StoreMgr.get(configs.STORE_NAME.SET_SCHQUEUE_STORE);
                store.loadData(combobox_data);
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCHQUEUE_FORM);
                form.getComponent(0).setValue(combobox_data[0]["VALUE"]);
            },
            setSchQueue: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCHQUEUE_FORM);
                var value = form.getValues();
                if (value[configs.SchQueue.RDN] === "") {
                    main.view.toast("请选择");
                    return;
                }
                var params = {
                    RDN: value[configs.SchQueue.RDN],
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.setSchQueue(params);
            },
            setSchQueueReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideSetSchQueueWin();
            },
            hideSetSchQueueWin: function() {
                Ext.getCmp(configs.WIN_NAME.SET_SCHQUEUE_WIN).hide();
            },
            openSetSchTimeWin: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.SET_SCHTIME_WIN)) {
                        main.view.Schedule.ScheduleNode.createSetSchTimeWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.SET_SCHTIME_WIN).show();
                    var date = new Date();
                    var form = Ext.getCmp(configs.FORM_NAME.SET_SCHTIME_FORM);
                    form.getComponent(0).setValue(date);
                    $this.getSchTimes();
                    form.getComponent(0).addListener("change", $this.getSchTimes);
                }

            },
            getSchTimes: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCHTIME_FORM);
                var value = form.getValues();
                if (value["_SCH_TIME_USER"] === "") {
                    return;
                }
                var scheduleRDN = $this.getOpenSchduleRDN();
                var params = {
                    _SCH_TIME: value["_SCH_TIME_USER"],
                    RDN: scheduleRDN
                };
                main.model.Schedule.getSchTimes(params);
            },
            getOpenSchduleRDN: function() {
                var $this = main.Schedule;
                var node = $this.openScheduleNode.data.data
                var klass = node.CLASS;
                var scheduleRDN = "";
                if (klass == "SchQueue") {
                    scheduleRDN = node._PDN.split(";")[1];

                } else {
                    scheduleRDN = node.RDN
                }
                return scheduleRDN;
            },
            getSchTimesReturn: function(data) {
                console.log(data);
                var store = Ext.StoreMgr.get(configs.STORE_NAME.SET_SCHTIME_STORE);
                var combobox = [];
                for (var i = 0, l = data.length; i < l; i++) {
                    combobox.push({
                        NAME: data[i],
                        VALUE: data[i]
                    })
                }
                store.loadData(combobox);
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCHTIME_FORM);
                form.getComponent(1).setValue(data[0]);
            },
            setSchTime: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_SCHTIME_FORM);
                var value = form.getValues();
                if (value["_SCH_TIME"] === "") {
                    main.view.toast("请选择时间");
                    return;
                }
                var params = {
                    _SCH_TIME: value["_SCH_TIME"],
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.setSchTime(params);
            },
            setSchTimeReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideSetSchTimeWin();
            },
            hideSetSchTimeWin: function() {
                Ext.getCmp(configs.WIN_NAME.SET_SCHTIME_WIN).hide();
            },
            openSetNodeSuspendWin: function() {
                var tab = main.Schedule.getScheduleNodeTab();
                var grid = tab.getComponent(0);
                var grid_select = grid.getSelection();
                var $this = main.Schedule.ScheduleNode;
                if (grid_select.length > 0) {
                    $this.setSelectNodes(grid_select);
                    if (!Ext.getCmp(configs.WIN_NAME.SET_NODESUSPEND_WIN)) {
                        main.view.Schedule.ScheduleNode.createSetNodeSuspendWin();
                    }
                    Ext.getCmp(configs.WIN_NAME.SET_NODESUSPEND_WIN).show();
                    var form = Ext.getCmp(configs.FORM_NAME.SET_NODESUSPEND_FORM);
                    form.getComponent(0).setValue(true);
                }
            },
            setNodeSuspend: function() {
                var $this = main.Schedule.ScheduleNode;
                var form = Ext.getCmp(configs.FORM_NAME.SET_NODESUSPEND_FORM);
                var value = form.getValues();
                if (value["_SUSPEND"] === "") {
                    main.view.toast("请选择是否挂起");
                    return;
                }
                var params = {
                    _SUSPEND: value["_SUSPEND"],
                    IDS: $this.selectNodes.join(",")
                }
                main.model.Schedule.setNodeSuspend(params);
            },
            setNodeSuspendReturn: function(data) {
                main.Schedule.getScheduleNodeList();
                main.Schedule.ScheduleNode.hideSetNodeSuspendWin();
            },
            hideSetNodeSuspendWin: function() {
                Ext.getCmp(configs.WIN_NAME.SET_NODESUSPEND_WIN).hide();
            }
        },
        // 关系图
        SchGraph: {
            getSchGraphTab: function() {
                var main_tab = main.Schedule.getActiveTab();
                var schedule_tab = main_tab.getComponent(2);
                var children_tabs = schedule_tab.items.items;
                var l = children_tabs.length;
                if (l > 0) {
                    for (var i = 0; i < l; i++) {
                        console.log(children_tabs[i]);
                        if (children_tabs[i]["CLASS"] === "SchGraphTab") {
                            return children_tabs[i];
                        }
                    }
                }
                return null;
            },
            openSchGraphTab: function() {
                // var mainTab = main.view.Schedule.ScheduleContent;

                // var tab = mainTab.getComponent("SchGraphTab");
                var tab = main.Schedule.SchGraph.getSchGraphTab();
                var edi = main.view.Schedule.right_click_node;
                var contentTab = main.Schedule.getContentTab();
                if (!tab) {
                    tab = contentTab.add(main.view.Schedule.SchGraph.createSchGraphTab(edi));
                }
                tab.setTitle(edi.data.data["_NAME"] + "关联图");
                if (edi.data.data) {
                    main.Schedule.SchGraph.getSchGraph(edi.data.data);
                };
            },
            getSchGraph: function(params) {
                main.model.Schedule.getSchGraph(params);
            },
            setSchGraph: function(data) {
                console.log(data);
                main.view.Schedule.SchGraph.createSchGraphContent(data);
            }
        },
    },
    // 调度结束----------------------------------------------------------------
    // 
    // 
    // 调试---------------------------------------------------------------------------
    debugTab: {
        // 调度历史--------------------------------------------------------------
        init: function() {
            var grid = Ext.getCmp("HistoryOfNodeGrid");
            var gridEl = grid.getEl();
            gridEl.dom.oncontextmenu = function(e) {
                e.preventDefault();
            };
        },
        openHistoryOfNodeTab: function(edi) {

            var mainTab = main.view.structure.debug_tab;
            var historyOfNodeTab = mainTab.getComponent("historyOfNodeTab");
            if (!historyOfNodeTab) {
                main.view.debugTab.HistoryOfNode.createHistoryOfNodeTab(edi);
                historyOfNodeTab = mainTab.getComponent("historyOfNodeTab");
            }

            var historyOfNodeTabTitile = main.view.debugTab.HistoryOfNode.HistoryOfNodeTabTitle;
            historyOfNodeTabTitile.setText(edi.record.data["NAME"] + "节点历史");
            historyOfNodeTab["data"] = edi.record.data;
            var pageBar = main.view.debugTab.HistoryOfNode.HistoryOfNodeTabPageBar;
            pageBar.setCurrPage(1);
            var start = pageBar.getStart();
            var count = pageBar.getPageCount();
            var params = {
                RDN: edi.record.data["RDN"],
                START: start,
                COUNT: count
            }
            mainTab.setActiveTab(historyOfNodeTab);
            main.model.Schedule.getHistoryOfNodeList(params);
            main.debugTab.init();
        },
        setHistoryOfNodeList: function(data) {
            console.log(data);
            var pageBar = main.view.debugTab.HistoryOfNode.HistoryOfNodeTabPageBar;

            var store = main.view.debugTab.HistoryOfNode.HistoryOfNodeStore
            if (store) {
                pageBar.setTotalCount(data["TOTAL_COUNT"]);
                store.loadData(data["DATA_LIST"]);
            }
        },
        searchHistoryOfNode: function() {
            var value = Ext.getCmp("searchHistoryOfNode").getValue();
            var store = main.view.debugTab.HistoryOfNode.HistoryOfNodeStore;
            var line;
            store.clearFilter();

            store.filterBy(function(record, id) {
                value = value.toLowerCase();
                for (i in record["data"]) {
                    line = record["data"][i];
                    console.log(line);
                    if (record["data"][i] && ((record["data"][i]) + "").toLowerCase().indexOf(value) != -1) {
                        return true;
                    }
                }
                return false;
            });
        },
        HistoryOfNodeTabPageChange: function() {
            var mainTab = main.view.structure.debug_tab;
            var edi = mainTab.getActiveTab();
            var pageBar = main.view.debugTab.HistoryOfNode.HistoryOfNodeTabPageBar;
            var start = pageBar.getStart();
            var count = pageBar.getPageCount();
            var params = {
                RDN: edi.data["RDN"],
                START: start,
                COUNT: count
            }
            mainTab.setActiveTab(historyOfNodeTab);
            main.model.Schedule.getHistoryOfNodeList(params);
        },
        closeEditor: function(e) {
            main.view.structure.debug_tab.remove(e);
        },
        historyOfNode_Right_click_menuShow: function(e, e2) {
            var grid = Ext.getCmp("HistoryOfNodeGrid");
            if (grid.getSelection().length !== 1) {
                return;
            }

            var menu = main.view.debugTab.HistoryOfNode.HistoryOfNode_Right_click_menu;
            if (!menu) {
                main.view.debugTab.HistoryOfNode.createHistoryOfNode_Right_click_menu();
            }
            menu = main.view.debugTab.HistoryOfNode.HistoryOfNode_Right_click_menu;
            var x = e.pageX;
            var y = e.pageY;
            menu.setPagePosition(x, y);
            menu.show();
        },
        openTrace: function() {
            main.debugTab.openWin("HistoryOfNodeTrace");
            main.debugTab.getSchNodeHistoryTrace();
        },
        openErrMsg: function() {
            main.debugTab.openWin("HistoryOfNodeErrMsg");
            main.debugTab.getSchNodeHistoryErrMsg();
        },
        getSchNodeHistoryTrace: function() {
            var grid = Ext.getCmp("HistoryOfNodeGrid");
            var node = grid.getSelection()[0];
            var params = {
                RDN: node.data["RDN"]
            }
            main.model.Schedule.getSchNodeHistoryTrace(params);
        },
        getSchNodeHistoryErrMsg: function() {
            var grid = Ext.getCmp("HistoryOfNodeGrid");
            var node = grid.getSelection()[0];
            var params = {
                RDN: node.data["RDN"]
            }
            main.model.Schedule.getSchNodeHistoryErrMsg(params);
        },
        openWin: function(tab) {
            if (!Ext.getCmp("HistoryOfNodeInfoWin")) {
                main.view.debugTab.HistoryOfNode.createHistoryOfNodeInfoWin();
            }
            var win = main.view.debugTab.HistoryOfNode.HistoryOfNodeInfoWin;
            win.show();
            var mainTab = main.view.debugTab.HistoryOfNode.HistoryOfNodeInfoWinToTab;
            mainTab.getComponent(tab);
            mainTab.setActiveTab(tab);
        },
        setSchNodeHistoryTrace: function(data, params) {
            // var text = new Ext.form.Label({
            //     html: "<pre>" + data + "</pre>",
            //     forceFit: true,
            //     renderTo: Ext.getBody()
            // });
            var mainTab = main.view.debugTab.HistoryOfNode.HistoryOfNodeInfoWinToTab;
            var tab = mainTab.getComponent("HistoryOfNodeTrace");
            // ErrMsgTab.removeAll();
            // ErrMsgTab.add(text);


            //  paramsMap:{
            //     tabId: paramsMap.tabId,
            //     debugId: paramsMap.debugId,
            //     params: params,
            //     KEY: data.KEY
            //  }
            //  
            // 停止他
            var that = main.debugTab;
            // that.debugKey[paramsMap.tabId] = paramsMap.KEY;
            var data = data || [];
            // var tab = Ext.getCmp(paramsMap.tabId);
            // 限制 tab在 100 条
            if (!tab) {
                return;
            }
            for (var i = 0, l = data.length; i < l; i++) {
                var tabLength = tab.items.length;
                var endIndex = -1;
                var index = data[i]["NUM"];
                // 如果 tab长度大于限制，则移除第一个
                if (tabLength > configs.consoleMaxLenght) {
                    tab.remove(tab.getComponent(0));
                }
                tabLength = tab.items.length;

                if (tabLength > 0) {
                    var endItems = tab.getComponent(tabLength - 1);
                    endIndex = endItems.index;
                }
                if (index > endIndex) {
                    var type = data[i]["TYPE"];

                    if (type == -1) {
                        tab.add([{
                            index: index,
                            style: {
                                color: "#f00000",
                            },
                            margin: "5 10 5 10",
                            border: 0,
                            html: "<pre style='color:#DE5246;''>调试已结束</pre>",
                            xtype: "panel"
                        }]);
                        that.scrollByTab(paramsMap.tabId);
                        that.initDebugBtn(paramsMap.debugId);
                        return;
                    }
                    var color = that.getTraceColor(data[i]["TYPE"]);
                    var msg = that.getTraceMsg(type, data[i]["MSG"]);
                    tab.add([{
                        margin: "5 10 5 10",
                        index: index,
                        style: {
                            'color': color,
                        },
                        border: 0,
                        html: "<pre style='color:" + color + ";''>" + "[" + data[i]["TIME"] + "]" + msg + "</pre>",
                        xtype: "panel",
                    }]);
                }
            };
            that.scrollByTab("HistoryOfNodeTrace");
            window.setTimeout(function() {
                main.model.Schedule.getSchNodeHistoryTrace(params);
            }, 1000);
        },
        scrollByTab: function(tabId) {
            var tab = Ext.getCmp(tabId);
            if (tab) {
                setTimeout(function() {
                    tab.scrollBy(10000, 10000, true);
                }, 500);
            }
        },
        setSchNodeHistoryErrMsg: function(data) {
            if (!data) {
                data = "";
            }
            var text = new Ext.form.Label({
                html: "<pre>" + data + "</pre>",
                style: {
                    color: "#F00",
                    lineHeight: "20px"
                },
                forceFit: true,
                renderTo: Ext.getBody()
            });
            var mainTab = main.view.debugTab.HistoryOfNode.HistoryOfNodeInfoWinToTab;
            var ErrMsgTab = mainTab.getComponent("HistoryOfNodeErrMsg");
            ErrMsgTab.removeAll();
            ErrMsgTab.add(text);
        },
        closeHistoryOfNodeInfoWin: function() {
            main.view.debugTab.HistoryOfNode.HistoryOfNodeInfoWin.destroy();
        },
        // 调度历史结束---------------------------------------------------
        // 
        // 
        // 运行容器---------------------------------------------------
        Slave: {
            SlaveListData: [],
            IsUpdateSlave: false,
            updateNode: null,
            openSlaveTab: function() {
                main.view.debugTab.Slave.createSlaveTab();
                main.view.structure.debug_tab.setActiveTab(main.view.debugTab.Slave.SlaveTab);
                this.getSlaveList();

                // ----------------------------------------------------------------------
                // setInterval(this.getSlaveList, 5000);
            },
            getSlaveList: function() {
                if (!main.view.debugTab.Slave.SlaveTab.isHidden()) {
                    main.model.Slave.getSlaveList();
                }
            },
            setSlaveList: function(data) {
                if (data.sort().toString() != main.debugTab.Slave.SlaveListData.sort().toString()) {
                    main.debugTab.Slave.SlaveListData = data;
                    main.view.debugTab.Slave.SlaveStore.loadData(data);
                }
            },
            addSlaveWinShow: function() {
                if (!main.view.debugTab.Slave.addSlaveWin) {
                    main.view.debugTab.Slave.createAddSlaveWin();
                }
                main.view.debugTab.Slave.addSlaveWin.show();
                main.debugTab.Slave.IsUpdateSlave = false;
            },
            addSlaveWinHide: function() {
                var form = Ext.getCmp("SlaveForm");
                form.getForm().reset();
                main.view.debugTab.Slave.addSlaveWin.hide();
            },
            addSlaveSub: function() {
                var form = Ext.getCmp("SlaveForm");
                var params = form.getValues();
                if (params[configs.Slave._LABEL] == "") {
                    main.view.toast("容器名称不能为空");
                    return;
                }
                if (params[configs.Slave._HOST] == "") {
                    main.view.toast("主机不能为空");
                    return;
                }
                if (params[configs.Slave._PORT] == "") {
                    main.view.toast("端口不能为空");
                    return;
                }
                params[configs.Slave._PORT] = parseInt(params[configs.Slave._PORT]);

                if (main.debugTab.Slave.IsUpdateSlave) {
                    // var grid = Ext.getCmp("SlaveGrid");
                    // var node = grid.getSelection();
                    var node = main.debugTab.Slave.updateNode;
                    params["_ID"] = node[0]["data"]["_ID"];
                    main.model.Slave.updateSlave(params);
                } else {
                    main.model.Slave.addSlave(params);
                }
            },
            addSlaveReturn: function(data) {
                var store = main.view.debugTab.Slave.SlaveStore;
                store.add(data);
                main.debugTab.Slave.addSlaveWinHide();
            },
            updateSlaveWinShow: function() {
                var grid = Ext.getCmp("SlaveGrid");
                var node = grid.getSelection();
                console.log(node);
                if (node.length == 0) {
                    return;
                }
                if (!main.view.debugTab.Slave.addSlaveWin) {
                    main.view.debugTab.Slave.createAddSlaveWin();
                }
                main.view.debugTab.Slave.addSlaveWin.show();
                main.model.Slave.getSlaveNode(node[0]["data"]);
                main.debugTab.Slave.IsUpdateSlave = true;
                main.debugTab.Slave.updateNode = node;
            },
            setSalveNode: function(data) {
                console.log(data);
                var form = Ext.getCmp("SlaveForm");
                var _LABEL = form.getComponent(0);
                var _HOST = form.getComponent(1);
                var _PORT = form.getComponent(2);
                _LABEL.setValue(data[configs.Slave._LABEL]);
                _HOST.setValue(data[configs.Slave._HOST]);
                _PORT.setValue(data[configs.Slave._PORT]);
            },
            updateSalveReturn: function(data) {
                var store = main.view.debugTab.Slave.SlaveStore;
                var line = store.findBy(function(record) {
                    if (record.get("_ID") == data["_ID"]) {
                        var rowStore = store.getById(record.id);
                        rowStore.set(data);
                        return true;
                    }
                });
                main.debugTab.Slave.addSlaveWinHide();
            },
            deleteSlaveWinShow: function() {
                var grid = Ext.getCmp("SlaveGrid");
                var node = grid.getSelection();
                if (node.length == 0) {
                    return;
                }
                main.view.debugTab.Slave.createDeleteSlave();
            },
            deleteSlaveNode: function() {
                var grid = Ext.getCmp("SlaveGrid");
                var node = grid.getSelection();
                main.model.Slave.deleteSlaveNode(node[0]["data"]);
            },
            deleteSlaveNodeReturn: function(data) {
                var grid = Ext.getCmp("SlaveGrid");
                var node = grid.getSelection()[0]["data"];
                var store = main.view.debugTab.Slave.SlaveStore;
                var line = store.findBy(function(record) {
                    if (record.get("RDN") == node["RDN"]) {
                        return true;
                    }
                });
                store.removeAt(line);
            }
        },
        // 运行容器结束----------------------------------------------- 
        // 
        // 
        // 调试
        Debug: {
            debugKey: {},
            // 环境 调试
            // 
            // 
            // debugId : 调试按钮和停止按钮共同ID，
            // 
            getTraceReturn: function(data, paramsMap) {
                //  paramsMap:{
                //     tabId: paramsMap.tabId,
                //     debugId: paramsMap.debugId,
                //     params: params,
                //     KEY: data.KEY
                //  }
                //  
                // 停止他
                var that = main.debugTab.Debug;
                that.debugKey[paramsMap.tabId] = paramsMap.KEY;
                var data = data || [];
                var tab = Ext.getCmp(paramsMap.tabId);
                // 限制 tab在 100 条
                if (!tab) {
                    return;
                }
                for (var i = 0, l = data.length; i < l; i++) {
                    var tabLength = tab.items.length;
                    var endIndex = -1;
                    var index = data[i]["NUM"];
                    // 如果 tab长度大于限制，则移除第一个
                    if (tabLength > configs.consoleMaxLenght) {
                        tab.remove(tab.getComponent(0));
                    }
                    tabLength = tab.items.length;

                    if (tabLength > 0) {
                        var endItems = tab.getComponent(tabLength - 1);
                        endIndex = endItems.index;
                    }
                    if (index > endIndex) {
                        var type = data[i]["TYPE"];

                        if (type == -1) {
                            tab.add([{
                                index: index,
                                style: {
                                    color: "#f00000",
                                },
                                margin: "5 10 5 10",
                                border: 0,
                                html: "<pre style='color:#DE5246;''>调试已结束</pre>",
                                xtype: "panel"
                            }]);
                            that.scrollByTab(paramsMap.tabId);
                            that.initDebugBtn(paramsMap.debugId);
                            return;
                        }
                        var color = that.getTraceColor(data[i]["TYPE"]);
                        var msg = that.getTraceMsg(type, data[i]["MSG"]);
                        tab.add([{
                            margin: "5 10 5 10",
                            index: index,
                            style: {
                                'color': color,
                            },
                            border: 0,
                            html: "<pre style='color:" + color + ";''>" + "[" + data[i]["TIME"] + "]" + msg + "</pre>",
                            xtype: "panel",
                        }]);
                    }
                };
                that.scrollByTab(paramsMap.tabId);
                window.setTimeout(function() {
                    main.model.Debug.getTrace(paramsMap.params, paramsMap);
                }, 1000);
            },
            stopDebug: function(tabId, debugId) {
                var that = main.debugTab.Debug;
                var key = that.debugKey[tabId];
                var params = {
                    KEY: key
                }
                main.model.Debug.stopDebug(params, {
                    tabId: tabId,
                    params: params,
                    debugId: debugId
                });
            },
            stopDebugReturn: function(data, paramsMap) {
                var that = main.debugTab.Debug;
                var tab = Ext.getCmp(paramsMap.tabId);
                if (!tab) {
                    return;
                }
                if (tab.items) {
                    var len = tab.items.length;
                }
                tab.add([{
                    index: len,
                    style: {
                        color: "#FFCE43",
                    },
                    margin: "5 10 5 10",
                    border: 0,
                    html: "<pre style='color:#17A05D;'>调试已停止</pre>",
                    xtype: "panel"
                }]);
                that.scrollByTab(paramsMap.tabId);
            },
            initDebugTab: function(tabId) {
                var tab = Ext.getCmp(tabId);
                if (tab) {
                    tab.removeAll();
                }
            },

            initDebugBtn: function(debugId) {
                Ext.getCmp(debugId + "debug").enable();
                Ext.getCmp(debugId + "stopDebug").disable();
            },
            scrollByTab: function(tabId) {
                var tab = Ext.getCmp(tabId);
                if (tab) {
                    setTimeout(function() {
                        tab.scrollBy(10000, 10000, true);
                    }, 500);
                }
            },

            getTraceColor: function(type) {
                var color;
                if (type == 1) {
                    // 信息
                    color = "#1A59BB";
                } else if (type == 2) {
                    // 警告
                    color = "#FFCE43";
                } else if (type == 3) {
                    // 错误
                    color = "#DE5246";
                }
                return color;
            },
            getTraceMsg: function(type, dataMsg) {
                var msg;
                if (type == 1) {
                    msg = "信息：" + dataMsg;
                } else if (type == 2) {
                    msg = "警告：" + dataMsg;
                } else if (type == 3) {
                    msg = "错误：" + dataMsg;
                }
                return msg;
            }
        }
    }
    // 调试，运行容器，调度历史 结束--------------------------------------------------
};