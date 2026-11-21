import { useEffect, useState } from "react";
import { getMyInquiries } from "../services/inquiryService";
import { Link } from "react-router-dom";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await getMyInquiries();
        setInquiries(data.inquiries || []);
      } catch {
        setError("Unable to load your inquiries.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) return <p className="p-6">Loading inquiries...</p>;

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Inquiries
      </h1>

      {inquiries.length === 0 ? (
        <p>You haven't sent any inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              <h2 className="font-bold text-lg">
                {inquiry.property?.title || "Property unavailable"}
              </h2>

              <p className="text-gray-600 mt-1">
                {inquiry.property?.location?.city || "Location unavailable"}
              </p>

              <p className="mt-3">{inquiry.message}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  {inquiry.status}
                </span>
              </div>

              {inquiry.property?._id && (
                <Link
                  to={`/properties/${inquiry.property._id}`}
                  className="text-blue-600 mt-3 inline-block"
                >
                  View Property
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInquiries;