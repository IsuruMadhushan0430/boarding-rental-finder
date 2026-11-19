
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const image = property.images?.[0];

  const imageUrl = image
    ? `${import.meta.env.VITE_API_URL}/api/images/${
        typeof image === "object" ? image._id : image
      }`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">

      {/* Property Image */}
      <div className="h-52 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5">

        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {property.title}
          </h3>

          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Available
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {property.location?.city},{" "}
          {property.location?.district}
        </p>

        <p className="text-xl font-bold text-blue-600 mt-3">
          Rs. {Number(property.price).toLocaleString("en-LK")}
          <span className="text-sm text-gray-500 font-normal">
            {" "}/ month
          </span>
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
            {property.roomType}
          </span>

          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
            {property.propertyType}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">
            Facilities
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {property.facilities?.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className="text-xs text-gray-600"
              >
                • {facility}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/properties/${property._id}`}
          className="block text-center bg-blue-600 text-white py-2 rounded-lg mt-5 hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default PropertyCard;
