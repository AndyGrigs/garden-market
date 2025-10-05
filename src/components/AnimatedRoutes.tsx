import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

import SellerGuard from './Seller/SellerGuard';
import AdminGuard from './Admin/AdminGuard';

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const ReviewPage = lazy(() => import("../pages/ReviewPage"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Layout = lazy(() => import("./Layout/Layout"));
const About = lazy(() => import("../pages/About"));
const TermsAndConditions = lazy(() => import("../pages/TermsAndConditions"));
const SellerDashboard = lazy(() => import("./Seller/SellerDasboard"));
const MainContent = lazy(() => import("./Layout/MainContent").then(module => ({ default: module.MainContent })));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader2 className="animate-spin mx-auto mt-10" />}>
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
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
