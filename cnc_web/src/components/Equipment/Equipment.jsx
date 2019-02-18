import React, { Component } from "react";
import { Select} from "@icedesign/base";
import EquipmentUtil from '@/utils/EquipmentUtil';
import './Equipment.scss';

export default class Equipment extends Component {
    static displayName = 'Equipment';
    static defaultProps = {
        onChange: ()=>{  
        },
     
     };  
    constructor(props){
        super(props);
        let value = props.value ? props.value : '' ;
        this.state = {
            deviceType: [],   
            type:{
                // value: 'CNC'
            }  
        }
    }

    // componentWillMount(){
    //     let devicetype = DevicetypeUtil.getDevicetype();
    //     this.handledevicetype(devicetype);  
    //   }

    //   handledevicetype = function (data) {
    //     data.forEach(element => {
    //         element.value = element.value.toString();
    //     });
    //     this.setState({
    //         deviceType: data
    //     });
    //   }.bind(this);


    componentWillMount(){
        EquipmentUtil.list().then((data)=>{
           this.handledevEquipmenName(data); 
        });
     }

     handledevEquipmenName = function (data) {
       this.setState({
            deviceType: data
       });

   }.bind(this);

      componentWillReceiveProps(nextProps) {
          if (!nextProps)return;
        this.setState({
            type:{
              value: nextProps.value
          }
        });
    }

    render(){
            return(
                <div className="PeopleUtil">       
                    <Select
                        hasClear
                        defaultValue="CNC"
                        dataSource={this.state.deviceType}
                        name="type"
                        onChange={this.props.onChange}    
                        // value={this.state.type.value}
                        placeholder="请选择设备类型"   
                    >
                    </Select>                   
                </div>
            )
        }
    }