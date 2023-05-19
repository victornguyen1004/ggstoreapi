import express from "express";
const router = express.Router();
import { customerController } from "../controllers/index.js";

router.get("/", customerController.getAllCustomers);

router.post("/insertCustomer", customerController.insertCustomer);

router.post("/insertMultipleCustomers", customerController.insertMultiple);

export default router;
