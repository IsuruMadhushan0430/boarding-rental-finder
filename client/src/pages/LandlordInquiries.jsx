import { useCallback, useEffect, useState } from "react";
import {
  getReceivedInquiries,
  updateInquiryStatus,
} from "../services/inquiryService";

function LandlordInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReceivedInquiries();
      setInquiries(data.inquiries || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load inquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchInquiries]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);

      await updateInquiryStatus(id, status);

      setInquiries((previous) =>
        previous.map((inquiry) =>
          inquiry._id === id
            ? { ...inquiry, status }
            : inquiry
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to update inquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const total = inquiries.length;

  const pending = inquiries.filter(
    (item) => item.status === "Pending"
  ).length;

  const responded = inquiries.filter(
    (item) => item.status === "Responded"
  ).length;

  const closed = inquiries.filter(
    (item) => item.status === "Closed"
  ).length;

  const filteredInquiries =
    filter === "All"
      ? inquiries
      : inquiries.filter((item) => item.status === filter);

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-800",
    Responded: "bg-green-100 text-green-800",
    Closed: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return <div className="p-6">Loading inquiries...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Received Inquiries
          </h1>

          <p className="text-gray-500">
            Manage inquiries from interested seekers.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </p>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <StatCard title="Total Inquiries" value={total} />

        <StatCard title="Pending" value={pending} />

        <StatCard title="Responded" value={responded} />

        <StatCard title="Closed" value={closed} />

      </div>

      {/* Filter */}

      <div className="flex flex-wrap gap-2 mb-6">

        {["All", "Pending", "Responded", "Closed"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg border ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          )
        )}

      </div>

      {/* Inquiry List */}

      {filteredInquiries.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center">
          <h2 className="font-semibold text-lg">
            No inquiries found
          </h2>

          <p className="text-gray-500 mt-2">
            Inquiries matching this filter will appear here.
          </p>
        </div>
      ) : (

        <div className="space-y-4">

          {filteredInquiries.map((inquiry) => (

            <div
              key={inquiry._id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >

              <div className="flex flex-col md:flex-row md:justify-between gap-4">

                <div className="flex-1">

                  <h2 className="font-bold text-lg">
                    {inquiry.property?.title || "Property unavailable"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {inquiry.property?.location?.city || "Location unavailable"}
                  </p>

                  <div className="mt-4 space-y-2">

                    <p>
                      <strong>Seeker:</strong>{" "}
                      {inquiry.name}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="text-blue-600"
                      >
                        {inquiry.phone}
                      </a>
                    </p>

                    <p>
                      <strong>Message:</strong>
                    </p>

                    <p className="bg-gray-50 p-3 rounded-lg">
                      {inquiry.message}
                    </p>

                    <p className="text-sm text-gray-500">
                      Received:{" "}
                      {new Date(
                        inquiry.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="flex flex-col gap-3 md:w-48">

                  <span
                    className={`text-center px-3 py-2 rounded-full text-sm font-medium ${
                      statusStyle[inquiry.status]
                    }`}
                  >
                    {inquiry.status}
                  </span>

                  <label className="text-sm font-medium">
                    Update Status
                  </label>

                  <select
                    value={inquiry.status}
                    disabled={updatingId === inquiry._id}
                    onChange={(e) =>
                      handleStatusChange(
                        inquiry._id,
                        e.target.value
                      )
                    }
                    className="border p-2 rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Responded">Responded</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {updatingId === inquiry._id && (
                    <p className="text-sm text-gray-500">
                      Updating...
                    </p>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

export default LandlordInquiries;