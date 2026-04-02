import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DetectResult from "../pages/DetectResult";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detect-result" element={<DetectResult />} />
    </Routes>
  );
}

export default AppRouter;