import { MAX_RECORDS } from "../Global/constants.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { feedbackRepository } from "../repositories/index.js";

async function getAllFeedbacks(req, res) {
  //http:localhost:3000?page=1&size=100
  // if user intend to pass 9999 to "size"
  let { page = 1, size = MAX_RECORDS, searchString = "" } = req.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;
  try {
    let filteredFeedbacks = await feedbackRepository.getAllFeedbacks({
      size,
      page,
      searchString,
    });
    res.status(HttpStatusCode.OK).json({
      message: "Get all feedbacks successfully",
      size: filteredFeedbacks.length,
      page,
      searchString,
      data: filteredFeedbacks,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function insertFeedback(req, res) {
  try {
    const feedback = await feedbackRepository.insertFeedback(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert feedback successfully",
      data: feedback,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert feedback:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function insertMultipleFeedbacks(req, res) {
  try {
    const insertedFeedbacks = await feedbackRepository.insertMultipleFeedbacks(req.body);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Insert multiple feedbacks successfully",
      data: insertedFeedbacks,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Cannot insert multiple feedbacks:" + exception,
      validationErrors: exception.validationErrors,
    });
  }
}

async function deleteFeedback(req, res) {
  const id = req.body.id;
  try {
    const result = await feedbackRepository.deleteFeedback(id);
    res.status(HttpStatusCode.OK).json({
      message: `Successfully deleted feedback with id ${id}`,
      data: result,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function deleteAllFeedbacks(req, res) {
  try {
    const result = await feedbackRepository.deleteAllFeedbacks();
    res.status(HttpStatusCode.OK).json({
      message: "All feedbacks deleted successfully",
      data: result,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
}

async function updateFeedback(req, res) {
  const { id, title, content, userId, rating, productId } = req.body;

  try {
    const updateFeedback = await feedbackRepository.updateFeedback(req.body);

    res.status(HttpStatusCode.OK).json({
      message: `Successfully updated feedback with id ${id}`,
      data: updateFeedback,
    });
  } catch (exception) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Error updating feedback with id ${id}`,
      validationErrors: exception.validationErrors,
    });
  }
}

export default {
  getAllFeedbacks,
  insertFeedback,
  insertMultipleFeedbacks,
  deleteAllFeedbacks,
  deleteFeedback,
  updateFeedback,
};
