let equipmentTypeList = {
  name: { type: String },
  type: { type: String },
  model: { type: String },
  contact: { type: String },
  website: { type: String },
  UploadFileUrl: { type: String },
};
equipmentTypeList.getTableName = () => {
  return "equipment_type_list";
};
module.exports = equipmentTypeList;
