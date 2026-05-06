const cds = require("@sap/cds");

const LeaveRequestRepository = require("../persistence/leave-request.repository");
const LeaveApprovalRepository = require("../persistence/leave-approval.repository");
const LeaveStatus = require("../domain/leave-status");
const LeaveTransition = require("../domain/leave-transition");
const CurrentEmployee = require("../../common/auth/current-employee");

const getRequestId = (req) => req.params?.[0]?.ID || req.data?.ID;

module.exports = {
    async execute(req, srv) {
        const ID = getRequestId(req);
        const { Comments } = req.data;

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        if (!req.user.is("manager")) {
            req.reject(403, "Only manager can reject leave request.");
        }

        const tx = cds.tx(req);

        const approver = await CurrentEmployee.get(req);

        const leaveRequest = await LeaveRequestRepository.findById(tx, srv, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        LeaveTransition.ensureCanMove(
            req,
            leaveRequest.Status,
            LeaveStatus.REJECTED
        );

        const approvalDate = new Date();

        await LeaveRequestRepository.updateStatus(tx, srv, ID, {
            Status: LeaveStatus.REJECTED
        });

        await LeaveApprovalRepository.insert(tx, srv, {
            LeaveRequest_ID: ID,
            Approver_ID: approver.ID,
            Decision: LeaveStatus.REJECTED,
            ApprovalDate: approvalDate,
            Comments: Comments || "Rejected"
        });

        return {
            Status: LeaveStatus.REJECTED
        };
    }
};