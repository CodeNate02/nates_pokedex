import { BrowserRouter, Route, Navigate} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import Home from './pages/Home.page';
import { Routes } from 'react-router';
import Species from './pages/Species.page';

const queryClient = new QueryClient();
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<div className="App h-screen w-screen flex flex-col">
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/*" element={<Navigate to='/' /> /* Redirect non-existent pages*/} />
							<Route
								path="/species/:id"
								element={<Species /> /*Info on specific Pokemon species*/}
							/>
						</Routes>
					</BrowserRouter>
				</div>
			</Provider>
		</QueryClientProvider>
	);
}

export default App;
