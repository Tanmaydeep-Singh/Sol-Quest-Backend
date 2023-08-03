import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModelDefs } from "../_common/database/schema/index";
import { AuthService } from "./auth.service";
import { ConnectController } from "./connect/connect.controller";
import { ConncetService } from "./connect/connect.service";

@Module({
	imports: [
		MongooseModule.forFeature(AuthModelDefs),
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
	],
	controllers: [ConnectController, ConnectController],
	providers: [AuthService, ConncetService],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
