import { useState } from "react";
import { sendInquiry } from "../../services/inquiryService";

function InquiryForm({ propertyId }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    try {
      setLoading(true);

      await sendInquiry(propertyId, formData);

      setSuccess("Your inquiry has been sent successfully!");

      setFormData({
        name: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send inquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-bold mb-4">
        Interested in this property?
      </h2>

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
          <label className="block mb-1 font-medium">
            Your Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full border rounded-lg p-3"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength={20}
            className="w-full border rounded-lg p-3"
            placeholder="0771234567"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Message
          </label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            maxLength={1000}
            rows="4"
            className="w-full border rounded-lg p-3"
            placeholder="I am interested in this property..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}

export default InquiryForm;