import Exception from "../exceptions/Exception.js";
import { Feedback } from "../models/index.js";
import { print, OutputType } from "../helpers/print.js";

const getAllFeedbacks = async ({ page, size, searchString }) => {
  // aggregate data for all students
  page = parseInt(page);
  size = parseInt(size);
  // searchString? name, route
  let filteredFeedbacks = await Feedback.aggregate([
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
  return filteredFeedbacks;
};

const insertFeedback = async ({
  title,
  content,
  userId,
  rating,
  productId,
}) => {
  try {
    const feedback = await Feedback.create({
      title,
      content,
      userId,
      rating,
      productId,
    });
    return feedback;
  } catch (exception) {
    if (!!exception.errors) {
      throw new Exception("Input error", exception.errors);
    }
  }
};

async function insertMultipleFeedbacks(receivedFeedbacks) {
  try {
    let feedbacks = [];
    let insertedFeedbacks = [];

    for (let i = 0; i < receivedFeedbacks.length; i++) {
      let feedback = {
        title: receivedFeedbacks[i].title,
        content: receivedFeedbacks[i].content,
        userId: receivedFeedbacks[i].userId,
        rating: receivedFeedbacks[i].rating,
        productId: receivedFeedbacks[i].productId,
      };
      feedbacks.push(feedback);
    }

    const insertedDocs = await Feedback.insertMany(feedbacks);
    insertedFeedbacks = insertedDocs.map((doc) => doc.toObject());

    return insertedFeedbacks;
  } catch (exception) {
    if (!!exception.errors) {
      throw new Exception("Input error", exception.errors);
    }
  }
}

const deleteAllFeedbacks = async () => {
  try {
    const result = await Feedback.deleteMany({});
    return result;
  } catch (exception) {
    throw new Exception("Error deleting all feedbacks");
  }
};

const deleteFeedback = async (id) => {
  try {
    const result = await Feedback.findByIdAndDelete(id);
    if (!result) {
      throw new Exception("Cannot find feedback with id " + id);
    }
    return result;
  } catch (exception) {
    throw new Exception("Error deleting feedback with id " + id);
  }
};

const updateFeedback = async ({
  id,
  title,
  content,
  userId,
  rating,
  productId,
}) => {
  const feedback = await Feedback.findById(id);
  feedback.title = title ?? feedback.title;
  feedback.content = content ?? feedback.content;
  feedback.userId = userId ?? feedback.userId;
  feedback.rating = rating ?? feedback.rating;
  (feedback.productId = productId ?? feedback.productId), await feedback.save();
  return feedback;
};
export default {
  getAllFeedbacks,
  insertFeedback,
  insertMultipleFeedbacks,
  deleteAllFeedbacks,
  deleteFeedback,
  updateFeedback,
};
