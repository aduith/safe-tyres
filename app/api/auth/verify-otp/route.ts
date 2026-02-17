import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Please provide email and OTP' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: 'User is already verified' },
                { status: 400 }
            );
        }

        // Validate OTP
        if (user.otp !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (user.otpExpires && new Date() > user.otpExpires) {
            return NextResponse.json(
                { success: false, message: 'Verification code has expired' },
                { status: 400 }
            );
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token for immediate login
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
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
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Error verifying OTP', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
