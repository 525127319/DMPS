let strategy = {
    company: {type: String}, // 工厂名称
    devType: {type: String}, // 设备类型
    maintenanceName: {type: String}, // 保养名称
    workingTime: {type:Number}, // 工作时保养时长(小时)
    freeTime: {type:Number}, // 空闲时保养时长(小时)
    part: {type: String}, // 零件
    note: {type: String}, // 备注
    enable: {type: String}, // 开启与否

}
strategy.getTableName = ()=>{
    return 'strategy';
}
module.exports = strategy;