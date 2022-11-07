import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowButton } from '../../../components/ArrowButton';
import TypeIcons from '../../../components/TypeIcons';
import { capitalize } from '../../../utils';
import MoveSet from './MoveSet'

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
