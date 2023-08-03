import { IsOptional, IsString, MinLength, Validate } from "class-validator";
import { IsObjectId } from "../../../_common/decorators/validation/ObjectId.decorator";
import { IsValidSignature } from "../../../_common/decorators/validation/signature.decorator";
import { IsWalletAddress } from "../../../_common/decorators/validation/walletAddress.decorator";

export class ConnectSignDto {
	@IsString()
	@Validate(IsWalletAddress)
	walletAddress: string;

	@IsString()
	@Validate(IsValidSignature)
	signature: string;

	@IsString()
	username: string;

	@IsString() // change later issue #16
	@IsOptional()
	icon: string;

	@IsString()
	@Validate(IsObjectId)
	language: string;

	@IsString()
	@Validate(IsObjectId)
	game: string;

	@IsString()
	@MinLength(3)
	about: string;

	@IsString()
	@MinLength(3)
	bio: string;

	@IsString()
	@MinLength(3)
	streamKey: string;

	@IsString()
	@MinLength(3)
	streamId: string;
}
