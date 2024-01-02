import express from "express";
import { ChargerController } from "../controllers";

const chargerRouter = express.Router();

chargerRouter.get("/", ChargerController.getChargerData);

chargerRouter.get("/:id", ChargerController.getChargerDataById);

export default chargerRouter;
