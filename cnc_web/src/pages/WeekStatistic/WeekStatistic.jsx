import React, { Component } from 'react';
import Week from './Week'
export default class WeekStatistic extends Component {
    static displayName = 'Layout';

    constructor(props) {//上層組件傳進來的屬性。
        super(props);
    }

    render() {//瀉染

        return (
            <Week />
        );
    }

}