import ReloadChart from "@/components/CellBlock/ReloadChart";
import DeviceinfoUtil from "@/utils/DeviceinfoUtil";

/** 
 * 异常处理报表
*/
export default class ReloadState extends ReloadChart {

    constructor(props) {
        super(props);
    }


    /**
     * 获取标准定义
     * @param {*} props 
     */
    getNorm(){
      return null;
    }

    /**
     * 当mouse在点上提示信息
     */
    propup(data){
        let details = data.details;
        // console.log('_id', details[0]._id);
        if (!details || details.length <= 0){
            console.log('异常记录');
           return;
        }
        let rs = '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设备:' + DeviceinfoUtil.getNameByDevId(data.devId) + '</span><br/>';
        if (details && details.length > 0) {
            console.log('_id', details[0]._id);
            rs += '<span>处理时长:' + details[0].uploadduration+ '</span><br/>';
            
            rs += '<span>处理时间:'+details[0].s+'-';

            //for(let i = 1; i < details.length;i++){
               // if (details[details])
            rs += details[details.length - 1].e+'</span><br/>';
                
            //}
        }
        return rs;
    }

    /** 
     * 返回标题
     */
    title(){
        return '异常处理时长分布图';
    }

    /**
     * 返回legend,
     * 返回数组
     */
    legend(){
        return ['异常处理时长(s)'];
    }

    mkSeries(x, y){
        return [{
            name: '异常处理时长(s)',
            type: 'scatter',
            data: y,
            // xAxisIndex: 2,
            // yAxisIndex: 2,
            color: '#4976c2',
            id: '0001',
            label: {
                normal: {
                    formatter: function(a,b){
                       return a.data[1];
                    },
                    position: 'top',
                   show: false
                },

            },
           // markLine: morn,
        }];
    }
}
