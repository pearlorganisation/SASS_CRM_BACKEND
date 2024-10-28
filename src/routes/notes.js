import express from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controller/notes.js";

import { getAdminId } from "../middlewares/getIdMiddleware.js";
import { upload } from "../middlewares/multer.js";

const notesRouter = express.Router();

// Route to create a new note
notesRouter
  .route("/")
  .get(verifyTokenMiddleware, getAdminId, getNotes)
  .post(verifyTokenMiddleware, getAdminId, upload.fields([{ name: "image" }]), createNote);

// Route to get, update, or delete a specific note by ID
notesRouter
  .route("/:id")
  .get(verifyTokenMiddleware, getNoteById)
  .put(verifyTokenMiddleware, updateNote)
  .delete(verifyTokenMiddleware, deleteNote);

export default notesRouter;
