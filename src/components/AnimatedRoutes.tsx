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
import About from '../pages/About';
import TermsAndConditions from './TermsAndConditions';
import SellerGuard from './SellerGuard';
import SellerDashboard from './SellerDasboard';

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
          <Route
            path="seller"
            element={
              <SellerGuard>
                <SellerDashboard />
              </SellerGuard>
            }
          />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About/>} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;