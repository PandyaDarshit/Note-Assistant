// frontend/src/components/NotesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { noteApi } from '../services/api';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await noteApi.getNotes(page);
        
        // Group notes by topic before setting state
        const groupedNotes = response.data.notes.reduce((acc, note) => {
          if (!acc[note.topic]) {
            acc[note.topic] = [];
          }
          acc[note.topic].push(note);
          return acc;
        }, {});

        setNotes(response.data.notes);
        setTotalPages(Math.ceil(response.data.total / 10));
      } catch (err) {
        setError('Failed to load notes. Please try again later.');
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [page]);

  if (loading && notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => setPage(1)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          No Study Notes Yet
        </h2>
        <p className="text-gray-600 mb-6">
          Start by creating your first set of AI-powered study notes.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Your First Note
        </Link>
      </div>
    );
  }

  // Group notes by topic
  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.topic]) {
      acc[note.topic] = [];
    }
    acc[note.topic].push(note);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Study Notes</h1>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Create New Notes
        </Link>
      </div>

      {/* Notes grid organized by topic */}
      <div className="space-y-8">
        {Object.entries(groupedNotes).map(([topic, topicNotes]) => (
          <div key={topic} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
              <h2 className="text-xl font-semibold text-white">{topic}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {topicNotes.map((note) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="block hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg text-gray-900">
                        {note.title}: {format(new Date(note.created_at), 'dd.MM.yyyy')}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-md ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesList;