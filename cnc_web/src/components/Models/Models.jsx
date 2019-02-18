import React, { Component } from "react";
import { Select} from "@icedesign/base";
import DevicetypeUtil from '@/utils/DevicetypeUtil';
import Devicetype_newUtil from '@/utils/Devicetype_newUtil';
import './Models.scss';

export default class Models extends Component {
    static displayName = 'Models';
    static defaultProps = {
        onChange: ()=>{  
        },    
     };    
    constructor(props){
        super(props);
        let value = props.value ? props.value : '' ;
        this.state = {
            deviceType: [],
            model:{
                // value:"a-31i"
            }              
        }
    }

    // componentWillMount(){
    //     let deviceModel = DevicetypeUtil.getModel();
    //     this.handledevModel(deviceModel);
    //   }

    //   handledevModel = function (data) {
    //     this.setState({
    //         deviceModel: data,
    //     });
    // }.bind(this);

    componentWillMount(){
        Devicetype_newUtil.list().then((data)=>{
           this.handledevDeviceName(data); 
        });
     }

     handledevDeviceName = function (data) {
        this.setState({
            deviceType: data
       });

   }.bind(this);

    componentWillReceiveProps(nextProps) {
        this.setState({
            model:{
              value: nextProps.value
          }
        });
    }
    render(){
            return(
                <div className="PeopleUtil">       
                    <Select
                        hasClear
                        defaultValue="a-31i"
                        dataSource={this.state.deviceType}
                        // name="model"
                        name={this.props.model}
                        onChange={this.props.onChange}   
                        // value={this.state.model.value}
                        placeholder="请选择设备型号"   
                    />
                </div>
            )
        }
    }