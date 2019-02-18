// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [];

// <!-- auto generated navs end -->
const customHeaderNavs = [
  {
    text: '首页',
    to: '/',
    icon: 'home',
  },
  // {
  //   text: '反馈',
  //   to: 'https://github.com/alibaba/ice',
  //   external: true,
  //   newWindow: true,
  //   icon: 'message',
  // },
  // {
  //   text: '帮助',
  //   to: 'https://alibaba.github.io/ice',
  //   external: true,
  //   newWindow: true,
  //   icon: 'bangzhu',
  // },
];

const customAsideNavs = [
    // {
    //     text: "全景看板",
    //     to: "/",
    //     icon: "home"
    //   },
    {
    text: "设备看板",
    to: "/index",
    icon: "home"
  },
  {
    text: "设备管理",
    to: "/deviceManager",
    icon: "cascades",
    children: [
      { text: "设备列表", to: "/deviceManager/deviceList" },
     // { text: "位置布局", to: "/deviceManager/layout" } //这个移除
      // { text: '當天數據', to: '/realtime/list' },//當天數據，所有，包括現在正在使用的程序
    ]
  },
  {
    text: "设备统计", //主要是数据统计（产量， CT， 开机率，程序使用记录）除了令天的數據，都在這裏
    to: "/statistic",
    icon: "chart",
    children: [
      // { text: "实时数据", to: "/realtime/list" }, //只关注本周的统计
     // { text: "根据区域", to: "/statistic/area" },  
     // { text: "程序统计", to: "/program/programUseDetail" },
    //  { text: "历史程序", to: "/program/historyprog" },  
     // { text: "根据人员", to: "/statistic/people" }, //上周以前的
      
      { text: "状态统计", to: "/statistic/daystatus" },


      { text: "日统计", to: "/statistic/department" },  

      { text: "周统计", to: "/statistic/weekstatistic"}, //  周统计

      { text: "月统计", to: "/statistic/monthstatistic"},//月统计

      // { text: "季度统计", to: "/statistic/quarterstatistic"},//月统计
      { text: "年统计", to: "/statistic/yearstatistic"}, //  年统计

      
      //{ text: "设备数据", to: "/realtime/history" } //上周以前的
      // { text: '程序统计', to: '/statistic/program' },//程序统计，每个程序的产量， 每个程序&每个机台的产量， 优先级
    ]
  },
  // {
  //   text: "数据报表", //主要是数据统计（产量， CT， 开机率，程序使用记录）除了令天的數據，都在這裏
  //   to: "/statement",
  //   icon: "chart",
  //   children: [
  //     { text: "单设备", to: "/statement/singledevicestatement" },  //单设备报表

  //     { text: "设备组", to: "/statement/devicestatement"}, //  设备组报表

  //     { text: "周报表", to: "/statement/weekstatement"},//周报表
  //   ]
  // },
  // {
  //   text: '實時數據',
  //   to: '/realtime',
  //   icon: 'cascades',
  //   children: [
  //     { text: '機臺信息', to: '/realtime/list' },
  //   ],
  // },
  {
    text: "刀具报表",
    to: "/tool",
    icon: "daoju",
    children: [
       { text: "实时预测报表", to: "/statistic/toolchange"}, // 换刀设备
      { text: "总仓装刀报表", to: "/tool/generalwms" }, //根据总仓
      { text: "分仓备刀报表", to: "/tool/branchwms" }, //根据报表统计
       { text: "技术员换刀报表", to: "/tool/sixhour" }, //根据报表统计
      { text: "换刀时刻表", to: "/tool/schedule" },
      { text: "优化滞后报表", to: "/tool/optimize" },
    ]
  },
  {
    text: "人员分析",
    to: "/technical",
    icon: "js",
    children: [
      { text: "OP待机换料", to: "/technical/oplist" }, //跳转到Op的列表
      { text: "技术员换刀", to: "/technical/celllist" }, //跳转到CELL的详情
      { text: "技术员异常处理", to: "/technical/alarmhandlerlist" }, //跳转到CELL的详情
    ]
    
  },
  {
    text: "报警统计",
    to: "/exception",
    icon: "notice",
    children: [
      { text: "报警详情", to: "/exception/list" }, //正在处理异常的机台
      // { text: "已处理", to: "/exception/history" }, //过去异常的机台
      { text: "报警分析", to: "/exception/rmation" },
      //{ text: '程序异常', to: '/exception/program' }//，是实时|历史异常的一种
    ]
  },
 
  // {
  //   text: '刀具壽命',//優先級低
  //   to: '/knife',
  //   icon: 'hourglass',
  //   children: [
  //     { text: '壽命定義', to: '/knife/define'},
  //     { text: '壽命預警', to: '/knife/download'},
  //   ],
  // },
  // {
  //   text: "程序管理",
  //   to: "/program",
  //   icon: "qrcode",
  //   children: [
  //     { text: "上传下载", to: "/program/download" }, //被应用到那些机上的跟踪
  //     { text: "设备程序写入", to: "/program/programWrite" }, //获取机台的程序
  //   //   { text: "程序对比结果", to: "/program/compareresult" }, //中间件对比结果
  //    // { text: "程序使用情况", to: "/program/programUseDetail" }//程序的使用情况
  //   ]
  // },
//   {
//     text: "保养管理",
//     to: "/maintaince",
//     icon: "repair",
//     children: [
//         { text: "零件定义", to: "/maintaince/part" }, //零件定義
//         { text: "策略定义", to: "/maintaince/strategy" }, //策略定義
//         { text: "预估保养", to: "/maintaince/forecast" }, //预估保养
//         { text: "保养订单", to: "/maintaince/order" }, //保養定單， 零件需求跟蹤也在這裏面
//         { text: "零件需求表", to: "/maintaince/demand" }, //零件需求表
//         { text: "保养记录", to: "/maintaince/record" }, //保养记录
//     ]
//   },
//   {
//     text: "通用设置",
//     to: "/setting",
//     icon: "shezhi",
//     children: [
//       { text: "班别定义", to: "/setting/ClassList" },
//       { text: "部门定义", to: "/setting/department" },
//       { text: "区域定义", to: "/setting/area" },
//       { text: "类型定义", to: "/setting/EquipmentType" },
//       { text: "刀具定义", to: "/setting/cutter" }
//     ]
//   }
  // {
  //   text: '用户管理',
  //   to: '/user',
  //   icon: 'yonghu',
  //   children: [
  //     { text: '用户列表', to: '/user/list' },
  //     { text: '添加用户', to: '/user/create' },
  //     { text: '修改密码', to: '/user/pwd' },
  //   ],
  // },
  // {
  //   text: '通用设置',
  //   to: '/setting',
  //   icon: 'shezhi',
  //   children: [
  //     { text: '基础设置', to: '/setting/basic' },
  //     {
  //       text: '菜单设置',
  //       to: '/setting/navigation',
  //     },
  //   ],
  // },
];

function transform(navs) {
  // custom logical
  return [...navs];
}

export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);

export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
