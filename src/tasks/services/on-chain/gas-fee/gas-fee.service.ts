/* eslint-disable no-await-in-loop */
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GasFeeService {
	private readonly provider: JsonRpcProvider;

	private readonly INFURA_API: string;

	constructor(private readonly config: ConfigService) {
		this.INFURA_API = this.config.get<string>("INFURA_API");
		this.provider = new JsonRpcProvider(this.INFURA_API);
	}

	async getTotalGasFeesSpent(walletId: string, minBal: number): Promise<boolean> {
		let totalGasFeesSpent = 0;
		const filter = {
			address: walletId,
			fromBlock: 0,
			toBlock: "latest",
		};
		const transactions = await this.provider.getLogs(filter);
		// eslint-disable-next-line no-restricted-syntax
		for (const transaction of transactions) {
			const txDetails = await this.provider.getTransaction(transaction.transactionHash);
			const txReceipt = await this.provider.getTransactionReceipt(
				transaction.transactionHash,
			);

			const gasFeesSpent = txDetails.gasPrice.mul(txReceipt.gasUsed);
			totalGasFeesSpent += gasFeesSpent.toNumber();
		}

		return Promise.resolve(totalGasFeesSpent >= minBal);
	}

	async getTotalNumberOfTransactions(walletId: string): Promise<number> {
		const count = await this.provider.getTransactionCount(walletId);
		return count;
	}

	async walletBalanceCheck(walletId: string, minBalance: BigNumber): Promise<any> {
		const balance = await this.provider.getBalance(walletId);
		if (balance > minBalance) return Promise.resolve(true);
		return Promise.resolve(false);
	}
}
