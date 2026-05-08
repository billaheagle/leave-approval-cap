const cds = require("@sap/cds");
const BaseRepository = require("../../common/persistence/base-repository");

function getEntities() {
    return cds.entities("my.leave");
}

module.exports = {
    async findByLeaveRequestId(tx, LeaveRequest_ID) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.findMany(
            tx,
            LeaveApprovals,
            { LeaveRequest_ID },
            "ApprovalDate desc"
        );
    },

    async insert(tx, data) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.insert(tx, LeaveApprovals, data);
    }
};