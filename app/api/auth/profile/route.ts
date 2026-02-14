import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                user,
            },
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching profile', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not authenticated' },
                { status: 401 }
            );
        }

        const { name, phone, address } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser,
            },
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating profile', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
