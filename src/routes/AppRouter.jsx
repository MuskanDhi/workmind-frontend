import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import EmployeeLayout from '../components/layout/EmployeeLayout';
import RecruiterLayout from '../components/layout/RecruiterLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import RegisterAdmin from '../pages/auth/RegisterAdmin';
import RegisterEmployee from '../pages/auth/RegisterEmployee';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CreateSurvey from '../pages/admin/CreateSurvey';
import SurveyList from '../pages/admin/SurveyList';
import SurveyDetail from '../pages/admin/SurveyDetail';
import CompanySettings from '../pages/admin/CompanySettings';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import SurveyAnswer from '../pages/employee/SurveyAnswer';
import MyResponses from '../pages/employee/MyResponses';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import RecruiterSurveys from '../pages/recruiter/RecruiterSurveys';
import RecruiterEmployees from '../pages/recruiter/RecruiterEmployees';

// ── Private Route Guard ────────────────────────────────────────
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'employee') return <Navigate to="/employee/dashboard" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ── App Router ─────────────────────────────────────────────────
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/admin" element={<RegisterAdmin />} />
      <Route path="/register/employee" element={<RegisterEmployee role="employee" />} />
      <Route path="/register/recruiter" element={<RegisterEmployee role="recruiter" />} />

      {/* Admin Routes (protected — requires companyKey to be set) */}
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="surveys" element={<SurveyList />} />
        <Route path="surveys/create" element={<CreateSurvey />} />
        <Route path="surveys/:id" element={<SurveyDetail />} />
        <Route path="settings" element={<CompanySettings />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={<PrivateRoute allowedRoles={['employee']}><EmployeeLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="surveys/:id/answer" element={<SurveyAnswer />} />
        <Route path="responses" element={<MyResponses />} />
        <Route path="profile" element={<CompanySettings />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<PrivateRoute allowedRoles={['recruiter', 'admin']}><RecruiterLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="surveys" element={<RecruiterSurveys />} />
        <Route path="employees" element={<RecruiterEmployees />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
