import Searchbar from '../components/Searchbar';
const Home = () => {
	return (
		<div className="m-auto w-fit bg-white border-8 rounded-xl p-2 border-red-500">
			<h1 className="font-pressStart text-2xl text-center">
				Nate's Pokédex
			</h1>
			<p className="text-center">
				Welcome to Nate's Pokédex, powered by
				<a
					href="https://pokeapi.co/"
					className="text-blue-500 hover:border-b border-blue-500"
				>
					<img
						src="pokeapi_logo.png"
						alt="PokéApi"
						width={50}
						className="inline align-baseline "
					/>
				</a>
				<br /> Search below to begin!
			</p>
			<Searchbar />
		</div>
	);
};
export default Home;