import React, { useState, useRef, useEffect } from 'react';

const CustomPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const textareaRef = useRef(null);

  // Calculate the max height for 5 lines of text
  const calculateMaxHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10);
      return lineHeight * 5; // 5 lines height
    }
    return 0;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to calculate scrollHeight
      textarea.style.height = 'auto'; 
      // Set height based on scrollHeight but not exceeding maxHeight
      const maxHeight = calculateMaxHeight();
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [prompt]);

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      setResponses([...responses, prompt]);
      setPrompt('');
      // You would replace the following line with an actual API call to get the response
      console.log('Submitted prompt:', prompt);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Custom Prompt</h3>
      
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleChange}
          placeholder="Enter your prompt here..."
          rows="1" // Start with one line
          style={{
            width: '100%',
            maxHeight: `${calculateMaxHeight()}px`, // Set max height for 5 lines
            minHeight: '40px', // Minimum height for the text area
            padding: '10px',
            paddingRight: '50px', // Space for the icon
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px',
            resize: 'none',
            overflowY: 'auto', // Always show vertical scrollbar if content overflows
            overflowX: 'hidden' // Hide horizontal scrollbar
          }}
        />
        <span
          className="material-symbols-outlined"
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#20609c'
          }}
        >
          send
        </span>
      </div>

      <div style={{ marginTop: '30px' }}>
        {responses.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '15px' }}>Responses:</h4>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              {responses.map((response, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '10px',
                    marginBottom: '10px',
                    fontSize: '16px',
                    wordWrap: 'break-word', // Ensure text wraps within the container
                    maxWidth: '100%' // Ensure the item does not exceed the container width
                  }}
                >
                  {response}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPrompt;
