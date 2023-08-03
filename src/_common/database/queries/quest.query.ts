import { BadRequestException } from "@nestjs/common";
import { Model } from "mongoose";
import { modelName, QuestDocument } from "../schema/quest.schema";
import { GenericQueryService } from "./generic.query";

export default class QuestQueryService extends GenericQueryService<QuestDocument> {
	constructor(model: Model<QuestDocument>) {
		super(model, modelName);
	}

	async getAllQuests(): Promise<Array<QuestDocument>> {
		const quests = await this.model.find();

		return Promise.resolve(quests);
	}

	async getQuestDetailsQuery(_id: string): Promise<QuestDocument> {
		if (await this.checkValidity({ _id })) {
			const quest = this.model.findById(_id);

			return Promise.resolve(quest);
		}

		throw new BadRequestException(`${this.modelName} not found`);
	}
}
