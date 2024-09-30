import React from 'react';

interface RatingStarsProps {
    ratingNumbers: number | number[] | undefined;
    iconSize: string | undefined;
}

const RatingStars: React.FC<RatingStarsProps> = ({ ratingNumbers, iconSize }) => {
    // Calculate the average rating
    let averageRating = 0;

    if (Array.isArray(ratingNumbers)) {
        averageRating = ratingNumbers.length > 0
            ? ratingNumbers.reduce((sum, rating) => sum + rating, 0) / ratingNumbers.length
            : 0;
    } else if (typeof ratingNumbers === 'number') {
        averageRating = ratingNumbers; // If it's a single number, use it directly
    }

    // Determine the number of active stars
    const activeStars = Math.round(averageRating);
    const totalStars = 5;

    return (
        <div className="flex">
            {Array.from({ length: totalStars }).map((_, index) => (
                <i
                    className={`ri-star-s-fill ${iconSize} ${index < activeStars ? 'text-dark-blue' : 'text-light-blue'}`}
                    key={index}
                ></i>
            ))}
        </div>
    );
};

export default RatingStars;
