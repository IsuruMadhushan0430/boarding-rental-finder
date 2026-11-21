import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    pendingProperties: 0,
    rentedProperties: 0,
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (imageId) => {
    const baseUrl = API.defaults.baseURL
      ? API.defaults.baseURL.replace(/\/$/, "")
      : "";

    return `${baseUrl}/api/images/${imageId}`;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [statsResponse, propertiesResponse] =
          await Promise.all([
            API.get("/api/properties/dashboard/stats", config),
            API.get("/api/properties/my-properties", config),
          ]);

        setStats(statsResponse.data.stats);

        setProperties(
          propertiesResponse.data.properties
        );

      } catch {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Approved Listings",
      value: stats.availableProperties,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Pending Approval",
      value: stats.pendingProperties,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Rented Properties",
      value: stats.rentedProperties,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white shadow-sm p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          BoardingHub
        </h1>

        <span className="text-gray-600">
          {user?.name}
        </span>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Landlord Dashboard
            </h2>

            <p className="text-gray-500 mt-2">
              Welcome back, {user?.name}
            </p>
          </div>

          <Link
            to="/landlord/add-property"
            className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800"
          >
            + Add Property
          </Link>

          <Link to="/landlord/inquiries">
            Received Inquiries
          </Link>

        </div>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <p className="text-gray-500">
                {card.title}
              </p>

              <p className={`text-3xl font-bold mt-3 ${card.color} inline-block px-3 py-1 rounded-lg`}>
                {card.value}
              </p>
            </div>
          ))}

        </div>

        <section className="mt-10 bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              My Properties
            </h3>

            <Link
              to="/landlord/add-property"
              className="text-blue-700 font-semibold"
            >
              Add New
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="text-gray-500">
              You haven't added any properties yet.
            </p>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="p-3">Images</th>
                    <th className="p-3">Property</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property) => (

                    <tr
                      key={property._id}
                      className="border-b"
                    >

                      <td className="p-3">
                        {property.images?.length > 0 ? (
                          <img
                            src={getImageUrl(property.images[0]._id || property.images[0])}
                            alt={property.title}
                            className="w-24 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-medium">
                        {property.title}
                      </td>

                      <td className="p-3">
                        {property.location.city}
                      </td>

                      <td className="p-3">
                        LKR {property.price.toLocaleString()}
                      </td>

                      <td className="p-3">
                        {property.status}
                      </td>

                      <td className="p-3">
                        <Link
                          to={`/landlord/edit-property/${property._id}`}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Edit
                        </Link>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default Dashboard;