const BaseRepository = require("../../common/persistence/base-repository");

module.exports = {
    async findLastEmployeeNumber(tx, srv, prefix) {
        const { Employees } = srv.entities;

        const result = await BaseRepository.findMany(
            tx,
            Employees,
            {
                EmployeeNumber: {
                    like: `${prefix}%`
                }
            },
            "EmployeeNumber desc"
        );

        return result?.[0]?.EmployeeNumber || null;
    }
};