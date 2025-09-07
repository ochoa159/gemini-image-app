import React from 'react';

const PromptForm = ({ prompt, setPrompt, isLoading, handleGenerateImage }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate..."
        className="prompt-input"
        onKeyPress={(e) => e.key === 'Enter' && handleGenerateImage()}
      />
      <button 
        onClick={handleGenerateImage} 
        disabled={isLoading}
        className="generate-button"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
};

export default PromptForm;