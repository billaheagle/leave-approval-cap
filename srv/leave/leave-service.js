const cds = require("@sap/cds");
const registerLeaveRequestHandlers = require("./handlers/leave-request.handlers");

module.exports = class LeaveService extends cds.ApplicationService {
    async init() {
        registerLeaveRequestHandlers(this);

        return super.init();
    }
};