import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { isAuthenticated, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const popular = searchParams.get('popular');
        const size = searchParams.get('size');

        // Build filter
        const filter: any = {};
        if (popular === 'true') {
            filter.popular = true;
        }
        if (size) {
            filter.size = size;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: products.length,
            data: {
                products,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching products', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const product = await Product.create(body);

        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            data: {
                product,
            },
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating product', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
