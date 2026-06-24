'use client'

import React from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface HeroVideoProps {
  playbackId: string;
  className?: string;
}

const HERO_INITIAL_BANDWIDTH_KBPS = 12000;
const HERO_INITIAL_ESTIMATE_SEGMENTS = 3;

// The hero source videos are authored to loop seamlessly (end frame ≈ start
// frame), so a single native-loop player is smooth — no crossfade needed.
export default function HeroVideo({ playbackId, className = '' }: HeroVideoProps) {
  const playerStyle = {
    '--controls': 'none',
    '--media-object-fit': 'cover',
    '--media-object-position': 'var(--hero-object-position, center)',
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
    inset: 0,
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <MuxPlayer
        playbackId={playbackId}
        muted
        loop
        autoPlay="muted"
        preload="auto"
        capRenditionToPlayerSize
        initialBandwidthEstimateKbps={HERO_INITIAL_BANDWIDTH_KBPS}
        initialEstimateSegments={HERO_INITIAL_ESTIMATE_SEGMENTS}
        disableTracking
        disableCookies
        primaryColor="transparent"
        secondaryColor="transparent"
        nohotkeys
        style={playerStyle}
      />
    </div>
  );
}
