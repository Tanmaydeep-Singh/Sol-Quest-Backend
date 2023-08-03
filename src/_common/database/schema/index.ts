import { ModelDefinition } from "@nestjs/mongoose";
import { QuestSchema, modelName as questModelName } from "./quest.schema";
import { QuestProgressSchema, modelName as questProgressModelName } from "./questProgress.schema";
import { ReferralSchema, ReferralSchemaName } from "./referral.schema";
import { modelName as taskModelName, taskSchema } from "./task.schema";
import { UserSchema, modelName as userModelName } from "./user.schema";

export const AuthModelDefs: Array<ModelDefinition> = [{ name: userModelName, schema: UserSchema }];

export const UsersModelDefs: Array<ModelDefinition> = [{ name: userModelName, schema: UserSchema }];

export const QuestModelDefs = [
	{ name: userModelName, schema: UserSchema },
	{ name: questModelName, schema: QuestSchema },
	{ name: questProgressModelName, schema: QuestProgressSchema },
	{ name: taskModelName, schema: taskSchema },
];

export const CreatorModelDefs = [
	{ name: taskModelName, schema: taskSchema },
	{ name: userModelName, schema: UserSchema },
	{ name: questModelName, schema: QuestSchema },
];

export const TasksModelDefs = [
	{ name: taskModelName, schema: taskSchema },
	{ name: userModelName, schema: UserSchema },
	{ name: questModelName, schema: QuestSchema },
	{ name: ReferralSchemaName, schema: ReferralSchema },
];
