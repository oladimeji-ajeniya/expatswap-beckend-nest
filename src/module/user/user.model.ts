// user.model.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => /\S+@\S+\.\S+/.test(v),
      message: (props: { value: string }) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(v),
      message: (props: { value: string }) =>
        'Password must contain at least one lowercase letter, one uppercase letter, one number, one symbol, and be at least 8 characters long!',
    },
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
});

export default userSchema;
