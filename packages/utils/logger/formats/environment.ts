import { format } from "winston";

import { Environments } from "@conduit/types";

export const environment = format((info) => {
	info.environment = process.env.NODE_ENV || Environments.Development;
	return info;
});
