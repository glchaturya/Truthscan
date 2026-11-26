import { AnalysisProvider } from '@/lib/analysis-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RouterOutlet, type Route } from '@/components/router';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import ResultsPage from '@/pages/ResultsPage';
import HistoryPage from '@/pages/HistoryPage';
import AboutPage from '@/pages/AboutPage';

const pages: Record<Route, () => React.ReactNode> = {
  landing: () => <LandingPage />,
  dashboard: () => <DashboardPage />,
  results: () => <ResultsPage />,
  history: () => <HistoryPage />,
  about: () => <AboutPage />,
};

function App() {
  return (
    <AnalysisProvider>
      <div className="flex min-h-screen flex-col bg-navy-950 text-slate-200">
        <Navbar />
        <main className="flex-1">
          <RouterOutlet pages={pages} />
        </main>
        <Footer />
      </div>
    </AnalysisProvider>
  );
}

export default App;
