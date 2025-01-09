import { useNavigate } from "react-router-dom"; 
import DataTable from "./DataTable";

const Tablas = () => {
  const navigate = useNavigate(); 

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Tablas</h1>
      <p>Contenido de la página Tablas.</p>

      <button onClick={handleBackToHome}> Volver a la página principal </button>
      <DataTable />
    </div>
  );
};

export default Tablas;
