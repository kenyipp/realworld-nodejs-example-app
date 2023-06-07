import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";
import moment from "moment";
import Transport, { TransportStreamOptions } from "winston-transport";

import { type AnyFunction, Environments } from "@conduit/types";

const client = new CloudWatchLogs({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
	}
});

const isProduction = process.env.NODE_ENV === Environments.Production;

export class CloudWatchTransport extends Transport {
	logGroup: string;
	enabled: boolean;

	constructor(options: CloudWatchTransportOptions) {
		super(options);
		if (!options.logGroup && isProduction) {
			throw new Error("LogGroup name required for cloudwatch");
		}
		this.logGroup = options.logGroup;
		this.enabled = options.enabled || false;
	}

	override async log(info: any, callback: AnyFunction): Promise<void> {
		if (!this.enabled || !isProduction) {
			callback();
			return;
		}

		const logStreamName = info.label;

		const logStream = await client
			.describeLogStreams({ logGroupName: this.logGroup })
			.then((response) =>
				response.logStreams?.find(
					(stream) => stream.logStreamName === logStreamName
				)
			);

		let nextUploadSequenceToken: string | undefined;

		if (!logStream) {
			await client.createLogStream({
				logGroupName: this.logGroup,
				logStreamName
			});
		} else {
			nextUploadSequenceToken = logStream.uploadSequenceToken;
		}

		await client.putLogEvents({
			logGroupName: this.logGroup,
			logStreamName,
			logEvents: [
				{
					timestamp: moment(info.timestamp).toDate().getTime(),
					message: JSON.stringify(info)
				}
			],
			sequenceToken: nextUploadSequenceToken
		});

		callback();
	}
}

type CloudWatchTransportOptions = TransportStreamOptions & {
	logGroup: string;
	enabled: boolean;
};
