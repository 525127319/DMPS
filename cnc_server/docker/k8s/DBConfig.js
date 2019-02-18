module.exports = {
    dev: {
      url: 'mongo-server-test.imcloudep.com:27017/Dms_cnc'
    },
    product: {
      url: 'mongo-server-test.imcloudep.com:27017/Dms_cnc'
    }
  }[process.env.NODE_ENV || "dev"];
  