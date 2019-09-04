import { exec } from 'child_process';
import { Iflag } from './types';

const isDelimited = (str: string) => {
	return str === ' ' || str === '\n' || str === '\t';
};

class Xargs {
	public maxProcs: number;
	public maxArgs: number;
	public bin: string;
	private args: string[];

	constructor(flags: Iflag) {
		this.bin = flags.bin || 'echo';
		this.maxArgs = flags.n || 0;
		this.maxProcs = flags.P || 0;
		this.args = [];

		process.stdin.setEncoding('utf8');
	}

	private cleanArgs() {
		this.args = [];
	}

	private execCommand(command: string): Promise<void> {
		return new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) {
					reject(err);
					return;
				}
				if (stderr) {
					process.stderr.write(stderr);
				} else {
					process.stdout.write(stdout);
				}
				resolve();
			});
		});
	}

	public async exec() {
		if (process.stdin.isTTY) {
			return;
		}

		process.stdin.on('readable', async () => {
			let arg = '';
			let chunk: string;
			while (null !== (chunk = process.stdin.read(1) as string)) {
				if (!isDelimited(chunk)) {
					arg += chunk;
				} else {
					this.args.push(arg);
					arg = '';
					if (this.args.length === this.maxArgs) {
						const command = [this.bin, ...this.args].join(' ');
						this.cleanArgs();
						await this.execCommand(command);
					}
				}
			}
		});

		process.stdin.on('end', async () => {
			// Exec the rest task here
			if (this.args.length !== 0) {
				const command = [this.bin, ...this.args].join(' ');
				await this.execCommand(command);
			}
		});
	}
}

export default Xargs;