'use client'

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

const DEFAULT_HERO_VIDEO_SRC = '/ONBI_robot_real-time.mp4';
const DEFAULT_HERO_POSTER_SRC = '/background_hero_onbi.webp';

// The hero source videos are authored to loop seamlessly (end frame ≈ start
// frame), so a single native-loop player is smooth — no crossfade needed.
export default function HeroVideo({
  src = DEFAULT_HERO_VIDEO_SRC,
  poster = DEFAULT_HERO_POSTER_SRC,
  className = '',
}: HeroVideoProps) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {videoFailed ? (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-position,center)]"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-position,center)]"
          src={src}
          poster={poster}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        />
      )}
    </div>
  );
}
