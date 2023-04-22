import { Router } from "express";
import { getProfile, login, logout, signUp, forgotPassword, resetPassword } from "../controllers/auth.controller";
import {  isLoggedIn } from "../middlewares/auth.middleware";



const router = Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/logout", logout)

router.post("/password/forgot/", forgotPassword)
router.post("/password/reset/:token", resetPassword)

router.get("/profile", isLoggedIn, getProfile)


export default router;