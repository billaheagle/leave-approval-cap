const EmployeeRepository = require("../../master-data/persistence/employee.repository");

const MAX_HIERARCHY_DEPTH = 20;

function getManagerId(employee) {
    return employee?.Manager_ID || employee?.Manager?.ID || null;
}

function isInactive(employee) {
    return employee?.IsActive === false || employee?.Active === false;
}

function getEmployeeName(employee) {
    if (!employee) {
        return "";
    }

    if (employee.EmployeeName) {
        return employee.EmployeeName;
    }

    return [
        employee.FirstName,
        employee.LastName
    ]
        .filter(Boolean)
        .join(" ");
}

module.exports = {
    async build(req, tx, employeeId) {
        if (!employeeId) {
            req.reject(400, "Employee ID is required to build approval hierarchy.");
        }

        const employee = await EmployeeRepository.findById(tx, employeeId);

        if (!employee) {
            req.reject(404, "Employee data was not found.");
        }

        if (isInactive(employee)) {
            req.reject(
                400,
                "Employee is inactive. Please contact IT/HR to maintain employee master data."
            );
        }

        const firstManagerId = getManagerId(employee);

        if (!firstManagerId) {
            req.reject(
                400,
                "No manager/approver found for this employee. Please contact IT/HR to maintain your manager data."
            );
        }

        const hierarchy = [];
        const visitedEmployeeIds = new Set();

        visitedEmployeeIds.add(employee.ID);

        let managerId = firstManagerId;
        let depth = 0;

        while (managerId) {
            if (visitedEmployeeIds.has(managerId)) {
                req.reject(
                    400,
                    "Invalid manager hierarchy detected. Please contact IT/HR to fix the employee manager mapping."
                );
            }

            if (depth >= MAX_HIERARCHY_DEPTH) {
                req.reject(
                    400,
                    "Manager hierarchy is too deep. Please contact IT/HR to validate the employee organization structure."
                );
            }

            visitedEmployeeIds.add(managerId);

            const manager = await EmployeeRepository.findById(tx, managerId);

            if (!manager) {
                req.reject(
                    400,
                    "Manager data was not found. Please contact IT/HR to maintain your manager data."
                );
            }

            if (isInactive(manager)) {
                const managerName = getEmployeeName(manager);

                req.reject(
                    400,
                    `Manager '${managerName || manager.ID}' is inactive. Please contact IT/HR to maintain employee master data.`
                );
            }

            hierarchy.push({
                StepNo: hierarchy.length + 1,
                Approver_ID: manager.ID,
                ApproverEmployeeNumber: manager.EmployeeNumber,
                ApproverName: getEmployeeName(manager),
                ApproverEmail: manager.Email
            });

            managerId = getManagerId(manager);
            depth++;
        }

        return hierarchy;
    }
};