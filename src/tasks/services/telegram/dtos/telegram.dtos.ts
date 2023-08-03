import { IsNotEmpty } from "class-validator";

export class TelegramDTO {
	@IsNotEmpty()
	walletId: string;

	@IsNotEmpty()
	ChannelName: string;

	@IsNotEmpty()
	Chat_ID: string;

	@IsNotEmpty()
	UserName: string;

	@IsNotEmpty()
	User_ID: string;
}
