import { Iflag } from './types';

export default (): Iflag => {
	const argvs = process.argv.slice(2);

	let i = 0;
	const obj = {};
	while (i < argvs.length) {
		if (argvs[i].includes('-')) {
			if (i + 1 >= argvs.length) {
				throw new Error('Error: flag must pair of key-value!');
			}
			const [key, value] = [argvs[i].split('-')[1], argvs[i + 1]];
			if (!Number.isInteger(Number(value))) {
				throw new Error('Error: flag value must be a number!');
			}
			obj[key] = Number(value);
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
};
