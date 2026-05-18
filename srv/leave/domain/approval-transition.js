const LeaveStatus = require("./leave-status");

const allowedTransitions = {
    undefined: [
        LeaveStatus.WAITING,
        LeaveStatus.PENDING
    ],

    [LeaveStatus.WAITING]: [
        LeaveStatus.PENDING,
        LeaveStatus.SKIPPED
    ],

    [LeaveStatus.PENDING]: [
        LeaveStatus.APPROVED,
        LeaveStatus.REJECTED
    ],

    [LeaveStatus.APPROVED]: [],
    [LeaveStatus.REJECTED]: [],
    [LeaveStatus.SKIPPED]: []
};

module.exports = {
    canMove(fromDecision, toDecision) {
        return allowedTransitions[fromDecision]?.includes(toDecision) || false;
    },

    ensureCanMove(req, fromDecision, toDecision) {
        if (!this.canMove(fromDecision, toDecision)) {
            req.reject(
                400,
                `Cannot change approval decision from '${fromDecision}' to '${toDecision}'.`
            );
        }
    }
};