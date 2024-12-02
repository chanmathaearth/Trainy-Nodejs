import { Router } from "express";
import {
    getStocks,
    filterStocks,
} from "../controllers/NewStockController";

const router = Router();

router.get("/", getStocks);
router.post("/filter", filterStocks);

export default router;
