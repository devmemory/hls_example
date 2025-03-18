import { useMutation } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadVideo } from "src/services/videoApi";

const useUploadController = () => {
  const ref = useRef<HTMLInputElement>(null);

  const [isIn, setIsIn] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [percent, setPercent] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess(result) {
      toast.success(result);
    },
    onError(error) {
      toast.error(error.message);
      setPercent(0)
      ref.current!.value = ""
    },
  });

  const onDropFiles = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const fileList = e.dataTransfer.files;
    _validateFile(fileList);

    onDragLeave();
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const file = _validateFile(files);

    console.log({ file });

    if (file) {
      try {
        mutation.mutate({ file, onUploadProgress });
      } catch (e) {
        ref.current!.value = "";
        setErrMsg(`${e}`);
      }
    }
  };

  const onUploadProgress = (e: AxiosProgressEvent) => {
    const uploadPercent = Math.round((e.loaded * 100) / (e.total ?? 1));

    if (uploadPercent < 100) {
      setPercent(uploadPercent);
    } else {
      setTimeout(() => {
        ref.current!.value = "";
        setPercent(0);
      }, 3000);
    }
  };

  const _validateFile = (list: FileList | null) => {
    if (list === null) {
      setErrMsg("File doesn't exist");
      return;
    }

    if (list.length > 1) {
      setErrMsg("Please drop only one zip file");
      return;
    }

    const file = list[0];

    if (!file.type.startsWith("video/")) {
      setErrMsg("Only video files are allowed.");
      ref.current!.value = "";

      return;
    } else {
      setErrMsg(null);
    }

    return file;
  };

  const onOpenExplorer = () => {
    ref.current?.click();
  };

  const onClickPrevent = (e: MouseEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: MouseEvent) => {
    onClickPrevent(e);
    if (!isIn) {
      setIsIn(true);
    }
  };

  const onDragLeave = () => {
    if (isIn) {
      setIsIn(false);
    }
  };

  return {
    ref,
    onDropFiles,
    onChangeFile,
    onOpenExplorer,
    onClickPrevent,
    onDragEnter,
    onDragLeave,
    isIn,
    errMsg,
    percent,
  };
};

export default useUploadController;
