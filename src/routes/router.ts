import express from 'express';
import fs from 'fs';
import path from 'path';
import imageResize from '../mainImage/imageResize';
import { checkInputs } from '../mainImage/imageResize';

interface imageProcessing {
  imageFile: string;
  imageWidth: number;
  imageHeight: number;
}

const router = express.Router();

router.get(
  '/resize',
  async (req: express.Request, res: express.Response): Promise<void> => {
    // check if all 3 mandatory parameters are set and width and height are numbers
    if (checkInputs((req.query as unknown) as imageProcessing)) {
      // set each parameter to a variable
      const imageWidth = Number(req.query.imageWidth);
      const imageHeight = Number(req.query.imageHeight);
      const imageFile = req.query.imageFile as string;
      const outputPath = `${path.resolve(
        __dirname,
        `../../images/output/${imageFile}-${imageWidth}-${imageHeight}.jpg`
      )}`;

      if (fs.existsSync(outputPath)) {
        res.sendFile(outputPath);
      } else {
        // if an error
        const resizedImage = await imageResize(
          imageFile,
          imageWidth,
          imageHeight
        );
        if (!String(resizedImage).includes('Error')) {
          res.sendFile(resizedImage);
        } else {
          res
            .status(404)
            .send(
              'please insert valid parametre data that you are inserted is wrong'
            );
        }
      }
    } else {
      res
        .status(500)
        .send('please insert all parameters thier is an image parameter mised');
    }
  }
);

export default router;
