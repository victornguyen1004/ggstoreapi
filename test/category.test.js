import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";

describe("Category API", () => {
  const user = { userId: "user123" };
  const token = jwt.sign(user, process.env.JWT_SECRET);

  it("should return all categories", async () => {
    const response = await request(app).get("/categories");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("Get all category successfully");
  });

  it("should create a new category", async () => {
    const newCategory = {
      name: "Test Category",
    };

    const response = await request(app)
      .post("/categories")  
      .set("Authorization", `Bearer ${token}`)
      .send(newCategory);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal("Insert category successfully");
    expect(response.body.data.name).to.equal(newCategory.name);

    const categoryId = response.body.data._id;

    const deleteResponse = await request(app)
      .delete(`/categories/`)
      .set("Authorization", `Bearer ${token}`)
      .send({ id: categoryId });

    expect(deleteResponse.status).to.equal(HttpStatusCode.OK);
    expect(deleteResponse.body.message).to.equal(
      `Successfully deleted category with id ${categoryId}`
    );
  });

  it("should update a category", async () => {
    const createResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test category for update" });
    const categoryId = createResponse.body.data._id;
    const updatedCategory = {
      id: categoryId,
      name: "Updated Category",
    };

    const response = await request(app)
      .patch("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedCategory);

    expect(response.status).to.equal(HttpStatusCode.OK);
    // expect(response.body).to.be.an("object");
  });

  it("should delete a category", async () => {
    const createResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test category for update" });
    const categoryId = createResponse.body.data._id;

    const response = await request(app)
      .delete("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: categoryId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal(
      `Successfully deleted category with id ${categoryId}`
    );
  });
});
