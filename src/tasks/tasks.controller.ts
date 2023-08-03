import { BigNumber } from "@ethersproject/bignumber";
import { BadRequestException, Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Param, Patch, Query } from "@nestjs/common/decorators";
import { Response } from "express";
import { CreateRetweetDto, FollowUserDto } from "../quest/dtos/TwitterDto";
import { DiscordService } from "./services/discord/discord.service";
import { GasFeeService } from "./services/on-chain/gas-fee/gas-fee.service";
import { OnChainService } from "./services/on-chain/on-chain.service";
import { OpenseaService } from "./services/on-chain/openseas/opensea.service";
import { ReferralDTO } from "./services/referral/dtos/referral.dto";
import { ReferralService } from "./services/referral/referral.service";
import { TelegramService } from "./services/telegram/telegram.service";
import { TwitterService } from "./services/twitter/twitter.service";

@Controller({ path: "tasks", version: "1" })
export class TasksController {
	constructor(
		private readonly discordService: DiscordService,
		private readonly twitterService: TwitterService,
		private readonly telegramServices: TelegramService,
		private readonly referralService: ReferralService,
		private readonly gasFeeService: GasFeeService,
		private readonly onChainService: OnChainService,
		private readonly openseaService: OpenseaService,
	) {}

	//  DISCORD TASKS //
	@Get("/discord")
	getDiscord() {
		return "Hello Discord";
	}

	@Post("/discord/create")
	async createDiscordTaks(@Body() discordLink: string, @Body() discordGuildID: string) {
		try {
			return await this.discordService.createTask(discordLink, discordGuildID);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	@Post("/discord")
	joinChannel(@Body() uri: string, @Res() res) {
		return res.redirect(uri);
	}

	@Get("/discord/verify/:GuildID/:Code")
	getuserGuilds(
		@Param("GuildID") guildId: string,
		@Param("Code") code: string,
	): Promise<boolean> {
		return this.discordService.getUserGuilds(guildId, code);
	}

	// TWITTER TASKS //
	@Get("/twitter")
	getTwitterHello(): string {
		return this.twitterService.getHello();
	}

	@Get("/twitter/login")
	async twitterLogin(
		@Res({ passthrough: true }) res: Response,
		@Query("walletId") walletId: string,
	) {
		const url = await this.twitterService.login(walletId);
		res.cookie("walletId", walletId).redirect(url);
	}

	@Get("/twitter/callback/:walletId")
	async callback(
		@Query("code") code: string,
		@Param("walletId") walletId: string,
		@Query("state") state: string,
	) {
		console.log("called");
		return this.twitterService.authCallback(code, state, walletId);
	}

	@Get("/twitter/get/me")
	async getTwitterUser(@Query("walletId") walletId: string) {
		console.log("called");
		return this.twitterService.getTwitterMe(walletId);
	}

	@Get("/twitter/get/:username")
	async getTwitterUserByUsername(
		@Query("walletId") walletId: string,
		@Param("username") username: string,
	) {
		return this.twitterService.getTwitterUser(walletId, username);
	}

	@Post("/twitter/follow")
	async followUser(@Body() body: FollowUserDto) {
		console.log(body);
		return this.twitterService.followTwitterUser(body);
	}

	@Post("/twitter/retweet")
	async retweet(@Body() body: CreateRetweetDto) {
		return this.twitterService.createRetweet(body);
	}

	@Post("/twitter/createLike")
	async createLike(@Body() body: CreateRetweetDto) {
		return this.twitterService.createLike(body);
	}

	@Get("/twitter/tweets/:id")
	async getTweets(@Param("id") id: string, @Query("walletId") walletId: string) {
		return this.twitterService.getTweetById(walletId, id);
	}

	// @Get("/twitter/tweets")
	// getTweets(): Promise<any> {
	// 	const tweets = this.client.tweets.findTweetById("20");
	// 	return tweets;
	// }

	// TELEGRAM TASKS //

	@Get("/telegram/verify/:UserID/:ChannelName")
	verifyUser(@Param("UserID") UserID: string, @Param("ChannelName") ChannelName: string) {
		return this.telegramServices.verifyUser(ChannelName, UserID);
	}

	// REFERRAL TASKS //
	// @Get('/referral')
	// async getLink(): Promise<any> {
	//   const generated = await this.referralService.getLink();
	//   return generated;
	// }

	@Post("/referral")
	async addReferral(@Body() body: { walletAddress: string }): Promise<any> {
		const generateReferral = await this.referralService.addReferral(body.walletAddress);

		return generateReferral;
	}

	@Get("/referral/getUserGems/:userwallet")
	async getUserGems(@Param("userwallet") userWallet: string): Promise<number> {
		return this.referralService.getUserGems(userWallet);
	}

	@Get("/referral/:id")
	async getReferralCode(@Param("id") walletId: string): Promise<any> {
		const referralCode = await this.referralService.getReferralCode(walletId);
		return referralCode;
	}

	@Patch("/referral/:id")
	async updateReferral(
		@Body() referralDTO: ReferralDTO,
		@Param("id") ReferralCode: string,
	): Promise<any> {
		const UpdatedReferral = await this.referralService.updateReferral(
			referralDTO.questId,
			ReferralCode,
			referralDTO.walletId,
		);
		return UpdatedReferral;
	}

	@Get("/referral-verify/:referCode/:questID/:count")
	async verifyReferralCount(
		@Param("referCode") referCode: string,
		@Param("questID") questID: string,
		@Param("count") minCount: number,
	): Promise<boolean> {
		try {
			return this.referralService.verifyReferralCount(questID, referCode, minCount);
		} catch (error: any) {
			throw new BadRequestException();
		}
	}

	// ONCHAIN GAS FEES //
	@Get("/gas-fees/:walletId/:minBal")
	async getTotalGasFeesSpent(
		@Param("walletId") walletId: string,
		@Param("minBal") minBal: number,
	): Promise<boolean> {
		try {
			return this.gasFeeService.getTotalGasFeesSpent(walletId, minBal);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	// ONCHAIN TRANSACTION COUNT CHECK //
	@Get("/transaction-count/:walletId")
	async getTotalNumberOfTransactions(@Param("walletId") walletId: string): Promise<number> {
		try {
			return this.gasFeeService.getTotalNumberOfTransactions(walletId);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	// VERIFY NFT COUNT CHECK //
	@Get("/nft-count/:walletId/:minCount")
	async verifyNFTcount(
		@Param("walletId") walletId: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		try {
			return this.onChainService._verifyNFTcount(walletId, minCount);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	// VERIFY WALLET BALANCE //
	@Get("/wallet-check/:walletId/:minBalance")
	async verifyBalance(
		@Param("walletId") walletId: string,
		@Param("minBalance") minBalance: BigNumber,
	): Promise<boolean> {
		try {
			return this.gasFeeService.walletBalanceCheck(walletId, minBalance);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	// ENS TASKS //
	@Get("/ens-check/:walletId/:minCount")
	async verifyENScount(
		@Param("walletId") walletId: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		try {
			return this.onChainService.verifyENScount(walletId, minCount);
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	// NFTs PURCHASED //
	@Get("/opensea/nft-purchased/:walletId/:minCount")
	async verifyPurchasedNFTCount(
		@Param("walletId") walletId: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		return this.openseaService.verifyPurchasedNFT(walletId, minCount);
	}

	// SPECIFIED NFT PURCHASES //
	@Get("/opensea/specified-nft-purchases/:walletId/:contractAddress/:minCount")
	async vaeifySpecifiedNFTPurchases(
		@Param("walletId") walletId: string,
		@Param("contractAddress") contractAddress: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		return this.openseaService.vaeifySpecifiedNFTPurchases(walletId, contractAddress, minCount);
	}

	// TOTAL VALUE OF NFT PURCHASED //
	@Get("/opensea/nft-purchased-value/:walletId/:minValue")
	async verifyPurchasedNFTValue(
		@Param("walletId") walletId: string,
		@Param("minValue") minValue: number,
	): Promise<boolean> {
		return this.openseaService.verifyPurchasedNFTValue(walletId, minValue);
	}

	// SPECIFIED NFT PURCHASE VALUE //
	@Get("/opensea/specified-nft-purchases-value/:walletId/:contractAddress/:minValue")
	async vaeifySpecifiedNFTPurchasesValue(
		@Param("walletId") walletId: string,
		@Param("contractAddress") contractAddress: string,
		@Param("minValue") minValue: number,
	): Promise<boolean> {
		return this.openseaService.vaeifySpecifiedNFTPurchasesValue(
			walletId,
			contractAddress,
			minValue,
		);
	}

	// NFTs Sold //
	@Get("/opensea/nft-sold/:walletId/:minCount")
	async verifysoldNFTCount(
		@Param("walletId") walletId: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		return this.openseaService.verifySoldNFT(walletId, minCount);
	}

	// SPECIFIED NFT's SOLD //
	@Get("/opensea/specified-nft-sold/:walletId/:contractAddress/:minCount")
	async vaeifySpecifiedNFTSold(
		@Param("walletId") walletId: string,
		@Param("contractAddress") contractAddress: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		return this.openseaService.vaeifySpecifiedNFTSold(walletId, contractAddress, minCount);
	}

	// TOTAL VALUE OF NFTS SOLD //
	@Get("/opensea/nft-sold-value/:walletId/:minValue")
	async verifySoldNFTValue(
		@Param("walletId") walletId: string,
		@Param("minValue") minValue: number,
	): Promise<boolean> {
		return this.openseaService.verifySoldNFTValue(walletId, minValue);
	}

	// TOTAL VALUE OF SPECIFIED NFTS SOLD //
	// eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
	@Get("/opensea/specified-nft-sold-value/:walletId/:contractAddress/:minCount")
	async vaeifySpecifiedNFTSoldValue(
		@Param("walletId") walletId: string,
		@Param("contractAddress") contractAddress: string,
		@Param("minCount") minCount: number,
	): Promise<boolean> {
		return this.openseaService.vaeifySpecifiedNFTSoldValue(walletId, contractAddress, minCount);
	}
}

// REFERRAL

// 1. User object ID as referral code =>
//  REFERRAL CODE: DOMAINNAME/quest/QUESTID/USEROBJECTID

// NEW USER : DOMAIN/quest/ :QUESTID / : USEROBJECTID   ---- USEROBJECTID & QUESTID AS AN OBJECT LOCALTORAGE
//  WHEN THER NEW OBJECT IS SAVED IN THE REDUX THEN REDIRECT => DOMAIN/ quest/ :QUESID

/// NEWUSER => PARTICIPATE BUTTON => WALLET CONNECT
//  OLDUSER => WALLETID

// Participate -> API request  { QUESTID, USEROBJECTID, USER-WALLETID}

// DISCORD ID => LOCALSTORAGE REDU
