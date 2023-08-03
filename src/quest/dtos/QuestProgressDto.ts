import { IsNotEmpty, IsNumber, IsObject, IsString, Validate } from "class-validator";
import { IsObjectId } from "../../_common/decorators/validation/ObjectId.decorator";
import { AuthRoles } from "../../_common/quest/constants/auth_roles";
import { QuestStatus } from "../../_common/quest/constants/quest";
import { rewardType } from "../../_common/quest/constants/reward";
import { TaskStatus } from "../../_common/quest/constants/task";

class RewardsDTO {
	@Validate(IsObjectId)
	@IsNotEmpty()
	questId: string;

	@IsString()
	rewardType: rewardType;

	@IsNumber()
	rewardValue: number;
}

class ParticipatedQuestsDTO {
	@Validate(IsObjectId)
	@IsNotEmpty()
	questId: string;

	@IsString()
	status: QuestStatus;
}

class GemsDTO {
	@Validate(IsObjectId)
	@IsNotEmpty()
	questId: string;

	@IsNumber()
	value: number;
}

class TaskStatusDTO {
	@Validate(IsObjectId)
	taskId: string;

	@IsString()
	status: TaskStatus;
}

export class QuestProgressDTO {
	@Validate(IsObjectId)
	@IsNotEmpty()
	questId: string;

	@Validate(IsObjectId)
	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	taskStatus: TaskStatusDTO[];

	@IsString()
	referrelUserObjectId: string;

	@IsString()
	taskId: string;
}

export class UserDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	walletId: string;

	@IsNotEmpty()
	@IsString()
	roles: AuthRoles;

	@Validate(IsObjectId)
	quests: QuestProgressDTO[];

	@Validate(IsObject)
	gems: GemsDTO[];

	@Validate(IsObject)
	participated_quests: ParticipatedQuestsDTO[];

	@Validate(IsObject)
	rewards: RewardsDTO;
}

export class FetchUserDTO {
	@IsString()
	@IsNotEmpty()
	walletId: string;
}

export class GetCurrentQuestDto {
	@Validate(IsObjectId)
	userId: string;

	@Validate(IsObjectId)
	questId: string;
}

export class UserQuestProgress {
	@Validate(IsObjectId)
	userId: string;

	@Validate(IsObjectId)
	questId: string;
}
