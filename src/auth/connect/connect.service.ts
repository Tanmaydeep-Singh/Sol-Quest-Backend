import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { utils } from "ethers";
import { Model } from "mongoose";
import adjectives from "../../_common/constants/adjectives.json";
import cities from "../../_common/constants/cities.json";
import UserQueryService from "../../_common/database/queries/user.query";
import {
	IUser,
	modelName as userModelName,
	UserDocument,
} from "../../_common/database/schema/user.schema";
import { AUTH_ROLES } from "../../_common/types.global";
import { NewTokenDto } from "./dtos/newToken.dto";
import { ConnectSignDto } from "./dtos/signature.dto";

@Injectable()
export class ConncetService {
	userQueryService: UserQueryService;

	constructor(
		@InjectModel(userModelName) UserModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
		private configService: ConfigService,
	) {
		this.userQueryService = new UserQueryService(UserModel);
	}

	generateTempName(): string {
		const adj = adjectives[Math.floor(Math.random() * (adjectives.length - 1))];
		const city = cities[Math.floor(Math.random() * (cities.length - 1))];
		return `${adj}_${city.replace(" ", "")}^${Math.floor(Math.random() * 10000)}`;
	}

	generateJWT(obj: object, type: "access" | "refresh"): string {
		if (type === "access") return this.jwtService.sign(obj, { expiresIn: "12d" });
		return this.jwtService.sign(obj, { expiresIn: "60d" });
	}

	checkSignature(walletAddress: string, signature: string) {
		const signAddr = utils.verifyMessage(`Signing with acc: ${walletAddress}`, signature);
		if (signAddr.toLowerCase() !== walletAddress.toLowerCase())
			throw new BadRequestException("Incorrect signature");
	}

	async handleWalletConnect(
		user: Omit<IUser, "username" | "role">,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const walletAddress = user.walletAddress.toLowerCase();
		const jwt = this.generateJWT({ walletAddress }, "access");
		if (await this.userQueryService.checkValidity({ walletAddress })) {
			const _user = await this.userQueryService.readEntity({
				walletAddress,
			});
			if (_user.role.includes(AUTH_ROLES.member))
				return { accessToken: jwt, refreshToken: null };
			if (_user.role.includes(AUTH_ROLES.expert))
				return {
					accessToken: jwt,
					refreshToken: this.generateJWT({ walletAddress }, "refresh"),
				};
			throw new BadRequestException();
		}
		await this.userQueryService.createEntity({
			...user,
			walletAddress,
			username: this.generateTempName(),
		});
		return { accessToken: jwt, refreshToken: null };
	}

	async generateExpertToken(user: NewTokenDto) {
		const { refreshToken, signature } = user;
		const walletAddress = user.walletAddress.toLowerCase();
		this.checkSignature(walletAddress, signature);

		if (!(await this.userQueryService.checkValidity({ walletAddress })))
			throw new BadRequestException("Invalid user");

		const tokenObj: { walletAddress: string } = await this.jwtService
			.verifyAsync(refreshToken)
			.catch((err) => {
				throw new BadRequestException(`jwt verification failed: ${err.message}`);
			});

		this.checkSignature(tokenObj.walletAddress.toLowerCase(), signature);

		return {
			accessToken: this.generateJWT({ walletAddress: tokenObj.walletAddress }, "access"),
		};
	}

	async handleSignConnect(
		user: ConnectSignDto,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { signature, game, streamId, streamKey, ...data } = user;
		const walletAddress = user.walletAddress.toLowerCase();

		this.checkSignature(walletAddress, signature);

		const _user = await this.userQueryService
			.readEntity({
				walletAddress,
			})
			.catch((error) => {
				if (error.status === 400) {
					throw new BadRequestException("User has not connected wallet");
				} else throw error;
			});
		if (_user.role.includes(AUTH_ROLES.expert)) {
			throw new BadRequestException("Expert is already registered");
		}

		if (_user.role.includes(AUTH_ROLES.member)) {
			await this.userQueryService
				.updateEntity(
					{ walletAddress },
					{
						...data,
						role: [AUTH_ROLES.expert],
						games: [game],
						stream: { key: streamKey, id: streamId },
					},
				)
				.catch(() => {
					throw new InternalServerErrorException();
				});
			return {
				accessToken: this.generateJWT({ walletAddress }, "access"),
				refreshToken: this.generateJWT({ walletAddress }, "refresh"),
			};
		}
		throw new BadRequestException("Invalid user");
	}
}
