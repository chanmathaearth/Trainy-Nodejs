import { Request, Response, NextFunction } from "express";
import Item, { IItem } from "../models/item.model";

export const getItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const items: IItem[] = await Item.find().lean<IItem[]>();
        res.json(items);
    } catch (err) {
        next(err);
    }
};
