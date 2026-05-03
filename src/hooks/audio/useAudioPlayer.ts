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

// 재생 전용 훅:
// - 현재 재생 주소 상태 관리
// - 오디오 재생/중지 처리
// - URL 교체/언마운트 시 blob URL 정리
export const useAudioPlayer = () => {
  const [audioUrl, setAudioUrlState] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 재생 URL 교체 시 이전 blob URL은 즉시 해제합니다.
  const setAudioUrl = useCallback((nextUrl: string | null) => {
    setAudioUrlState((prev) => {
      if (prev !== nextUrl) {
        revokeObjectUrlIfNeeded(prev);
      }
      return nextUrl;
    });
  }, []);

  // 현재 재생 중인 오디오를 멈추고 URL 상태를 비웁니다.
  const clearAudioUrl = useCallback(() => {
    setAudioUrl(null);
    stopAudioInstance(audioRef.current);
    audioRef.current = null;
    setIsPlaying(false);
  }, [setAudioUrl]);

  // 전달된 URL(또는 저장된 audioUrl)을 새 Audio 인스턴스로 재생합니다.
  const playAudio = useCallback(
    async (targetUrl?: string | null) => {
      const url = targetUrl ?? audioUrl;
      if (!url) return;

      stopAudioInstance(audioRef.current);

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);

      // 재생 종료/오류 시 공통적으로 재생 상태를 해제합니다.
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

  // 훅 언마운트 또는 URL 변경 시 리소스를 정리합니다.
  useEffect(() => {
    return () => {
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
