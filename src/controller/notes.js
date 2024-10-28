
import noteModel from "../models/notes.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

// Create a new note
export const createNote = asyncHandler(async (req, res) => {
  const { email, recordType, note, phone, callDuration, status } =
    req.body;


  console.log(req.file,"req");

  if (!email && !recordType && !note && !phone && !status) {
    return res
      .status(200)
      .json({ status: false, message: "Incomplete form data" });
  }

  let image = null;

  if (req.files && req.files.image && req.files.image[0]) {
    image = await uploadOnCloudinary(req.files.image[0].path);
    if (!image) {
      return res
        .status(500)
        .json({ status: false, message: "Failed to upload image on Cloudinary" });
    }
  }

  const payload = {
    email,
    recordType,
    note,
    phone,
    callDuration,
    status,
    image,
    adminId: req?.adminId,
  };



  const newNote = await noteModel.create(payload);
  res.status(200).json({ success: true, data:newNote });
});

// Get all notes
export const getNotes = asyncHandler(async (req, res) => {
  if (!req?.query?.email && !req?.query?.recordType) {
    return res
      .status(500)
      .json({ status: false, message: "Missing E-Mail/recordType" });
  }
  const pipeline = { email:req?.query?.email , recordType: req?.query?.recordType, adminId: req?.adminId };
  const notes = await noteModel.find(pipeline).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, data: notes });
  res.status(500).json({ success: false, error: error.message });
});

// Get a single note by ID
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteModel.findById(req.params.id);
  if (!note) {
    return res.status(404).json({ success: false, error: "Note not found" });
  }
  res.status(200).json({ success: true, data: note });

  res.status(500).json({ success: false, error: error.message });
});

// Update a note by ID
export const updateNote = asyncHandler(async (req, res) => {
  const updatedNote = await noteModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedNote) {
    return res.status(404).json({ success: false, error: "Note not found" });
  }
  res.status(200).json({ success: true, data: updatedNote });

  res.status(400).json({ success: false, error: error.message });
});

// Delete a note by ID
export const deleteNote = asyncHandler(async (req, res) => {
  const deletedNote = await noteModel.findByIdAndDelete(req.params.id);
  if (!deletedNote) {
    return res.status(404).json({ success: false, error: "Note not found" });
  }
  res.status(200).json({ success: true, message: "Note deleted successfully" });

  res.status(500).json({ success: false, error: error.message });
});
