import Joi from "joi";

export const chargerControllerValidator = Joi.object({
    charge_point_id: Joi.string().required(),
    payload: Joi.object({
        connectorId: Joi.number().required(),
        transactionId: Joi.number().required(),
        meterValue: Joi.array().items(
            Joi.object({
                timestamp: Joi.date().required(),
                sampledValue: Joi.array().items(
                    Joi.object({
                        value: Joi.string().required(),
                        context: Joi.string().required(),
                        measurand: Joi.string().required(),
                        unit: Joi.string().required(),
                        phase: Joi.string(),
                    })
                ),
            })
        ),
    }),
});

export const chargerDataValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1).strict(false),
    limit: Joi.number().integer().min(1).default(10).strict(false),
    chargerPointIds: Joi.array().items(Joi.string()).allow("", null).optional(),
});

export const chargerValueRecordValidator = Joi.object({
    value: Joi.string().optional().allow("", null),
    context: Joi.string().optional().allow("", null),
    measurand: Joi.string().optional().allow("", null),
    unit: Joi.string().optional().allow("", null),
    page: Joi.number().integer().min(1).optional().strict(false),
    limit: Joi.number().integer().min(1).optional().strict(false),
});
