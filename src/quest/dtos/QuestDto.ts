import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EligibityCriteria } from "../../_common/quest/constants/eligibility_criteria";
import { rewardMethod, rewardType } from "../../_common/quest/constants/reward";
import { TaskOption } from "../../_common/quest/constants/task";

class TaskDto {
	@IsEnum(TaskOption)
	task: TaskOption;

	customisation: any;

	@IsNumber()
	points: number;
}

export class CreateQuestDto {
	@IsString()
	createdBy: string;

	@IsArray()
	@Type(() => TaskDto)
	tasks: TaskDto[];

	@IsEnum(EligibityCriteria)
	eligibility: EligibityCriteria;

	@IsEnum(rewardMethod)
	rewardMethod: rewardMethod;

	@IsString()
	@IsNotEmpty()
	questTitle: string;

	@IsString()
	@IsNotEmpty()
	questDescription: string;

	@IsEnum(rewardType)
	rewardType: rewardType;
}

