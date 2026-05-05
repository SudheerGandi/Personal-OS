/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OSProvider } from './hooks/useOS';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Focus from './pages/Focus';
import Roadmap from './pages/Roadmap';
import Skills from './pages/Skills';
import Reading from './pages/Reading';
import Podcasts from './pages/Podcasts';
import Information from './pages/Information';
import BusinessDecoder from './pages/BusinessDecoder';
import History from './pages/History';
import HistoryCurriculum from './pages/HistoryCurriculum';
import Strategy from './pages/Strategy';
import Review from './pages/Review';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading, isMaster } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0e0f12] flex items-center justify-center">
      <div className="text-[#e8622a] font-mono animate-pulse uppercase tracking-widest text-xs">Authenticating...</div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isMaster) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0e0f12] text-[#dde3ee] font-sans">
      <div className="flex h-screen overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/information" element={<Information />} />
            <Route path="/business-decoder" element={<BusinessDecoder />} />
            <Route path="/history" element={<History />} />
            <Route path="/history-curriculum" element={<HistoryCurriculum />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/review" element={<Review />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/users/:userId" element={<ProtectedRoute adminOnly><AdminUserDetail /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <OSProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </OSProvider>
      </AuthProvider>
    </Router>
  );
}
