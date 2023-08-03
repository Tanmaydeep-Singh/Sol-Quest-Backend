import { Model } from "mongoose";

import { ReferralDocument, ReferralSchemaName } from "../schema/referral.schema";
import { GenericQueryService } from "./generic.query";

export default class ReferralQueryService extends GenericQueryService<ReferralDocument> {
	constructor(model: Model<ReferralDocument>) {
		super(model, ReferralSchemaName);
	}

	async createEntity(data: any): Promise<ReferralDocument> {
		return super.createEntity(data);
	}

	async createMultipleEntities(data: any): Promise<Array<ReferralDocument>> {
		return super.createMultipleEntities(data);
	}
}
