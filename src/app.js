import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import Handlebars from "handlebars";

import { rootDir } from "./utils/utils.js";
import { connectMongo } from "./config/mongo.js";
import initializePassport from "./config/passport.config.js";
import { errorHandler } from "./middlewares/errors.middleware.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";

dotenv.config();
const app = express();

/* DATABASE */
connectMongo();

/* HANDLEBARS */
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(rootDir, "views"));

Handlebars.registerHelper("multiply", (a, b) => a * b);

/* MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

/* COOKIES + PASSPORT */
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use((req, res, next) => {
   if (req.user) {
      res.locals.user = {
         email: req.user.email,
         role: req.user.role
      };
   } else {
      res.locals.user = null;
   }
   next();
});

/* API ROUTES */
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

/* VIEWS ROUTES */
app.use("/", viewsRouter);

/* ERROR HANDLER */
app.use(errorHandler);

export default app;