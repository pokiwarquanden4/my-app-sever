import postRoutes from "./postRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = (app) => {
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);
};

export default routes;
