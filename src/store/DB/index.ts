import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { chargerDBModels } from "../models/chargerModel";

dotenv.config();

class DBConnection {
    private static instance: DBConnection;
    private chargerDatabase: mongoose.Connection;
    private ChargerDBModels: any;

    private constructor() {
        this.setupCloseHandlers();
    }

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

            this.chargerDatabase.on("connected", () => {
                console.log("🟢 Connected to pulsechargers DB!");
            });

            this.chargerDatabase.on("error", (error) => {
                console.error("🔴 Database connection error:", error);
            });

            //@ts-ignore
            this.ChargerDBModels = chargerDBModels(this.chargerDatabase);
        } catch (error: any) {
            console.error(
                "🔴 Error initializing database connection:",
                error.message
            );
            this.closeConnection();
        }
    }

    private setupCloseHandlers() {
        process.on("SIGINT", this.closeConnection.bind(this));
        process.on("SIGTERM", this.closeConnection.bind(this));
        process.on("uncaughtException", (error) => {
            console.error("🔴 Uncaught Exception:", error);
            this.closeConnection();
        });
    }

    private closeConnection() {
        if (this.chargerDatabase) {
            this.chargerDatabase
                .close()
                .then(() => {
                    console.log("🟠 Database connection closed!");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("Error closing database connection:", error);
                    process.exit(1);
                });
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
