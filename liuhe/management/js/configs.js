//基础参数
var configs = {
    consoleMaxLenght: 100,
    TOOLS: {
        ADD: "保存",
        // update: "保存",
        REFRESH: "刷新"
    },
    MODEL_DATA: {
        UUID: "_UUID",
        ENV: "_ENV",
        CLASS: "CLASS",
    },
    MODEL: {
        _PDN: "_PDN",
        _NAME: "_NAME",
        _LABEL: "_LABEL",
        _DESC: "_DESC",
        _ATTRS_SEQ: "_ATTRS_SEQ",
        FULL_CLASS: "FULL_CLASS"
    },
    ATTR_LIST: {
        _NAME: "_NAME",
        _LABEL: "_LABEL",
        _TYPE: "_TYPE",
        _NULLABLE: "_NULLABLE",
        _DEFAULT_VALUE: "_DEFAULT_VALUE",
        _MIN_VALUE: "_MIN_VALUE",
        _MAX_VALUE: "_MAX_VALUE",
        _EXTENSION: "_EXTENSION"
    },
    MODEL_TEXT: {
        _PDN: "包的RDN",
        _NAME: "名称",
        _LABEL: "标签",
        _DESC: "描述",
        _ATTRS_SEQ: "属性名列表",
        FULL_CLASS: "路径"
    },
    ATTR_LIST_TEXT: {
        _NAME: "名称",
        _LABEL: "标签",
        _TYPE: "类型",
        _NULLABLE: "能否为Null",
        _DEFAULT_VALUE: "默认值",
        _MIN_VALUE: "最小值",
        _MAX_VALUE: "最大值",
        _EXTENSION: "类型扩展名"
    },
    WIN_TITLE: {
        ADD_PACKAGE: "添加包",
        SET_SLAVE: "设置运行容器",
        RESET_SCHNODES: "重置节点运行状态",
        SET_SCH_PRIORITY: "设置节点优先级",
        SET_SCHQUEUE: "设置节点所在队列",
        SET_SCHTIME: "设置节点调度时间",
        SET_NODESUSPEND: "设置节点是否挂起",
        UPDATE_PACKAGE: "修改包",
        EDIT_FIELD: "编辑域"
    },
    WIN_NAME: {
        EDIT_FIELD_WIN: "EDIT_FIELD_WIN",
        ADD_PACKAGE_WIN: "ADD_PACKAGE_WIN",
        SET_SLAVE_WIN: "SET_SLAVE_WIN",
        RESET_SCHNODES_WIN: "RESET_SCHNODES_WIN",
        SET_SCH_PRIORITY_WIN: "SET_SCH_PRIORITY_WIN",
        SET_SCHQUEUE_WIN: "SET_SCHQUEUE_WIN",
        SET_SCHTIME_WIN: "SET_SCHTIME_WIN",
        SET_NODESUSPEND_WIN: "SET_NODESUSPEND_WIN",
        UPDATE_PACKAGE_WIN: "UPDATE_PACKAGE_WIN"
    },
    GRID_NAME: {
        SCH_TESTS_TIMES_GRID: "SCH_TESTS_TIMES_GRID"
    },
    FORM_NAME: {
        ADD_PACKAGE_FORM: "ADD_PACKAGE_FORM",
        SET_SLAVE_FORM: "SET_SLAVE_FORM",
        RESET_SCHNODES_FORM: "RESET_SCHNODES_FORM",
        SET_SCH_PRIORITY_FORM: "SET_SCH_PRIORITY_FORM",
        SET_SCHQUEUE_FORM: "SET_SCHQUEUE_FORM",
        SET_SCHTIME_FORM: "SET_SCHTIME_FORM",
        SET_NODESUSPEND_FORM: "SET_NODESUSPEND_FORM",
        UPDATE_PACKAGE_FORM: "UPDATE_PACKAGE_FORM",
        EDIT_FIELD_FORM: "EDIT_FIELD_FORM"
    },
    STORE_NAME: {
        SLAVE_STORE: "SLAVE_STORE",
        SET_SLAVE_STORE: "SET_SLAVE_STORE",
        SET_SCHQUEUE_STORE: "SET_SCHQUEUE_STORE",
        SET_SCHTIME_STORE: "SET_SCHTIME_STORE",
        SCH_TESTS_TIMES_STORE: "SCH_TESTS_TIMES_STORE",
        ATTR_TYPE_STORE: "ATTR_TYPE_STORE",
        ModelDataToEnv: "ModelDataToEnv"
    },
    BUTTON_TEXT: {
        OK: "确定",
        UNDO: "取消"
    },
    setIntervalTime: 2000,
    baseConfigs: {
        WIDTH: document.documentElement.clientWidth,
        HEIGHT: document.documentElement.clientHeight,
        WIN_TITLE: "后台管理",
        TREE_WIDTH: 200,
        TREE_HEIGHT: 500
    },
    TOP_TOOL: {
        FILE: "文件",
        EDIT: "编辑"
    },
    TREE_ROOT: {
        Package: 0,
        ENV: 1,
        Schedule: 2
    },
    TREE_TEXT: {
        Package: "目录",
        ENV: "环境",
        Schedule: "调度"
    },
    TREE_CLASS: {
        ENV: "Env",
        Schedule: "Schedule",
        SchQueue: "SchQueue",
        Package: "Package",
        Model: "Model",
        ADD_MODEL: "ADD_MODEL",
        UPDATE_MODEL: "UPDATE_MODEL",
        ADD_MODEL_DATA: "ADD_MODEL_DATA",
        DOMAIN: "Domain"
    },

    PACKAGE_TREE: {
        _NAME: "_NAME",
        _LABEL: "_LABEL",
        _PDN: "_PDN",
        CLASS: "CLASS",

    },
    PACKAGE_TEXT: {
        _NAME: "名称",
        _LABEL: "标签",
        _PDN: "所在包",
    },
    MENE_TEXT: {
        OPEN_SCH_GRAPH: "关系图",
        SET_SLAVE: "运行容器",
        RESET_SCHNODES: "重置",
        TERNIBATE_SCHNODES: "终止",
        SET_SCH_PRIORITY: "优先级",
        SET_SCHQUEUE: "队列",
        SET_SCHTIME: "调度时间",
        SET_NODESUSPEND: "挂起"
    },
    RIGHT_CLICK_MENU: {
        ADD_PACKAGE: "新增包",
        ADD_MODEL: "新增模型",
        ADD: "新增",
        ADDQueue: "新增队列",
        EDIT: "修改",
        DELETE: "删除",
        REFRESH: "刷新",
        RUNNING: "启动",
        STOP: "停止",
        CHECK: "打开",
        OPEN_TRACE: "打开调试信息",
        OPEN_ERR_MSG: "打开错误信息",
        OPEN_SCH_GRAPH: "打开关系图",
        IMPROT: "导入",
        EXPROT: "导出",
        ADD_FIELD: "新建域",
        UPDATE_FIELD: "修改域"
    },
    ENV_NAME: {
        NAME: "名字",
        TYPE: "类型",
        VALUE: "值",
        DESC: "描述",
        _RT_VALUE: "运行时",
    },
    SCHEDULE_NODE_TEXT: {
        NAME: "名称",
        _SCH_TIME: "调度时间",
        _CONTAINER: "运行容器",
        _PRIORITY: "优先级",
        _SUSPEND: "是否挂起",
        _STATUS: "状态",
    },

    url: {
        // debuging
        view_debugFunc: "view_debugFunc",
        view_getTrace: "view_getTrace",
        view_terminateDebug: "view_terminateDebug",
        // tree
        view_listEnv: "view_listEnv",
        view_listDpc: "view_listSchedule",
        view_addEnv: "view_addEnv",
        view_addDpc: "view_addSchedule",
        view_updateEnv: "view_updateEnv",
        view_updateDpc: "view_updateSchedule",
        view_removeEnv: "view_removeEnv",
        view_removeDpc: "view_removeSchedule",
        view_getChildrenOfPackage: "view_getChildrenOfPackage",
        view_getPackage: "view_getPackage",
        view_addPackage: "view_addPackage",
        view_updatePackage: "view_updatePackage",
        view_removePackage: "view_removePackage",


        // domain
        view_addDomain: "view_addDomain",
        view_listDomain: "view_listDomain",
        view_updateDomain: "view_updateDomain",
        view_removeDomain: "view_removeDomain",
        view_getDomain: "view_getDomain",
        // Model
        view_listAttrType: "view_listAttrType",
        view_addModel: "view_addModel",
        view_updateModel: "view_updateModel",
        view_getModel: "view_getModel",
        view_removeModel: "view_removeModel",
        view_listMetaData: "view_listMetaData",
        view_addSchNodes: "view_addSchNodes",
        view_debugJob: "view_debugJob",
        // Model_Data
        view_addMetaData: "view_addMetaData",
        view_updateMetaData: "view_updateMetaData",
        view_removeMetaData: "view_removeMetaData",
        view_getMetaData: "view_getMetaData",
        // env
        view_listEnvVar: "view_listEnvVar",
        view_getEnvVar: "view_getEnvVar",
        view_addEnvVar: "view_addEnvVar",
        view_updateEnvVar: "view_updateEnvVar",
        view_getEnvVarTypes: "view_getEnvVarTypes",
        view_removeEnvVar: "view_removeEnvVar",

        // schedule
        view_getSchedule: "view_getSchedule",
        view_listSchedule: "view_listSchedule",
        view_addSchedule: "view_addSchedule",
        view_removeSchedule: "view_removeSchedule",
        view_listSchQueue: "view_listSchQueue",
        view_addSchQueue: "view_addSchQueue",
        view_removeSchQueue: "view_removeSchQueue",
        view_startupSchedule: "view_startupSchedule",
        view_shutdownSchedule: "view_shutdownSchedule",
        view_getSchQueue: "view_getSchQueue",
        view_updateSchQueue: "view_updateSchQueue",
        view_getSchNodes: "view_getSchNodes",
        view_listHistoryOfNode: "view_listHistoryOfNode",
        view_getSchNodeHistoryTrace: "view_getSchNodeHistoryTrace",
        view_getSchNodeHistoryErrMsg: "view_getSchNodeHistoryErrMsg",

        // Slave
        view_listSlaveNode: "view_listSlaveNode",
        view_addSlaveNode: "view_addSlaveNode",
        view_updateSlaveNode: "view_updateSlaveNode",
        view_removeSlaveNode: "view_removeSlaveNode",
        view_getSlaveNode: "view_getSlaveNode",


        // slaveNode
        view_setSchContainer: "view_setSchContainer",

        // SchGraph
        view_getSchGraph: "view_getSchGraph",
        view_resetSchNodes: "view_resetSchNodes",
        view_terminateSchNodes: "view_terminateSchNodes",
        view_setSchPriority: "view_setSchPriority",
        view_setSchQueue: "view_setSchQueue",
        view_setSchTime: "view_setSchTime",
        view_getSchTimes: "view_getSchTimes",
        view_getSchTestTimes: "view_getSchTestTimes",
        view_setNodeSuspend: "view_setNodeSuspend",
    },
    SchQueue: {
        RDN: "RDN",
        _NAME: "_NAME",
    },
    ScheduleNode: {
        NAME: "NAME",
        _SCH_TIME: "_SCH_TIME",
        _CONTAINER: "CONTAINER_NAME",
        _PRIORITY: "_PRIORITY",
        _SUSPEND: "_SUSPEND",
        _STATUS: "_STATUS"
    },
    HistoryOfNode: {
        _SCH_TIME: "_SCH_TIME",
        _STATUS: "_STATUS",
        _START_TIME: "_START_TIME",
        _END_TIME: "_END_TIME",
        _TRACE: "_TRACE",
        _ERR_MSG: "_ERR_MSG"
    },
    HistoryOfNode_TEXT: {
        _SCH_TIME: "调度时间",
        _STATUS: "运行状态",
        _START_TIME: "开始时间",
        _END_TIME: "结束时间",
        _TRACE: "调试信息",
        _ERR_MSG: "错误信息"
    },

    ScheduleNode_SUSPEND: {
        HANG: "挂起",
        NON_HANG: "非挂起",
    },
    ScheduleNode_STATUS: {
        0: "成功",
        1: "出错",
        100: "等待运行",
        101: "排队中",
        102: "运行中",
        103: "已终止"
    },
    ScheduleNode_STATUS_COLOR: {
        0: "#43CD80",
        1: "#EE4000",
        100: "#5CACEE",
        101: "#EEEE00",
        102: "#43CDBA",
        103: "#FFC125"
    },
    Slave: {
        RDN: "RDN",
        _NAME: "_NAME",
        _LABEL: "_LABEL",
        _HOST: "_HOST",
        _PORT: "_PORT",
        _STATUS: "_STATUS",
        _ID: "_ID"
    },
    Slave_TEXT: {
        _NAME: "名称",
        _LABEL: "标签",
        _HOST: "主机",
        _PORT: "端口",
        _STATUS: "状态"
    },
    Slave_STATUS: ["已连接", "已断开"],
    Slave_STATUS_COLOR: ["#43CD80", "#EE4000"],
    NO_NULL: "不能为空",
};