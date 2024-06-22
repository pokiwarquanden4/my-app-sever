import adminRoutes from "./adminRoutes.js";
import postRoutes from "./postRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = (app) => {
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/admin", adminRoutes);
};

export default routes;
