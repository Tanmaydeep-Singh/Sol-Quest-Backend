import { BadRequestException } from "@nestjs/common";
import { Model, PipelineStage } from "mongoose";
import { UserDocument, modelName } from "../schema/user.schema";
import { GenericQueryService } from "./_generic.query";

export default class UserQueryService extends GenericQueryService<UserDocument> {
	constructor(model: Model<UserDocument>) {
		super(model, modelName);
	}

	protectInfo = (fields: string[] = []): PipelineStage.Unset => ({
		$unset: ["purchasedLivestreams", "purchasedCourses", "stream", ...fields],
	});

	async createEntity(data: any): Promise<UserDocument> {
		if ("walletAddress" in data) {
			const { walletAddress } = data;
			if (await this.checkValidity({ walletAddress }))
				throw new BadRequestException(`${this.modelName} already exists`);
		}
		return super.createEntity(data);
	}

	async getLeaderboard(questers: number, limit: number): Promise<Array<UserDocument>> {
		return this.model.aggregate([
			{ $sort: { gems: -1 } },
			{ $skip: questers },
			{ $limit: limit },
		]);
	}

	async getLeaderBoardDaily(day: Date, questers: number, limit: number): Promise<any> {
		return this.model.aggregate([
			{
				$facet: {
					result: [
						{ $match: { updatedAt: { $gt: day } } },
						{ $sort: { gems: -1 } },
						{ $skip: questers * limit },
						{ $limit: limit },
						this.protectInfo(),
					],
					totalCount: [{ $count: "count" }],
				},
			},
			{ $unwind: "$totalCount" },
		]);
	}

	async getLeaderBoardMonthly(
		day: Date,
		questers: number,
		limit: number,
	): Promise<UserDocument[]> {
		return this.model.aggregate([
			{
				$facet: {
					result: [
						{ $match: { updatedAt: { $gt: day } } },
						{ $sort: { gems: -1 } },
						{ $skip: questers * limit },
						{ $limit: limit },
						this.protectInfo(),
					],
					totalCount: [{ $count: "count" }],
				},
			},
			{ $unwind: "$totalCount" },
		]);
	}
}
