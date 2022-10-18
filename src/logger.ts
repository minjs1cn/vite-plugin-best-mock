import colors from 'colors';
import { toBigHump } from './utils';

let id = 0;
export class Logger {
	public static create(openLog: boolean) {
		return new Logger(openLog);
	}
	constructor(public logger: boolean = true) {}

	private id = ++id;

	private logs: {
		[index: string]: string;
	} = {};

	public addLog(key: string, value: any) {
		if (value) {
			this.logs[toBigHump(key)] =
				typeof value === 'string' ? value : JSON.stringify(value);
		}
	}

	/**
	 * 请求日志
	 */
	public reqLog() {
		const { logs, logger } = this;
		if (!logger) return;
		console.log([colors.bgGreen('\n' + `BestMock Req [${this.id}]`)].join(''));
		Object.keys(logs).forEach((key) => {
			console.log(`  ${key}: ${logs[key]}`);
		});
	}

	/**
	 * 响应日志
	 */
	public resLog() {
		const { logs, logger } = this;
		if (!logger) return;
		console.log([colors.bgGreen('\n' + `BestMock Res [${this.id}]`)].join(''));
		Object.keys(logs).forEach((key) => {
			console.log(`  ${key}: ${logs[key]}`);
		});
	}
}
