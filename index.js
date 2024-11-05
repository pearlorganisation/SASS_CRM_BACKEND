import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { mongoConnect, syncIndexes } from "./src/config/db.js";
import attendeesRouter from "./src/routes/attendees.js";
import rolesRouter from "./src/routes/roles.js";

import cors from "cors";
import authRouter from "./src/routes/auth.js";
import usersRouter from "./src/routes/users.js";
import cookieParser from "cookie-parser";
import planRouter from "./src/routes/plans.js";
import productRouter from "./src/routes/product.js";
import employeeRouter from "./src/routes/employee.js";
import globalDataRouter from "./src/routes/globalData.js";
import customSettingsRouter from "./src/routes/customSettings.js";
import notesRouter from "./src/routes/notes.js";

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

//socket
import {Server as SocketIOServer} from 'socket.io'
import http from 'http'
import userActivityRouter from "./src/routes/userActivity.js";


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://saas-crm-nine.vercel.app",
  "https://saas-crm-frontend.vercel.app",
]


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SAAS CRM API",
      version: "1.0.0",
      description: "API Documentation for SAAS CRM",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);

const PORT = process.env.PORT || 8000;
const app = express();

// creating http server
const server = http.createServer(app);
// initiating socket server
const io = new SocketIOServer(server, {
  cors: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
},
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: allowedOrigins,
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-csrf-token",
            "x-www-form-urlencoded",
          ],
          credentials: true,
          // maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
      : {
          origin: allowedOrigins,
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-csrf-token",
            "x-www-form-urlencoded",
          ],
          credentials: true,

          // maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);

// routes
app.use("/api/v1/attendee", attendeesRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/roles", rolesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/globalData", globalDataRouter);
app.use("/api/v1/customSettings", customSettingsRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/userActivity", userActivityRouter);


app.get("/", (req, res) => {
  res.send("Server is running!");
});


// =======================Socket starts=======================

io.on("connection", (socket) => {
  console.log(`A user has connected to socket, their ID ${socket.id}`);
  
  

  socket.on("disconnect", () => {
    console.log(`User with id ${socket.id} has disconnected`);
  });
});

// =======================Socket ends=======================


server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
  syncIndexes();
  mongoConnect();
});
