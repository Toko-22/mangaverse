import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TitleDetail from "./pages/TitleDetail";
import EpisodeView from "./pages/EpisodeView";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Lobby from "./pages/Lobby";
import DMList from "./pages/DMList";
import DMThread from "./pages/DMThread";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-white">جاري التحميل...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/title/:id" element={<TitleDetail />} />
          <Route path="/title/:tid/episode/:eid" element={<PrivateRoute><EpisodeView /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
          <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><DMList /></PrivateRoute>} />
          <Route path="/messages/:uid" element={<PrivateRoute><DMThread /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
