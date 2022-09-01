import path from 'path';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import { imageProcessing } from './interface';
import fs from 'fs';

// Checks if items in an array (items) are all included in another array (arr)
const itemsInArray = (arr: unknown[], items: unknown[]): boolean => {
  return arr.every((item) => items.indexOf(item) !== -1);
};

// Checks if the items in an array are all numbers
const isArrOfNumbers = (arr: unknown[]): boolean => {
  return arr.every((item) => Number.isInteger(item));
};

// Checks if all 3 parameters are being set in the URL
const checkInputs = (query: imageProcessing): boolean => {
  const params: string[] = ['imageFile', 'imageWidth', 'imageHeight'];
  const paramsKeys: string[] = Object.keys(query);
  const widthAndHeight: number[] = [
    Number(query.imageWidth),
    Number(query.imageHeight),
  ];

  // check if all the required parameters (params) are included in the query (paramsKeys) and if the width and height are both numbers
  return itemsInArray(params, paramsKeys) && isArrOfNumbers(widthAndHeight);
};

// Resizes the image to the width and height set in the parameters
const imageResize = async (
  imageFile:string,
  imageWidth:number,
  imageHeight:number,
): Promise<string> => {
  const inputFile = `${path.resolve(
    __dirname,
    `../../images/input/${imageFile}.jpg`
  )}`;
  const outputFile = `${path.resolve(
    __dirname,
    '../../images/output'
  )}`;
  const outputImage = `${path.resolve(
    __dirname,
    `../../images/output/${imageFile}-${imageWidth}-${imageHeight}.jpg`
  )}`;

  if (!fs.existsSync(outputFile)) {
    await fsPromises.mkdir(outputFile);
  }

  try {
    // await for sharp to process the image, if it succeds, returns the imageOutput
    await sharp(inputFile).resize(imageWidth, imageHeight).toFile(outputImage);
    return outputImage;
  } catch (error) {
    // if not, returns the error
    return error;
  }
};

export default imageResize;
export { checkInputs };
