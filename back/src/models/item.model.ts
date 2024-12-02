import mongoose, { Schema, Document, Types } from "mongoose";

export interface IItem extends Document {
    _id: Types.ObjectId;
    name: string;
    expire_in: number;
    expire_in_type: string;
    description?: string; // Optional field
}
const ItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    expire_in: { type: Number, required: true },
    expire_in_type: { type: String, required: true },
    description: { type: String, required: false }, // New field added here
});

export default mongoose.model<IItem>("Item", ItemSchema, "item");
