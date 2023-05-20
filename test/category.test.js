import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";

describe("Category API", () => {
  it("should return all categories", async () => {
    const response = await request(app).get("/categories");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("array");
  });

  it("should create a new category", async () => {
    const newCategory = {
      name: "Test Category",
    };

    const response = await request(app).post("/categories").send(newCategory);

    expect(response.status).to.equal(HttpStatusCode.CREATED);
    expect(response.body).to.be.an("object");
  });

  it("should update a category", async () => {
    const categoryId = "category_id_to_update";
    const updatedCategory = {
      name: "Updated Category",
    };

    const response = await request(app)
      .patch("/categories")
      .send({ categoryId, updatedCategory });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should delete a category", async () => {
    const categoryId = "category_id_to_delete";

    const response = await request(app)
      .delete("/categories")
      .send({ categoryId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });
});
