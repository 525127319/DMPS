import React, { Component } from 'react';
import Tool from './Tool'
import './ToolChange.scss'
export default class ToolChange extends Component {
    static displayName = 'Layout';

    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }

    render() {//瀉染

        return (
                <Tool/>
        );
    }
    
}