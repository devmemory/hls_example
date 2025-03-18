import { AxiosProgressEvent } from "axios";
import Api from "./api";

class VideoApi extends Api {
  async getVideoList() {
    return await super.get<string[]>("/api/video/list");
  }

  async uploadVideo(
    file: File,
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await super.post<{ msg: string; url: string }>(
      "/api/video/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      }
    );

    return res.msg;
  }
}

export const getVideoList = async () => {
  const api = new VideoApi();

  return await api.getVideoList();
};

export const uploadVideo = async (model: {
  file: File;
  onUploadProgress?: (e: AxiosProgressEvent) => void;
}) => {
  const api = new VideoApi();

  return await api.uploadVideo(model.file, model.onUploadProgress);
};
