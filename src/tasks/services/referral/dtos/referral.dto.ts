import { IsNotEmpty, IsString } from "class-validator";

export class ReferDTO {
	@IsNotEmpty()
	questId: string;

	@IsNotEmpty()
	count: string;

	@IsNotEmpty()
	referredUsers: string[];
}

export class ReferralDTO {
	@IsNotEmpty()
	@IsString()
	walletId: string;

	@IsNotEmpty()
	@IsString()
	questId: string;
}
