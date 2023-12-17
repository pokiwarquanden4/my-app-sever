import { UserModel } from "../../models/userModel.js";
import bcrypt from 'bcrypt';

//Tạo người dùng
export const createUser = async (req, res, next) => {
  try {
    const { account, avatarURL, name, email, password } = req.body;

    // Check if required fields are missing
    if (!account || !name || !email || !password) {
      res.locals.status = 422
      res.locals.data = {
        message: "Missing required fields"
      }
      next()
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

    // Create the user
    UserModel.create({
      account,
      avatarURL,
      name,
      email,
      password: hashedPassword,
      roleName: "User",
    }).then(() => {
      res.locals.status = 200
      res.locals.data = {
        message: "Create Success"
      }
      next()
    }).catch((error) => {
      switch (error.code) {
        case 11000:
          res.locals.status = 409
          res.locals.data = {
            message: "Duplicate key violation. User already exists",
            duplicateField: Object.keys(error.keyPattern)
          }
          next()
        default:
          res.locals.status = 500
          res.locals.data = {
            message: "Sever Error"
          }
          next()
      }
    });
  } catch (err) {
    res.locals.status = 500
    res.locals.data = {
      message: "Sever Error"
    }
    next()
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
      next()
    }

    // Find the user by account (or any other unique identifier you use for login)
    const user = await UserModel.findOne({ account });

    // Check if the user exists
    if (!user) {
      res.locals.status = 404
      res.locals.data = {
        message: "User not found"
      }
      next()
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      res.locals.status = 200
      res.locals.data = {
        message: "Validate Success",
        account: user.account,
        roleName: user.roleName
      }
      next()
    } else {
      // Passwords do not match
      res.locals.status = 401
      res.locals.data = {
        message: "Invalid credentials"
      }
      next()
    }
  } catch (err) {
    res.locals.status = 500
    res.locals.data = {
      message: "Sever Error"
    }
    next()
  }
};

export const getUser = async (req, res, next) => {
  try {
    console.log(req.body)
  } catch (err) {
    res.locals.status = 500
    res.locals.data = {
      message: "Sever Error"
    }
    next()
  }
};

