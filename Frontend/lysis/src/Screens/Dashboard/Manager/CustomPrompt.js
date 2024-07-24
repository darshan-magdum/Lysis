import React, { useState, useRef, useEffect } from 'react';

const CustomPrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const textareaRef = useRef(null);

  // Calculate the height of 5 lines
  const getLineHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const style = window.getComputedStyle(textarea);
      return parseInt(style.lineHeight, 10);
    }
    return 24; // Default line height if unable to compute
  };

  const maxLines = 5;
  const maxHeight = getLineHeight() * maxLines; // Height for 5 lines

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to recalculate scrollHeight
      textarea.style.height = 'auto';
      // Set the height to scrollHeight but not exceed maxHeight
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
      // Apply overflow style conditionally
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
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
            maxHeight: `${maxHeight}px`, // Set max height for 5 lines
            minHeight: '40px', // Minimum height for the text area
            padding: '10px',
            paddingRight: '50px', // Space for the icon
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px',
            resize: 'none',
            overflowY: 'hidden', // Hide scrollbar initially
            transition: 'height 0.2s ease, overflowY 0.2s ease', // Smooth transition
          }}
        />
        <span
          className="material-symbols-outlined"
          onClick={handleSubmit}
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '20px',
            height:'29px',
            cursor: 'pointer',
            fontSize: '21px', // Adjust font size for the arrow
            color: 'rgb(255 255 255)',
            backgroundColor: 'rgb(32 96 156)',
            borderRadius: '50%', // Make the background circular
            padding: '4px', // Adjust padding to control the background size
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
