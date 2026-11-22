import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const activeClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-700 text-white"
      : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
  }`;

function SiteNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <NavLink
          to="/"
          className="shrink-0 text-xl font-bold text-blue-700"
        >
          BoardingHub
        </NavLink>

        <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Main navigation">
          <NavLink to="/properties" className={activeClass}>
            Find Properties
          </NavLink>

          {user?.role === "seeker" && (
            <NavLink to="/my-inquiries" className={activeClass}>
              My Inquiries
            </NavLink>
          )}

          {user?.role === "landlord" && (
            <>
              <NavLink to="/landlord/dashboard" className={activeClass}>
                Dashboard
              </NavLink>
              <NavLink to="/landlord/add-property" className={activeClass}>
                Add Property
              </NavLink>
              <NavLink to="/landlord/inquiries" className={activeClass}>
                Inquiries
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" className={activeClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/reports" className={activeClass}>
                Reports
              </NavLink>
              <NavLink to="/admin/properties" className={activeClass}>
                Properties
              </NavLink>
            </>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={activeClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-800 text-white"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="hidden px-2 text-sm font-medium text-slate-600 lg:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default SiteNavbar;
