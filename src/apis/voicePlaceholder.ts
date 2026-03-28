// api 껍데기만 작성

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });

export interface VoiceAnalysisResult {
  pronunciationScore: number;
  stabilityScore: number;
  deliveryScore: number;
  feedback?: string;
}

export interface VoiceUploadResponse {
  mp3Url: string;
  analysis: VoiceAnalysisResult;
}

// TODO: 백엔드 API 완성 후 실제 업로드 API로 교체
export const uploadMyNoteVoice = async (
  audioBlob: Blob
): Promise<VoiceUploadResponse> => {
  await wait(700);

  return {
    mp3Url: URL.createObjectURL(audioBlob),
    analysis: {
      pronunciationScore: 87,
      stabilityScore: 82,
      deliveryScore: 85,
      feedback:
        '문장 시작은 안정적입니다. 첫 음절을 조금 더 분명하게 시작하면 전달력이 더 좋아질 수 있어요.',
    },
  };
};

// TODO: 백엔드 API 완성 후 실제 업로드 API로 교체
export const uploadBasicSpeakVoice = async (
  audioBlob: Blob
): Promise<VoiceUploadResponse> => {
  await wait(700);

  return {
    mp3Url: URL.createObjectURL(audioBlob),
    analysis: {
      pronunciationScore: 86,
      stabilityScore: 83,
      deliveryScore: 85,
    },
  };
};

// TODO: 백엔드 API 완성 후 실제 업로드 API로 교체
export const uploadScenarioVoice = async (
  audioBlob: Blob
): Promise<VoiceUploadResponse> => {
  await wait(700);

  return {
    mp3Url: URL.createObjectURL(audioBlob),
    analysis: {
      pronunciationScore: 84,
      stabilityScore: 80,
      deliveryScore: 83,
    },
  };
};

// TODO: 백엔드 API 완성 후 실제 업로드 API로 교체
export const uploadFreeConversationVoice = async (
  audioBlob: Blob
): Promise<VoiceUploadResponse> => {
  await wait(700);

  return {
    mp3Url: URL.createObjectURL(audioBlob),
    analysis: {
      pronunciationScore: 0,
      stabilityScore: 0,
      deliveryScore: 0,
    },
  };
};
