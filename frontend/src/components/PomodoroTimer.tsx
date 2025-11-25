"use client";
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  workMinutes?: number;
  breakMinutes?: number;
  autoStart?: boolean;
  className?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function PomodoroTimer({ workMinutes = 25, breakMinutes = 5, autoStart = false, className = '' }: Props) {
  const [running, setRunning] = useState<boolean>(autoStart);
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [remaining, setRemaining] = useState<number>(workMinutes * 60);

  const remainingRef = useRef<number>(workMinutes * 60);
  const phaseRef = useRef<'work' | 'break'>('work');
  const intervalRef = useRef<number | null>(null);

  // keep refs in sync when durations or phase change
  useEffect(() => {
    phaseRef.current = phase;
    const secs = (phase === 'work' ? workMinutes : breakMinutes) * 60;
    remainingRef.current = secs;
    setRemaining(secs);
  }, [phase, workMinutes, breakMinutes]);

  // start/stop interval
  useEffect(() => {
    if (running) {
      // clear any existing
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        remainingRef.current = Math.max(0, remainingRef.current - 1);
        setRemaining(remainingRef.current);
        if (remainingRef.current <= 0) {
          // switch phase
          const next: 'work' | 'break' = phaseRef.current === 'work' ? 'break' : 'work';
          phaseRef.current = next;
          setPhase(next);
          const secs = (next === 'work' ? workMinutes : breakMinutes) * 60;
          remainingRef.current = secs;
          setRemaining(secs);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, workMinutes, breakMinutes]);

  function toggle() {
    setRunning((r) => !r);
  }

  function reset() {
    const secs = (phase === 'work' ? workMinutes : breakMinutes) * 60;
    remainingRef.current = secs;
    setRemaining(secs);
    setRunning(false);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className={`p-3 rounded bg-white shadow-sm text-center ${className}`}>
      <div className="text-sm text-zinc-600 mb-1">{phase === 'work' ? 'Work' : 'Break'}</div>
      <div className="text-3xl font-mono font-semibold mb-2">{pad(minutes)}:{pad(seconds)}</div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={toggle}
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 rounded border border-gray-200 text-sm hover:bg-zinc-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
