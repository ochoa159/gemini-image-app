import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import './App.css';

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useUploadedImage, setUseUploadedImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setUseUploadedImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUseUploadedImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim() && !useUploadedImage) {
      setError("Please enter a prompt or upload an image");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      let requestContents = prompt;
      
      // If using uploaded image, include it in the request
      if (useUploadedImage && uploadedImage) {
        // Convert data URL to base64
        const base64Data = uploadedImage.split(',')[1];
        
        requestContents = [
          { 
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          },
          { text: prompt || "Create an image based on this reference" }
        ];
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: requestContents,
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${imageData}`;
          setGeneratedImage(imageUrl);
          break;
        }
      }
    } catch (err) {
      setError(`Failed to generate image: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'gemini-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiInput(false);
      setError(null);
    } else {
      setError("Please enter a valid API key");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gemini AI Image Generator</h1>
        <p>Transform your imagination into visuals with AI</p>
      </header>

      <main className="app-main">
        {showApiInput ? (
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
              <button onClick={handleApiKeySubmit} className="submit-api-key">
                Submit
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="input-section">
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
              
              <div className="image-upload-section">
                <div className="upload-header">
                  <h3>Upload Reference Image (Optional)</h3>
                  {uploadedImage && (
                    <label className="toggle-upload">
                      <input
                        type="checkbox"
                        checked={useUploadedImage}
                        onChange={(e) => setUseUploadedImage(e.target.checked)}
                      />
                      Use this image
                    </label>
                  )}
                </div>
                
                {uploadedImage ? (
                  <div className="uploaded-image-container">
                    <div className="image-preview">
                      <img src={uploadedImage} alt="Uploaded reference" />
                      <button 
                        className="remove-image-btn"
                        onClick={removeUploadedImage}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <p className="image-note">
                      {useUploadedImage 
                        ? "Image will be used as reference for generation" 
                        : "Image will be ignored during generation"}
                    </p>
                  </div>
                ) : (
                  <div className="upload-area">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      id="image-upload"
                      className="file-input"
                    />
                    <label htmlFor="image-upload" className="upload-label">
                      <div className="upload-icon">📁</div>
                      <p>Click to upload or drag and drop</p>
                      <p className="upload-subtext">JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="example-prompts">
                <p>Try these examples:</p>
                <div className="example-buttons">
                  {[
                    "A futuristic cityscape at sunset with flying cars",
                    "A cute robot watering plants in a garden",
                    "A magical forest with glowing mushrooms",
                    "A cat wearing a spacesuit on the moon"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example)}
                      className="example-button"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="result-section">
              {isLoading && (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Generating your image... This may take a moment.</p>
                </div>
              )}

              {generatedImage && (
                <div className="image-result">
                  <h2>Generated Image</h2>
                  <div className="image-container">
                    <img src={generatedImage} alt="Generated by Gemini AI" />
                  </div>
                  <button onClick={handleSaveImage} className="download-button">
                    Download Image
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by Gemini AI. Your API key is used only for the current session.
          <button 
            onClick={() => setShowApiInput(true)} 
            className="change-api-key"
          >
            Change API Key
          </button>
        </p>
      </footer>
    </div>
  );
}

export default App;