import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, rating, comment } = await req.json();

        const review = await Review.create({
            name,
            email,
            rating,
            comment,
            status: 'pending',
        });

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully! It will be visible after approval.',
            data: { review },
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to submit review', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}
