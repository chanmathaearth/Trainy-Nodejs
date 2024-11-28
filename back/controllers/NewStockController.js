const Stock = require('../models/Stock');
const Item = require('../models/Item');

exports.getStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find().lean();

        const populatedStocks = await Promise.all(
            stocks.map(async (stock) => {
                if (!stock.item_code) return null;
                const itemDetails = await Item.findById(stock.item_code).lean();
                if (!itemDetails) return null;
        
                return {
                    stock: {
                        lot: stock.lot,
                        amount: stock.amount,
                        import_datetime: stock.import_datetime,
                        exp_datetime: stock.exp_datetime,
                        note: stock.note
                    },
                    items: {
                        name: itemDetails.name
                    }
                };
            })
        ).then((results) => results.filter((entry) => entry !== null));       
        res.json(populatedStocks);
    } catch (err) {
        next(err);
    }
};

exports.filterStocks = async (req, res, next) => {
    try {
        const { name, lot, import_datetime, exp_datetime } = req.body;

        const item_code_id = name ? (await Item.find({ name }).select("_id").lean()).map((item) => item._id): [];
        const stockFilter = {
            ...(lot && { lot: Number(lot) }),
            ...(import_datetime && {
                import_datetime: {
                    $gte: new Date(new Date(import_datetime).setSeconds(0, 0)),
                    $lt: new Date(new Date(import_datetime).setSeconds(0, 0) + 60 * 1000)
                }
            }),
            ...(exp_datetime
                ? {
                      exp_datetime: {
                          $gte: new Date(new Date(exp_datetime).setSeconds(0, 0)),
                          $lt: new Date(new Date(exp_datetime).setSeconds(0, 0) + 60 * 1000)
                      }
                  }
                : {
                      exp_datetime: { $gte: new Date() }
                  }),
            ...(name && { item_code: { $in: item_code_id } })
        };
        
        const stocks = await Stock.find(stockFilter).lean();
        const result = await Promise.all(
            stocks.map(async (stock) => {
                const item = await Item.findById(stock.item_code).select("name").lean();
                return item ? {
                    stock: {
                        lot: stock.lot,
                        amount: stock.amount,
                        import_datetime: stock.import_datetime,
                        exp_datetime: stock.exp_datetime,
                        note: stock.note
                    },
                    items: {
                        name: item.name
                    }
                } : null;
            })
        );
        res.json(result.filter(Boolean));
    } catch (err) {
        next(err);
    }
};
