import mongoose from "mongoose";

const notifiSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    responseId: {
      type: String,
    },
    commentId: {
      type: String,
    },
    details: {
      sender: {
        type: String,
        required: true,
      },
      postName: {
        type: String,
      },
      content: {
        type: String,
      },
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
      type: Array,
      default: [],
    },

  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
export const NotifyModel = mongoose.model("Notify", notifiSchema);
