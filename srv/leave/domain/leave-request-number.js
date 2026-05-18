const REQUEST_NUMBER_PREFIX = "LV";
const DEFAULT_REQUEST_NUMBER = "XX-XXXX-XXXXXXX";

function padSequence(sequence) {
    return String(sequence).padStart(7, "0");
}

function buildRequestNumber(year, sequence) {
    return `${REQUEST_NUMBER_PREFIX}-${year}-${padSequence(sequence)}`;
}

function extractSequence(requestNumber) {
    if (!requestNumber) {
        return 0;
    }

    const parts = requestNumber.split("-");
    const sequencePart = parts[2];

    const sequence = Number(sequencePart);

    return Number.isNaN(sequence) ? 0 : sequence;
}

function getYear(date = new Date()) {
    return date.getFullYear();
}

module.exports = {
    DEFAULT_REQUEST_NUMBER,
    REQUEST_NUMBER_PREFIX,
    buildRequestNumber,
    extractSequence,
    getYear
};