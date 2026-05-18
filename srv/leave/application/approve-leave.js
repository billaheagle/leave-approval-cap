const cds = require("@sap/cds");

const LeaveRequestRepository = require("../persistence/leave-request.repository");
const LeaveApprovalRepository = require("../persistence/leave-approval.repository");

const LeaveStatus = require("../domain/leave-status");
const ApprovalTransition = require("../domain/approval-transition");

const CurrentEmployee = require("../../common/auth/current-employee");

const getRequestId = (req) => req.params?.[0]?.ID || req.data?.ID;

module.exports = {
    async execute(req) {
        const ID = getRequestId(req);
        const { Comments } = req.data || {};

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        const tx = cds.tx(req);

        const approver = await CurrentEmployee.get(req);

        const leaveRequest = await LeaveRequestRepository.findById(tx, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        if (leaveRequest.IsClosed) {
            req.reject(400, "Leave request is already closed.");
        }

        if (leaveRequest.Status !== LeaveStatus.INPROGRESS) {
            req.reject(
                400,
                `Leave request cannot be approved while status is '${leaveRequest.Status}'.`
            );
        }

        const currentApproval =
            await LeaveApprovalRepository.findCurrentPendingByRequestId(tx, ID);

        if (!currentApproval) {
            req.reject(
                400,
                "No pending approval found for this leave request."
            );
        }

        if (currentApproval.Approver_ID !== approver.ID) {
            req.reject(
                403,
                "You are not the current approver for this leave request."
            );
        }

        const decisionDate = new Date();

        await LeaveApprovalRepository.update(tx, currentApproval.ID, {
            Decision: LeaveStatus.APPROVED,
            IsCurrent: false,
            DecisionDate: decisionDate,
            Comments: Comments || "Approved"
        });

        const nextApproval =
            await LeaveApprovalRepository.findNextWaitingByRequestId(
                tx,
                ID,
                currentApproval.StepNo
            );

        if (nextApproval) {
            await LeaveApprovalRepository.update(tx, nextApproval.ID, {
                Decision: LeaveStatus.PENDING,
                IsCurrent: true
            });

            return {
                Status: LeaveStatus.INPROGRESS,
                CurrentStepNo: nextApproval.StepNo
            };
        }

        ApprovalTransition.ensureCanMove(
            req,
            leaveRequest.Status,
            LeaveStatus.APPROVED
        );

        await LeaveRequestRepository.update(tx, ID, {
            Status: LeaveStatus.APPROVED,
            IsClosed: true
        });

        return {
            Status: LeaveStatus.APPROVED,
            IsClosed: true
        };
    }
};