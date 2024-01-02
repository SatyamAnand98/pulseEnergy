import { createChargerDBConnection } from "../store/DB";

export function saveData(data: any) {
    const { success, chargerDBModels } = createChargerDBConnection();
    if (!success) {
        console.log("🔴 Error connecting to database");
        return;
    }
    const newChargerData = new chargerDBModels.chargerModel({
        chargerId: data.charge_point_id,
        payload: JSON.parse(data.payload),
    });

    newChargerData
        .save()
        .then((doc: any) => console.log("Document saved:", doc))
        .catch((err: any) => console.error("Error saving document:", err));
}
