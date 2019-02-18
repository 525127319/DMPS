import React, { Component } from 'react';
import StrategyDefined from './StrategyDefined';
import "./EditStrategyType.scss"
export default class Strategy extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <StrategyDefined/>
            </div>
        )
    }
}