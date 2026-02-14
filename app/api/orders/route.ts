import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }

        const orders = await Order.find({ user: user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: orders.length,
            data: {
                orders,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching orders', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }

        const { items, shippingAddress, paymentMethod } = await req.json();

        // Validate and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, message: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                size: product.size,
                quantity: item.quantity,
                price: product.price,
            });

            totalAmount += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: user._id,
            customerInfo: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
            },
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'card',
        });

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: user._id },
            { items: [] }
        );

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            data: {
                order,
            },
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
