/**
 * App.jsx
 * 
 * Main Application Component
 * - Wraps entire app in <AuthProvider> for global state.
 * - Manages routing via React Router.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Book from './pages/Book';
import Services from './pages/Services';
import WhyUsPage from './pages/WhyUsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers'; // [NEW]
import AdminBookings from './pages/AdminBookings'; // [NEW]
import InteriorPainting from './pages/services/InteriorPainting';
import ExteriorPainting from './pages/services/ExteriorPainting';
import RentalPainting from './pages/services/RentalPainting';
import Waterproofing from './pages/services/Waterproofing';
import WoodFinishes from './pages/services/WoodFinishes';
import TexturePainting from './pages/services/TexturePainting';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';
import { AuthProvider } from './hooks/useAuth.jsx';
import useAuth from './hooks/useAuth.jsx';

// Helper component for Protected Routes
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Or a spinner
  if (!user) return <Login />; // Force login if not authenticated
  if (adminOnly && !user.isAdmin) return <div>Access Denied</div>;
  return children;
};

// Main App Structure
function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - No Global Layout */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        {/* Public/App Routes - Wrapped in Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />

              <Route path="/book" element={<Book />} />
              <Route path="/services" element={<Services />} />

              {/* Service Detail Routes */}
              <Route path="/services/Interior-Painting" element={<InteriorPainting />} />
              <Route path="/services/Exterior-Painting" element={<ExteriorPainting />} />
              <Route path="/services/Rental-Painting" element={<RentalPainting />} />
              <Route path="/services/Waterproofing" element={<Waterproofing />} />
              <Route path="/services/Wood-Finishes" element={<WoodFinishes />} />
              <Route path="/services/Texture-Painting" element={<TexturePainting />} />

              <Route path="/why-us" element={<WhyUsPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              {/* Protected Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
