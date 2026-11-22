const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

dotenv.config();

const User = require("../models/User");

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const prefix = `${name}=`;
    return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  };

  const name = getArg("name") || process.env.ADMIN_NAME;
  const email = (getArg("email") || process.env.ADMIN_EMAIL)?.toLowerCase().trim();
  const phone = getArg("phone") || process.env.ADMIN_PHONE;
  const password = getArg("password") || process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  if (!name || !email || !phone || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD are required"
    );
  }

  if (password.length < 6) {
    throw new Error("ADMIN_PASSWORD must contain at least 6 characters");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }
  );

  const passwordMatches = await bcrypt.compare(password, admin.password);

  if (!passwordMatches) {
    throw new Error("Admin password verification failed after saving");
  }

  console.log(`Admin account ready and password verified: ${admin.email}`);
};

createAdmin()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
