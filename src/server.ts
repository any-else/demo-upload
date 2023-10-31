import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { upload } from "./utils/multer";
import uploadToCloudinary from "./utils/cloudinary";
import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

app.post(
  "/upload-image",
  upload.array("image", 5),
  async (req: Request, res: Response) => {
    try {
      const pictureFiles: any = req.files;

      const result = pictureFiles?.map((picture: any) =>
        uploadToCloudinary(picture as any)
      );

      const imageRespone = await Promise.all(result);

      const imageList: any = imageRespone.reduce((acc: any, item: any) => {
        return acc.concat([item.url]);
      }, []);
      return res.status(201).json({
        imageList: imageList,
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

app.listen(8080, () => {
  console.log(`Server is running on port http://localhost:8080`);
});
