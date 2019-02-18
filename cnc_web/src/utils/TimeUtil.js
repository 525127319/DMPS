import { Moment } from "@icedesign/base";
class TimeUtil{

    constructor(){
        this.format1='YYYY-MM-DD hh:mm:ss';
        this.format2='H:mm:ss';
        this.format3 = 'YYYY-MM-DD';
        this.format4='YYYY-MM-DD HH:mm:ss';
        this.format5='HH:mm';
        this.format6='HH:mm:ss';
    }

    //获取当天开始时间， 返回long
    getDayStartUnixTime(){
        let now = Moment().hour(0).minute(0).second(0);
        let curstartTime = Moment(now).format('X');
        return curstartTime;
    }

    //获取指定日期开始时间， 返回long
    getSelectDayStartUnixTime(date){
        let selectDayStartUnixTime = Moment(date).format('X');
        return selectDayStartUnixTime;
    }

    //获取指定日期下一天开始时间， 返回long
    getSelectNextDayStartUnixTime(date){
        let selectNextDayStartUnixTime = Moment(date).add(1,'d').format('X');
        return selectNextDayStartUnixTime;
    }

    //获取指定日期结束时间， 返回long
    getDayEndUnixTime(timeLong){
        let _s = timeLong.toString();
        if (_s.length <= 10){
            timeLong = timeLong * 1000;
        }
        let endTime = Moment(timeLong).hour(23).minute(59).second(59);
        let dateEntTime = Moment(endTime).format('X');
        return dateEntTime;
    }


    //获取当前的时间， 返回long
    geCurUnixTime(){
        let curstartTime = Moment().format('X');
        return curstartTime;
    }

    //10时间戳转换13位
    conver10To13(timeLong){
        let _s = timeLong.toString();
        if (_s.length <= 10){
           timeLong = timeLong * 1000;
        }
        let _m = Moment(timeLong);
        return _m;
    }

    /**
     * 自定义格式化日期
     * 目前项目中有两种格式时间戳 10位、13位数字时间戳
     * @param {*} timeLong 传入Long型的时间
     * @param {*} format 格式
     */
    format(timeLong, format){
        let _m = this.conver10To13(timeLong);
        if(format == undefined || format == null){
            format = this.format4;
        }
        let d =  _m.format(format);
        return d;
    }

    /**
     * 格式化日期  YYYY-MM-DD HH:mm:ss格式
     * 目前项目中有两种格式时间戳 10位、13位数字时间戳
     * @param {*} timeLong 传入Long型的时间
     */
    formatDate(timeLong) {
        return this.format(timeLong, 'YYYY-MM-DD HH:mm:ss');
    }


    //根据指定格式来格式化日期
    formatDateByFormat(sDate, formate){
        return Moment(sDate).format(formate);
    }

    /**
     * 根据指定格式，返回指定日期
     * @param {*} format 日期格式
     */
    getCurDate(format){
        return Moment().format(format);
    }

    getAssignDate(format){
        return  Moment().subtract(1, "months").format(format);
    }

    /**
     * 小时转分钟
     * @param {*} hour 
     */
    hour2Minute(hour){
        return (hour/3600).toFixed(2);
    }

    // duration为加多少天
    addDay(day, duration){
        return Moment(day).add(duration, 'd').format('X');
    }

    // duration为加多少小时
      addHour(day, duration){
        let l =  Moment(day).add(duration, 'h').format('X');
        return this.formatDate(l);
    }

    //减少多少小时 ,duration为加多少小时
    //返回long型
     subtractHour(time, duration){
        let l = this.conver10To13(time);
        l = l.subtract(duration, 'h').format('X');
        return l;
        //return this.formatDate(l);
    }
    
    /**
     * 减天
     * @param {*} day : 长整型
     * @param {*} duration 
     */
    subtractDay(day, duration, format){
        let m = Moment(day);
        m = m.subtract(duration, 'days');
        if (!format)format = this.format3;
        return this.format(m.unix(), format);
    }

    //返回10位时间值
    addDayShift(day, duration, hour){
        hour = hour? hour : 8
        return Moment(day).add(duration, 'd').hour(hour).minute(0).second(0).format('X');
    }

    //日期时间转换成时间戳
    changeTimestamp(time) {
        return Moment(time).valueOf();
    }

    /*
   以秒形式返回当前时间
   */
    times(){
        return Moment().unix();
    }
    /*
    以ms形式返回当前时间戳
    */
    timestamp(){
        return Moment().valueOf();
    }
}

export default new TimeUtil();
