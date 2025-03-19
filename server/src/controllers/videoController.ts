import { spawn } from "child_process";
import { Request, Response } from "express";
import formidable from "formidable";
import { accessSync, mkdirSync, readdir, statSync, writeFileSync } from "fs";
import path from "path";
import { STATUS_CODE } from "../constants/code";
import {
  fileConst,
  hlsDir,
  MASTER_FORMAT,
  resolutions,
} from "../constants/file";
import { ResolutionModel } from "../models/ResolutionModel";

class VideoController {
  public getList(_: Request, res: Response) {
    readdir(hlsDir, (err, files) => {
      if (err) {
        res
          .status(STATUS_CODE.serverError)
          .json({ msg: "Error reading video folders" });
        return;
      }

      const list = files.filter((file) =>
        statSync(path.join(hlsDir, file)).isDirectory()
      );
      console.log("[video] get list", { list });
      res.status(STATUS_CODE.ok).json(list);
    });
  }

  public async getMaster(req: Request, res: Response) {
    const videoId = req.params.videoId;
    const masterPath = path.join(hlsDir, videoId, "master.m3u8");

    console.log("[video] get master", { masterPath });

    try {
      accessSync(masterPath);
      res.header("Content-Type", "application/vnd.apple.mpegurl");
      res.sendFile(masterPath);
    } catch (err) {
      res.status(STATUS_CODE.clientError).send({ msg: "File doesn't exist" });
    }
  }

  public async getVideo(req: Request, res: Response) {
    const videoId = req.params.videoId;
    const name = req.params.name;
    const m3u8Path = path.join(hlsDir, videoId, name, "index.m3u8");

    console.log("[video] get m3u8", { m3u8Path });

    try {
      accessSync(m3u8Path);
      res.header("Content-Type", "application/vnd.apple.mpegurl");
      res.sendFile(m3u8Path);

      console.log("[video] m3u8");
    } catch (err) {
      res.status(STATUS_CODE.clientError).send({ msg: "File doesn't exist" });
    }
  }

  public async getSegment(req: Request, res: Response) {
    const videoId = req.params.videoId;
    const name = req.params.name;
    const segment = req.params.segment;
    const segmentPath = path.join(hlsDir, videoId, name, segment);

    console.log("[video] get segment", { segmentPath });

    try {
      accessSync(segmentPath);
      res.header("Content-Type", "video/mp2t");
      res.sendFile(segmentPath);
      console.log("[video] segment");
    } catch (err) {
      res.status(STATUS_CODE.clientError).send({ msg: "Segment not found." });
    }
  }

  public upload = async (req: Request, res: Response) => {
    console.log("[upload] video");

    const form = formidable({
      keepExtensions: true,
      multiples: false,
      maxFileSize: fileConst.fileSize,
      filename(_, __, part) {
        const ext = part.originalFilename?.split(".").pop();

        return `${Date.now()}.${ext}`;
      },
    });

    try {
      const [, files] = await form.parse(req);

      if (!files.file) {
        res
          .status(STATUS_CODE.clientError)
          .json({ msg: "Invalid file format." });
        return;
      }

      const file = files.file[0];
      const filePath = file.filepath;
      const outputFolder = path.join(hlsDir, path.parse(filePath).name);

      await this._convertToHLS(filePath, outputFolder);

      res.status(STATUS_CODE.ok).json({ msg: "Upload & conversion complete" });
    } catch (err) {
      console.error("[upload] Conversion error:", err);
      res.status(STATUS_CODE.serverError).json({ msg: `${err}` });
    }
  };

  private _convertToHLS = async (
    inputFilePath: string,
    outputFolder: string
  ) => {
    mkdirSync(outputFolder, { recursive: true });

    const conversionPromises = resolutions.map((resolution) =>
      this._convertSingleBitrate({ ...resolution, inputFilePath, outputFolder })
    );

    try {
      await Promise.all(conversionPromises);

      writeFileSync(path.join(outputFolder, "master.m3u8"), MASTER_FORMAT);
      console.log("[convert] Master M3U8 file created!");
    } catch (error) {
      console.error("[convert] Error in FFmpeg conversion:", error);
    }
  };

  private _convertSingleBitrate = ({
    name,
    width,
    height,
    bitrate,
    audioBitrate,
    inputFilePath,
    outputFolder,
  }: ResolutionModel & { outputFolder: string; inputFilePath: string }) => {
    return new Promise<void>((res, rej) => {
      const resFolder = path.join(outputFolder, name);
      mkdirSync(resFolder, { recursive: true });

      const ffmpegProcess = spawn("ffmpeg", [
        "-i",
        inputFilePath,
        "-preset",
        "ultrafast",
        "-g",
        "100",
        "-sc_threshold",
        "0",
        "-hls_time",
        "10",
        "-hls_list_size",
        "0",
        "-hls_segment_filename",
        path.join(resFolder, "segment_%03d.ts"),
        "-f",
        "hls",
        "-threads",
        "4",
        "-c:v",
        "libx264",
        "-b:v",
        bitrate,
        "-s",
        `${width}x${height}`,
        "-c:a",
        "aac",
        "-b:a",
        audioBitrate,
        path.join(resFolder, "index.m3u8"),
      ]);

      ffmpegProcess.stdout.on("data", (data) =>
        console.log(`[FFmpeg ${name} stdout]: ${data}`)
      );
      ffmpegProcess.stderr.on("data", (data) =>
        console.error(`[FFmpeg ${name} stderr]: ${data}`)
      );

      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          const m3u8Path = `/static/hls/${path.basename(resFolder)}/index.m3u8`;
          console.log("[convert] Success! HLS file:", m3u8Path);
          res();
        } else {
          console.log("[convert] FFmpeg exited with error code:", code);
          rej(new Error(`FFmpeg failed with code ${code}`));
        }
      });
    });
  };
}

export default new VideoController();
