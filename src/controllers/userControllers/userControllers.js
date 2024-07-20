import { NotifyModel, UserModel } from "../../models/userModel.js";
import bcrypt from 'bcrypt';
import { createFireBaseImg } from "../FireBaseControllers/FireBaseControllers.js";
import nodemailer from "nodemailer";

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
        _id: user._id,
        account: user.account,
        avatarURL: user.avatarURL,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        techTags: user.techTags,
        heartNumber: user.heartNumber,
        userPost: user.userPost,
        userResponse: user.userResponse,
        followPost: user.followPost,
        followResponse: user.followResponse,
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
        _id: user._id,
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
        followResponse: user.followResponse,
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
    const { account } = req.query;

    if (!account) {
      res.locals.status = 400;
      res.locals.data = {
        message: "Account query parameter is required",
      };
      return next();
    }

    const user = await UserModel.findOne({ account })
      .select('account avatarURL name email techTags heartNumber userPost userResponse')
      .populate({ path: 'userPost' }) // Adjust the fields to select from Post
      .populate({ path: 'userResponse' }); // Adjust the fields to select from Response

    if (!user) {
      res.locals.status = 404;
      res.locals.data = {
        message: "User not found",
      };
    } else {
      res.locals.status = 200;
      res.locals.data = {
        userResponse: user.userResponse,
        _id: user._id,
        account: user.account,
        avatarURL: user.avatarURL,
        name: user.name,
        email: user.email,
        techTags: user.techTags,
        heartNumber: user.heartNumber,
        userPost: user.userPost,
      };
    }

    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
    return next();
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, techTags, newpassword, jwtAccount } = req.body;
    const account = jwtAccount.account

    // Validate if required fields are provided
    if (!name && !techTags && !newpassword) {
      res.locals.status = 400;
      res.locals.data = {
        message: "Account and at least one field (name, techTags, newpassword) are required for update",
      };
      return next();
    }

    // Construct update object with provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (techTags) updateFields.techTags = techTags;
    if (newpassword) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(newpassword, 10); // You can adjust the salt rounds as needed
      updateFields.password = hashedPassword;
    }

    // Find and update the user by account
    const updatedUser = await UserModel.findOneAndUpdate(
      { account },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.locals.status = 404;
      res.locals.data = {
        message: "User not found",
      };
    } else {
      res.locals.status = 200;
      res.locals.data = {
        message: "Profile updated successfully",
        user: updatedUser,
      };
    }

    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
    return next();
  }
};

export const getUsersSimpleData = async (req, res, next) => {
  try {
    const { number, type, searchVal } = req.query;

    // Handle pagination based on the 'number' parameter
    const skip = (parseInt(number) - 1) * 10;

    // Determine the query and sort condition based on the 'type' parameter
    let sort = {};
    switch (type) {
      case 'Popular':
        sort = { heartNumber: -1 }; // Sort by heartNumber in descending order
        break;
      case 'A-Z':
        sort = { title: 1 }; // Sor enable: truet alphabetically by title
        break;
      case 'New':
        sort = { createdAt: -1 }; // Sort by createdAt in descending order
        break;
      default:
        res.locals.status = 400;
        res.locals.data = {
          message: "Invalid type parameter"
        };
        return next();
    }

    // Execute the query to get the paginated users
    let users = [];
    let totalCount = 0;

    users = await UserModel.find({ roleName: "User" })
      .sort(sort)
      .skip(skip)
      .limit(10)
      .select({
        _id: 1,
        name: 1,
        account: 1,
        avatarURL: 1,
        techTags: 1,
        userPost: 1,
        heartNumber: 1,
      })

    // Execute a separate query to get the total count
    totalCount = users.length

    // Custom filtering based on searchVal
    if (searchVal) {
      users = users.filter(user => {
        const nameMatch = calculateMatchPercentage(user.name, searchVal) > 50;
        const accountMatch = calculateMatchPercentage(user.account, searchVal) > 50;
        return nameMatch || accountMatch;
      });

      totalCount = users.length
    }

    res.locals.status = 200;
    res.locals.data = {
      users: users,
      totalCount: totalCount
    };
    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: "Server Error",
    };
    return next();
  }
};

export const getAllNotify = async (req, res, next) => {
  try {
    const { jwtAccount } = req.body; // Adjust this if the user information is passed differently

    // Find the user by their account
    const user = await UserModel.findOne({ account: jwtAccount.account }).populate({
      path: 'notification',
      populate: [
        { path: 'postId', select: 'title' },
        { path: 'senderId', select: 'account avatarURL' },
      ],
    });

    if (!user) {
      res.locals.status = 401;
      res.locals.data = {
        message: 'Unauthorized',
      };
      return next();
    }

    res.locals.status = 200;
    res.locals.data = {
      notifications: user.notification
    };
    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: 'Server Error',
    };
    return next();
  }
};

export const checkNotify = async (req, res, next) => {
  try {
    const { id } = req.body; // Expecting the notification ID to be provided in the request body

    if (!id) {
      res.locals.status = 400;
      res.locals.data = {
        message: 'Notification ID is required',
      };
      return next();
    }

    // Find and update the notification
    const updatedNotification = await NotifyModel.findByIdAndUpdate(
      id,
      { checked: true },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      res.locals.status = 404;
      res.locals.data = {
        message: 'Notification not found',
      };
      return next();
    }

    res.locals.status = 200;
    res.locals.data = updatedNotification;
    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: 'Server Error',
    };
    return next();
  }
};

function generateRandomPassword() {
  const length = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
}

const mailing = async (subject, text, toGmail) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "venedorshop@gmail.com",
      pass: "nnxmjaopbwiexjpi",
    },
  });

  let details = {
    from: "venedorshop@gmail.com",
    to: toGmail,
    subject: subject,
    text: text,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      return err;
    } else {
      return true;
    }
  });
};

export const createOTPCode = async (req, res, next) => {
  try {
    const { account } = req.body; // Expecting the account identifier to be provided in the request body

    if (!account) {
      res.locals.status = 400;
      res.locals.data = {
        message: 'Account identifier is required',
      };
      return next();
    }

    // Generate OTP
    const otpCode = Math.floor(10000 + Math.random() * 90000);;

    // Find the user by account and update the otpCode
    const updatedUser = await UserModel.findOneAndUpdate(
      { account },
      { otpCode },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      res.locals.status = 404;
      res.locals.data = {
        message: 'User not found',
      };
      return next();
    }

    await mailing("Your OTP code", `OTP: ${otpCode}`, updatedUser.email);

    res.locals.status = 200;
    res.locals.data = "Success"
    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: 'Server Error',
    };
    return next();
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { account, otp } = req.body; // Expecting the account and OTP code to be provided in the request body

    if (!account || otp === undefined) {
      res.locals.status = 400;
      res.locals.data = {
        message: 'Account identifier and OTP code are required',
      };
      return next();
    }

    // Find the user by account
    const user = await UserModel.findOne({ account });

    if (!user) {
      res.locals.status = 404;
      res.locals.data = {
        message: 'User not found',
      };
      return next();
    }

    // Check if the provided OTP matches the stored OTP
    console.log(user.otpCode, otp)
    if (user.otpCode != otp) {
      res.locals.status = 401;
      res.locals.data = {
        message: 'Invalid OTP code',
      };
      return next();
    }

    // Optionally, clear the OTP code after successful verification
    const newPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(newPassword, 10); // You can adjust the salt rounds as needed

    user.password = hashedPassword
    user.otpCode = undefined;
    await user.save();

    await mailing(
      "Your new password code",
      `Password: ${newPassword}`,
      user.email
    );

    res.locals.status = 200;
    res.locals.data = {
      message: 'OTP code verified successfully',
    };
    return next();
  } catch (err) {
    console.error(err);
    res.locals.status = 500;
    res.locals.data = {
      message: 'Server Error',
    };
    return next();
  }
};

// Helper function to calculate the percentage of matching letters
export const calculateMatchPercentage = (str1, str2) => {
  const minLength = Math.min(str1.length, str2.length);
  let matchingCount = 0;

  for (let i = 0; i < minLength; i++) {
    if (str1[i].toLowerCase() === str2[i].toLowerCase()) {
      matchingCount++;
    }
  }

  return (matchingCount / minLength) * 100;
};

