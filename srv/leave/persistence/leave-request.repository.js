const cds = require("@sap/cds");
const BaseRepository = require("../../common/persistence/base-repository");

function getEntities() {
    return cds.entities("my.leave");
}

module.exports = {
    async findById(tx, ID) {
        const { LeaveRequests } = getEntities();

        return BaseRepository.findOne(tx, LeaveRequests, { ID });
    },

    async update(tx, ID, data) {
        const { LeaveRequests } = getEntities();

        return BaseRepository.update(tx, LeaveRequests, { ID }, data);
    },

    async updateLifecycle(tx, ID, data) {
        const { LeaveRequests } = getEntities();

        return BaseRepository.update(tx, LeaveRequests, { ID }, data);
    },

    async findByRequestNumber(tx, RequestNumber) {
        const { LeaveRequests } = getEntities();

        return BaseRepository.findOne(tx, LeaveRequests, { RequestNumber });
    },

    async findByEmployeeId(tx, Employee_ID) {
        const { LeaveRequests } = getEntities();

        return BaseRepository.findMany(tx, LeaveRequests, { Employee_ID });
    },

    async findLatestRequestNumberByYear(tx, year) {
        const { LeaveRequests } = getEntities();

        const prefix = `LV-${year}-`;

        const rows = await BaseRepository.findManyByQuery(
            tx,
            LeaveRequests,
            (query) => query
                .columns("RequestNumber")
                .where`RequestNumber like ${prefix + "%"}`
                .orderBy("RequestNumber desc")
                .limit(1)
        );

        return rows?.[0]?.RequestNumber || null;
    }
};