import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://pokiwarquanden4:12345@cluster0.vdzhhat.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("DTB connected");
  } catch (err) {
    console.log(err);
  }
};

export default connect;
