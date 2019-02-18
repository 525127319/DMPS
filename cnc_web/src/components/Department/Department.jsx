import React, { Component } from "react";
import { TreeSelect} from "@icedesign/base";
import DepartmentUtil from '@/utils/DepartmentUtil';
import './Department.scss';

export default class Department extends Component {
    static displayName = 'Department';
    static defaultProps = {
        
    
     };
    constructor(props){
        super(props);

        this.state = {
            devdepartment: [],   
            department:{
                value:""
            },
            onChange: props.onChange?props.onChange: this.select
        }
    }


    select = function(value, array){
        this.setState({
            department:{
                value: value
            }
        });
    }.bind(this)

    componentWillMount(){
        DepartmentUtil.getDepartmentTree().then((res) => {
            let departmentdata = res;
            this.handledevdepartment(departmentdata);
        });
      }

      handledevdepartment = function (data) {
          if (data.length > 0) {
            data[0].selectable=false
            this.setState({
                devdepartment: data
            });
          }
        
    }.bind(this);

    getValue(){
        return this.state.department.value;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value) {
            this.setState({
                department:{
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

    render(){
            return(
                <div className="PeopleUtil" >       
                    <TreeSelect
                        hasClear
                        dataSource={this.state.devdepartment}
                        treeDefaultExpandAll
                        onChange={this.state.onChange}
                        value={this.state.department.value}
                        placeholder="请选择部门"
                    />
                </div>
            )
        }
    }