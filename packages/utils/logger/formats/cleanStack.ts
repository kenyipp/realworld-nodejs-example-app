import cleanStackFn, { type Options } from "clean-stack";
import { isNil } from "lodash";
import { format } from "winston";

export const cleanStack = format((info, options: Options = {}) => {
	if (info.message instanceof Error && !isNil(info.message.stack)) {
		info.message.stack = cleanStackFn(info.message.stack, options);
	}
	return info;
});
