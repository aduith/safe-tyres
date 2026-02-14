import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const reviews = await Review.find({ status: 'approved' })
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
