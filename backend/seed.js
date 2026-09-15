require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@voiceofdemocracy.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword} (change this password!)`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const starterCategories = ["Politics", "World", "Business", "Technology", "Opinion", "Local"];
  for (const name of starterCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      console.log(`Category created: ${name}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
