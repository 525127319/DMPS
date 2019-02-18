import React, { Component } from 'react';
import PartDemand from './PartDemand';
export default class Demand extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <PartDemand/>
            </div>
        )
    }
}