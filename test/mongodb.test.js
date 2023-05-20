import { expect } from "chai";
import request from "supertest";
import connect from "../database/database.js";
import app from "../server.js";

// npx mocha test/mongodb.test.js

describe("MongoDB Connection", () => {
  it("should connect to MongoDB successfully", async () => {
    const connection = await connect();
    expect(connection).to.not.be.undefined;
    expect(connection.readyState).to.be.at.least(1);
  });
});
