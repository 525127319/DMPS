import React, { Component } from "react";
import { Select} from "@icedesign/base";
import BrandUtil from '@/utils/BrandUtil';
import './Brand.scss';

export default class Brand extends Component {
    static displayName = 'Brand';
    static defaultProps = {
        onChange: ()=>{  
        },    
     };
    constructor(props){
        super(props);
        let value = props.value ? props.value : '' ;
        this.state = {
            deviceBrandName: [],    
            brand_name:{
                // value: 'FANUC'
            }                   
        }
    }

    componentWillMount(){
         BrandUtil.list().then((data)=>{
            this.handledevBrandName(data); 
         });
      }

      handledevBrandName = function (data) {
        this.setState({
            deviceBrandName: data
        });

    }.bind(this);

    componentWillReceiveProps(nextProps) {
        if (!nextProps)return;
        this.setState({
            brand_name:{
              value: nextProps.value
          }
        });
    }

    render(){
            return(
                <div className="PeopleUtil">       
                    <Select
                        hasClear
                        defaultValue="FANUC"
                        dataSource={this.state.deviceBrandName}
                        name="brand_name"
                        onChange={this.props.onChange}   
                        // value={this.state.brand_name.value} 
                        placeholder="请选择品牌名"
                    >
                    </Select>
                </div>
            )
        }
    }