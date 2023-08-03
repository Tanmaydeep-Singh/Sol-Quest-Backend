import { RouteTree } from "@nestjs/core";
import { UsersModule } from "./users.module";

export const userRoute: RouteTree = {
	path: "users",
	module: UsersModule,
};
