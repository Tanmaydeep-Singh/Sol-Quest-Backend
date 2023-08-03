import { EvmChain } from "@moralisweb3/evm-utils";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Moralis from "moralis";

import config from "../constants/moralis.config.json";

interface StreamOptions {
	webhookUrl: string;
	tag: string;
	topic0: string[];
	abi: any;
	includeNativeTxs: boolean;
	includeContractLogs: boolean;
	description: string;
	chains: string[];
}

type StreamStatus = "active" | "paused" | "error" | "terminated";

@Injectable()
export class MoralisService implements OnApplicationBootstrap {
	chains: EvmChain[];

	moralisLogger = new Logger("MoralisService");

	constructor(private configService: ConfigService) {}

	async onApplicationBootstrap() {
		await Moralis.start({
			apiKey: this.configService.get<string>("MORALIS_STREAM_API_KEY"),
		});
		const { result } = await Moralis.Streams.getAll({ limit: 100 });
		const selfUrl = this.configService.get<string>("SELF_URL");

		result
			.map((item) => ({ id: item.id, url: new URL(item.webhookUrl) }))
			.forEach(async (item) => {
				const url = new URL(selfUrl + item.url.pathname);
				await this.updateStream(item.id, {
					webhookUrl: url.toString(),
				});
			});

		config.forEach(async (item) => {
			if (result.map((res) => res.tag).includes(item.tag)) {
				this.moralisLogger.log(`Resuing Stream tag: ${item.tag}`);
				return;
			}

			try {
				const id = await this.createStream(
					{
						tag: item.tag,
						webhookUrl: selfUrl.concat(item.webhookRoute),
						description: item.description,
						abi: item.abi,
						topic0: item.topic0,
						chains: item.chainIds,
						includeContractLogs: item.includeContractLogs,
						includeNativeTxs: item.includeNativeTxs,
					},
					item.contracts,
				);

				this.moralisLogger.log(`New stream: ${id} | ${item.tag} | ${item.webhookRoute}`);
			} catch (error) {
				this.moralisLogger.error("Error creating new Stream");
			}
		});
	}

	async createStream(streamData: StreamOptions, contracts: string[]): Promise<string> {
		const newStream = await Moralis.Streams.add({
			...streamData,
		});
		const { id } = newStream.toJSON();
		await this.addStreamAddress(contracts, id);
		return id;
	}

	async addStreamAddress(address: string[], id: string) {
		await Moralis.Streams.addAddress({ address, id });
	}

	async removeStreamAddress(address: string[], id: string) {
		await Moralis.Streams.deleteAddress({ address, id });
	}

	updateStreamStatus(id: string, status: StreamStatus) {
		return Moralis.Streams.updateStatus({ id, status });
	}

	async updateStream(id: string, streamData: Partial<StreamOptions>) {
		await Moralis.Streams.update({
			id,
			...streamData,
		});
	}
}
