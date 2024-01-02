const xlsx = require("xlsx");
const path = require("path");

let records = [];

function readExcelData() {
    const filePath = path.resolve(
        __dirname,
        "./Files/meter_values_dump_10k.xlsx"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    records = xlsx.utils.sheet_to_json(worksheet);
}

readExcelData();

module.exports = {
    generatePayload: (context, events, done) => {
        const randomIndex = Math.floor(Math.random() * records.length);
        const payload = records[randomIndex].payload;
        console.log("Generated payload:", payload);

        context.vars.payload = payload;
        return done();
    },
};
