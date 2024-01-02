import * as xlsx from "xlsx";
import * as path from "path";
import { sendToServer } from "./client";
import dotenv from "dotenv";

dotenv.config();
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

function sendDataRepeatedly(
    clientId: number,
    records: MeterRecord[],
    index: number = 0
) {
    if (index >= records.length) {
        index = 0;
    }

    sendToServer(clientId, JSON.stringify(records[index]));
    setTimeout(
        () => sendDataRepeatedly(clientId, records, index + 1),
        5000 / (clientId + 1)
    );
}

function main(clientId: number) {
    const filePath = path.resolve(
        __dirname,
        "../Files/meter_values_dump_10k.xlsx"
    );
    const records = readExcelData(filePath);
    sendDataRepeatedly(clientId, records);
}

const numberOfClients = Number(process.env.CLIENT_COUNT);
for (let i = 0; i < numberOfClients; i++) {
    main(i);
}
