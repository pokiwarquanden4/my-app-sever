import mongoose from "mongoose";

const notifiModel = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    responseId: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    avatarURL: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    roleName: {
      type: String,
      require: true,
    },
    heartNumber: {
      type: Number,
      default: 0,
    },
    userPost: {
      type: Array,
      default: [],
    },
    followPost: {
      type: Array,
      default: [],
    },
    followAnswer: {
      type: Array,
      default: [],
    },
    notification: {
      type: notifiModel
    }

  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
