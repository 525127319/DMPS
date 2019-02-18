let mongoose = require('mongoose');

let DB_URL = null, timeout = null, db = null;
let users={
    userid:{type:Number},
    username:{type:String},
    city:{type:String},
  }
class DB {
//'mongodb://mongo-server-test.imcloudep.com:27017/Dms_cnc';
    constructor() {
        DB_URL = 'mongodb://172.16.1.239:40006,192.168.20.99:40006/Dms_cnc';
    }

    /**
     * you can configulation your connection here.
     */
    init() {
        this._connection();
        db = mongoose.connection;
       // db.set('debug', true)


        /**
         * 连接成功
         */
        db.on('open', async function () {
            console.log('Mongoose connection open to ' + DB_URL);
            let _user = await this.model();
            try {
                console.log(await _user.count());

            } catch (error) {
                console.log(error);
            }
            if (timeout)
                clearInterval(timeout);
        }.bind(this));

        // /**
        //  * 连接异常
        //  */
        db.on('error', function (err) {
            console.log('Mongoose connection error: ' + err);
        });

        // /**
        //  * 连接断开
        //  */
        // db.on('disconnected', function () {
        //     console.log('Mongoose connection disconnected');
        //     timeout = setTimeout(_db._connection, 60000);//retry connection。
        // });

    }

    _connection() {
        let options = {
            server: {
              auto_reconnect: true,
              poolSize: 200
            },
            mongos: true,
            useMongoClient: true,
          };
        let conn = mongoose.connect(DB_URL, options);
        mongoose.set('debug', function(coll, method, query, doc, options) {
            let set = {
                table: coll,
                method: method,
                query: query,
                doc: doc,
                options: options
            };
            // log.info({
            //     dbQuery: set
            // });
        });
        mongoose.set('error', true);
        // console.log(conn);
    }

    model(){
        let entityName  = 'users';
        let entity = users;
        let schema = mongoose.Schema(entity,{ versionKey: false });
        return db.model(entityName, schema, entityName);
    }

    create(entity){
        
    }

}

const _db = new DB();
_db.init();

module.exports = _db;
