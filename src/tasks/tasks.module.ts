import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { TasksModelDefs } from "../_common/database/schema";
import { providers } from "./providers";
import { TasksController } from "./tasks.controller";

@Module({
	imports: [
		MongooseModule.forFeature(TasksModelDefs),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>("JWT_ACCESS_SECRET"),
				signOptions: {
					expiresIn: config.get<string | number>("JWT_EXP_TIME"),
				},
			}),
			inject: [ConfigService],
		}),
		HttpModule,
	],
	providers: [...providers],
	controllers: [TasksController],
	exports: [JwtModule],
})
export class TasksModule {}
