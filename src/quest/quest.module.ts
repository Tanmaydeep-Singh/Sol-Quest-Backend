import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestModelDefs } from "../_common/database/schema";
import { AuthModule } from "../auth/auth.module";
import { QuestController } from "./quest.controller";
import { QuestService } from "./quest.service";

@Module({
	imports: [AuthModule, MongooseModule.forFeature(QuestModelDefs)],
	controllers: [QuestController],
	providers: [QuestService],
})
export class QuestModule {}
