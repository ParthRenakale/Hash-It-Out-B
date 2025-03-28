import Complaint from "../models/Complaint.model.js";

//; Create a new complaint (by a citizen)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, location, user } = req.body;

    // Create a new complaint document
    const newComplaint = new Complaint({
      title,
      description,
      location,
      user,
    });

    await newComplaint.save();

    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single complaint by ID (with associated user and updates)
// export const getComplaintById = async (req, res) => {
//   try {
//     const complaint = await Complaint.findById(req.params.id)
//       .populate("user")
//       .populate({
//         path: "updates",
//         populate: { path: "updatedBy", select: "firstName lastName email" },
//       });

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     res.status(200).json(complaint);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// Get a single complaint by ID (without populating updates)
export const getComplaintById = async (req, res) => {
  try {
    // Find the complaint by ID and populate the related user only
    const complaint = await Complaint.findById(req.params.id).populate("user");

    // If the complaint is not found, return a 404 error
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Return the complaint details
    res.status(200).json(complaint);
  } catch (error) {
    // Return a 500 error with the error message if something goes wrong
    res.status(500).json({ error: error.message });
  }
};

// // Get all complaints (with optional filtering by user)
// export const getAllComplaints = async (req, res) => {
//   try {
//     const query = {};
//     // If a user ID is provided as a query parameter, filter complaints by that user
//     if (req.query.user) {
//       query.user = req.query.user;
//     }

//     const complaints = await Complaint.find(query)
//       .populate("user")
//       .populate({
//         path: "updates",
//         populate: { path: "updatedBy", select: "firstName lastName email" },
//       });

//     res.status(200).json(complaints);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all complaints by a specific user
export const getComplaintsByUser = async (req, res) => {
  try {
    // Ensure the user ID is provided in the query parameters
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find complaints based on the user ID
    const complaints = await Complaint.find({ user: userId }).populate("user");

    // If no complaints found for the user
    if (complaints.length === 0) {
      return res
        .status(404)
        .json({ message: "No complaints found for this user" });
    }

    // Return the list of complaints for the user
    res.status(200).json(complaints);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    // Fetch all complaints from the database and populate related user and updates
    const complaints = await Complaint.find();

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
