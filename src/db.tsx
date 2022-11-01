const searchDB = async (searchType: string, term: string) => {
	let result = await fetch(
		`https://pokeapi.co/api/v2/${searchType}/${term.toLowerCase()}`
	);
	if (result.ok) {
		return await result.json();
	}
};

export const getPkmnVariants = async (v: any[]) => {
	let rv = [] as any;
	for (let i = 0; i < v.length; i++) {
		let response = await fetch(v[i].pokemon.url);
		let data = await response.json();
		

		rv.push({ ...data});
	}
	return rv;
};
export const getPkmnForms = async (v: any[]) => {
	let rv = [] as any;
	for (let i = 0; i < v.length; i++) {
		let response = await fetch(v[i].url);
		let data = await response.json();
		rv.push({ ...data});
	}
	return rv;
};

export const Spinner = () => {
	return (
		<div className="w-20 h-20 m-auto">
			<img
				src="/Pokeball.svg"
				className="m-auto animate-spin h-fit w-fit"
			/>
		</div>
	);
};
export default searchDB;
