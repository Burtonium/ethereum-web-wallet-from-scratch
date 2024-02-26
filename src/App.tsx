import './index.css';
import Login from './components/Login';
import usePrivateSeed from './hooks/usePrivateSeed';
import Navbar from './components/NavBar';
import Balances from './components/Balances';

import './detectTheme';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


// Create a client
const queryClient = new QueryClient()

function App() {
  const { unlocked } = usePrivateSeed();
  return (
    <main>
      <Navbar />
      {unlocked ? (
        <QueryClientProvider client={queryClient}>
          <Balances />
        </QueryClientProvider>
      ) : <Login />}
    </main>
  )
}

export default App
