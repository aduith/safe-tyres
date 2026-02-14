import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart, { CartItemDocument } from '@/lib/models/Cart';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
    try {
        await connectDB();
        const { itemId } = await params;
        const { quantity } = await req.json();

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

        const item = cart.items.find((item: CartItemDocument) => item._id?.toString() === itemId);

        if (!item) {
            return NextResponse.json(
                { success: false, message: 'Item not found in cart' },
                { status: 404 }
            );
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter((item: CartItemDocument) => item._id?.toString() !== itemId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');

        return NextResponse.json({
            success: true,
            message: 'Cart updated successfully',
            data: {
                cart,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error updating cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
    try {
        await connectDB();
        const { itemId } = await params;

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

        cart.items = cart.items.filter((item: CartItemDocument) => item._id?.toString() !== itemId);

        await cart.save();
        await cart.populate('items.product');

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart',
            data: {
                cart,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error removing from cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
