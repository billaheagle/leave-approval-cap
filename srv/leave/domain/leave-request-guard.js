const LeaveStatus = require("./leave-status");

const DEFAULT_REQUEST_NUMBER = "XX-XXXX-XXXXXXX";

const lifecycleFields = [
    "Status",
    "RequestNumber",
    "IsClosed"
];

function hasOwn(data, field) {
    return Object.prototype.hasOwnProperty.call(data || {}, field);
}

function hasAnyLifecycleField(data) {
    return lifecycleFields.some((field) => hasOwn(data, field));
}

module.exports = {
    ensureCreateAllowed(req) {
        const data = req.data || {};

        if (hasOwn(data, "Status") && data.Status !== LeaveStatus.DRAFTED) {
            req.reject(
                400,
                "Leave request can only be created as Drafted. Use submit action to submit the request."
            );
        }

        if (
            hasOwn(data, "RequestNumber") &&
            data.RequestNumber &&
            data.RequestNumber !== DEFAULT_REQUEST_NUMBER
        ) {
            req.reject(
                400,
                "RequestNumber cannot be provided manually. It will be generated during submit."
            );
        }

        if (hasOwn(data, "IsClosed") && data.IsClosed === true) {
            req.reject(
                400,
                "IsClosed cannot be set manually during create."
            );
        }
    },

    ensureNoDirectLifecycleMutation(req) {
        const data = req.data || {};

        if (hasAnyLifecycleField(data)) {
            req.reject(
                400,
                "Status, RequestNumber, and IsClosed cannot be changed directly. Use submit, approve, or reject action."
            );
        }
    }
};