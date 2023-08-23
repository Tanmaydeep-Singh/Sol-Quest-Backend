import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TasksModule } from "./tasks/tasks.module";
import { UsersModule } from "./users/users.module";


import { QuestModule } from "./quest/quest.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.MONGODB_CON_STRING),
		TasksModule,
		UsersModule,
		UsersModule,
		QuestModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes({ path: "*", method: RequestMethod.ALL });
	}
}
