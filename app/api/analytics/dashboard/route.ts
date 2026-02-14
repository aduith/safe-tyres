import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
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

        // Get total counts
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get order status breakdown
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id customerInfo totalAmount orderStatus createdAt');

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    totalRevenue,
                    totalUsers,
                    totalProducts,
                },
                ordersByStatus,
                recentOrders,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching dashboard stats', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
