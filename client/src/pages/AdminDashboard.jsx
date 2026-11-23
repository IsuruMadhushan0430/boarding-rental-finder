import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllReports } from "../services/reportService";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const data = await getAllReports();
        if (isMounted) {
          setReports(data.reports || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            "Unable to load dashboard reports."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const pending = reports.filter((report) => report.status === "Pending").length;
  const reviewed = reports.filter((report) => report.status === "Reviewed").length;
  const actionTaken = reports.filter((report) => report.status === "Action Taken").length;
  const dismissed = reports.filter((report) => report.status === "Dismissed").length;

  const cards = [
    { label: "Total Reports", value: reports.length, tone: "bg-blue-50 text-blue-700", border: "border-blue-100" },
    { label: "Pending", value: pending, tone: "bg-yellow-50 text-yellow-700", border: "border-yellow-100" },
    { label: "Reviewed", value: reviewed, tone: "bg-indigo-50 text-indigo-700", border: "border-indigo-100" },
    { label: "Action Taken", value: actionTaken, tone: "bg-red-50 text-red-700", border: "border-red-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-slate-900 text-white md:flex md:flex-col">
        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">BoardingHub</h1>
          <p className="text-xs text-slate-400 mt-1">Administration</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Property Reports
          </Link>
          <Link
            to="/properties"
            className="flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            View Properties
          </Link>

          <Link
            to="/admin/properties"
            className="flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Property Management
          </Link>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            User Management
          </NavLink>

        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="px-2 text-sm font-medium">{user?.name}</p>
          <p className="px-2 text-xs text-slate-400 mt-1">Administrator</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="md:ml-64">
        <header className="border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Administration</p>
              <h2 className="text-xl font-bold text-slate-900">Admin Dashboard</h2>
            </div>
            <Link
              to="/admin/reports"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Review Reports
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back, {user?.name}
            </h2>
            <p className="mt-2 text-slate-500">
              Monitor property reports and take action on suspicious listings.
            </p>
          </div>

          {error && (
            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-xl border ${card.border} bg-white p-5 shadow-sm`}
                  >
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className={`mt-4 inline-flex rounded-lg px-3 py-2 text-3xl font-bold ${card.tone}`}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
                      <p className="mt-1 text-sm text-slate-500">Latest property reports submitted</p>
                    </div>
                    <Link to="/admin/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View all
                    </Link>
                  </div>

                  {reports.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                      No property reports found.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {reports.slice(0, 5).map((report) => (
                        <div key={report._id} className="flex items-center justify-between gap-4 py-4">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {report.property?.title || "Property unavailable"}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {report.reason} · {report.reporter?.name || "Unknown reporter"}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {report.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Report Overview</h3>
                  <p className="mt-1 text-sm text-slate-500">Current report status</p>

                  <div className="mt-6 space-y-4">
                    {[
                      ["Pending", pending, "bg-yellow-500"],
                      ["Reviewed", reviewed, "bg-blue-500"],
                      ["Action Taken", actionTaken, "bg-red-500"],
                      ["Dismissed", dismissed, "bg-slate-400"],
                    ].map(([label, value, color]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-600">{label}</span>
                          <span className="font-semibold text-slate-900">{value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full ${color}`}
                            style={{
                              width: `${reports.length ? (value / reports.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
