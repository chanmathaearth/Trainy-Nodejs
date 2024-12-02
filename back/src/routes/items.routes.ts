import { Router } from "express";
import { getItems } from "../controllers/ItemController";

const router = Router();

router.get("/", getItems);

export default router;
