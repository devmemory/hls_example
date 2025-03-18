import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const MainPage = lazy(() => import("src/routes/main"));
const UploadPage = lazy(() => import("src/routes/upload"));
const ViewerPage = lazy(() => import("src/routes/Viewer"));

export const routeName = {
  main: "/",
  upload: "/upload",
  viewer: "/viewer",
} as const;

export const router = createBrowserRouter([
  { path: routeName.main, element: <MainPage /> },
  { path: routeName.upload, element: <UploadPage /> },
  { path: routeName.viewer, element: <ViewerPage /> },
]);
