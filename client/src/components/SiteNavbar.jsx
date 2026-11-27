import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const activeClass = ({ isActive }) =>
  `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-blue-700 text-white shadow-md shadow-blue-900/15"
      : "text-slate-600 hover:bg-white hover:text-blue-700"
  }`;

function SiteNavbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-[1000] border-b border-slate-200/70 shadow-sm shadow-slate-900/5 backdrop-blur-xl"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(37, 99, 235, 0.12) 1px, transparent 1.4px), linear-gradient(105deg, rgba(219, 234, 254, 0.97), rgba(255, 255, 255, 0.97) 52%, rgba(255, 237, 213, 0.97))",
        backgroundSize: "18px 18px, 100% 100%",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <NavLink
          to="/"
          className="shrink-0"
          aria-label="BoardingHub home"
        >
          <img
            src={logo}
            alt="BoardingHub"
            className="h-20 w-auto object-contain"
          />
        </NavLink>

        <nav
          className="flex min-w-0 flex-wrap items-center justify-end gap-1 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-1.5 shadow-sm"
          aria-label="Main navigation"
        >
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
              <NavLink to="/admin/users" className={activeClass}>
                Users
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
                  `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-orange-900/20"
                      : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="hidden whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 lg:inline-flex">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
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
