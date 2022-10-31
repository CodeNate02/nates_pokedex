import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, setState as setRedux } from '../redux';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import searchDB, { getPkmnForms, Spinner } from '../db';

const Species = () => {
	const [state, setState] = useState<'loading' | 'error' | 'ready'>(
		'loading'
	);
	const species = useSelector((state: ReduxStore) => state.data), //Selector grabs current info from the redux store
		info = useParams().id?.toLowerCase(), //id checks the URL
		dispatch = useDispatch(); //Dispatches updates to the redux store
	useEffect(() => {
		//CHECK IF CURRENT URL MATCHES THE POKEMON STORED IN THE REDUX STORE
		//IF THEY DON'T MATCH, GRAB FRESH INFORMATION
		if (!(species.id == info || species.name == info)) {
			searchDB('pokemon-species', info || 'error').then(result => {
				if (result) dispatch(setRedux(result, 'data'));
				else setState('error');
			});
		} else {
			setState('ready');
		}
	}, [species]);
	switch (state) {
		case 'loading':
			return <Spinner />;
		case 'error':
			return <Navigate to="/" />;
		case 'ready':
			return <PkmnInfo s={species} />;
	}
};
export default Species;

const PkmnInfo = ({ s }: { s: any }) => {
	const [forms, setForms] = useState<any[] | 'loading' | undefined>(
		'loading'
	);
	const [selected, select] = useState(0);
	useEffect(() => {
		getPkmnForms(s.varieties).then(x => setForms(x));
	}, []);
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
						className="m-auto h-36 w-36"
						alt="Image not Found"
					/>
					<h1 className="underline text-2xl font-medium text-center absolute bottom-0 w-full">
						{s.names[8].name}
					</h1>
				</div>
			</div>
		</div>
	);
};

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
                n=capitalize(n.split('-').join(' '));
				r.push(n); //Add the name to the array
			}
			return r;
		},
		formattedNames = useMemo(() => getNames(), []); //Memoize names with no need for any changes
	return (
		<>
			{forms.length > 1 && ( //If this Pokemon has forms
				<ul className="flex relative left-2">
					{forms.map((_item, index) => (
						<li
							key={index}
							className={`rounded-t-xl bg-stone-100 px-2 border-black border-t-2 border-b border-x-2 relative ${
								sel == index ? '-bottom-[2px] shadow-lg' : ''
							}`}
							onClick={() => setSel(index)}
							style={{
								right: `${0.5 * index}em`,
								zIndex: sel == index ? 100 : index,
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

const capitalize = (string: string, words: 'all' | 'first' = 'all') => {
	let w;
	if ((words = 'all')) w = string.split(' ');
	else w = ([] as string[]).concat(string);
    let r = ([] as string[]);
	w.forEach(x => {
		r.push(x[0].toUpperCase() + x.slice(1));
	});
    return(r.join(' '));
};
