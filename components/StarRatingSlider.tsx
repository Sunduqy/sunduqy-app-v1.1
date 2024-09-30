import React, { useState } from 'react';

interface StarRatingSliderProps {
    onRatingChange: (rating: number) => void;
}

const StarRatingSlider: React.FC<StarRatingSliderProps> = ({ onRatingChange }) => {
    const [rating, setRating] = useState<number>(0);

    const handlePress = (star: number) => {
        setRating(star);
        onRatingChange(star);
    };

    return (
        <div className="flex flex-row">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    onClick={() => handlePress(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <i className={`ri-${star <= rating ? 'star-s-fill' : 'star-s-line'} text-${star <= rating ? 'dark-blue' : 'light-blue'} text-2xl`}></i>
                </button>
            ))}
        </div>
    );
};

export default StarRatingSlider;
