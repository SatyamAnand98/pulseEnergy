import { createChargerDBConnection } from "../store/DB";

const batchBuffer: any = [];
const SAMPLING_FREQUENCY = 1; // in minute
const saveInterval = 1000 * 60 * SAMPLING_FREQUENCY;
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

    const tempBuffer = batchBuffer.splice(0, batchBuffer.length);

    chargerDBModels.chargerModel
        .insertMany(tempBuffer)
        .then((docs: any) => {
            console.log("Batch saved:", docs.length);
        })
        .catch((err: any) => {
            console.error("Error saving batch:", err);
            Array.prototype.push.apply(batchBuffer, tempBuffer);
        });
}

setInterval(saveBatch, saveInterval);

export function saveData(chargerId: string, data: any) {
    batchBuffer.push({
        chargerId: chargerId,
        meterValue: data.meterValue,
    });
}
