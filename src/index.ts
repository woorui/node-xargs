import Xargs from './xargs';
import parseProcessArgv from './parse_process_args';

async function main() {
	const flags = parseProcessArgv();

	// Use interface, I can mock flag to test my Xargs class.
	const xargs = new Xargs(flags);

	await xargs.exec();
}

main();