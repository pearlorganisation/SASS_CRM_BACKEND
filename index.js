import dotenv from "dotenv";
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


dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://saas-crm-nine.vercel.app",
          ],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,
          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
      : {
          origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://saas-crm-nine.vercel.app",
          ],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,

          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);

// routes
app.use("/api/v1/attendee", attendeesRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/roles", rolesRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/plans", planRouter)
app.use("/api/v1/employee", employeeRouter)
app.use("/api/v1/globalData", globalDataRouter)


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
  syncIndexes()
  mongoConnect();
});
