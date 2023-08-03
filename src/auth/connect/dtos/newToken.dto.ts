import { Equals, IsString, Validate } from "class-validator";
import { IsValidSignature } from "../../../_common/decorators/validation/signature.decorator";
import { IsWalletAddress } from "../../../_common/decorators/validation/walletAddress.decorator";
import { AUTH_ROLES } from "../../../_common/types.global";

export class NewTokenDto {
	@IsString()
	@Equals(AUTH_ROLES.expert)
	role: AUTH_ROLES;

	@IsString()
	@Validate(IsWalletAddress)
	walletAddress: string;

	@IsString()
	refreshToken: string;

	@IsString()
	@Validate(IsValidSignature)
	signature: string;
}
