const cds = require("@sap/cds");

module.exports = {
    async get(req) {
        const userEmail = req.user.id;

        const employee = await cds.tx(req).run(
            SELECT.one.from("my.leave.Employees").where({
                Email: userEmail
            })
        );

        if (!employee) {
            req.reject(403, `No employee found for user '${userEmail}'.`);
        }

        return employee;
    }
};