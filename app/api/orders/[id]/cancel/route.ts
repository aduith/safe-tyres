import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const user = await isAuthenticated(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }

        const order = await Order.findOne({
            _id: id,
            user: user._id,
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.orderStatus !== 'pending') {
            return NextResponse.json(
                { success: false, message: 'Only pending orders can be cancelled' },
                { status: 400 }
            );
        }

        order.orderStatus = 'cancelled';
        await order.save();

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully',
            data: {
                order,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error cancelling order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
