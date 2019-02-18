const fsExtra = require("fs-extra");

class UpdateDay{

    readFile(filePath){
        return fsExtra.readFileSync(filePath);
    }

    updateBuild(){
        let str = this.readFile('src/layouts/HeaderAsideFooterResponsiveLayout/Layout.jsx');
        str = str.toString();
        let day = new Date();
        let month = day.getMonth();
        if (month < 10){
            month = '0'+(month + 1);
        }
        day = day.getDate();
        if (day < 10){
            day = '0' + day;
        }
        day = month + day
        //console.log(day.getMonth());
        //console.log(day.getDate());
        str = str.replace(/build\s\d*/i, 'build '+day);
        fsExtra.writeFileSync('src/layouts/HeaderAsideFooterResponsiveLayout/Layout.jsx', str);
       // console.log(str);
    }

}
let o = new  UpdateDay();
o.updateBuild();