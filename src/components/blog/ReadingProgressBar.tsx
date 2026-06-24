'use client'

import React, { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const windowHeight = scrollHeight - clientHeight;
      
      if (windowHeight > 0) {
        const percentage = (window.scrollY / windowHeight) * 100;
        setProgress(percentage);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    // Run once on mount to handle initial load
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[999] h-[3px] w-full bg-slate-100 dark:bg-zinc-800/40">
      <div
        className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
