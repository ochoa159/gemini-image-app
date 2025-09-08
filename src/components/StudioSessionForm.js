import React, { useState, useEffect } from 'react';
import './StudioSessionForm.css';

const StudioSessionForm = ({ onPromptChange, onGenerate, isLoading }) => {
  const [lighting, setLighting] = useState('Soft, diffused studio light');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0');
  const [clothingStyle, setClothingStyle] = useState('Casual (Jeans and t-shirt)');
  const [numPhotos, setNumPhotos] = useState(5);
  const [prioritizeProps, setPrioritizeProps] = useState(false);

  useEffect(() => {
    const prompt = `Studio photoshoot, ${lighting}, aspect ratio ${aspectRatio}, solid ${backgroundColor} background, wearing ${clothingStyle}. ${prioritizeProps ? 'Close up shot on props.' : ''}`;
    onPromptChange(prompt);
  }, [lighting, aspectRatio, backgroundColor, clothingStyle, prioritizeProps, onPromptChange]);

  const backgroundColors = [
    { name: 'White', value: '#f0f0f0' },
    { name: 'Beige', value: '#f5f5dc' },
    { name: 'Light Blue', value: '#add8e6' },
    { name: 'Light Green', value: '#90ee90' },
    { name: 'Light Pink', value: '#ffb6c1' },
  ];

  return (
    <div className="studio-session-form">
      <h2 className="panel-title">Studio Session</h2>
      <div className="form-grid-studio">
        <div className="form-group">
          <label>Lighting Type</label>
          <select value={lighting} onChange={(e) => setLighting(e.target.value)}>
            <option>Soft, diffused studio light</option>
            <option>Natural light</option>
            <option>Dramatic light</option>
          </select>
        </div>
        <div className="form-group">
          <label>Aspect Ratio</label>
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
            <option>3:4</option>
            <option>1:1</option>
            <option>16:9</option>
            <option>4:3</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Background Color</label>
          <div className="color-swatches">
            {backgroundColors.map(color => (
              <button
                key={color.name}
                className={`color-swatch ${backgroundColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setBackgroundColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
        <div className="form-group full-width">
          <label>Outfit Style</label>
          <select value={clothingStyle} onChange={(e) => setClothingStyle(e.target.value)}>
            <option>Casual (Jeans and t-shirt)</option>
            <option>Formal (Suit)</option>
            <option>Sporty</option>
          </select>
        </div>
        <div className="form-group full-width file-input-group">
            <label>Or Upload Outfit (Image)</label>
            <div className="file-input-container">
                <button className="file-select-btn">Select file</button>
                <span>No file selected</span>
            </div>
        </div>
        <div className="form-group full-width file-input-group">
            <label>Upload Props/Products (Optional)</label>
            <div className="file-input-container">
                <button className="file-select-btn">Choose files</button>
                <span>No files selected</span>
            </div>
        </div>
        <div className="form-group full-width checkbox-group">
            <input type="checkbox" id="prioritize-props" checked={prioritizeProps} onChange={(e) => setPrioritizeProps(e.target.checked)} />
            <label htmlFor="prioritize-props">
                Prioritize Props (for jewelry, watches, etc.)
                <span>Enable this to generate close-ups and detail shots of small products.</span>
            </label>
        </div>
        <div className="form-group full-width">
            <label>Number of Photos to Generate</label>
            <div className="photo-count-buttons">
                {[1, 3, 5].map(num => (
                    <button key={num} className={numPhotos === num ? 'selected' : ''} onClick={() => setNumPhotos(num)}>{num}</button>
                ))}
            </div>
        </div>
      </div>
      <button onClick={onGenerate} disabled={isLoading} className="generate-button">
        {isLoading ? <><div className="spinner"></div><span>Generating...</span></> : 'Start Photoshoot'}
      </button>
    </div>
  );
};

export default StudioSessionForm;
