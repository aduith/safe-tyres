import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';
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

        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            filter.status = status;
        }

        const reviews = await Review.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v');

        return NextResponse.json({
            success: true,
            count: reviews.length,
            data: { reviews },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch reviews', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
