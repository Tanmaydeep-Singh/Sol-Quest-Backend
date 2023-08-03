import { SetMetadata } from "@nestjs/common";
import { AUTH_ROLES } from "../../types.global";

export const ROLES_KEY = "roles";
export const Roles = (...roles: AUTH_ROLES[]) => SetMetadata("roles", roles);
