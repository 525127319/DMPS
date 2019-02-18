import React, { Component } from "react";
import { Button, Field, DatePicker, Select } from "@icedesign/base"
import { Feedback } from "@icedesign/base";
import CComponent from "../Common/CComponent"
import DeviceinfoUtil from "@/utils/DeviceinfoUtil"
import DepartmentUtil from '@/utils/DepartmentUtil.js';

const Toast = Feedback.toast;
const { Combobox } = Select;
let deviceMaps=[];
let deviceMap=[];
export default class ToolDevice extends CComponent {
    constructor(props) {
        super(props);
        this.state = {
            fillProps:'',
            // deviceId:0,
        }
       
    }

    componentWillMount(){
        deviceMap=[];
        DeviceinfoUtil.getAllDevice().then(map =>{
            map.forEach(item =>{
                deviceMaps.push(item);
            })
        })
        console.log(deviceMap,'deviceMap');
        // this.switchDepartment('root');
        // this.switchDepartment();
    }

    switchDepartment(department){
        console.log(department,'department');
        console.log(deviceMaps,'deviceMaps');
        deviceMap=[];
        deviceMaps.forEach(item =>{
            if(item.department.indexOf(department)!=-1){
                deviceMap.push(item);  
            } 
        })
      
       
    }
    
   

    onChange (value) {
      this.props.selectDeviceId(value)
    };

    render() {
        // let deviceMap = JSON.parse(localStorage.getItem('deviceinfo'));
        // console.log(deviceMap,'deviceMap');
        const departmentId = this.props.departmentId;
        return (
            <Combobox 
                size={this.state.size}
                style={{ width: 180 ,marginLeft:50}} 
                fillProps={this.state.fillProps}
                onChange={this.onChange.bind(this)}
                placeholder="请输入设备名称"
                >
                {deviceMap.map(item =>{
                    if(item.department.indexOf(departmentId) !=-1){
                        return(<Option value={item.dev_id}>{item.name}</Option>) 
                    }
                })}
            </Combobox>   
        )
    }
}
