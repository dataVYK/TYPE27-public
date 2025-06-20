import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./src/routes/user.js";
import ticketRoutes from "./src/routes/ticket.js";


const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Connected to DB!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    message: "This endpoint does not exist",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});
