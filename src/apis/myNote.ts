import { axiosInstance } from "./axios";
import type {
  MyNoteSentenceItem,
  MyNoteTtsAudioResult,
  MyNoteUserAudioResult,
  RequestPostMyNoteSentenceDto,
  ResponseDeleteMyNoteSentenceDto,
  ResponseGetMyNoteSentencesDto,
  ResponseMyNoteAnalyzeDto,
  ResponseMyNoteSentenceDto,
} from "../types/myNoteType";

const MY_NOTE_BASE_URL = "/api/warmups/my-sentences";

const getRequestId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `uuid-${crypto.randomUUID()}`;
  }

  return `uuid-${Math.random().toString(16).slice(2)}`;
};

const getVoiceFileName = (mimeType: string) => {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return "my-note-voice.m4a";
  }

  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) {
    return "my-note-voice.mp3";
  }

  return "my-note-voice.webm";
};

export const getMyNoteSentences = async (): Promise<MyNoteSentenceItem[]> => {
  const { data } = await axiosInstance.get<ResponseGetMyNoteSentencesDto>(
    MY_NOTE_BASE_URL
  );
  return data.result.sentences;
};

export const postMyNoteSentence = async (
  payload: RequestPostMyNoteSentenceDto
): Promise<ResponseMyNoteSentenceDto> => {
  const { data } = await axiosInstance.post(MY_NOTE_BASE_URL, payload);
  return data;
};

export const deleteMyNoteSentence = async (
  sentenceId: number
): Promise<ResponseDeleteMyNoteSentenceDto> => {
  const { data } = await axiosInstance.delete(`${MY_NOTE_BASE_URL}/${sentenceId}`);
  return data;
};

export const getMyNoteTts = async (
  sentenceId: number
): Promise<MyNoteTtsAudioResult> => {
  const { data } = await axiosInstance.get(`${MY_NOTE_BASE_URL}/${sentenceId}/tts`);
  return data.result;
};

export const getMyNoteUserAudio = async (
  sentenceId: number
): Promise<MyNoteUserAudioResult> => {
  const { data } = await axiosInstance.get(
    `${MY_NOTE_BASE_URL}/${sentenceId}/user-audio`
  );
  return data.result;
};

export const postMyNotePronunciationAnalyze = async ({
  sentenceId,
  voiceFile,
}: {
  sentenceId: number;
  voiceFile: Blob;
}): Promise<ResponseMyNoteAnalyzeDto> => {
  const formData = new FormData();
  formData.append("clientRequestId", getRequestId());
  formData.append("sentenceId", String(sentenceId));
  formData.append("voiceFile", voiceFile, getVoiceFileName(voiceFile.type));

  const { data } = await axiosInstance.post(
    `${MY_NOTE_BASE_URL}/pronunciations/analyze`,
    formData
  );

  return data;
};
