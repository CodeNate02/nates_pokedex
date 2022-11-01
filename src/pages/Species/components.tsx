import { useState, useMemo } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { capitalize } from '../../utils';

/* Form Tabs Formats/Creates tabs on top of Pokémon entry to navigate through various forms*/
const FormTabs = ({
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
							className={`rounded-t-xl bg-stone-100 px-2 border-black border-t-2 border-b border-x-2 relative hover:cursor-pointer ${
								sel == index ? '-bottom-[2px] shadow-lg' : ''
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
const PkmnImage = ({ sprites }: { sprites: { [type: string]: string } }) => {
	const [shiny, setShiny] = useState(false);
	return (
		<div className="relative top-0 z-0 h-32 m-auto w-36">
			<HiSparkles
				className={`absolute right-1 select-none hover:cursor-pointer ${
					shiny
						? 'text-blue-500 '
						: 'text-black/10' /*Shiny button intentionally somewhat hard to see, similarly to shiny Pokemon in game being hard to find*/
				}`}
				onClick={() => setShiny(!shiny)}
			/>

			<img
				src={
					(shiny ? sprites.front_shiny : sprites.front_default) ||
					'/decamark.png'
				}
				className="m-auto mb-12 h-36 w-36"
				alt="Image not Found"
			/>
		</div>
	);
};

const Stats = ({ pkmnStats }: any) => {
	return <div className="border border-red-700 w-36 h-36"></div>;
};

const FlavorText = ({ pkmn }: { pkmn: any }) => {
	const [text, setText] = useState(0);
	const FlavorTexts = useMemo(
		() =>
			pkmn.flavor_text_entries.filter(
				(x: any) => x.language.name == 'en'
			),
		[pkmn]
	);
	return (
		<section
			id="FlavorText"
			className="grid grid-cols-[3em_30em_3em] bg-white rounded-2xl w-fit m-auto mt-2 h-36"
		>
			<button
				onClick={() => {
					if (text > 0) setText(text - 1);
				}}
				className="p-1 bg-red-400 border border-black rounded-l-2xl hover:underline"
			>
				{'<'}
			</button>
			<section className="flex flex-col justify-center px-5 border-black border-y">
				<p>{FlavorTexts[text].flavor_text}</p>
				<p className="w-full text-right">
					-Pokémon{' '}
					{capitalize(
						FlavorTexts[text].version.name.split('-').join(' ')
					)}
				</p>
			</section>
			<button
				onClick={() => {
					if (text < FlavorTexts.length - 1) setText(text + 1);
				}}
				className="p-1 bg-gray-200 border border-black rounded-r-2xl hover:underline"
			>
				{'>'}
			</button>
		</section>
	);
};

export default { FormTabs, PkmnImage, Stats, FlavorText };
