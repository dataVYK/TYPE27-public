import { v4 as uuidv4 } from "uuid";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";

export const CREATE_TICKET = async (req, res) => {
  try {
    const ticketData = {
      ...req.body,
      id: uuidv4()
    };

    const newTicket = new Ticket(ticketData);
    const savedTicket = await newTicket.save();

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: savedTicket
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const BUY_TICKET = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.body.userId });
    const userBalance = user.money_balance;

    const ticketId = req.params.id;

    const ticket = await Ticket.findOne({ id: ticketId });

    if (!ticket)
      return res
        .status(404)
        .json({ message: "Ticket with such id not found." });

    if (userBalance < ticket.ticket_price)
      return res
        .status(400)
        .json({ message: "User does not have enough money for ticket" });

    const updatedUser = await User.findOneAndUpdate(
      { id: req.body.userId },
      {
        $push: { bought_tickets: ticketId },
        $inc: { money_balance: ticket.ticket_price * -1 },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json({ message: "Ticket successfully bought", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "There are issues", error: error });
  }
};