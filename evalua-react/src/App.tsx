import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursePage } from './pages/CoursePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CoursePage />
    </QueryClientProvider>
  );
}

export default App;
