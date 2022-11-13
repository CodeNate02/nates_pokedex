import { useEffect, useState, useRef, useMemo } from 'react';
import { capitalize } from '../utils';
import { ArrowButton } from './ArrowButton';
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
				className="max-w-lg w-full px-5 transition-opacity"
			>
				<p>{FlavorTexts[text]?.flavor_text || 'error'}</p>
				{FlavorTexts[text]?.version?.name && (
					<p className="w-full italic text-right">
						{'-Pokémon '}
						{capitalize(
							FlavorTexts[text].version.name ||
								FlavorTexts[text].version_group.name,
							'all',
							'-',
							' '
						)}
					</p>
				)}
				{FlavorTexts[text]?.version_group?.name && (
					<p className="w-full italic text-right">
						{'-Pokémon '}
						{/*@ts-ignore*/}
						{VERSION_GROUPS?.[
							FlavorTexts[text].version_group.name
						] ||
							capitalize(
								FlavorTexts[text].version_group.name,
								'all',
								'-',
								' & '
							)}
					</p>
				)}
			</section>
			<ArrowButton
				onClick={() => transitionText(1)}
				className="w-5 h-5 rotate-180"
			/>
		</section>
	);
};
export default FlavorText;

const VERSION_GROUPS = {
	'red-blue': 'Red & Blue',
	yellow: 'Yellow',
	'gold-silver': 'Gold & Silver',
	crystal: 'Crystal',
	'ruby-sapphire': 'Ruby & Sapphire',
	emerald: 'Emerald',
	'firered-leafgreen': 'FireRed & LeafGreen',
	'diamond-pearl': 'Diamond & Pearl',
	platinum: 'Platinum',
	'heartgold-soulsilver': 'HeartGold & SoulSilver',
	'black-white': 'Black & White',
	'black-2-white-2': 'Black & White 2',
	'x-y': 'X & Y',
	'omega-ruby-alpha-sapphire': 'Omega Ruby & Alpha Sapphire',
	'sun-moon': 'Sun & Moon',
	'ultra-sun-ultra-moon': 'Ultra Sun & Moon',
	'lets-go-pikachu-lets-go-eevee': "Let's Go Pikachu & Eevee",
	'sword-shield': 'Sword & Shield',
};
