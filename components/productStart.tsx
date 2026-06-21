import { Star } from "lucide-react";

export default function ProductStars({ rating, size = 20 }: { rating: number; size?: number }) {
  const validRating = Math.min(Math.max(rating, 0), 5);
  return (
    <div className="flex items-center gap-1 text-[#FFEB3A]">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = Math.min(Math.max(validRating - index, 0), 1);
        const scaleSize = starValue > 0 ? Math.max(starValue, 0.5) : 0;

        return (
          <div key={index} className="flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
            <div
              className="flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${scaleSize})` }}
            >
              <Star
                size={size}
                fill={starValue === 1 ? "#FFEB3A" : "oklch(87.2% 0.01 258.338)"}
                stroke="#000000"
                strokeWidth={0.5}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
