'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import type MuxPlayerElement from '@mux/mux-player';

// Suppress harmless Media Chrome stylesheet warnings in browser console
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('Media Chrome: No style sheet found')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

/**
 * HeroVideo – Seamless looping hero background video with crossfade.
 *
 * Uses two Mux Player instances stacked on top of each other.
 * When the active player approaches the end of the video (~1.5s before),
 * the standby player fades in and starts playing from 0, creating
 * a smooth crossfade instead of a jarring hard-cut loop.
 */

interface HeroVideoProps {
  /** Mux playback ID */
  playbackId: string;
  /** Extra classes for the wrapper (used for light/dark mode switching) */
  className?: string;
}

// How many seconds before the end to start pre-playing the standby player
const CROSSFADE_PREPLAY = 3.0;
// CSS transition duration in ms
const TRANSITION_MS = 1200;

export default function HeroVideo({ playbackId, className = '' }: HeroVideoProps) {
  // Refs to access the underlying MuxPlayer elements
  const playerARef = useRef<MuxPlayerElement | null>(null);
  const playerBRef = useRef<MuxPlayerElement | null>(null);

  // Which player is currently visible and active
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  // Whether we are currently in the middle of a transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Guard to prevent multiple pre-play triggers per cycle
  const preplayTriggered = useRef(false);
  // Guard to prevent multiple crossfade triggers per cycle
  const crossfadeTriggered = useRef(false);
  // Track if we've obtained the duration
  const durationRef = useRef(0);

  // Helper to get the active / standby player elements
  const getPlayers = useCallback(() => {
    const a = playerARef.current;
    const b = playerBRef.current;
    return activePlayer === 'A'
      ? { active: a, standby: b }
      : { active: b, standby: a };
  }, [activePlayer]);

  // Handle events (timeupdate/playing) on both players
  const handlePlayerEvent = useCallback((event: Event) => {
    const a = playerARef.current;
    const b = playerBRef.current;
    if (!a || !b) return;

    const target = event.currentTarget as MuxPlayerElement;
    const isPlayerA = target === a;
    const role = (activePlayer === 'A' && isPlayerA) || (activePlayer === 'B' && !isPlayerA) ? 'active' : 'standby';

    if (role === 'active') {
      // Logic for active player: check if we need to start pre-playing the standby player
      const duration = target.duration || durationRef.current;
      if (!duration || isNaN(duration)) return;
      durationRef.current = duration;

      const remaining = duration - target.currentTime;
      if (remaining <= CROSSFADE_PREPLAY && remaining > 0 && !preplayTriggered.current) {
        preplayTriggered.current = true;
        const standby = activePlayer === 'A' ? b : a;
        standby.currentTime = 0;
        standby.play().catch(() => {});
      }
    } else {
      // Logic for standby player: check if it has successfully started playing
      // We look for currentTime > 0.25 to guarantee browser is rendering active frames
      if (preplayTriggered.current && !crossfadeTriggered.current && target.currentTime > 0.25) {
        crossfadeTriggered.current = true;
        setIsTransitioning(true);
      }
    }
  }, [activePlayer]);

  // Manage transition duration timer
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      // Transition completed, make the incoming player active and stop transitioning
      setActivePlayer(prev => prev === 'A' ? 'B' : 'A');
      setIsTransitioning(false);
    }, TRANSITION_MS);

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  // When active player switches, pause the old (now standby) player
  // and reset guards for the next cycle
  useEffect(() => {
    const { standby } = getPlayers();
    if (standby) {
      standby.pause();
      standby.currentTime = 0;
    }
    // Reset guards for the next cycle
    preplayTriggered.current = false;
    crossfadeTriggered.current = false;
  }, [activePlayer, getPlayers]);

  // Compute CSS style for each player
  const getPlayerStyle = (id: 'A' | 'B'): React.CSSProperties => {
    const isActive = id === activePlayer;
    if (isActive) {
      return {
        opacity: 1,
        zIndex: 10,
        // Active player stays fully visible and doesn't transition during swap
        transition: isTransitioning ? 'none' : `opacity ${TRANSITION_MS}ms ease-in-out`,
      };
    } else {
      return {
        opacity: isTransitioning ? 1 : 0,
        // Standby player goes on top during transition to fade in, otherwise hidden below
        zIndex: isTransitioning ? 20 : 0,
        // Standby transitions to 1 when active, but drops to 0 instantly when reset
        transition: isTransitioning ? `opacity ${TRANSITION_MS}ms ease-in-out` : 'none',
      };
    }
  };

  // Attach event listeners to both players
  useEffect(() => {
    const a = playerARef.current;
    const b = playerBRef.current;

    const handler = handlePlayerEvent;
    a?.addEventListener('timeupdate', handler);
    a?.addEventListener('playing', handler);
    b?.addEventListener('timeupdate', handler);
    b?.addEventListener('playing', handler);

    return () => {
      a?.removeEventListener('timeupdate', handler);
      a?.removeEventListener('playing', handler);
      b?.removeEventListener('timeupdate', handler);
      b?.removeEventListener('playing', handler);
    };
  }, [handlePlayerEvent]);

  // Common props for both MuxPlayer instances
  const commonProps = {
    playbackId,
    autoPlay: 'muted' as const,
    muted: true,
    loop: false, // We handle looping ourselves via crossfade
    preload: 'auto' as const,
    // Hide all default UI controls for a clean background video look
    primaryColor: 'transparent',
    secondaryColor: 'transparent',
  };

  // Inline styles to completely hide Mux Player chrome
  const hideControlsStyle: React.CSSProperties = {
    // Use CSS custom properties to hide MuxPlayer UI
    '--controls': 'none',
    '--media-object-fit': 'cover',
    '--media-object-position': 'center',
  } as React.CSSProperties;

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Player A */}
      <div
        className="absolute inset-0"
        style={{
          ...getPlayerStyle('A'),
          position: 'absolute',
          inset: 0,
        }}
      >
        <MuxPlayer
          ref={playerARef}
          {...commonProps}
          style={{
            ...hideControlsStyle,
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          nohotkeys
        />
      </div>

      {/* Player B */}
      <div
        className="absolute inset-0"
        style={{
          ...getPlayerStyle('B'),
          position: 'absolute',
          inset: 0,
        }}
      >
        <MuxPlayer
          ref={playerBRef}
          {...commonProps}
          style={{
            ...hideControlsStyle,
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          nohotkeys
        />
      </div>
    </div>
  );
}
