import { RecordQueryBuilder } from "../logic/recordSearch.queryBuilder";
import { createChargerDBConnection } from "../store/DB";
import {
    IGetChargerData,
    ISingleSampledValue,
} from "../store/interfaces/chargerController.interface";

export class ChargerHelper {
    static async getChargerHelper(data: IGetChargerData) {
        try {
            const page = Number(data.page);
            const limit = Number(data.limit);

            const query = data.chargePointIds
                ? { chargerId: { $in: data.chargePointIds } }
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
                    .sort({ createdAt: -1 })
                    .exec();

                const count = await chargerDBModels.chargerModel.countDocuments(
                    query
                );
                return {
                    totalPages: Math.ceil(count / limit),
                    currentPage: data.page,
                    chargers,
                };
            } catch (err: any) {
                throw err;
            }
        } catch (err: any) {
            throw err;
        }
    }

    static async getChargerDataByIdHelper(data: ISingleSampledValue) {
        try {
            const RecordQueryObject = new RecordQueryBuilder(data);
            const query = RecordQueryObject.getQuery();
            const pagination = RecordQueryObject.getPagination();
            const { success, chargerDBModels } = createChargerDBConnection();
            if (!success) {
                console.log("🔴 Error connecting to database");
                return;
            }
            const charger = await chargerDBModels.chargerModel
                .find(query)
                .limit(pagination?.limit)
                .skip(pagination?.skip)
                .sort({ createdAt: -1 })
                .exec();
            if (!charger) return "Charger not found";
            const count = await chargerDBModels.chargerModel.countDocuments(
                query
            );
            return {
                totalPages:
                    data.limit && data.page
                        ? Math.ceil(count / Number(data.limit))
                        : "Pagination not provided",
                currentPage: data.page,
                charger,
            };
        } catch (err: any) {
            throw err;
        }
    }
}
