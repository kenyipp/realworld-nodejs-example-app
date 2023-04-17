import cleanStackFn, { type Options } from "clean-stack";
import { format } from "winston";

export const cleanStack = format((info, options: Options = {}) => {
	if (info instanceof Error && info.stack) {
		info.stack = cleanStackFn(info.stack, options);
	}
	return info;
});
