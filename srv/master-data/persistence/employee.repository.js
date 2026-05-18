const cds = require("@sap/cds");
const BaseRepository = require("../../common/persistence/base-repository");

function getEntities() {
    return cds.entities("my.leave");
}

module.exports = {
    async findLastEmployeeNumber(tx, prefix) {
        const { Employees } = getEntities();

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
    },

    async findById(tx, ID) {
        const { Employees } = getEntities();

        return BaseRepository.findOne(tx, Employees, { ID });
    }
};