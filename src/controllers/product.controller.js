const productService = require("../services/product.services");

// ✅ Create a new product
async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (err) {
    console.error("❌ Error in createProduct:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ✅ Delete product by ID with validation and error handling
async function deleteProduct(req, res) {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    const message = await productService.deleteProduct(productId);
    return res.status(200).json({
      success: true,
      message: message || "Product deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error in deleteProduct:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the product.",
      error: err.message,
    });
  }
}

// ✅ Update product by ID with validation and error handling
async function updateProduct(req, res) {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    const updatedProduct = await productService.updateProduct(
      productId,
      req.body
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found with the given ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("❌ Error in updateProduct:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the product.",
      error: err.message,
    });
  }
}
// ✅ Find product by ID with validation and not-found handling
async function findProductById(req, res) {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    const product = await productService.findProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with the given ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product found successfully.",
      data: product,
    });
  } catch (err) {
    console.error("❌ Error in findProductById:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the product.",
      error: err.message,
    });
  }
}

// ✅ Get all products (no filters, but safe with query param fallback)
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts(req.query || {});

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in getAllProducts:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
      error: err.message,
    });
  }
}

// ✅ Find products by category
async function findProductByCategory(req, res) {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required.",
      });
    }

    const products = await productService.findProductByCategory(category);

    return res.status(200).json({
      success: true,
      message:
        products.length > 0
          ? "Products fetched by category."
          : "No products found for this category.",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in getProductsByCategory:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products by category.",
      error: err.message,
    });
  }
}

// ✅ Search product by query
async function searchProduct(req, res) {
  try {
    const query = req.params.query;
    const products = await productService.searchProduct(query);
    return res.status(200).json({
      success: true,
      message: "Search results fetched.",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in searchProduct:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ✅ Create multiple products (bulk insert)
const createMultipleProduct = async (req, res) => {
  try {
    await productService.createMultipleProduct(req.body);
    return res.status(201).json({
      success: true,
      message: "Products created successfully.",
    });
  } catch (error) {
    console.error("❌ Error in createMultipleProduct:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating products.",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct,
};
