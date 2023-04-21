import { filter, fromPairs, isNil, map } from "lodash";

export const indexToDoc = <T extends object>(
	docs: T[],
	key: keyof T
): { [key: string]: T } => {
	const dictionary = fromPairs(
		filter(
			map(docs, (doc) => [doc[key], doc]),
			(doc) => !isNil(doc[0])
		)
	);
	return dictionary;
};
