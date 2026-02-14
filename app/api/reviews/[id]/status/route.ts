import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const { status } = await req.json();

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { success: false, message: 'Invalid status' },
                { status: 400 }
            );
        }

        const review = await Review.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Review ${status} successfully`,
            data: { review },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update review status', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}
