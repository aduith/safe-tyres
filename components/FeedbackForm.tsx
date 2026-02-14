'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from './StarRating';
import reviewService from '@/services/reviewService';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.submitReview({
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        comment: formData.comment,
      });

      toast.success('Thank you for your review!', {
        description: 'Your review will be visible after approval.',
      });

      setFormData({ name: '', email: '', rating: 0, comment: '' });
    } catch (error: any) {
      toast.error('Failed to submit review', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-border shadow-glow animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Share Your <span className="text-primary">Review</span>
            </CardTitle>
            <CardDescription className="text-base">
              We'd love to hear about your experience with our products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rating
                </label>
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                  size="lg"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  Your Review
                </label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Tell us what you think..."
                  required
                  rows={5}
                  maxLength={500}
                  className="bg-background border-border focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.comment.length}/500 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeedbackForm;
