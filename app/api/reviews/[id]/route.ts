import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/lib/models/Review';
import { isAuthenticated, isAdmin } from '@/lib/auth';

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

        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return NextResponse.json(
                { success: false, message: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete review', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
