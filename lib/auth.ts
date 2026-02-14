import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import User, { IUser } from './models/User';
import connectDB from './db';

export const isAuthenticated = async (req: NextRequest) => {
    await connectDB();

    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);
        return user;
    } catch (error) {
        return null;
    }
};

export const isAdmin = (user: IUser) => {
    return user && user.role === 'admin';
};
