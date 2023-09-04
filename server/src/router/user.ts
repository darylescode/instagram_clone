import express from "express";
import { findUser, findUsername, userData } from "../controller/user";
const router = express.Router();

router.get("/", userData);
router.get("/search/:person", findUser);
router.get("/:username", findUsername);

export default router;
