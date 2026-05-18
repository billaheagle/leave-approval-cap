const cds = require("@sap/cds");

const BaseRepository = require("../../common/persistence/base-repository");
const LeaveStatus = require("../domain/leave-status");

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
            "StepNo asc"
        );
    },

    async findCurrentPendingByRequestId(tx, LeaveRequest_ID) {
        const { LeaveApprovals } = getEntities();

        const rows = await BaseRepository.findMany(
            tx,
            LeaveApprovals,
            {
                LeaveRequest_ID,
                Decision: LeaveStatus.PENDING,
                IsCurrent: true
            },
            "StepNo asc"
        );

        return rows?.[0] || null;
    },

    async findNextWaitingByRequestId(tx, LeaveRequest_ID, currentStepNo) {
        const { LeaveApprovals } = getEntities();

        const rows = await tx.run(
            SELECT.from(LeaveApprovals)
                .where`
                    LeaveRequest_ID = ${LeaveRequest_ID}
                    and Decision = ${LeaveStatus.WAITING}
                    and StepNo > ${currentStepNo}
                `
                .orderBy("StepNo asc")
                .limit(1)
        );

        return rows?.[0] || null;
    },

    async insert(tx, data) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.insert(tx, LeaveApprovals, data);
    },

    async insertMany(tx, rows) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.insertMany(tx, LeaveApprovals, rows);
    },

    async update(tx, ID, data) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.update(tx, LeaveApprovals, { ID }, data);
    },

    async skipWaitingByRequestId(tx, LeaveRequest_ID) {
        const { LeaveApprovals } = getEntities();

        return BaseRepository.update(
            tx,
            LeaveApprovals,
            {
                LeaveRequest_ID,
                Decision: LeaveStatus.WAITING
            },
            {
                Decision: LeaveStatus.SKIPPED,
                IsCurrent: false
            }
        );
    }
};