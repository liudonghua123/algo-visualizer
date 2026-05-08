import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Visualize from '@/pages/Visualize';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualize/:algorithmId" element={<Visualize />} />
      </Routes>
    </Router>
  );
}
