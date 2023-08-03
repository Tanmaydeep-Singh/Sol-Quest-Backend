import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./_common/exceptions/http-exception.filter";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ["error", "warn", "debug", "log", "verbose"],
	});
	app.use(cookieParser());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: false }));
	app.enableVersioning({ type: VersioningType.URI });
	app.enableCors();

	await app.listen(5000);
}
bootstrap();
