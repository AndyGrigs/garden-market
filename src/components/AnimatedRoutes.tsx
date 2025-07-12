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
import ReviewPage from "../pages/ReviewPage";
import ResetPassword from "../pages/ResetPassword";
import Layout from "./Layout";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainContent />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="admin"
            element={
              <AdminGuard>
                <AdminPanel />
              </AdminGuard>
            }
          />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;