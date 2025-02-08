import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes

const studyTips = {
  visual: [
    "Use mind maps and diagrams",
    "Color-code your notes",
    "Draw visual analogies"
  ],
  auditory: [
    "Read notes aloud",
    "Record key points",
    "Discuss concepts with others"
  ],
  reading: [
    "Summarize in your own words",
    "Create detailed outlines",
    "Write practice questions"
  ],
  kinesthetic: [
    "Create physical models",
    "Use hands-on examples",
    "Practice with real objects"
  ]
};

const QuickTips = ({ learningStyle }) => {
  const tips = studyTips[learningStyle] || [];

  if (!tips.length) return null;

  return (
    <div className="bg-indigo-50 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-medium text-indigo-800 mb-2">
        Study Tips for {learningStyle} learners:
      </h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
};

// Add PropTypes validation
QuickTips.propTypes = {
  learningStyle: PropTypes.oneOf(['visual', 'auditory', 'reading', 'kinesthetic']).isRequired
};

export default QuickTips;