import xlsx from "xlsx";
import path from "path";

let records: any = [];

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
    generatePayload: (context: any, events: any, done: () => any) => {
        if (context.vars.index === undefined) {
            context.vars.index = 0;
        }

        if (context.vars.index < records.length) {
            context.vars.payload = records[context.vars.index];
            context.vars.index = (context.vars.index + 1) % records.length;
        } else {
            context.vars.index = 0;
        }

        return done();
    },
};
