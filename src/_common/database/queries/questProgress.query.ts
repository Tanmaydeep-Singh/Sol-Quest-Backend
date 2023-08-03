import { BadRequestException } from "@nestjs/common";
import { Model } from "mongoose";

import { IQuestProgress, modelName, QuestProgressDocument } from "../schema/questProgress.schema";
import { GenericQueryService } from "./generic.query";

export default class QuestQueryService extends GenericQueryService<QuestProgressDocument> {
	constructor(model: Model<QuestProgressDocument>) {
		super(model, modelName);
	}

	async getQuestDetailsQuery(_id: string): Promise<any> {
		if (await this.checkValidity({ _id })) {
			const quest = await this.model.findById(_id);

			return Promise.resolve(quest);
		}

		throw new BadRequestException(`${this.modelName} not found`);
	}

	async createEntity(data: any): Promise<QuestProgressDocument> {
		return super.createEntity(data);
	}

	async getQuestByUserId(userId: string): Promise<Array<IQuestProgress>> {
		if (await this.checkValidity({ user_id: userId })) {
			const quests = await this.model.aggregate([{ $match: { user_id: userId } }]);
			return Promise.resolve(quests);
		}
		throw new BadRequestException(`${this.modelName} not found`);
	}
}
