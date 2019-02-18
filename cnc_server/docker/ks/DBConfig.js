module.exports = {
  dev: {
    url: '10.131.212.67:27017,10.131.212.68:27017/Dms_cnc_dev?replicaSet=dms'
  },
  product: {
    url: '10.131.212.67:27017,10.131.212.68:27017/Dms_cnc_dev?replicaSet=dms'
  }
}[process.env.NODE_ENV || "dev"];
