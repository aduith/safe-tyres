import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
}

interface IShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface ICustomerInfo {
    name: string;
    email: string;
    phone?: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    customerInfo: ICustomerInfo;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        customerInfo: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: false,
            },
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'card',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
