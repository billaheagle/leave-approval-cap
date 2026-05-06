const PREFIX = "EMP-";
const PAD_LENGTH = 6;

const extractSequence = (employeeNumber) => {
    if (!employeeNumber) {
        return 0;
    }

    const match = employeeNumber.match(/^EMP-(\d+)$/);

    if (!match) {
        return 0;
    }

    return parseInt(match[1], 10);
};

const build = (sequence) => {
    return `${PREFIX}${String(sequence).padStart(PAD_LENGTH, "0")}`;
};

const next = (lastEmployeeNumber) => {
    const lastSequence = extractSequence(lastEmployeeNumber);
    return build(lastSequence + 1);
};

module.exports = {
    PREFIX,
    extractSequence,
    build,
    next
};