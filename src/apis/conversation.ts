import { axiosInstance } from "./axios";
import type { ResponseConversationListDto } from "../types/freeConversationType";

export const getConversationList =
  async (): Promise<ResponseConversationListDto> => {
    const { data } = await axiosInstance.get("/api/conversations");
    return data;
  };
