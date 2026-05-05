const BaseRepository = require("../../common/persistence/base-repository");

module.exports = {
    async findById(tx, srv, ID) {
        const { LeaveRequests } = srv.entities;

        return BaseRepository.findOne(tx, LeaveRequests, { ID });
    },

    async update(tx, srv, ID, data) {
        const { LeaveRequests } = srv.entities;

        return BaseRepository.update(tx, LeaveRequests, { ID }, data);
    },

    async updateStatus(tx, srv, ID, data) {
        const { LeaveRequests } = srv.entities;

        return BaseRepository.update(tx, LeaveRequests, { ID }, data);
    },

    async findByRequestNumber(tx, srv, RequestNumber) {
        const { LeaveRequests } = srv.entities;

        return BaseRepository.findOne(tx, LeaveRequests, { RequestNumber });
    },

    async findByEmployeeId(tx, srv, Employee_ID) {
        const { LeaveRequests } = srv.entities;

        return BaseRepository.findMany(tx, LeaveRequests, { Employee_ID });
    }
};