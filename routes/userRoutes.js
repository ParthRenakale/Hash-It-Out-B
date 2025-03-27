import express from "express";
import {
  forgotPassword,
  resetPassword,
  signin,
  signup,
  verifyEmail,
} from "../controllers/userController.js";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
} from "../controllers/complaintController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.get("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/createComplaint", createComplaint);
router.get("/getAllComplaints", getAllComplaints);
router.get("/getComplaintById/:id", getComplaintById);

export default router;
