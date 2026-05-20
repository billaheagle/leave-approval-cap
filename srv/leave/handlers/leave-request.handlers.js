const cds = require("@sap/cds");

const SubmitLeave = require("../application/submit-leave");
const ApproveLeave = require("../application/approve-leave");
const RejectLeave = require("../application/reject-leave");
const LeaveRequestGuard = require("../domain/leave-request-guard");
const CurrentEmployee = require("../../common/auth/current-employee");
const LeaveStatus = require("../domain/leave-status");
const LeaveRequestRepository = require("../persistence/leave-request.repository");

module.exports = function registerLeaveRequestHandlers(srv) {
    const { LeaveRequests, LeaveApprovals, LeaveTypes } = srv.entities;

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

        req.data.Employee_ID = currentEmployee.ID;
        req.data.RequestDate = new Date();
    });

    srv.before(["UPDATE", "PATCH"], LeaveRequests, async (req) => {
        LeaveRequestGuard.ensureNoDirectLifecycleMutation(req);

        const ID = req.params?.[0]?.ID || req.data?.ID;

        if (!ID) {
            return;
        }

        const tx = cds.tx(req);
        const currentEmployee = await CurrentEmployee.get(req);

        const existingRequest = await LeaveRequestRepository.findById(tx, ID);

        if (!existingRequest) {
            req.reject(404, "Leave request not found.");
        }

        if (
            existingRequest.Employee_ID !== currentEmployee.ID &&
            !req.user.is("admin")
        ) {
            req.reject(
                403,
                "You can only edit your own leave request."
            );
        }

        if (existingRequest.Status !== LeaveStatus.DRAFTED) {
            req.reject(
                400,
                "Only drafted leave requests can be edited."
            );
        }
    });

    srv.before("DELETE", LeaveRequests, async (req) => {
        const ID = req.params?.[0]?.ID || req.data?.ID;

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        const tx = cds.tx(req);

        const currentEmployee = await CurrentEmployee.get(req);
        const leaveRequest = await LeaveRequestRepository.findById(tx, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        const isOwner = leaveRequest.Employee_ID === currentEmployee.ID;
        const isAdmin = req.user.is("admin");

        if (!isOwner && !isAdmin) {
            req.reject(
                403,
                "You can only delete your own leave request."
            );
        }

        if (leaveRequest.Status !== LeaveStatus.DRAFTED) {
            req.reject(
                400,
                "Only drafted leave requests can be deleted."
            );
        }
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

    srv.before(["CREATE", "UPDATE", "PATCH", "DELETE"], LeaveTypes, async (req) => {
        req.reject(
            400,
            "Leave types cannot be changed from Leave Service."
        );
    });
};