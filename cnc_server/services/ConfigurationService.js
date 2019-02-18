const fetch = require('isomorphic-fetch')
const LogUtil = require('../utils/LogUtil');
const SIDECAR = {
    uri: 'http://localhost:8741'
}

const CONFIG_SERVER = 'core-config'

class ConfigurationService{
    getConfig(configName){
        return fetch(`${SIDECAR.uri}/${CONFIG_SERVER}/${configName}.json`)
            .then((resp)=>{
                LogUtil.debug(`${configName}`+' : '+resp.json());
                return resp.json();
            });
    }
}


module.exports = new ConfigurationService();