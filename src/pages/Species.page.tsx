import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, setState as setRedux } from '../redux';
import { useParams } from 'react-router';
import { Link, Navigate } from 'react-router-dom';
import searchDB, { getPkmnForms, Spinner } from '../db';
import Searchbar from '../components/Searchbar';

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
	}, [species]);
	switch (state) {
		case 'loading':
			return <Spinner />;
		case 'error':
			return <Navigate to="/" />;
		case 'ready':
			return (
				<>
					<header className="w-full static flex content-center">
						<Link to="/"> {'<'} </Link>
						<Searchbar placeHolder="Find Another" />
						<Link to="/">
							{' '}
							{'>' /*Replace later with a react-icon*/}{' '}
						</Link>
					</header>
					<PkmnInfo s={species} />
				</>
			);
	}
};
export default Species;

const PkmnInfo = ({ s }: { s: any }) => {
	const [forms, setForms] = useState<any[] | 'loading' | undefined>(
		'loading'
	);
	const [selected, select] = useState(0);
	useEffect(() => {
		setForms('loading');
		getPkmnForms(s.varieties).then(x => setForms(x));
	}, [s]);
	switch (forms) {
		case 'loading':
			return <Spinner />;
		case undefined:
			return <Navigate to="/" />;
	}
	return (
		<div className="w-fit h-fit m-auto">
			<div className="w-fit m-auto">
				<FormTabs forms={forms} sel={selected} setSel={select} />
				<div className="border-double border-8 border-black bg-stone-100 rounded-xl m-auto w-full relative">
					<img
						src={forms[selected].sprites.front_default}
						className="m-auto h-36 w-36 mb-12"
						alt="Image not Found"
					/>
					<span className="w-full text-center absolute bottom-0">
						<h1 className="underline text-2xl font-medium ">
							{
								s.names.filter(
									(x: any) => x.language.name == 'en'
								)[0].name
							}
						</h1>
						<h2>
							The{' '}
							{
								s?.genera.filter(
									(x: any) => x.language.name == 'en'
								)[0]?.genus
							}
						</h2>
					</span>
				</div>
			</div>
			<FlavorText pkmn={s} />
		</div>
	);
};

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
				<ul className="flex relative left-2">
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

/*Formats provided strings into capitalized forms, can capitalize either first word or every word*/
const capitalize = (string: string, words: 'all' | 'first' = 'all') => {
	let w;
	if ((words == 'all')) w = string.split(' ');
	else w = ([] as string[]).concat(string);
	let r = [] as string[];
	w.forEach(x => {
		r.push(x[0].toUpperCase() + x.slice(1));
	});
	return r.join(' ');
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
			className="grid grid-cols-[3em_30em_3em] bg-stone-100 p-1 rounded-lg border-black border-2 w-fit m-auto mt-2 h-36"
		>
			<button
				onClick={() => {
					if (text > 0) setText(text - 1);
				}}
				className='border border-black p-1 rounded-l-2xl bg-red-400 hover:underline'
			>
				{'<'}
			</button>
			<section className="px-5 flex flex-col justify-center border-y border-black">
				<p>{FlavorTexts[text].flavor_text}</p>
				<p className="text-right w-full">
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
				className='border border-black bg-gray-200 p-1 rounded-r-2xl hover:underline'
			>
				{'>'}
			</button>
		</section>
	);
};
