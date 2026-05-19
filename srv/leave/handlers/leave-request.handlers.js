const SubmitLeave = require("../application/submit-leave");
const ApproveLeave = require("../application/approve-leave");
const RejectLeave = require("../application/reject-leave");
const LeaveRequestGuard = require("../domain/leave-request-guard");
const CurrentEmployee = require("../../common/auth/current-employee");

module.exports = function registerLeaveRequestHandlers(srv) {
    const { LeaveRequests, LeaveApprovals } = srv.entities;

    srv.before("CREATE", LeaveRequests, async (req) => {
        const currentEmployee = await CurrentEmployee.get(req);

        if (
            req.data.Employee_ID &&
            req.data.Employee_ID !== currentEmployee.ID &&
            !req.user.is("admin")
        ) {
            req.reject(
                403,
                "You cannot create leave request for another employee."
            );
        }

        LeaveRequestGuard.ensureCreateAllowed(req);

        /* if (req.user.is("admin") && req.data.Employee_ID) {
            // keep provided employee
        } else {
            req.data.Employee_ID = currentEmployee.ID;
        } */

        req.data.Employee_ID = currentEmployee.ID;

        req.data.RequestDate = new Date();
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