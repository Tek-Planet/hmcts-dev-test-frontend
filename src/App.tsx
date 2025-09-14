import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

const AppRoutes = () => {
  const { user, token } = useAuth();
 
  return (
    <Routes>
      <Route path="/" element={user || token ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/login" element={user || token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user || token ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={user || token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={user || token ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <Toaster />
  </AuthProvider>
);

export default App;
