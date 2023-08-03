import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class DiscordService {
	constructor(private readonly httpService: HttpService) {}

	createTask(discordLink, discordGuildID): string {
		return ` ${discordLink} & ${discordGuildID}`;
	}

	async getUserGuilds(GuildID: string, Code: string): Promise<boolean> {
		const guildID = GuildID;
		const code = Code;

		const params = new URLSearchParams({
			client_id: `${process.env.DISCORD_CLIENT_ID}`,
			client_secret: `${process.env.DISCORD_CLIENT_SECRET}`,
			grant_type: "authorization_code",
			code,
			redirect_uri: "http://localhost:3000/quest/discordVerify",
		});

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept-Encoding": "application/x-www-forn-urlencoded",
		};

		const resp = await firstValueFrom(
			this.httpService
				.post(`${process.env.DISCORD_URL}/oauth2/token`, params, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);

		const userGuildData = await firstValueFrom(
			this.httpService
				.get(`${process.env.DISCORD_URL}/users/@me/guilds`, {
					headers: {
						Authorization: `Bearer ${resp.data.access_token}`,
					},
				})
				.pipe(
					catchError(() => {
						throw new BadRequestException("An error happened! 2");
					}),
				),
		);

		const userGuilds = userGuildData.data;

		function verifyUser(userGuilds, GuildID) {
			let verify = [];
			verify = userGuilds.filter((v) => {
				if (v.id === GuildID) {
					return true;
				}
				return false;
			});

			if (verify.length > 0) {
				return true;
			}
			return false;
		}
		const finalResponse = verifyUser(userGuilds, guildID);
		if (finalResponse === true) {
			return true;
		}
		return false;
	}
}
