import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const currentUser = await isAuthenticated(req);
        if (!currentUser || !isAdmin(currentUser)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const { role } = await req.json();

        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json(
                { success: false, message: 'Invalid role. Must be "user" or "admin"' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'User role updated successfully',
            data: {
                user,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error updating user role', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
