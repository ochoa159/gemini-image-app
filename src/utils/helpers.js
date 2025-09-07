export const downloadImage = (imageDataUrl, filename = 'gemini-generated-image.png') => {
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};