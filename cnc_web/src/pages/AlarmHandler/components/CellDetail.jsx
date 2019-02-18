import { Tab, Breadcrumb } from "@icedesign/base";
import { hashHistory } from "react-router";
import CComponent from "@/components/Common/CComponent";
import TwoHourChart from "./TwoHoursChart";
import ShiftChart from "./ShiftChart";
import CHeader from "./CHeader";

//import './index.css';


/** 
 * CELL详情
*/
const TabPane = Tab.TabPane;
export default class BlockDetail extends CComponent {

    constructor(props) {
        super(props);
        const localState = this.props.location.state
        const condition = localState.condition;
        const department = localState.department;
        const record = localState.record;//block的统计信息
        this.state = {
            record: record,
            condition: condition,
            department: department,
            type: 0
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
            pathname: '/technical/alarmhandlerlist'
        })
    }

    reset(condition) {
        this.setState({
            condition: condition
        });
    }

    render() {
        const localState = this.props.location.state
        const condition = localState.condition;
        const department = localState.department;
        const record = localState.record;//block的统计信息
        const type = localState.type
        return (
            <div className='main-container y-main-container' style={styles.detailBody}>

                {/* 面包屑↓ */}
                <div className="head-title head-title-md">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item >人员分析</Breadcrumb.Item>
                        <Breadcrumb.Item link="#/technical/alarmhandlerlist">技术员异常处理</Breadcrumb.Item>
                        <Breadcrumb.Item >详情</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Tab onChange={this.handleChange}>
                     <TabPane key="shift" tab="班别报表" onClick={this.handleClick}>
                        <CHeader reset={this.reset.bind(this)} 
                        showExprot={'none'} 
                        showBread={true}
                        type={type}></CHeader>
                        <ShiftChart
                            condition={this.state.condition}
                            department={this.state.department}
                            record={this.state.record}
                            type={type}
                            ></ShiftChart>
                    </TabPane>
                    <TabPane key="twohour" tab="2小时报表" onClick={this.handleClick}>
                        <TwoHourChart
                            condition={condition}
                            department={department}
                            record={record}
                            type={type}>
                        </TwoHourChart>
                    </TabPane>
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