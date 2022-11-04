import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowButton } from '../../components/ArrowButton';
import TypeIcons from '../../components/TypeIcons';
import { getFromDB, Spinner } from '../../db';
import { capitalize } from '../../utils';

/* Form Tabs Formats/Creates tabs on top of Pokémon entry to navigate through various forms*/
const VariantTabs = ({
	forms,
	setSel,
	sel,
}: {
	forms: any[];
	sel: number;
	setSel: any;
}) => {
	//Format all names for tab purposes.  Remove the (name)- portion from form names and capitalize first letter
	const getNames = () => {
			let r = [];
			let species = forms[0].species.name;
			for (let i = 0; i < forms.length; i++) {
				let n = forms[i].name;
				if (forms[i].name != species) {
					//Check if the form-name varies from the species-name
					n = n.slice(species.length + 1); //The DB's format begins form names with their default forms.  This is unnecessary and clutter-generating, so we can slice that part off
				}
				n = n[0].toUpperCase() + n.slice(1); //Capitalize the first letter
				n = capitalize(n.split('-').join(' '));
				r.push(n); //Add the name to the array
			}
			return r;
		},
		formattedNames = useMemo(() => getNames(), [forms]); //Memoize names to only change if the forms provided change (IE on page change)
	return (
		<>
			{forms.length > 1 && ( //If this Pokémon has forms
				<ul className="relative flex left-2 w-fit">
					{forms.map((_item, index) => (
						<li
							key={index}
							className={`rounded-t-xl  px-2 border-black border-t-2 border-b border-x-2 relative hover:cursor-pointer ${
								sel == index
									? '-bottom-[2px] shadow-lg bg-sky-200 even:bg-sky-100'
									: 'bg-stone-100 even:bg-stone-300'
							}`}
							onClick={() => setSel(index)}
							style={{
								right: `${0.5 * index}em`,
								zIndex: sel == index ? 25 : 25 - index,
							}}
						>
							{formattedNames[index]}
						</li>
					))}
				</ul>
			)}
		</>
	);
};
const PkmnImage = ({
	sprites,
	typing,
	className,
	shiny,
}: {
	sprites: any;
	className: string;
	typing: any;
	shiny: boolean;
}) => {
	/*Utilize the most optimal sprite resource available for each form.
	-If the Pokemon has a home sprite available, use that.
	-If it doesn't, try the default sprites.  (Some forms, Pikachu speficially)
	*/
	var sprite =
			sprites?.other?.home?.front_default || //Use Home artwork by default
			sprites.front_default || // Check if there's a default fornt sprite (Some older forms, Pikachu/Pichu)
			sprites?.other?.['official-artwork'].front_default || //See if the sprite has official artwork (Hisui Forms)
			'/decamark.png' /*Otherwise, display a Decamark */,
		femaleSprite =
			sprites?.other?.home?.front_female || sprites.front_female || null, //Female Sprites should only be shown for those with a female sprite in the DB (Meaning this pokemon has a gender difference)
		shinySprite =
			sprites?.other?.home?.front_shiny ||
			sprites.front_shiny ||
			'/missingno.png', //Ĭ̴̫̬̺̫̻̤̣͝f̴̫͇͕̿̂̉̀̒͜ ̷̳̅̀̉̚t̴̳̮̬̖̤̥̾͑̊̍̔h̴̨̤͎̹̜̘̘͐͛͋̆̿e̸̬̹̪̐r̵̮̱̠̯̅̈́̉̋͜ȩ̴͚̤͎͝ ̴̛̙͖̘̋̉̏͝i̵̱͔͕̟͂̀̉̇̑̉͜s̴̢̝̗̬͊̕ ̴̢̧̟͖̩͚̋̎̅̾̒̅͝ͅņ̷̜̦͓̦͚̓̎o̵͓̐ ̵̡̹͈͗̿̀̉̒̀̕š̸̨̤͊͋́̓̔h̴̡̠̾͐̌̾͆i̶͚͔̱̯͈̇̅̏̽́ň̷͖̒̓̂̍͐̚y̴̹̒̆̓ ̴̡̣̬̂̚f̶̺̬̞͓̫̳̫͋̉̃͆̏o̷̦͒͆̊r̶͓̝̠̻̩̗̈́͌m̴̻̤̀̿̊̑̓̌,̷̨̩̘̀̈́̾̿͝͠ ̷̡̩͍̱́̂͜ṯ̷̀̀̀͌ḧ̴̨̬̫̫̠̥͗͜r̵͚̳̜̄̈́o̸͉͇͍͘͜w̸̛̙̾ ̵̟̘̜̩̕Ṁ̸̢̘̘̘̟̳̈́̀̋i̶̧͖̯̩͙͉͆͐s̶̨̛̩̰̲̀̌̂̇͘͜͝ş̶̠̭͍̮͋̿͆͠į̷̲͖͕̖͂̒ͅn̷̠͗͋͆̊̔͘g̴̖͇̼̅̃̈̕͘͜͝͠n̸͖͖̤͍͛͠͝ǫ̴̻̗͈͂͛̊̆̀͠
		femaleShinySprite =
			sprites?.other?.home?.front_shiny_female ||
			sprites.front_shiny_female ||
			null;

	return (
		<>
			<section className="flex" id="sprites">
				<div
					className={`relative top-0 m-auto ${className}`}
					id="baseSprite"
				>
					<img
						src={(shiny ? shinySprite : sprite) || '/decamark.png'}
						className={`m-auto mb-12 ${className}`}
						alt="Pokemon Sprite"
					/>
				</div>
				{femaleSprite && (
					<div
						className={`relative top-0 m-auto ${className}`}
						id="femaleSprite"
					>
						<img
							src={
								(shiny ? femaleShinySprite : femaleSprite) ||
								'/decamark.png'
							}
							className={`m-auto mb-12 ${className}`}
							alt="Pokemon Sprite"
						/>
					</div>
				)}
			</section>
			<TypeIcons typing={typing} />
		</>
	);
};
const PkmnForms = ({ formsArray, shiny }: any) => {
	var content = (
		<>
			{formsArray.map((form: any, index: number) => (
				<div key={index}>
					<h3 className="text-center">
						{' '}
						{capitalize(form.form_name || 'base')}{' '}
					</h3>
					<PkmnImage
						className="w-20 h-20"
						typing={form.types}
						sprites={form.sprites}
						shiny={shiny}
					/>
				</div>
			))}
		</>
	);

	return (
		<div className="relative flex flex-wrap justify-around p-1 mx-auto mt-1 border border-black w-fit gap-x-2 rounded-3xl bg-stone-100">
			<h4 className="top-0 w-full space-x-0 font-bold leading-none text-center underline bold">
				{' '}
				Alternate Forms{' '}
			</h4>
			{content}
		</div>
	);
};

const Stats = ({ pkmnStats }: any) => {
	return (
		<div className="border-black bg-stone-50 rounded-xl border-2 grid grid-cols-[5em_1fr] grid-rows-6 min-w-[15em] p-1 mx-8 md:absolute left-[100%] top-1 h-full gap-y-4 [grid-auto-flow:column]">
			{pkmnStats.map((item: any, index: number) => (
				<p
					className="col-span-1 m-auto text-xs text-center align-middle font-screen"
					key={index}
				>
					{' '}
					{capitalize(item.stat.name.replace('-', ' '))}{' '}
				</p>
			))}
			{pkmnStats.map((item: any, index: number) => (
				<div
					key={index}
					className="w-full m-auto border-r border-black/10 border-y h-fit bg-black/20"
				>
					<p
						className="text-xs text-center font-screen"
						style={{
							width: item.base_stat / 2.55 + '%',
							backgroundColor: 'red',
						}}
					>
						{' '}
						{item.base_stat}{' '}
					</p>
				</div>
			))}
		</div>
	);
};

const FlavorText = ({ pkmn }: any) => {
	const flavorText = useRef<HTMLElement>(null);
	const [text, setText] = useState(0);
	useEffect(() => {
		setText(0);
	}, [pkmn]);
	const FlavorTexts = useMemo(() => {
		setText(0);
		return pkmn.flavor_text_entries.filter(
			(x: any) => x.language.name == 'en'
		);
	}, [pkmn]);

	const transitionText = (n: number) => {
		let newText = text + n;
		if (newText < 0)
			newText = FlavorTexts.length - 1; //Loop around dex entry
		else if (newText >= FlavorTexts.length) newText = 0;
		if (newText != text) {
			//testing testing 123
			flavorText.current && (flavorText.current.style.opacity = '0');
			setTimeout(() => {
				setText(newText);
				flavorText.current && (flavorText.current.style.opacity = '1');
			}, 100);
		}
	};

	return (
		<section
			id="FlavorText"
			className="flex items-center justify-center w-full mb-5 border-b border-dashed h-36 border-black/25"
		>
			<ArrowButton
				onClick={() => transitionText(-1)}
				className="w-5 h-5"
			/>
			<section
				ref={flavorText}
				className="max-w-lg px-5 transition-opacity"
			>
				<p>{FlavorTexts[text]?.flavor_text || 'error'}</p>
				<p className="w-full italic text-right">
					-Pokémon{' '}
					{FlavorTexts[text]?.version?.name &&
						capitalize(
							FlavorTexts[text].version.name.split('-').join(' ')
						)}
				</p>
			</section>
			<ArrowButton
				onClick={() => transitionText(1)}
				className="w-5 h-5 rotate-180"
			/>
		</section>
	);
};
/* Dex Numbers lists a bold heading of the Pkmn's canonical National Dex number, and a list of  */
const DexNumbers = ({ entries }: any) => {
	const e = useMemo(() => {
		let r: { national: any; dex: any } = {
			national: undefined,
			dex: [] as any[],
		};
		entries.forEach((e: any) => {
			if (e.pokedex.name == 'national') r.national = e;
			else r.dex.push(e);
		});
		return r;
	}, [entries]);
	return (
		<div className="absolute right-[115%] top-0 h-full flex">
			<div className="flex flex-col max-h-full p-3 my-auto overflow-x-visible bg-white border-2 border-black rounded-2xl">
				<h3 className="mr-2 text-xl text-right underline font-screen">
					{' '}
					{`#${e?.national?.entry_number || '???'}`}{' '}
				</h3>
				<ul className="h-full p-1 overflow-x-hidden overflow-y-auto text-xs text-center border rounded-md shadow-sm whitespace-nowrap">
					{e.dex.map((item: any, index: number) => (
						<li key={index}>
							{`${capitalize(
								item.pokedex.name.split('-').join(' ')
							)} #${item.entry_number} `}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const Abilities = ({ abilities }: any) => {
	return (
		<div className="mx-2 border border-black h-fit">
			{' '}
			<h4 className="text-xl font-medium text-center"> Abilities </h4>
			<ul className="text-lg text-center">
				{abilities.map((item: any, index: any) => (
					<li
						key={index}
						className="border-t border-black min-h-[4rem] w-28 flex flex-col justify-center"
					>
						{capitalize(item.ability.name.split('-').join(' '))}
						{item.is_hidden ? (
							<span className="block text-xs font-extralight">
								Hidden
							</span>
						) : undefined}
					</li>
				))}
			</ul>
		</div>
	);
};
const MoveSet = ({ moves }: any) => {
	const [formatted, setFormatted] = useState<'loading' | any>('loading');
	const [selected, setSelected] = useState<string>('sword-shield');
	const vMoves = () => {
		return formatted[selected] || [];
	};
	useEffect(() => {
		setFormatted('loading');
		organizeVersionGroups(moves).then(x => {
			console.log(x);
			if (!formatted[selected]) {
				setSelected(Object.keys(x)[0]);
			}
			setFormatted(x);
		});
	}, [moves]);
	return (
		<div className="h-full mx-20 overflow-y-auto border border-black grow">
			<h4 className="text-xl font-medium text-center"> Learnset </h4>
			{(formatted == 'loading' && <Spinner />) || (
				<>
					<div className="flex flex-wrap gap-2 p-2 justify-evenly">
						{Object.keys(formatted).map((item, index) => (
							<VersionButton
								key={index}
								version={item}
								onClick={() => setSelected(item)}
								className={
									selected == item
										? 'drop-shadow-xl scale-125 '
										: ''
								}
							></VersionButton>
						))}
					</div>
					<div className="flex flex-wrap">
						{/*LEARNSET TABLE*/}
						<table className="h-full border-t border-black w-min-1/3 grow">
							<thead className="border-black border-y">
								<tr className="w-full">
									{' '}
									<td className="font-medium text-center">
										{' '}
										Level-Up{' '}
									</td>
								</tr>
								<tr className="grid grid-cols-[2fr_6em_6em_6em_6em]">
									<td>Name</td>
									<td>Learned</td>
									<td>Class</td>
									<td>Power</td>
									<td>Accuracy</td>
								</tr>
							</thead>
							<tbody>
								{vMoves()
									.filter((x:any) => x.method == 'level-up')
									.sort((x:any, y:any) => x.level - y.level)
									.map((item: any, index: number) => (
										<tr
											key={index}
											className="odd:bg-black/10 grid grid-cols-[2fr_6em_6em_6em_6em]"
										>
											<td className="odd:bg-blue-800/10">
												{capitalize(
													item.name
														.split('-')
														.join(' ')
												)}
											</td>
											<td>
												{item.method == 'level-up'
													? `Level ${item.level}`
													: item.method == 'machine'
													? 'TM'
													: item.method == 'tutor'
													? 'Move Tutor'
													: capitalize(item.method)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
						<table className="h-full border-t border-black border-x border-x-black/20 w-min-1/3 grow">
							<thead className="border-black border-y">
								<tr className="w-full">
									{' '}
									<td className="font-medium text-center">
										Machine
									</td>
								</tr>
								<tr className="grid grid-cols-[2fr_6em_6em_6em_6em]">
									<td>Name</td>
									<td>Class</td>
									<td>Power</td>
									<td>Accuracy</td>
								</tr>
							</thead>
							<tbody>
								{vMoves()
									.filter((x:any) => x.method == 'machine')
									.map((item: any, index: number) => (
										<tr
											key={index}
											className="odd:bg-black/10 grid grid-cols-[2fr_6em_6em_6em_6em]"
										>
											<td className="odd:bg-blue-800/10">
												{capitalize(
													item.name
														.split('-')
														.join(' ')
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
						<table className="h-full border-t border-black w-min-1/3 grow">
							<thead className="border-black border-y">
								<tr className="w-full">
									{' '}
									<td className="font-medium text-center">
										{' '}
										Move Tutor{' '}
									</td>
								</tr>
								<tr className="grid grid-cols-[2fr_6em_6em_6em]">
									<td>Name</td>
									<td>Class</td>
									<td>Power</td>
									<td>Accuracy</td>
								</tr>
							</thead>
							<tbody>
								{vMoves()
									.filter((x:any) => x.method == 'tutor')
									.map((item: any, index: number) => (
										<tr
											key={index}
											className="odd:bg-black/10 grid grid-cols-[2fr_6em_6em_6em]"
										>
											<td className="odd:bg-blue-800/10">
												{capitalize(
													item.name
														.split('-')
														.join(' ')
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					{vMoves().length < 1 && (
						<p className="w-full text-center text-red-700 bg-gray-800/20">
							{' '}
							No Moves Found{' '}
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default {
	VariantTabs,
	PkmnImage,
	PkmnForms,
	Stats,
	FlavorText,
	DexNumbers,
	Abilities,
	MoveSet,
};

const organizeVersionGroups = async (moves: any[]) => {
	let organized: any = {};
	for (let i = 0; i < moves.length; i++) {
		let moveName = moves[i].move.name;
		let moveData = await getFromDB(
			`https://pokeapi.co/api/v2/move/${moveName}`
		);
		moves[i].version_group_details.forEach((vg: any) => {
			let info = {
				name: moveName,
				method: vg.move_learn_method.name,
				level: vg.level_learned_at,
				class: moveData.damage_class.name,
				acc: moveData.accuracy,
				power: moveData.power,
			};
			if (organized?.[vg.version_group.name])
				organized[vg.version_group.name].push(info);
			else organized[vg.version_group.name] = [info];
		});
	}
	return organized;
};

const VersionButton = ({ version, className, onClick }: any) => {
	/* Great Big Button Switch.  Style "Version Buttons" depending on the version string.  Default to a simple white button on the end for any not in the switch */
	let buttonInfo: {
		buttonClasses: string;
		label: string;
		textClasses?: string;
	};
	switch (version) {
		case 'red-blue':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)] order-1',
				label: 'RB',
			};
			break;
		case 'yellow':
			buttonInfo = {
				buttonClasses: 'bg-[#FECC34] order-2',
				label: 'Yellow',
			};
			break;
		case 'gold-silver':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#E2B624_50%,#C5D1CF_50%)] order-3',
				label: 'GS',
			};
			break;
		case 'crystal':
			buttonInfo = {
				buttonClasses: 'order-4 bg-[#8798CB]',
				label: 'Crystal',
			};
			break;
		case 'ruby-sapphire':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#A81F02_50%,#215B8C_50%)] order-5',
				label: 'RS',
			};
			break;
		case 'emerald':
			buttonInfo = {
				buttonClasses: 'bg-[#01A956] order-6',
				label: 'Emerald',
			};
			break;
		case 'firered-leafgreen':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#DB3A11_50%,#3DB53D_50%)] order-7',
				label: 'FRLG',
			};
			break;
		case 'colosseum': {
			buttonInfo = {
				buttonClasses: 'order-8 bg-[#EC1B24]',
				label: 'Colosseum',
			};
			break;
		}
		case 'xd':
			buttonInfo = {
				buttonClasses: 'order-9 bg-[#AE464E]',
				label: 'XD',
			};
			break;
		case 'diamond-pearl':
			buttonInfo = {
				buttonClasses:
					'order-10 [background:linear-gradient(90deg,#4CA4B6_50%,#B0758F_50%)]',
				label: 'DP',
			};
			break;
		case 'platinum':
			buttonInfo = {
				buttonClasses: 'order-11 bg-[#76597B]',
				label: 'Platinum',
			};
			break;
		case 'heartgold-soulsilver':
			buttonInfo = {
				buttonClasses:
					'order-12 [background:linear-gradient(90deg,#AD7817_50%,#929292_50%)]',
				label: 'HGSS',
			};
			break;
		case 'black-white':
			buttonInfo = {
				buttonClasses:
					'order-[13] [background:linear-gradient(90deg,black_50%,white_50%)]',
				textClasses: '[mix-blend-mode:exclusion] font-light',
				label: 'B/W',
			};
			break;
		case 'black-2-white-2':
			buttonInfo = {
				buttonClasses:
					'order-[14] [background:linear-gradient(270deg,black_50%,white_50%)]',
				textClasses: '[mix-blend-mode:exclusion] font-light',
				label: 'B2/W2',
			};
			break;
		case 'x-y':
			buttonInfo = {
				buttonClasses:
					'order-[15] [background:linear-gradient(90deg,#0A5E9A_50%,#C92341_50%)]',
				label: 'XY',
			};
			break;
		case 'omega-ruby-alpha-sapphire':
			buttonInfo = {
				buttonClasses:
					'order-[16] [background:linear-gradient(90deg,#E82625_50%,#0063AC_50%)]',
				label: 'ORAS',
			};
			break;
		case 'sun-moon':
			buttonInfo = {
				buttonClasses:
					'order-[17] [background:linear-gradient(90deg,#F9991C_50%,#1993D0_50%)]',
				label: 'SM',
			};
			break;
		case 'ultra-sun-ultra-moon':
			buttonInfo = {
				buttonClasses:
					'order-[18] [background:linear-gradient(90deg,#AE5628_50%,#77458B_50%)]',
				label: 'USUM',
			};
			break;
		case 'lets-go-pikachu-lets-go-eevee':
			buttonInfo = {
				buttonClasses:
					'order-[19] [background:linear-gradient(90deg,#E7B930_50%,#AA7848_50%)]',
				label: 'LGPE',
			};
			break;
		case 'sword-shield':
			buttonInfo = {
				buttonClasses:
					'[background:linear-gradient(90deg,#00A1E9_50%,#E70059_50%)] order-[20]',
				label: 'SwSh',
			};
			break;
		default:
			buttonInfo = {
				buttonClasses: 'order-last',
				textClasses: 'text-black',
				label: capitalize(version.split('-').join(' ')),
			};
			break;
	}
	return (
		<button
			className={
				className +
				' border px-2 rounded-full relative transition-transform ' +
				buttonInfo.buttonClasses
			}
			onClick={onClick}
		>
			<span className={'text-white ' + buttonInfo?.textClasses}>
				{buttonInfo.label}{' '}
			</span>
		</button>
	);
};
