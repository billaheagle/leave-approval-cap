const BaseRepository = require("../../common/persistence/base-repository");

module.exports = {
    async findByLeaveRequestId(tx, srv, LeaveRequest_ID) {
        const { LeaveApprovals } = srv.entities;

        return BaseRepository.findMany(
            tx,
            LeaveApprovals,
            { LeaveRequest_ID },
            "ApprovalDate desc"
        );
    },

    async insert(tx, srv, data) {
        const { LeaveApprovals } = srv.entities;

        return BaseRepository.insert(tx, LeaveApprovals, data);
    }
};