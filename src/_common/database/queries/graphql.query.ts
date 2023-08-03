import { HttpService } from "@nestjs/axios";
import { BadRequestException } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { AxiosResponse } from "axios";

export default class GraphQLQueryService {
	loggerService: Logger;

	constructor(private readonly httpService: HttpService) {
		this.loggerService = new Logger();
	}

	async getENSdata(provider: string, walletId: string) {
		try {
			const response = await this.httpService
				.post(
					provider,
					JSON.stringify({
						query: `query {
            addrs(where:{address:"${walletId}"}) {
              ens
            }
          }
        `,
					}),
					{
						headers: {
							"Content-Type": "application/json",
							"Accept-Encoding": "gzip, deflate, br",
							Accept: "application/json",
							Connection: "keep-alive",
							DNT: "1",
						},
					},
				)
				.toPromise()
				.then((response: AxiosResponse) => response.data);

			return response;
		} catch (error) {
			this.loggerService.error("Error in graphql service");
			throw new BadRequestException({
				message: "Error in graphql service",
				code: 500,
			});
		}
	}

	async getNFTdata(provider: string, walletId: string) {
		try {
			const response = await this.httpService
				.post(
					provider,
					JSON.stringify({
						query: `query {
          addrs(where:{address:"${walletId}"}) {
            address
            holdNfts {
              contract
              symbol
            }
          }
        }
      `,
					}),
					{
						headers: {
							"Content-Type": "application/json",
							"Accept-Encoding": "gzip, deflate, br",
							Accept: "application/json",
							Connection: "keep-alive",
							DNT: "1",
						},
					},
				)
				.toPromise()
				.then((response: AxiosResponse) => response.data);

			return response;
		} catch (error) {
			this.loggerService.error("Graphql service Error !");
			throw new BadRequestException({
				message: "Error in graphql service",
				code: 500,
			});
		}
	}

	async execute(provider: string, _query: any, headers: object) {
		try {
			const result = await this.httpService
				.post(
					provider,
					JSON.stringify({
						query: _query,
					}),
					headers,
				)
				.toPromise()
				.then((respons) => respons.data);

			return result;
		} catch (error) {
			this.loggerService.error(error);
			throw new BadRequestException(error);
		}
	}
}
