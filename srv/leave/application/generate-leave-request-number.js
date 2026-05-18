const LeaveRequestNumber = require("../domain/leave-request-number");
const LeaveRequestRepository = require("../persistence/leave-request.repository");

module.exports = {
    async execute(tx, date = new Date()) {
        const year = LeaveRequestNumber.getYear(date);

        const latestRequestNumber =
            await LeaveRequestRepository.findLatestRequestNumberByYear(tx, year);

        const latestSequence =
            LeaveRequestNumber.extractSequence(latestRequestNumber);

        const nextSequence = latestSequence + 1;

        return LeaveRequestNumber.buildRequestNumber(year, nextSequence);
    }
};