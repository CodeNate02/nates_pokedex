import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { Link, Navigate } from 'react-router-dom';

import { capitalize } from '../../utils';
import { getSpeciesInfo, Spinner } from '../../db';

import { HiSparkles } from 'react-icons/hi2';
import _ from './components';
import { ArrowButton } from '../../components/ArrowButton';
import Searchbar from '../../components/Searchbar';

const PokemonSpecies = () => {
	const info = useParams().id?.toLowerCase(), //id checks the URL
		{ isLoading, data, error } = useQuery([info], () =>
			getSpeciesInfo(info || 'emptyString')
		),
		[selected, select] = useState(0),
		[shiny, setShiny] = useState(false);

	useEffect(()=>{
		select(0);
	},[data])
	var page: { [key: string]: JSX.Element | null } = {
		upper: null,
		paper: null,
	};
	if (error) return <Navigate to="/" />;
	if (isLoading || !data) page.upper = <Spinner />;
	else
		page = {
			upper: (
				<>
					<div className="mx-auto mt-5 w-fit" id="identify">
						<_.VariantTabs
							forms={data.variants}
							sel={selected}
							setSel={select}
						/>
						<div
							id="inner-itentify"
							className="relative w-full m-auto border-8 border-black border-double rounded-xl bg-stone-100"
						>
							<HiSparkles
								className={`absolute right-1 select-none hover:cursor-pointer z-50 ${
									shiny
										? 'text-blue-500 '
										: 'text-black/10' /*Shiny button intentionally somewhat hard to see, similarly to shiny Pokemon in game being hard to find*/
								}`}
								onClick={() => setShiny(!shiny)}
								id="shinySparkles"
							/>
							<_.PkmnImage
								{...{
									shiny,
									setShiny,
									typing: data.variants[selected].types,
									sprites: data.variants[selected].sprites,
									className: ' z-0 h-36 w-36',
								}}
							/>
							<_.Stats
								pkmnStats={data.variants[selected].stats}
							/>
							<_.DexNumbers
								entries={data.species.pokedex_numbers}
							/>
							<span
								className="bottom-0 z-30 w-full leading-none text-center font-pkmn"
								id="nameAndGenus"
							>
								<h1 className="text-2xl underline">
									{
										data.species.names.filter(
											(x: any) => x.language.name == 'en'
										)[0].name
									}
								</h1>
								<h2 className="max-w-[10em] m-auto pb-2 px-2">
									{`The ${
										data.species?.genera.filter(
											(x: any) => x.language.name == 'en'
										)[0]?.genus
									}`}
								</h2>
							</span>
						</div>
					</div>
					{
						data.forms[selected].length > 1 && (
							<_.PkmnForms
								formsArray={data.forms[selected]}
								shiny={shiny}
							/>
						) /*Load and display alternate forms if the Pokemon has them*/
					}
				</>
			),
			paper: (
				<>
					<_.FlavorText pkmn={data.species} />
					<_.EvoChain chain={data.species.evolution_chain} />
				</>
			),
		};
	document.title = `${capitalize(
		data?.species.name || info
	)} - Nate's Pokédex`;
	return (
		<>
			<header className="static flex content-center w-full bg-stone-900/50 flex-wrap">
				<Link to='/' className='w-full text-2xl font-pressStart text-center hover:underline'>Nate's Pokedex</Link>
				{data?.species && (
					<Link to={`/species/${data.species.id - 1}`}>
						<ArrowButton />
					</Link>
				)}
				<Searchbar placeHolder="Find Another" />
				{data?.species && (
					<Link to={`/species/${data.species.id + 1}`}>
						<ArrowButton className="rotate-180" />
					</Link>
				)}
			</header>
			<div className="min-h-[25%] flex flex-col content-center">
				{page.upper}
			</div>
			<div
				id="paper"
				className="mx-5 mt-10 rounded-t-lg bg-stone-100 grow drop-shadow"
			>
				{page.paper}
			</div>
		</>
	);
};
export default PokemonSpecies;
