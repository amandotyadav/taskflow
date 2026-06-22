import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const ProtectedLayout = () => {
  const { bootstrapping, isAuthenticated } = useAuth();

  if (bootstrapping) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-4">
        <Loader label="Preparing your workspace" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <Navbar />
      <Outlet />
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { bootstrapping, isAuthenticated } = useAuth();

  if (bootstrapping) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-4">
        <Loader label="Checking session" />
      </main>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      }
    />
    <Route element={<ProtectedLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
