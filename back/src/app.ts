import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import createError from "http-errors";
import stockRoutes from "./routes/stocks.routes";
import itemRoutes from "./routes/items.routes";

mongoose
    .connect(
        "mongodb+srv://firmer:FirmerPa55w0rd@firmer-test.ym0ch.mongodb.net/test?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongoDB Connection successful"))
    .catch((err) => console.error(err));

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/items", itemRoutes);
app.use("/stocks", stockRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
