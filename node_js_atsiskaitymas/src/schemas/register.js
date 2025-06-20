import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{14,}$/)
    .required(),
  money_balance: Joi.number().min(0).default(0).optional(),
  bought_tickets: Joi.array().items(Joi.string()).default([]).optional()
});

export default registerSchema;