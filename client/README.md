## How to test
- yarn install : download node modules
- yarn dev : start dev server(http://localhost:3000)
- in case you want to test on nginx, you can build(yarn build) and then set HTML location

## Development environment
- View library : React
- Languages : Typescript, HTML, CSS
- Bundler : Vite
- State management : Basic hooks
- Styling : CSS module
- additional library
  - react-router-dom : url router
  - three : to try rotating video

## url
- / : main screen without rotating video
- /test : video rotating test

## Folder structure
### public
- assets/images : svg images for buttons

### src
- index.tsx : entry point
- index.css : global style, reset css

#### components
- Control : Video player control
- Loading : Loading indicator
- Overlay : Video status overlay(play, stop, record)
- Switch : Toggle switch component
- VideoList : Video list drawer

#### data
- constants : constants data
- sampleData : video links

#### hooks
- useRotateVideo : Rotating video test(not finished)
- useVideoController : Video control business logic

#### models
- DurationModel : video current, total duration
- TimelineModel : save time model

#### routes
- Main : main page
- Test : test page

#### utils
- cameraUtil : rotate camera util
- commonUtil : utils
- routeUtil : route util

## z-index
- loading : 2
- bottom control : 3
- video list background : 4