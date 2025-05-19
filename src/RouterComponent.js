import React, { useContext, useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import RegisterPage from './pages/RegisterPage/RegisterPage.js';
import ProfilePage from './pages/ProfilePage/ProfilePage.js';
import AddRelicPage from './pages/AddRelicPage.js';
import UpdateRelicPage from './pages/UpdateRelicPage.js';
import MainLayout from './pages/MainLayout/MainLayout.js';
import MainReliquaryPage from './pages/MainReliquaryPage/MainReliquaryPage.js';

const ResetPassword = () => <div>Reset Password (TBD)</div>;
const ForgotPassword = () => <div>Forgot Password (TBD)</div>;
const EmailConfirmation = () => <div>Email Confirmation (TBD)</div>;

export default function RouterComponent() {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!loading && user) {
      setUserRole(user.role || 'user');
    } else {
      setUserRole('');
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const isAuthenticated = !!user;
  const isAdmin = userRole === 'admin';

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/email-confirmation" element={<EmailConfirmation />} />
      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/reliquary"
        element={isAuthenticated ? <MainReliquaryPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/relic/add"
        element={isAuthenticated ? <AddRelicPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/relic/update/:relicId"
        element={isAuthenticated ? <UpdateRelicPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={
          isAuthenticated && isAdmin ? (
            <div>Admin Dashboard (TBD)</div>
          ) : (
            <Navigate to={isAuthenticated ? '/profile' : '/login'} />
          )
        }
      />
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}