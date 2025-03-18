import { Router } from "express";
import videoController from "../controllers/videoController";

const router = Router();

router.get("/list", videoController.getList);
router.get("/:videoId/master.m3u8", videoController.getMaster)
router.get("/:videoId/:name/index.m3u8", videoController.getVideo);
router.get("/:videoId/:name/:segment", videoController.getSegment);
router.post("/upload", videoController.upload);

export default router;
