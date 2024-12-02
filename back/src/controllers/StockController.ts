// import { Request, Response, NextFunction } from 'express';
// import Stock, { IStock } from '../models/stock.model';

// export const getStocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const stocks: Array<IStock & { item_code: { name: string } }> = await Stock.find()
//             .populate('item_code', 'name')
//             .lean<IStock[]>();
//         res.json(stocks);
//     } catch (err) {
//         next(err); // Pass the error to the error handling middleware
//     }
// };
