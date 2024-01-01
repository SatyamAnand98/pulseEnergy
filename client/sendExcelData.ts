import * as xlsx from "xlsx";
import * as path from "path";
import { sendToServer } from "./client";

interface MeterRecord {
    charge_point_id: string;
    payload: string;
}

function readExcelData(filePath: string): MeterRecord[] {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json<MeterRecord>(worksheet);
}

function sendDataRepeatedly(records: MeterRecord[], index: number = 0) {
    if (index >= records.length) {
        index = 0;
    }

    sendToServer(JSON.stringify(records[index]));
    setTimeout(() => sendDataRepeatedly(records, index + 1), 5000);
}

function main() {
    const filePath = path.resolve(
        __dirname,
        "../Files/meter_values_dump_10k.xlsx"
    );
    const records = readExcelData(filePath);
    sendDataRepeatedly(records);
}

const numberOfClients = 50000;
for (let i = 0; i < numberOfClients; i++) {
    main();
}

setTimeout(() => {
    console.log("✅ Simulation complete.");
    process.exit(0);
}, 3600000);
