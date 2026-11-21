
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";
import InquiryForm from "../../components/property/InquiryForm";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/api/public/property-details/${id}`
        );

        setProperty(response.data.property);
        setActiveImage(0);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading property details...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">
          Property unavailable
        </h2>

        <p className="text-gray-500 mt-3">
          {error || "This property could not be found."}
        </p>

        <Link
          to="/properties"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  const images = property.images || [];

  const getImageUrl = (image) => {
    const imageId =
      typeof image === "object" ? image._id : image;

    return `${import.meta.env.VITE_API_URL}/api/images/${imageId}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          {" / "}
          <Link to="/properties" className="hover:text-blue-600">
            Properties
          </Link>
          {" / "}
          <span className="text-gray-800">
            {property.title}
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {property.title}
            </h1>

            <p className="text-gray-500 mt-2">
              {property.location?.address},{" "}
              {property.location?.city},{" "}
              {property.location?.district}
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-blue-600">
              Rs. {Number(property.price).toLocaleString("en-LK")}
            </p>

            <p className="text-gray-500 text-sm">
              Per month
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          {images.length > 0 ? (
            <>
              <img
                src={getImageUrl(images[activeImage])}
                alt={property.title}
                className="w-full h-[420px] object-cover rounded-lg"
              />

              <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {images.map((image, index) => (
                  <button
                    key={typeof image === "object" ? image._id : image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      activeImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No property images available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">
                Property Description
              </h2>

              <p className="text-gray-600 whitespace-pre-line leading-7">
                {property.description}
              </p>
            </section>

            {/* Property Information */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                Property Information
              </h2>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Property Type
                  </p>
                  <p className="font-medium mt-1">
                    {property.propertyType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Room Type
                  </p>
                  <p className="font-medium mt-1">
                    {property.roomType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Available Rooms
                  </p>
                  <p className="font-medium mt-1">
                    {property.availableRooms}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Gender Preference
                  </p>
                  <p className="font-medium mt-1">
                    {property.genderPreference}
                  </p>
                </div>
              </div>
            </section>

            {/* Facilities */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                Facilities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.facilities?.map((facility) => (
                  <div
                    key={facility}
                    className="bg-gray-50 rounded-lg p-3 text-gray-700"
                  >
                    ✓ {facility}
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              Property Location
            </h2>

            <p className="text-gray-600 mb-4">
              {property.location?.address},{" "}
              {property.location?.city},{" "}
              {property.location?.district}, Sri Lanka
            </p>

            {property.location?.coordinates?.lat != null &&
            property.location?.coordinates?.lng != null ? (
              <MapContainer
                center={[
                  property.location.coordinates.lat,
                  property.location.coordinates.lng,
                ]}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-80 rounded-xl z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    property.location.coordinates.lat,
                    property.location.coordinates.lng,
                  ]}
                >
                  <Popup>
                    {property.title}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                Map location has not been added for this property.
              </p>
            )}
          </section>


          </div>

          {/* Landlord Contact */}
          <aside>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold mb-5">
                Contact Landlord
              </h2>

              <div className="mb-5">
                <p className="text-sm text-gray-500">
                  Listed by
                </p>

                <p className="font-semibold text-lg mt-1">
                  {property.landlord?.name || "Landlord"}
                </p>
              </div>

              {property.landlord?.phone ? (
                <>
                  <a
                    href={`tel:${property.landlord.phone}`}
                    className="block text-center bg-blue-600 text-white py-3 rounded-lg mb-3 hover:bg-blue-700"
                  >
                    Call Landlord
                  </a>

                  <a
                    href={`https://wa.me/${property.landlord.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Contact details are not available.
                </p>
              )}

              <p className="text-xs text-gray-400 mt-5">
                Always verify property details before making
                a payment.
              </p>

              {property && (
                <InquiryForm propertyId={property._id} />
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
