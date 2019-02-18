import React, { Component } from 'react';
// import Status from './Status';
import Status from './Status_new';
import Title from './Title';
import AxiosHttp from '@/utils/AxiosHttp';
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import { debounce } from 'rxjs/operators';
let xMin= 28800,xMax=115200
export default class StatusStatistic extends Component {
    constructor(props){
        super(props);
        this.state={
            shift_sTime:28800,
        }
    }

    render0(){
        let {statusMap, day,datasource} = this.props;
        // console.log(statusMap,'statusMap2222')
        if (!statusMap || !datasource)return;
        let deviceName = null;
        return  [...statusMap].map((item,key)=>{
            datasource.forEach(val=>{
                if(val.dev_id == item[0]){
                   deviceName = DeviceinfoUtil.getNameByDevId(val.dev_id);
                }
        })
        if(!deviceName)return;
          return(<Status devid={key} day={day} key={key} devname={deviceName} shiftSTime={this.state.shift_sTime}  xMin={xMin}  xMax = {xMax} statusDatas={statusMap.get(item[0])}/>) ;
           
        });
    }
     getShiftData(){
         AxiosHttp.post('/shift/findAll').then(res=>{
               if(res && res.ok===1){
                       xMin=res.value[0].begin_time*60*60;
                       xMax=(res.value[0].end_time+24)*60*60;
                       this.setState({
                        shift_sTime : res.value[0].begin_time*60*60

                    })
               }
         })
       }
       componentDidMount(){
          this.getShiftData()
       }
    componentWillReceiveProps(nextProp){
        this.props = nextProp;
    }

    render(){
        return(
            <div className="canvas-group" style={styles.status_area}>
                <Title/>
                {this.render0()}
            </div>
        )
    }
}

const styles = {
    status_area: {
        background: 'white',

    }

    
}