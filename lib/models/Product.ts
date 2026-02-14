import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description?: string;
    size: string;
    price: number;
    image: string;
    stock: number;
    popular: boolean;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        size: {
            type: String,
            required: [true, 'Product size is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        image: {
            type: String,
            required: [true, 'Product image is required'],
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, 'Stock cannot be negative'],
        },
        popular: {
            type: Boolean,
            default: false,
        },
        features: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
