import { Request, Response } from "express";
import {
    chargerDataValidator,
    chargerValueRecordValidator,
} from "../store/validators/chargerController.validator";
import { ChargerHelper } from "../helpers";
import { EHTTPS_RESPONSE_CODE } from "../store/HTTP_Response_Code/responseCode.enum";
import {
    IGetChargerData,
    ISingleSampledValue,
} from "../store/interfaces/chargerController.interface";

export class ChargerController {
    static async getChargerData(req: Request, res: Response) {
        try {
            const data: IGetChargerData =
                await chargerDataValidator.validateAsync(req.query);

            const response = await ChargerHelper.getChargerHelper(data);

            res.status(EHTTPS_RESPONSE_CODE.OK).json(response);
        } catch (err: any) {
            res.status(err.status ?? EHTTPS_RESPONSE_CODE.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }

    static async getChargerDataById(req: Request, res: Response) {
        try {
            const data: ISingleSampledValue =
                await chargerValueRecordValidator.validateAsync(req.query);
            const response = await ChargerHelper.getChargerDataByIdHelper(data);

            res.status(EHTTPS_RESPONSE_CODE.OK).json(response);
        } catch (err: any) {
            res.status(err.status ?? EHTTPS_RESPONSE_CODE.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }
}
