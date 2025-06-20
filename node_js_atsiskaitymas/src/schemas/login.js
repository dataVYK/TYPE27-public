import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().pattern(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/).required(),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{14,}$/).required(),
});

export default loginSchema;