import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, password, phone, address } = await req.json();

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide name, email and password' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        // If user exists and is already verified, prevent registration
        if (existingUser && existingUser.isVerified) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user;
        if (existingUser) {
            // Update existing unverified user with new OTP
            existingUser.name = name;
            existingUser.password = password;
            existingUser.phone = phone;
            existingUser.address = address;
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            user = await existingUser.save();
        } else {
            // Create new user (unverified)
            user = await User.create({
                name,
                email,
                password,
                phone,
                address,
                isVerified: false,
                otp,
                otpExpires,
            });
        }

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
            message: 'A verification code has been sent to your email.',
            data: {
                email: user.email,
                otpSent: true
            },
        }, { status: 201 });

    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error registering user',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
