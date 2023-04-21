import { Knex as KnexOriginal } from "knex";

declare module "knex" {
	namespace Knex {
		interface QueryInterface {
			if<TRecord, TResult>(
				condition: string,
				trueValue: any,
				falseValue: any
			): KnexOriginal.QueryBuilder<TRecord, TResult>;
		}
	}
}
