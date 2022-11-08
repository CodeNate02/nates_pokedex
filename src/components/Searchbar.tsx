import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import searchDB, { getFromDB } from '../db';
import { capitalize } from '../utils';

const Searchbar = ({
	searchType = 'pokemon-species',
	routeTo = 'species',
	placeHolder = 'Turtwig',
	splitChar = '-',
}: {
	searchType?: string;
	routeTo?: string;
	placeHolder?: string;
	splitChar?: string;
}) => {
	const navigate = useNavigate(),
		ref = useRef<HTMLInputElement>(null);
	const { isLoading, error, data } = useQuery([], () =>
		//Query data
		getFromDB(`https://pokeapi.co/api/v2/${searchType}?limit=100000`)
	);
	const search = async (term: string) => {
		if (term.length < 1) return {};
		searchDB(searchType, term.replaceAll(splitChar,'-')).then(data => {
			if (data) {
				navigate(`/${routeTo}/${term.replaceAll(splitChar,'-')}`);
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
			) => (
				<option
					key={index}
					aria-label={item}
					value={capitalize(item.name, undefined, '-', splitChar)}
				/>
			)
		);
	}
	return (
		<div className="flex overflow-hidden font-medium border-2 border-black rounded-xl w-80">
			<input
				aria-label={`Search ${searchType.replaceAll('-', ' ')} Bar`}
				type="text"
				name="searchBar"
				className="p-1 grow"
				list="names"
				placeholder={placeHolder}
				ref={ref}
				onKeyDown={e => {
					if (e.code == 'Enter' && ref.current) {
						search(ref.current.value);
						ref.current.value = '';
					}
				}}
			/>
			<datalist id="names">
				{' '}
				<p> {list} </p>
			</datalist>
			<button
				aria-label={`Search ${searchType.replaceAll('-', ' ')}`}
				type="button"
				name="search"
				className="relative px-2 border border-gray-600 w-fit active:left-px active:shadow-inner bg-slate-300"
				onClick={() => {
					if (ref.current) {
						search(ref.current.value);
						ref.current.value = '';
					}
				}}
			>
				{' '}
				Search{' '}
			</button>
		</div>
	);
};
export default Searchbar;
