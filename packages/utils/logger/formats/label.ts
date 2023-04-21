import colors from "@colors/colors/safe";
import { format } from "winston";

const labelMiddleware = format(
	(info, options: LabelOptions = DefaultLabelOptions) => {
		const {
			colorify = DefaultLabelOptions.colorify,
			labelColor = DefaultLabelOptions.labelColor
		} = options;

		const { label, message } = info;

		if (label) {
			info.message = `${
				colorify ? colors[labelColor](`[${label}]`) : `[${label}]`
			} ${message}`;
		}

		return info;
	}
);

export interface LabelOptions {
	colorify: boolean;
	labelColor: string;
}

const DefaultLabelOptions = {
	colorify: false,
	labelColor: "yellow"
};

export { labelMiddleware as label };
