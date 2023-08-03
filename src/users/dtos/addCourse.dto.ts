import { IsString, Validate } from "class-validator";
import { IsObjectId } from "../../_common/decorators/validation/ObjectId.decorator";
import { IsWalletAddress } from "../../_common/decorators/validation/walletAddress.decorator";

export class AddCourseDto {
	@IsString()
	@Validate(IsWalletAddress)
	walletAddress: string;

	@Validate(IsObjectId)
	id: string;
}
