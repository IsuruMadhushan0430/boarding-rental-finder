import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/landlord/Dashboard";
import AddProperty from "./pages/landlord/AddProperty";
import EditProperty from "./pages/landlord/EditProperty";
import PropertyListings from "./pages/public/PropertyListings";
import PropertyDetails from "./pages/public/PropertyDetails";
import MyInquiries from "./pages/MyInquiries";
import LandlordInquiries from "./pages/LandlordInquiries";
import AdminReports from "./pages/AdminReports";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProperties from "./pages/AdminProperties";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import SiteNavbar from "./components/SiteNavbar";
import { useAuth } from "./context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-700">BoardingHub</h1>
      {user ? (
        <div className="mt-4">
          <p className="text-lg font-semibold text-slate-800">Welcome, {user.name}</p>
          <p className="mt-1 text-sm text-slate-500 capitalize">{user.role} dashboard</p>
        </div>
      ) : (
        <p className="mt-3 text-slate-600">Find a boarding place or manage rental listings.</p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/properties" className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
          Find Properties
        </Link>

        {user?.role === "seeker" && (
          <Link to="/my-inquiries" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700">
            My Inquiries
          </Link>
        )}
        {user?.role === "landlord" && (
          <>
            <Link to="/landlord/dashboard" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700">
              Landlord Dashboard
            </Link>
            <Link to="/landlord/inquiries" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700">
              Received Inquiries
            </Link>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700">
              Admin Dashboard
            </Link>
            <Link to="/admin/reports" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700">
              Property Reports
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteNavbar />
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
        <Route path="/properties/:id" element={<PropertyDetails />} />

        <Route
          path="/my-inquiries"
          element={
            <ProtectedRoute allowedRoles={["seeker"]}>
              <MyInquiries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord/inquiries"
          element={
            <ProtectedRoute allowedRoles={["landlord"]}>
              <LandlordInquiries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;