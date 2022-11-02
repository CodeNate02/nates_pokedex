import { useEffect, useState } from 'react';
import { ArrowButton } from '../../components/ArrowButton';
import { useSelector, useDispatch, setState as setRedux } from '../../redux';
import { useParams } from 'react-router';
import { Link, Navigate } from 'react-router-dom';
import searchDB, { getPkmnVariants, Spinner } from '../../db';
import Searchbar from '../../components/Searchbar';
import { capitalize } from '../../utils';
import { HiSparkles } from 'react-icons/hi2';
import _ from './components';

const Species = () => {
	const [state, setState] = useState<'loading' | 'error' | 'ready'>(
		'loading'
	);
	const species = useSelector((state: ReduxStore) => state.data), //Selector grabs current info from the redux store
		info = useParams().id?.toLowerCase(), //id checks the URL
		dispatch = useDispatch(); //Dispatches updates to the redux store
	useEffect(() => {
		//CHECK IF CURRENT URL MATCHES THE Pokémon STORED IN THE REDUX STORE (likely if the user reached this page from a searchbar)
		//IF THEY DON'T MATCH, GRAB FRESH INFORMATION
		setState('loading');
		if (!(species.id == info || species.name == info)) {
			searchDB('pokemon-species', info || 'error').then(result => {
				if (result) dispatch(setRedux(result, 'data'));
				else setState('error');
			});
		} else {
			document.title = `${capitalize(species.name)} - Nate's Pokédex`;
			setState('ready');
		}
	}, [species, info]);
	switch (state) {
		case 'loading':
			return (
				<>
					<header className="static flex content-center w-full bg-stone-900/50">
						<Link to={`/species/${species.id - 1}`}>
							<ArrowButton />
						</Link>
						<Searchbar placeHolder="Find Another" />
						<Link to={`/species/${species.id + 1}`}>
							<ArrowButton className="rotate-180" />
						</Link>
					</header>
				</>
			);
		case 'error':
			return <Navigate to="/" />;
		case 'ready':
			return (
				<>
					<header className="static flex content-center w-full bg-stone-900/50">
						<Link to={`/species/${species.id - 1}`}>
							<ArrowButton />
						</Link>
						<Searchbar placeHolder="Find Another" />
						<Link to={`/species/${species.id + 1}`}>
							<ArrowButton className="rotate-180" />
						</Link>
					</header>
					<PkmnInfo s={species} />
				</>
			);
	}
};
export default Species;

const PkmnInfo = ({ s }: { s: any }) => {
	const [shiny, setShiny] = useState(false);
	const [forms, setForms] = useState<any[] | 'loading' | undefined>(
		'loading'
	);
	const [selected, select] = useState(0);
	useEffect(() => {
		setForms('loading');
		getPkmnVariants(s.varieties).then(x => setForms(x));
	}, [s]);
	switch (forms) {
		case 'loading':
			return <Spinner />;
		case undefined:
			return <Navigate to="/" />;
	}
	return (
		<>
			<div className="mx-auto mt-5 w-fit">
				<_.VariantTabs forms={forms} sel={selected} setSel={select} />
				<div className="relative w-full border-t-8 border-slate-900 rounded-xl w-min-36">
					<div className="relative m-auto border-8 border-t-0 border-black border-double rounded-b-xl w-fit bg-stone-100">
						<HiSparkles
							className={`absolute right-1 select-none hover:cursor-pointer z-50 ${
								shiny
									? 'text-blue-500 '
									: 'text-black/10' /*Shiny button intentionally somewhat hard to see, similarly to shiny Pokemon in game being hard to find*/
							}`}
							onClick={() => setShiny(!shiny)}
						/>
						<_.PkmnImage
							{...{
								shiny,
								setShiny,
								typing: forms[selected].types,
								sprites: forms[selected].sprites,
								className: ' z-0 h-36 w-36',
							}}
						/>
						<_.Stats pkmnStats={forms[selected].stats} />
						<span className="bottom-0 z-30 w-full leading-none text-center font-pkmn">
							<h1 className="text-2xl underline">
								{
									s.names.filter(
										(x: any) => x.language.name == 'en'
									)[0].name
								}
							</h1>
							<h2 className="max-w-[10em] m-auto pb-2 px-2">
								{`The ${
									s?.genera.filter(
										(x: any) => x.language.name == 'en'
									)[0]?.genus
								}`}
							</h2>
						</span>
					</div>
				</div>
			</div>

			<_.FlavorText pkmn={s} />
			{
				forms[selected].forms.length > 1 && (
					<_.PkmnForms
						formsArray={forms[selected].forms}
						shiny={shiny}
					/>
				) /*Load and display alternate forms if the Pokemon has them*/
			}
		</>
	);
};
