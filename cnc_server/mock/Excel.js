var xlsx = require('node-xlsx');
var fs = require('fs');

var tree = {
    '集团': {'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
        {'名称': '日沛', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
                
                    {'名称': 'T2-3F_WestPoint_WF', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
                        {'名称': '夹位CNC4', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5},
                        {'名称': '夹位CNC3', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}
                    ]}
                ,
                
                    {'名称': 'T3-2F_Standford_4G', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
                         {'名称': '夹位CNC8', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5},
                        {'名称': '夹位CNC7','工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}
                    ]}
                
            ]}
        ,
        // {'name': '日铭', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
        //         {
        //             'M8-2F_FlashDH':{'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
        //                 {'夹位CNC4': {'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}},
        //                 {'夹位CNC3': {'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}}
        //             ]}
        //         },
        //         {
        //             'M8-3F_BatmanTC':{'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
        //                 {'夹位CNC5': {'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}},
        //                 {'夹位CNC4': {'工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}}
        //             ]}
        //         }
        //     ]}
    ]}
}


// var data = [
//     {
//         name: 'sheet1',
//         data: [
//             [
//                 'ID',
//                 'Name',
//                 'Score'
//             ],
//             [
//                 '',
//                 'Michael',
//                 '99'

//             ],
//             [
//                 '2',
//                 'Jordan',
//                 '98'
//             ]
//         ]
//     },
//     {
//         name: 'sheet2',
//         data: [
//             [
//                 'AA',
//                 'BB'
//             ],
//             [
//                 '23',
//                 '24'
//             ]
//         ]
//     }
// ]



var data = [
   
]

let group =  tree.集团;
let _t = [], _t2=[];
//处理集团
for (let key in group){
    if (key == 'children'){
        continue;
    }
    _t.push(key);
    _t2.push(group[key]);
}
data.push({name: '集团', data: [_t, _t2]});

//处理工厂
/**
 * 
 * @param parentName
                    {'名称': 'T2-3F_WestPoint_WF', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5, children: [
                        {'名称': '夹位CNC4', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5},
                        {'名称': '夹位CNC3', '工作时长（h）':1, '开机时长（h）': 2, '稼动率（%）': 3, '异常总数': 4, '总产量': 5}
                    ]}}  
 * @param {*} children 
 */
let handleFactory = (parentName, children, array)=>{
    let _t = null, name, _children = null;
    children.forEach(item=>{
        _t = [];
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                const element = item[key];
                if ('名称' == key){
                    name = parentName+'->('+element+')'
                    _t.push(name);
                } else if ('children' == key){
                    _children = element;
                } else {
                    _t.push(element);
                }
            }
        }
        array.push(_t);
        if (_children)
            handleFactory(name, _children, array);
    });
 
   
}
let factories = group.children;
let factory = null, children;
factories.forEach((factory)=>{
    console.log(factory);
    children = factory.children;
    _t = [], _t2 = [];
    for (let key in factory){
        if (key == 'children'){
            continue;
        }
        _t.push(key);
        _t2.push(factory[key]);
    }
    let array = []
    handleFactory(factory['名称'], children, array);
    array = [_t, _t2].concat(array);
    data.push({name:factory.name, data: array});
});





// 写xlsx
var buffer = xlsx.build(data);
fs.writeFile('./resut.xlsx', buffer, function (err) {
    if (err)
        throw err;
    console.log('Write to xls has finished');

    // 读xlsx
    var obj = xlsx.parse("./" + "resut.xlsx");
    console.log(JSON.stringify(obj));
}
);