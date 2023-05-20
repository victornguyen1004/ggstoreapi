import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";

describe("Feedback API", () => {
  it("should return all feedbacks", async () => {
    const response = await request(app).get("/feedbacks");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("array");
  });

  it("should create a new feedback", async () => {
    const newFeedback = {
      message: "Test feedback",
      rating: 5,
    };

    const response = await request(app).post("/feedbacks").send(newFeedback);

    expect(response.status).to.equal(HttpStatusCode.CREATED);
    expect(response.body).to.be.an("object");
  });

  it("should update a feedback", async () => {
    const feedbackId = "feedback_id_to_update";
    const updatedFeedback = {
      message: "Updated feedback",
      rating: 4,
    };

    const response = await request(app)
      .patch("/feedbacks")
      .send({ feedbackId, updatedFeedback });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should delete a feedback", async () => {
    const feedbackId = "feedback_id_to_delete";

    const response = await request(app)
      .delete("/feedbacks")
      .send({ feedbackId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });
});
