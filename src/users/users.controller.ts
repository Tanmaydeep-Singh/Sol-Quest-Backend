import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GetUserByIdDtoParams, NewUserDTO } from "./dtos/getUserById.dto";
import { UsersService } from "./users.service";

@Controller({ path: "users", version: "1" })
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	async getAllUsers() {
		return this.usersService.getUsers();
	}

	@Post()
	async createNewUser(@Body() newUserDTO : NewUserDTO) {
		console.log(newUserDTO);
		return this.usersService.createNewUser(newUserDTO);
	}

	@Get("/:walletAddress")
	async getUserById(@Param() getUserByIdDtoParams: GetUserByIdDtoParams) {
		const { walletAddress } = getUserByIdDtoParams;
		return this.usersService.getUserProfile(walletAddress.toLowerCase());
	}
}
