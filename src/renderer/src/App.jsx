import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Jornadas from "./pages/Jornadas";
import Tablas from "./pages/Tablas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Jornadas />} />
        <Route path="/Tablas" element={<Tablas />} />
      </Routes>
    </Router>
  );
}

export default App;
