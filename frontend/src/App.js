// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import NotesList from './components/NotesList';
import NoteDetail from './components/NoteDetail';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<Assessment />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;