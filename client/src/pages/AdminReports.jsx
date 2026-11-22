import { useEffect, useState } from "react";
import {
  getAllReports,
  updateReportStatus,
} from "../services/reportService";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState({});

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllReports();
      setReports(data.reports || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

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
            "Failed to load reports."
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

  const handleStatusUpdate = async (reportId, status) => {
    try {
      setUpdatingId(reportId);

      const result = await updateReportStatus(reportId, {
        status,
        adminNote: notes[reportId] || "",
      });

      setReports((previous) =>
        previous.map((report) =>
            report._id === reportId
            ? {
                ...report,
                ...result.report,
                property: report.property,
                reporter: report.reporter,
                }
            : report
        )
    );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update report."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.status === filter);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Reviewed: "bg-blue-100 text-blue-800",
    Dismissed: "bg-gray-100 text-gray-700",
    "Action Taken": "bg-red-100 text-red-700",
  };

  if (loading) {
    return <div className="p-6">Loading reports...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}

      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Property Reports
          </h1>

          <p className="text-gray-500 mt-1">
            Review and manage suspicious property listings.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-5">
          {error}
        </p>
      )}

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <SummaryCard
          title="Total Reports"
          value={reports.length}
        />

        <SummaryCard
          title="Pending Reports"
          value={pendingCount}
        />

        <SummaryCard
          title="Action Taken"
          value={
            reports.filter(
              (report) => report.status === "Action Taken"
            ).length
          }
        />

      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "All",
          "Pending",
          "Reviewed",
          "Dismissed",
          "Action Taken",
        ].map((status) => (
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
        ))}
      </div>

      {/* Reports */}

      {filteredReports.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <h2 className="font-semibold text-lg">
            No reports found
          </h2>

          <p className="text-gray-500 mt-2">
            There are no reports in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {filteredReports.map((report) => (

            <div
              key={report._id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >

              <div className="flex flex-wrap justify-between gap-3">

                <div>
                  <h2 className="font-bold text-lg">
                    {report.property?.title || "Property unavailable"}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {report.property?.location?.city || "Unknown location"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm h-fit ${
                    statusStyles[report.status]
                  }`}
                >
                  {report.status}
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Report reason
                  </p>

                  <p className="font-medium">
                    {report.reason}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Reported by
                  </p>

                  <p className="font-medium">
                    {report.reporter?.name || "Unknown"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {report.reporter?.email || ""}
                  </p>
                </div>

              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">
                  Report description
                </p>

                <div className="bg-gray-50 rounded-lg p-3">
                  {report.description || "No additional description provided."}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Submitted:{" "}
                {new Date(report.createdAt).toLocaleString()}
              </p>

              {/* Admin note */}

              <div className="mt-5">
                <label className="block font-medium mb-2">
                  Admin note
                </label>

                <textarea
                  value={
                    notes[report._id] ??
                    report.adminNote ??
                    ""
                  }
                  onChange={(e) =>
                    setNotes((previous) => ({
                      ...previous,
                      [report._id]: e.target.value,
                    }))
                  }
                  maxLength={1000}
                  rows={2}
                  placeholder="Enter your investigation notes..."
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Admin actions */}

              <div className="flex flex-wrap gap-3 mt-4">

                <button
                  disabled={updatingId === report._id}
                  onClick={() =>
                    handleStatusUpdate(report._id, "Reviewed")
                  }
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                >
                  Mark Reviewed
                </button>

                <button
                  disabled={updatingId === report._id}
                  onClick={() =>
                    handleStatusUpdate(report._id, "Dismissed")
                  }
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white disabled:opacity-50"
                >
                  Dismiss
                </button>

                <button
                  disabled={updatingId === report._id}
                  onClick={() => {
                    const confirmed = window.confirm(
                      "This will reject and disable the property listing. Continue?"
                    );

                    if (confirmed) {
                      handleStatusUpdate(
                        report._id,
                        "Action Taken"
                      );
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                >
                  Take Action
                </button>

              </div>

              {updatingId === report._id && (
                <p className="text-sm text-gray-500 mt-2">
                  Updating report...
                </p>
              )}

              {report.reviewedAt && (
                <p className="text-xs text-gray-500 mt-3">
                  Last reviewed:{" "}
                  {new Date(report.reviewedAt).toLocaleString()}
                </p>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="border bg-white rounded-xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default AdminReports;