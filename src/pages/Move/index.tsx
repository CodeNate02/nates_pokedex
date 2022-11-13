import { useEffect, useState } from 'react';
import Searchbar from '../../components/Searchbar';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getFromDB, Spinner } from '../../db';
import { capitalize } from '../../utils';
import FlavorText from '../../components/FlavorTexts';
import TypeIcons from '../../components/TypeIcons';
import { icon_physical, icon_special, icon_status, zMove } from '../../assets';
const Move = () => {
	const info = useParams().id?.toLowerCase(),
		{ isLoading, data, error } = useQuery([info], () =>
			getFromDB(`https://pokeapi.co/api/v2/move/${info}`)
		);
	if (error || !(isLoading || data)) return <Navigate to="/" />;
	var page = {} as { upper: any; paper: any };
	if (isLoading) {
		page.upper = <Spinner />;
	} else {
		page = {
			upper: <MoveStats move={data} />,
			paper: (
				<>
					<FlavorText pkmn={data} />
				</>
			),
		};
	}
	return (
		<>
			<header className="static flex flex-wrap items-center justify-center w-full p-2 bg-stone-900/50">
				<section className="flex flex-col items-center">
					<Link
						to="/"
						className="w-full text-2xl text-center font-pressStart hover:underline"
					>
						Nate's Pokedex
					</Link>
					<Searchbar
						placeHolder="Find Another"
						routeTo="move"
						searchType="move"
						splitChar=" "
					/>
				</section>
			</header>
			<div className="min-h-fit flex flex-col content-center">
				{page?.upper}
			</div>
			<div
				id="paper"
				className="mx-5 mt-10 rounded-t-lg bg-stone-100 grow drop-shadow"
			>
				{page?.paper}
			</div>
		</>
	);
};
export default Move;

const MoveStats = ({ move }: any) => {
	return (
		<div className="w-fit m-auto mt-6 relative rounded-[3em] bg-stone-100">
			<h1 className="text-center font-pkmn text-3xl underline border-x border-t border-stone-100 w-fit m-auto rounded-t-full bg-red-400 min-w-[90px] min-h-[1em] px-5">
				{capitalize(move.name, 'all', '-', ' ')}
			</h1>

			<div className="grid grid-cols-3  text-center w-[20em] min-w-full h-[5em] m-auto border border-black rounded-xl bg-stone-100 absolute right-1/2 translate-x-1/2">
				<span className="text-3xl font-screen m-auto border-black">
					{move.accuracy ? (
						<p>{move.accuracy}</p>
					) : (
						<p className="text-sm">
							Can't
							<br />
							Miss
						</p>
					)}
					<h6 className="text-sm font-pkmn overline">Accuracy</h6>
				</span>
				{/*Power displays move power if it has one, displays 'varies' for variable z-moves, displays nothing for status moves.  Move damage type symbol in bg*/}
				<span
					className={`text-3xl font-screen m-auto border-black bg-contain bg-no-repeat bg-center min-h-[2em] min-w-[2em]`}
					style={{
						backgroundImage: `url(${
							move.damage_class.name == 'physical'
								? icon_physical
								: move.damage_class.name == 'special'
								? icon_special
								: icon_status
						})`,
					}}
				>
					{move.power ? <p className='drop-shadow'>{move.power}</p> : move.pp==1 && <p className='text-base'> Varies </p>}
					{(move.power || move.pp==1) && (
						<h6 className="text-sm font-pkmn overline">Power</h6>
					)}
				</span>
				{/*PP Section, display base PP of a move.  If pp=1, move is a z-move.  Display Z crystal instead*/}
				<span className="text-3xl font-screen m-auto border-black">
					{move.pp > 1 ? (
						<>
							<p>{move.pp}</p>{' '}
							<h6 className="text-sm font-pkmn overline">PP</h6>
						</>
					) : (
						<img src={zMove} alt="Z-Move" className="rotate-90" />
					)}
				</span>
			</div>
			<div className="h-[5em]" />
			<div className="rounded-b-full bg-white w-full m-auto min-w-[90px] min-h-[2.3em] border-x border-b border-stone-100 p-1">
				<TypeIcons typing={[move]} />
			</div>
		</div>
	);
};
