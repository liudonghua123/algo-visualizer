import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Visualize from '@/pages/Visualize';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualize/:algorithmId" element={<Visualize />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
