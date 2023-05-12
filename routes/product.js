import express from "express";
const router = express.Router();
import { productController } from "../controllers/index.js";

router.get("/", productController.getAllProducts);

router.get("/id/:id", productController.getProductById);

router.get("/name/:slug", productController.getProductBySlug);

router.post("/insert", productController.insertProduct);

router.post("/insertmany", productController.insertMultiple);

router.patch("/update", productController.updateProduct);

router.delete("/delete", productController.deleteProduct);

router.delete("/deleteall", productController.deleteAllProducts);

export default router;
