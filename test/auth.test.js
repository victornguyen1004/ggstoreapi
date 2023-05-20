import { expect } from "chai";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";

// run npx mocha --require dotenv/config --timeout 5000 ./test/auth.test.js to test

describe("Authentication Middleware", () => {
  it("should allow GET requests to specific endpoints without a token", async () => {
    const response = await request(app).get("/products");
    expect(response.status).to.equal(HttpStatusCode.OK);
  });

  it("should allow POST requests to login and register endpoints without a token", async () => {
    const registerResponse = await request(app).post("/users/register").send({
      name: "John Doe",
      email: "johndoe1@example.com",
      password: "password123",
      phoneNumber: "1234567890",
      address: "123 Main St",
    });
    expect(registerResponse.status).to.equal(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(registerResponse.body.message).to.equal(
      "Error: User already exists"
    );

    const loginResponse = await request(app)
      .post("/users/login")
      .send({ email: "johndoe1@example.com", password: "password123" });
    expect(loginResponse.status).to.equal(HttpStatusCode.OK);
    expect(loginResponse.body.message).to.equal("Login user successfully");
    expect(loginResponse.body.data).to.have.property("token");
  });

  it("should allow requests with a valid token", async () => {
    // Create a valid token
    const user = { userId: "user123" };
    const token = jwt.sign(user, process.env.JWT_SECRET);

    // Send a request with the valid token
    const response = await request(app)
      .post("/customers/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Alienware",
        imgUrl: "https://i.ibb.co/SBdykH9/alienware.png",
        link: "https://www.dell.com/en-us/gaming/alienware",
        isActive: true,
      });

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
  });

  it("should reject requests with an expired token", async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { userId: "user123", exp: Math.floor(Date.now() / 1000) - 3600 }, // Expiry time set to an hour ago
      process.env.JWT_SECRET
    );

    // Send a request with the expired token
    const response = await request(app)
      .get("/protected-endpoint")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(response.status).to.equal(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).to.equal("jwt expired");
    // Add more expectations if necessary
  });

  it("should reject requests without a token", async () => {
    const response = await request(app).post("/protected-endpoint");
    expect(response.status).to.equal(HttpStatusCode.BAD_REQUEST);
    expect(response.body.message).to.equal("Token not provided");
    // Add more expectations if necessary
  });

  // Add more tests for different scenarios and edge cases
});
