# hls example
- ffmpeg is essential to try this example

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