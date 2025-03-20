# HLS(HTTP Live Streaming) example
- FFmpeg is essential in this example

## client
- View library: React
- Languages: TypeScript, HTML, CSS
- State management: TanStack Query
- Bundler: Vite
- Routing: React router dom

### folder structure

#### components
- loading
- switch

#### data
- constants
- sampleData: to use this example, useVideoControllerler should be changed

#### hooks
- useUploadController: uploading video controller
- useVideoController: video player controller

#### models
- DurationModel: video current and total playing time model
- TimelineModel: highlight timeline model

#### routes
- main
- upload: upload video view
- viewer: video player view

#### services
- api: api common setting
- videoApi: video list, video update api

#### utils
- commonUtil
- routeUtil

## server
- Framework: express
- Language: TypeScript
- fluent-ffmpeg: To convert video

### folder structure
#### constants
- code: status code
- file: file size, path, master file

#### controllers
- videoController: uploading, converting video, hls serve controller

#### models
- ResolutionModel: Video quality model

#### routes
- video: video api

---
## Post link
### Intro : https://devmemory.tistory.com/130
### Node server : https://devmemory.tistory.com/131
### React server : https://devmemory.tistory.com/132
### Outro : https://devmemory.tistory.com/133

![test](https://github.com/user-attachments/assets/0dc372b1-0e1a-4642-b7df-57d5d4207509)
