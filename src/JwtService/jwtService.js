import jwt from "jsonwebtoken";

export const createJWT = (data) => {
  const user = {
    account: data.account,
    roleName: data.roleName,
  };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "4h",
  });
  return accessToken;
};

export const createRefreshToken = (data) => {
  const user = {
    account: data.account,
    roleName: data.roleName,
  };
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "4h",
  });
  return refreshToken;
};

export const authenJWT = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let currentUser = {};
  if (token == null) {
    currentUser.error = {
      status: 401,
      message: "Token is null"
    }
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(token)
          console.log(err)
          currentUser.error = {
            status: 401,
            message: "Token is invalid"
          }
        } else {
          if (req.body.role === undefined || user.roleName === req.body.role) {
            currentUser = user;
            currentUser.refreshToken = true;
          } else {
            currentUser.error = {
              status: 401,
              message: "You don't have permission"
            }
          }
        }
      });
    } else {
      if (req.body.role === undefined || user.roleName === req.body.role) {
        currentUser = user;
      } else {
        currentUser.error = {
          status: 401,
          message: "You don't have permission"
        }
      }
    }
  });
  return currentUser;
};

export const responseWithJWT = async (req, res, obj) => {
  if (req.originalUrl === '/users/login' && res.locals.status === 200) {
    return {
      accessToken: createJWT(res.locals.data),
      refreshToken: createRefreshToken(res.locals.data),
      ...obj
    }
  }

  const user = req.body.jwtAccount
  return req.body.refreshToken && user
    ? {
      accessToken: createJWT(user),
      refreshToken: createRefreshToken(user),
      ...obj
    }
    : {
      ...obj
    };
};

export const handleResponseWithJWTMiddleware = async (req, res) => {
  try {
    const responseVal = await responseWithJWT(req, res, res.locals.data);
    return res.status(res.locals.status).json(responseVal);
  } catch (err) {
    console.log(err)
    // return res.status(500).json(err);
  }
};
