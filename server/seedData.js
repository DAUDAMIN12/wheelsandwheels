import products from "../src/Data/productsData.js";

export const seedProducts = products.map((source) => {
  const product = { ...source };
  delete product._id;
  return {
    ...product,
    slug: product.title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    featured: product.rating >= 4.8,
  };
});
