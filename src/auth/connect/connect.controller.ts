import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ConncetService } from "./connect.service";
import { NewTokenDto } from "./dtos/newToken.dto";
import { ConnectSignDto } from "./dtos/signature.dto";
import { ConnectWalletDto } from "./dtos/wallet.dto";

@Controller({ path: "auth/connect", version: "1" })
export class ConnectController {
	// eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
	constructor(private conncetService: ConncetService) {}

	@Post("/signature")
	@HttpCode(201)
	generateSignatureToken(@Body() connectSignDto: ConnectSignDto) {
		return this.conncetService.handleSignConnect(connectSignDto);
	}

	@Post("/wallet")
	@HttpCode(201)
	generateWalletToken(@Body() connectWalletDto: ConnectWalletDto) {
		return this.conncetService.handleWalletConnect(connectWalletDto);
	}

	@Post("/refresh")
	@HttpCode(201)
	generateExpertToken(@Body() newTokenDto: NewTokenDto) {
		return this.conncetService.generateExpertToken(newTokenDto);
	}
}
