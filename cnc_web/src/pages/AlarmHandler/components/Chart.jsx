import CComponent from "@/components/Common/CComponent";
import ReloadState from './ReloadState';
import WaitState from './WaitState';
import TimeUtil from "@/utils/TimeUtil";
import CDetailHeader from '@/components/CellBlock/CDetailHeader';
import AppConfigUtil from '@/utils/AppConfigUtil';
import { start } from "pretty-error";
export default class Chart extends CComponent {
    
    constructor(props){
        super(props);
        this.state={
            res: props.res,
            record: props.record,
            type:4,
            norm: {},
            datasource: [],
            conflict:[],
            load: {},
            idle: {},
            isFirstTime: true,
            show:false,   //暂无
            ENGChgTool:{},
            ENGWait:{}
        }
    }

    /**
     * 获标准参数
     *  */
    componentWillMount(){
        let _this = this;
        let ENGChgTool = null, ENGWait= null;
        let promise = AppConfigUtil.getToolConfigByType(this.state.type);
        promise.then(configs => {
            if (!configs)return;
            for (let index = 0; index < configs.length; index++) {
                const element = configs[index];
                if (element.name == "ENGChgTool"){
                    ENGChgTool = element;
                } else if (element.name == "ENGWait"){
                    ENGWait = element;
                }
            }
            _this.setState({
                ENGChgTool: ENGChgTool,
                ENGWait: ENGWait
            });
        })
    }

    //参数改变时候
    willReceiveProps(newProps, oldProps){
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
        let array = [], x = [], y = [], times = null, tmp = null/** 换刀时间 */;
        let waitArray = [], waitX = [], waitY = []/** opwaitduration-真正使用时间（包括冲突） */, waitY2 = []/** realwaitduration-实际待待时间（不包括冲突） */,waitTmp = null/** 待机时间 */;
        let conflict = [];
        if (detail && detail.length > 0) {
            detail.sort((d1, d2)=>{
                return d1.frunendtime - d2.frunendtime;
            });
            detail.forEach(item=>{
                tmp = {details: [], has: false, devId: item.dev_id};//mouse放到点上显视的值
                waitTmp = {details: [], has: false, devId: item.dev_id};////mouse放到点上显视的值
                if (item.isconflict){
                    conflict.push(item.realwaitduration - item.opwaitduration);
                } else {
                    conflict.push(0);
                }

                times = item.times;
                if (times){//如果一个times里有2次换刀，只抓第一次的时间
                    // times.sort((t1, t2)=>{
                    //     return t1.stime - t2.stime;
                    // });
                   

                    for (let index = 0; index < times.length; index++) {
                        const element = times[index];
                        if (index == 1){//换刀开始时刻
                           y.push([element.stime * 1000, item.uploadduration]);
                           tmp.details.push({s: TimeUtil.format(element.stime, TimeUtil.format6), stime: element.stime, 
                                     e: TimeUtil.format(element.etime, TimeUtil.format6), etime: element.etime, 
                                     uploadduration: item.uploadduration,
                                     _id: item._id});//当focus在这点上，显视内容
                           continue;
                        }
                        if (index == 0){//首次待机
                            waitY.push([element.stime* 1000, item.opwaitduration]);//待机的下面那个点
                            waitY2.push([element.stime* 1000, item.realwaitduration]);//待机的上面那个点
                            //waitX.push(TimeUtil.format(element.stime, TimeUtil.format5));//放入第一个待机时间, 待机x轴
                            waitTmp.has = true;
                            waitTmp.details.push({s: TimeUtil.format(element.stime, TimeUtil.format6), 
                                stime: element.stime, 
                                e: TimeUtil.format(element.etime, TimeUtil.format6), 
                                etime: element.etime, 
                                realwaitduration: item.realwaitduration, opwaitduration: item.opwaitduration, 
                                conflictTime: item.realwaitduration-item.opwaitduration,
                                status: item.status, _id: item._id});
                            continue;
                        } 
                        //换刀过程中的状态tmp
                        if (element.status != 2){
                            tmp.details.push({s: TimeUtil.format(element.stime, TimeUtil.format6), 
                                stime: element.stime, 
                                e: TimeUtil.format(element.etime, TimeUtil.format6), 
                                etime: element.etime, 
                                realwaitduration: item.realwaitduration, opwaitduration: item.opwaitduration, 
                                conflictTime: item.realwaitduration-item.opwaitduration,
                                status: item.status, _id: item._id});//当focus在这点上，显视内容
                        }
                        
                    }
                }
                if (tmp.details.length <= 0){
                    console.log('异常记录', item._id);
                }
                array.push(tmp);
                waitArray.push(waitTmp);
            });
        }
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

    /** 统计换刀， from: 下标开始，to: 下标结束 */
    countLoad(from, to){
        let _datasource = this.state.y;
        if (!_datasource || _datasource.length <= 0)return;

       // console.log('_datasource', _datasource);

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

      //  console.log('startIndex', startIndex, 'endIndex', endIndex, 'from', from, 'to', to);

        // if (!from) from = 0;
        // if (!to) to = _datasource.length;
        if (startIndex > endIndex)return;
        //this.state.norm.reloadTime}/{this.state.norm.reloadUpBias}/{this.state.norm.reloadLowBias
        let _norm = this.state.norm;
        if (!_norm || !_norm.reloadTime){
            let _reloadTime = 300;
            let _reloadUpBias = 300 * 1/20;
            let _reloadLowBias = -(300 * 1/20);
            _norm = {
                reloadTime: _reloadTime,//标准时长
                reloadUpBias: _reloadUpBias,
                reloadLowBias:_reloadLowBias
            };
        }

        let reloadUpBias = _norm.reloadTime + _norm.reloadUpBias;//上限
        let reloadLowBias = _norm.reloadTime + _norm.reloadLowBias;//下限
        _datasource = _datasource.slice(startIndex, endIndex);//需要把相等的那个数值也算上
        let  count = _datasource.length; //上料总数

      //  console.log('count',  count);

        let max = 0,/**最高换刀时长*/ min = 0/**最低换刀时长 */;
        let up = 0, /**高于换刀上限次数*/ low = 0, /**低于换刀下限次数 */ norm = 0/** 标准次数 */;
        let upTimes = 0,/**高于标准换刀时长 */ normTimes = 0, /**标准换刀时长 */lowTimes= 0;/**低于标准换刀时长(s)： */
        let normTimePer =  '0%';//标准换刀时长比例：
        let upPer = '0%';//高于换刀上限比例：高次数/all
        let normPer = '0%';//标准换刀比例：  标准次数/all
        let lowPer = '0%';//低于换刀下限比例： 低次数/all
        let totalTime = 0, avg = 0;
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
        avg = (totalTime/count).toFixed(2);//理增多处理时长
        let load = {
            count: count, //上料总数
            totalTime: totalTime,//总时间
            avg:avg,
            up: up, //高于换刀上限次数：
            norm: norm, //标准换刀次数：
            low: low, //低于换刀下限次数：
            upTimes: upTimes,//高于标准换刀时长
            normTimes: normTimes, //标准换刀时长
            lowTimes: lowTimes,//低于标准换刀时长(s)：
            max: max,//最高换刀时长：
            min: min,//最低换刀时长：
            normTimePer: normTimePer,//标准换刀时长比例：
            upPer: upPer,//高于换刀上限比例：高次数/all
            normPer: normPer,//标准换刀比例：  标准次数/all
            lowPer: lowPer//低于换刀下限比例： 低次数/all
        };
        this.setState({
            load: load,
            isFirstTime: false,
            norm: _norm
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
        if (!_norm || !_norm.idleTime){
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
        let up = 0, /**高于换刀上限次数*/ low = 0, /**低于换刀下限次数 */ norm = 0/** 标准次数 */;
        let upTimes = 0,/**高于标准换刀时长 */ normTimes = 0, /**标准换刀时长 */lowTimes= 0;/**低于标准换刀时长(s)： */
        let normTimePer =  '0%';//标准换刀时长比例：
        let upPer = '0%';//高于换刀上限比例：高次数/all
        let normPer = '0%';//标准换刀比例：  标准次数/all
        let lowPer = '0%';//低于换刀下限比例： 低次数/all
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
            totalTime:totalTime,
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
            isFirstTime: false,
            norm:_norm
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
                            <ReloadState chartId={this.props.chartId+'1001'} 
                                datasource={this.state.datasource} 
                                x={this.state.x} y={this.state.y}  
                                norm = {this.state.ENGChgTool}
                                countLoad = {this.countLoad.bind(this)}
                                isFirstTime = {this.state.isFirstTime}>
                            </ReloadState>
                            {/* 暂无数据 */}
                            <div className="no-data"  style={{display: this.state.show ? "block" : "none"}}></div>
                        <div className='y-max-r'>
                            <ul>
                               <li>
                                   <span>CELL</span>
                                   <span className="y-fs">
                                   <CDetailHeader department={record.dID}/>
                                   </span>
                               </li>
                                <li>
                                    <span>处理次数(pcs)：</span>
                                    <span>{this.state.load.count}</span>
                                </li>
                                <li>
                                    <span>平均处理时长(s)：</span>
                                    <span>{this.state.load.avg}</span>
                                </li>
                                <li>
                                    <span>总处理时长(s)：</span>
                                    <span>{this.state.load.totalTime}</span>
                                </li>
                                <li>
                                    <span>最长处理时长(s)：</span>
                                    <span>{this.state.load.max}</span>
                                </li>
                                <li>
                                    <span>最短处理时长(s)：</span>
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
                        norm = {this.state.ENGWait}
                        countWait = {this.countWait.bind(this)}
                        isFirstTime = {this.state.isFirstTime}>
                        </WaitState>
                        {/* 暂无数据 */}
                        <div className="no-data" style={{display: this.state.show ? "block" : "none"}}></div>
                        <div className='y-max-r'>
                            <ul>
                                
                                <li>
                                    <span>平均待机时间(s)：</span>
                                    <span>{this.state.idle.avg}</span>
                                </li>
                                <li>
                                    <span>待机次数(pcs)：</span>
                                    <span>{this.state.idle.count}</span>
                                </li>
                                <li>
                                    <span>待机总时长(s)：</span>
                                    <span>{this.state.idle.totalTime}</span>
                                </li>
                                <li>
                                    <span>平均待机时长(s)：</span>
                                    <span>{this.state.idle.avg}</span>
                                </li>
                                <li>
                                    <span>最高待机时长(s)：</span>
                                    <span>{this.state.idle.max}</span>
                                </li>
                                <li>
                                    <span>最低待机时长(s)：</span>
                                    <span>{this.state.idle.min}</span>
                                </li>
                                <li>
                                    <span>待机冲突时间(s)：</span>
                                    <span>{this.state.idle.conflictTime}</span>
                                </li>
                                <li>
                                    <span>待机冲突次数(pcs)：</span>
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