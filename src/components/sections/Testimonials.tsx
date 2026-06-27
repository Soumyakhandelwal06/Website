"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = TESTIMONIALS.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 4000);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalized = ((diff % total) + total) % total;
    let adjustedDiff = normalized;
    if (adjustedDiff > Math.floor(total / 2)) adjustedDiff -= total;

    const isCenter = adjustedDiff === 0;
    const isLeft = adjustedDiff === -1 || (adjustedDiff === total - 1 && total > 2);
    const isRight = adjustedDiff === 1;

    if (isCenter) {
      return {
        transform: "translateX(0) rotateY(0deg) scale(1)",
        opacity: 1,
        zIndex: 10,
      };
    } else if (isLeft) {
      return {
        transform: "translateX(-75%) rotateY(25deg) scale(0.85)",
        opacity: 0.6,
        zIndex: 5,
      };
    } else if (isRight) {
      return {
        transform: "translateX(75%) rotateY(-25deg) scale(0.85)",
        opacity: 0.6,
        zIndex: 5,
      };
    }
    return {
      transform: "translateX(0) scale(0.7)",
      opacity: 0,
      zIndex: 0,
    };
  };

  return (
    <section id="testimonials" className="py-24 bg-navy relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-brand/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-brand text-sm font-bold tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="font-clash font-bold text-4xl md:text-5xl text-white mt-3">
            What Parents &amp; Students{" "}
            <span className="text-emerald-brand">Say</span>
          </h2>
        </motion.div>

        {/* 3D Carousel */}
        <div className="testimonial-carousel relative h-[420px] md:h-[380px] flex items-center justify-center">
          {TESTIMONIALS.map((testimonial, i) => {
            const style = getCardStyle(i);
            return (
              <div
                key={i}
                className="testimonial-card absolute w-full max-w-lg mx-auto animate-badge-float"
                style={{
                  ...style,
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: i === activeIndex ? "auto" : "none",
                  animationDelay: `${i * 0.25}s`,
                }}
              >
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 mx-4 shadow-premium-lg hover:border-white/20 transition-all duration-300 relative overflow-hidden group">
                  {/* Decorative quote mark */}
                  <div className="absolute right-6 top-2 text-white/[0.02] text-[100px] font-clash select-none pointer-events-none">
                    &ldquo;
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <svg
                        key={j}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#d4af37"
                        className="text-glow-orange"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 italic tracking-wide relative z-10">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Avatar initials with premium gradient */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-brand/20 to-teal-accent/20 border border-white/10 flex items-center justify-center font-clash font-bold text-white text-sm shadow-premium-sm">
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-wide">
                          {testimonial.name}
                        </p>
                        <p className="text-white/40 text-[10px] font-semibold tracking-wider uppercase mt-0.5">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    {testimonial.hasVideo && (
                      <button className="flex items-center gap-2 text-gold-brand text-xs font-bold uppercase tracking-wider hover:text-gold-light transition-colors active:scale-95">
                        <div className="w-8 h-8 bg-gold-brand/10 border border-gold-brand/20 rounded-full flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#d4af37">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                        Play
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => { prev(); resetAutoplay(); }}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-gold-brand hover:text-gold-brand transition-colors"
            aria-label="Previous testimonial"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIndex(i); resetAutoplay(); }}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex ? "w-8 bg-gold-brand" : "w-2 bg-white/20"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => { next(); resetAutoplay(); }}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-gold-brand hover:text-gold-brand transition-colors"
            aria-label="Next testimonial"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
