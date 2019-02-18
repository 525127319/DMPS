const BaseService = require('../../services/BasicService');
const appConfig = require('../../models/AppConfigModel');
const LogUtil = require('../../utils/LogUtil');
const CommonUtil = require('../../utils/CommonUtil');
const TimeUtil = require('../../utils/TimeUtil');

let config = {
    CutterAutoReport:{
        center:[    //总仓报表    0
            {
                trigger:'08:00',        //触发时间
                start:'20:00',          //开始时间
                end:'08:00'        //结束时间
            },
            {
                trigger:'20:00',        //触发时间
                start:'08:00',          //开始时间
                end:'20:00'             //结束时间
            }
        ],
        branch:[ //分仓报表     1
            {
                trigger:'03:00',        //触发时间
                start:'09:00',          //开始时间
                end:'15:00'             //结束时间
            },
            {
                trigger:'09:00',        //触发时间
                start:'15:00',          //开始时间
                end:'21:00'             //结束时间
            },
            {
                trigger:'15:00',        //触发时间
                start:'21:00',          //开始时间
                end:'03:00'             //结束时间
            },
            {
                trigger:'21:00',        //触发时间
                start:'03:00',          //开始时间
                end:'09:00'             //结束时间
            }
        ],
        realTime:[  //实时报表    2
            {
                trigger:'02:30',        //触发时间
                start:'03:00',          //开始时间
                end:'09:00'             //结束时间
            },
            {
                trigger:'08:30',        //触发时间
                start:'09:00',          //开始时间
                end:'15:00'             //结束时间
            },
            {
                trigger:'14:30',        //触发时间
                start:'15:00',          //开始时间
                end:'21:00'             //结束时间
            },
            {
                trigger:'20:30',        //触发时间
                start:'21:00',          //开始时间
                end:'03:00'             //结束时间
            }
        ]
    },
    RestTime:[      //这段时间不换刀
        {
            start:'07:00',
            end:'08:30'
        },
        {
            start:'11:30',
            end:'13:30'
        },
        {
            start:'16:30',
            end:'17:30'
        },
        {
            start:'19:00',
            end:'20:30'
        },
        {
            start:'23:30',
            end:'01:30'
        },
        {
            start:'04:30',
            end:'05:30'
        },
    ],

    efficent:{
        datas:[
            {                    
                //OP待料时间
                name:'OPWait',
                stdTime:50,
                LowBias:-5,
                UpBias:5,
            },
            {                    
                //OP换料时间
                name:'OPReload',
                stdTime:60,
                LowBias:-5,
                UpBias:5,
            },
            {                    
                //技术员等待时间
                name:'ENGWait',
                stdTime:50,
                LowBias:-5,
                UpBias:5,
            },
            {                    
                //技术员系统报警处理
                name:'ENGsys',
                stdTime:300,
                LowBias:-15,
                UpBias:15,
            },
            {
                //换刀处理
                name:'ENGChgTool',
                stdTime:300,
                LowBias:-15,
                UpBias:15,
            },
            {
                //首件报警处理
                name:'ENG1stPiece',
                stdTime:300,
                LowBias:-15,
                UpBias:15,
            }
        ]
    }
};

class AppConfigService extends BaseService {
    constructor() {
        super(appConfig);
        this.cache = {};
    }

    async initSet(){
        try {
            let obj = {};

            obj.version = 'V0.0.3';
            obj.config = config;
            await this.create(obj);
        } catch (error) {
            console.log(error);
        }
    }

    async init(){
        try {
            let val = await this.findOne({}, {'version':-1});
            this.cache = val.config;
        } catch (error) {
            console.log(error);
        }

        return this.cache;
    }

    /*
    获取刀具定时任务相关数据
    */
    async getCutterAutoReportConfig(type){
        let r = null;

        try {
            switch(type){
                case '0':
                    r = config.CutterAutoReport['center'];
                    break;
                case '1':
                    r = config.CutterAutoReport['branch'];
                    break;
                case '2':
                    r = config.CutterAutoReport['realTime'];
                    break;
            }
        } catch (error) {
            LogUtil.logErrorWithoutCxt(error);
            throw error;
        }

        return r;
    }

    /*
    休息时间，这个时间不换刀
    */
    async getRestTimeConfig(){
        let r = null;

        try {
            r = config.RestTime;
        } catch (error) {
            LogUtil.logErrorWithoutCxt(error);
            throw error;
        }

        return r;
    }
    /*
    获取工作效能配置
    */
    async getEfficientConfig(){
        let r = null;

        try {
            r = config.efficent.datas;
        } catch (error) {
            LogUtil.logErrorWithoutCxt(error);
            throw error;
        }

        return r;
    }
    
}


let service = new AppConfigService();
//let s = service.export('root');
module.exports = service;
