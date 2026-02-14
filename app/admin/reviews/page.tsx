'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllReviews(filter === 'all' ? undefined : filter);
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await adminService.updateReviewStatus(reviewId, newStatus);
            toast.success(`Review ${newStatus} successfully`);
            fetchReviews();
        } catch (error) {
            toast.error('Failed to update review status');
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await adminService.deleteReview(reviewId);
            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Review Management</h1>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reviews</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">No reviews found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review._id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {review.name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {review.email} • {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(review.status)}>
                                                {review.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Rating</p>
                                                <StarRating rating={review.rating} readonly size="md" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">Comment</p>
                                                <p className="text-sm">{review.comment}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {review.status !== 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(review._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReviewManagement;
