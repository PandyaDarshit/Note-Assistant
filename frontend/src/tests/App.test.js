// frontend/src/tests/App.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../bak/App';
import Assessment from '../components/Assessment';
import NotesList from '../bak/NotesList.js.bak';
import { noteApi } from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  noteApi: {
    createNote: jest.fn(),
    getNote: jest.fn(),
    getNotes: jest.fn(),
  },
}));

// Helper function to render components with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('App Component Tests', () => {
  test('renders navigation bar', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Study Assistant')).toBeInTheDocument();
    expect(screen.getByText('My Notes')).toBeInTheDocument();
  });
});

describe('Assessment Component Tests', () => {
  beforeEach(() => {
    noteApi.createNote.mockReset();
  });

  test('renders assessment form', () => {
    renderWithRouter(<Assessment />);
    expect(screen.getByText('Create Study Notes')).toBeInTheDocument();
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const mockNote = {
      id: 1,
      topic: 'Test Topic',
      content: 'Test Content',
    };
    
    noteApi.createNote.mockResolvedValueOnce({ data: mockNote });
    
    renderWithRouter(<Assessment />);
    
    await userEvent.type(screen.getByLabelText(/topic/i), 'Test Topic');
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Title');
    await userEvent.selectOptions(screen.getByLabelText(/level/i), 'beginner');
    await userEvent.selectOptions(screen.getByLabelText(/learning style/i), 'visual');
    
    fireEvent.click(screen.getByText(/create study notes/i));
    
    await waitFor(() => {
      expect(noteApi.createNote).toHaveBeenCalledWith({
        topic: 'Test Topic',
        title: 'Test Title',
        level: 'beginner',
        learning_style: 'visual',
      });
    });
  });
});

describe('NotesList Component Tests', () => {
  beforeEach(() => {
    noteApi.getNotes.mockReset();
  });

  test('renders notes list', async () => {
    const mockNotes = {
      notes: [
        {
          id: 1,
          title: 'Test Note 1',
          topic: 'Test Topic 1',
          created_at: new Date().toISOString(),
        },
      ],
      total: 1,
    };
    
    noteApi.getNotes.mockResolvedValueOnce({ data: mockNotes });
    
    renderWithRouter(<NotesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });
  });

  test('handles empty notes list', async () => {
    noteApi.getNotes.mockResolvedValueOnce({ 
      data: { notes: [], total: 0 } 
    });
    
    renderWithRouter(<NotesList />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});

// Run all tests
describe('Run All Tests', () => {
  beforeAll(() => {
    console.log('Starting frontend tests...');
  });

  afterAll(() => {
    console.log('All frontend tests completed.');
  });

  test('all components render without crashing', () => {
    renderWithRouter(<App />);
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
  });
});