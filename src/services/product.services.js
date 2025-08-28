const Category = require("../models/category.model");
const Product = require("../models/product.model");

// ✅ Create a new product with category hierarchy
async function createProduct(reqData) {
  try {
    if (
      !reqData.topLevelCategory ||
      !reqData.secondLevelCategory ||
      !reqData.thirdLevelCategory
    ) {
      throw new Error("Category fields (top, second, third) are required.");
    }

    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

    if (!topLevel) {
      topLevel = await new Category({
        name: reqData.topLevelCategory,
        level: 1,
      }).save();
    }

    let secondLevel = await Category.findOne({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
    });

    if (!secondLevel) {
      secondLevel = await new Category({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
        level: 2,
      }).save();
    }

    let thirdLevel = await Category.findOne({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
    });

    if (!thirdLevel) {
      thirdLevel = await new Category({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
        level: 3,
      }).save();
    }

    const product = new Product({
      title: reqData.title,
      color: reqData.color,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPercent: reqData.discountPercent,
      imageUrl: reqData.imageUrl,
      brand: reqData.brand,
      price: reqData.price,
      sizes: reqData.size,
      quantity: reqData.quantity,
      category: thirdLevel._id,
    });

    return await product.save();
  } catch (error) {
    console.log("❌ Error in createProduct:", error.message);
    throw error;
  }
}

// ✅ Delete a product by ID
async function deleteProduct(productId) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found with ID:", productId);
    }

    await Product.findByIdAndDelete(productId);
    return "Product deleted successfully.";
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Update product
async function updateProduct(productId, reqData) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, {
      new: true,
    });
    if (!updatedProduct) {
      throw new Error("Product not found with ID:", productId);
    }
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Find product by ID
async function findProductById(id) {
  try {
    const product = await Product.findById(id).populate("category").exec();
    if (!product) {
      throw new Error("Product not found with id " + id);
    }
    return product;
  } catch (error) {
    console.error("Error finding product:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  try {
    let {
      category,
      color,
      sizes,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      stock,
      pageNumber = 1,
      pageSize = 10,
    } = reqQuery;

    let query = Product.find().populate("category");

    // Category Filter
    if (category) {
      const existCategory = await Category.findOne({ name: category });
      if (existCategory)
        query = query.where("category").equals(existCategory._id);
      else return { content: [], currentPage: 1, totalPages: 1 };
    }

    // Color Filter
    if (color) {
      const colorSet = new Set(
        color.split(",").map((color) => color.trim().toLowerCase())
      );
      const colorRegex =
        colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
      query = query.where("color").regex(colorRegex);
    }

    // Sizes Filter
    if (sizes) {
      const sizesSet = new Set(sizes);
      query = query.where("sizes.name").in(sizesSet);
    }

    // Price Filter
    if (minPrice && maxPrice) {
      query = await query.where("discountedPrice").gte(minPrice).lte(maxPrice);
    }

    // Discount Filter
    if (minDiscount) {
      query = await query.where("discountPercent").gte(minDiscount);
    }

    // Stock Filter
    if (stock) {
      if (stock === "in_stock") query = query.where("quantity").gt(0);
      if (stock === "out_of_stock") query = query.where("quantity").lte(0);
    }

    // Sorting
    if (sort) {
      const sortDirection = sort === "price_high" ? -1 : 1;
      query = query.sort({ discountedPrice: sortDirection });
    }

    // Pagination
    const totalProducts = await Product.countDocuments(query);
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
    const products = await query.exec();

    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
      content: products,
      currentPage: Number(pageNumber),
      totalPages,
    };
  } catch (error) {
    console.error("Error getting products:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Create multiple products
async function createMultipleProduct(products) {
  try {
    for (let product of products) {
      await createProduct(product);
    }
    return "Products created successfully";
  } catch (error) {
    console.error("Error creating multiple products:", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
