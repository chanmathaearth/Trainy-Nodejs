import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
    item_code: mongoose.Types.ObjectId;
    lot: number;
    amount: number;
    import_datetime: Date;
    exp_datetime: Date;
    note: string;
}

const StockSchema: Schema = new Schema({
    item_code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    lot: { type: Number, required: true },
    amount: { type: Number, required: true },
    import_datetime: { type: Date, required: true },
    exp_datetime: { type: Date, required: true },
    note: { type: String, default: "" },
});

export default mongoose.model<IStock>("Stock", StockSchema, "stock");
