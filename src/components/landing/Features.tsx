'use client'

import React from 'react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';

export default function Features() {
  const data = [
    {
      category: "Focus Habit",
      title: "Pomodoro Focus Cycle",
      src: "/Pomodoro Focus Cycle.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">25-minute focus + 5-minute rest</span>{" "}
            intervals designed by child psychologists. Builds natural concentration without fatigue or screen dependency. ONBI uses gentle LED transitions and ambient audio to guide each cycle seamlessly.
          </p>
        </div>
      ),
    },
    {
      category: "Health & Safety",
      title: "Smart Posture Guardian",
      src: "/Smart Posture Guardian.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">Built-in AI camera tracks posture locally.</span>{" "}
            Gentle voice reminders when your child slouches. No data leaves the device — 100% local processing ensures complete privacy while protecting spinal health.
          </p>
        </div>
      ),
    },
    {
      category: "Parent Sync",
      title: "Real-time Progress Reports",
      src: "/Real-time Progress Reports.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">Automatic daily study reports sent to your phone.</span>{" "}
            Track focus time, posture alerts, and English progress without hovering over your child. Weekly habit charts and vocabulary growth metrics included.
          </p>
        </div>
      ),
    },
    {
      category: "Companion",
      title: "Friendly Study Buddy",
      src: "/Friendly Study Buddy.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">ONBI responds with expressions, LED animations, and encouraging voice.</span>{" "}
            Turns study time into an anticipated daily ritual. Zero screen time — all interaction happens through physical cues, voice, and ambient light.
          </p>
        </div>
      ),
    },
    {
      category: "English",
      title: "Daily Speaking Practice",
      src: "/Daily Speaking Practice.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">Interactive 5-minute English conversations for ages 6-11.</span>{" "}
            Builds pronunciation confidence through storytelling and roleplay games. No screen fatigue — just natural spoken dialogue with your child&apos;s AI companion.
          </p>
        </div>
      ),
    },
    {
      category: "Updates",
      title: "Lifetime Free Updates",
      src: "/Lifetime Free Updates.png",
      content: (
        <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
          <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
            <span className="font-bold text-neutral-700">Over-the-air firmware updates bring new features.</span>{" "}
            AI voice conversations, expanded curriculum, and smart home integration — all included free for life. Your ONBI gets smarter over time.
          </p>
        </div>
      ),
    },
  ];

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full" id="onbi_mvp_features_grid">
      <div className="max-w-7xl mx-auto mb-4">
        <span className="inline-block text-[11px] font-mono tracking-widest text-[#22d3ee] uppercase font-bold pl-4">
          Core Features
        </span>
        <h2 className="max-w-7xl pl-4 text-3xl md:text-5xl font-bold text-slate-900 font-display tracking-tight">
          How ONBI Empowers Daily Study Habits
        </h2>
      </div>
      <Carousel items={cards} />
    </div>
  );
}
