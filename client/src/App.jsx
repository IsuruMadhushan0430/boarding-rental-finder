import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/landlord/Dashboard";
import AddProperty from "./pages/landlord/AddProperty";
import EditProperty from "./pages/landlord/EditProperty";
import PropertyListings from "./pages/public/PropertyListings";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">

      <h1 className="text-4xl font-bold text-blue-700">
        BoardingHub
      </h1>

      {user ? (
        <>
          <p className="mt-4">
            Welcome, {user.name}
          </p>

          <p className="text-gray-500">
            Role: {user.role}
          </p>

          <button
            onClick={logout}
            className="mt-5 bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="mt-6 flex gap-4">
          <a href="/login" className="text-blue-700">
            Login
          </a>

          <a href="/register" className="text-blue-700">
            Register
          </a>
        </div>
      )}

      <Link to="/properties" className="text-gray-700 hover:text-blue-600" >
        Find Boarding
      </Link>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/landlord/dashboard"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord/add-property"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord/edit-property/:id"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <EditProperty />
            </ProtectedRoute>
          }
        />

        <Route path="/properties" element={<PropertyListings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;