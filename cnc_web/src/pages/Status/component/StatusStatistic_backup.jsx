import React, { Component } from 'react';
// import Status from './Status';
import Status from './Status_new';
import Title from './Title';

import TimeUtil from '@/utils/TimeUtil';

export default class StatusStatistic extends Component {
    constructor(props){
        super(props);
    }
//
    render0(){
        let {datasource, day} = this.props;
        console.log(datasource,'22222222222222')
        if (datasource.length <= 0)return;
        let index = 0;
        return datasource.map(item=>{
           // console.log('item.dev_id:   '+item.dev_id);   TimeUtil.geCurUnixTime() + '_' + 
            let key =  item.dev_id;
            return (<Status devid={item.dev_id} day={day} key={key} devname={item.name}/>);
        });
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
        // height: '100%'
    }
}