import React, { useState } from "react";
import "../styles/DragAndDrop.css"; // Asegúrate de incluir estilos si es necesario

const DragAndDrop = ({ onFileRead }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    readFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    readFile(file);
  };

  const readFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onFileRead) {
          onFileRead(e.target.result); // Pasar el contenido del archivo al padre
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className={`cargar ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <form className="file-upload-form">
        <label className="file-upload-label" htmlFor="file">
          <div className="file-upload-design">
            <svg height="1em" viewBox="0 0 640 512">
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
            </svg>
            <p>Arrastra tu tarjeta SD aqui</p>
            <p>o</p>
            <span className="browse-button">Buscar archivo</span>
          </div>
          <input type="file" id="file" onChange={handleFileChange} />
        </label>
      </form>
    </div>
  );
};

export default DragAndDrop;
