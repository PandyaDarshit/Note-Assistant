import React from 'react';

const TableOfContents = ({ content }) => {
  // Parse headers from markdown content
  const extractHeaders = (content) => {
    if (!content) return [];

    const lines = content.split('\n');
    let headers = [];

    lines.forEach((line, index) => {
      // Match markdown headers (e.g., # Header, ## Subheader)
      const match = line.match(/^(#{1,6})\s+(.+)$/);

      if (match) {
        const level = match[1].length; // Number of # symbols
        const text = match[2].trim();
        const id = text.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-'); // Replace spaces with hyphens

        headers.push({
          level,
          text,
          id,
          index
        });
      }
    });

    return headers;
  };

  const headers = extractHeaders(content);

  if (headers.length === 0) return null;

  // Create nested structure if needed
  const createNestedStructure = (headers) => {
    let structure = [];
    let stack = [{ level: 0, items: structure }];

    headers.forEach(header => {
      while (header.level <= stack[stack.length - 1].level) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].items;
      const newItem = { ...header, items: [] };
      parent.push(newItem);
      stack.push({ level: header.level, items: newItem.items });
    });

    return structure;
  };

  const nestedHeaders = createNestedStructure(headers);

  // Render nested headers recursively
  const renderHeaders = (headers, level = 0) => {
    return (
      <ul className={`${level === 0 ? 'space-y-2' : 'ml-4 mt-2 space-y-1'}`}>
        {headers.map((header, index) => (
          <li key={index}>
            <a
              href={`#${header.id}`}
              className="block py-1 text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
              style={{
                fontSize: `${Math.max(1 - (header.level - 1) * 0.1, 0.8)}rem`
              }}
            >
              {header.text}
            </a>
            {header.items && header.items.length > 0 && renderHeaders(header.items, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-indigo-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Contents</h2>
        <span className="text-sm text-gray-500">{headers.length} sections</span>
      </div>
      <nav className="toc-nav">
        {renderHeaders(nestedHeaders)}
      </nav>
    </div>
  );
};

export default TableOfContents;