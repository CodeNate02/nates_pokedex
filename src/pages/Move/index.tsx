import Searchbar from "../../components/Searchbar"
import { Link } from "react-router-dom"
const Move = () => {
    const page = {upper:'',paper:''}
    return(
        <>
        <header className="static flex flex-wrap items-center justify-center w-full p-2 bg-stone-900/50">
				<section className="flex flex-col items-center">
					<Link
						to="/"
						className="w-full text-2xl text-center font-pressStart hover:underline"
					>
						Nate's Pokedex
					</Link>
					<Searchbar placeHolder="Find Another" routeTo='move' searchType="move" splitChar=' '/>
				</section>
			</header>
			<div className="min-h-fit flex flex-col content-center">
				{page.upper}
			</div>
			<div
				id="paper"
				className="mx-5 mt-10 rounded-t-lg bg-stone-100 grow drop-shadow"
			>
				{page.paper}
			</div>
            </>
    )
}
export default Move;