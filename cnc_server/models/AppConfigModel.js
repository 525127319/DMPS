let appConfig = {
    version:{ type: String },
    update:{type:Date, default: new Date()},
    config:{
        CutterAutoReport:{
            center:[    //总仓报表    0
                {
                    trigger:{ type: String },        //触发时间
                    start:{ type: String },          //开始时间
                    end:{ type: String }             //结束时间
                }
            ],
            branch:[ //分仓报表     1
                {
                    trigger:{ type: String },        //触发时间
                    start:{ type: String },          //开始时间
                    end:{ type: String }             //结束时间
                }
            ],
            realTime:[  //实时报表    2
                {
                    trigger:{ type: String },        //触发时间
                    start:{ type: String },          //开始时间
                    end:{ type: String }             //结束时间
                }
            ]
        },
        RestTime:[
            {
                start:{ type: String },
                end:{ type: String }
            }
        ],
        block:{
            efficent:{
                reloadTime:{type: Number},
                reloadLowBias:{type: Number},
                reloadUpBias:{type: Number},

                idleTime:{type: Number},
                idleLowBias:{type: Number},
                idleUpBias:{type: Number},
            }
        }
    }
  }
  appConfig.getTableName = ()=>{
    return 'app_config';
  }
  module.exports = appConfig;
  