import express from "express";
const router = express.Router();
import { productController } from "../controllers/index.js";

router.get("/", productController.getAllProducts);

router.get("/id/:id", productController.getProductById);    

router.get("/name/:slug", productController.getProductBySlug);

router.post("/", productController.insertProduct);

router.post("/insertmultiple", productController.insertMultiple);

router.patch("/", productController.updateProduct);

router.delete("/", productController.deleteProduct);

router.delete("/deleteall", productController.deleteAllProducts);

export default router;
