let devicepayload = {
    dev_id: {type: String},
    time: {type: Number},
    type: {type: String},
    data: {type: Number}
  }
  devicepayload.getTableName = () => {
    return 'device_payload_data';
  }
  module.exports = devicepayload;
  