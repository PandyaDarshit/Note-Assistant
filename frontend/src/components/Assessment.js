// frontend/src/components/Assessment.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { noteApi } from "../services/api";
import QuickTips from "./QuickTips";

const Assessment = () => {
  const navigate = useNavigate();

  // State management for form inputs, loading state, and errors
  const [formData, setFormData] = useState({
    topic: "",
    title: "",
    level: "",
    learning_style: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await noteApi.createNote(formData);
      navigate(`/notes/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create note. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Create Personalized Study Notes
        </h1>
        <p className="text-gray-600">
          Tell us what you want to learn, and let AI craft the perfect study
          materials for you.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow-lg p-6"
      >
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            What would you like to learn about?
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Python Programming Basics"
            required
          />
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Specific Topic Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Variables and Data Types"
            required
          />
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Current Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select your level...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Learning Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            How do you prefer to learn?
          </label>
          <select
            name="learning_style"
            value={formData.learning_style}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select learning style...</option>
            <option value="visual">Visual (diagrams & images)</option>
            <option value="auditory">Auditory (explanations & discussions)</option>
            <option value="reading">Reading/Writing (text & notes)</option>
            <option value="kinesthetic">Kinesthetic (examples & practice)</option>
          </select>
        </div>

        {/* Display Quick Tips if a learning style is selected */}
        {formData.learning_style && (
          <QuickTips learningStyle={formData.learning_style} />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating Notes...
            </div>
          ) : (
            "Create Study Notes"
          )}
        </button>
      </form>
    </div>
  );
};

export default Assessment;