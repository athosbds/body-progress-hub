import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreateWorkout from "./pages/CreateWorkout";

import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 pb-20">

          <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PRIVADAS */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            <Route
              path="/feed"
              element={
                <RequireAuth>
                  <Feed />
                </RequireAuth>
              }
            />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />

            <Route
              path="/create-workout"
              element={
                <RequireAuth>
                  <CreateWorkout />
                </RequireAuth>
              }
            />
          </Routes>

          <AuthNavbar />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AuthNavbar() {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
}
