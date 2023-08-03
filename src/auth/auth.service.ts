import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import UserQueryService from "../_common/database/queries/user.query";
import { modelName, UserDocument } from "../_common/database/schema/user.schema";

@Injectable()
export class AuthService {
	userQueryService: UserQueryService;

	constructor(@InjectModel(modelName) userModel: Model<UserDocument>) {
		this.userQueryService = new UserQueryService(userModel);
	}

	async checkUserValidity(walletAddress: string): Promise<UserDocument> {
		return this.userQueryService.readEntity({ walletAddress });
	}
}
