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
import homeBackground from "./assets/background.jpg";
import logo from "./assets/logo.png";

function Home() {
  const { user } = useAuth();

  return (
    <main
      className="relative isolate flex min-h-[calc(100vh-113px)] items-center justify-center overflow-hidden bg-cover bg-center px-4 py-12 text-center"
      style={{
        backgroundImage: `linear-gradient(125deg, rgba(239, 246, 255, 0.88), rgba(255, 255, 255, 0.72)), url(${homeBackground})`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <section className="relative w-full max-w-4xl rounded-3xl border border-white/70 bg-white/75 px-6 py-12 shadow-2xl shadow-slate-900/10 backdrop-blur-md sm:px-12 sm:py-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Find. List. Connect.
        </p>
        <img
          src={logo}
          alt="BoardingHub"
          className="mx-auto w-56 max-w-full rounded-xl shadow-md ring-1 ring-black/5 sm:w-72"
        />
        {user ? (
          <div className="mt-4">
            <p className="text-lg font-semibold text-slate-800">Welcome, {user.name}</p>
            <p className="mt-1 text-sm capitalize text-slate-500">{user.role} dashboard</p>
          </div>
        ) : (
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Find a boarding place or manage rental listings. Your next home is
            closer than you think.
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/properties"
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Find Properties
          </Link>

          {user?.role === "seeker" && (
            <Link
              to="/my-inquiries"
              className="rounded-xl border border-blue-700/30 bg-white/70 px-5 py-3 font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
            >
              My Inquiries
            </Link>
          )}
          {user?.role === "landlord" && (
            <>
              <Link
                to="/landlord/dashboard"
                className="rounded-xl border border-blue-700/30 bg-white/70 px-5 py-3 font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Landlord Dashboard
              </Link>
              <Link
                to="/landlord/inquiries"
                className="rounded-xl border border-blue-700/30 bg-white/70 px-5 py-3 font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Received Inquiries
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="rounded-xl border border-blue-700/30 bg-white/70 px-5 py-3 font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/reports"
                className="rounded-xl border border-blue-700/30 bg-white/70 px-5 py-3 font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Property Reports
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
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