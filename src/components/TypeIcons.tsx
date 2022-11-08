import { capitalize } from "../utils";
const TypeIcons = ({ typing }: any) => {
	return (
		<div className="top-0 flex justify-center w-full max-w-[10em] m-auto">
			{typing.map((item: any, index: number) => (
				<div
					key={index}
					className={`w-1/2 text-center border rounded-full font-pkmn text-xs ${
						TYPE_STYLES[item.type.name]
					} `}
				>
					{capitalize(item.type.name)}
				</div>
			))}
		</div>
	);
};
export default TypeIcons
const TYPE_STYLES: { [type: string]: string } = {
	normal: 'bg-neutral-200 border-neutral-400',
	fire: 'border-orange-700 bg-orange-500',
	water: 'border-cyan-800 bg-cyan-600',
	grass: 'bg-green-500 border-green-700',
	bug: 'bg-lime-300 border-lime-600',
	dark: 'bg-gray-600 border-black text-white ',
	dragon: 'bg-fuchsia-700 border-fuchsia-900',
	electric: 'bg-yellow-300 border-yellow-400',
	fighting: 'bg-orange-700 border-amber-900',
	flying: 'bg-sky-100 border-sky-400',
	ghost: 'bg-purple-400 border-indigo-800',
	ground: 'bg-orange-300 bg-amber-800',
	ice: 'bg-cyan-100 border-cyan-400',
	poison: 'bg-purple-600 border-violet-700',
	psychic: 'border-pink-700 bg-pink-300',
	rock: 'bg-stone-500 border-orange-900',
	steel: 'bg-stone-200 border-zinc-400',
	unknown: '',
	fairy: 'bg-pink-200 border-rose-400',
	shadow: 'bg-purple-200'
};