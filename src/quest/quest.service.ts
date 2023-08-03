import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { startOfMonth, startOfToday, sub } from "date-fns";
import mongoose, { Model } from "mongoose";
import QuestQueryService from "../_common/database/queries/quest.query";
import QuestProgressQueryService from "../_common/database/queries/questProgress.query";
import UserQueryService from "../_common/database/queries/user.query";
import { QuestDocument, modelName as questModel } from "../_common/database/schema/quest.schema";
import {
	QuestProgressDocument,
	modelName as questProgressModel,
} from "../_common/database/schema/questProgress.schema";
import { UserDocument, modelName as userModelName } from "../_common/database/schema/user.schema";
import { TaskStatus } from "../_common/quest/constants/task";
import { QuestProgressDTO } from "./dtos/QuestProgressDto";

import TaskQueryService from "../_common/database/queries/task.query";
import { TaskDocument, modelName as taskModelName } from "../_common/database/schema/task.schema";

@Injectable()
export class QuestService {
	userQueryService: UserQueryService;

	questProgressQueryService: QuestProgressQueryService;

	questQueryService: QuestQueryService;

	taskQueryService: TaskQueryService;

	constructor(
		@InjectModel(userModelName) UserModel: Model<UserDocument>,
		@InjectModel(taskModelName) TaskModel: Model<TaskDocument>,
		@InjectModel(questProgressModel)
		QuestProgressModel: Model<QuestProgressDocument>,
		@InjectModel(questModel) QuestModel: Model<QuestDocument>,
	) {
		this.userQueryService = new UserQueryService(UserModel);
		this.questProgressQueryService = new QuestProgressQueryService(QuestProgressModel);
		this.questQueryService = new QuestQueryService(QuestModel);
		this.taskQueryService = new TaskQueryService(TaskModel);
	}

	async getUsers(): Promise<UserDocument[]> {
		return this.userQueryService.readMultipleEntities(
			{},
			{ limit: 100 },
			{ games: 0, courses: 0 },
		);
	}

	async postUser(body) {
		try {
			const newUser = await this.userQueryService.createEntity(body);
			return newUser;
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	async getUser(walletId: string) {
		try {
			const allUser = await this.userQueryService.readMultipleEntities(
				{},
				{ limit: 100 },
				{ games: 0, courses: 0 },
			);
			const user = allUser.find(({ walletAddress }) => walletAddress === walletId);
			return user;
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	async getAllQuests(): Promise<Array<QuestDocument>> {
		try {
			// perform paagination on backend later
			const allQuests = await this.questQueryService.getAllQuests();
			return allQuests;
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	getParticipatedQuest(): any {
		return "Participated Quest";
	}

	getTotalPoints(): number {
		return 100;
	}

	// Verify Task
	async updateTaskStatus(questProgressDto: QuestProgressDTO): Promise<any> {
		const questProgress = await this.questProgressQueryService.readEntity({
			questId: questProgressDto.questId,
		});

		const { _id, taskStatus } = questProgress;

		const [taskId] = taskStatus;
		const updateTask = taskId ? [taskId, TaskStatus.COMPLETED] : [];
		await this.questProgressQueryService.updateEntity({ _id }, { taskStatus: updateTask });

		return Promise.resolve(
			await this.questProgressQueryService.readEntity({
				questId: questProgressDto.questId,
			}),
		);
	}

	async updateTaskInQuestProgress(
		questProgressID: string,
		userID: string,
		taskID,
		taskEnum: string,
	): Promise<QuestProgressDocument> {
		const questid = new mongoose.Types.ObjectId(questProgressID);
		const userid = new mongoose.Types.ObjectId(userID);

		const oldQuestProgress = await this.questProgressQueryService.readEntities({
			userId: userid,
			questId: questid,
		});

		console.log("QUEST AND USER PROGRESS", oldQuestProgress);

		const tasks = oldQuestProgress[0].taskStatus;

		let questGemCount = oldQuestProgress.gems_earned;
		let currentTaskReward = 0;

		console.log(currentTaskReward, questGemCount);
		console.log("TASK", tasks);

		tasks.forEach((obj: any) => {
			if (obj.taskId.toString() === taskID) {
				currentTaskReward = obj.points;
				// eslint-disable-next-line no-param-reassign
				obj.status = TaskStatus.COMPLETED;
				questGemCount += obj.points;
			}
		});
		console.log(taskEnum);

		await this.questProgressQueryService.updateEntity(
			{ _id: oldQuestProgress[0]._id },
			{
				taskStatus: tasks,
			},
		);

		console.log(await this.taskQueryService.readEntity({ task: taskEnum }));

		const updateUser = await this.userQueryService.updateEntity(
			{ _id: oldQuestProgress[0].userId },
			{
				$inc: { gems: 10 },
			},
		);

		if (!updateUser) {
			throw new BadRequestException({
				statusCode: 400,
				message: "error in updating user !",
			});
		}

		const newQuestProgress = await this.questProgressQueryService.readEntities({
			userId: userid,
			questId: questid,
		});
		console.log("NEW", newQuestProgress[0].taskStatus);
		return this.questProgressQueryService.readEntity({
			questId: questid,
		});
	}

	async postQuestProgress(questProgressDTO: QuestProgressDTO) {
		const quest = await this.questProgressQueryService.createEntity(questProgressDTO);
		const { userId, questId } = quest;
		const { referrelUserObjectId, taskId } = questProgressDTO;

		if (referrelUserObjectId && taskId !== "tasks") {
			console.log("called");
			const object = {
				questProgressID: questId,
				userID: referrelUserObjectId,
				taskId,
				taskEnum: "referral",
			};

			console.log(object);

			this.updateTaskInQuestProgress(
				questId.toString(),
				referrelUserObjectId,
				taskId,
				"referral",
			);
		}

		const userDetails = await this.userQueryService.readEntity({
			_id: userId,
		});

		const updatedQuests = userDetails.participated_quests
			? userDetails.participated_quests
			: [];
		updatedQuests.push(questId);

		await this.userQueryService.updateEntity(
			{ _id: userId },
			{
				participated_quests: updatedQuests,
			},
		);

		return quest;
	}

	async getUsersQuestProgress(userID: string, questID: string): Promise<Array<any>> {
		const questProgress = await this.questProgressQueryService.readMultipleEntities(
			{ userID, questID },
			{},
		);

		const taskArray = [];

		questProgress.forEach((task: any) => {
			if (task.questId.toString() === questID && task.userId.toString() === userID) {
				task.taskStatus.forEach((e: any) => {
					if (e.status === "completed") {
						taskArray.push(e.taskId);
					}
				});
			}
		});
		return taskArray;
	}

	async getQuesters(questId: string): Promise<Array<any>> {
		if (questId === undefined || questId === null) {
			throw new BadRequestException("Invalid Quest Id");
		}
		const QuestersId = await this.questProgressQueryService.readMultipleEntities(
			{ questId },
			{},
		);

		if (QuestersId === null || QuestersId === undefined) {
			throw new BadRequestException("No such Quest Progress Model exist");
		}

		const Users: Promise<any>[] = [];

		QuestersId.forEach((questProgress: any) => {
			const { userId } = questProgress;
			Users.push(userId);
		});

		return Users;
	}

	async getQuester(questId: string): Promise<any> {
		const quests = await this.questQueryService.readEntity({ _id: questId });
		console.log(quests);
		return quests;
	}

	async getLeaderboard(questers: number, length: number) {
		try {
			const allUsers = await this.userQueryService.getLeaderboard(questers, length);

			return allUsers;
		} catch (error: any) {
			throw new BadRequestException(error);
		}
	}

	getLeaderboardDaily(questers: number, length: number) {
		const result = sub(startOfToday(), { days: 1 });
		return this.userQueryService.getLeaderBoardDaily(result, questers, length);
	}

	getLeaderboardMonthly(questers: number, length: number) {
		const result = sub(startOfMonth(new Date()), { months: 1 });
		return this.userQueryService.getLeaderBoardDaily(result, questers, length);
	}
}
