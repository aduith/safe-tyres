import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart, { CartItemDocument } from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        const userId = user?._id;
        const sessionId = req.headers.get('x-session-id');

        const filter: any = userId ? { user: userId } : { sessionId };

        // If neither user nor session, return empty or error?
        // Controller implies one must exist, but if none, we can't find/create.
        // Frontend should send session-id.
        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID or Auth required' },
                { status: 400 }
            );
        }

        let cart = await Cart.findOne(filter).populate('items.product');

        if (!cart) {
            cart = await Cart.create(filter);
        }

        return NextResponse.json({
            success: true,
            data: {
                cart,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { productId, quantity = 1 } = await req.json();
        const user = await isAuthenticated(req);
        const userId = user?._id;
        const sessionId = req.headers.get('x-session-id');

        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID or Auth required' },
                { status: 400 }
            );
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
            );
        }

        const filter: any = userId ? { user: userId } : { sessionId };

        let cart = await Cart.findOne(filter);

        if (!cart) {
            cart = await Cart.create({
                ...filter,
                items: [{ product: productId, quantity }],
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                (item: CartItemDocument) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity } as any);
            }

            await cart.save();
        }

        await cart.populate('items.product');

        return NextResponse.json({
            success: true,
            message: 'Product added to cart',
            data: {
                cart,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error adding to cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const user = await isAuthenticated(req);
        const userId = user?._id;
        const sessionId = req.headers.get('x-session-id');

        if (!userId && !sessionId) {
            return NextResponse.json(
                { success: false, message: 'Session ID or Auth required' },
                { status: 400 }
            );
        }

        const filter: any = userId ? { user: userId } : { sessionId };

        const cart = await Cart.findOne(filter);

        if (!cart) {
            return NextResponse.json(
                { success: false, message: 'Cart not found' },
                { status: 404 }
            );
        }

        cart.items = [];
        await cart.save();

        return NextResponse.json({
            success: true,
            message: 'Cart cleared successfully',
            data: {
                cart,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error clearing cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
