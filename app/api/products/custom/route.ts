import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { size, price, name, image } = await req.json();

        // Check if custom product already exists
        const existingProduct = await Product.findOne({
            name,
            size,
            price
        });

        if (existingProduct) {
            return NextResponse.json({
                success: true,
                data: {
                    product: existingProduct,
                },
            });
        }

        // Create new custom product
        const product = await Product.create({
            name,
            size,
            price,
            image: image || '/product-image.jpg',
            stock: 9999, // High stock for custom sizes
            popular: false,
        });

        return NextResponse.json({
            success: true,
            message: 'Custom product created',
            data: {
                product,
            },
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating custom product', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
