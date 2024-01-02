import { createChargerDBConnection } from "../store/DB";
import { IGetChargerData } from "../store/interfaces/chargerController.interface";

export class ChargerHelper {
    static async getChargerHelper(data: IGetChargerData) {
        try {
            const page = Number(data.page);
            const limit = Number(data.limit);

            const query = data.chargePointIds
                ? { chargerId: { $in: data.chargePointIds.split(",") } }
                : {};

            try {
                const { success, chargerDBModels } =
                    createChargerDBConnection();
                if (!success) {
                    console.log("🔴 Error connecting to database");
                    return;
                }
                const chargers = await chargerDBModels.chargerModel
                    .find(query)
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .exec();

                const count = await chargerDBModels.chargerModel.countDocuments(
                    query
                );
                return {
                    chargers,
                    totalPages: Math.ceil(count / limit),
                    currentPage: data.page,
                };
            } catch (err: any) {
                throw err;
            }
        } catch (err: any) {
            throw err;
        }
    }

    static async getChargerDataByIdHelper(id: string) {
        try {
            const { success, chargerDBModels } = createChargerDBConnection();
            if (!success) {
                console.log("🔴 Error connecting to database");
                return;
            }
            const charger = await chargerDBModels.chargerModel
                .findById(id)
                .exec();
            if (!charger) return "Charger not found";
            return charger;
        } catch (err: any) {
            throw err;
        }
    }
}
