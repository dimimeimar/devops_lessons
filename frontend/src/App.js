import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import Doctors from './components/Doctors';
import AdminDashboard from './components/AdminDashboard';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const DashboardRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'ROLE_DOCTOR':
      return <Navigate to="/doctor_dashboard" />;
    case 'ROLE_PATIENT':
      return <Navigate to="/patient_dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route
              path="/patient_dashboard"
              element={
                <PrivateRoute allowedRoles={['ROLE_PATIENT']}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor_dashboard"
              element={
                <PrivateRoute allowedRoles={['ROLE_DOCTOR']}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin_dashboard"
              element={
                <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;