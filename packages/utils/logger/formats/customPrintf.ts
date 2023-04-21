import colors from "@colors/colors/safe";
import path from "path";
import { format } from "winston";

const { printf } = format;
const pwd = path.resolve(process.env.PWD || process.cwd());

const DefaultCustomPrintfOptions = {
	hideErrorStack: false
};

export const customPrintf = (
	options: CustomPrintfOptions = DefaultCustomPrintfOptions
) =>
	printf((info) => {
		const timestamp = colors.cyan(colors.italic(`- ${info.timestamp}`));

		let message = `${info.level} ${info.message} ${timestamp}`;

		if (info.stack && !options.hideErrorStack) {
			const colorfiedStack = info.stack
				.split("\n")
				.slice(1)
				.map((line: string, index: number) => {
					if (
						index === 0 ||
						(!line.includes("node_modules") && line.includes(pwd))
					) {
						return line;
					}
					return colors.grey(line);
				})
				.join("\n");

			message += `\n${colorfiedStack}`;
		}

		// if (info.payload) {
		// 	message += "\n";
		// 	message += "-".repeat(50);
		// 	message += "\nPayload\n";
		// 	message += "-".repeat(50);
		// 	message += "\n";
		// 	message += stringify(info.payload, null, 4);
		// 	message += "\n";
		// 	message += "-".repeat(50);
		// }

		return message;
	});

type CustomPrintfOptions = {
	hideErrorStack: boolean;
};
