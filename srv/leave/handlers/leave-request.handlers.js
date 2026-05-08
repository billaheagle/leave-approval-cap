const SubmitLeave = require("../application/submit-leave");
const ApproveLeave = require("../application/approve-leave");
const RejectLeave = require("../application/reject-leave");
const LeaveRequestGuard = require("../domain/leave-request-guard");

module.exports = function registerLeaveRequestHandlers(srv) {
    const { LeaveRequests, LeaveApprovals } = srv.entities;

    srv.before("CREATE", LeaveRequests, async (req) => {
        LeaveRequestGuard.ensureCreateAllowed(req);
    });

    srv.before(["UPDATE", "PATCH"], LeaveRequests, async (req) => {
        LeaveRequestGuard.ensureNoDirectLifecycleMutation(req);
    });

    srv.before(["CREATE", "UPDATE", "PATCH", "DELETE"], LeaveApprovals, async (req) => {
        req.reject(
            400,
            "Leave approval history cannot be changed directly. Use approve or reject action."
        );
    });

    srv.on("submit", LeaveRequests, async (req) => {
        return SubmitLeave.execute(req);
    });

    srv.on("approve", LeaveRequests, async (req) => {
        return ApproveLeave.execute(req);
    });

    srv.on("reject", LeaveRequests, async (req) => {
        return RejectLeave.execute(req);
    });
};