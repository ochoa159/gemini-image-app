import React from 'react';

const ApiKeyForm = ({ apiKey, setApiKey, onSubmit, error }) => {
  return (
    <div className="api-key-container">
      <h2>Enter your Gemini API Key</h2>
      <p>Your API key is required to generate images but is never stored on our servers.</p>
      <div className="input-group">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="api-key-input"
        />
        <button onClick={onSubmit} className="submit-api-key">
          Submit
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ApiKeyForm;