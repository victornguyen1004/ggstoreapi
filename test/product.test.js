import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";

//  npx mocha --require dotenv/config --timeout 5000 ./test/product.test.js 

describe("Product API", () => {
  it("should return all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).to.equal(HttpStatusCode.OK);
  });

  it("should return a product by ID", async () => {
    const productId = "64688874561a42502f15d2c8";
    const response = await request(app).get(`/products/id/${productId}`);
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should return a product by slug", async () => {
    const productSlug = "logitech-g102";
    const response = await request(app).get(`/products/name/${productSlug}`);
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should create a new product", async () => {

    const user = { userId: "user123" };
    const token = jwt.sign(user, process.env.JWT_SECRET);

    const newProduct = {
      name: "Logitech G302",
      price: 4.99,
      rating: 5,
      category: "mouse",
      description: "dasdasdas",
      imgUrl: "dsadasda",
    };

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body).to.be.an("object");
  });

  it("should update a product", async () => {
    const productId = "product_id_to_update";
    const updatedProduct = {
      name: "Updated Product",
      price: 19.99,
    };

    const response = await request(app)
      .patch("/products")
      .send({ productId, updatedProduct });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should delete a product", async () => {
    const productId = "product_id_to_delete";

    const response = await request(app).delete("/products").send({ productId });

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

  it("should delete all products", async () => {
    const response = await request(app).delete("/products/deleteall");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.be.an("object");
  });

});
