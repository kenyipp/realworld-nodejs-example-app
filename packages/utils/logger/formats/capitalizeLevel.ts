import { startCase } from "lodash";
import { format } from "winston";

export const capitalizeLevel = format((info) => {
	if (info.level) {
		info.level = startCase(info.level);
	}
	return info;
});
