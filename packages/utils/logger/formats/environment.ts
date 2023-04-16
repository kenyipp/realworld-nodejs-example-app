import { format } from "winston";
import { Environments } from "@conduit/types";

export const environment = format((info) => {
	info.environment = Environments[process.env.NODE_ENV?.toUpperCase() || Environments.Development];
	return info;
});
