import { HashRouter, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import Home from './pages/Home.page';
import { Routes } from 'react-router';
import Species from './pages/Species';
import Move from './pages/Move';

const queryClient = new QueryClient();
function App() {
	return (
		<QueryClientProvider client={queryClient}>
				<div className="App h-full w-full flex flex-col">
					<HashRouter>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/*"
								element={
									<Navigate to="/" /> /* Redirect non-existent pages */
								}
							/>
							<Route
								path="/species/:id"
								element={
									<Species /> /*Info on specific Pokemon species */
								}
							/>
							<Route
								path="/move/:id"
								element={
									<Move />
								}
							/>
						</Routes>
					</HashRouter>
				</div>
		</QueryClientProvider>
	);
}
export default App;
