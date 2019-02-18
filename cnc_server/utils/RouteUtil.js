let fsUtil = require("./FSUtil");
let fs = require("fs");
let path = require("path");
let router = require("koa-router")({ prefix: "/api" });

class RouteUtil {
  //initial route dynamically.
  initRoute() {
    let api = path.join(__dirname, "../api");
    return fsUtil.readdir(api).then(dirs => {
      for (let dir of dirs) {
          try {
            if (fs.lstatSync(api + "/" + dir).isDirectory()) {
                let router0 = require("../api/" + dir + "/route");
                router.use(router0.routes(), router0.allowedMethods());
              }
          } catch (error) {
              console.error(error);
          }
        
      }
      return router.routes();
    });
  }
}

module.exports = new RouteUtil();
