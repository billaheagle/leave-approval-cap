const SubmitLeave = require("../application/submit-leave");
const ApproveLeave = require("../application/approve-leave");
const RejectLeave = require("../application/reject-leave");

module.exports = function registerLeaveRequestHandlers(srv) {
    const { LeaveRequests } = srv.entities;

    srv.on("submit", LeaveRequests, async (req) => {
        return SubmitLeave.execute(req, srv);
    });

    srv.on("approve", LeaveRequests, async (req) => {
        return ApproveLeave.execute(req, srv);
    });

    srv.on("reject", LeaveRequests, async (req) => {
        return RejectLeave.execute(req, srv);
    });
};