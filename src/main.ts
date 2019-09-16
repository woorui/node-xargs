import { exec } from 'child_process';
import { fromEvent, from } from 'rxjs';
import { map, flatMap, takeUntil, filter, bufferCount } from 'rxjs/operators';

const execCmd = (cmd: string) => new Promise((resolve, reject) => {
	exec(cmd, (err, stdout, stderr) => {
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

// Parse from process.argv.slice(2)
const flags = { bin: 'echo', maxArgs: 2, maxProcs: 2 };

fromEvent(process.stdin, 'data').pipe(
	takeUntil(fromEvent(process.stdin, 'end')),
	flatMap((buf: Buffer) => buf.toString().split(/\s/)),
	map(chunk => chunk.trim()),
	filter(arg => Boolean(arg)),
	bufferCount(flags.maxArgs || 1),
	map(args => [flags.bin || 'echo', ...args].join(' ')),
	bufferCount(flags.maxProcs || 1),
	flatMap(cmds => from(Promise.all(cmds.map(cmd => execCmd(cmd))))),
).subscribe(
	x => {},
	err => console.log(err),
	() => {}
);
