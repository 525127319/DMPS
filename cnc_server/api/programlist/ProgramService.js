const BasicService = require("../../services/BasicService");
const ProgramListInfo= require("../../models/ProgramList");
class ProgramService extends BasicService {
  constructor() {
    super(ProgramListInfo);
  }
}
module.exports = new ProgramService();
