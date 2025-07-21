import express from "express";
import {
  signUp,
  login,
  logout,
} from '../controllers/authController.js';
import { validate } from "../middlewares/validate.js";
import { loginSchema, signUpSchema } from '../validators/authValidator.js';
import { authenticate } from "../middlewares/authmiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
const router = express.Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/signin', validate(loginSchema), login);
router.get('/logout', logout);


export default router;