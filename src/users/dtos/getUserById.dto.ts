import { IsString, Validate } from "class-validator";
import { IsWalletAddress } from "../../_common/decorators/validation/walletAddress.decorator";

export class GetUserByIdDtoParams {
	@IsString()
	@Validate(IsWalletAddress)
	walletAddress: string;
}
