import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class OpenseaService {
	constructor(private readonly httpService: HttpService) {}

	async getTestOpensea() {
		return "Opensea Route Is Running";
	}

	async NFTCount(walletId: string) {
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		return data.result.length;
	}

	async ContractNFTCount(contractAddress: string) {
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};

		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}/nft/${contractAddress}?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		return data.result.length;
	}

	async verifyPurchasedNFT(walletId: string, minCount: number) {
		let purchasedCount = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (id.to_address.toUpperCase() === walletId.toUpperCase()) {
				purchasedCount += 1;
			}
		});
		if (purchasedCount >= minCount) {
			return true;
		}
		return false;
	}

	async vaeifySpecifiedNFTPurchases(walletId: string, contractAddress: string, minCount: number) {
		let purchasedCount = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (
				id.to_address.toUpperCase() === walletId.toUpperCase() &&
				id.token_address === contractAddress
			) {
				purchasedCount += 1;
			}
		});
		if (purchasedCount >= minCount) {
			return true;
		}
		return false;
	}

	async verifyPurchasedNFTValue(walletId: string, minValue: number) {
		let purchasedValue = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (id.to_address.toUpperCase() === walletId.toUpperCase()) {
				purchasedValue += id.value;
			}
		});
		if (purchasedValue >= minValue) {
			return true;
		}
		return false;
	}

	async vaeifySpecifiedNFTPurchasesValue(
		walletId: string,
		contractAddress: string,
		minValue: number,
	) {
		let purchasedValue = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (
				id.to_address.toUpperCase() === walletId.toUpperCase() &&
				id.token_address === contractAddress
			) {
				purchasedValue += id.value;
			}
		});
		if (purchasedValue >= minValue) {
			return true;
		}
		return false;
	}

	async verifySoldNFT(walletId: string, minCount: number) {
		let saleCount = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (id.from_address.toUpperCase() === walletId.toUpperCase()) {
				saleCount += 1;
			}
		});
		if (saleCount >= minCount) {
			return true;
		}
		return false;
	}

	async vaeifySpecifiedNFTSold(walletId: string, contractAddress: string, minCount: number) {
		let soldCount = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (
				id.from_address.toUpperCase() === walletId.toUpperCase() &&
				id.token_address === contractAddress
			) {
				soldCount += 1;
			}
		});
		if (soldCount >= minCount) {
			return true;
		}
		return false;
	}

	async verifySoldNFTValue(walletId: string, minValue: number) {
		let soldValue = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (id.from_address.toUpperCase() === walletId.toUpperCase()) {
				soldValue += id.value;
			}
		});
		if (soldValue >= minValue) {
			return true;
		}
		return false;
	}

	async vaeifySpecifiedNFTSoldValue(walletId: string, contractAddress: string, minValue: number) {
		let soldValue = 0;
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			"X-API-Key": process.env.MORALIS_API,
		};
		const { data } = await firstValueFrom(
			this.httpService
				.get(`${process.env.MORALIS_URL}${walletId}/nft/transfers?chain=goerli`, {
					headers,
				})
				.pipe(
					catchError((error: "error") => {
						throw new BadRequestException(error);
					}),
				),
		);
		data.result.forEach((id) => {
			if (
				id.from_address.toUpperCase() === walletId.toUpperCase() &&
				id.token_address === contractAddress
			) {
				soldValue += id.value;
			}
		});
		if (soldValue >= minValue) {
			return true;
		}
		return false;
	}
}
