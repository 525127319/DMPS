import { Tab, Breadcrumb } from "@icedesign/base";
import { hashHistory } from "react-router";
import CComponent from "@/components/Common/CComponent";
import TwoHourChart from "./TwoHoursChart";
import ShiftChart from "./ShiftChart";
import CHeader from "./CHeader";
import AppConfigUtil from '@/utils/AppConfigUtil';

//import './index.css';


/** 
 * block详情
*/
const TabPane = Tab.TabPane;
export default class BlockDetail extends CComponent {

    constructor(props) {
        super(props);
        const localState = this.props.location.state
        if (!localState)return;
        const condition = localState.condition;
        const department = localState.department;
        const record = localState.record;//block的统计信息
        this.state = {
            record: record,
            condition: condition,
            department: department
        }
    }



    handleChange(key) {
        console.log("change", key);
    }

    handleClick(key) {
        console.log("click", key);
    }

    /**
     * 切换部门时
     * @param {*} department 
     */
    switchDepartment(department) {
        hashHistory.push({
            pathname: '/technical/oplist'
        })
    }

    reset(condition) {
        this.setState({
            condition: condition
        });
    }

    render() {

        return (
            <div className='main-container y-main-container' style={styles.detailBody}>
                {/* 面包屑↓ */}
                <div className="head-title head-title-md">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item>人员分析</Breadcrumb.Item>
                        <Breadcrumb.Item link="#/technical/oplist">OP待机换料</Breadcrumb.Item>
                        <Breadcrumb.Item>详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Tab onChange={this.handleChange}>
                    {/* {tabs.map(item => ( */}
                    <TabPane key="shift" tab="班别报表" onClick={this.handleClick}>
                        <CHeader reset={this.reset.bind(this)} 
                        showExprot={'none'} 
                        defaultDate={this.state.condition.selectedDate} 
                        shift={this.state.condition.shift} 
                        showBread={true}
                        ></CHeader>
                        <ShiftChart condition={this.state.condition} department={this.state.department} record={this.state.record}></ShiftChart>
                    </TabPane>
                    <TabPane key="twohour" tab="2小时报表" onClick={this.handleClick}>
                        <TwoHourChart condition={this.state.condition} department={this.state.department} record={this.state.record}></TwoHourChart>
                    </TabPane>
                    
                    {/* ))} */}
                </Tab>
            </div>
        );
    }
}

const styles = {
    detailBody: {
        backgroundColor: '#f5f6f7'
    },
    ov: {

    }
}