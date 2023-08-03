import { HydratedDocument, Schema, Types } from "mongoose";
import { EligibityCriteria } from "../../quest/constants/eligibility_criteria";
import { QuestStatus } from "../../quest/constants/quest";
import { rewardMethod, rewardType } from "../../quest/constants/reward";
import { Task } from "../../quest/constants/task";

export const modelName = "Quest";

export interface IQuest {
	questTitle: string;
	questDescription: string;
	imageurl: string;
	createdBy: Types.ObjectId;
	eligibility: EligibityCriteria;
	tasks: Task[];
	gemsReward: number;
	rewardMethod: rewardMethod;
	rewardType: rewardType;
	startTimestamp: Date;
	endTimestamp: Date;
	status: QuestStatus;
}

export type QuestDocument = HydratedDocument<IQuest>;

export const QuestSchema = new Schema<IQuest>(
	{
		questTitle: { type: String, required: true },
		questDescription: { type: String, required: true },
		imageurl: { type: String, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		eligibility: { type: String, required: true },
		tasks: [
			{
				task: { type: String, required: true },
				customisation: { type: Schema.Types.Mixed, required: true },
			},
		],
		gemsReward: { type: Number, required: true },
		rewardMethod: { type: String, required: true },
		rewardType: { type: String, required: true },
		startTimestamp: { type: Date, required: true },
		endTimestamp: { type: Date, required: true },
		status: { type: String, required: true },
	},
	{ timestamps: true },
);
