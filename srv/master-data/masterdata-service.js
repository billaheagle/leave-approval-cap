const cds = require("@sap/cds");
const employeeHandlers = require("./handlers/employee.handlers");
module.exports = class MasterDataService extends cds.ApplicationService {
    async init() {
        employeeHandlers(this);

        return super.init();
    }
};