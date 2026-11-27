import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  getAdminProperties,
  getAdminPropertyStats,
  updateAdminPropertyStatus,
} from "../services/adminPropertyService";

const API_URL = import.meta.env.VITE_API_URL;

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    rented: 0,
  });

  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [propertyData, statsData] = await Promise.all([
        getAdminProperties({
          status,
          search: search.trim(),
          page,
          limit: 10,
        }),
        getAdminPropertyStats(),
      ]);

      setProperties(propertyData.properties || []);
      setPagination(propertyData.pagination || {});
      setStats(statsData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAdminProperties({
        status,
        search: search.trim(),
        page,
        limit: 10,
      }),
      getAdminPropertyStats(),
    ])
      .then(([propertyData, statsData]) => {
        if (cancelled) return;

        setProperties(propertyData.properties || []);
        setPagination(propertyData.pagination || {});
        setStats(statsData);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Failed to load properties."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleStatusUpdate = async (propertyId, newStatus) => {
    const property = properties.find(
      (item) => item._id === propertyId
    );

    if (
      !property ||
      property.status !== "Pending"
    ) {
      return;
    }

    try {
      setUpdatingId(propertyId);

      const result = await updateAdminPropertyStatus(propertyId, {
        status: newStatus,
        adminNote: notes[propertyId] || "",
      });

      if (result.property) {
        setProperties((previous) =>
          previous.map((item) =>
            item._id === propertyId
              ? { ...item, ...result.property }
              : item
          )
        );
      }

      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to update property."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const imageUrl = (image) => {
    if (!image?._id) return null;
    return `${API_URL}/api/images/${image._id}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}

      <div className="flex flex-wrap justify-between items-center gap-3 mb-7">
        <div>
          <h1 className="text-2xl font-bold">
            Property Management
          </h1>

          <p className="text-gray-500 mt-1">
            Review and manage landlord property listings.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
          {error}
        </p>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <StatCard title="Total" value={stats.total} icon="building" tone="blue" />
        <StatCard title="Pending" value={stats.pending} icon="clock" tone="amber" />
        <StatCard title="Approved" value={stats.approved} icon="check" tone="green" />
        <StatCard title="Rejected" value={stats.rejected} icon="x" tone="rose" />
        <StatCard title="Rented" value={stats.rented} icon="home" tone="purple" />

      </div>

      {/* Search */}

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by property name or city..."
          className="border rounded-lg p-3 flex-1"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Search
        </button>
      </form>

      {/* Status filters */}

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
          "Rented",
        ].map((item) => (
          <button
            key={item}
            onClick={() => {
              setStatus(item);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              status === item
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Property list */}

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <h2 className="font-semibold text-lg">
            No properties found
          </h2>
          <p className="text-gray-500 mt-2">
            Try another search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {properties.map((property) => (

            <div
              key={property._id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >

              <div className="flex flex-col md:flex-row gap-5">

                {/* Image */}

                <div className="md:w-56 shrink-0">
                  {property.images?.length > 0 ? (
                    <img
                      src={imageUrl(property.images[0])}
                      alt={property.title}
                      className="w-full h-44 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-100 rounded-lg flex items-center justify-center">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}

                <div className="flex-1">

                  <div className="flex flex-wrap justify-between gap-2">

                    <h2 className="text-xl font-bold">
                      {property.title}
                    </h2>

                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm h-fit">
                      {property.status}
                    </span>

                  </div>

                  <p className="text-gray-500 mt-1">
                    {property.location?.city},{" "}
                    {property.location?.district}
                  </p>

                  <p className="text-blue-600 font-bold text-lg mt-2">
                    Rs. {Number(property.price).toLocaleString()}
                  </p>

                  <div className="mt-4 space-y-1 text-sm">

                    <p>
                      <strong>Landlord:</strong>{" "}
                      {property.landlord?.name || "Unknown"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {property.landlord?.email || "N/A"}
                    </p>

                    <p>
                      <strong>Property Type:</strong>{" "}
                      {property.propertyType}
                    </p>

                    <p>
                      <strong>Room Type:</strong>{" "}
                      {property.roomType}
                    </p>

                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        property.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

              </div>

              {/* Description */}

              <div className="mt-5 border-t pt-4">

                <h3 className="font-semibold mb-2">
                  Property Description
                </h3>

                <p className="text-gray-600">
                  {property.description}
                </p>

                <p className="mt-3 text-sm">
                  <strong>Facilities:</strong>{" "}
                  {property.facilities?.join(", ") || "None"}
                </p>

              </div>

              {/* Review information */}

              {property.reviewedAt && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
                  <p>
                    <strong>Reviewed by:</strong>{" "}
                    {property.reviewedBy?.name || "Admin"}
                  </p>

                  <p>
                    <strong>Admin note:</strong>{" "}
                    {property.adminNote || "No note"}
                  </p>
                </div>
              )}

              {/* Admin actions */}

              {property.status === "Pending" && (
                <div className="mt-5 border-t pt-4">

                  <label className="block font-medium mb-2">
                    Admin Review Note
                  </label>

                  <textarea
                    value={notes[property._id] || ""}
                    onChange={(e) =>
                      setNotes((previous) => ({
                        ...previous,
                        [property._id]: e.target.value,
                      }))
                    }
                    maxLength={1000}
                    rows={2}
                    placeholder="Enter review comments..."
                    className="w-full border rounded-lg p-3 mb-4"
                  />

                  <div className="flex flex-wrap gap-3">

                    <button
                      disabled={updatingId === property._id}
                      onClick={() =>
                        handleStatusUpdate(
                          property._id,
                          "Approved"
                        )
                      }
                      className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                      Approve Property
                    </button>

                    <button
                      disabled={updatingId === property._id}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to reject this property?"
                          )
                        ) {
                          handleStatusUpdate(
                            property._id,
                            "Rejected"
                          );
                        }
                      }}
                      className="bg-red-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                      Reject Property
                    </button>

                  </div>

                  {updatingId === property._id && (
                    <p className="text-sm text-gray-500 mt-2">
                      Updating property...
                    </p>
                  )}

                </div>
              )}

            </div>

          ))}

        </div>
      )}

      {/* Pagination */}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            disabled={page <= 1}
            onClick={() => setPage((previous) => previous - 1)}
            className="border px-4 py-2 rounded-lg disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((previous) => previous + 1)}
            className="border px-4 py-2 rounded-lg disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminProperties;