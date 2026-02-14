import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    name: string;
    email: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating must be at most 5'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
reviewSchema.index({ status: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
