import { Equals, IsString, Validate } from "class-validator";
import { IsWalletAddress } from "../../../_common/decorators/validation/walletAddress.decorator";
import { AUTH_ROLES } from "../../../_common/types.global";

export class ConnectWalletDto {
	@IsString()
	@Equals(AUTH_ROLES.member)
	role: AUTH_ROLES;

	@IsString()
	@Validate(IsWalletAddress)
	walletAddress: string;
}
