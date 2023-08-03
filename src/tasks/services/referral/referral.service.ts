import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import ReferralQueryService from "../../../_common/database/queries/referral.query";
import {
	ReferralDocument,
	ReferralSchemaName,
} from "../../../_common/database/schema/referral.schema";

@Injectable()
export class ReferralService {
	referralQuerryService: ReferralQueryService;

	constructor(
		@InjectModel(ReferralSchemaName)
		ReferralModel: Model<ReferralDocument>,
	) {
		this.referralQuerryService = new ReferralQueryService(ReferralModel);
	}

	async updateReferral(questId: string, referralCode: string, walletId: string): Promise<any> {
		const exist = await this.referralQuerryService.readEntity({
			ReferralCode: referralCode,
		});

		if (exist === undefined || exist === null) {
			throw new BadRequestException("Invalid Code");
		}

		if (walletId === "" || walletId === null) {
			throw new BadRequestException("Invalid Wallet Id");
		}
		if (exist.walletId === walletId) {
			throw new BadRequestException("Wallet Id not Accepted");
		}

		let questRefers = exist.Refers.find((obj) => obj.questId === questId);

		if (questRefers === undefined || questRefers === null) {
			questRefers = {
				questId,
				count: 0,
				referredUsers: [],
			};
		}

		if (questRefers.referredUsers.includes(walletId) === true) {
			throw new ForbiddenException("Already referred");
		}

		questRefers.referredUsers.push(walletId);
		questRefers.count += 1;

		const newRefer = [];

		exist.Refers.forEach((obj) => {
			if (obj.questId !== questId) newRefer.push(obj);
		});

		newRefer.push(questRefers);
		const update = await this.referralQuerryService.updateEntity(
			{ ReferralCode: referralCode },
			{
				$set: {
					Refers: newRefer,
				},
			},
		);
		return update;
	}

	async verifyReferralCount(questId: string, referCode: string, minCount: number) {
		const referral = await this.referralQuerryService.readEntity({
			ReferralCode: referCode,
		});
		if (referral === undefined || referral === null) {
			throw new ForbiddenException("Referral Not found !");
		}

		const questRefers = referral.Refers.find((obj) => obj.questId === questId);

		if (questRefers === undefined || questRefers === null) {
			return Promise.resolve(false);
		}

		return Promise.resolve(questRefers.count >= minCount);
	}

	async getUserGems(walletId: string): Promise<number> {
		await this.referralQuerryService.readEntity({
			walletId,
		});
		return 1;
		// const totalgems = exist.Gems;
		// return totalgems;
	}

	async getReferralCode(walletId: string): Promise<any> {
		const exist = await this.referralQuerryService.readEntity({
			walletId,
		});
		const refers = exist.ReferralCode;
		return refers;
	}

	// async getLink(walletId: string): Promise<any> {
	//   try {
	//     const exist = await this.referralQuerryService.readEntity({
	//       walletId: walletId,
	//     });
	//     const a = [];
	//     // const gems = exist.map((e) => {
	//     //   a.push({ Account: e.walletId, Gems: e.Gems });
	//     // });
	//     return a.sort().reverse();
	//   } catch (error) {
	//   }
	// }

	// eslint-disable-next-line consistent-return
	async addReferral(walletId: string): Promise<any> {
		try {
			if (
				await this.referralQuerryService.checkValidity({
					walletId,
				})
			) {
				return (
					await this.referralQuerryService.readEntity({
						walletId,
					})
				).ReferralCode;
			}
			const uuid = uuidV4().slice(0, 5).toUpperCase();
			const createdReferral = {
				walletId,
				ReferralCode: uuid,
				Refers: [],
			};

			await this.referralQuerryService.createEntity(createdReferral);
			return uuid;
		} catch (error) {
			throw new BadRequestException(error);
		}
	}
}
