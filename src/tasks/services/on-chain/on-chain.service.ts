import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import GraphQLQueryService from "../../../_common/database/queries/graphql.query";

@Injectable()
export class OnChainService {
	graphqlQueryService: GraphQLQueryService;

	knn3Provider: string;

	constructor(private readonly httpService: HttpService, private config: ConfigService) {
		this.graphqlQueryService = new GraphQLQueryService(this.httpService);
		this.knn3Provider = config.get<string>("KNN3_GRAPHQL_API");
	}

	async _verifyNFTcount(walletId: string, minCount: number): Promise<boolean> {
		const knn3Result: any = this.graphqlQueryService.getNFTdata(this.knn3Provider, walletId);

		if (
			knn3Result.data &&
			knn3Result.data.addrs[0].holdNfts &&
			knn3Result.data.addrs[0].holdNfts.length > minCount
		) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async verifyENScount(walletId: string, minCount: number) {
		const knn3Result = await this.graphqlQueryService.getENSdata(this.knn3Provider, walletId);

		if (knn3Result.data.addrs && knn3Result.data.addrs.length >= minCount) {
			return Promise.resolve(true);
		}

		return Promise.resolve(false);
	}
}
