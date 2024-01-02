import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import chargerRouter from "../routes";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/chargers", chargerRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
