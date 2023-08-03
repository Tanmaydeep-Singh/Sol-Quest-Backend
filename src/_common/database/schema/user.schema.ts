import { HydratedDocument, Schema, Types } from "mongoose";

import { AUTH_ROLES } from "../../types.global";

export interface IUser {
	walletAddress: string;
	role: Array<AUTH_ROLES>;
	username: string;
	handle?: string;
	purchasedCourses?: Array<Types.ObjectId>;
	purchasedLivestreams?: Array<Types.ObjectId>;
	gems?: number;
	participated_quests?: Types.ObjectId[];
}

export interface TwitterToken {
	access_token: string;
	token_type: string;
	expires_at: number;
	refresh_token: string;
	scope: string;
}

export interface IUserCombined extends IUser {
	icon?: string;
	about: string;
	bio: string;
	language: Types.ObjectId;
	stream?: {
		key: string;
		id: string;
	};
	courses?: Array<Types.ObjectId>;
	livestreams?: Array<Types.ObjectId>;
	games?: Array<Types.ObjectId>;
	created_quests?: Types.ObjectId[];
	twitterToken?: TwitterToken;
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
		// gaming marketplace related schema
		role: [{ type: String, required: true }],
		walletAddress: { type: String, unique: true, required: true },
		username: { type: String, required: true },
		icon: { type: String },
		about: { type: String },
		bio: { type: String },
		handle: { type: String },
		language: {
			type: Schema.Types.ObjectId,
			ref: "Language",
		},
		stream: {
			key: { type: String, default: "" },
			id: { type: String, default: "" },
			_id: false,
		},
		purchasedCourses: [{ type: Schema.Types.ObjectId, ref: "Course", default: [] }],
		purchasedLivestreams: [{ type: Schema.Types.ObjectId, ref: "Livestream", default: [] }],
		courses: [{ type: Schema.Types.ObjectId, ref: "Course", default: [] }],
		livestreams: [{ type: Schema.Types.ObjectId, ref: "Livestream", default: [] }],
		games: [{ type: Schema.Types.ObjectId, ref: "Game", default: [] }],

		// quest related schema
		gems: { type: Number, default: 0 },
		participated_quests: [{ type: Schema.Types.ObjectId, ref: "QuestProgress", default: [] }],
		created_quests: [{ type: Schema.Types.ObjectId, ref: "Quest", default: [] }],
		twitterToken: {
			type: Object,
		},

		// cyberconnect related schema

		ccProfiles: [
			{
				type: {
					id: { type: Number, required: true },
					handle: { type: String, required: true },
					isLocal: { type: Boolean, required: true },
					isNativeProfile: { type: Boolean, required: true },
				},
			},
		],
	},

	{ timestamps: true },
);
