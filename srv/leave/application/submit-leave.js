const cds = require("@sap/cds");

const LeaveRequestRepository = require("../persistence/leave-request.repository");
const LeaveStatus = require("../domain/leave-status");
const LeaveTransition = require("../domain/leave-transition");

const getRequestId = (req) => req.params?.[0]?.ID || req.data?.ID;


module.exports = {
    async execute(req, srv) {
        const ID = getRequestId(req);

        if (!ID) {
            req.reject(400, "Leave request ID is required.");
        }

        const tx = cds.tx(req);
        console.log(req)
        console.log(tx)

        const leaveRequest = await LeaveRequestRepository.findById(tx, srv, ID);

        if (!leaveRequest) {
            req.reject(404, "Leave request not found.");
        }

        LeaveTransition.ensureCanMove(
            req,
            leaveRequest.Status,
            LeaveStatus.SUBMITTED
        );

        await LeaveRequestRepository.updateStatus(tx, srv, ID, {
            Status: LeaveStatus.SUBMITTED,
            RequestDate: new Date()
        });

        return {
            Status: LeaveStatus.SUBMITTED
        };
    }
};