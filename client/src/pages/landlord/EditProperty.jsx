import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

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

const initialFormData = {
  title: "",
  description: "",
  propertyType: "Boarding House",
  roomType: "Single Room",
  price: "",
  facilities: [],
  location: {
    address: "",
    city: "",
    district: "",
  },
  availableRooms: 1,
  genderPreference: "Any",
  images: [],
};

const getImageUrl = (imageId) => {
  const baseUrl = API.defaults.baseURL
    ? API.defaults.baseURL.replace(/\/$/, "")
    : "";

  return `${baseUrl}/api/images/${imageId}`;
};

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await API.get(`/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        const property = response.data.property;

        setFormData({
          ...initialFormData,
          ...property,
          price: property.price ?? "",
          availableRooms: property.availableRooms ?? 0,
          facilities: Array.isArray(property.facilities)
            ? property.facilities
            : [],
          location: {
            ...initialFormData.location,
            ...property.location,
          },
          images: Array.isArray(property.images) ? property.images : [],
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load property details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "district"].includes(name)) {
      setFormData((previous) => ({
        ...previous,
        location: {
          ...previous.location,
          [name]: value,
        },
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData((previous) => ({
      ...previous,
      facilities: previous.facilities.includes(facility)
        ? previous.facilities.filter((item) => item !== facility)
        : [...previous.facilities, facility],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const existingImageCount = formData.images.length;

    if (existingImageCount + files.length > 5) {
      setError("A property can have a maximum of 5 images.");
      return;
    }

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      setError("Only JPEG, PNG and WebP images are allowed.");
      return;
    }

    if (validFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }

    setError("");
    setSelectedImages(validFiles);
    setPreviewImages(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Enter a valid monthly rental price.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.availableRooms)) ||
      Number(formData.availableRooms) < 0
    ) {
      setError("Enter a valid available room count.");
      return;
    }

    try {
      setSaving(true);
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await API.put(
        `/api/properties/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          availableRooms: Number(formData.availableRooms),
        },
        config
      );

      if (selectedImages.length > 0) {
        const imageData = new FormData();
        selectedImages.forEach((image) => imageData.append("images", image));

        await API.post(`/api/properties/${id}/images`, imageData, config);
      }

      navigate("/landlord/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading property...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm p-5">
        <div className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-2xl font-bold text-blue-700">BoardingHub</h1>
          <Link to="/landlord/dashboard" className="text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Edit Property</h2>
          <p className="text-gray-500 mt-2">
            Update your boarding place or rental details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>
          )}

          <section>
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <input
                name="title"
                placeholder="Property Title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full border p-3 rounded-lg"
              />
              <textarea
                name="description"
                placeholder="Describe your property..."
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={2000}
                rows="4"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium">Property Images</label>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image) => {
                    const imageId = image._id || image;

                    return (
                      <img
                        key={imageId}
                        src={getImageUrl(imageId)}
                        alt={formData.title}
                        className="w-full h-36 object-cover rounded-lg"
                      />
                    );
                  })}
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="w-full border rounded-lg p-3"
              />
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {previewImages.map((image, index) => (
                    <img
                      key={image}
                      src={image}
                      alt={`New preview ${index + 1}`}
                      className="w-full h-36 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Select additional images. Maximum 5 images total, 5 MB per
                image.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Property Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >
                <option>Boarding House</option>
                <option>Annex</option>
                <option>House</option>
                <option>Apartment</option>
              </select>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              >
                <option>Single Room</option>
                <option>Shared Room</option>
                <option>Full House</option>
              </select>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Rental Information</h3>
            <label className="block text-sm font-medium mb-2">
              Monthly Rental Price (LKR)
            </label>
            <input
              type="number"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />
            <label className="block text-sm font-medium mt-4 mb-2">
              Available Rooms
            </label>
            <input
              type="number"
              name="availableRooms"
              min="0"
              step="1"
              value={formData.availableRooms}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Property Location</h3>
            <div className="space-y-4">
              <input
                name="address"
                placeholder="Full Address"
                value={formData.location.address}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />
              <input
                name="city"
                placeholder="City / Town"
                value={formData.location.city}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />
              <input
                name="district"
                placeholder="District"
                value={formData.location.district}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Available Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {facilitiesList.map((facility) => (
                <label
                  key={facility}
                  className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                  />
                  <span className="text-sm">{facility}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Preferred Occupants</h3>
            <select
              name="genderPreference"
              value={formData.genderPreference}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="Any">Anyone</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-700 text-white p-4 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditProperty;
