const LeaveStatus = require("./leave-status");

const allowedTransitions = {
    undefined: [
        LeaveStatus.DRAFTED
    ],

    [LeaveStatus.DRAFTED]: [
        LeaveStatus.SUBMITTED,
        LeaveStatus.INPROGRESS
    ],

    [LeaveStatus.SUBMITTED]: [
        LeaveStatus.INPROGRESS
    ],

    [LeaveStatus.INPROGRESS]: [
        LeaveStatus.APPROVED,
        LeaveStatus.REJECTED
    ],

    [LeaveStatus.APPROVED]: [],
    [LeaveStatus.REJECTED]: []
};

module.exports = {
    canMove(fromStatus, toStatus) {
        return allowedTransitions[fromStatus]?.includes(toStatus) || false;
    },

    ensureCanMove(req, fromStatus, toStatus) {
        if (!this.canMove(fromStatus, toStatus)) {
            req.reject(
                400,
                `Cannot change leave request status from '${fromStatus}' to '${toStatus}'.`
            );
        }
    }
};