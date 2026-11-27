
import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import PropertyCard from "../../components/property/PropertyCard";
import homeIllustration from "../../assets/background.jpg";

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
      <section className="relative isolate overflow-hidden border-b border-blue-100 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 18%, rgba(147, 197, 253, 0.4), transparent 28%), radial-gradient(circle at 8% 100%, rgba(191, 219, 254, 0.55), transparent 32%)",
          }}
        />
        <img
          src={homeIllustration}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 w-[78vw] max-w-[560px] opacity-20 mix-blend-multiply sm:opacity-35 md:right-0 md:w-[44vw] md:opacity-70"
        />

        <div className="relative mx-auto flex max-w-7xl items-center px-6 py-14 md:min-h-[330px] md:px-8 md:py-16">
          <div className="max-w-2xl md:max-w-[58%]">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-800 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              BoardingHub · Sri Lanka
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Find a place
              <br className="hidden sm:block" /> to call home.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Discover boarding rooms, annexes and rental houses across Sri Lanka.
            </p>
            <a
              href="#property-search"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Explore available places
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M4.167 10h11.666m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search and Filters */}
        <form
          id="property-search"
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
