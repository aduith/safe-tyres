import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectDB();

        const dbStatus = mongoose.connection.readyState;
        const dbName = mongoose.connection.name;
        const host = mongoose.connection.host;

        const statusMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        return NextResponse.json({
            success: true,
            message: 'Database connection check complete',
            data: {
                status: statusMap[dbStatus as keyof typeof statusMap] || 'unknown',
                database: dbName,
                host: host,
                env_uri_exists: !!process.env.MONGODB_URI,
                env_api_url: process.env.NEXT_PUBLIC_API_URL || 'relative (empty)',
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            env_uri_exists: !!process.env.MONGODB_URI,
        }, { status: 500 });
    }
}
