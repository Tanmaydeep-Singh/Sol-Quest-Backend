import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// eslint-disable-next-line no-use-before-define
export type ReferralDocument = HydratedDocument<ReferralModel>;
export const ReferralSchemaName = "Referral";
@Schema()
export class ReferralModel {
	@Prop({ required: true })
	walletId: string;

	@Prop({ required: true })
	ReferralCode: string;

	@Prop({ required: true })
	Refers: {
		questId: string;
		count: number;
		referredUsers: string[];
	}[];
}

export const ReferralSchema = SchemaFactory.createForClass(ReferralModel);
