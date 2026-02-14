import mongoose, { Document, Schema } from 'mongoose';

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

// Type for cart items as they exist in the database (with _id)
export type CartItemDocument = ICartItem & { _id: mongoose.Types.ObjectId };

export interface ICart extends Document {
    user?: mongoose.Types.ObjectId;
    sessionId?: string;
    items: CartItemDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        sessionId: {
            type: String,
            trim: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Ensure either user or sessionId is present
cartSchema.pre('save', async function (this: ICart) {
    if (!this.user && !this.sessionId) {
        throw new Error('Cart must have either a user or sessionId');
    }
} as any);

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
