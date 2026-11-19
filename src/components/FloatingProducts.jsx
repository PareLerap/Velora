
"use client";

import { useEffect, useRef } from "react";

const items = [
  { icon: "👕", top: "5%", left: "7%", size: 130, rotate: -25, delay: 0 },
  { icon: "🎧", top: "35%", left: "10%", size: 110, rotate: 20, delay: -2 },
  { icon: "👟", top: "70%", left: "5%", size: 140, rotate: -20, delay: -4 },
  { icon: "👜", top: "8%", left: "82%", size: 130, rotate: 25, delay: -3 },
  { icon: "⌚", top: "40%", left: "86%", size: 100, rotate: -15, delay: -5 },
  { icon: "🛍️", top: "75%", left: "78%", size: 140, rotate: 20, delay: -1 },
  { icon: "🕶️", top: "2%", left: "43%", size: 90, rotate: 15, delay: -3 },
  { icon: "📱", top: "85%", left: "42%", size: 100, rotate: -25, delay: -6 },
  { icon: "💄", top: "55%", left: "23%", size: 75, rotate: 30, delay: -2 },
  { icon: "🎮", top: "25%", left: "70%", size: 90, rotate: -20, delay: -4 },
  { icon: "📷", top: "15%", left: "27%", size: 80, rotate: 15, delay: -5 },
  { icon: "🎁", top: "70%", left: "65%", size: 90, rotate: -30, delay: -3 },
];

export default function FloatingProducts() {
  const background = useRef(null);

  useEffect(() => {
    function handleMouse(event) {
      if (!background.current) return;

      const x =
        (event.clientX / window.innerWidth - 0.5) * 70;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 70;

      background.current.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      background.current.style.setProperty(
        "--mouse-y",
        `${y}px`
      );
    }

    window.addEventListener("pointermove", handleMouse);

    return () => {
      window.removeEventListener("pointermove", handleMouse);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.10),transparent_80%)]" />

      {/* FLOATING ITEMS */}
      <div
        ref={background}
        className="velora-shopping-parallax"
      >

        {items.map((item, index) => (
          <span
            key={index}
            className="velora-shopping-item"
            style={{
              top: item.top,
              left: item.left,
              "--item-size": `${item.size}px`,
              "--rotation": `${item.rotate}deg`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${6 + (index % 4)}s`,
            }}
          >
            {item.icon}
          </span>
        ))}

      </div>

      <style jsx>{`
        .velora-shopping-parallax {
          position: absolute;
          inset: 0;
          transform: translate(
            var(--mouse-x, 0px),
            var(--mouse-y, 0px)
          );
          transition: transform 0.5s ease-out;
        }

        .velora-shopping-item {
          position: absolute;
          display: block;
          font-size: var(--item-size);
          line-height: 1;
          opacity: 0.5;
          filter: grayscale(100%) blur(2px);
          animation: shoppingFloat 7s ease-in-out infinite;
          will-change: transform;
          user-select: none;
        }

        @keyframes shoppingFloat {
          0%, 100% {
            transform: translate(0px, 0px)
              rotate(var(--rotation));
          }

          50% {
            transform: translate(25px, -45px)
              rotate(calc(var(--rotation) + 25deg));
          }
        }

        @media (max-width: 768px) {
          .velora-shopping-item {
            font-size: calc(var(--item-size) * 0.65);
            opacity: 0.35;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .velora-shopping-item {
            animation: none;
          }

          .velora-shopping-parallax {
            transform: none;
            transition: none;
          }
        }
      `}</style>

    </div>
  );
}
