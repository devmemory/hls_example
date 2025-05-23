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

#### hooks
- upload/useUploadController: uploading video controller
- viewer/useVideoController: video player controller

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

#### styles
- toast style

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

### upload
![core](https://github.com/user-attachments/assets/19f54d56-722f-4707-ae76-1cae1fd4a38b)

### upload & play
![test](https://github.com/user-attachments/assets/0dc372b1-0e1a-4642-b7df-57d5d4207509)
