import {
	BadRequestException,
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { QuestProgressDocument } from "../_common/database/schema/questProgress.schema";
import { QuestProgressDTO } from "./dtos/QuestProgressDto";
import { QuestService } from "./quest.service";

@Controller({ path: "quest", version: "1" })
export class QuestController {
	// eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
	constructor(private questService: QuestService) {}

	@Get()
	getUsers(): any {
		return this.questService.getUsers();
	}

	@Post()
	async createUser(@Body() body) {
		return this.questService.postUser(body);
	}

	@Post("quests")
	async createQuestProgress(@Body() body) {
		console.log("called", body);
		return this.questService.postQuestProgress(body);
	}

	@Get("quests")
	getAllQuests(): any {
		return this.questService.getAllQuests();
	}

	@Get("participated-Quests")
	getparticipatedQuest(): any {
		return this.questService.getParticipatedQuest();
	}

	@Get("total-points")
	getTotalPoints(): any {
		return this.questService.getTotalPoints();
	}

	@Get("fetch-data/:id")
	getUserData(@Param("id") walletId: string): any {
		return this.questService.getUser(walletId);
	}

	// Verify task for a user
	@Post("verify")
	verifyTasks(@Body() questProgressDto: QuestProgressDTO): Promise<QuestProgressDocument> {
		return this.questService.updateTaskStatus(questProgressDto);
	}

	@Patch("update-task")
	updateTaskInQuestProgress(@Body() body: any): Promise<QuestProgressDocument> {
		console.log(body);
		try {
			console.log("called", body);
			return this.questService.updateTaskInQuestProgress(
				body.questProgressID,
				body.userID,
				body.taskID,
				body.taskEnum,
			);
		} catch (error) {
			throw new BadRequestException({
				status: 500,
				message: "Task not updated",
			});
		}
	}

	@Get("quests/:id")
	async getQuesters(@Param("id") questId: string): Promise<Array<any>> {
		const questers = await this.questService.getQuesters(questId);
		return questers;
	}

	@Get("quest/:id")
	async getQuester(@Param("id") questId: string): Promise<Array<any>> {
		const quester = await this.questService.getQuester(questId);
		return quester;
	}

	@Post("quest-progress")
	getCurrentQuestData(@Body() body: any): Promise<QuestProgressDocument[]> {
		return this.questService.getUsersQuestProgress(body.userID, body.questID);
	}

	@Get("leaderboard")
	getLeaderboard(
		@Query("page", new DefaultValuePipe(0), ParseIntPipe) questers: number,
		@Query("length", new DefaultValuePipe(100), ParseIntPipe) length: number,
	) {
		return this.questService.getLeaderboard(questers, length);
	}

	@Get("leaderboard/daily")
	getLeaderboardDaily(
		@Query("page", new DefaultValuePipe(0), ParseIntPipe) questers: number,
		@Query("length", new DefaultValuePipe(100), ParseIntPipe) length: number,
	) {
		return this.questService.getLeaderboardDaily(questers, length);
	}

	@Get("leaderboard/monthly")
	getLeaderboardMonthly(
		@Query("page", new DefaultValuePipe(0), ParseIntPipe) questers: number,
		@Query("length", new DefaultValuePipe(100), ParseIntPipe) length: number,
	) {
		return this.questService.getLeaderboardMonthly(questers, length);
	}
}
