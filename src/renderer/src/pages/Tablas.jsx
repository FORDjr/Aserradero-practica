import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import DragAndDrop from "../components/DragAndDrop";
import ChartGrafic from "../components/Chart"
import '../styles/Tablas.css'

const Tablas = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="mainTablas">

      <div className="parent">
        <div className="upLeftGrid">
          <button onClick={handleBackToHome}> Volver a la página principal </button>

          <DragAndDrop />

        </div>

        <div className="downLeftGrid">
          <DataTable />

        </div>

        <div className="GraficOne">
        <ChartGrafic />

        </div>

        <div className="GraficTwo">
        <ChartGrafic />


        </div>

        <div className="GraficThree">
        <ChartGrafic />

        </div>


      </div>
    </div>


  );
};

export default Tablas;
