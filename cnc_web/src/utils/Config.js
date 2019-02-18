const websocketConfig = {
    // ip: '192.168.14.80',
    ip: '127.0.0.1',
    port: '9111',
    // ip: '127.0.0.1',
    // port: '8000',
    retryTimes: 20
}

let websocketStatus = {
    open: 'open',
    close: 'close'
}

//空闲：1，运行：2，报警：4，关闭：8
const status = {
    // Idle: '空閑',
    // Runnin: "運行",
    // Stop: '停止',
    // Pause: '暂停',
    // Debug: '调试',
    // Alarm: '報警',
    // Close: '未聯接',
    // WaitingMaterial: '待料',
    // UpAndDownMaterial: '上下料',
    // ToolChangerAlarm: '换刀报警',
    // FirstPieceAlarm: '首件报警',
    '1': '空闲',
    '2': '运行中',
    '4': '报警',
    '7': '调机中',
    '8': '离线',
    '10': '中间件程序异常',
    '11': '待料',
    '12': '上下料',
    '41': '换刀报警',
    '42': '首件报警',
    IdleV: 1,
    RunningV: 2,
    AlarmV: 4,
    DebugV: 7,
    UnConnectedV: 8,
    UnknownV: 10,
    WaitingMaterialV: 11,
    UpAndDownMaterialV: 12,
    ToolChangerAlarmV: 41,
    FirstPieceAlarmV: 42,
    //IdelC: '#efc608', //origin
    //IdelC: '#ffe900',    
    //StopC: '#ebf650',
    //PauseC: '#e3d658',
    //DebugC: '#EEB422',
    IdelC: '#efc608', // Yellow
    DebugC: '#0000FF', // Blue
    RunningC: '#2cc760', // Green
    AlarmC: '#ea0c32', // Red
    UnConnecteedC: '#7c7c7c', // Gray
    UnknownC: '#7c7c7c', // Gray
    WaitingMaterialC: '#efc608', // Yellow
    UpAndDownMaterialC: '#FFA500', // Orange
    ToolChangerAlarmC: '#FFC0CB', // Pink
    FirstPieceAlarmC: '#FF33CC', // rose粉红色
}

const msgType = {
    unregisterStatus: 'unregisterStatus',//取消监听机台状态
    registerStatus: 'registerStatus',//获取机台状态
    statusData: 'statusData',//状态监听
    unregisterOutput: 'unregisterOutput',//取消监听机台产量数量
    registerOutput: 'registerOutput',//获取产量数量
    outputData: 'outputData',//产量数据监听
    unregisterSpindleLoad: 'unregisterSpindleLoad',//取沙监听机台主轴负载
    registerSpindleLoad: 'registerSpindleLoad',//主轴负轴
    spindleLoadData: 'spindleLoadData',//主轴负轴监听
    unregisterCircleTime: 'unregisterCircleTime', // 取消单个产品生产周期监控
    registerCircleTime: 'registerCircleTime', // 注册单个产品生产周期监控
    circleTimeData: 'circleTimeData', // 单个产品生产周期监控
    createDevice: 'createDevice', // 新增一个设备对象
    deleteDevice: 'deleteDevice', // 删除一个设备对象
    readRunningTime: 'readRunningTime', // 读总开机时长
    uploadFile: 'uploadFile', // 读总开机时长
    OPEN: 'OPEN', // 监控server端websocket状态
    CLOSE: 'CLOSE',
}

const evn = {
    dubuger: true,//是否输出日志
    reRender: 5000//多少次更新下界面
}

export {websocketConfig, websocketStatus, status, msgType, evn};
