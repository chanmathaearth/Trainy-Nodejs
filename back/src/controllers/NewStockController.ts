import { Request, Response, NextFunction } from "express";
import Stock, { IStock } from "../models/stock.model";
import Item, { IItem } from "../models/item.model";
import { addMinutes, startOfMinute } from "date-fns";

export const getStocks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stocks = await Stock.find().lean<IStock[]>();
        const item_id = stocks.map((stock) => stock.item_code);
        const items = await Item.find({ _id: { $in: item_id } }).select("name").lean<IItem[]>();

        const itemMap = new Map(items.map((item) => [item._id.toString(), item.name]));

        const populatedStocks = stocks
            .map((stock) => ({
                stock: {
                    lot: stock.lot,
                    amount: stock.amount,
                    import_datetime: stock.import_datetime,
                    exp_datetime: stock.exp_datetime,
                    note: stock.note,
                },
                items: {
                    name: itemMap.get(stock.item_code.toString()),
                },
            }))
            .filter((entry) => entry.items.name);

        res.json(populatedStocks);
    } catch (err) {
        next(err);
    }
};

export const filterStocks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, lot, import_datetime, exp_datetime } = req.body;
        const items = name
            ? await Item.find({ name: { $regex: name, $options: "i" } })
                  .select("_id name")
                  .lean<IItem[]>()
            : await Item.find().select("_id name").lean<IItem[]>();

        const itemMap = new Map(items.map((item) => [item._id.toString(), item]));
        const item_id = Array.from(itemMap.keys());
        // Dayjs
        const stockFilter: Partial<Record<keyof IStock, any>> = {
            ...(lot && { lot: Number(lot) }),
            ...(import_datetime && {
                import_datetime: {
                    $gte: startOfMinute(new Date(import_datetime)), // เริ่มต้นนาที
                    $lt: addMinutes(startOfMinute(new Date(import_datetime)), 1), // สิ้นสุดนาที
                },
            }),
            ...(exp_datetime
                ? {
                      exp_datetime: {
                          $gte: startOfMinute(new Date(exp_datetime)), // เริ่มต้นนาที
                          $lt: addMinutes(startOfMinute(new Date(exp_datetime)), 1), // สิ้นสุดนาที
                      },
                  }
                : {
                      exp_datetime: { $gte: new Date() }, // ค่า default หาก exp_datetime ไม่ได้ถูกระบุ
                  }),
            ...(name && { item_code: { $in: item_id } }),
        };

        const stocks: IStock[] = await Stock.find(stockFilter).lean<IStock[]>();
        const result = stocks
            .map((stock) => {
                const item = itemMap.get(stock.item_code.toString());
                if (!item) return null;

                return {
                    stock: {
                        lot: stock.lot,
                        amount: stock.amount,
                        import_datetime: stock.import_datetime,
                        exp_datetime: stock.exp_datetime,
                        note: stock.note,
                    },
                    items: {
                        name: item.name,
                    },
                };
            })
            .filter(Boolean);

        res.json(result);
    } catch (err) {
        next(err);
    }
};
