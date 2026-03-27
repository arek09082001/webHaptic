"use client";

import {
  useRef,
  useState,
  useCallback,
  Children,
  type ReactNode,
} from "react";

interface CarouselProps {
  children: ReactNode;
  onSlideChange?: (index: number) => void;
}

export function Carousel({ children, onSlideChange }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const childArray = Children.toArray(children);
  const count = childArray.length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    if (index !== current) {
      setCurrent(index);
      onSlideChange?.(index);
    }
  }, [current, onSlideChange]);

  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Slides */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {childArray.map((child, i) => (
          <div key={i} className="w-full flex-none snap-center">
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {childArray.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-magenta"
                  : "w-1.5 bg-border hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
