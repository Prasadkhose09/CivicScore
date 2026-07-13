import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ScoreHistoryPage from './pages/citizen/ScoreHistoryPage';
import IncentivesPage from './pages/citizen/IncentivesPage';
import NotificationsPage from './pages/citizen/NotificationsPage';
import CommunityHub from './pages/citizen/CommunityHub';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CitizenManagement from './pages/admin/CitizenManagement';
import ViolationManagement from './pages/admin/ViolationManagement';
import AppealManagement from './pages/admin/AppealManagement';
import AuditLogsPage from './pages/admin/AuditLogsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Citizen Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="CITIZEN">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/score-history"
              element={
                <ProtectedRoute requiredRole="CITIZEN">
                  <ScoreHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incentives"
              element={
                <ProtectedRoute requiredRole="CITIZEN">
                  <IncentivesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requiredRole="CITIZEN">
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute requiredRole="CITIZEN">
                  <CommunityHub />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/citizens"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <CitizenManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/violations"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <ViolationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appeals"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AppealManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
