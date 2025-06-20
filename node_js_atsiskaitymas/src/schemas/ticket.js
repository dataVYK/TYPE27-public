import Joi from "joi";

const ticketSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  ticket_price: Joi.number().min(1).required(),
  from_location: Joi.string().min(2).max(100).required(),
  to_location: Joi.string().min(2).max(100).required(),
  to_location_photo_url: Joi.string().uri().allow('').optional(),
});

export default ticketSchema;