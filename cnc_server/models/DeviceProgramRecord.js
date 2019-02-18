let deviceprogramrecord = {
  department: { type: String },
  dev_id: { type: Number },
  location: { type: String },
  name: { type: String },
  program: { type: String },
  supplier_id: { type: String },
  time: { type: String },
  describe: { type: String },
  developer: { type: String },
  edition: { type: String },
  fileUrl: { type: String },
  programName: { type: String },
  writeTime: { type: String },
  writeInTime: { type: String },
  writeState: { type: Number } //0 正在读入 1读入完毕
};
deviceprogramrecord.getTableName = () => {
  return "device_progra_record";
};
module.exports = deviceprogramrecord;
