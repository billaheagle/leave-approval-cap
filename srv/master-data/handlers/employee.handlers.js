const GenerateEmployeeNumber = require("../application/generate-employee-number");

module.exports = function registerEmployeeHandlers(srv) {
    const { Employees } = srv.entities;

    srv.before("CREATE", Employees, async (req) => {
        await GenerateEmployeeNumber.execute(req);
    });
};