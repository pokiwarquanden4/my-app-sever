import { checkConfigJWT } from "../config/routesConfig.js";
import { authenJWT } from "../JwtService/jwtService.js";

const jwtMiddleware = async (req, res, next) => {
  try {
    const config = checkConfigJWT(req.originalUrl);
    if (config.jwt) {
      req.body.role = config.role;
      const user = await authenJWT(req, res);

      if (user) {
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
    }
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

export const jwtMiddlewareController = async (req, res, next) => {
  return await jwtMiddleware(req, res, next);
};
