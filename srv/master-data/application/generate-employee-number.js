const cds = require("@sap/cds");

const EmployeeRepository = require("../persistence/employee.repository");
const EmployeeNumber = require("../domain/employee-number");
const DEFAULT_EMPLOYEE_NUMBER = "XXX-XXXXXX";

module.exports = {
    async execute(req) {
        if (req.data.EmployeeNumber && req.data.EmployeeNumber !== DEFAULT_EMPLOYEE_NUMBER) {
            return;
        }

        const tx = cds.tx(req);

        const lastEmployeeNumber = await EmployeeRepository.findLastEmployeeNumber(
            tx,
            EmployeeNumber.PREFIX
        );

        req.data.EmployeeNumber = EmployeeNumber.next(lastEmployeeNumber);
    }
};