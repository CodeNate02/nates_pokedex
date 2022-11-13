import { api_logo } from '../assets';
import Searchbar from '../components/Searchbar';
const Home = () => {
	return (
		<div className="flex flex-col items-center p-2 m-auto bg-white border-8 border-red-500 w-fit rounded-xl">
			<h1 className="text-2xl text-center font-pressStart">
				Nate's Pokédex
			</h1>
			<p className="text-center">
				Welcome to Nate's Pokédex, powered by
				<a
					href="https://pokeapi.co/"
					className="text-blue-500 border-blue-500 hover:border-b"
				>
					<img
						src={api_logo}
						alt="PokéApi"
						width={50}
						className="inline align-baseline "
					/>
				</a>
				<br /> Search below to begin!
			</p>
			<br/>
			<h6 className='underline font-pkmn'> Pokémon: </h6>
			<Searchbar />
			<h6 className='underline font-pkmn'> Moves: </h6>
			<Searchbar placeHolder="Earthquake" routeTo='move' searchType="move" splitChar=' '/>
		</div>
	);
};
export default Home;
