import type mongoose from "mongoose";
import { chargerSchema } from "../schema/chargerSchema";

export const chargerDBModels = (chargerDatabase: mongoose.Connection) => {
    const chargerModel = chargerDatabase.model("PulseCharger", chargerSchema);

    return {
        chargerModel,
    };
};
