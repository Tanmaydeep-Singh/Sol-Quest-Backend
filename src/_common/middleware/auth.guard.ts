import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../../auth/auth.service";
import { AUTH_ROLES } from "../types.global";

@Injectable()
export class AuthGuard implements CanActivate {
	// eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
	constructor(
		private readonly jwtService: JwtService,
		private reflector: Reflector,
		private authService: AuthService,
		private configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization as string;

		const requiredRoles = this.reflector.getAllAndOverride<AUTH_ROLES[]>("roles", [
			context.getHandler(),
			context.getClass(),
		]);

		if (typeof authHeader === "undefined")
			throw new BadRequestException("authorization header cannot empty");

		const authToken = authHeader.split(" ")[1];
		const { walletAddress } = await this.jwtService.verifyAsync(authToken).catch((err) => {
			throw new BadRequestException(`jwt verification failed: ${err.message}`);
		});
		const _walletAddress = walletAddress.toLowerCase();

		request.walletAddress = _walletAddress;
		if (!requiredRoles) return Promise.resolve(true);

		// add admin user check here, issue #13
		if (_walletAddress === this.configService.get<string>("ADMIN_WALLET_ADDR").toLowerCase()) {
			if (requiredRoles.includes(AUTH_ROLES.admin)) {
				return Promise.resolve(true);
			}
		}

		const { role } = await this.authService.checkUserValidity(_walletAddress);

		// cyber-connect role
		if (requiredRoles.includes(AUTH_ROLES.ccMember) && role.includes(AUTH_ROLES.ccMember)) {
			return Promise.resolve(true);
		}

		if (requiredRoles.includes(AUTH_ROLES.expert) && role.includes(AUTH_ROLES.expert)) {
			return Promise.resolve(true);
		}
		throw new ForbiddenException("Invalid role");
	}
}
