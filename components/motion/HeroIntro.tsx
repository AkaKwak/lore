"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export function HeroIntro() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-intro-line", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="flex flex-col gap-2">
      <h1 className="hero-intro-line text-3xl font-semibold tracking-tight text-foreground">
        ENS Reputation Passport
      </h1>
      <p className="hero-intro-line text-lg text-zinc-600 dark:text-zinc-400">
        Resolve an ENS name, surface identity, and layer Intuition attestations.
      </p>
    </div>
  );
}
