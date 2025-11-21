import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsapFadeIn = (delay = 0) => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (elementRef.current) {
			gsap.fromTo(
				elementRef.current,
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					delay,
					ease: "power3.out",
				}
			);
		}
	}, [delay]);

	return elementRef;
};

export const useGsapScrollReveal = () => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (elementRef.current) {
			gsap.fromTo(
				elementRef.current,
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: elementRef.current,
						start: "top 80%",
						end: "top 20%",
						toggleActions: "play none none reverse",
					},
				}
			);
		}

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return elementRef;
};

export const useGsapStagger = (selector: string, delay = 0.1) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			const elements = containerRef.current.querySelectorAll(selector);
			gsap.fromTo(
				elements,
				{ opacity: 0, y: 40, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					stagger: delay,
					ease: "back.out(1.2)",
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				}
			);
		}

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, [selector, delay]);

	return containerRef;
};

export const useGsapHoverScale = () => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		const handleMouseEnter = () => {
			gsap.to(element, {
				scale: 1.05,
				duration: 0.3,
				ease: "power2.out",
			});
		};

		const handleMouseLeave = () => {
			gsap.to(element, {
				scale: 1,
				duration: 0.3,
				ease: "power2.out",
			});
		};

		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return elementRef;
};
