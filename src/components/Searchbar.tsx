import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, setState } from '../redux';
import { useNavigate } from 'react-router';
import searchDB from '../db';

const Searchbar = ({
	searchType = 'pokemon-species',
	routeTo = 'species',
	placeHolder = 'Turtwig',
}: {
	searchType?: string;
	routeTo?: string;
	placeHolder?: string;
}) => {
	const dispatch = useDispatch(),
		navigate = useNavigate(),
		ref = useRef<HTMLInputElement>(null);
	const { isLoading, error, data } = useQuery(['repoData'], () =>
		//Query data
		fetch(`https://pokeapi.co/api/v2/${searchType}?limit=100000`).then(
			res => res.json()
		)
	);
	const search = async (term: string) => {
		if (term.length < 1) return {};
		searchDB(searchType, term).then(data => {
			if (data) {
				dispatch(setState(data, 'data')); //Store data from the search in the Redux store
				navigate(`/${routeTo}/${term}`);
			}
		});
	};

	var list;
	if (isLoading || error) {
		//List is empty if query is still in progress, failed
		list = [];
	} else {
		list = data.results.map(
			(
				item: any,
				index: number //populate list with value names
			) => <option key={index} value={format(item.name)} />
		);
	}
	return (
		<div className="flex m-auto overflow-hidden font-medium border-2 border-black rounded-xl w-80">
			<input
				type="text"
				className="p-1 grow"
				list="names"
				placeholder={placeHolder}
				ref={ref}
			/>
			<datalist id="names">{list}</datalist>
			<button
				className="relative px-2 border border-gray-600 w-fit active:left-px active:shadow-inner"
				onClick={() => {
					if (ref.current) search(ref.current.value);
				}}
			>
				{' '}
				Search{' '}
			</button>
		</div>
	);
};
export default Searchbar;

const format = (str: string) => {
	str = str[0].toUpperCase() + str.slice(1);
	return str;
};
