import express from "express";
const router = express.Router();
import { customerController } from "../controllers/index.js";

router.get("/", customerController.getAllCustomers);

router.post("/", customerController.insertCustomer);

router.post("/insertmultiple", customerController.insertMultiple);

router.delete("/deleteall", customerController.deleteAllCustomers);

export default router;
