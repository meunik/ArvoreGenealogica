import { Routes, Route } from 'react-router';
import { TreePage } from './pages/TreePage';
import { PersonPage } from './pages/PersonPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TreePage />} />
      <Route path="/person/:id" element={<PersonPage />} />
    </Routes>
  );
}

