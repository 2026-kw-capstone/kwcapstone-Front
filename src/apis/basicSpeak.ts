import { axiosInstance } from "./axios";
import type {
  BasicSpeakTargetVowel,
  ResponseBasicSpeakAnalyzeDto,
  ResponseBasicSpeakLatestDto,
} from "../types/basicSpeakType";

const BASIC_SPEAK_BASE_URL = "/api/warmups/basic-pronunciation/practices";

const getVoiceFileName = (mimeType: string) => {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return "basic-speak-voice.m4a";
  }

  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) {
    return "basic-speak-voice.mp3";
  }

  return "basic-speak-voice.webm";
};

export const getBasicSpeakLatestPractice = async (
  targetVowel: BasicSpeakTargetVowel
): Promise<ResponseBasicSpeakLatestDto> => {
  const { data } = await axiosInstance.get<ResponseBasicSpeakLatestDto>(
    `${BASIC_SPEAK_BASE_URL}/latest`,
    {
      params: {
        targetVowel,
      },
    }
  );

  return data;
};

export const postBasicSpeakPracticeAnalyze = async ({
  clientRequestId,
  targetVowel,
  voiceFile,
}: {
  clientRequestId: string;
  targetVowel: BasicSpeakTargetVowel;
  voiceFile: Blob;
}): Promise<ResponseBasicSpeakAnalyzeDto> => {
  const formData = new FormData();
  formData.append("clientRequestId", clientRequestId);
  formData.append("targetVowel", targetVowel);
  formData.append("voiceFile", voiceFile, getVoiceFileName(voiceFile.type));

  const { data } = await axiosInstance.post<ResponseBasicSpeakAnalyzeDto>(
    BASIC_SPEAK_BASE_URL,
    formData
  );

  return data;
};
