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
  getComplaintsByUser,
} from "../controllers/complaintController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.get("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/createComplaint", createComplaint);
router.get("/getComplaintsByUser", getComplaintsByUser);
router.get("/getComplaintById/:id", getComplaintById);
router.get("/complaints", getAllComplaints);


export default router;
