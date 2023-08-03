import { ConfigService } from "@nestjs/config";
import { DiscordService } from "./services/discord/discord.service";
import { GasFeeService } from "./services/on-chain/gas-fee/gas-fee.service";
import { OnChainService } from "./services/on-chain/on-chain.service";
import { ReferralService } from "./services/referral/referral.service";
import { TelegramService } from "./services/telegram/telegram.service";
import { TwitterService } from "./services/twitter/twitter.service";
import { OpenseaService } from "./services/on-chain/openseas/opensea.service";

export const providers = [
	TwitterService,
	DiscordService,
	TelegramService,
	ReferralService,
	GasFeeService,
	OnChainService,
	OpenseaService,
	ConfigService,
];
