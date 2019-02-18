/**
 * 定义应用路由
 */
import React from "react";
import {
  Router,
  // browserHistory,
  hashHistory
} from "react-router";

// 路由配置规则参考： https://github.com/ReactTraining/react-router/blob/v3/docs/guides/RouteConfiguration.md#configuration-with-plain-routes
// 一下部分是由 ICE 相关工具自动生成的路由，请勿随意改变，否则可能会出现一些异常情况
// <!-- auto generated routes start -->
import HeaderAsideFooterResponsiveLayout from "./layouts/HeaderAsideFooterResponsiveLayout";

import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import Location from "./pages/Location";
// 数据分析
// import Realtime from "./pages/Realtime";
import HistoricalData from "./pages/HistoricalData";
import Detail from "./pages/Realtime/components/components";
// 保养管理
import order from "./pages/Order";
import part from "./pages/Part";
import strategy from "./pages/Strategy";
import record from "./pages/MaintenanceRecords";
import forecast from "./pages/Forecast";
import demand from "./pages/Demand";
// 通用设置
import ClassList from "./pages/ClassList";
import CutterList from "./pages/CutterList";
import Department from "./pages/Department";
import EquipmentType from "./pages/EquipmentType";
// 报警信息
import Exception from "./pages/Exception";
import ExceptionEnd from "./pages/ExceptionEnd";
import ExceptionInfo from "./pages/ExceptionInfo";
// 程序管理
import Download from "./pages/Download";
import ProgramWrite from "./pages/ProgramWrite"; //程序写入
import ProgramRead from "./pages/ProgramRead"; //程序读取
import ProgramUseDetail from "./pages/ProgramUseDetail"; //程序使用情况
//统计-部门统计
import DepartmentStatistic from "./pages/DepartmentStatistic";
import DepartmentStatisticDetail from "./pages/DepartmentStatistic/components/StatisticDetail";

//统计-状态
import DayStatusStatistic from "@/pages/Status";

// 换刀设备

import ToolChangeDevice from "@/pages/ToolChange";

// 周统计 - 稼动率
import WeekStatisticEfficiency from "@/pages/WeekStatistic";//周统计
import MonthStatistic from "@/pages/MonthStatistic";//月统计
import QuarterStatistic from "@/pages/QuarterStatistic";//季度统计
import YearStatisticEfficiency from "@/pages/YearStatistic"; //年统计


//数据报表↓
import Devicestatement from "@/pages/Devicestatement";//设备组

import WeekStatementEfficiency from "@/pages/WeekStatement" //周报表
import SingleDeviceStatement from "@/pages/SingleDeviceStatement"

// 登录
// import Register from "./pages/Register"
import Login from './pages/Login';
import Loginforward from './components/loginforward';
import BlankLayout from './layouts/BlankLayout';

//home
import Home from './pages/Home/index';

//分仓
import Branchwms from './pages/Branchwms/index';
//部仓
import Generalwms from './pages/Generalwms/index';
//6小时刀具优化
import SixHour from './pages/SixHour/index';
//6小时刀具优化航班模式
import Schedule from './pages/Schedule/index';

//优化滞后
import CutterOptimize from './pages/CutterOptimize/index';

//op列表
import BlockList from './pages/Block/index';
//op详情
import BlockDetail from './pages/Block/components/BlockDetail';

//cell列表
import CellList from './pages/Cell/index';
//cell详情
import CellDetail from './pages/Cell/components/CellDetail';

//alarm列表--报警处理
import AlarmHandlerList from './pages/AlarmHandler/index';
//alarm详情--报警处理
import AlarmHandlerDetail from './pages/AlarmHandler/components/CellDetail';


import NotFound from "./pages/NotFound";

const autoGeneratedRoutes = [
  {
    path: '/login',
    childRoutes: [],
    component: BlankLayout,
    indexRoute: { component: Login },
  },
  {
    path: "/loginforward",
    childRoutes: [],
    component: BlankLayout,
    indexRoute: { component: Loginforward }
  },
  {
    path: "/deviceManager",
    childRoutes: [
      { path: "deviceList", childRoutes: [], component: DeviceList },
      { path: "layout", childRoutes: [], component: DepartmentStatistic }
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: DeviceList }
  },
  {
    path: "/realtime",
    childRoutes: [
      // { path: "list", childRoutes: [], component: Realtime },
      {
        path: "deviceList/deviceDetail/:id",
        childRoutes: [],
        component: Detail
      },
      { path: "history", childRoutes: [], component: HistoricalData }
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: DeviceList }
  },

  {
    path: "/statistic",
    childRoutes: [
      // { path: "list", childRoutes: [], component: Realtime },
      { path: "department", childRoutes: [], component: DepartmentStatistic },
      {
        path: "department/departmentDetail",
        childRoutes: [],
        component: DepartmentStatisticDetail
      },
      { path: "area", childRoutes: [], component: DepartmentStatistic },
      {
        path: "area/areaDetail",
        childRoutes: [],
        component: DepartmentStatisticDetail
      },
      { path: "daystatus", childRoutes: [], component: DayStatusStatistic },

      { path: "toolchange", childRoutes: [], component: ToolChangeDevice },

      { path: "weekstatistic", childRoutes: [], component: WeekStatisticEfficiency },

      { path: "monthstatistic", childRoutes: [], component: MonthStatistic },
      { path: "quarterstatistic", childRoutes: [], component: QuarterStatistic },
      { path: "yearStatistic", childRoutes: [], component: YearStatisticEfficiency },

    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: DeviceList }
  },

  {
    path: "/exception",
    childRoutes: [
      { path: "list", childRoutes: [], component: Exception },
      { path: "history", childRoutes: [], component: ExceptionEnd },
      { path: "rmation", childRoutes: [], component: ExceptionInfo }
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Exception }
  },
  {
    path: "/maintaince",
    childRoutes: [
      { path: "order", childRoutes: [], component: order },
      { path: "strategy", childRoutes: [], component: strategy },
      { path: "part", childRoutes: [], component: part },
      { path: "record", childRoutes: [], component: record },
      { path: "forecast", childRoutes: [], component: forecast },
      { path: "demand", childRoutes: [], component: demand }
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: order }
  },
  {
    path: "/setting",
    childRoutes: [
      { path: "ClassList", childRoutes: [], component: ClassList },
      { path: "Area", childRoutes: [], component: Location },
      { path: "Department", childRoutes: [], component: Department },
      { path: "EquipmentType", childRoutes: [], component: EquipmentType }, //设备类型
      { path: "cutter", childRoutes: [], component: CutterList },
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: ClassList }
  },
  {
    path: "/program",
    childRoutes: [
      { path: "Download", childRoutes: [], component: Download }, //上传下载
      { path: "programWrite", childRoutes: [], component: ProgramWrite }, //程序写入
      { path: "programRead", childRoutes: [], component: ProgramRead }, //程序读取
      { path: "programUseDetail", childRoutes: [], component: ProgramUseDetail } //程序的使用情况
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Download }
  },
  // 数据报表
  {
    path:"/statement",
    childRoutes:[
      { path: "Devicestatement", childRoutes: [], component: Devicestatement }, //设备组
      { path: "weekstatement", childRoutes: [], component: WeekStatementEfficiency }, //周报表
      { path: "SingleDeviceStatement", childRoutes: [], component: SingleDeviceStatement },//单设备

    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Download }
  },
  {
    path: "/",
    childRoutes: [{ childRoutes: [], component: Dashboard }],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Dashboard }
  },
  {
    path: "/index",
    childRoutes: [{ childRoutes: [], component: Dashboard }],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Dashboard }

  },
  {
    path: "/tool/branchwms",
    childRoutes: [{ childRoutes: [], component: Branchwms }],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Branchwms }

  },  
  {
    path: "/tool/generalwms",
    childRoutes: [{ childRoutes: [], component: Generalwms }],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: Generalwms }
  },
  {
      path: "/tool/sixhour",
      childRoutes: [{ childRoutes: [], component: SixHour }],
      component: HeaderAsideFooterResponsiveLayout,
      indexRoute: { component: SixHour }
  },
  {
      path: "/tool/schedule",
      childRoutes: [{ childRoutes: [], component: Schedule }],
      component: HeaderAsideFooterResponsiveLayout,
      indexRoute: { component: Schedule }
  },
  {
    path: "/technical",
    childRoutes: [
        { path: 'oplist', childRoutes: [], component: BlockList },
        {
            path: "opdetail/:id",
            childRoutes: [],
            component: BlockDetail
        },
        { path: 'celllist', childRoutes: [], component: CellList },
        {
            path: "celldetail/:id",
            childRoutes: [],
            component: CellDetail
        },
        { path: 'alarmhandlerlist', childRoutes: [], component: AlarmHandlerList },
        {
            path: "alarmhandlerdetail/:id",
            childRoutes: [],
            component: AlarmHandlerDetail
        }
    ],
    component: HeaderAsideFooterResponsiveLayout,
    indexRoute: { component: BlockList }
    
},
{
  path: "/tool/optimize",
  childRoutes: [{ childRoutes: [], component: CutterOptimize }],
  component: HeaderAsideFooterResponsiveLayout,
  indexRoute: { component: CutterOptimize }
},

];

// <!-- auto generated routes end -->

// 自定义路由，如果 path 相同则会覆盖自动生成部分的路由配置
const customRoutes = [];

export default (
  <Router
    history={hashHistory}
    routes={[...autoGeneratedRoutes, ...customRoutes]}
  />
);
