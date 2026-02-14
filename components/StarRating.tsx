'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const handleClick = (index: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`${sizeClasses[size]} transition-all ${index < rating
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        } ${!readonly ? 'cursor-pointer hover:scale-110' : ''
                        }`}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
};

export default StarRating;
