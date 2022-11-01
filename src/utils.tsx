/*Formats provided strings into capitalized forms, can capitalize either first word or every word*/
export const capitalize = (string: string, words: 'all' | 'first' = 'all') => {
	let w;
	if (words == 'all') w = string.split(' ');
	else w = ([] as string[]).concat(string);
	let r = [] as string[];
	w.forEach(x => {
		r.push(x[0].toUpperCase() + x.slice(1));
	});
	return r.join(' ');
};