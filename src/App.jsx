import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FeedbackForm from "./pages/user/FeedbackForm";
import MyFeedback from "./pages/user/MyFeedback";
import Dashboard from "./pages/admin/Dashboard";
import FeedbackDetail from "./pages/admin/FeedbackDetail";
import Analytics from "./pages/admin/Analytics";

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/feedback"} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Module */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/my-feedback" element={<MyFeedback />} />
        </Route>

        {/* Admin Module */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/feedback/:id" element={<FeedbackDetail />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
