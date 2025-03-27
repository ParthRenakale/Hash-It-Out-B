import mongoose from "mongoose";

const complaintUpdateSchema = new mongoose.Schema({
  // Reference to the complaint this update belongs to
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },
  // Who made the update (typically an authority user)
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Comment provided by the authority regarding the complaint
  comment: {
    type: String,
    required: true,
  },
  // Optional new status if the authority decides to update it
  newStatus: {
    type: String,
    enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
  },
  // Timestamp for when this update was made
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("omplaintUpdate", complaintUpdateSchema);
