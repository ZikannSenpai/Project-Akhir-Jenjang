"use client";

import { useEffect, useRef, useState } from "react";

type RevealSectionProps = {
    children: React.ReactNode;
    className?: string;
    delayMs?: number;
};

export function RevealSection({
    children,
    className = "",
    delayMs = 0
}: RevealSectionProps) {
    const elementRef = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentElement = elementRef.current;

        if (!currentElement) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.18
            }
        );

        observer.observe(currentElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section
            ref={elementRef}
            className={`transition-all duration-700 ease-out will-change-transform ${
                isVisible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-6 scale-[0.98] opacity-0"
            } ${className}`}
            style={{ transitionDelay: `${delayMs}ms` }}
        >
            {children}
        </section>
    );
}
