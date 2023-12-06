import Joi from "joi";

const dataSchema = Joi.object({
  name: Joi.string().required().max(255),
  age: Joi.number().integer().min(0).required(),
});

export default dataSchema;
