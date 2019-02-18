import React, {Component} from "react";
import {Select} from "@icedesign/base";
import DeviceinfoUtil from '@/utils/DeviceinfoUtil';
import CComponent from '../Common';

import './inquire.scss';

export default class Devicename extends CComponent {
    static displayName = 'Devicename';
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            onChange: props.onChange?props.onChange: this.select
        }
    }

    select = function(value, array){
        this.setState({
            devicename:{
                value: value
            }
        });
    }.bind(this)

    switchDepartment(department){
      this.didMount();
    }

    didMount() {
       this.filter();
    }

    filter(value){
        let _this = this;
        DeviceinfoUtil
        .getDevicesByDepartmentId(super.getDepartment())
        .then(list => {
            let _array = [{
                label: '全部',
                value:''
            }];
            if (list && list.length > 0){
                list.forEach((val, key) => {
                    if (value && val.name.indexOf(value) < 0){
                        return;
                    }
                    _array.push({
                        label: val.name,
                        value: val.dev_id
                    });
                });
                _this.setState({treeData: _array});
            }
        });
    }

    getValue(){
        if (this.state.devicename)
            return this.state.devicename.value;
        return '';
    }

    willReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({
                devicename:{
                    value: nextProps.value
                }
            });
        }

        if (nextProps.onChange){
            this.setState({
                onChange: nextProps.onChange
            });
        }
    }

    onSearch(value){
        this.filter(value);
    }

    render() {
        const _this = this;
        return (
            <div className="Inquire">
                <Select
                    showSearch
                    onChange={this.state.onChange}
                    dataSource={this.state.treeData}
                    placeholder="请选择设备"
                    onSearch={this.onSearch.bind(this)}
                />
            </div>
        )
    }
}