import express from "express";
import video from "./routes/video";
import cors from 'cors'

const app = express();

const options = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/video", video);

app.listen(8080, () => {
  console.log(`[server] running on localhost:${8080} `);
});
