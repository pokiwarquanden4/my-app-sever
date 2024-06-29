import { UserModel } from "../../models/userModel.js";
import bcrypt from 'bcrypt';
import { createFireBaseImg } from "../FireBaseControllers/FireBaseControllers.js";

//Tạo người dùng
export const createUser = async (req, res, next) => {
  try {
    const { account, name, email, password, techTags } = req.body;

    // Check if required fields are missing
    if (!account || !name || !email || !password || !techTags) {
      res.locals.status = 422
      res.locals.data = {
        message: "Missing required field"
      }
      return next()
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

    // Create the user
    const avatarURL = await createFireBaseImg(account, req.file)
    UserModel.create({
      account,
      avatarURL,
      name,
      email,
      techTags,
      password: hashedPassword,
      roleName: "User",
    }).then(() => {
      res.locals.status = 200
      res.locals.data = {
        message: "Create Success"
      }
      return next()
    }).catch((error) => {
      switch (error.code) {
        case 11000:
          res.locals.status = 409
          res.locals.data = {
            message: "Duplicate key violation. User already exists",
            duplicateField: Object.keys(error.keyPattern)
          }
          return next()
        default:
          res.locals.status = 500
          res.locals.data = {
            message: "Sever Error"
          }
          return next()
      }
    });
  } catch (err) {
    console.log(err)
    res.locals.status = 500
    res.locals.data = {
      message: "Sever Error"
    }
    return next()
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { account, password } = req.body;

    // Check if required fields are missing
    if (!account || !password) {
      res.locals.status = 422
      res.locals.data = {
        message: "Missing required fields"
      }
      return next()
    }

    // Find the user by account (or any other unique identifier you use for login)
    const user = await UserModel.findOne({ account });

    // Check if the user exists
    if (!user) {
      res.locals.status = 404
      res.locals.data = {
        message: "User not found"
      }
      return next()
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      res.locals.status = 200
      res.locals.data = {
        message: "Validate Success",
        account: user.account,
        avatarURL: user.avatarURL,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        heartNumber: user.heartNumber,
        userPost: user.userPost,
        followPost: user.followPost,
        followAnswer: user.followAnswer,
        notification: user.notification,
      }
      return next()
    } else {
      // Passwords do not match
      res.locals.status = 401
      res.locals.data = {
        message: "Invalid credentials"
      }
      return next()
    }
  } catch (err) {
    res.locals.status = 500
    res.locals.data = {
      message: "Sever Error"
    }
    return next()
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { account } = req.body;

    // Assuming UserModel has a method like findOne to find a user by account
    const user = await UserModel.findOne({ account });

    if (!user) {
      res.locals.status = 404;
      res.locals.data = {
        message: "User not found",
      };
    } else {
      res.locals.status = 200;
      res.locals.data = {
        message: "Success",
        account: user.account,
        avatarURL: user.avatarURL,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        techTags: user.techTags,
        heartNumber: user.heartNumber,
        userPost: user.userPost,
      };
    }
  } catch (err) {
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
  }
  return next();
};

export const getUserDetails = async (req, res, next) => {
  try {
    const account = req.body.jwtAccount.account

    // Assuming UserModel has a method like findOne to find a user by account
    const user = await UserModel.findOne({ account });

    if (!user) {
      res.locals.status = 404;
      res.locals.data = {
        message: "User not found",
      };
    } else {
      res.locals.status = 200;
      res.locals.data = {
        message: "Success",
        account: user.account,
        avatarURL: user.avatarURL,
        name: user.name,
        email: user.email,
        techTags: user.techTags,
        roleName: user.roleName,
        heartNumber: user.heartNumber,
        userPost: user.userPost,
        followPost: user.followPost,
        followAnswer: user.followAnswer,
        notification: user.notification,
      };
    }
  } catch (err) {
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
  }
  return next();
};

export const getProfile = async (req, res, next) => {
  try {
    const { account } = req.query


  } catch (err) {
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
  }
  return next();
};

