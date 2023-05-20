import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { categoryRepository } from "../repositories/index.js";
import { MAX_RECORDS } from "../Global/constants.js";

async function getAllCategories(req, res) {
  //http:localhost:3000?page=1&size=100
  // if user intend to pass 9999 to "size"
  let { page = 1, size = MAX_RECORDS, searchString = "" } = req.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;
  try {
    let filteredCategories = await categoryRepository.getAllCategories({
      size,
      page,
      searchString,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Get all category successfully",
      size: filteredCategories.length,
      page,
      searchString,
      data: filteredCategories,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function insertCategory(req, res) {
  try {
    const category = await categoryRepository.insertCategory(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert category successfully",
      data: category,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert category:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function insertMultiple(req, res) {
  try {
    await categoryRepository.insertMultiple(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert multiple categories successfully",
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert multiple categories:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function updateCategory(req, res) {
  const { id, name } = req.body;

  try {
    const updatedCategory = await categoryRepository.updateCategory(req.body);

    res.status(HttpStatusCode.OK).json({
      message: `Successfully updated category with Id: ${id}`,
      updated: updatedCategory,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Error updating category with id ${id}`,
      validationErrors: exception.validationErrors,
    });
  }
}

async function deleteCategory(req, res) {
  const id = req.body.id;
  try {
    await categoryRepository.deleteCategory(id);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: `Successfully deleted category with id ${id}`,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

export default {
  insertCategory,
  getAllCategories,
  insertMultiple,
  updateCategory,
  deleteCategory,
};
