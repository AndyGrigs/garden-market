import { AnimatePresence } from "@/utils/motionComponents";
import { Route, Routes, useLocation } from "react-router-dom";
import { lazy } from "react";

import SellerGuard from '@/features/seller/components/SellerGuard';
import AdminGuard from '../../pages/AdminPanel/AdminGuard';

const Dashboard = lazy(() => import("../../pages/BuyerDashboard/components/Dashboard"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const AdminPanel = lazy(() => import("../../pages/AdminPanel"));
const VerifyEmail = lazy(() => import("../../pages/VerifyEmail"));
const ContactPage = lazy(() => import("../../pages/ContactPage"));
const ReviewPage = lazy(() => import("../../pages/ReviewPage"));
const ResetPassword = lazy(() => import("../../pages/ResetPassword"));
const Layout = lazy(() => import("../Layout/Layout"));
const About = lazy(() => import("../../pages/AboutPage/").then(module => ({ default: module.About })));
const TermsAndConditions = lazy(() => import("../../pages/TermsAndConditions"));
const SellerDashboard = lazy(() => import("@/features/seller/components/SellerDashboard"));
const MainContent = lazy(() => import("../Layout/MainContent"));
const TreeDetailPage = lazy(() => import("../../pages/TreeDetailPage"));
const AdminTreeTranslate = lazy(() => import("../../pages/AdminPanel/AdminTreeTranslate"));
// const CheckoutPage = lazy(() => import("../../pages/CheckoutPage").then(module => ({ default: module.CheckoutPage })));
const OrderSuccessPage = lazy(() => import("../../pages/OrderSuccessPage").then(module => ({ default: module.OrderSuccessPage })));

function  AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainContent />} />
          <Route path="tree/:id" element={<TreeDetailPage />} />
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
            path="admin/trees/:id/translate"
            element={
              <AdminGuard>
                <AdminTreeTranslate />
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
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="terms" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
