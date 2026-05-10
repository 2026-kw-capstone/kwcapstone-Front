export const AUDIO_URL_TTL_MS = 540 * 1000;

export const getAudioUrlExpiresAt = (updatedAt = Date.now()) =>
  updatedAt + AUDIO_URL_TTL_MS;

export const isAudioUrlFresh = (updatedAt?: number) =>
  typeof updatedAt === "number" && Date.now() < getAudioUrlExpiresAt(updatedAt);
