// frontend/src/App.js

// Keep only one React import at the top
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './bak/Navbar.js.bak';
import Assessment from '../components/Assessment';
import NotesList from './bak/NotesList.js.bak';
import NoteDetail from './bak/NoteDetail.js.bak';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Assessment />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;