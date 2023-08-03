import Moralis from "moralis";

export function parseLogs<T>(webhookData: any) {
	return Moralis.Streams.parsedLogs<T>(webhookData);
}
