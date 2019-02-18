import React, { Component } from 'react';
import Year from './Year'
export default class YearStatistic extends Component {
    static displayName = 'Layout';

    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }

    render() {//瀉染

        return (
            <Year />
        );
    }

}