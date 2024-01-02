import { createChargerDBConnection } from "../store/DB";

const batchBuffer: any = [];
const saveInterval = 10000;
const { success, chargerDBModels } = createChargerDBConnection();
if (!success) {
    console.error("🔴 Error connecting to database");
    throw new Error("Error connecting to database");
}

function saveBatch() {
    if (batchBuffer.length === 0) {
        console.log("No data to save");
        return;
    }

    console.log("Saving batch of size:", batchBuffer.length);

    const chargerDBInfo = chargerDBModels.chargerModel
        .insertMany(batchBuffer)
        .then((docs: any) => {
            console.log("Batch saved:", docs.length);
            batchBuffer.length = 0;
        })
        .catch((err: any) => {
            console.error("Error saving batch:", err);
        });
}

setInterval(saveBatch, saveInterval);

export function saveData(chargerId: string, data: any) {
    batchBuffer.push({
        chargerId: chargerId,
        connectorId: data.connectorId,
        transactionId: data.transactionId,
        meterValue: data.meterValue,
    });
}
