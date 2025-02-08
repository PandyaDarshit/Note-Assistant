// frontend/src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Mukti: Your AI Study Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your learning experience with AI-powered study notes tailored to your learning style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          to="/create"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create New Notes
            </h3>
            <p className="text-gray-600">
              Generate personalized study materials optimized for your learning style.
            </p>
          </div>
        </Link>

        <Link
          to="/notes"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Study Notes
            </h3>
            <p className="text-gray-600">
              Access your previously generated study materials.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;