import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";
import { feedbackRepository } from "../repositories/index.js";

describe("Feedback API", () => {
  const user = { userId: "user123" };
  const token = jwt.sign(user, process.env.JWT_SECRET);
  // let createdFeedbackId;

  // afterEach(async () => {
  //   // Clean up by deleting the created feedback
  //   if (createdFeedbackId) {
  //     await feedbackRepository.deleteFeedback(createdFeedbackId);
  //   }
  // });

  it("should return all feedbacks", async () => {
    const response = await request(app).get("/feedbacks");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("Get all feedbacks successfully");
  });

  it("should insert a new feedback", async () => {
    const newFeedback = {
      title: "Great product!",
      content: "I really loved using this product",
      userId: "user123",
      rating: 5,
      productId: "product123",
    };

    const response = await request(app)
      .post("/feedbacks")
      .set("Authorization", `Bearer ${token}`)
      .send(newFeedback);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal("Insert feedback successfully");
    expect(response.body.data).to.have.property("_id");
    expect(response.body.data.title).to.equal(newFeedback.title);

    // createdFeedbackId = response.body.data._id; // Store the created feedback ID for cleanup
  });

 it("should insert multiple feedbacks", async () => {
   const feedbacks = [
     {
       title: "Good service",
       content: "The service provided was excellent.",
       userId: "user456",
       rating: 4,
       productId: "product123",
     },
     {
       title: "Improvement needed",
       content: "There are areas that need improvement.",
       userId: "user789",
       rating: 3,
       productId: "product123",
     },
   ];

   const response = await request(app)
     .post("/feedbacks/insertmultiple")
     .set("Authorization", `Bearer ${token}`)
     .send(feedbacks);

   expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
   expect(response.body.message).to.equal(
     "Insert multiple feedbacks successfully"
   );
 });

  it("should delete a feedback", async () => {
   const newFeedback = {
     title: "Update this feedback",
     content: "This feedback should be updated.",
     userId: "user123",
     rating: 5,
     productId: "product123",
   };

   const insertResponse = await request(app)
     .post("/feedbacks")
     .set("Authorization", `Bearer ${token}`)
     .send(newFeedback);

   const feedbackId = insertResponse.body.data._id;


    const response = await request(app)
      .delete("/feedbacks")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: feedbackId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.equal(
      `Successfully deleted feedback with id ${feedbackId}`
    );
  });

  it("should delete all feedbacks", async () => {
    const response = await request(app)
      .delete("/feedbacks/deleteall")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.equal(
      "All feedbacks deleted successfully"
    );
  });

  it("should update a feedback", async () => {
    const newFeedback = {
      title: "Update this feedback",
      content: "This feedback should be updated.",
      userId: "user123",
      rating: 5,
      productId: "product123",
    };

    const insertResponse = await request(app)
      .post("/feedbacks")
      .set("Authorization", `Bearer ${token}`)
      .send(newFeedback);

    const feedbackId = insertResponse.body.data._id;

    const updatedFeedback = {
      id: feedbackId,
      title: "Updated title",
      content: "Updated content",
      userId: "user123",
      rating: 4,
      productId: "product123",
    };

    const response = await request(app)
      .patch("/feedbacks")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedFeedback);

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.equal(
      `Successfully updated feedback with id ${feedbackId}`
    );
    expect(response.body.data.title).to.equal(updatedFeedback.title);
    expect(response.body.data.content).to.equal(updatedFeedback.content);
    expect(response.body.data.rating).to.equal(updatedFeedback.rating);
  });
});
