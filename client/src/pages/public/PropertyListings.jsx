
import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import PropertyCard from "../../components/property/PropertyCard";

const facilitiesList = [
  "Wi-Fi",
  "Water",
  "Electricity",
  "Kitchen",
  "Parking",
  "Attached Bathroom",
  "Furnished",
  "Air Conditioning",
  "CCTV",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
  "Jaffna",
  "Kurunegala",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Hambantota",
  "Kegalle",
  "Kilinochchi",
  "Mannar",
  "Matale",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
  "Ampara",
];

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    district: "",
    minPrice: "",
    maxPrice: "",
    roomType: "",
    propertyType: "",
    facilities: [],
  });

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalProperties: 0,
    totalPages: 0,
  });

  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPage(1);
  };

  const toggleFacility = (facility) => {
    setFilters((previous) => ({
      ...previous,
      facilities: previous.facilities.includes(facility)
        ? previous.facilities.filter((item) => item !== facility)
        : [...previous.facilities, facility],
    }));

    setPage(1);
  };

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 9,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params[key] = value.join(",");
          }
        } else if (value !== "") {
          params[key] = value;
        }
      });

      const response = await API.get("/api/public/properties", {
        params,
      });

      setProperties(response.data.properties);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProperties();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      district: "",
      minPrice: "",
      maxPrice: "",
      roomType: "",
      propertyType: "",
      facilities: [],
    });

    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-blue-700 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">
            Find Your Perfect Boarding Place
          </h1>

          <p className="mt-3 text-blue-100">
            Discover boarding rooms, annexes and rental houses
            across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search and Filters */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-6 rounded-xl shadow-sm border mb-8"
        >
          <h2 className="text-xl font-semibold mb-5">
            Search Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Search property or address"
              value={filters.search}
              onChange={(e) =>
                updateFilter("search", e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Enter city or town"
              value={filters.city}
              onChange={(e) =>
                updateFilter("city", e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <select
              value={filters.district}
              onChange={(e) =>
                updateFilter("district", e.target.value)
              }
              className="border rounded-lg p-3"
            >
              <option value="">All Districts</option>

              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Minimum price (Rs.)"
              min="0"
              value={filters.minPrice}
              onChange={(e) =>
                updateFilter("minPrice", e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Maximum price (Rs.)"
              min="0"
              value={filters.maxPrice}
              onChange={(e) =>
                updateFilter("maxPrice", e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <select
              value={filters.roomType}
              onChange={(e) =>
                updateFilter("roomType", e.target.value)
              }
              className="border rounded-lg p-3"
            >
              <option value="">All Room Types</option>
              <option value="Single Room">Single Room</option>
              <option value="Shared Room">Shared Room</option>
              <option value="Full House">Full House</option>
            </select>

            <select
              value={filters.propertyType}
              onChange={(e) =>
                updateFilter("propertyType", e.target.value)
              }
              className="border rounded-lg p-3"
            >
              <option value="">All Property Types</option>
              <option value="Boarding House">Boarding House</option>
              <option value="Annex">Annex</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
            </select>

          </div>

          {/* Facilities */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">
              Facilities
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {facilitiesList.map((facility) => (
                <label
                  key={facility}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                  />

                  {facility}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Search Properties
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="border px-6 py-3 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Available Properties
          </h2>

          <p className="text-gray-500">
            {pagination.totalProperties || 0} properties found
          </p>
        </div>

        {loading && (
          <p className="text-center py-10">
            Loading properties...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 py-6">
            {error}
          </p>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center">
            <h3 className="text-xl font-semibold">
              No properties found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search filters.
            </p>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border px-4 py-2 rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            <span>
              Page {page} of {pagination.totalPages}
            </span>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border px-4 py-2 rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default PropertyListings;
