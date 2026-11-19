
const Property = require("../models/Property");

// GET /api/public/properties
const getPublicProperties = async (req, res) => {
  try {
    const {
      search,
      city,
      district,
      minPrice,
      maxPrice,
      roomType,
      propertyType,
      facilities,
      page = 1,
      limit = 9,
    } = req.query;

    // Only show approved and available properties
    const filter = {
      status: "Approved",
      isAvailable: true,
    };

    // Search by title, description or address
    if (search) {
      const safeSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        {
          "location.address": {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    if (city) {
      filter["location.city"] = {
        $regex: city,
        $options: "i",
      };
    }

    if (district) {
      filter["location.district"] = {
        $regex: district,
        $options: "i",
      };
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }

      if (
        Object.values(filter.price).some(
          (value) => !Number.isFinite(value) || value < 0
        )
      ) {
        return res.status(400).json({
          message: "Invalid price filter.",
        });
      }

      if (
        filter.price.$gte !== undefined &&
        filter.price.$lte !== undefined &&
        filter.price.$gte > filter.price.$lte
      ) {
        return res.status(400).json({
          message: "Minimum price cannot exceed maximum price.",
        });
      }
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Match properties containing every selected facility
    if (facilities) {
      const selectedFacilities = facilities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (selectedFacilities.length > 0) {
        filter.facilities = {
          $all: selectedFacilities,
        };
      }
    }

    const currentPage = Math.max(1, Number(page));
    const pageLimit = Math.min(30, Math.max(1, Number(limit)));

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(pageLimit)
    ) {
      return res.status(400).json({
        message: "Invalid pagination values.",
      });
    }

    const skip = (currentPage - 1) * pageLimit;

    const [properties, totalProperties] = await Promise.all([
      Property.find(filter)
        .select("-__v")
        .populate("images", "_id filename contentType size")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit),

      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      properties,
      pagination: {
        totalProperties,
        currentPage,
        totalPages: Math.ceil(totalProperties / pageLimit),
        pageLimit,
      },
    });
  } catch (error) {
    console.error("Public property search error:", error);

    res.status(500).json({
      message: "Unable to retrieve properties.",
    });
  }
};

module.exports = {
  getPublicProperties,
};
