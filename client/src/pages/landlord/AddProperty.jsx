
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import LocationPicker from "../../components/property/LocationPicker";

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

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
  });

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "district"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
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

    if (
      !Number.isFinite(coordinates.lat) ||
      !Number.isFinite(coordinates.lng)
    ) {
      alert("Please select the property location on the map.");
      return;
    }

    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const { data } = await API.post(
        "/api/properties",
        {
          ...formData,
          price: Number(formData.price),
          availableRooms: Number(formData.availableRooms),
          location: {
            ...formData.location,
            coordinates,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (selectedImages.length > 0) {
        const imageData = new FormData();

        selectedImages.forEach((image) => {
          imageData.append("images", image);
        });

        await API.post(
          `/api/properties/${data.property._id}/images`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/landlord/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to add property."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      setError("You can select a maximum of 5 images.");
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

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white shadow-sm p-5">
        <div className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-2xl font-bold text-blue-700">
            BoardingHub
          </h1>

          <Link
            to="/landlord/dashboard"
            className="text-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Add New Property
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your boarding place or rental details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* BASIC INFORMATION */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Basic Information
            </h3>

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

            <div>
  <label className="block mb-2 font-medium">
    Property Images
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    multiple
    onChange={handleImageChange}
    className="w-full border rounded-lg p-3"
  />

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
  {previewImages.map((image, index) => (
    <div key={index} className="relative">
      <img
        src={image}
        alt={`Preview ${index + 1}`}
        className="w-full h-36 object-cover rounded-lg"
      />

      <button
        type="button"
        onClick={() => {
          URL.revokeObjectURL(previewImages[index]);

          setSelectedImages((old) =>
            old.filter((_, i) => i !== index)
          );

          setPreviewImages((old) =>
            old.filter((_, i) => i !== index)
          );
        }}
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1"
      >
        X
      </button>
    </div>
  ))}
</div>

  <p className="text-sm text-gray-500 mt-1">
    Select up to 5 images. Maximum 5 MB per image.
  </p>
</div>
          </section>

          {/* PROPERTY TYPE */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Property Type
            </h3>

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

          {/* PRICE */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Rental Information
            </h3>

            <label className="block text-sm font-medium mb-2">
              Monthly Rental Price (LKR)
            </label>

            <input
              type="number"
              name="price"
              min="1"
              placeholder="15000"
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

          {/* LOCATION */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Property Location
            </h3>

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

              <LocationPicker value={coordinates} onChange={setCoordinates} />

            </div>
          </section>

          {/* FACILITIES */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Available Facilities
            </h3>

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

                  <span className="text-sm">
                    {facility}
                  </span>

                </label>

              ))}

            </div>
          </section>

          {/* GENDER PREFERENCE */}

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Preferred Occupants
            </h3>

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

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white p-4 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Property"}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Your advertisement will be pending until admin approval.
          </p>

        </form>

      </main>

    </div>
  );
};

export default AddProperty;
