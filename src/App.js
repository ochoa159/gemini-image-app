import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import ModelForm from './components/ModelForm';
import StudioSessionForm from './components/StudioSessionForm';
import PromptForm from './components/PromptForm';
import './App.css';
import './components/ModelForm.css';
import './components/StudioSessionForm.css';

function App() {
  const [modelPrompt, setModelPrompt] = useState("");
  const [studioPrompt, setStudioPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useUploadedImage, setUseUploadedImage] = useState(false);
  const fileInputRef = useRef(null);
  const [modelName, setModelName] = useState("Carl");
  const [activeTab, setActiveTab] = useState('model');
  const [regenerationPrompt, setRegenerationPrompt] = useState("");

  const handleModelPromptChange = (newPrompt) => {
    setModelPrompt(newPrompt);
  };

  const handleStudioPromptChange = (newPrompt) => {
    setStudioPrompt(newPrompt);
  };

  const handleModelNameChange = (name) => {
    setModelName(name);
  };

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

  const handleGenerateImage = async (promptOverride = null) => {
    const promptText = promptOverride !== null ? promptOverride : `${modelPrompt}, ${studioPrompt}`;
    const combinedPrompt = String(promptText); // Ensure it's a string

    if (!combinedPrompt.trim() && !useUploadedImage) {
      setError("Please enter a prompt or upload an image");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError(null);
    // Don't clear the generated image if it exists, so it can be used as a reference
    // setGeneratedImage(null); 

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      let requestContents;
      
      // If we have a generated image, use it as the base for the studio session
      const imageToUse = uploadedImage;
      const useReference = (useUploadedImage && uploadedImage);

      if (useReference && imageToUse) {
        // Convert data URL to base64
        const base64Data = imageToUse.split(',')[1];
        
        requestContents = [
          { 
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          },
          { text: combinedPrompt || "Create an image based on this reference" }
        ];
      } else {
        requestContents = combinedPrompt;
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
          setRegenerationPrompt(combinedPrompt);
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
      <div className="container">
        <header className="app-header">
          <div className="header-title">
            <h1>AI Influencer V.1.1</h1>
          </div>
          <p>Visualize your model or proceed to a photoshoot.</p>
        </header>

        <main>
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
            <div className="app-main">
              <div className="config-panel">
                <div className="tabs">
                  <button
                    className={`tab-button ${activeTab === 'model' ? 'active' : ''}`}
                    onClick={() => setActiveTab('model')}
                  >
                    Model
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'studio' ? 'active' : ''}`}
                    onClick={() => setActiveTab('studio')}
                  >
                    Photoshoot
                  </button>
                </div>

                {activeTab === 'model' && (
                  <ModelForm onPromptChange={handleModelPromptChange} onNameChange={handleModelNameChange} />
                )}

                {activeTab === 'studio' && (
                  <>
                    <StudioSessionForm 
                      onPromptChange={handleStudioPromptChange} 
                      onGenerate={() => handleGenerateImage()}
                      isLoading={isLoading}
                    />
                    
                    <div className="image-upload-section">
                      <div className="upload-header">
                        <h3>Or upload a reference image</h3>
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
                              ? "If you upload an image, you can modify its hair and clothing style. A complete profile will be generated from your image." 
                              : "Image will be ignored"}
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
                            <div className="upload-icon"></div>
                            <p>Select file</p>
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* This is the prompt generated by the form, hidden for the user but useful for debugging */}
                <textarea
                  value={`${modelPrompt}, ${studioPrompt}`}
                  readOnly
                  style={{ display: 'none' }}
                />
              </div>

              <div className="result-panel">
                <h2 className="panel-title">{generatedImage ? `Model: ${modelName}` : 'Generated Model'}</h2>
                {error && <div className="error-message">{error}</div>}

                {isLoading && (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Generating your image... This may take a moment.</p>
                  </div>
                )}

                {generatedImage && !isLoading && (
                  <div className="image-result">
                    <div className="image-container">
                      <img src={generatedImage} alt="Generated by Gemini AI" />
                    </div>
                    <div className="regeneration-controls">
                      <PromptForm
                        prompt={regenerationPrompt}
                        setPrompt={setRegenerationPrompt}
                        isLoading={isLoading}
                        handleGenerateImage={() => handleGenerateImage(regenerationPrompt)}
                        buttonText="Regenerate"
                        placeholderText="Edit prompt to regenerate..."
                      />
                      <button onClick={handleSaveImage} className="download-button">
                        Download Image
                      </button>
                    </div>
                  </div>
                )}

                {!isLoading && !generatedImage && !error && (
                   <div className="loading">
                    <p>Your generated image will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>
            Developed with the Gemini API
            <button 
              onClick={() => {
                setShowApiInput(true);
                setGeneratedImage(null); // Reset to go back to model creation
              }} 
              className="change-api-key"
            >
              Change API Key
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;