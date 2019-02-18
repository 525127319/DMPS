let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let classdata = {
  time: {type: Number},
  shift_id:{type:String},
  name: {type: String},
  shift:[
      
  ],
  rest_time:[],
  obj:{},
  begin_time:{type: Number},
  end_time:{type: Number},
  data: { type: Schema.Types.Mixed },

};
classdata.getTableName = () => {
  return "shift_data";
};
module.exports = classdata;
