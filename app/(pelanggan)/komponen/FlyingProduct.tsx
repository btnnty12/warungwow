"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  imageUrl: string | null;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
};

export default function FlyingProduct({ imageUrl, startPosition, endPosition, onComplete }: Props) {
  const [position, setPosition] = useState(startPosition);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const x = startPosition.x + (endPosition.x - startPosition.x) * easeOutCubic;
      const y = startPosition.y + (endPosition.y - startPosition.y) * easeOutCubic;

      setPosition({ x, y });
      setScale(1 - progress * 0.5);
      setOpacity(1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [startPosition, endPosition, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: position.x,
        top: position.y,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Produk"
            width={80}
            height={80}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
