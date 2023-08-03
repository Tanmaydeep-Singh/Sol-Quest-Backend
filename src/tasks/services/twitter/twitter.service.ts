import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as dotenv from "dotenv";
import { Model } from "mongoose";
import { Client } from "twitter-api-sdk";
import { OAuth2User } from "twitter-api-sdk/dist/OAuth2User";
import UserQueryService from "../../../_common/database/queries/user.query";
import {
	UserDocument,
	modelName as userModelName,
} from "../../../_common/database/schema/user.schema";
import { CreateRetweetDto, FollowUserDto } from "../../../quest/dtos/TwitterDto";

dotenv.config();

@Injectable()
export class TwitterService {
	userQueryService: UserQueryService;

	twitterClient: OAuth2User;

	constructor(@InjectModel(userModelName) UserSchema: Model<UserDocument>) {
		this.userQueryService = new UserQueryService(UserSchema);
		this.twitterClient = new OAuth2User({
			client_id: process.env.TWITTER_CLIENT_ID,
			client_secret: process.env.TWITTER_CLIENT_SECRET,
			// callback: "http://localhost:5000/v1/tasks/twitter/callback",
			callback: "http://localhost:3000/quest/twitter/callback",
			scopes: [
				"users.read",
				"follows.write",
				"offline.access",
				"follows.read",
				"tweet.write",
				"tweet.read",
				"like.read",
				"like.write",
			],
		});
	}

	async login(walletId: string) {
		const authUrl = this.twitterClient.generateAuthURL({
			state: walletId,
			code_challenge_method: "s256",
		});
		return authUrl;
	}

	async authCallback(code: string, state: string, walletAddress: string) {
		// let { } = this.twitterClient.token

		await this.userQueryService.readEntity({ walletAddress });

		const token = await this.twitterClient.requestAccessToken(code);

		this.userQueryService.updateEntity({ walletAddress }, { twitterToken: token.token });

		await this.userQueryService.readEntity({ walletAddress });

		console.log("called");
	}

	async getUserClient(walletAddress: string): Promise<{ client: Client; clientUser: any }> {
		const user = await this.userQueryService.readEntity({ walletAddress });
		// get user
		const token = user.twitterToken;

		this.twitterClient.token = token;
		if (this.twitterClient.isAccessTokenExpired()) {
			this.refreshToken();
		}

		const client = new Client(this.twitterClient);
		const clientUser = await client.users.findMyUser();
		return { client, clientUser };
	}

	async refreshToken() {
		try {
			await this.twitterClient.refreshAccessToken();
		} catch (err) {
			console.error(err);
		}
	}

	async getTwitterMe(walletAddress: string) {
		const currentUser = await this.userQueryService.readEntity({ walletAddress });
		// get user
		const token = currentUser.twitterToken;

		this.twitterClient.token = token;
		if (this.twitterClient.isAccessTokenExpired()) {
			this.refreshToken();
		}

		const client = new Client(this.twitterClient);

		const userData = await client.users.findMyUser();

		return { message: "success", data: userData.data };
	}

	async getTwitterUser(walletId: string, twitterHandle: string) {
		const { client, clientUser } = await this.getUserClient(walletId);
		if (clientUser?.data) {
			const user = await client.users.findUserByUsername(twitterHandle);
			if (user.errors) {
				throw new Error(user.errors[0].detail);
			}
			return { message: "success", data: user.data };
		}
		return "";
	}

	async getTweetById(walletId: string, tweetId: string) {
		const { client, clientUser } = await this.getUserClient(walletId);
		if (clientUser?.data) {
			const tweet = await client.tweets.findTweetById(tweetId, {
				"user.fields": ["name"],
				"tweet.fields": ["text", "source"],
			});
			if (tweet.errors) {
				throw new Error(tweet.errors[0].detail);
			}
			return { message: "success", data: tweet.data };
		}
		return { message: "SOMETHING WENT WRONG" };
	}

	async followTwitterUser(createFollowuser: FollowUserDto) {
		const { client, clientUser } = await this.getUserClient(createFollowuser.walletId);

		const clientID = await client.users.findUserByUsername(createFollowuser.twitterId);

		if (clientUser?.data) {
			const follow = await client.users.usersIdFollow(clientUser.data.id, {
				target_user_id: clientID.data.id,
			});

			if (follow.errors) {
				throw new Error(follow.errors[0].detail);
			}
			return { message: "success", data: follow.data };
		}
		return { message: "SOMETHING WENT WRONG" };
	}

	async createRetweet(createRetweet: CreateRetweetDto) {
		const { client, clientUser } = await this.getUserClient(createRetweet.walletId);
		if (clientUser?.data) {
			const retweet = await client.tweets.usersIdRetweets(clientUser.data.id, {
				tweet_id: createRetweet.tweetId,
			});
			if (retweet.errors) {
				throw new Error(retweet.errors[0].detail);
			}
			return { message: "success", data: retweet.data };
		}
		return { message: "SOMETHING WENT WRONG" };
	}

	async createLike(createRetweet: CreateRetweetDto) {
		const { client, clientUser } = await this.getUserClient(createRetweet.walletId);
		if (clientUser?.data) {
			const retweet = await client.tweets.usersIdLike(clientUser.data.id, {
				tweet_id: createRetweet.tweetId,
			});
			if (retweet.errors) {
				throw new Error(retweet.errors[0].detail);
			}
			return { message: "success", data: retweet.data };
		}
		return { message: "SOMETHING WENT WRONG" };
	}

	getHello(): string {
		return "Hello Twitter ";
	}
}
