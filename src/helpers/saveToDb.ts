import { createChargerDBConnection } from "../store/DB";
import { EBatchProcessingMode } from "../store/enum/batchprocessing.switch";
import { IChargerData } from "../store/interfaces/chargerController.interface";

export class BatchProcessor {
    private buffer: IChargerData[] = [];
    private saveInterval: number;
    private batchSize: number = 1000;
    private samplingFrequency: number = 1;
    private processingMode: EBatchProcessingMode =
        EBatchProcessingMode.FrequencyBased;
    private chargerDBModel: any;

    constructor() {
        const { success, chargerDBModels } = createChargerDBConnection();
        if (!success) {
            throw new Error("Error connecting to database");
        }
        this.chargerDBModel = chargerDBModels.chargerModel;
        this.saveInterval = 1000 * 60 * this.samplingFrequency;
        if (this.processingMode === EBatchProcessingMode.FrequencyBased) {
            setInterval(() => this.saveBatch(), this.saveInterval);
        }
    }

    saveData(chargerId: string, data: any) {
        this.buffer.push({
            chargerId: chargerId,
            timestamp: data.meterValue[0].timestamp,
            sampledValue: data.meterValue[0].sampledValue,
        });
        if (
            this.processingMode === EBatchProcessingMode.SizeBased &&
            this.buffer.length >= this.batchSize
        ) {
            this.saveBatch();
        }
    }

    private async saveBatch() {
        if (this.buffer.length === 0) {
            console.log("No data to save");
            return;
        }
        const tempBuffer = [...this.buffer];
        console.log("Saving batch of size:", this.buffer.length);

        this.buffer = [];

        try {
            const docs = await this.chargerDBModel.insertMany(tempBuffer);
            console.log("Batch saved:", docs.length);
        } catch (err) {
            console.error("Error saving batch:", err);
            this.buffer.push(...tempBuffer);
        }
    }
}
