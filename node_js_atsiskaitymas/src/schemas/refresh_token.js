import Joi from "joi";

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required()
})

export default refreshTokenSchema;