const cds = require("@sap/cds");
const BaseRepository = require("../persistence/base-repository");

module.exports = {
    async generateRequestNumber(tx) {
        // Ambil tahun sekarang
        const year = new Date().getFullYear();

        // Ambil nomor terakhir untuk tahun yang sama
        const result = await BaseRepository.findMany(tx, "my.leave.LeaveRequests", {
            RequestNumber: { like: `LR-${year}-%` }
        }, "RequestNumber desc");

        // Jika sudah ada nomor sebelumnya, ambil nomor urutnya
        let nextNumber = 1; // default kalau belum ada data sebelumnya

        if (result.length > 0) {
            // Ambil nomor urut dari RequestNumber terakhir
            const lastNumber = result[0].RequestNumber.split("-")[2]; // ambil bagian terakhir
            nextNumber = parseInt(lastNumber, 10) + 1;
        }

        // Format nomor urut menjadi 7 digit
        const formattedNumber = nextNumber.toString().padStart(7, "0");

        return `LR-${year}-${formattedNumber}`;
    }
};