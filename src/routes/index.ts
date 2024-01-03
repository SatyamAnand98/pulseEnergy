import express from "express";
import { ChargerController } from "../controllers";

const chargerRouter = express.Router();

chargerRouter.get("/all", ChargerController.getChargerData);

chargerRouter.get("/record", ChargerController.getChargerDataById);

export default chargerRouter;
