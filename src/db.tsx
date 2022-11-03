/*
	Get From DB
	Checks if localstorage contains the information, otherwise gets the information fron the server, stores it, and presents it
*/
export const getFromDB = async (link: string) => {
	let local;
	try {
		local = localStorage.getItem(link.slice(26));
	} catch {
		local = undefined;
	}

	if (local) return JSON.parse(local);
	else {
		let data: any = await fetch(link).then(async x => {
			if (x.ok) return await x.json();
		});
		try {
			localStorage.setItem(link.slice(26), JSON.stringify(data));
		} catch {}

		return data;
	}
};

const searchDB = async (searchType: string, term: string) => {
	let result = await getFromDB(
		`https://pokeapi.co/api/v2/${searchType}/${term.toLowerCase()}`
	);
	return result;
};

const getPkmnVariants = async (v: any[]) => {
	if (v[0].pokemon.name == 'pikachu') return await getPikachuVariants(v);
	let rv = [] as any;
	v.forEach((vari: any) => rv.push(getFromDB(vari.pokemon.url)));
	return await Promise.all(rv);
};
const getPkmnForms = async (v: any[]) => {
	if (v[0] == 'CAPS_PIKACHU' || v[0] == 'COSPLAY_PIKACHU') return v.slice(1); //Hard-coded Pikachu code variation
	let rv = [] as any;
	v.map(form => rv.push(getFromDB(form.url)));
	return Promise.all(rv);
};

export const getSpeciesInfo = async (id: string) => {
	let species = await getFromDB(
		`https://pokeapi.co/api/v2/pokemon-species/${id}`
	);
	let variants = await getPkmnVariants(species.varieties);
	let formPromises = [] as any;
	variants.forEach((item: any) =>
		formPromises.push(getPkmnForms(item.forms))
	);
	let forms = await Promise.all(formPromises);
	return { species, variants, forms };
};

/* SET COSPLAY PIKACHU FORMS -
		The Database hates me and treaats every single Cosplay and Hat pikachu as a separate variant,
		but in truth they are essentially the same Pokemon.
		(In the case of Cosplay Pikachu, there is a single minor variance in which signature move
			they learn when they are in that form, but I can eitehr ignore that or account for it later.)

		Instead, I coded getPikachuVariants to create 2 artificial variants that contain the information for the different forms.
		getPkmnForms needed to be altered to account for the hard-code, but it shouldn't be too costly.

		The different cosplay/cap forms ARE listed as forms on the forms endpoint, but the databse doesn't accurately reflect this.
		An alternate method, depending on performance, would be to hard-code the names and endpoints in and re-getFromDB the information, but since
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
		let data = await getFromDB(pikas[i].pokemon.url);
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
							form_name:
								data.name == 'pikachu-phd'
									? 'phD'
									: data.name.slice(8),
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

const getChainInfo = async (chainUrl: string) => {
	const chain = await getFromDB(chainUrl);
	console.log(chain);
	return chain;
};
getChainInfo('https://pokeapi.co/api/v2/evolution-chain/140');
getChainInfo('https://pokeapi.co/api/v2/evolution-chain/72');
getChainInfo('https://pokeapi.co/api/v2/evolution-chain/22');
type EvChain = {
	baby_trigger_item: null | { name: string; url: string };
	chain: EvoChainLink;
};
type EvoChainLink = {
	evolution_datails: any;
	evolves_to: EvoChainLink[];
	is_baby: boolean;
	species: { name: string; url: string };
};
