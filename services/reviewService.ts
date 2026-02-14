import apiClient from '@/lib/apiClient';

export interface Review {
    _id: string;
    name: string;
    email: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface SubmitReviewData {
    name: string;
    email: string;
    rating: number;
    comment: string;
}

class ReviewService {
    // Submit a new review (public)
    async submitReview(data: SubmitReviewData): Promise<Review> {
        const response = await apiClient.post('/reviews', data);
        return response.data.data.review;
    }

    // Get approved reviews (public)
    async getApprovedReviews(): Promise<Review[]> {
        const response = await apiClient.get('/reviews/approved');
        return response.data.data.reviews;
    }
}

export default new ReviewService();
