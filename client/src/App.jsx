import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Sandbox from './pages/Sandbox';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <Header />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<Exercise />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}
