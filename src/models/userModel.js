import mongoose, { Schema } from "mongoose";

const notifiSchema = new mongoose.Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      require: true
    },
    responseId: {
      type: Schema.Types.ObjectId,
      ref: 'Response'
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
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
    techTags: {
      type: Array,
      default: []
    },
    heartNumber: {
      type: Number,
      default: 0,
    },
    userPost: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
    followPost: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }],
    followResponse: [{
      type: Schema.Types.ObjectId,
      ref: 'Response'
    }],
    userResponse: [{
      type: Schema.Types.ObjectId,
      ref: 'Response'
    }],
    notification: [{
      type: Schema.Types.ObjectId,
      ref: 'Notify'
    }],
    otpCode: {
      type: Number
    }

  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
export const NotifyModel = mongoose.model("Notify", notifiSchema);
