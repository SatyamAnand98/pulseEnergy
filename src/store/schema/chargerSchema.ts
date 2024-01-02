import mongoose from "mongoose";

const sampledValueSchema = new mongoose.Schema({
    value: { type: String, required: true },
    context: { type: String, required: true },
    measurand: { type: String, required: true },
    unit: { type: String, required: true },
    phase: { type: String, required: false },
});

export const chargerSchema = new mongoose.Schema({
    chargerId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    sampledValue: [sampledValueSchema],
});
