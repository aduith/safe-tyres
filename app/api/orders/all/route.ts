import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const filter: any = {};
        if (status) {
            filter.orderStatus = status;
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email')
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
