import React, { Component } from 'react';
import PartDefined from './PartDefined';
export default class Part extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <PartDefined/>
            </div>
        )
    }
}