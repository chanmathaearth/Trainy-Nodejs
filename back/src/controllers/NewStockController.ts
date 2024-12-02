import { Request, Response, NextFunction } from "express";
import Stock, { IStock } from "../models/stock.model";
import Item, { IItem } from "../models/item.model";

export const getStocks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const stocks: IStock[] = await Stock.find().lean<IStock[]>();

        const populatedStocks = (
            await Promise.all(
                stocks.map(async (stock) => {
                    if (!stock.item_code) return null;
                    const itemDetails: IItem | null = await Item.findById(
                        stock.item_code
                    ).lean<IItem>();
                    if (!itemDetails) return null;

                    return {
                        stock: {
                            lot: stock.lot,
                            amount: stock.amount,
                            import_datetime: stock.import_datetime,
                            exp_datetime: stock.exp_datetime,
                            note: stock.note,
                        },
                        items: {
                            name: itemDetails.name,
                        },
                    };
                })
            )
        ).filter(Boolean);

        res.json(populatedStocks);
    } catch (err) {
        next(err);
    }
};

// Filter stocks
export const filterStocks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, lot, import_datetime, exp_datetime } = req.body;

        const item_code_id: string[] = name
            ? (await Item.find({ name }).select("_id").lean()).map((item) =>
                  item._id.toString()
              )
            : [];

        const stockFilter: Partial<Record<keyof IStock, any>> = {
            ...(lot && { lot: Number(lot) }),
            ...(import_datetime && {
                import_datetime: {
                    $gte: new Date(new Date(import_datetime).setSeconds(0, 0)),
                    $lt: new Date(
                        new Date(import_datetime).setSeconds(0, 0) + 60 * 1000
                    ),
                },
            }),
            ...(exp_datetime
                ? {
                      exp_datetime: {
                          $gte: new Date(
                              new Date(exp_datetime).setSeconds(0, 0)
                          ),
                          $lt: new Date(
                              new Date(exp_datetime).setSeconds(0, 0) +
                                  60 * 1000
                          ),
                      },
                  }
                : {
                      exp_datetime: { $gte: new Date() },
                  }),
            ...(name && { item_code: { $in: item_code_id } }),
        };

        const stocks: IStock[] = await Stock.find(stockFilter).lean<IStock[]>();

        const result = (
            await Promise.all(
                stocks.map(async (stock) => {
                    const item: IItem | null = await Item.findById(
                        stock.item_code
                    )
                        .select("name")
                        .lean<IItem>();
                    return item
                        ? {
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
                          }
                        : null;
                })
            )
        ).filter(Boolean);

        res.json(result);
    } catch (err) {
        next(err);
    }
};
