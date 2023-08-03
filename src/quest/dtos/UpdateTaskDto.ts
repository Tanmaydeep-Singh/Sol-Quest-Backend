import { IsEnum, IsNotEmpty, Validate } from "class-validator";
import { IsObjectId } from "../../_common/decorators/validation/ObjectId.decorator";
import { TaskOption } from "../../_common/quest/constants/task";

export class UpdateTaskDTO {
	@Validate(IsObjectId)
	@IsNotEmpty()
	questProgressID: string;

	@IsNotEmpty()
	userID: string;

	@IsNotEmpty()
	taskID: string;

	@IsEnum(TaskOption)
	task: TaskOption;
}
