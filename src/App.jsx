import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Professors from './components/Professors';
import Calendar from './components/Calendar/Calendar';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<div>Dashboard  a developper plus tard </div>} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/professors" element={<Professors/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;