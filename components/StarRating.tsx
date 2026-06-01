"use client"

import { useState } from "react";

interface StarRatingProps {
  rating: number; // Ex: 4.75
  onRatingChange?: (newRating: number) => void;
}

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(1, displayRating - (starIndex - 1)));

          return (
            <div
              key={starIndex}
              className="relative cursor-pointer transition-transform active:scale-95"
              onMouseEnter={() => onRatingChange && setHoverRating(starIndex)}
              onMouseLeave={() => onRatingChange && setHoverRating(null)}
              onClick={() => onRatingChange && onRatingChange(starIndex)}
            >
              <svg
                className="w-8 h-8 text-neutral-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>

              <div
                className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none transition-all duration-100"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}