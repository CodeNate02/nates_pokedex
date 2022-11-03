import { useRef } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import searchDB, { getFromDB } from '../db';
import { capitalize } from '../utils';

const Searchbar = ({
	searchType = 'pokemon-species',
	routeTo = 'species',
	placeHolder = 'Turtwig',
}: {
	searchType?: string;
	routeTo?: string;
	placeHolder?: string;
}) => {
	const navigate = useNavigate(),
		ref = useRef<HTMLInputElement>(null);
	const { isLoading, error, data } = useQuery([], () =>
		//Query data
		getFromDB(`https://pokeapi.co/api/v2/${searchType}?limit=100000`)
	);
	const search = async (term: string) => {
		if (term.length < 1) return {};
		searchDB(searchType, term).then(data => {
			if (data) {
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
			) => (
				<option
					key={index}
					value={capitalize(item.name.split('-').join(' '))
						.split(' ')
						.join('-')}
				/>
			)
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
				onKeyDown={e => {
					if (e.code == 'Enter' && ref.current) {
						search(ref.current.value);
						ref.current.value = '';
					}
				}}
			/>
			<datalist id="names">{list}</datalist>
			<button
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
