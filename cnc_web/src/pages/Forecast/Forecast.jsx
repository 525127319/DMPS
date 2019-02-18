import React, { Component } from 'react';
import ForecastDefined from './ForecastDefined';
export default class Forecast extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <ForecastDefined/>
            </div>
        )
    }
}