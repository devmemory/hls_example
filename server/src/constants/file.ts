import path from "path";
import { ResolutionModel } from "../models/ResolutionModel";

export const fileConst = {
  fileSize: 500 * 1024 * 1024,
} as const;

export const resolutions: ResolutionModel[] = [
  {
    name: "360p",
    width: 640,
    height: 360,
    bitrate: "800k",
    audioBitrate: "64k",
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
    bitrate: "2500k",
    audioBitrate: "128k",
  },
] as const;

export const MASTER_FORMAT = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,NAME="360"
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,NAME="720"
720p/index.m3u8
`;

export const hlsDir = path.join(__dirname, "../../static/hls");
