const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

const userJoiSchema = Joi.object({
  name: Joi.string(),
  password: Joi.string().min(6).alphanum().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .required(),
  token: Joi.string(),
});

module.exports = {
  User,
  userJoiSchema,
};
