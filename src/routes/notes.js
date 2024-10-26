import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from '../controller/notes.js';


const notesRouter = express.Router();

// Route to create a new note
notesRouter.route('/')
  .post(verifyTokenMiddleware, createNote)
  .get(verifyTokenMiddleware, getNotes);

// Route to get, update, or delete a specific note by ID
notesRouter.route('/:id')
  .get(verifyTokenMiddleware, getNoteById)
  .put(verifyTokenMiddleware, updateNote)
  .delete(verifyTokenMiddleware, deleteNote);

export default notesRouter;
