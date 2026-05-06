const cds = require("@sap/cds");

const EmployeeRepository = require("../persistence/employee.repository");
const EmployeeNumber = require("../domain/employee-number");

module.exports = {
    async execute(req, srv) {
        if (req.data.EmployeeNumber && req.data.EmployeeNumber !== 'XXX-XXXXXX') {
            return;
        }

        const tx = cds.tx(req);

        const lastEmployeeNumber = await EmployeeRepository.findLastEmployeeNumber(
            tx,
            srv,
            EmployeeNumber.PREFIX
        );

        req.data.EmployeeNumber = EmployeeNumber.next(lastEmployeeNumber);
    }
};