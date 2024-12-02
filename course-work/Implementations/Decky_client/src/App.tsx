import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import Decks from "./pages/Decks";
import AdminRoute from "./context/AdminRoute";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/Admin";

const App = () => (
    <AuthProvider>
        <Router>
            {/* Navbar is available across all pages */}
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Route */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/decks"
                    element={
                        <ProtectedRoute>
                            <Decks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
