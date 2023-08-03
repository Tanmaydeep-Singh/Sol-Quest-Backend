export enum AuthRoles {
	ADMIN = "ADMIN",
	USER = "USER",
}

type AuthPayload = {
	// signature: string;
	walletId: string;
};

export type TRequestWithAuth = Request & AuthPayload;
