import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });

        response.cookies.set({
            name: 'token',
            value: '',
            httpOnly: true,
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error logging out' },
            { status: 500 }
        );
    }
}
