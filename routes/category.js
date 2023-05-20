import express from "express";
const router = express.Router();
import { categoryController } from "../controllers/index.js";

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.insertCategory);
router.post("/insertmultiple", categoryController.insertMultiple);
router.patch("/", categoryController.updateCategory);
router.delete("/", categoryController.deleteCategory);

export default router;
