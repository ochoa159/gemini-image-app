import React, { useState, useEffect } from 'react';
import './ModelForm.css';

const ModelForm = ({ onPromptChange, onNameChange }) => {
  const [modelSpecs, setModelSpecs] = useState({
    name: 'Carl',
    gender: 'Man',
    ethnicity: 'Middle Eastern',
    bodyType: 'Athletic',
    age: 'Teenager (13-19)',
    eyeColor: 'Green',
    hairColor: 'Brown',
    hairStyle: 'Buzz cut',
    clothingStyle: 'Casual (Jeans and t-shirt)',
    clothingColor: 'Black',
  });

  useEffect(() => {
    const { name, gender, ethnicity, bodyType, age, eyeColor, hairColor, hairStyle, clothingStyle, clothingColor } = modelSpecs;
    const prompt = `photo of a ${gender.toLowerCase()} model named ${name}, ${ethnicity.toLowerCase()}, ${age.toLowerCase()}, with a ${bodyType.toLowerCase()} body, ${eyeColor.toLowerCase()} eyes, ${hairColor.toLowerCase()} ${hairStyle.toLowerCase()} hair, wearing ${clothingStyle.toLowerCase()} of ${clothingColor.toLowerCase()} color.`;
    onPromptChange(prompt);
    if (onNameChange) {
      onNameChange(name);
    }
  }, [modelSpecs, onPromptChange, onNameChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModelSpecs(prevSpecs => ({
      ...prevSpecs,
      [name]: value,
    }));
  };

  const formSections = {
    "Appearance and Style": [
      { name: 'gender', label: 'Gender', options: ['Man', 'Woman'] },
      { name: 'ethnicity', label: 'Ethnicity', options: ['Asian', 'Black', 'Caucasian', 'Hispanic/Latino', 'Indian', 'Middle Eastern', 'Native American'] },
      { name: 'bodyType', label: 'Body Type', options: ['Slim', 'Athletic', 'Average', 'Heavyset'] },
      { name: 'age', label: 'Age', options: ['Baby (0-2)', 'Child (3-12)', 'Teenager (13-19)', 'Young Adult (20-29)', 'Adult (30-59)', 'Senior (60+)'] },
      { name: 'eyeColor', label: 'Eye Color', options: ['Amber', 'Blue', 'Brown', 'Gray', 'Green', 'Hazel'] },
      { name: 'hairColor', label: 'Hair Color', options: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'] },
      { name: 'hairStyle', label: 'Hair Style', options: ['Long', 'Short', 'Curly', 'Straight', 'Wavy', 'Bald', 'Buzz cut'] },
      { name: 'clothingStyle', label: 'Clothing Style', options: ['Casual (Jeans and t-shirt)', 'Formal', 'Sporty', 'Streetwear', 'Bohemian'] },
      { name: 'clothingColor', label: 'Clothing Color', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown', 'Orange', 'Purple'] },
    ]
  };

  return (
    <div className="model-form">
      <h2 className="panel-title">Model Specifications</h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={modelSpecs.name} onChange={handleChange} />
        </div>
        {Object.entries(formSections).map(([sectionTitle, fields]) => (
          <React.Fragment key={sectionTitle}>
            <h3 className="section-title full-width">{sectionTitle}</h3>
            {fields.map(field => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <select id={field.name} name={field.name} value={modelSpecs[field.name]} onChange={handleChange}>
                  {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ModelForm;