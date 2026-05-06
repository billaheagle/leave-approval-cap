const cds = require("@sap/cds");

const LeaveRequestRepository = require("../persistence/leave-request.repository");
const LeaveStatus = require("../domain/leave-status");
const LeaveTransition = require("../domain/leave-transition");
const RequestNumber = require("../../common/helper/request-number");

const getRequestId = (req) => req.params?.[0]?.ID || req.data?.ID;

module.exports = {
    async execute(req, srv) {
        const ID = getRequestId(req);

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        const tx = cds.tx(req);

        const leaveRequest = await LeaveRequestRepository.findById(tx, srv, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        LeaveTransition.ensureCanMove(
            req,
            leaveRequest.Status,
            LeaveStatus.SUBMITTED
        );

        // Generate Request Number menggunakan helper
        const DEFAULT_REQUEST_NUMBER = "XX-XXXX-XXXXXXX";
        const requestNumber =
            leaveRequest.RequestNumber && leaveRequest.RequestNumber !== DEFAULT_REQUEST_NUMBER
                ? leaveRequest.RequestNumber
                : await RequestNumber.generateRequestNumber(tx);

        await LeaveRequestRepository.update(tx, srv, ID, {
            RequestNumber: requestNumber,
            Status: LeaveStatus.SUBMITTED,
            RequestDate: new Date()
        });

        return {
            Status: LeaveStatus.SUBMITTED
        };
    }
};