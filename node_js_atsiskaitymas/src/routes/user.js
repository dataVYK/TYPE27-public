import express from "express";
import auth from "../middlewares/auth.js";
import validation from "../middlewares/validation.js";
import registerSchema from "../schemas/register.js";
import loginSchema from "../schemas/login.js";
import refreshTokenSchema from "../schemas/refresh_token.js";
import {
  REGISTER_USER,
  LOGIN_USER,
  REFRESH_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS
} from "../controllers/user.js";

const router = express.Router();

router.post("/signUp", validation(registerSchema), REGISTER_USER);

router.post("/login", validation(loginSchema), LOGIN_USER);

router.post("/loginRefresh", validation(refreshTokenSchema), REFRESH_TOKEN);

router.get("/", auth, GET_ALL_USERS);

router.get("/:id", auth, GET_USER_BY_ID);

router.get("/withTickets", auth, GET_ALL_USERS_WITH_TICKETS);

router.get("/withTickets:id", auth, GET_USER_BY_ID_WITH_TICKETS);

export default router;