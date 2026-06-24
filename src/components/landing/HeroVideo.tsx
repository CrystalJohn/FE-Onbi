'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import MuxVideo from '@mux/mux-video-react';

interface HeroVideoProps {
  playbackId: string;
  className?: string;
}

const CROSSFADE_PREPLAY_SECONDS = 1.25;
const TRANSITION_MS = 1200;
const HERO_INITIAL_BANDWIDTH_KBPS = 12000;
const HERO_INITIAL_ESTIMATE_SEGMENTS = 3;

export default function HeroVideo({ playbackId, className = '' }: HeroVideoProps) {
  const playerARef = useRef<HTMLVideoElement | null>(null);
  const playerBRef = useRef<HTMLVideoElement | null>(null);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const durationRef = useRef(0);
  const preplayTriggered = useRef(false);
  const crossfadeTriggered = useRef(false);

  const playerStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
  };

  const commonProps = {
    playbackId,
    muted: true,
    loop: false,
    playsInline: true,
    capRenditionToPlayerSize: false,
    initialBandwidthEstimateKbps: HERO_INITIAL_BANDWIDTH_KBPS,
    initialEstimateSegments: HERO_INITIAL_ESTIMATE_SEGMENTS,
    minResolution: '1080p' as const,
    maxResolution: '1080p' as const,
    disableTracking: true,
    disableCookies: true,
    style: playerStyle,
  };

  const getPlayerStyle = (id: 'A' | 'B'): React.CSSProperties => {
    const isActive = id === activePlayer;

    if (isActive) {
      return {
        opacity: 1,
        zIndex: 10,
        transition: isTransitioning ? 'none' : `opacity ${TRANSITION_MS}ms ease-in-out`,
      };
    }

    return {
      opacity: isTransitioning ? 1 : 0,
      zIndex: isTransitioning ? 20 : 0,
      transition: isTransitioning ? `opacity ${TRANSITION_MS}ms ease-in-out` : 'none',
    };
  };

  const getStandbyPlayer = useCallback(() => {
    return activePlayer === 'A' ? playerBRef.current : playerARef.current;
  }, [activePlayer]);

  const handlePlayerEvent = useCallback((event: Event) => {
    const a = playerARef.current;
    const b = playerBRef.current;
    if (!a || !b) return;

    const target = event.currentTarget as HTMLVideoElement;
    const isA = target === a;
    const isActive = (activePlayer === 'A' && isA) || (activePlayer === 'B' && !isA);

    if (isActive) {
      const duration = target.duration || durationRef.current;
      if (!duration || Number.isNaN(duration)) return;

      durationRef.current = duration;
      const remaining = duration - target.currentTime;

      if (
        remaining <= CROSSFADE_PREPLAY_SECONDS &&
        remaining > 0 &&
        !preplayTriggered.current
      ) {
        preplayTriggered.current = true;
        const standby = activePlayer === 'A' ? b : a;
        standby.currentTime = 0;
        standby.play().catch(() => {});
      }

      return;
    }

    if (
      preplayTriggered.current &&
      !crossfadeTriggered.current &&
      target.currentTime > 0.25
    ) {
      crossfadeTriggered.current = true;
      setIsTransitioning(true);
    }
  }, [activePlayer]);

  useEffect(() => {
    const a = playerARef.current;
    const b = playerBRef.current;

    a?.addEventListener('timeupdate', handlePlayerEvent);
    a?.addEventListener('playing', handlePlayerEvent);
    b?.addEventListener('timeupdate', handlePlayerEvent);
    b?.addEventListener('playing', handlePlayerEvent);

    return () => {
      a?.removeEventListener('timeupdate', handlePlayerEvent);
      a?.removeEventListener('playing', handlePlayerEvent);
      b?.removeEventListener('timeupdate', handlePlayerEvent);
      b?.removeEventListener('playing', handlePlayerEvent);
    };
  }, [handlePlayerEvent]);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = window.setTimeout(() => {
      setActivePlayer((current) => (current === 'A' ? 'B' : 'A'));
      setIsTransitioning(false);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  useEffect(() => {
    const standby = getStandbyPlayer();
    if (standby) {
      standby.pause();
      standby.currentTime = 0;
    }

    preplayTriggered.current = false;
    crossfadeTriggered.current = false;
  }, [activePlayer, getStandbyPlayer]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0" style={getPlayerStyle('A')}>
        <MuxVideo
          ref={playerARef}
          {...commonProps}
          autoPlay="muted"
          preload="auto"
        />
      </div>

      <div className="absolute inset-0" style={getPlayerStyle('B')}>
        <MuxVideo
          ref={playerBRef}
          {...commonProps}
          preload="metadata"
        />
      </div>
    </div>
  );
}

