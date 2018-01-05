var main = main || {};
// model
main.model = {
    Tree: {
        getListEnv: function(params,node) {
            tools.getData(configs.url.view_listEnv, params, main.Tree.setListEnv,node);
        },
        addTreeNodeByEnv: function(nodeName,_PDN) {
            tools.getData(configs.url.view_addEnv, {
                    _NAME: nodeName,
                    _PDN: _PDN
                },
                main.Tree.addTreeNodeReturn);
        },
        updateTreeNodeByEnv: function(params) {
            tools.getData(configs.url.view_updateEnv, params,
                main.Tree.updateTreeNodeReturn);
        },
        deleteTreeNodeByEnv: function(RDN) {
            tools.getData(configs.url.view_removeEnv, {
                    RDN: RDN
                },
                main.Tree.deleteTreeNodeReturn);
        },
        getChildrenOfPackage: function(params, node) {
            tools.getData(configs.url.view_getChildrenOfPackage, params,
                main.Tree.setChildrenOfPackage, node);
        },
        addPackage: function(params) {
            tools.getData(configs.url.view_addPackage, params,
                main.Tree.addPackageReturn);
        },
        getPackage: function(params) {
            tools.getData(configs.url.view_getPackage, params,
                main.Tree.setPackage);
        },
        updatePackage: function(params) {
            tools.getData(configs.url.view_updatePackage, params,
                main.Tree.updatePackageReturn);
        },
        deletePackage: function(params) {
            tools.getData(configs.url.view_removePackage, params,
                main.Tree.deletePackageReturn);
        },
        // 获取域信息
        getFieldForm: function(params) {
            tools.getData(configs.url.view_getDomain, params, main.Tree.setEditFieldForm);
        },
        // 添加域
        addField: function(params) {
            tools.getData(configs.url.view_addDomain, params, main.Tree.addFieldReturn);
        },
        updateField: function(params) {
            tools.getData(configs.url.view_updateDomain, params, main.Tree.updateFieldReturn);
        },
        getFieldList: function() {
            tools.getData(configs.url.view_listDomain, null, main.Tree.setFieldList);
        },
        removerField: function(params) {
            tools.getData(configs.url.view_removeDomain, params, main.Tree.removerFieldReturn);
        },
        getChildrenOfDomain: function(params,node) {
            tools.getData(configs.url.view_getChildrenOfPackage, params,
                main.Tree.setChildrenOfDomain, node);
        },
        Model: {
            getListAttrType: function() {
                tools.getData(configs.url.view_listAttrType, null,
                    main.Tree.Model.setListAttrType);
            },
            addModel: function(params) {
                tools.getData(configs.url.view_addModel, params,
                    main.Tree.Model.addModelReturn);
            },
            updateModel: function(params) {
                tools.getData(configs.url.view_updateModel, params,
                    main.Tree.Model.updateModelReturn);
            },
            getModel: function(params) {
                tools.getData(configs.url.view_getModel, params,
                    main.Tree.Model.setModel);
            },
            getJob: function(params) {
                tools.getData(configs.url.view_getModel, params,
                    main.Tree.Model.setJob);
            },
            addSchduleToJob: function(params) {
                tools.getData(configs.url.view_addSchNodes, params,
                    main.Tree.Model.addSchduleToJobReturn);
            },
            // 获取有效的调度时间
            getSCH_TIME_USER: function(params) {
                tools.getData(configs.url.view_getSchTimes, params,
                    main.Tree.Model.setSCH_TIME_USER);
            },
            getScheduleList: function(params) {
                tools.getData(configs.url.view_listSchedule, params,
                    main.Tree.Model.setScheduleList);
            },
            removeModel: function(params) {
                tools.getData(configs.url.view_removeModel, params,
                    main.Tree.removeModelReturn, params);
            },
            getlistMetaData: function(params) {
                tools.getData(configs.url.view_listMetaData, params,
                    main.Tree.Model.setModelDataList);
            },
            addMetaData: function(params) {
                tools.getData(configs.url.view_addMetaData, params,
                    main.Tree.Model.addModelDataReturn);
            },
            updateModeData: function(params) {
                tools.getData(configs.url.view_updateMetaData, params,
                    main.Tree.Model.updateModelDataReturn);
            },
            getModelData: function(params) {
                tools.getData(configs.url.view_getMetaData, params,
                    main.Tree.Model.setModelData);
            },
            removeModelData: function(params) {
                tools.getData(configs.url.view_removeMetaData, params,
                    main.Tree.Model.removeModelDataReturn);
            },
            getModelToAddModelForm: function(params, edi) {
                tools.getData(configs.url.view_getModel, params,
                    main.Tree.Model.setModelToAddModelForm, edi);
            },
            debugToJob: function(params, panelId) {
                tools.getData(configs.url.view_debugJob, params,
                    main.Tree.Model.debugToJobReturn, panelId);
            }
        }
    },
    Dimension: {
        type: [],
        createType: function(data) {
            main.model.Dimension.type = data;
        },
        getType: function() {
            tools.getData(configs.url.view_getEnvVarTypes, null, main.model.Dimension.createType);
        }
    },
    Env: {
        getEnvList: function(RDN, edi) {
            tools.getData(configs.url.view_listEnvVar, {
                RDN: RDN
            }, main.view.Env.setEnvList, edi);
        },
        getModelDataToEnv: function(params) {
            tools.getData(configs.url.view_listEnv, params, main.Tree.Model.setModelDataToEnv);
        },
        refreshEnvList: function(RDN, store) {
            tools.getData(configs.url.view_listEnvVar, {
                RDN: RDN
            }, main.Env.refreshEnvListReture, store);
        },
        getEnv: function(RDN, form) {
            tools.getData(configs.url.view_getEnvVar, {
                RDN: RDN
            }, main.Env.setUpdateEnvContent, form);
        },
        addEnv: function(RDN, _TYPE, _NAME, _DESC, _VALUE, _RT_VALUE) {
            var params = {
                _PDN: RDN,
                _NAME: _NAME,
                _DESC: _DESC,
                _TYPE: _TYPE,
                _VALUE: _VALUE,
                _RT_VALUE: _RT_VALUE,
            };
            tools.getData(configs.url.view_addEnvVar, params, main.Env.updateEnvReture);
        },
        getSlaveStore: function() {
            tools.getData(configs.url.view_listSlaveNode, null, main.setSlaveStroe);
        },
        updateEnv: function(_ID, _TYPE, _NAME, _DESC, _VALUE, _RT_VALUE) {
            var params = {
                _ID: _ID,
                _NAME: _NAME,
                _DESC: _DESC,
                _TYPE: _TYPE,
                _VALUE: _VALUE,
                _RT_VALUE: _RT_VALUE
            };
            tools.getData(configs.url.view_updateEnvVar, params, main.Env.updateEnvReture);
        },
        deleteEnv: function(RDN, line) {
            tools.getData(configs.url.view_removeEnvVar, {
                RDN: RDN
            }, main.Env.deleteEnvReturn, line);
        },
        debugingKEY: function(params, tabId) {
            tools.getData(configs.url.view_debugFunc, params, main.Env.debugingReturn, tabId);
        },

    },
    Schedule: {
        getSchedule: function(params, node) {
            tools.getData(configs.url.view_getSchedule, params, main.Schedule.setSchedule, node);
        },
        getScheduleList: function(params) {
            tools.getData(configs.url.view_listSchedule, params, main.Schedule.setStoreData);
        },
        addSchedule: function(params) {
            tools.getData(configs.url.view_addSchedule, params, main.Schedule.addScheduleReturn);
        },
        deleteSchedule: function(params) {
            tools.getData(configs.url.view_removeSchedule, params, main.Schedule.deleteScheduleReturn);
        },
        getScheduleQueueList: function(params, node) {
            tools.getData(configs.url.view_listSchQueue, params, main.Schedule.setScheduleQueueList, node);
        },
        addSchQueue: function(params) {
            tools.getData(configs.url.view_addSchQueue, params, main.Schedule.addSchQueueReturn);
        },
        deleteSchQueue: function(params) {
            tools.getData(configs.url.view_removeSchQueue, params, main.Schedule.deleteScheduleReturn);
        },
        startupSchedule: function(params, node) {
            tools.getData(configs.url.view_startupSchedule, params, main.Schedule.startupScheduleReturn, node);
        },
        shutdownSchedule: function(params, node) {
            tools.getData(configs.url.view_shutdownSchedule, params, main.Schedule.shutdownScheduleReturn, node);
        },
        updateSchQueue: function(params) {
            tools.getData(configs.url.view_updateSchQueue, params, main.Schedule.updateSchQueueReuturn);
        },
        getSchQueue: function(params) {
            tools.getData(configs.url.view_getSchQueue, params, main.Schedule.setSchQueue);
        },
        getScheduleNode: function(params) {
            tools.getData(configs.url.view_getSchNodes, params, main.Schedule.setScheduleNode)
        },
        getHistoryOfNodeList: function(params) {
            tools.getData(configs.url.view_listHistoryOfNode, params, main.debugTab.setHistoryOfNodeList)
        },
        getSchNodeHistoryTrace: function(params) {
            tools.getData(configs.url.view_getSchNodeHistoryTrace, params, main.debugTab.setSchNodeHistoryTrace, params);
        },
        getSchNodeHistoryErrMsg: function(params) {
            tools.getData(configs.url.view_getSchNodeHistoryErrMsg, params, main.debugTab.setSchNodeHistoryErrMsg)
        },
        getSchGraph: function(params) {
            tools.getData(configs.url.view_getSchGraph, params, main.Schedule.SchGraph.setSchGraph);
        },
        getSetSlaveList: function() {
            tools.getData(configs.url.view_listSlaveNode, null, main.Schedule.ScheduleNode.setSetSlaveList);
        },
        setSchContainer: function(params) {
            tools.getData(configs.url.view_setSchContainer, params, main.Schedule.ScheduleNode.setSlaveReturn);
        },
        resetSchNodes: function(params) {
            tools.getData(configs.url.view_resetSchNodes, params, main.Schedule.ScheduleNode.resetSchNodesReturn);
        },
        terminateSchNodes: function(params) {
            tools.getData(configs.url.view_terminateSchNodes, params, main.Schedule.ScheduleNode.terminateSchNodesReturn);
        },
        setSchPriority: function(params) {
            tools.getData(configs.url.view_setSchPriority, params, main.Schedule.ScheduleNode.setSchPriorityReturn);
        },
        getSetSchQueueList: function(params) {
            tools.getData(configs.url.view_listSchQueue, params, main.Schedule.ScheduleNode.setSetSchQueueList);
        },
        setSchQueue: function(params) {
            tools.getData(configs.url.view_setSchQueue, params, main.Schedule.ScheduleNode.setSchQueueReturn);
        },
        setSchTime: function(params) {
            tools.getData(configs.url.view_setSchTime, params, main.Schedule.ScheduleNode.setSchTimeReturn);
        },
        getSchTimes: function(params) {
            tools.getData(configs.url.view_getSchTimes, params, main.Schedule.ScheduleNode.getSchTimesReturn);
        },
        setNodeSuspend: function(params) {
            tools.getData(configs.url.view_setNodeSuspend, params, main.Schedule.ScheduleNode.setNodeSuspendReturn);
        },
        getSchTestTimes: function(params, time) {
            tools.getData(configs.url.view_getSchTestTimes, params, main.Schedule.getSchTestTimesReturn, time);
        }
    },
    Slave: {
        getSlaveList: function() {
            tools.getData(configs.url.view_listSlaveNode, null, main.debugTab.Slave.setSlaveList);
        },
        addSlave: function(params) {
            tools.getData(configs.url.view_addSlaveNode, params, main.debugTab.Slave.addSlaveReturn);
        },
        getSlaveNode: function(params) {
            tools.getData(configs.url.view_getSlaveNode, params, main.debugTab.Slave.setSalveNode);
        },
        updateSlave: function(params) {
            tools.getData(configs.url.view_updateSlaveNode, params, main.debugTab.Slave.updateSalveReturn)
        },
        deleteSlaveNode: function(params) {
            tools.getData(configs.url.view_removeSlaveNode, params, main.debugTab.Slave.deleteSlaveNodeReturn)
        },
    },
    Debug: {
        getTrace: function(params, paramsMap) {
            tools.getData(configs.url.view_getTrace, params, main.debugTab.Debug.getTraceReturn, paramsMap);
        },
        stopDebug: function(params, tabId) {
            tools.getData(configs.url.view_terminateDebug, params, main.debugTab.Debug.stopDebugReturn, tabId);
        },
    }
};