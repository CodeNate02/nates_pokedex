import { useState, useMemo, useEffect } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { useQuery } from 'react-query';
import { getPkmnForms, Spinner } from '../../db';
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
const PkmnImage = ({
	sprites,
	typing,
	className,
}: {
	sprites: { [type: string]: string };
	className: string;
	typing: any
}) => {
	const [shiny, setShiny] = useState(false);
	return (
		<>
		<div className={`relative top-0 m-auto ${className}`}>
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
				className={`m-auto mb-12 ${className}`}
				alt="Pokemon Sprite"
			/>
		</div>
		<div className='top-0 flex justify-center w-full'>
		{typing.map((item:any,index:number)=>(
			<div key={index} className={`w-1/2 text-center border rounded-full font-pkmn text-xs ${TYPE_STYLES[item.type.name]} `}>
			{capitalize(item.type.name)}
			</div>
		))}
	</div>
	</>
	);
};
const PkmnForms = ({ formsArray }: any) => {
	var { error, isLoading, data } = useQuery(['FormsGetter'], () =>
		getPkmnForms(formsArray)
	);
	useEffect(() => {
		isLoading = true;
	}, [formsArray]);
	var content;
	if (isLoading) content = <Spinner key={0} />;
	else if (error)
		content = <p className="text-red-600"> Oops! An error occurred! </p>;
	else if (data.length <= 1) return <></>;
	else
		content = (
			<>
				<h4 className="top-0 w-full space-x-0 font-bold leading-none text-center underline bold">
					{' '}
					Alternate Forms{' '}
				</h4>
				{data.map((form: any, index: number) => (
					<div key={index}>
						<PkmnImage
							className="w-20 h-20"
							typing={form.types}
							sprites={form.sprites}
						/>
						<h3 className="text-center">
							{' '}
							{capitalize(form.form_name)}{' '}
						</h3>
					</div>
				))}
			</>
		);

	return (
		<div className="relative flex flex-wrap justify-around p-1 m-auto mt-1 border border-black rounded-3xl bg-stone-100">
			{content}
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

export default { VariantTabs, PkmnImage, PkmnForms, Stats, FlavorText };

const TYPE_STYLES:{[type:string]:string} = {
	normal:'bg-neutral-200 border-neutral-400',
	fire:'border-red-800 bg-red-600',
	water:'border-cyan-800 bg-cyan-600',
	grass:'bg-green-500 border-green-700',
	bug:'bg-lime-300 border-lime-600',
	dark:'bg-gray-600 border-black text-white ',
	dragon:'bg-fuchsia-700 border-fuchsia-900',
	electric:'bg-yellow-300 border-yellow-400',
	fighting:'bg-amber-700 border-amber-900',
	flying:'bg-sky-100 border-sky-400',
	ghost:'bg-purple-400 border-indigo-800',
	ground:'bg-yellow-700 bg-amber-800',
	ice:'bg-cyan-100 border-cyan-400',
	poison:'bg-purple-600 border-violet-700',
	psychic:'border-pink-700 bg-pink-300',
	rock:'bg-orange-900 border-stone-900',
	steel:'bg-stone-200 border-zinc-400',
	unknown:'',
	fairy:'bg-pink-200 border-rose-400'

}