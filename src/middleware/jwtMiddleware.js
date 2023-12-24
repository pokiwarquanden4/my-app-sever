import { checkConfigJWT } from "../config/routesConfig.js";
import { authenJWT } from "../JwtService/jwtService.js";

const jwtMiddleware = async (req, res, next) => {
  try {
    const config = checkConfigJWT(req.originalUrl);
    if (config.jwt) {
      req.body.role = config.role;
      const user = await authenJWT(req, res);

      if (user && !user.error) {
        if (!user.refreshToken) {
          req.body = {
            ...req.body,
            jwtAccount: user,
          };
        } else {
          req.body = {
            ...req.body,
            jwtAccount: user,
            refreshToken: user.refreshToken,
          };
        }
      }

      if (user.error) {
        return res.status(user.error.status).json(user.error.message);
      }
    }
    return next();
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
};

export const jwtMiddlewareController = async (req, res, next) => {
  return await jwtMiddleware(req, res, next);
};
