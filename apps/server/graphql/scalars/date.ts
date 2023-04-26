import { GraphQLScalarType, Kind } from "graphql";

export const GraphQLDate = new GraphQLScalarType({
	name: "Date",
	description: "A date string in ISO 8601 format",
	serialize(value: any) {
		if (value instanceof Date) {
			return value.toISOString();
		}
		return value;
	},
	parseValue(value: any) {
		return new Date(value).getTime();
	},
	parseLiteral(ast: any) {
		if (ast.kind === Kind.INT) {
			return new Date(parseInt(ast.value, 10)).getTime();
		}
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value).getTime();
		}
		return null;
	}
});
