export enum TaskOption {
	TWITTER_TASK = "twitter_task",
	DISCORD_TASK = "discord_task",
	TELEGRAM_TASK = "telegram_task",
	REFERRAL = "referral",
	QUIZ = "quiz",
	REDDIT = "reddit",
	YOUTUBE = "youtube",
	COINGECKO = "coingecko",
	COINMARKETCAP = "coinmarketcap",
	NFT_CHECK_TASK = "nft_check_task",
	WALLET_BALANCE_TASK = "wallet_balance_task",
	GAS_FEE = "gas_fee",
	OPENSEA = "opensea",
	ENS_CHECK = "ens",
}

export enum TaskStatus {
	PENDING = "pending",
	COMPLETED = "completed",
}

export interface Task {
	task: TaskOption;
	customisation: string;
}
