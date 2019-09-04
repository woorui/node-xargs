import Xargs from './xargs';
import { Iflag } from './types';

describe('test xargs', function () {
	it('test', async function () {
		const flags: Iflag = {
			P: 2,
			n: 2,
			bin: 'echo'
		};
		const xargs = new Xargs(flags);
		await xargs.exec();
	});
});
