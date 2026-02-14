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

import { writeFile } from 'fs/promises';
import path from 'path';

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

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const size = formData.get('size') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const stock = parseInt(formData.get('stock') as string);
        const popular = formData.get('popular') === 'true';
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json(
                { success: false, message: 'Image is required' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = imageFile.name.replaceAll(' ', '_');
        const relativePath = `/assets/${filename}`;
        const absolutePath = path.join(process.cwd(), 'public', 'assets', filename);

        await writeFile(absolutePath, buffer);

        const product = await Product.create({
            name,
            size,
            price,
            description,
            stock,
            popular,
            image: relativePath,
        });

        return NextResponse.json({
            success: true,
            message: 'Product created successfully',
            data: {
                product,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, message: 'Error creating product', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
