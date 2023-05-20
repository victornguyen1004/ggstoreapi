import express from "express";
const router = express.Router();
import { feedbackController } from "../controllers/index.js";

router.get("/", feedbackController.getAllFeedbacks);
router.post("/", feedbackController.insertFeedback);
router.post("/insertmultiple", feedbackController.insertMultipleFeedbacks);
router.delete("/", feedbackController.deleteFeedback);
router.delete("/deleteall", feedbackController.deleteAllFeedbacks);
router.patch("/", feedbackController.updateFeedback);

export default router;
