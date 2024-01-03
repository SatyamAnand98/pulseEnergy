export interface IGetChargerData extends IPagination {
    chargePointIds: string;
}

export interface IChargerData {
    chargerId: string;
    timestamp: Date;
    sampledValue: number;
}

export interface ISingleSampledValue extends IPagination {
    value?: string;
    context?: string;
    measurand?: string;
    unit?: string;
    phase?: string;
}

export interface IPagination {
    page: Number;
    limit: Number;
}

export interface ISampledValue {
    sampledValue: ISingleSampledValue[];
}
