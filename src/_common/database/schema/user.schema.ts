import { HydratedDocument, Schema, Types } from "mongoose";

import { AUTH_ROLES } from "../../types.global";

export interface IUser {
	walletAddress: string;
	role: Array<AUTH_ROLES>;
	gem?: number;
	participated_quests?: Types.ObjectId[];
}

export interface TwitterToken {
	access_token: string;
	token_type: string;
	expires_at: number;
	refresh_token: string;
	scope: string;
}

export interface Socials {
	twitter?: string;
	telegram?: string;
	discord?: string;
}


export interface IUserCombined extends IUser {
	created_quests?: Types.ObjectId[];
	twitterToken?: TwitterToken;
	socials?:Socials;
}

export interface ICCUser extends IUser {
	ccProfiles?: {
		id: number;
		handle: string; // startsWith @
		isNativeProfile: boolean;
		isLocal: boolean;
	}[];
}



export const modelName = "User";

export type UserDocument = HydratedDocument<IUserCombined & ICCUser>;

export const UserSchema = new Schema<IUserCombined & ICCUser>(
	{
		role: [{ type: String, required: true }],
		walletAddress: { type: String, unique: true, required: true },
		gem: { type: Number, default: 0 },
		participated_quests: [{ type: Schema.Types.ObjectId, ref: "QuestProgress", default: [] }],
		created_quests: [{ type: Schema.Types.ObjectId, ref: "Quest", default: [] }],
		twitterToken: {
			type: Object,
		},
		socials: { 
			type : Object,
			default : {}, 
		},
	},

	{ timestamps: true },
);
