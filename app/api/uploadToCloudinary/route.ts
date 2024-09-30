import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileStream = bufferToStream(Buffer.from(fileBuffer));

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: 'ml_default',
          transformation: [
            { width: 620, height: 620, crop: 'limit', quality: 'auto:low', fetch_format: 'auto' },
            { overlay: 'watermark_sahm_hyt2as', gravity: 'south_east', x: 10, y: 10 },
          ],
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      fileStream.pipe(uploadStream);
    });

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload image', details: error }, { status: 500 });
  }
}
