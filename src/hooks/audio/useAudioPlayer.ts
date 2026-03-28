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

  const setAudioUrl = useCallback((nextUrl: string | null) => {
    // 새 URL이 들어오면 이전 blob URL은 정리해 메모리 누수를 방지합니다.
    setAudioUrlState((prev) => {
      if (prev !== nextUrl) {
        revokeObjectUrlIfNeeded(prev);
      }
      return nextUrl;
    });
  }, []);

  const clearAudioUrl = useCallback(() => {
    setAudioUrl(null);
    stopAudioInstance(audioRef.current);
    audioRef.current = null;
    setIsPlaying(false);
  }, [setAudioUrl]);

  const playAudio = useCallback(
    async (targetUrl?: string | null) => {
      const url = targetUrl ?? audioUrl;
      if (!url) return;

      // 이전 재생이 있으면 중지 후 새 URL을 재생합니다.
      stopAudioInstance(audioRef.current);

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        audioRef.current = null;
      }
    },
    [audioUrl]
  );

  useEffect(() => {
    return () => {
      // 훅 언마운트 시 오디오 인스턴스와 blob URL을 정리합니다.
      stopAudioInstance(audioRef.current);
      audioRef.current = null;
      revokeObjectUrlIfNeeded(audioUrl);
    };
  }, [audioUrl]);

  return {
    audioUrl,
    isPlaying,
    setAudioUrl,
    clearAudioUrl,
    playAudio,
  };
};
