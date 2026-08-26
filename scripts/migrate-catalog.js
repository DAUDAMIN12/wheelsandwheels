import "dotenv/config";
import mongoose from "mongoose";
import Product from "../server/models/Product.js";
import { seedProducts } from "../server/seedData.js";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
await mongoose.connect(process.env.MONGODB_URI);

const removedPackages = await Product.deleteMany({
  category: "Wheel Packages",
});
await Product.updateMany(
  { category: "Tyres" },
  { $set: { image: "/tyre.jpg" } },
);
await Product.updateMany(
  { category: "Rims" },
  { $set: { image: "/Rim1.jpg", origin: "Other" } },
);
await Product.updateMany(
  {
    category: "Tyres",
    brand: {
      $in: ["Yokohama", "Bridgestone", "Dunlop", "Toyo", "Nitto", "Falken"],
    },
  },
  { $set: { origin: "Japan" } },
);
await Product.updateMany(
  {
    category: "Tyres",
    brand: {
      $in: [
        "Sailun",
        "Linglong",
        "Triangle",
        "RoadX",
        "Goodride",
        "Doublestar",
        "APLUS",
      ],
    },
  },
  { $set: { origin: "China" } },
);

for (const product of seedProducts) {
  await Product.updateOne(
    { slug: product.slug },
    { $set: product },
    { upsert: true, runValidators: true },
  );
}

const totals = {
  products: await Product.countDocuments(),
  chineseTyres: await Product.countDocuments({
    category: "Tyres",
    origin: "China",
  }),
  japaneseTyres: await Product.countDocuments({
    category: "Tyres",
    origin: "Japan",
  }),
  rims: await Product.countDocuments({ category: "Rims" }),
  removedWheelPackages: removedPackages.deletedCount,
};
await mongoose.disconnect();
console.log(JSON.stringify(totals, null, 2));
