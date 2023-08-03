import { HydratedDocument, Schema } from "mongoose";
import { TaskOption } from "../../quest/constants/task";

export const modelName = "Task";

export interface ITask {
	task: TaskOption;
	customisation: { [k: string]: string };
	points: number;
}
export type TaskDocument = HydratedDocument<ITask>;

export const taskSchema = new Schema<ITask>(
	{
		task: { type: String, required: true },
		customisation: { type: Schema.Types.Mixed, required: true },
		points: { type: Number, required: true },
	},
	{ timestamps: true },
);
