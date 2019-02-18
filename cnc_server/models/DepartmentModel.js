let DepartmentModel = {
    type: { type: String },//内容类型： department,  location
    ts: {type:Number},//timestamp
    data: {type: Object},
    addscalss:{type: String },
    shift_id:{type: String }
}
DepartmentModel.getTableName = ()=>{
    return 'department';
}
module.exports = DepartmentModel;
