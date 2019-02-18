import React, { Component } from "react";
import { TreeSelect} from "@icedesign/base";
import DepartmentUtil from '@/utils/DepartmentUtil';
import './Location.scss';

export default class Location extends Component {
    static displayName = 'Location';
    static defaultProps = {
        onChange: ()=>{  
        },
    
     };   
    constructor(props){
        super(props);
        this.state = {
            devlocation: [],
            location:{
                value:""
            }              
        }
     
    }

    componentWillMount(){
        DepartmentUtil.getLocationTree().then((res) => {
            let locationdata = res;
            this.handledevlocation(locationdata);
        });
      }

      handledevlocation = function (data) {
        // data.push({selectable:false});
        // data["selectable"] = false
        // console.log(data[0].label,'data')
        data[0].selectable=false
        this.setState({
            devlocation: data,
        });
        // console.log(data)
    }.bind(this);

    componentWillReceiveProps(nextProps) {
        this.setState({
            location:{
              value: nextProps.value
          }
        });
    }

    render(){
            return(
                <div className="PeopleUtil">       
                    <TreeSelect
                            hasClear
                            name="location"
                            dataSource={this.state.devlocation}
                            treeDefaultExpandAll
                            onChange={this.props.onChange}   
                            autoWidth
                            selectable={this.state.selectable}
                            value={this.state.location.value}   
                            placeholder="请选择位置"          
                        />
                </div>
            )
        }
    }