import Exception from "../exceptions/Exception.js";
import { Category } from "../models/index.js";

const getAllCategories = async ({ page, size, searchString }) => {
  // aggregate data for all students
  page = parseInt(page);
  size = parseInt(size);
  // searchString? name, route
  let filteredCategory = await Category.aggregate([
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
  return filteredCategory;
};

const insertCategory = async ({ name }) => {
  try {
    const category = await Category.create({
      name,
    });
    return category;
  } catch (exception) {
    if (!!exception.errors) {
      //error from validation
      throw new Exception("Input error", exception.errors);
    }
  }
};

async function insertMultiple(receivedCategories) {
  try {
    debugger;
    let categories = [];
    for (let i = 0; i < receivedCategories.length; i++) {
      let category = {
        name: receivedCategories[i].name,
      };
      categories.push(category);
    }
    debugger;
    await Category.insertMany(categories);
  } catch (exception) {
    if (!!exception.errors) {
      debugger;
      //error from validation
      throw new Exception("Input error", exception.errors);
    }
  }
}

const updateCategory = async ({
  id,
  name,
}) => {
  const category = await Category.findById(id);
  category.name = name ?? category.name;
  await category.save();
  return category;
};

const deleteCategory = async (id) => {
  try {
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      throw new Exception("Cannot find category with id " + id);
    }
    return result;
  } catch (exception) {
    throw new Exception("Error deleting category with id " + id);
  }
};

export default {
  insertCategory,
  getAllCategories,
  insertMultiple,
  updateCategory,
  deleteCategory,
};
