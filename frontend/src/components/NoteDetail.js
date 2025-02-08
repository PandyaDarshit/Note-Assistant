// frontend/src/components/NoteDetail.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { noteApi } from '../services/api';
import TableOfContents from './TableOfContents';
import PropTypes from 'prop-types';

// Component for table of contents
const LocalTableOfContents = ({ content }) => {
  const headers = content?.split('\n')
    .filter(line => line.startsWith('#'))
    .map(header => ({
      level: header.match(/^#+/)[0].length,
      text: header.replace(/^#+\s+/, ''),
      id: header.replace(/^#+\s+/, '').toLowerCase().replace(/\s+/g, '-')
    })) || [];

  if (headers.length === 0) return null;

  return (
    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Table of Contents</h2>
      <nav>
        <ul className="space-y-2">
          {headers.map((header, index) => (
            <li
              key={index}
              style={{ marginLeft: `${(header.level - 1) * 1}rem` }}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <a href={`#${header.id}`}>{header.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Component for section navigation (right sidebar)
const SectionNav = ({ content }) => {
  const headers = content?.split('\n')
    .filter(line => line.startsWith('#'))
    .map(header => ({
      level: header.match(/^#+/)[0].length,
      text: header.replace(/^#+\s+/, '')
    })) || [];

  return headers.length > 0 ? (
    <nav className="hidden lg:block sticky top-4 ml-8 w-64">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">In This Note</h2>
      <ul className="space-y-3 text-sm">
        {headers.map((header, index) => (
          <li 
            key={index}
            className={`${
              header.level === 1 ? 'font-medium' : 'pl-4 text-gray-600'
            }`}
          >
            <a 
              href={`#${header.text.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-indigo-600"
            >
              {header.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
};

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  
  // State management
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  // Fetch note data
  useEffect(() => {
    const fetchNoteDetail = async () => {
      try {
        setLoading(true);
        const response = await noteApi.getNote(id);
        setNote(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('This note could not be found. It may have been deleted.');
        } else {
          setError('Failed to load note. Please try again later.');
        }
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetail();
  }, [id]);

  // Print functionality with improved styling
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${note.title} - Study Notes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #1a202c;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 0.5rem;
            }
            pre {
              background: #f7fafc;
              padding: 1rem;
              border-radius: 0.375rem;
              overflow-x: auto;
            }
            .metadata {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              margin: 1rem 0;
            }
            .content {
              margin-top: 2rem;
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="metadata">
            <p><strong>Topic:</strong> ${note.topic}</p>
            <p><strong>Level:</strong> ${note.level}</p>
            <p><strong>Learning Style:</strong> ${note.learning_style}</p>
            <p><strong>Created:</strong> ${format(new Date(note.created_at), 'MMMM d, yyyy')}</p>
          </div>
          <div class="content">
            ${note.content}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: `Study notes on ${note.topic}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      // Show a toast notification (you'd need to implement this)
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/notes" className="text-indigo-600 hover:text-indigo-800">
            Return to Notes List
          </Link>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-9">
          {/* Header Section with gradient background */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg p-6 mb-6">
            <div className="flex items-center justify-between text-white mb-4">
              <Link to="/notes" className="flex items-center hover:text-white/80">
                <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Notes
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrint}
                  className="text-white hover:text-white/80"
                  title="Print"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                <button
                  onClick={handleShare}
                  className="text-white hover:text-white/80"
                  title="Share"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{note.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/90">
              <div className="flex items-center">
                <span className="font-medium">Topic:</span>
                <span className="ml-2">{note.topic}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Level:</span>
                <span className="ml-2 capitalize">{note.level}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Style:</span>
                <span className="ml-2 capitalize">{note.learning_style}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Created:</span>
                <span className="ml-2">
                  {format(new Date(note.created_at), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <TableOfContents content={note.content} />

          {/* Study Notes Content */}
          <div ref={contentRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="prose prose-lg prose-indigo max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 id={props.children[0].toLowerCase().replace(/\s+/g, '-')} {...props} />,
                  h2: ({node, ...props}) => <h2 id={props.children[0].toLowerCase().replace(/\s+/g, '-')} {...props} />,
                  h3: ({node, ...props}) => <h3 id={props.children[0].toLowerCase().replace(/\s+/g, '-')} {...props} />
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Additional Metadata */}
          {note.note_metadata && Object.keys(note.note_metadata).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(note.note_metadata).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Section Navigation Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <SectionNav content={note.content} />
        </div>
      </div>
    </div>
  );
};

LocalTableOfContents.propTypes = {
  content: PropTypes.string.isRequired,
};

SectionNav.propTypes = {
  content: PropTypes.string.isRequired,
};

NoteDetail.propTypes = {
  children: PropTypes.node,
};

export default NoteDetail;
