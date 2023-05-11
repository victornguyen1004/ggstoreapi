import express from "express";
const router = express.Router();
import { productController } from "../controllers/index.js";

router.get("/", productController.getAllProducts);

router.get("/", )

router.post("/insertProduct", productController.insertProduct);

router.post("/insertMultipleProducts", productController.insertMultiple);

router.patch("/update", productController.update);

router.post("")

export default router;
