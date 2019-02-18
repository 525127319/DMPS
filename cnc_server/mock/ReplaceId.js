let fs = require('fs');
var readline = require('readline');  
let fRead = fs.createReadStream('./test/device.json');  
var objReadline = readline.createInterface({  
    input: fRead
});

let _contents = [];
objReadline.on('line', line=>{
    let _a = JSON.parse(line);
    delete _a['_id']
    _contents.push(_a);
});

objReadline.on('close', ()=>{  
    fs.writeFileSync('./test/device2.json', JSON.stringify(_contents));
});  