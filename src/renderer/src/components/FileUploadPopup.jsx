// FileUploadPopup.jsx
import React from 'react';
import '../styles/FileUploadPopup.css';

const FileUploadPopup = ({ onClose, onFileRead }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // Separar en líneas no vacías
      const lines = content.split('\n').filter((line) => line.trim());

      // Parsear cada línea
      const data = lines
        .map((line) => {
          const [rawDate, rawTime, rawCurrent] = line.trim().split(/\s+/);
          if (!rawDate || !rawTime || !rawCurrent) return null;

          return {
            dia: rawDate,
            hora: rawTime,
            corriente: parseFloat(rawCurrent),
          };
        })
        .filter(Boolean);

      console.log('[FileUploadPopup] Datos parseados:', data);
      onFileRead(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Cargar archivo</h2>
        <input type="file" className="file-input" onChange={handleFileChange} />
        <button className="close-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default FileUploadPopup;
