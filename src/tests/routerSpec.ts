import supertest,{Response} from 'supertest';
//import fs from 'fs/promises';
import { promises as fsPromises } from 'fs';

import fs  from 'fs';
import path from 'path';
import imageResize from '../mainImage/imageResize';
import app from '../server';

const request = supertest(app);

const imageFile = 'palmtunnel';
const imageWidth = Number('200');
const imageHeight= Number('150');
const outputPath = `${path.resolve(
    __dirname,
    `../../images/output/${imageFile}-${imageWidth}-${imageHeight}.jpg`
    )}`;

describe('Test endpoint response', () => {
  it('resizes an image when all correct parameters are set in the url', (done): void => {
    request.get(`/resize?imageFile=${imageFile}&imageHeight=${imageHeight}&imageWidth=${imageWidth}`)
    .expect(200, done);
});

  it('at wrong endpoint', async () => {
    const response = await request.get('/resize');
    expect(response.status).toBe(500);
  });
});

describe('imageResize with sharp', (): void => {
  it('resize an image with name, width and height', async (): Promise<void> => {
      const result: null|string = await imageResize('palmtunnel',Number('200'),Number('150'));
      expect(result).toBeTruthy;
  });

  it('send invalid picture name', async (): Promise<void> => {
    const result: null | string = await imageResize('palmtunnel', Number('aaa'),Number('200'));
    expect(result).toBeNaN;
});

});

describe('Handle an image input', () => { 
    it('resizes an image when proper parameters are set in the url', async () => {
        await request.get(
          `/resize?imageFile=${imageFile}&imageWidth=${imageWidth}&imageHeight=${imageHeight}`
        );
        expect(fs.existsSync(outputPath)).toBeTrue();
      });

      it('when image name dont exist must return error', async () => {
        const response = await request.get(
          `/resize?imageFile=test&imageWidth=${imageWidth}&imageHeight=${imageHeight}`
        );
        expect(response.text).toBe('please insert valid parametre data that you are inserted is wrong');
      });

    it('at negative height', async (): Promise<void> => {
        const response: Response = await request.get(`/resize?imageFile=${imageFile}&imageHeight=-100`);
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
    });

    it('at negative width', async (): Promise<void> => {
        const response: Response = await request.get(`/resize?imageFile=${imageFile}&imageWidth=-100`);
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
    });  

    it('when one of a parameter dont exist must return error', async () => {
        const response = await request.get(
          `/resize?imageFile=${imageFile}&imageWidth=${imageWidth}`
        );
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
      });

      it('when width or height not ba a numbuer must return error', async () => {
        const response = await request.get(
          `/resize?imageFile=${imageFile}&imageWidth=${imageWidth}&imageHeight=test`
        );
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
      });
    it('at width value = 0', async (): Promise<void> => {
        const response: Response = await request.get(`/resize?imageFile=${imageFile}&imageWidth=0`);
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
    });  
    it('at height value = 0', async (): Promise<void> => {
        const response: Response = await request.get(`/resize?imageFile=${imageFile}&imageHeight=0`);
        expect(response.text).toBe('please insert all parameters thier is an image parameter mised');
    });  
  });
  

