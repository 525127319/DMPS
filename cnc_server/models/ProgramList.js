let programListInfo = {
  programName: { type: String },
  edition: { type: String },
  developer: { type: String },
  describe: { type: String },
  fileUrl: { type: String },
  writeTime: { type: String },
  time: { type: Number }
};
programListInfo.getTableName = () => {
  return "program_list_info";
};
module.exports = programListInfo;
