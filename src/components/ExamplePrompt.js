import React from 'react';

const ExamplePrompts = ({ setPrompt }) => {
  const examples = [
    "A futuristic cityscape at sunset with flying cars",
    "A cute robot watering plants in a garden",
    "A magical forest with glowing mushrooms",
    "A cat wearing a spacesuit on the moon"
  ];

  return (
    <div className="example-prompts">
      <p>Try these examples:</p>
      <div className="example-buttons">
        {examples.map((example) => (
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
  );
};

export default ExamplePrompts;