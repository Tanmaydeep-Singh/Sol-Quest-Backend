import { Request } from "express";

export enum AUTH_ROLES {
	expert = "expert",
	member = "member",
	admin = "admin",
	ccMember = "ccMember",
}

type AuthPayload = {
	walletAddress: string;
};

export enum LIVESTREAM_STATUS {
	scheduled = "scheduled",
	live = "live",
	ended = "ended",
}

export enum CURRENCY_TYPE {
	base = "base",
	erc20 = "erc20",
	erc721 = "erc721",
}

export enum TRANSACTION_ASSET_TYPE {
	course = "course",
	livestream = "livestream",
}

export enum CONTRACT_STATUS {
	success = "success",
	failure = "failure",
	confirmed = "confirmed",
	refunded = "refunded",
	approved = "approved",
}

export enum ACCESS_TYPE {
	viewOnly = "viewOnly",
	editWithRequest = "editWithRequest",
	fullAccess = "fullAccess",
	master = "master",
}

export interface Page {
	cursor: number;
	length: number;
}

// export interface ContractEventLog {
// 	logIndex: string;
// 	transactionHash: string;
// 	address: string;
// 	data: string;
// 	topic0: string | null;
// 	topic1: string | null;
// 	topic2: string | null;
// 	topic3: string | null;
// }

export type TRequestWithAuth = Request & AuthPayload;
