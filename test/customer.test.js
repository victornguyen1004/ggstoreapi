import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";

describe("Customer API", () => {
  it("should return all customers", async () => {
    const response = await request(app).get("/customers");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("array");
  });

  it("should create a new customer", async () => {
    const newCustomer = {
      name: "John Doe",
      email: "johndoe@example.com",
      address: "123 Main St",
      phoneNumber: "1234567890",
    };

    const response = await request(app).post("/customers").send(newCustomer);

    expect(response.status).to.equal(HttpStatusCode.CREATED);
    expect(response.body).to.be.an("object");
  });

  it("should update a customer", async () => {
    const customerId = "customer_id_to_update";
    const updatedCustomer = {
      name: "Updated Name",
      email: "updatedemail@example.com",
      address: "456 Elm St",
      phoneNumber: "9876543210",
    };

    const response = await request(app)
      .patch("/customers")
      .send({ customerId, updatedCustomer });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should delete a customer", async () => {
    const customerId = "customer_id_to_delete";

    const response = await request(app)
      .delete("/customers")
      .send({ customerId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });
});
