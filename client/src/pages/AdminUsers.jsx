
import { useCallback, useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  getAdminUsers,
  getAdminUserStats,
  updateAdminUserStatus,
} from "../services/adminUserService";

const initialStats = {
  total: 0,
  landlords: 0,
  seekers: 0,
  active: 0,
  inactive: 0,
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(initialStats);

  const [role, setRole] = useState("All");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminUsers({
        role,
        search: appliedSearch,
        page,
        limit: 10,
      });

      setUsers(result.users || []);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [role, appliedSearch, page]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getAdminUserStats();
      setStats(result.stats || initialStats);
    } catch (err) {
      console.error("Failed to load user statistics:", err);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStats();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setPage(1);
  };

  const handleStatusChange = async (user) => {
    const newStatus = !user.isActive;

    const action = newStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}'s account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);
      setError("");

      await updateAdminUserStatus(user._id, newStatus);

      // Update the displayed user immediately
      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? { ...item, isActive: newStatus }
            : item
        )
      );

      // Refresh statistics
      await fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update account status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            User Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage BoardingHub landlords and seekers.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard title="Total Users" value={stats.total} icon="users" tone="blue" />

          <StatCard title="Landlords" value={stats.landlords} icon="building" tone="purple" />

          <StatCard title="Seekers" value={stats.seekers} icon="user" tone="cyan" />

          <StatCard title="Active Accounts" value={stats.active} icon="check" tone="green" />

          <StatCard title="Inactive Accounts" value={stats.inactive} icon="pause" tone="slate" />

        </div>

        {/* Search and filters */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setAppliedSearch("");
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">

            {["All", "landlord", "seeker", "admin"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleRoleChange(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                    role === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item === "All" ? "All Users" : item}
                </button>
              )
            )}

          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* User table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {pagination.totalUsers || 0} users found
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Joined Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-gray-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {user.phone || "Not provided"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {user.role === "admin" ? (
                          <span className="text-xs text-gray-400">
                            Protected account
                          </span>
                        ) : (
                          <button
                            disabled={updatingId === user._id}
                            onClick={() => handleStatusChange(user)}
                            className={`rounded-lg px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isActive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {updatingId === user._id
                              ? "Updating..."
                              : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 p-5">

              <p className="text-sm text-gray-500">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </p>

              <div className="flex gap-2">

                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
