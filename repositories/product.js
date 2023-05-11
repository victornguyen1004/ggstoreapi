import Exception from "../exceptions/Exception.js";
import { Product } from "../models/index.js";

const getAllProducts = async ({ page, size, searchString }) => {
  // aggregate data for all students
  page = parseInt(page);
  size = parseInt(size);
  // searchString? name, route
  let filteredProduct = await Product.aggregate([
    {
      $match: {
        $or: [
          {
            name: { $regex: `.*${searchString}.*`, $options: "i" }, //ignore case
          },
          {
            route: { $regex: `.*${searchString}.*`, $options: "i" }, //ignore case
          },
        ],
      },
    },
    {
      $skip: (page - 1) * size,
    },
    {
      $limit: size,
    },
  ]);
  return filteredProduct;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Exception("Cannot find product with id " + productId);
  }
  return product ?? {}; // default value
};

const insertProduct = async ({
  name,
  price,
  rating,
  category,
  description,
  imgUrl,
  slug,
}) => {
  try {
    const product = await Product.create({
      name,
      price,
      rating,
      category,
      description,
      imgUrl,
      slug,
    });
    return product;
  } catch (exception) {
    if (!!exception.errors) {
      //error from validation
      throw new Exception("Input error", exception.errors);
    }
  }
};

async function insertMultiple(receivedProducts) {
  try {
    let products = [];
    for (let i = 0; i < receivedProducts.length; i++) {
      let product = {
        name: receivedProducts[i].name,
        price: receivedProducts[i].price,
        rating: receivedProducts[i].rating,
        category: receivedProducts[i].category,
        description: receivedProducts[i].description,
        imgUrl: receivedProducts[i].imgUrl,
        slug: receivedProducts[i].slug,
      };
      products.push(product);
    }
    await Product.insertMany(products);
  } catch (exception) {
    if (!!exception.errors) {
      debugger;
      //error from validation
      throw new Exception("Input error", exception.errors);
    }
  }
}

const updateProduct = async ({
  id,
  name,
  price,
  rating,
  category,
  description,
  imgUrl,
  slug,
}) => {
  const product = await Product.findById(id);
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.rating = rating ?? product.rating;
  product.category = category ?? product.category;
  product.description = description ?? product.description;
  product.imgUrl = imgUrl ?? product.imgUrl;
  product.slug = slug ?? product.slug;
  await product.save();
  return product;
};

const deleteProduct = async (id) => {
  try {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new Exception("Cannot find product with id " + id);
    }
    return result;
  } catch (exception) {
    throw new Exception("Error deleting product with id " + id);
  }
};

const deleteAllProducts = async () => {
  try {
    const result = await Product.deleteMany({});
    return result;
  } catch (exception) {
    throw new Exception("Error deleting all products");
  }
};

export default {
  getAllProducts,
  getProductById,
  insertProduct,
  insertMultiple,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
