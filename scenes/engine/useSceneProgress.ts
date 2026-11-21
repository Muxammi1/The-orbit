"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneStore } from "./sceneStore";
import { getSceneStateForSection } from "./registry";
import { detectDeviceTier } from "./deviceTier";

export function useSceneProgress(enableSmoothScroll = false) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const tier = detectDeviceTier();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sceneStore.setState({
      deviceTier: tier,
      reducedMotion,
    });

    // Track mouse coordinates for damped 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneStore.setState({ mouse: { x, y } });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Track total scroll progress
    const globalTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        sceneStore.setState({ progress: self.progress });
      },
    });

    // Track sections with data-ring attribute
    const sections = document.querySelectorAll<HTMLElement>("section[data-ring]");
    const sectionTriggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          const sectionId = section.id || "entry";
          sceneStore.setState({
            activeSection: sectionId,
            state: getSceneStateForSection(sectionId),
          });
        },
        onEnterBack: () => {
          const sectionId = section.id || "entry";
          sceneStore.setState({
            activeSection: sectionId,
            state: getSceneStateForSection(sectionId),
          });
        },
      });
      sectionTriggers.push(trigger);
    });

    let lenisDestroy: (() => void) | null = null;
    if (enableSmoothScroll && !reducedMotion && tier !== "low") {
      import("lenis").then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        lenis.on("scroll", ScrollTrigger.update);
        const tickerCallback = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        lenisDestroy = () => {
          gsap.ticker.remove(tickerCallback);
          lenis.destroy();
        };
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      globalTrigger.kill();
      sectionTriggers.forEach((t) => t.kill());
      if (lenisDestroy) lenisDestroy();
    };
  }, [enableSmoothScroll]);
}
