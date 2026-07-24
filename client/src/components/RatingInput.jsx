import React, { useState } from "react";

const RatingInput = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {[1, 2, 3, 4, 5, 6 ,7 ,8 ,9 ,10].map((star) => {
        const isFilled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                isFilled
                  ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                  : "text-slate-300 fill-slate-100"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.415.877-.842.613l-4.71-2.88a.563.563 0 00-.582 0l-4.71 2.88c-.427.264-.958-.125-.842-.613l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
      
      {/* Selected Rating Badge */}
      {value > 0 && (
        <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
          {value} / 5
        </span>
      )}
    </div>
  );
};

export default RatingInput;