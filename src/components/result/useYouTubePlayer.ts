"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Loads the YouTube IFrame API and gives back a `seekTo` function so transcript
 * timestamps can jump the embedded player.
 */

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
}

let apiPromise: Promise<void> | null = null;

function loadApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function useYouTubePlayer(videoId: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    playerRef.current = null;

    loadApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      // Clear any prior player node.
      containerRef.current.innerHTML = "";
      const host = document.createElement("div");
      containerRef.current.appendChild(host);
      playerRef.current = new window.YT.Player(host, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => !cancelled && setReady(true),
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  function seekTo(seconds: number) {
    const p = playerRef.current;
    if (p) {
      p.seekTo(seconds, true);
      p.playVideo();
    }
  }

  return { containerRef, seekTo, ready };
}
