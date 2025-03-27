import mongoose from "mongoose";

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
   required: true,
  },
  description: {
    type: String,
   required: true,
  },
  location: {
    type: String,
   required: true,
  },
  // Example statuses: Submitted, In Progress, Resolved, Rejected
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Reference to the user who filed the complaint
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Array of updates related to the complaint
  updates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ComplaintUpdate",
    },
  ],
});

export default mongoose.model("Complaint", complaintSchema);
