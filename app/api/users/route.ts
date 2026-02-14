import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching users', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
