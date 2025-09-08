import React from 'react';

const PromptForm = ({ 
  prompt, 
  setPrompt, 
  isLoading, 
  handleGenerateImage, 
  buttonText = 'Generate Image', 
  placeholderText = "Describe the image you want to generate..." 
}) => {
  return (
    <div className="input-group">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholderText}
        className="prompt-input"
        rows="3"
      />
      <button 
        onClick={handleGenerateImage} 
        disabled={isLoading}
        className="generate-button"
      >
        {isLoading ? 'Generating...' : buttonText}
      </button>
    </div>
  );
};

export default PromptForm;