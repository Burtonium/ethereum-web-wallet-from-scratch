import './index.css';
import Login from './components/Login';
import usePrivateSeed from './hooks/usePrivateSeed';
import Navbar from './components/NavBar';
import TransactionForm from './components/TransactionForm';

import './detectTheme';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  const { unlocked } = usePrivateSeed();
  return (
    <main>
      <Navbar />
      {unlocked ? (
        <QueryClientProvider client={queryClient}>
          <TransactionForm />
        </QueryClientProvider>
      ) : <Login />}
    </main>
  )
}

export default App
