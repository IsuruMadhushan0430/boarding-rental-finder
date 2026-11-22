import { useState } from "react";
import { submitReport } from "../../services/reportService";

function ReportProperty({ propertyId }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!reason) {
      setError("Please select a report reason.");
      return;
    }

    try {
      setLoading(true);

      await submitReport(propertyId, {
        reason,
        description,
      });

      setSuccess("Your report was submitted successfully.");
      setReason("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-red-200 rounded-xl p-5 mt-6">
      <h2 className="text-lg font-bold text-red-700">
        Report this property
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-4">
        Report suspicious or misleading advertisements.
        Reports are reviewed by our administration team.
      </p>

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">
            Reason for reporting
          </label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select a reason</option>
            <option value="Fake Listing">Fake Listing</option>
            <option value="Incorrect Information">
              Incorrect Information
            </option>
            <option value="Suspicious Landlord">
              Suspicious Landlord
            </option>
            <option value="Inappropriate Content">
              Inappropriate Content
            </option>
            <option value="Already Rented">Already Rented</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Additional details (optional)
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Explain why you are reporting this property..."
            className="w-full border rounded-lg p-3"
          />

          <p className="text-xs text-gray-500 text-right">
            {description.length}/1000
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportProperty;