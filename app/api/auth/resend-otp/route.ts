import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Find existing unverified user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { success: false, message: 'Account is already verified' },
                { status: 400 }
            );
        }

        // Generate new 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP Email
        const { sendOTP } = await import('@/lib/email');
        const emailResult = await sendOTP(email, otp);

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, message: 'Error sending verification email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'A new verification code has been sent to your email.',
        });

    } catch (error: any) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error resending verification code',
                error: error.message
            },
            { status: 500 }
        );
    }
}
