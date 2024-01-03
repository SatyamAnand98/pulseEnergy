import { ISingleSampledValue } from "../store/interfaces/chargerController.interface";

export class RecordQueryBuilder {
    private query: Record<string, unknown> = {};
    private pagination?: { skip: number; limit: number };

    constructor(input: ISingleSampledValue) {
        this.buildQuery(input);
        if (input.page !== undefined && input.limit !== undefined) {
            this.pagination = this.buildPagination(
                Number(input.page),
                Number(input.limit)
            );
        }
    }

    private buildQuery(input: ISingleSampledValue): void {
        if (input.value) {
            this.query["sampledValue.value"] = input.value;
        }

        if (input.context) {
            this.query["sampledValue.context"] = input.context;
        }

        if (input.measurand) {
            this.query["sampledValue.measurand"] = input.measurand;
        }

        if (input.unit) {
            this.query["sampledValue.unit"] = input.unit;
        }
    }

    private buildPagination(
        page: number,
        limit: number
    ): { skip: number; limit: number } {
        const skip = (page - 1) * limit;
        return { skip, limit };
    }

    public getQuery(): Record<string, unknown> {
        return this.query;
    }

    public getPagination(): { skip: number; limit: number } | undefined {
        return this.pagination;
    }
}
