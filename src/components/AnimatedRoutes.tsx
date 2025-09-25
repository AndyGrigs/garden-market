import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense } from "react";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminGuard from "./AdminGuard";
import AdminPanel from "../pages/AdminPanel";
import VerifyEmail from "../pages/VerifyEmail";
import ContactPage from '../pages/ContactPage';
import ReviewPage from "../pages/ReviewPage";
import ResetPassword from "../pages/ResetPassword";
import Layout from "./Layout/Layout";
import About from '../pages/About';
import TermsAndConditions from '../pages/TermsAndConditions';
import SellerGuard from './Seller/SellerGuard';
import SellerDashboard from './Seller/SellerDasboard';
import { MainContent } from "./Layout/MainContent";


const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;