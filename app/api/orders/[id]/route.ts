import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const order = await Order.findById(id).populate('items.product');

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Check ownership or admin
        if (order.user.toString() !== user._id.toString() && !isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized to view this order' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                order,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const user = await isAuthenticated(req);
        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const { orderStatus, paymentStatus } = await req.json();

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus, paymentStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                order,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error updating order status', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const user = await isAuthenticated(req);
        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error deleting order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
