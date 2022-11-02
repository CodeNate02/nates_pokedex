const searchDB = async (searchType: string, term: string) => {
	let result = await fetch(
		`https://pokeapi.co/api/v2/${searchType}/${term.toLowerCase()}`
	);
	if (result.ok) {
		return await result.json();
	}
};

export const getPkmnVariants = async (v: any[]) => {
	if (v[0].pokemon.name == 'pikachu') return await getPikachuVariants(v);
	let rv = [] as any;
	for (let i = 0; i < v.length; i++) {
		let response = await fetch(v[i].pokemon.url);
		let data = await response.json();
		rv.push({ ...data });
	}
	return rv;
};
export const getPkmnForms = async (v: any[]) => {
	if (v[0] == 'CAPS_PIKACHU' || v[0] == 'COSPLAY_PIKACHU') {
		return v.slice(1);
	}
	let rv = [] as any;
	for (let i = 0; i < v.length; i++) {
		let response = await fetch(v[i].url);
		let data = await response.json();
		rv.push({ ...data });
	}
	return rv;
};
// const COSPLAY_PIKACHU = {
// 	forms:[
// 		name:
// 	]
// }

/* SET COSPLAY PIKACHU FORMS -
		The Database hates me and treaats every single Cosplay and Hat pikachu as a separate variant,
		but in truth they are essentially the same Pokemon.
		(In the case of Cosplay Pikachu, there is a single minor variance in which signature move
			they learn when they are in that form, but I can eitehr ignore that or account for it later.)

		Instead, I coded getPikachuVariants to create 2 artificial variants that contain the information for the different forms.
		getPkmnForms needed to be altered to account for the hard-code, but it shouldn't be too costly.

		The different cosplay/cap forms ARE listed as forms on the forms endpoint, but the databse doesn't accurately reflect this.
		An alternate method, depending on performance, would be to hard-code the names and endpoints in and re-fetch the information, but since
		all the information I needed was already a part of the original query, I decided to reorganize that info and not query redundant information.
		*/
const COSPLAYS = [
	'pikachu-rock-star',
	'pikachu-belle',
	'pikachu-pop-star',
	'pikachu-phd',
	'pikachu-libre',
	'pikachu-cosplay',
];
const CAPS = [
	'pikachu-original-cap',
	'pikachu-hoenn-cap',
	'pikachu-sinnoh-cap',
	'pikachu-unova-cap',
	'pikachu-kalos-cap',
	'pikachu-alola-cap',
	'pikachu-partner-cap',
	'pikachu-world-cap',
];
const getPikachuVariants = async (pikas: any[]) => {
	let rv = [] as any,
		caps = { forms: [] } as any,
		cosplays = { forms: [] } as any;
	for (let i = 0; i < pikas.length; i++) {
		let response = await fetch(pikas[i].pokemon.url);
		let data = await response.json();

		if (COSPLAYS.includes(pikas[i].pokemon.name)) {
			if (pikas[i].pokemon.name == 'pikachu-cosplay') {
				cosplays = {
					...data,
					forms: ['COSPLAY_PIKACHU', ...cosplays.forms],
				};
			} else {
				cosplays = {
					...cosplays,
					forms: [
						...cosplays.forms,
						{
							form_name: (data.name=='pikachu-phd' ? 'phD' : data.name.slice(8)),
							types: data.types,
							sprites: data.sprites,
						},
					],
				};
			}
		} else if (CAPS.includes(pikas[i].pokemon.name)) {
			if (pikas[i].pokemon.name == 'pikachu-original-cap') {
				caps = {
					...data,
					name: 'pikachu-in-a-cap',
					forms: ['CAPS_PIKACHU', ...caps.forms],
				};
			}
			caps = {
				...caps,
				forms: [
					...caps.forms,
					{
						form_name: data.name.slice(8, -4),
						types: data.types,
						//The sprites section is just in place because the official artwork poses are cute and I wanted them to be the default.
						sprites: {
							...data.sprites,
							other: {
								...data.sprites.other,
								home: {
									...data.sprites.home,
									front_default:
										data.sprites.other?.['official-artwork']
											.front_default,
								},
							},
						},
					},
				],
			};
		} else rv.push({ ...data });
	}
	return rv.concat([caps, cosplays]);
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
