import { MAX_RECORDS } from "../Global/constants.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { productRepository } from "../repositories/index.js";

async function getAllProducts(req, res) {
  //http:localhost:3000?page=1&size=100
  // if user intend to pass 9999 to "size"
  let { page = 1, size = MAX_RECORDS, searchString = "" } = req.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;
  try {
    let filteredProducts = await productRepository.getAllProducts({
      size,
      page,
      searchString,
    });
    if (filteredProducts.length > 0) {
      res.status(HttpStatusCode.OK).json({
        message: "Get all product successfully",
        size: filteredProducts.length,
        page,
        searchString,
        data: filteredProducts,
      });
    } else {
      res.status(HttpStatusCode.OK).json({
        message: "Executed. No products in the storage",
      });
    }
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    let productId = req.params.id;
    const product = await productRepository.getProductById(productId);
    res.status(HttpStatusCode.OK).json({
      message: "Successfully get product with id:" + productId,
      result: product,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot get product with id: " + req.params.id,
    });
  }
}

async function getProductBySlug(req, res) {
  let productSlug = req.params.slug;
  const product = await productRepository.getProductBySlug(productSlug);
  console.log(product);
  if (product.length <= 0) {
    console.log(product);
    return res.status(HttpStatusCode.OK).json({
      message: "Cannot get product with slug: " + req.params.slug,
      data: product,
    });
  }
  return res.status(HttpStatusCode.OK).json({
    message: "Successfully get product with slug: " + productSlug,
    result: product,
  });
}

async function insertProduct(req, res) {
  try {
    const product = await productRepository.insertProduct(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert product successfully",
      data: product,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert product:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function insertMultiple(req, res) {
  try {
    await productRepository.insertMultiple(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert multiple products successfully",
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert multiple products:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function updateProduct(req, res) {
  const { id, name, price, rating, category, description, imgUrl } = req.body;

  try {
    const updatedProduct = await productRepository.updateProduct(req.body);

    res.status(HttpStatusCode.OK).json({
      message: `Successfully updated product with Id: ${id}`,
      updated: updatedProduct,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Error updating product with id ${id}`,
      validationErrors: exception.validationErrors,
    });
  }
}

async function deleteProduct(req, res) {
  const id = req.body.id;
  try {
    await productRepository.deleteProduct(id);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: `Successfully deleted product with id ${id}`,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function deleteAllProducts(req, res) {
  try {
    const result = await productRepository.deleteAllProducts();
    if (result.deletedCount > 0) {
      res.status(HttpStatusCode.OK).json({
        message: "Successfully deleted all products",
        deleted: result,
      });
    } else {
      res.status(HttpStatusCode.OK).json({
        message:
          "Executed, no products were deleted as there were no products available in the storage.",
      });
    }
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  insertProduct,
  insertMultiple,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
