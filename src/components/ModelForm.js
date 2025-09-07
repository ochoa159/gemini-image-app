import React, { useState, useRef } from 'react';
import './ModelForm.css';

function ModelForm({ setGeneratedPrompt, setCurrentView }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Hombre',
    ethnicity: 'Oriente Medio',
    bodyType: 'Atlético',
    age: 'Adolescente (18-19)',
    eyeColor: 'Verde',
    hairColor: 'Castaño',
    hairStyle: 'Corte militar',
    clothingStyle: 'Casual (jeans y camisetas)',
    clothingColor: 'Negro'
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePromptFromForm = () => {
    let prompt = "Create a professional photo of ";
    
    if (formData.name) {
      prompt += `${formData.name}, `;
    }
    
    prompt += `a ${formData.age.toLowerCase()} ${formData.ethnicity.toLowerCase()} ${formData.gender.toLowerCase()} `;
    prompt += `with ${formData.bodyType.toLowerCase()} body type, `;
    prompt += `${formData.eyeColor.toLowerCase()} eyes, `;
    prompt += `${formData.hairColor.toLowerCase()} hair in a ${formData.hairStyle.toLowerCase()} style. `;
    
    prompt += `Dressed in ${formData.clothingColor.toLowerCase()} ${formData.clothingStyle.toLowerCase()}. `;
    prompt += "Professional photography, studio lighting, high quality, detailed, realistic.";
    
    return prompt;
  };

  const handleGenerate = () => {
    const prompt = generatePromptFromForm();
    setGeneratedPrompt(prompt);
    setCurrentView('imageGenerator');
  };

  return (
    <div className="model-form">
      <div className="form-header">
        <h2>AI Influencer</h2>
        <p>Visualiza tu modelo o procede a una sesión de fotos.</p>
      </div>

      <div className="form-section">
        <h3>Especificaciones del Modelo</h3>
        
        <div className="input-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nombre del modelo"
          />
        </div>

        <div className="image-upload-section">
          <h4>O subir imagen de referencia</h4>
          {uploadedImage ? (
            <div className="uploaded-image-container">
              <div className="image-preview">
                <img src={uploadedImage} alt="Uploaded reference" />
                <button 
                  className="remove-image-btn"
                  onClick={removeUploadedImage}
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="file-input"
              />
              <label className="upload-label">
                <div className="upload-icon">📁</div>
                <p>Seleccionar archivo</p>
              </label>
            </div>
          )}
          <p className="image-note">
            Si suben su imagen pueden modificar su estilo de pelo y ropa. Se generará un perfil completo a partir de su imagen.
          </p>
        </div>
      </div>

      <div className="form-section">
        <h3>Apariencia y Estilo</h3>
        
        <div className="form-grid">
          <div className="input-group">
            <label>Género</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>

          <div className="input-group">
            <label>Etnia</label>
            <select name="ethnicity" value={formData.ethnicity} onChange={handleInputChange}>
              <option value="Oriente Medio">Oriente Medio</option>
              <option value="Asiático">Asiático</option>
              <option value="Caucásico">Caucásico</option>
              <option value="Afro">Afro</option>
            </select>
          </div>

          <div className="input-group">
            <label>Tipo de Cuerpo</label>
            <select name="bodyType" value={formData.bodyType} onChange={handleInputChange}>
              <option value="Atlético">Atlético</option>
              <option value="Delgado">Delgado</option>
              <option value="Mediano">Mediano</option>
            </select>
          </div>

          <div className="input-group">
            <label>Edad</label>
            <select name="age" value={formData.age} onChange={handleInputChange}>
              <option value="Adolescente (18-19)">Adolescente (18-19)</option>
              <option value="Joven (20-29)">Joven (20-29)</option>
              <option value="Adulto (30-45)">Adulto (30-45)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Color de Ojos</label>
            <select name="eyeColor" value={formData.eyeColor} onChange={handleInputChange}>
              <option value="Verde">Verde</option>
              <option value="Azul">Azul</option>
              <option value="Café">Café</option>
            </select>
          </div>

          <div className="input-group">
            <label>Color de Pelo</label>
            <select name="hairColor" value={formData.hairColor} onChange={handleInputChange}>
              <option value="Castaño">Castaño</option>
              <option value="Negro">Negro</option>
              <option value="Rubio">Rubio</option>
            </select>
          </div>

          <div className="input-group">
            <label>Estilo de Pelo</label>
            <select name="hairStyle" value={formData.hairStyle} onChange={handleInputChange}>
              <option value="Corte militar">Corte militar</option>
              <option value="Largo">Largo</option>
              <option value="Mediano">Mediano</option>
            </select>
          </div>

          <div className="input-group">
            <label>Estilo de Vestimenta</label>
            <select name="clothingStyle" value={formData.clothingStyle} onChange={handleInputChange}>
              <option value="Casual (jeans y camisetas)">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Deportivo">Deportivo</option>
            </select>
          </div>

          <div className="input-group">
            <label>Color de Ropa</label>
            <select name="clothingColor" value={formData.clothingColor} onChange={handleInputChange}>
              <option value="Negro">Negro</option>
              <option value="Blanco">Blanco</option>
              <option value="Azul">Azul</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} className="generate-button">
        Generar Modelo
      </button>
    </div>
  );
}

export default ModelForm;