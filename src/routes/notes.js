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


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token  # Specify the cookie name where the token is stored
 *
 * tags:
 *   name: Notes
 *   description: API endpoints for managing notes.
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve all notes for a specific email and record type.
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email associated with the notes.
 *       - in: query
 *         name: recordType
 *         schema:
 *           type: string
 *         required: true
 *         description: Record type of the notes.
 *     responses:
 *       200:
 *         description: Successfully retrieved notes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notes'
 *       500:
 *         description: Missing required email or recordType in query.
 *
 *   post:
 *     summary: Create a new note with optional image upload.
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the note.
 *               recordType:
 *                 type: string
 *                 description: Record type of the note.
 *               note:
 *                 type: string
 *                 description: Content of the note.
 *               phone:
 *                 type: string
 *                 description: Phone number associated with the note.
 *               callDuration:
 *                 type: object
 *                 properties:
 *                   hr:
 *                     type: string
 *                   min:
 *                     type: string
 *                   sec:
 *                     type: string
 *               status:
 *                 type: string
 *                 description: Status of the note.
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional image files.
 *     responses:
 *       200:
 *         description: Note created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notes'
 *       400:
 *         description: Incomplete form data or image upload failure.
 */

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a single note by its ID.
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notes'
 *       404:
 *         description: Note not found.
 *
 *   put:
 *     summary: Update a specific note by ID.
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notes'
 *     responses:
 *       200:
 *         description: Successfully updated note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notes'
 *       404:
 *         description: Note not found.
 *
 *   delete:
 *     summary: Delete a specific note by ID.
 *     tags: [Notes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the note.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Note deleted successfully
 *       404:
 *         description: Note not found.
 */
