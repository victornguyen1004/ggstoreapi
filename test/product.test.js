import { expect } from "chai";
import request from "supertest";
import app from "../server.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";
import { productRepository } from "../repositories/index.js";

describe("Product API", () => {
  const user = { userId: "user123" };
  const token = jwt.sign(user, process.env.JWT_SECRET);
  let createdProductId;

  afterEach(async () => {
    const insertedProducts = await productRepository.getAllProducts({
      page: 1,
      size: 100,
      searchString: "",
    });
    const createdProductIds = insertedProducts.map((product) => product._id);

    if (createdProductIds.length > 0) {
      await Promise.all(
        createdProductIds.map((id) => productRepository.deleteProduct(id))
      );
    }
  });

  it("should return all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.satisfy((message) => {
      return (
        message === "Get all products successfully" ||
        message === "Executed. No products in the storage"
      );
    });
  });

  it("should insert a new product", async () => {
    const newProduct = {
      name: "New Product",
      price: 10.99,
      rating: 4.5,
      category: "Electronics",
      description: "This is a new product",
      imgUrl: "https://example.com/product.jpg",
    };

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal("Insert product successfully");
    expect(response.body.data).to.have.property("_id");
    expect(response.body.data.name).to.equal(newProduct.name);

    createdProductId = response.body.data._id;
  });

  it("should insert multiple products", async () => {
    const products = [
      {
        name: "Product 1",
        price: 9.99,
        rating: 4.0,
        category: "Electronics",
        description: "Product 1 description",
        imgUrl: "https://example.com/product1.jpg",
      },
      {
        name: "Product 2",
        price: 19.99,
        rating: 3.5,
        category: "Appliances",
        description: "Product 2 description",
        imgUrl: "https://example.com/product2.jpg",
      },
    ];

    const response = await request(app)
      .post("/products/insertmultiple")
      .set("Authorization", `Bearer ${token}`)
      .send(products);

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal(
      "Insert multiple products successfully"
    );
  });

  it("should delete a product", async () => {
    const newProduct = {
      name: "Delete Product",
      price: 9.99,
      rating: 4.0,
      category: "Electronics",
      description: "Delete product description",
      imgUrl: "https://example.com/delete-product.jpg",
    };

    const insertResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    const productId = insertResponse.body.data._id;

    const response = await request(app)
      .delete("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: productId });

    expect(response.status).to.equal(HttpStatusCode.INSERT_OK);
    expect(response.body.message).to.equal(
      `Successfully deleted product with id ${productId}`
    );
  });

  it("should update a product", async () => {
    const newProduct = {
      name: "Update Product",
      price: 19.99,
      rating: 4.5,
      category: "Electronics",
      description: "Update product description",
      imgUrl: "https://example.com/update-product.jpg",
    };

    const insertResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    const productId = insertResponse.body.data._id;

    const updatedProduct = {
      id: productId,
      name: "Updated Product",
      price: 24.99,
      rating: 4.8,
      category: "Electronics",
      description: "Updated product description",
      imgUrl: "https://example.com/updated-product.jpg",
    };

    const response = await request(app)
      .patch("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.equal(
      `Successfully updated product with Id: ${productId}`
    );
    expect(response.body.updated._id).to.equal(productId);
    expect(response.body.updated.name).to.equal(updatedProduct.name);
    expect(response.body.updated.price).to.equal(updatedProduct.price);
  });

  it("should delete all products", async () => {
    const response = await request(app)
      .delete("/products/deleteall")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(HttpStatusCode.OK);
    expect(response.body.message).to.satisfy((message) => {
      return (
        message === "Successfully deleted all products" ||
        message ===
          "Executed, no products were deleted as there were no products available in the storage."
      );
    });
  });
});
