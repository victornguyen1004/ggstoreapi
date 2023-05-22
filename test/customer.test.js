import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

describe("Customer API", () => {
  const user = { userId: "user123" };
  const token = jwt.sign(user, process.env.JWT_SECRET);

  it("should return all customers", async () => {
    const response = await request(app).get("/customers");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("Get all customers successfully");
  });

  it("should insert a new customer", async () => {
    const newCustomer = {
      name: "John Doe",
      imgUrl: "https://example.com/img.jpg",
      link: "https://example.com",
      isActive: true,
    };

    const response = await request(app)
      .post("/customers")
      .set("Authorization", `Bearer ${token}`)
      .send(newCustomer);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal("Insert customer successfully");
    expect(response.body.data).to.have.property("_id");
    expect(response.body.data.name).to.equal(newCustomer.name);
  });

  it("should insert multiple customers", async () => {
    const customers = [
      {
        name: "Jane Smith",
        imgUrl: "https://example.com/img1.jpg",
        link: "https://example.com",
        isActive: true,
      },
      {
        name: "Bob Johnson",
        imgUrl: "https://example.com/img2.jpg",
        link: "https://example.com",
        isActive: true,
      },
    ];

    const response = await request(app)
      .post("/customers/insertmultiple")
      .set("Authorization", `Bearer ${token}`)
      .send(customers);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal(
      "Insert multiple customers successfully"
    );
  });

  it("should delete all customers", async () => {
    const response = await request(app)
      .delete("/customers/deleteall")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.equal(
      "All customers deleted successfully"
    );
  });
});
