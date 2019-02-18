module.exports = {
  dev: {
    ip: "dmsmongoserver",
    port: "27017",
    name: "Dms_cnc"
  },
  product: {
    ip: "dmsmongoserver",
    port: "27017",
    name: "Dms_cnc"
  }
}[process.env.NODE_ENV || "dev"];
