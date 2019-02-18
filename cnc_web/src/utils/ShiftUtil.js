import AxiosHttp from './AxiosHttp';
import TimeUtil from './TimeUtil';
let datas = null;
let map = new Map();

class ShiftUtil {
    cacheShift() {
        return AxiosHttp
            .get("/shift/getShiftDefineTime")
            .then((res) => {
                return this.handleShift(res)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleShift(res) {
        let shiftStore = localStorage.getItem('shift');
        if (res) {
            datas = res;
            localStorage.setItem('shift', JSON.stringify(res));
        } else if (shiftStore) {
            datas = JSON.parse(shiftStore);
        }

        if (datas){
            let data = datas.data;
            if (data){
                data.forEach(item=>{
                    map.set(item.id, item);
                });
            }
        }
        return datas;
    }

    getShiftById(shiftId){
        let shift = map.get(shiftId);
        if (shift)return shift;
        else return {};
    }

    getShift() {
        let shiftStore = localStorage.getItem('shift');
        if (shiftStore) {
            return Promise.resolve(JSON.parse(shiftStore));
        } else if (datas) {
            //let _shiftArray = [{'label': '全班','value': '0'}, {'label': '白班','value': '1'}, {'label': '晚班','value': '2'}];
            return Promise.resolve(datas);
        } else {
            return this.cacheShift();
        }
    }

    /**
     * 获取班别日志
     * 根据班别别的定义，返回当前的班别日期
     */
    getShiftDate(){
        let shift = this.getLocalShift();
        let defaultDate = TimeUtil.getCurDate(TimeUtil.format3);
        if (!shift) return defaultDate;
        let data = shift.data;
        if (!data)return defaultDate;
        data.sort((d1, d2)=>{
            return d1.begin_time - d2.begin_time;
        });
        let begin = data[0].begin_time;
        let begin2 = data[data.length- 1].begin_time;
        let end = data[data.length - 1].end_time;
        let isCrossDay = false;//是否跨天
        if (begin2 > end){
            isCrossDay = true;
        }
        if (!isCrossDay)return defaultDate;

        let lastDay = null;
        if (isCrossDay){
            lastDay = TimeUtil.subtractDay(defaultDate, 1);
        }
        
        //前一天的班别开始
        let start = TimeUtil.addDayShift(lastDay, 0, begin);
        end = TimeUtil.addDayShift(lastDay, 1, end);//晚班结束
        let cur = TimeUtil.geCurUnixTime();
        if (parseInt(start) <= parseInt(cur) && parseInt(cur) <= parseInt(end)){
            return lastDay;
        }
        return defaultDate;
    }

    /**
     * 根据班别别的定义，返回当前的班别ID
     */
    getDefaultShift(){
        let shift = this.getLocalShift();
        let defaultDate = TimeUtil.geCurUnixTime();
        if (!shift) return '';
        let data = shift.data;
        if (!data)return '';
        data.sort((d1, d2)=>{
            return d1.begin_time - d2.begin_time;
        });
        let morningShift = data[0]; 
        let nightShift = data[data.length- 1];
        let begin = data[0].begin_time;
        let morningShiftEnd = data[0].end_time;
        let begin2 = data[data.length- 1].begin_time;
        let end = data[data.length - 1].end_time;
        let isCrossDay = false;//是否跨天
        if (begin2 > end){
            isCrossDay = true;
        }
        if (!isCrossDay){//不是跨天的

        }

        let lastDay = null;
        let curDate = TimeUtil.getCurDate(TimeUtil.format3);
        if (isCrossDay){
            lastDay = TimeUtil.subtractDay(curDate, 1);
        }
        
        //前一天的晚班时间段
        let start = TimeUtil.addDayShift(lastDay, 0, begin2);
        let lastShiftEnd = TimeUtil.addDayShift(curDate, 0, end);//前班晚班
        if (start <= defaultDate && defaultDate<= lastShiftEnd) {//
            return nightShift.id;
        }

        //当天的早班时间段
        let morningShiftStart = TimeUtil.addDayShift(curDate, 0, begin);
        let morningEndShift = TimeUtil.addDayShift(curDate, 0, morningShiftEnd);
        if (morningShiftStart <= defaultDate && defaultDate<= morningEndShift) {//早班ID
            return morningShift.id;
        }
        //当天的晚班时间
        let nightShiftStart = TimeUtil.addDayShift(curDate, 0, begin2);
        let nightEndShiftend = TimeUtil.addDayShift(curDate, 1, end);
        if (nightShiftStart <= defaultDate && defaultDate<= nightEndShiftend) {//早班ID
            return nightShift.id;
        }
    }

    getLocalShift() {
        let shiftStore = localStorage.getItem('shift');
        if (shiftStore) {
            return JSON.parse(shiftStore)
        }
        return null;
    }

    wrapShift(shifts) {
        if (!shifts || !shifts.data || shifts.data.length <= 0) return [];
        let values = [];//{'label': '全部', 'value': ''}
        if (shifts.data) {
            shifts.data.forEach(shift => {
                values.push({ 'label': shift.name, 'value': shift.id });
            });
        }
        return values;
    }

    /**
     * 根据班别来返回数据实是那一天的数据，由于班是夸天的，如： 27号数据，但最后更新数据为28号，
     * 所以日期应该为27号
     * shift.sTime: 当天开的开始时间
     * shift.eTime: 当天的结束时间
     * shift.begin_time:  班的开始时间
     * shift.end_time： 班的结束时间
     * @param {*} value 
     */
    updateDate2ShiftDate(value) {
        if (!datas) return '';
        let shift = datas;
        if (!shift) return '';
        let time = TimeUtil.format(value, 'YYYY-MM-DD');
        if (shift.sTime < value && value < shift.eTime) {
            return time;
        }

        let begin_time = shift.begin_time;
        //let end_time = shift.end_time;
        //求出班别的开始时间
        let shiftStartTime = TimeUtil.addDayShift(time, 0, begin_time);
        if (value >= parseInt(shiftStartTime)) {//当天
            return time;
        } else {//小于， 即为前一天，需减少一天
            let x = TimeUtil.subtractDay(time, 1);
           // x = TimeUtil.format(x, 'YYYY-MM-DD');
            return x;
        }
    }

    //  针对实时数据-详情页的历史报警"报警时间"按班别时间查询增加的时分秒
    updateDate2ShiftDateTime(value) {
        if (!datas) return '';
        let shift = datas;
        if (!shift) return '';
        let time = TimeUtil.format(value, 'YYYY-MM-DD HH:mm:ss');
        if (shift.sTime < value && value < shift.eTime) {
            return time;
        }

        let begin_time = shift.begin_time;
        //let end_time = shift.end_time;
        //求出班别的开始时间
        let shiftStartTime = TimeUtil.addDayShift(time, 0, begin_time);
        if (value >= parseInt(shiftStartTime)) {//当天
            return time;
        } else {//小于， 即为前一天，需减少一天
            let x = TimeUtil.subtractDay(time, 1, TimeUtil.format4);
            //x = TimeUtil.format(x, 'YYYY-MM-DD HH:mm:ss');
            return x;
        }
    }
}
let shiftUtils = new ShiftUtil();
shiftUtils.cacheShift();
export default shiftUtils;