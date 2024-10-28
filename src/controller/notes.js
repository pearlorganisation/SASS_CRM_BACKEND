import noteModel from "../models/notes";
import { asyncHandler } from "../utils/errorHandler/asyncHandler";

const ROLES = JSON.parse(process.env.ROLES);

// Create a new note
export const createNote = asyncHandler(async (req, res) => {
  const newNote = await noteModel.create(req.body);
  res.status(200).json({ success: true, data: newNote });

  res.status(400).json({ success: false, error: error.message });
});

// Get all notes
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteModel.find();
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
