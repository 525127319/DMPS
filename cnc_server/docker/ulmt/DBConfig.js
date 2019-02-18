module.exports = {
    dev: {
      url: 'mongodb:27017/Dms_cnc_dev?serverselectiontimeoutms=20000'
    },
    product: {
      url: 'mongodb:27017/Dms_cnc_dev?serverselectiontimeoutms=20000'
    }
  }[process.env.NODE_ENV || "dev"];
  