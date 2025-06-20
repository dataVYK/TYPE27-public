import express from "express";
import auth from "../middlewares/auth.js";
import validation from "../middlewares/validation.js";
import ticketSchema from "../schemas/ticket.js";
import {
  CREATE_TICKET,
  BUY_TICKET
} from "../controllers/ticket.js";

const router = express.Router();

router.post("/insert", validation(ticketSchema), auth, CREATE_TICKET);

router.post("/buy/:id", auth, BUY_TICKET);



export default router;