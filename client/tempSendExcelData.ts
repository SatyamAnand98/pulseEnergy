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

function main() {
    const filePath = path.resolve(
        __dirname,
        "../Files/meter_values_dump_10k.xlsx"
    );
    const records = readExcelData(filePath);
    let delay = 0;

    records.forEach((record) => {
        setTimeout(() => {
            sendToServer(
                JSON.stringify(JSON.parse(record.payload)["meterValue"])
            );
        }, delay);
        delay += 5000; // Increase delay by 5 seconds for each record
    });

    setTimeout(() => {
        console.log(`Processed ${records.length} records.`);
    }, delay);
}

main();
