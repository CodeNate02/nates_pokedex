import { BrowserRouter, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import Home from './pages/Home.page';
import { Routes } from 'react-router';
import Species from './pages/Species';

const queryClient = new QueryClient();
function App() {
	return (
		<QueryClientProvider client={queryClient}>
				<div className="App h-full w-full flex flex-col">
					<BrowserRouter basename='/nrw4912/portfolio/pokedex'>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/*"
								element={
									<Navigate to="/" /> /* Redirect non-existent pages*/
								}
							/>
							<Route
								path="/species/:id"
								element={
									<Species /> /*Info on specific Pokemon species*/
								}
							/>
						</Routes>
					</BrowserRouter>
				</div>
		</QueryClientProvider>
	);
}
export default App;
