import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import DetectResult from "../pages/DetectResult";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import LoginSuccess from "../pages/LoginSuccess";
import FileDetect from "../pages/FileDetect";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detect-result" element={<DetectResult />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/file-detect" element={<FileDetect />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;