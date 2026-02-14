import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Error logging in', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
