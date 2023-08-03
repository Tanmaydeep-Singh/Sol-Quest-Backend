import { Model } from "mongoose";
import { modelName, TaskDocument } from "../schema/task.schema";

import { GenericQueryService } from "./generic.query";

export default class TaskQueryService extends GenericQueryService<TaskDocument> {
	constructor(model: Model<TaskDocument>) {
		super(model, modelName);
	}

	async createEntity(data: any): Promise<TaskDocument> {
		return super.createEntity(data);
	}

	async createMultipleEntities(data: any): Promise<Array<TaskDocument>> {
		return super.createMultipleEntities(data);
	}
}
