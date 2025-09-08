import React, { useState } from 'react';
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
  const [photoshootImages, setPhotoshootImages] = useState([]);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);
  const [modelName, setModelName] = useState("Carl");
  const [activeTab, setActiveTab] = useState('model');
  const [regenerationPrompt, setRegenerationPrompt] = useState("");
  const [numPhotos, setNumPhotos] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [propsImage, setPropsImage] = useState(null);
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const handleModelPromptChange = (newPrompt) => {
    setModelPrompt(newPrompt);
  };

  const handleStudioPromptChange = (newPrompt) => {
    setStudioPrompt(newPrompt);
  };

  const handleModelNameChange = (name) => {
    setModelName(name);
  };

  const handleNumPhotosChange = (num) => {
    setNumPhotos(num);
  };

  const handlePropsImageChange = (imageData) => {
    setPropsImage(imageData);
  };

  const handleRegenerateSingleImage = async (index) => {
    if (index === null) return;

    setRegeneratingIndex(index);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const baseImage = previewImage;
      const baseImageData = baseImage.split(',')[1];
      const baseMimeType = baseImage.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

      // Combine the original session prompt with the new specific instruction
      const variedPrompt = `${regenerationPrompt}, ${additionalPrompt}.`;

      const requestContents = [
        { inlineData: { data: baseImageData, mimeType: baseMimeType } },
        { text: variedPrompt }
      ];

      if (propsImage) {
        const propsImageData = propsImage.split(',')[1];
        const propsMimeType = propsImage.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
        requestContents.splice(1, 0, { 
          inlineData: { data: propsImageData, mimeType: propsMimeType } 
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: requestContents,
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          const updatedImages = [...photoshootImages];
          updatedImages[index] = newImageUrl;
          setPhotoshootImages(updatedImages);
          break;
        }
      }
    } catch (err) {
      setError(`Failed to regenerate image: ${err.message}`);
      console.error(err);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleGenerateModel = async () => {
    if (!modelPrompt.trim()) {
      setError("Please define the model specifications first.");
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewImage(null);
    setPhotoshootImages([]);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: modelPrompt,
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${imageData}`;
          setPreviewImage(imageUrl);
          break;
        }
      }
    } catch (err) {
      setError(`Failed to generate model: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePhotoshoot = async (promptOverride = null) => {
    const baseImage = previewImage;
    if (!baseImage) {
      setError("Please generate a model from the 'Model' tab first.");
      return;
    }

    const promptText = promptOverride !== null ? promptOverride : `${modelPrompt}, ${studioPrompt}`;
    const combinedPrompt = String(promptText);

    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPhotoshootImages([]);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const imageUrls = []; // Start with an empty array
      const baseImageData = baseImage.split(',')[1];
      const baseMimeType = baseImage.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';

      if (numPhotos > 0) {
        const generationPromises = [];
        const poses = ["in a different pose", "smiling", "looking away from the camera", "with hands in pockets", "leaning against something", "sitting down", "walking", "laughing"];

        // Generate `numPhotos` new images
        for (let i = 0; i < numPhotos; i++) {
          const randomPose = poses[Math.floor(Math.random() * poses.length)];
          const variedPrompt = `${combinedPrompt}, ${randomPose}.`;

          const subsequentRequestContents = [
            { inlineData: { data: baseImageData, mimeType: baseMimeType } },
            { text: variedPrompt }
          ];

          // Add props image to the request if it exists
          if (propsImage) {
            const propsImageData = propsImage.split(',')[1];
            const propsMimeType = propsImage.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
            subsequentRequestContents.splice(1, 0, { 
              inlineData: { data: propsImageData, mimeType: propsMimeType } 
            });
          }

          generationPromises.push(ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents: subsequentRequestContents,
          }));
        }

        const subsequentResponses = await Promise.all(generationPromises);

        for (const response of subsequentResponses) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const imageData = part.inlineData.data;
              const imageUrl = `data:image/png;base64,${imageData}`;
              imageUrls.push(imageUrl);
              break;
            }
          }
        }
      }
      
      setPhotoshootImages(imageUrls);
      setRegenerationPrompt(combinedPrompt);

    } catch (err) {
      setError(`Failed to generate photoshoot: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = (imageUrl) => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-generated-image-${Date.now()}.png`;
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
                  <ModelForm 
                    onPromptChange={handleModelPromptChange} 
                    onNameChange={handleModelNameChange}
                    onGenerate={handleGenerateModel}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'studio' && (
                  <>
                    <StudioSessionForm 
                      onPromptChange={handleStudioPromptChange} 
                      onGenerate={() => handleGeneratePhotoshoot()}
                      isLoading={isLoading}
                      onNumPhotosChange={handleNumPhotosChange}
                      onPropsImageChange={handlePropsImageChange}
                    />
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
                <h2 className="panel-title">{previewImage || photoshootImages.length > 0 ? `Model: ${modelName}` : 'Generated Model'}</h2>
                {error && <div className="error-message">{error}</div>}

                {isLoading && (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Generating your image(s)... This may take a moment.</p>
                  </div>
                )}

                {!isLoading && (previewImage || photoshootImages.length > 0) && (
                  <>
                    {previewImage && (
                      <div className="image-result">
                        <h3>Model Preview</h3>
                        <div className="image-container">
                          <img src={previewImage} alt="Generated Model Preview" />
                        </div>
                        {photoshootImages.length === 0 && (
                          <p style={{textAlign: 'center', marginTop: '1rem'}}>Happy with the model? Proceed to the 'Photoshoot' tab.</p>
                        )}
                      </div>
                    )}

                    {photoshootImages.length > 0 && (
                      <div className="photoshoot-result">
                        <h3>Photoshoot Session</h3>
                        <div className="image-gallery">
                          {photoshootImages.map((image, index) => (
                            <div key={index} className="image-container-small">
                              {regeneratingIndex === index && (
                                <div className="image-spinner-overlay">
                                  <div className="spinner-small"></div>
                                </div>
                              )}
                              <img src={image} alt={`Generated by Gemini AI ${index + 1}`} />
                              <div className="image-actions">
                                <button onClick={() => handleSaveImage(image)} className="download-button-single">
                                  Download
                                </button>
                                <button onClick={() => handleRegenerateSingleImage(index)} className="regenerate-button-single" disabled={isLoading || regeneratingIndex !== null}>
                                  Regenerate
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="regeneration-controls">
                          <PromptForm
                            prompt={additionalPrompt}
                            setPrompt={setAdditionalPrompt}
                            isLoading={isLoading}
                            showButton={false}
                            placeholderText="Add details to regenerate an image (e.g., 'wearing a hat')..."
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!isLoading && !previewImage && photoshootImages.length === 0 && !error && (
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
                setPreviewImage(null);
                setPhotoshootImages([]);
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