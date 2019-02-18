import CComponent from "@/components/Common/CComponent";
import ReloadState from './ReloadState';
import WaitState from './WaitState';
import TimeUtil from "@/utils/TimeUtil";
import CDetailHeader from './CDetailHeader';
import AppConfigUtil from '@/utils/AppConfigUtil';


import { start } from "pretty-error";
export default class Chart extends CComponent {
    
    constructor(props){
        super(props);
        this.state={
            res: props.res,
            record: props.record,
            type:4,
            wait:{},
            reload:{},
            datasource: [],
            conflict:[],
            load: {},
            idle: {},
            isFirstTime: true,
            show:false,   //暂无
        }
    }

    /**
     * 获标准参数
     *  */
    componentWillMount(){
        let _this = this;
        let promise = AppConfigUtil.getToolConfigByType(this.state.type);
        promise.then(configs => {
            let wait,reload; 
            configs.forEach(item => {
                if(item.name =='OPWait'){
                     wait = Object.assign({},item);
                }else if(item.name  == 'OPReload'){
                     reload = Object.assign({},item);
                }
               
            });
            _this.setState({
                wait: wait,
                reload:reload
            });
          
        })
       
    }

    //参数改变时候
    willReceiveProps(newProps, oldProps){
       // console.log(newProps,'1')
       // console.log(oldProps,'2')
        let res = newProps.res;//查询结果
        let record = newProps.record//统计数据;
        this.update(res, record);
        this.setState({
            isFirstTime: true
        });
    }


    /**
     * 
     * @param {*} res block详情
     * @param {*} record block统计信息
     */
    update(res, record){
        if (!res||res.length <= 0){
            this.setState({
                show:true,   //暂无
            })
            return;
        }
        let rs = res;
        if (!rs)return;
        let detail = rs;
        // let max = TimeUtil.geCurUnixTime();
        // let min = TimeUtil.subtractHour(max, 2);
        let array = [], x = [], y = [], times = null, tmp = null/** 上下料时间 */;
        let waitArray = [], waitX = [], waitY = []/** opwaitduration-真正使用时间 */, waitY2 = []/** realwaitduration-实际待待时间 */,waitTmp = null/** 待机时间 */;
        let conflict = [];

        if (detail && detail.length > 0) {
            detail.sort((d1, d2)=>{
                return d1.frunendtime - d2.frunendtime;
            });
            let element = null, index2 = 0;
            detail.forEach(item=>{
                tmp = {details: [], has: false, devId: item.dev_id};//mouse放到点上显视的值
                waitTmp = {details: [], has: false, devId: item.dev_id};////mouse放到点上显视的值
               // waitY.push(item.opwaitduration);//待机的下面那个点
               // waitY2.push(item.realwaitduration);//待机的上面那个点
                //y.push(item.uploadduration);//上下料花的时间（包括冲突时间）
                if (item.isconflict){
                    conflict.push(item.realwaitduration - item.opwaitduration);
                } else {
                    conflict.push(0);
                }

                times = item.times;
                if (times){//如果一个times里有2次上下料，只抓第一次的时间
                    times.sort((t1, t2)=>{
                        return t1.stime - t2.stime;
                    });

                    for (let index = 0; index < times.length; index++) {
                        const element = times[index];
                        if (element.status == 12 && !tmp.has){//上下料
                           // x.push(TimeUtil.format(element.stime, TimeUtil.format5));//放入第一个上班料时间， 上下料x轴
                            //y.push([TimeUtil.format(element.stime, TimeUtil.format5), item.uploadduration]);//上下料花的时间（包括冲突时间）
                           //y.push(item.uploadduration);
                           y.push([element.stime * 1000, item.uploadduration]);
                            tmp.has = true;
                            console.log('index2', ++index2);
                        }
                        if (element.status == 11 && !tmp.has){//待机
                            waitY.push([element.stime* 1000, item.opwaitduration]);//待机的下面那个点
                            waitY2.push([element.stime* 1000, item.realwaitduration]);//待机的上面那个点
                            //waitX.push(TimeUtil.format(element.stime, TimeUtil.format5));//放入第一个待机时间, 待机x轴
                            waitTmp.has = true;
                        } 
                        if (element.status == 12){//上下料
                            tmp.details.push({s: TimeUtil.format(element.stime, TimeUtil.format6), stime: element.stime, 
                                e: TimeUtil.format(element.etime, TimeUtil.format6), etime: element.etime, uploadduration: item.uploadduration});//当focus在这点上，显视内容
                        }
                        if (element.status == 11){//待机
                            waitTmp.details.push({s: TimeUtil.format(element.stime, TimeUtil.format6), 
                                stime: element.stime, 
                                e: TimeUtil.format(element.etime, TimeUtil.format6), 
                                etime: element.etime, 
                                realwaitduration: item.realwaitduration, opwaitduration: item.opwaitduration, 
                                conflictTime: item.realwaitduration-item.opwaitduration,
                                _id: item._id});//当focus在这点上，显视内容
                        }
                    }
                    if (!tmp.has){
                        //x.push(TimeUtil.format(item.frunendtime, TimeUtil.format5));
                    }
                    if (!waitTmp.has){
                       // waitX.push(TimeUtil.format(item.frunendtime, TimeUtil.format5));
                    }
                } else {
                    console.log('no...');
                }
                array.push(tmp);
                waitArray.push(waitTmp);
            });
        }
        //y.push([max, 0]);

        y.sort((d1,d2)=>{
            return d1[0] - d2[0];
        });

        waitY.sort((d1, d2)=>{
            return d1[0] - d2[0];
        });

        this.setState({
            datasource: array,//当mouse放在点上显视的值
            x: x,
            y: y,
            waitDatasource: waitArray,//待机的数据源
            waitx: waitX,//待机X
            waity: waitY,//真实等待时间, Y轴下面的点
            waity2: waitY2,//实时待待时间(有冲突)，Y轴上面的点
            record: record,//block 统计信息
            conflict:conflict,
            show:false,   //暂无
        },()=>{
            this.countLoad(y[0][0], y[y.length - 1][0]);
            this.countWait(waitY[0][0], waitY[waitY.length -1][0]);
        });
       
    }

    /** 统计上料信息， from: 下标开始，to: 下标结束 */
    countLoad(from, to){
        let _datasource = this.state.y;
        if (!_datasource || _datasource.length <= 0)return;

       // console.log('_datasource', _datasource);

        //y: [时间， 值]
        let startIndex = -1, endIndex = -1;
        _datasource.sort((d1,d2)=>{
            return d1[0] - d2[0];
        });
        for (let index = 0; index < _datasource.length; index++) {
            const element = _datasource[index];
            if (from <= element[0] && startIndex < 0){
                startIndex = index;
            }
            if (to <= element[0] && endIndex < 0){
                endIndex = index;
                if (to == element[0])endIndex++;
                break;
            }
        }

      //  console.log('startIndex', startIndex, 'endIndex', endIndex, 'from', from, 'to', to);

        // if (!from) from = 0;
        // if (!to) to = _datasource.length;
        if (startIndex > endIndex)return;
        //this.state.norm.reloadTime}/{this.state.norm.reloadUpBias}/{this.state.norm.reloadLowBias
        let _norm = this.state.norm;
        if (!_norm){
            _norm = {
                reloadTime: 60,//标准时长
                reloadUpBias: 5,
                reloadLowBias: -5
            };
        }

        let reloadUpBias = _norm.reloadTime + _norm.reloadUpBias;//上限
        let reloadLowBias = _norm.reloadTime + _norm.reloadLowBias;//下限
        _datasource = _datasource.slice(startIndex, endIndex);//需要把相等的那个数值也算上
        let  count = _datasource.length; //上料总数

      //  console.log('count',  count);

        let max = 0,/**最高换料时长*/ min = 0/**最低换料时长 */;
        let up = 0, /**高于换料上限次数*/ low = 0, /**低于换料下限次数 */ norm = 0/** 标准次数 */;
        let upTimes = 0,/**高于标准换料时长 */ normTimes = 0, /**标准换料时长 */lowTimes= 0;/**低于标准换料时长(s)： */
        let normTimePer =  '0%';//标准换料时长比例：
        let upPer = '0%';//高于换料上限比例：高次数/all
        let normPer = '0%';//标准换料比例：  标准次数/all
        let lowPer = '0%';//低于换料下限比例： 低次数/all
        let totalTime = 0
        for (let index = 0; index < _datasource.length; index++) {
            const element = _datasource[index][1];
            totalTime +=element;
            if (element > reloadUpBias){//高于上限
                up++;
                upTimes += (element - reloadUpBias);
            } else if (element < reloadLowBias){//低于下限
                low++;
                lowTimes += (reloadLowBias - element);
            } else {
                norm++;
                normTimes += element;
            }
            if (element > max){
                max = element;
            }
            if (index <= 0){
                min = element;
            } else if (index > 0){
                if (element < min){
                    min = element;
                }
            }
        }

        normTimePer = ((normTimes/totalTime)*100).toFixed(2) + '%';//标准比例
        upPer = ((up/count)*100).toFixed(2) + '%';//高于标准换例比例
        normPer = ((norm/count)*100).toFixed(2) + '%';//标准比例
        lowPer = ((low/count)*100).toFixed(2) + '%';//标准比例

        let load = {
            count: count, //上料总数
            up: up, //高于换料上限次数：
            norm: norm, //标准换料次数：
            low: low, //低于换料下限次数：
            upTimes: upTimes,//高于标准换料时长
            normTimes: normTimes, //标准换料时长
            lowTimes: lowTimes,//低于标准换料时长(s)：
            max: max,//最高换料时长：
            min: min,//最低换料时长：
            normTimePer: normTimePer,//标准换料时长比例：
            upPer: upPer,//高于换料上限比例：高次数/all
            normPer: normPer,//标准换料比例：  标准次数/all
            lowPer: lowPer//低于换料下限比例： 低次数/all
        };
        this.setState({
            load: load,
            isFirstTime: false
        });
    }

     /** 统计待机信息 */
    countWait(from, to){
        let _datasource = this.state.waity;
        if (!_datasource || _datasource.length <= 0)return;

        console.log('_datasource', _datasource);

        //y: [时间， 值]
        let startIndex = -1, endIndex = -1;
        for (let index = 0; index < _datasource.length; index++) {
            const element = _datasource[index];
            if (from <= element[0] && startIndex < 0){
                startIndex = index;
            }
            if (to <= element[0] && endIndex < 0){
                endIndex = index;
                if (to == element[0])endIndex++;
                break;
            }
        }

        //console.log('startIndex', startIndex, 'endIndex', endIndex, 'from', from, 'to', to);

        // if (!from) from = 0;
        // if (!to) to = _datasource.length;
        if (startIndex > endIndex)return;

        let _norm = this.state.norm;
        if (!_norm){
            _norm = {
                idleTime: 50,
                idleUpBias: 5,
                idleLowBias: -5
            };
        }
        let reloadUpBias = _norm.idleTime + _norm.idleUpBias;//上限
        let reloadLowBias = _norm.idleTime + _norm.idleLowBias;//下限
        let conflict = this.state.conflict;
        _datasource = _datasource.slice(startIndex, endIndex);//需要把相等的那个数值也算上

       // _datasource = _datasource.slice(from, to);
        conflict = conflict.slice(startIndex, endIndex);
        let  count = _datasource.length; //待机总数
        let max = 0,/**最高待机时长*/ min = 0/**最低待机时长 */;
        let up = 0, /**高于换料上限次数*/ low = 0, /**低于换料下限次数 */ norm = 0/** 标准次数 */;
        let upTimes = 0,/**高于标准换料时长 */ normTimes = 0, /**标准换料时长 */lowTimes= 0;/**低于标准换料时长(s)： */
        let normTimePer =  '0%';//标准换料时长比例：
        let upPer = '0%';//高于换料上限比例：高次数/all
        let normPer = '0%';//标准换料比例：  标准次数/all
        let lowPer = '0%';//低于换料下限比例： 低次数/all
        let totalTime = 0, conflictTime = 0, conflictCount = 0,tmpConflict = 0;
        for (let index = 0; index < _datasource.length; index++) {
            const element = _datasource[index][1];
            tmpConflict= conflict[index];
            conflictTime += tmpConflict;
            if (tmpConflict>0)conflictCount++;
            totalTime +=element;
            if (element > reloadUpBias){//高于上限
                up++;
                upTimes += (element - reloadUpBias);
            } else if (element < reloadLowBias){//低于下限
                low++;
                lowTimes += (reloadLowBias - element);
            } else {
                norm++;
                normTimes += element;
            }
            if (element > max){
                max = element;
            }
            if (index <= 0){
                min = element;
            } else if (index > 0){
                if (element < min){
                    min = element;
                }
            }
        }
        normTimePer = ((normTimes/totalTime)*100).toFixed(2) + '%';//标准比例
        upPer = ((up/count)*100).toFixed(2) + '%';//高于标准换例比例
        normPer = ((norm/count)*100).toFixed(2) + '%';//标准比例
        lowPer = ((low/count)*100).toFixed(2) + '%';//标准比例
        let avg = ((totalTime/count)).toFixed(2);//平均
        let idle = {
            count: count, //上料总数
            avg: avg,
            up: up, //高于待机上限次数：
            norm: norm, //标准待机次数：
            low: low, //低于待机下限次数：
            upTimes: upTimes,//高于标准待机时长
            normTimes: normTimes, //标准待机时长
            lowTimes: lowTimes,//低于标准待机时长(s)：
            max: max,//最高待机时长：
            min: min,//最低待机时长：
            normTimePer: normTimePer,//标准待机时长比例：
            upPer: upPer,//高于待机上限比例：高次数/all
            normPer: normPer,//标准待机比例：  标准次数/all
            lowPer: lowPer,//低于待机下限比例： 低次数/all
            conflictTime: conflictTime,//冲突时间
            conflictCount: conflictCount//冲突次数

        };
        this.setState({
            idle: idle,
            isFirstTime: false
        });
    }

    render() {
        const record = this.state.record;
        return (
            <div className='main-container' style={styles.detailBody}>

            {/*<Loading */}
                {/*color="#ccc"*/}
                {/*shape="fusion-reactor"*/}
                {/*visible = {this.state.flag}*/}
                {/*>*/}
                <div className='con-body main-con-body'>
                    <div className='y-table-max'>
                            <ReloadState chartId={this.props.chartId+'001'} 
                                datasource={this.state.datasource} 
                                x={this.state.x} y={this.state.y}  
                                norm = {this.state.norm}
                                countLoad = {this.countLoad.bind(this)}
                                isFirstTime = {this.state.isFirstTime}>
                            </ReloadState>
                            {/* 暂无数据 */}
                            <div className="no-data"  style={{display: this.state.show ? "block" : "none"}}></div>
                        <div className='y-max-r'>
                            <ul>
                               <li>
                                   <span>Block：</span>
                                   <span className="y-fs"><CDetailHeader department={record.dID} type={'block'}/></span>
                               </li>
                                <li>
                                    <span>标准换料CT时间(s)：</span>
                                    {/* <span>60+/-5</span> */}
                                    <span>{this.state.reload.stdTime}  +{this.state.reload.UpBias}/{this.state.reload.LowBias}</span>
                                </li>
                                <li>
                                    <span>换料次数：</span>
                                    <span>{this.state.load.count}</span>
                                </li>
                                <li>
                                    <span>标准时长比例：</span>
                                    <span>{this.state.load.normTimePer}</span>
                                </li>
                                <li>
                                    <span>高于上限比例：</span>
                                    <span>{this.state.load.upPer}</span>
                                </li>
                                <li>
                                    <span>标准比例：</span>
                                    <span>{this.state.load.normPer}</span>
                                </li>
                                <li>
                                    <span>低于下限比例：</span>
                                    <span>{this.state.load.lowPer}</span>
                                </li>

                                <li>
                                    <span>高于上限次数：</span>
                                    <span>{this.state.load.up}</span>
                                </li>
                                <li>
                                    <span>标准次数：</span>
                                    <span>{this.state.load.norm}</span>
                                </li>
                                <li>
                                    <span>低于下限次数：</span>
                                    <span>{this.state.load.low}</span>
                                </li>
                                <li>
                                    <span>高于标准时长(s)：</span>
                                    <span>{this.state.load.upTimes}</span>
                                </li>
                                <li>
                                    <span>标准总时长(s)：</span>
                                    <span>{this.state.load.normTimes}</span>
                                </li>
                                <li>
                                    <span>低于标准时长(s)：</span>
                                    <span>{this.state.load.lowTimes}</span>
                                </li>
                                <li>
                                    <span>最高换料时长(s)：</span>
                                    <span>{this.state.load.max}</span>
                                </li>
                                <li>
                                    <span>最低换料时长(s)：</span>
                                    <span>{this.state.load.min}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='y-table-max'>
                        <WaitState chartId={this.props.chartId+'002'}  
                        datasource={this.state.waitDatasource} 
                        waitx={this.state.waitx} 
                        waity={this.state.waity} 
                        waity2={this.state.waity2}  
                        norm = {this.state.norm}
                        countWait = {this.countWait.bind(this)}
                        isFirstTime = {this.state.isFirstTime}>
                        </WaitState>
                        {/* 暂无数据 */}
                        <div className="no-data" style={{display: this.state.show ? "block" : "none"}}></div>
                        <div className='y-max-r'>
                            <ul>
                                <li>
                                    <span>标准待机时间(s)：</span>
                                    <span>{this.state.wait.stdTime}  +{this.state.wait.UpBias}/{this.state.wait.LowBias}</span>
                                </li>
                                <li>
                                    <span>平均待机时间(s)：</span>
                                    <span>{this.state.idle.avg}</span>
                                </li>
                                <li>
                                    <span>待机次数：</span>
                                    <span>{this.state.idle.count}</span>
                                </li>
                                <li>
                                    <span>高于标准比例：</span>
                                    <span>{this.state.idle.upPer}</span>
                                </li>
                                <li>
                                    <span>标准比例：</span>
                                    <span>{this.state.idle.normPer}</span>
                                </li>
                                <li>
                                    <span>低于标准比例：</span>
                                    <span>{this.state.idle.lowPer}</span>
                                </li> 
                                <li>
                                    <span>标准时长比例：</span>
                                    <span>{this.state.idle.normTimePer}</span>
                                </li>
                                <li>
                                    <span>高于上限次数：</span>
                                    <span>{this.state.idle.up}</span>
                                </li>
                                <li>
                                    <span>标准次数：</span>
                                    <span>{this.state.idle.norm}</span>
                                </li>
                                <li>
                                    <span>低于下限次数：</span>
                                    <span>{this.state.idle.low}</span>
                                </li>
                                <li>
                                    <span>超时时长(s)：</span>
                                    <span>{this.state.idle.upTimes}</span>
                                </li>
                                <li>
                                    <span>标准总时长(s)：</span>
                                    <span>{this.state.idle.normTimes}</span>
                                </li>
                                {/* <li>
                                    <span>节约时长(s)：</span>
                                    <span>{this.state.idle.lowTimes}</span>
                                </li> */}
                                <li>
                                    <span>最高时长(s)：</span>
                                    <span>{this.state.idle.max}</span>
                                </li>
                                <li>
                                    <span>最低时长(s)：</span>
                                    <span>{this.state.idle.min}</span>
                                </li>
                               
                                <li>
                                    <span>冲突时间(s)：</span>
                                    <span>{this.state.idle.conflictTime}</span>
                                </li>
                                <li>
                                    <span>冲突次数(pcs)：</span>
                                    <span>{this.state.idle.conflictCount}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>
                {/*</Loading>            */}
            </div>
        )
    }
}

const styles = {
    detailBody: {
        backgroundColor: '#f5f6f7'
    },
    ov:{

    }
}