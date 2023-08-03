import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import UserQueryService from "../_common/database/queries/user.query";
import { UserDocument, modelName as userModelName } from "../_common/database/schema/user.schema";

@Injectable()
export class UsersService {
	userQueryService: UserQueryService;

	questProgressQueryService: any;

	questQueryService: any;

	constructor(@InjectModel(userModelName) UserModel: Model<UserDocument>) {
		this.userQueryService = new UserQueryService(UserModel);
	}

	async getUsers(): Promise<Document[]> {
		return this.userQueryService.readMultipleEntities(
			{},
			{ limit: 100 },
			{ games: 0, courses: 0 },
		);
	}

	async getUserProfile(walletAddress: string): Promise<Document> {
		return this.userQueryService.readEntity({ walletAddress });
	}
}
