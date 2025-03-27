import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  yourFirstSchool: {
    type: String,
    required: true,
  },
  complaintsFiled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
});

export default mongoose.model("User", userSchema);
