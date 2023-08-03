import { Controller, Get, Param } from "@nestjs/common";
import { GetUserByIdDtoParams } from "./dtos/getUserById.dto";
import { UsersService } from "./users.service";

@Controller({ path: "users", version: "1" })
export class UsersController {
	// eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
	constructor(private usersService: UsersService) {}

	@Get()
	async getAllUsers() {
		return this.usersService.getUsers();
	}

	@Get("/:walletAddress")
	async getUserById(@Param() getUserByIdDtoParams: GetUserByIdDtoParams) {
		const { walletAddress } = getUserByIdDtoParams;
		return this.usersService.getUserProfile(walletAddress.toLowerCase());
	}
}
