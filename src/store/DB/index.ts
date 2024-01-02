/**
 * Copyright (C) 2019 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * @author Satyam Anand
 * @description Static class to create single DB connection and return DB models
 *
 */

import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { chargerDBModels } from "../models/chargerModel";

dotenv.config();

class DBConnection {
    private static instance: DBConnection;
    private chargerDatabase: mongoose.Connection | undefined;
    private ChargerDBModels: any;

    private constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new DBConnection();
            this.instance.initializeConnection();
        }
        return this.instance;
    }

    private async initializeConnection() {
        try {
            console.log("Establishing Charger Database connection");
            this.chargerDatabase = mongoose.createConnection(
                process.env.DB_URI as string,
                {
                    dbName: "pulseEnergy",
                }
            );
            console.log("🟢 Connected to pulsechargers DB!");
            //@ts-ignore
            this.ChargerDBModels = chargerDBModels(this.chargerDatabase);
        } catch (error: any) {
            console.log("🔴 MONGODB_CLIENT closed: ", error.message);
        }
    }

    public getDBModels() {
        return this.ChargerDBModels;
    }
}

export const createChargerDBConnection = () => {
    const dbConnection = DBConnection.getInstance();
    const chargerDBModels = dbConnection.getDBModels();

    return chargerDBModels
        ? { success: true, chargerDBModels: chargerDBModels }
        : { success: false };
};
