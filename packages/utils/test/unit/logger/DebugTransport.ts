import { last } from "lodash";
import Transport from "winston-transport";

export class DebugTransport extends Transport {
	logs: any[] = [];

	log(info: any, callback: () => void): any {
		this.logs.push(info);
		callback();
	}

	getLatestLog() {
		return last(this.logs);
	}
}
