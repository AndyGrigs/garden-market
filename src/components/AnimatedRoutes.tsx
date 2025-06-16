import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { MainContent } from "../App";
import AdminGuard from "./AdminGuard";
import AdminPanel from "../pages/AdminPanel";
import VerifyEmail from "../pages/VerifyEmail";
import ContactPage from '../pages/ContactPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/verify-email" element={<VerifyEmail />} /> 
        <Route path="/contact" element={<ContactPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<MainContent />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          }
        />
      </Routes>
        
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
