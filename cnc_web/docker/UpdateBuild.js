const fsExtra = require("fs-extra");

class UpdateBuild{

    readFile(filePath){
        return fsExtra.readFileSync(filePath);
    }

    updateBuild(){
        let str = this.readFile('build/index.html');
        str = str.toString();
        str = str.replace('/css/index.css', './css/index.css');
        str = str.replace('/js/index.js', './js/index.js');
        fsExtra.writeFileSync('build/index.html', str);
    }

}
let o = new  UpdateBuild();
o.updateBuild();