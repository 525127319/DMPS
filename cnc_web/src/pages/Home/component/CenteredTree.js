import React from "react";
import Tree from "react-d3-tree";
import OrgNodeLabel from './OrgNodeLabel';
import ShiftUtil from '@/utils/ShiftUtil.js';
import { Moment } from "@icedesign/base"
import './CenteredTree.css';
// import Title from '../../Status/component/TitleHome';
const debugData = [
    {
        name: "集团",
        children: [
            {
                name: "A厂",
                children: [
                    {
                        name: "X产品线",
                        children: [
                            {
                                name: "1号工站"
                            },
                            {
                                name: "2号工站"
                            }
                        ]
                    },
                    {
                        name: "Y产品线",
                        children: [
                            {
                                name: "1号工站"
                            },
                            {
                                name: "2号工站"
                            }
                        ]
                    }
                ]
            },
            {
                name: "B厂",
                children: [
                    {
                        name: "5车间",
                        children: [
                            {
                                name: "1号工站"
                            },
                            {
                                name: "2号工站"
                            }
                        ]
                    },
                    {
                        name: "7车间",
                        children: [
                            {
                                name: "1号工站"
                            },
                            {
                                name: "2号工站"
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

let debugData0 = [{ "name": "集团", 
    "children": [
        { "name": "日沛", "children": [{ "name": "T2-3F_WestPoint_WF", 
            "children": [{ "name": "夹位CNC4"}, { "name": "夹位CNC3" }] }, 
            { "name": "T3-2F_Standford_4G", "children": [{ "name": "夹位CNC8"}, { "name": "夹位CNC7"}] }] }, 
        { "name": "日铭", "children": [{ "name": "M8-2F_FlashDH", 
            "children": [{ "name": "夹位CNC4" }, { "name": "夹位CNC3"}] }, 
            { "name": "M8-3F_BatmanTC", "children": [{ "name": "夹位CNC5"}, { "name": "夹位CNC4"}] }] }] }];

const containerStyles = {
    width: '100%',
    height: '100vh',
}

const nodeSvgShape =
{
    "shape": "none",
    "shapeProps": {
        fill: "#52e2c5",
        "r": 10
    }
}

/*const nodeSvgShape = {
  shape: 'path',
  shapeProps: {
    height:"20",
    width:"40",
    fill:"#ABDCFF;",  
    d:"M480,480V336h-16v-48h-24v-91.304c5.048-8.408,8-18.2,8-28.696c0-19.864-10.432-37.304-26.064-47.248l-72.312-80.808     C342.704,16.872,321.296,0,296,0c-19.648,0-36.936,10.2-46.936,25.56l-93.16,88.496c-8.312,7.896-12.976,18.56-13.128,30.024     c-0.104,8.352,2.256,16.32,6.648,23.184l-43.08,43.08l11.312,11.312l42.832-42.832c7.312,5.256,15.848,8.016,24.456,8.008     c10.232,0,20.488-3.728,28.608-11.224l70.368-64.96c2.408,0.536,4.872,0.904,7.392,1.112l44.976,50.592     C336.096,164.216,336,166.096,336,168c0,10.496,2.96,20.288,8,28.696V288h-24v48h-16v144H160V336h-16v-16h16v-16h-16.808     c-3.72-18.232-19.872-32-39.192-32H32v32H16v16h16v16H16v144H0v16h16h144h144h176h16v-16H480z M48,288h56     c10.416,0,19.216,6.712,22.528,16H48V288z M48,320h80v16H48V320z M144,400h-16v16h16v64H32v-64h80v-16H32v-48h112V400z M432,168     c0,22.056-17.944,40-40,40c-22.056,0-40-17.944-40-40c0-22.056,17.944-40,40-40C414.056,128,432,145.944,432,168z M424,213.888     V288h-64v-74.112C369.08,220.24,380.104,224,392,224S414.92,220.24,424,213.888z M202.704,163.848     c-10.368,9.568-26.28,9.256-36.256-0.72c-5.032-5.032-7.76-11.728-7.664-18.84s2.984-13.736,8.144-18.632l73.088-69.44     c0.08,20.352,11.096,38.128,27.44,47.864L202.704,163.848z M295.944,96C273.912,95.96,256,78.032,256,56     c0-22.056,17.944-40,40-40c22.056,0,40,17.944,40,40c0,22.04-17.928,39.976-39.968,40H295.944z M341.44,144.088l-30.4-34.2     c20.568-5.752,36.36-22.952,40.072-44.288l41.544,46.432c-0.216,0-0.432-0.032-0.656-0.032     C369.688,112,350.432,125.152,341.44,144.088z M336,304h8h96h8v32H336V304z M464,480H320V352h144V480z"
  }
}*/

//间距
const separation = {
    siblings: 1.6,
    nonSiblings: 1.6
}
//线
const styles = {
    links:{
        stroke:'#fff',
        strokeWidth:1
    }
}
export default class CenteredTree extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            translate:{
                x:880,
                y:180
            },
            className:'',
            
        }
    }
    componentWillMount(){
        ShiftUtil.getShift().then(res=>{
            console.log(res,'res')
            this.setState({className : res.className})
        });
    }
    componentDidMount() {
        if (!this.treeContainer) return;
        const dimensions = this.treeContainer.getBoundingClientRect();
       
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 4
            }
        });
    }

    render() {
        console.log(this.state.className,'className')
        let dateTime = Moment().format('YYYY-MM-DD')
        let { datasorce } = this.props;
        if (!datasorce) return ('');
        return (
            <div style={containerStyles} ref={tc => (this.treeContainer = tc)} className="bg">
                <h1 className='bg-top'>
                     {dateTime}
                     <span>{this.state.className}</span>
                     <strong>全景看板</strong> 
                </h1>
                <nav className="data-nav">
                   

                    <ul className="data-f">
                        {/* <li>
                            <span className='b'>设备总数</span>
                        </li> */}
                        <li>
                            <span className="white">状态：</span>
                        </li>
                        <li>
                            <span className='g square' >运行</span>
                        </li>
                        <li>
                            <span className='j square'>空闲</span>
                        </li>
                        <li>
                            <span className='blue square'>调试</span>
                        </li>
                        <li>
                            <span className='r square'>报警</span>
                        </li>
                        <li>
                            <span className='gray square'>未连接</span>
                        </li>
                    </ul>
                    <ul className='data-top'>
                        <li>
                            <span className="white">报警：  当班报警总次数， 当班报警总时长</span>
                        </li>
                        
                    </ul>
                    <ul className='data-top'>
                        <li>
                            <span className="white">异常： 当班异常加工总次数 / 当班加工总次数</span>
                        </li>
                      
                    </ul>
                </nav>
                <Tree
                    data={datasorce}
                    allowForeignObjects
                    translate={this.state.translate}
                    orientation={'vertical'}
                    nodeSvgShape={nodeSvgShape}
                    separation={separation}
                    pathFunc={"elbow"}
                    initialDepth={3}
                    styles={styles}
                    nodeLabelComponent={{
                        render: <OrgNodeLabel className='roundedRectangle' />,
                        foreignObjectWrapper: {
                            x: -120,
                            y: -55,
                            width:245
                        }
                    }}
                />
            </div>
        );
    }
}
