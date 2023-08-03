import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";
import { userRoute } from "./users/users.route";

import { LoggerMiddleware } from "./_common/middleware/logger.middleware";

import { QuestModule } from "./quest/quest.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.MONGODB_CON_STRING),
		TasksModule,
		AuthModule,
		UsersModule,
		UsersModule,
		QuestModule,
		RouterModule.register([userRoute]),
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
	}
}
