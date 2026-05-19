const cds = require("@sap/cds");

const CurrentEmployee = require("../../common/auth/current-employee");
const LeaveRequestRepository = require("../persistence/leave-request.repository");
const LeaveApprovalRepository = require("../persistence/leave-approval.repository");

const LeaveStatus = require("../domain/leave-status");
const LeaveRequestNumber = require("../domain/leave-request-number");
const LeaveTransition = require("../domain/leave-transition");

const GenerateLeaveRequestNumber = require("./generate-leave-request-number");
const BuildManagerHierarchy = require("./build-manager-hierarchy");

const getRequestId = (req) => req.params?.[0]?.ID || req.data?.ID;

module.exports = {
    async execute(req) {
        const ID = getRequestId(req);

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        const tx = cds.tx(req);

        const leaveRequest = await LeaveRequestRepository.findById(tx, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        const currentEmployee = await CurrentEmployee.get(req);

        if (leaveRequest.Employee_ID !== currentEmployee.ID && !req.user.is("admin")) {
            req.reject(
                403,
                "You can only submit your own leave request."
            );
        }

        LeaveTransition.ensureCanMove(
            req,
            leaveRequest.Status,
            LeaveStatus.INPROGRESS
        );

        const hasGeneratedRequestNumber =
            leaveRequest.RequestNumber &&
            leaveRequest.RequestNumber !== LeaveRequestNumber.DEFAULT_REQUEST_NUMBER;

        const requestNumber = hasGeneratedRequestNumber
            ? leaveRequest.RequestNumber
            : await GenerateLeaveRequestNumber.execute(tx);

        const approvalHierarchy = await BuildManagerHierarchy.build(
            req,
            tx,
            leaveRequest.Employee_ID
        );

        const approvalRows = approvalHierarchy.map((item, index) => ({
            LeaveRequest_ID: ID,
            StepNo: item.StepNo,
            Approver_ID: item.Approver_ID,
            IsCurrent: index === 0,
            Decision: index === 0
                ? LeaveStatus.PENDING
                : LeaveStatus.WAITING
        }));

        const existingApprovals = await LeaveApprovalRepository.findByLeaveRequestId(tx, ID);

        if (existingApprovals.length > 0) {
            req.reject(
                400,
                "Approval workflow has already been generated for this leave request."
            );
        }

        await LeaveApprovalRepository.insertMany(tx, approvalRows);

        await LeaveRequestRepository.update(tx, ID, {
            RequestNumber: requestNumber,
            Status: LeaveStatus.INPROGRESS,
            IsClosed: false,
            RequestDate: new Date()
        });

        return {
            Status: LeaveStatus.INPROGRESS,
            RequestNumber: requestNumber
        };
    }
};