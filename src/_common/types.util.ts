export interface PromiseFulfilledResult<T> {
	status: "fulfilled";
	value: T;
}

export interface PromiseRejectedResult<T> {
	status: "rejected";
	value: T;
}

export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult<T>;
