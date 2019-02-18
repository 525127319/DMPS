

import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import DepartmentUtil from '@/utils/DepartmentUtil';
import DeviceMonitorUtil from '@/utils/DeviceMonitorUtil';
import {status} from '@/utils/Config';
import './Home.scss';

// let data = {
//     "name": "flare",
//     "children": [
//      {
//       "name":"{a|这段文本采用样式\n}{b|好看的内容}",
//       "symbol": 'image://http://pic.58pic.com/58pic/12/36/51/66d58PICMUV.jpg',
//       symbolSize: [40, 40],
//       "label":{
//         "rich":{
//             a: {
//                 color: 'red',
//                 lineHeight: 30
//             },
//             b: {
//                 color: 'green',
//                 lineHeight: 30
//             }
//         }
//       },
//       "children": [
//        {
//         "name": "cluster",
//         "children": [
//          {"name": "AgglomerativeCluster", "value": 3938},
//          {"name": "CommunityStructure", "value": 3812},
//          {"name": "HierarchicalCluster", "value": 6714},
//          {"name": "MergeEdge", "value": 743}
//         ]
//        },
//        {
//         "name": "graph",
//         "children": [
//          {"name": "BetweennessCentrality", "value": 3534},
//          {"name": "LinkDistance", "value": 5731},
//          {"name": "MaxFlowMinCut", "value": 7840},
//          {"name": "ShortestPaths", "value": 5914},
//          {"name": "SpanningTree", "value": 3416}
//         ]
//        },
//        {
//         "name": "optimization",
//         "children": [
//          {"name": "AspectRatioBanker", "value": 7074}
//         ]
//        }
//       ]
//      }
//     ]
//    };
let option = null, myChart = null;
export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * @param {*} departments 
   * @param {*} object 
   */
  convert(departments, obj, departmentMonitorMap){
      let local = this, object = null, str, statusMap;
    departments.forEach(department=>{
        object = {};
        obj.children.push(object);
        let d = department.value.split('_');
        statusMap = departmentMonitorMap.get(d[d.length - 1]);
        str = this.mapStatus2String(department.label, statusMap);
        object.name = str;
        object.symbol = 'image://http://pic.58pic.com/58pic/12/36/51/66d58PICMUV.jpg',
        object.symbolSize = [40, 40];
        if (!department.children){
            object.value = department.value;
        }
        object.children = [];
        local.convert(department.children, object, departmentMonitorMap);
    });

  }

  async componentDidMount(){
    let departments = await DepartmentUtil.loadDepartment();
    let fn = function(departmentMonitorMap){
        this.draw(departments, departmentMonitorMap?departmentMonitorMap:new Map());
    }.bind(this);
    setInterval(()=>{
        DeviceMonitorUtil.loadMonitor().then(fn)
    }, 5000);
    
  }

  mapStatus2String(label, map){
    if (!map || map.size <= 0)return '';
    let tmp = null, str = '';
    map.forEach((value, key)=>{
        tmp = status[key]
        str += tmp+':'+value;
    });
    return label+ '\n'+str;
  }

  draw(departments, departmentMonitorMap){
    let object = {};
    let department = departments[0];
    let statusMap = departmentMonitorMap.get(department.value);
    let str = this.mapStatus2String(department.label, statusMap);
    object.name = str;
    object.symbol = 'image://http://pic.58pic.com/58pic/12/36/51/66d58PICMUV.jpg',
    object.symbolSize = [40, 40];
    object.children = [];
    this.convert(department.children, object, departmentMonitorMap);
    if (option){
       // option.series.data = [object];
        myChart.setOption({series:{
            data:[object]
        }});
        return;
    }

    let rendTo = document.getElementById('home-page');
    myChart = echarts.init(rendTo);
        option = {
            tooltip: {
                //trigger: 'item',
               // triggerOn: 'mousemove'
            },          
            series:[
                {
                    type: 'tree',
                    data: [object],
                    left: '2%',
                    right: '2%',
                    top: '20%',
                    //bottom: '20%',
                    symbol: 'emptyCircle',
                    orient: 'vertical',
                    expandAndCollapse: true,
                    initialTreeDepth: 5,
                    label: {
                        normal: {
                            position: 'top',
                            rotate: -90,
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 9
                        }
                    },
                    leaves: {
                        label: {
                            normal: {
                                position: 'bottom',
                                rotate: -90,
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        }
                    },
                    animationDurationUpdate: 750
                }
            ]
        };
        
        myChart.setOption(option);
  }

  render() {
    return (
      <div className="home-page" id="home-page" style={styles.status_height2}/>
    );
  }
}


const styles = {
    status_height: {
        height: '40px',
        margin:'6px 0'
    },

    status_height2: {
        height: '380px',
        width: '1200px'
    }
}