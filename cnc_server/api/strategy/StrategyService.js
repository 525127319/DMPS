const BasicService = require('../../services/BasicService');
const strategyModel = require('../../models/StrategyModel');
const IListenr = require('../../utils/LogUtil');
const logUtil = require('../../utils/LogUtil');
class StrategyService extends BasicService {
    constructor(){
        super(strategyModel);
    }
}

module.exports = new StrategyService();