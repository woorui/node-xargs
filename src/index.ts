import xargs from './xargs';
import fs from 'fs';

interface Iflag {
	P?: number;
	n?: number;
	bin: string;
}

function parseProcessArgv(): Iflag {
	const argvs = process.argv.slice(2);

	let i = 0;
	const obj = {};
	while (i < argvs.length) {
		if (argvs[i].includes('-')) {
			if (i + 1 >= argvs.length) {
				throw new Error('Error: flag must pair of key-value');
			}
			const [key, value] = [argvs[i].split('-')[1], argvs[i + 1]];
			obj[key] = Number.isInteger(Number(value)) ? Number(value) : value;
			i += 2;
		} else {
			obj['bin'] = argvs[i];
			i++;
		}
	}

	// Wash the flags object
	const flags = Object.keys(obj).reduce((acc, key) => {
		if (['P', 'n', 'bin'].includes(key)) {
			acc[key] = obj[key];
		}
		return acc;
	}, {} as Iflag);

	return flags;
}
async function main() {
	const { P: maxProcs = 0, n: maxArgs = 0, bin } = parseProcessArgv();

	console.log(maxProcs, maxArgs, bin);
}

main();