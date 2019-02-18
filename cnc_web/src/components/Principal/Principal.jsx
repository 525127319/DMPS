import React, { Component } from "react";
import { Select} from "@icedesign/base";
import PeopleUtil from '../../utils/PeopleUtil';
import './Principal.scss';

export default class Principal extends Component {
    static displayName = 'Principal';
    static defaultProps = {
       onChange: ()=>{
           
       }
    };
    constructor(props){
        super(props);
        let value = props.value ? props.value : '' ;
        this.state = {
            treeData:[],
            responsibility_by:{
                // value: 'Admin'
            }
        }
    }

    // componentWillMount(){
    //     PeopleUtil.list().then(departmentMap => {
    //         let _array = [];
    //         departmentMap.forEach((value, key) => {
    //             _array.push({label: value, value: key.toString()});
    //         });
    //         this.setState({
    //             treeData: _array
    //         });
    //      });
       
    //   }

      componentWillMount(){
        PeopleUtil.list().then((data)=>{
           this.handledevIbilityName(data); 
        });
     }

     handledevIbilityName = function (data) {
        this.setState({
            treeData: data
       });

   }.bind(this);

      componentWillReceiveProps(nextProps) {
        if (!nextProps)return;
          this.setState({
            responsibility_by:{
                value: nextProps.value
            }
          });
      }


    render(){
            return(
                <div className="PeopleUtil">       
                    <Select
                        hasClear
                        // defaultValue="admin"
                        dataSource={this.state.treeData}
                        name={this.props.responsibility_by}
                        onChange={this.props.onChange}
                        // value={this.state.responsibility_by.value}
                        placeholder="请选择负责人"
                        defaultValue='heoo'
                    />
                </div>
            )
        }
    }