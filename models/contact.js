const { Schema, SchemaTypes, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    phone: {
      type: String,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const newContactSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  phone: Joi.number().integer().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum(),
  phone: Joi.number().integer(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  newContactSchema,
  updateContactSchema,
};
