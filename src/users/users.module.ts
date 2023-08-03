import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModelDefs } from "../_common/database/schema";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [AuthModule, MongooseModule.forFeature(UsersModelDefs)],
	controllers: [],
	providers: [],
})
export class UsersModule {}
