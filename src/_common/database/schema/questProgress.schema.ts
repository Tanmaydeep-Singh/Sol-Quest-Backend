import { HydratedDocument, Schema, Types } from "mongoose";
import { TaskStatus } from "../../quest/constants/task";

export const modelName = "QuestProgress";

export interface IQuestProgress {
	questId: Types.ObjectId;
	userId: Types.ObjectId;
	taskStatus: {
		taskId: Types.ObjectId;
		status: TaskStatus;
	}[];
	gems_earned: number;
}

export type QuestProgressDocument = HydratedDocument<IQuestProgress>;

export const QuestProgressSchema = new Schema<IQuestProgress>(
	{
		questId: { type: Schema.Types.ObjectId, ref: "Quest", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		taskStatus: [
			{
				taskId: { type: Schema.Types.ObjectId, required: true },
				status: { type: String, required: true },
			},
		],
		gems_earned: { type: Number, default: 0 },
	},
	{ timestamps: true },
);
