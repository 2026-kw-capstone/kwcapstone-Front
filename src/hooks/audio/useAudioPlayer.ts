import { useCallback, useEffect, useRef, useState } from "react";

export const revokeObjectUrlIfNeeded = (url: string | null) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const stopAudioInstance = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};

export const useAudioPlayer = () => {
  const [audioUrl, setAudioUrlState] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finishPlaybackRef = useRef<(() => void) | null>(null);

  const finishCurrentPlayback = useCallback(() => {
    finishPlaybackRef.current?.();
    finishPlaybackRef.current = null;
  }, []);

  const setAudioUrl = useCallback((nextUrl: string | null) => {
    setAudioUrlState((prev) => {
      if (prev !== nextUrl) {
        revokeObjectUrlIfNeeded(prev);
      }
      return nextUrl;
    });
  }, []);

  const clearAudioUrl = useCallback(() => {
    setAudioUrl(null);
    finishCurrentPlayback();
    stopAudioInstance(audioRef.current);
    audioRef.current = null;
    setIsPlaying(false);
  }, [finishCurrentPlayback, setAudioUrl]);

  const playAudio = useCallback(
    async (targetUrl?: string | null) => {
      const url = targetUrl ?? audioUrl;
      if (!url) return;

      finishCurrentPlayback();
      stopAudioInstance(audioRef.current);

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);

      try {
        await audio.play();

        await new Promise<void>((resolve) => {
          const finish = () => {
            if (audioRef.current === audio) {
              setIsPlaying(false);
              audioRef.current = null;
            }
            if (finishPlaybackRef.current === finish) {
              finishPlaybackRef.current = null;
            }
            resolve();
          };

          finishPlaybackRef.current = finish;

          audio.onended = finish;
          audio.onerror = () => {
            console.error("[audio] audio element error", audio.error, {
              urlType: url.slice(0, 64),
            });
            finish();
          };
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("[audio] play failed", error, {
            urlType: url.slice(0, 64),
          });
        }

        if (audioRef.current === audio) {
          setIsPlaying(false);
          audioRef.current = null;
        }
        if (finishPlaybackRef.current) {
          finishPlaybackRef.current = null;
        }
      }
    },
    [audioUrl, finishCurrentPlayback]
  );

  useEffect(() => {
    return () => {
      finishCurrentPlayback();
      stopAudioInstance(audioRef.current);
      audioRef.current = null;
      revokeObjectUrlIfNeeded(audioUrl);
    };
  }, [audioUrl, finishCurrentPlayback]);

  return {
    audioUrl,
    isPlaying,
    setAudioUrl,
    clearAudioUrl,
    playAudio,
  };
};
